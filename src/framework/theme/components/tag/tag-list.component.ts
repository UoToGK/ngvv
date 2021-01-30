

import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
} from '@angular/core';
import { merge, Subject } from 'rxjs';
import { filter, finalize, map, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { DyLayoutDirection, DyLayoutDirectionService } from '../../services/direction.service';
import { DyStatusService } from '../../services/status.service';
import { DyFocusMonitor } from '../cdk/a11y/a11y.module';
import {
  DyActiveDescendantKeyManager,
  DyActiveDescendantKeyManagerFactoryService,
} from '../cdk/a11y/descendant-key-manager';
import { BACKSPACE, DELETE, SPACE } from '../cdk/keycodes/keycodes';
import { convertToBoolProperty, DyBooleanInput } from '../helpers';
import { DyComponentSize } from '../component-size';
import { DyAutocompleteDirective } from '../autocomplete/autocomplete.directive';
import { DyTagComponent } from './tag.component';
import { DyTagInputDirective } from './tag-input.directive';

/**
 *
 * `dy-tag-list` component displays a list of `dy-tag` components.
 *
 * @stacked-example(Tag List Showcase, tag/tag-showcase.component)
 *
 * @styles
 *
 * tag-list-tiny-tag-offset:
 * tag-list-small-tag-offset:
 * tag-list-medium-tag-offset:
 * tag-list-large-tag-offset:
 * tag-list-giant-tag-offset:
 * tag-list-with-input-tiny-padding:
 * tag-list-with-input-small-padding:
 * tag-list-with-input-medium-padding:
 * tag-list-with-input-large-padding:
 * tag-list-with-input-giant-padding:
 * tag-list-with-input-rectangle-border-radius:
 * tag-list-with-input-semi-round-border-radius:
 * tag-list-with-input-round-border-radius:
 */
@Component({
  selector: 'dy-tag-list',
  template: `
    <div class="dy-tag-list-tags-wrapper">
      <ng-content select="dy-tag, input[dyTagInput]"></ng-content>
    </div>
  `,
  exportAs: 'dyTagList',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyTagListComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {

  protected readonly destroy$: Subject<void> = new Subject<void>();
  protected readonly keyDown$: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
  protected readonly tagClick$: Subject<DyTagComponent> = new Subject<DyTagComponent>();
  protected focused: boolean = false;
  protected keyManager: DyActiveDescendantKeyManager<DyTagComponent>;

  @ContentChildren(DyTagComponent) tags: QueryList<DyTagComponent>;
  @ContentChild(DyTagInputDirective) tagInput: DyTagInputDirective;
  @ContentChild(DyAutocompleteDirective) autocompleteDirective: DyAutocompleteDirective<any>;

  /**
   * Controls tags offset.
   */
  @Input()
  size: DyComponentSize = 'medium';

  @Input()
  @HostBinding('attr.tabindex')
  tabIndex: number = 0;

  @Input()
  @HostBinding('attr.role')
  role: string = 'listbox';

  @Input()
  @HostBinding('attr.aria-multiselectable')
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    this._multiple = convertToBoolProperty(value);
  }
  protected _multiple: boolean = false;
  static ngAcceptInputType_multiple: DyBooleanInput;

  @HostBinding('attr.aria-activedescendant')
  activeTagId: string | null = null;

  /**
   * Emits when tag need to be removed (whether because of click on the remove button
   * or when `delete` or `backspace` key pressed).
   */
  @Output() readonly tagRemove: EventEmitter<DyTagComponent> = new EventEmitter<DyTagComponent>();

  @HostBinding('class.dy-tag-list-with-input')
  get _hasInput(): boolean {
    return !!this.tagInput;
  }

  @HostBinding('class.focus')
  get _isFocused(): boolean {
    return this.focused;
  }

  @HostBinding('class.input-full-width')
  get _isFullWidth(): boolean {
    return !!this.tagInput?.fullWidth;
  }

  @HostBinding('class')
  get _inputClasses(): string[] {
    if (this._hasInput) {
      return [
        `shape-${this.tagInput.shape}`,
        `size-${this.tagInput.fieldSize}`,
        this.statusService.getStatusClass(this.tagInput.status),
      ];
    }

    return [`size-${this.size}`];
  }

  @HostListener('keydown', ['$event'])
  _onKeydown(event: KeyboardEvent): void {
    this.keyDown$.next(event);
  }

  @HostListener('click', ['$event'])
  _onClick({ target }: MouseEvent): void {
    const clickedTag = this.tags.find((tag: DyTagComponent) => tag._hostElement.nativeElement === target);
    if (clickedTag) {
      this.tagClick$.next(clickedTag);
    }
  }

  constructor(
    protected hostElement: ElementRef<HTMLElement>,
    protected cd: ChangeDetectorRef,
    protected renderer: Renderer2,
    protected zone: NgZone,
    protected focusMonitor: DyFocusMonitor,
    protected activeDescendantKeyManagerFactory: DyActiveDescendantKeyManagerFactoryService<DyTagComponent>,
    protected directionService: DyLayoutDirectionService,
    protected statusService: DyStatusService,
  ) {}

  ngOnInit() {
    this.focusMonitor.monitor(this.hostElement, true)
      .pipe(
        map(origin => !!origin),
        finalize(() => this.focusMonitor.stopMonitoring(this.hostElement)),
        takeUntil(this.destroy$),
      )
      .subscribe((isFocused: boolean) => this.onFocusChange(isFocused));
  }

  ngAfterContentInit() {
    this.initKeyManager();
    this.setAutocompleteCustomHost();
  }

  ngAfterViewInit() {
    this.listenToLayoutDirectionChange();
    this.listenListKeyDown();
    this.listenInputKeyDown();
    this.listenTagClick();
    this.listenTagRemove();
    this.listenTagDestroy();
    this.listenActiveTagChange();
    this.listenNoTags();

    // TODO: #2254
    this.zone.runOutsideAngular(() => setTimeout(() => {
      this.renderer.addClass(this.hostElement.nativeElement, 'dy-transition');
    }));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  protected initKeyManager(): void {
    this.keyManager = this.activeDescendantKeyManagerFactory
      .create(this.tags)
      .withHorizontalOrientation(this.directionService.getDirection())
      .withWrap();
  }

  protected listenToLayoutDirectionChange(): void {
    this.directionService.onDirectionChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((direction: DyLayoutDirection) => this.keyManager.withHorizontalOrientation(direction));
  }

  protected listenListKeyDown(): void {
    const tagListKeyDown$ = this.keyDown$
      .pipe(filter(({ target }: KeyboardEvent) => target === this.hostElement.nativeElement));
    const activeTagKeyDown$ = tagListKeyDown$
      .pipe(filter(() => !!this.keyManager.activeItem));

    tagListKeyDown$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: KeyboardEvent) => this.keyManager.onKeydown(event));

    activeTagKeyDown$
      .pipe(
        filter(({ keyCode }: KeyboardEvent) => keyCode === SPACE),
        takeUntil(this.destroy$),
      )
      .subscribe((event: KeyboardEvent) => {
        this.toggleTag(this.keyManager.activeItem);
        // Prevents page scroll.
        event.preventDefault();
      });

    activeTagKeyDown$
      .pipe(
        filter(({ keyCode }: KeyboardEvent) => this.isBackspaceOrDelete(keyCode)),
        map(() => this.keyManager.activeItem),
        takeUntil(this.destroy$),
      )
      .subscribe((tagToRemove: DyTagComponent) => tagToRemove._remove());
  }

  protected listenInputKeyDown(): void {
    const inputKeyDown$ = this.keyDown$
      .pipe(filter(({ target }: KeyboardEvent) => target === this.tagInput?._hostElement.nativeElement));

    inputKeyDown$
      .pipe(
        filter(({ keyCode }: KeyboardEvent) => {
          return this.tagInput._value === '' && this.isBackspaceOrDelete(keyCode) && this.tags.length > 0;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.hostElement.nativeElement.focus();
        this.keyManager.setLastItemActive();
        this.cd.markForCheck();
      });
  }

  protected listenTagClick(): void {
    this.tagClick$
      .pipe(takeUntil(this.destroy$))
      .subscribe((clickedTag: DyTagComponent) => {
        this.toggleTag(clickedTag);
        this.keyManager.setActiveItem(clickedTag);
      });
  }

  protected listenTagRemove(): void {
    this.tags.changes
      .pipe(
        startWith(this.tags),
        switchMap((tags: QueryList<DyTagComponent>) => merge(...tags.map((tag: DyTagComponent) => tag.remove))),
        takeUntil(this.destroy$),
      )
      .subscribe((tagToRemove: DyTagComponent) => this.tagRemove.emit(tagToRemove));
  }

  protected listenTagDestroy(): void {
    this.tags.changes
      .pipe(
        startWith(this.tags),
        switchMap((tags: QueryList<DyTagComponent>) => merge(...tags.map((tag: DyTagComponent) => tag.destroy$))),
        filter((destroyedTag: DyTagComponent) => destroyedTag === this.keyManager.activeItem),
        map((destroyedTag: DyTagComponent) => destroyedTag === this.tags.last),
        takeUntil(this.destroy$),
      )
      .subscribe((isLastTagDestroyed: boolean) => {
        if (isLastTagDestroyed) {
          this.keyManager.setPreviousItemActive();
        } else {
          this.keyManager.setNextItemActive();
        }
      });
  }

  protected listenNoTags(): void {
    this.tags.changes
      .pipe(
        startWith(this.tags),
        filter((tags: QueryList<DyTagComponent>) => tags.length === 0),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.focusInput());
  }

  protected listenActiveTagChange(): void {
    this.keyManager.change
      .pipe(
        map(() => this.keyManager.activeItem?._id),
        takeUntil(this.destroy$),
      )
      .subscribe((activeTagId: string | null) => {
        this.activeTagId = activeTagId;
        this.cd.markForCheck();
      });
  }

  protected onFocusChange(isFocused: boolean): void {
    this.focused = isFocused;
    this.cd.markForCheck();

    if (!isFocused || this.tagInput?.focused$.value) {
      this.keyManager.setActiveItem(-1);
      return;
    }

    // Focus input when focusing tag list without tags. Otherwise select first tag.
    if (this.tags.length === 0 && this._hasInput) {
      this.focusInput();
    } else {
      this.keyManager.setFirstItemActive();
    }
  }

  protected isBackspaceOrDelete(keyCode: number): boolean {
    return keyCode === BACKSPACE || keyCode === DELETE;
  }

  protected setAutocompleteCustomHost(): void {
    if (this.autocompleteDirective) {
      this.autocompleteDirective.customOverlayHost = this.hostElement;
    }
  }

  protected toggleTag(tagToToggle: DyTagComponent): void {
    tagToToggle._toggleSelection();

    if (tagToToggle.selected && !this.multiple) {
      this.tags.forEach((tag: DyTagComponent) => {
        if (tag !== tagToToggle) {
          tag.selected = false;
        }
      });
    }
  }

  protected focusInput(): void {
    if (this._hasInput) {
      this.tagInput._hostElement.nativeElement.focus();
    }
  }
}
