

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { of as observableOf, Subject } from 'rxjs';
import { filter, delay, takeUntil } from 'rxjs/operators';

import { DySearchService } from './search.service';
import { DyThemeService } from '../../services/theme.service';
import { DyOverlayService } from '../cdk/overlay/overlay-service';
import { DyOverlayRef, DyPortalDirective } from '../cdk/overlay/mapping';

/**
 * search-field-component is used under the hood by dy-search component
 * can't be used itself
 */
@Component({
  selector: 'dy-search-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    'styles/search.component.modal-zoomin.scss',
    'styles/search.component.layout-rotate.scss',
    'styles/search.component.modal-move.scss',
    'styles/search.component.curtain.scss',
    'styles/search.component.column-curtain.scss',
    'styles/search.component.modal-drop.scss',
    'styles/search.component.modal-half.scss',
  ],
  template: `
    <div class="search" (keyup.esc)="emitClose()">
      <button (click)="emitClose()" dyButton ghost class="close-button">
        <dy-icon icon="close-outline" pack="nebular-essentials"></dy-icon>
      </button>
      <div class="form-wrapper">
        <form class="form" (keyup.enter)="submitSearch(searchInput.value)">
          <div class="form-content">
            <input class="search-input"
                   #searchInput
                   (input)="emitSearchInput(searchInput.value)"
                   autocomplete="off"
                   [attr.placeholder]="placeholder"
                   tabindex="-1"
                   (blur)="focusInput()"/>
          </div>
          <span class="info">{{ hint }}</span>
        </form>
      </div>
    </div>
  `,
})
export class DySearchFieldComponent implements OnChanges, AfterViewInit {

  static readonly TYPE_MODAL_ZOOMIN = 'modal-zoomin';
  static readonly TYPE_ROTATE_LAYOUT = 'rotate-layout';
  static readonly TYPE_MODAL_MOVE = 'modal-move';
  static readonly TYPE_CURTAIN = 'curtain';
  static readonly TYPE_COLUMN_CURTAIN = 'column-curtain';
  static readonly TYPE_MODAL_DROP = 'modal-drop';
  static readonly TYPE_MODAL_HALF = 'modal-half';

  @Input() type: string;
  @Input() placeholder: string;
  @Input() hint: string;
  @Input() show = false;

  @Output() close = new EventEmitter();
  @Output() search = new EventEmitter();
  @Output() searchInput = new EventEmitter();

  @ViewChild('searchInput') inputElement: ElementRef<HTMLInputElement>;

  @HostBinding('class.show')
  get showClass() {
    return this.show;
  }

  @HostBinding('class.modal-zoomin')
  get modalZoomin() {
    return this.type === DySearchFieldComponent.TYPE_MODAL_ZOOMIN;
  }

  @HostBinding('class.rotate-layout')
  get rotateLayout() {
    return this.type === DySearchFieldComponent.TYPE_ROTATE_LAYOUT;
  }

  @HostBinding('class.modal-move')
  get modalMove() {
    return this.type === DySearchFieldComponent.TYPE_MODAL_MOVE;
  }

  @HostBinding('class.curtain')
  get curtain() {
    return this.type === DySearchFieldComponent.TYPE_CURTAIN;
  }

  @HostBinding('class.column-curtain')
  get columnCurtain() {
    return this.type === DySearchFieldComponent.TYPE_COLUMN_CURTAIN;
  }

  @HostBinding('class.modal-drop')
  get modalDrop() {
    return this.type === DySearchFieldComponent.TYPE_MODAL_DROP;
  }

  @HostBinding('class.modal-half')
  get modalHalf() {
    return this.type === DySearchFieldComponent.TYPE_MODAL_HALF;
  }

  ngOnChanges({ show }: SimpleChanges) {
    const becameHidden = !show.isFirstChange() && show.currentValue === false;
    if (becameHidden && this.inputElement) {
      this.inputElement.nativeElement.value = '';
    }

    this.focusInput();
  }

  ngAfterViewInit() {
    this.focusInput();
  }

  emitClose() {
    this.close.emit();
  }

  submitSearch(term) {
    if (term) {
      this.search.emit(term);
    }
  }

  emitSearchInput(term: string) {
    this.searchInput.emit(term);
  }

  focusInput() {
    if (this.show && this.inputElement) {
      this.inputElement.nativeElement.focus();
    }
  }
}

export type DySearchType = 'modal-zoomin' | 'rotate-layout' | 'modal-move' |
  'curtain' | 'column-curtain' | 'modal-drop' | 'modal-half';

/**
 * Beautiful full-page search control.
 *
 * @stacked-example(Showcase, search/search-showcase.component)
 *
 * Basic setup:
 *
 * ```ts
 *  <dy-search type="rotate-layout"></dy-search>
 * ```
 * ### Installation
 *
 * Import `DySearchModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DySearchModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * Several animation types are available:
 * modal-zoomin, rotate-layout, modal-move, curtain, column-curtain, modal-drop, modal-half
 *
 * It is also possible to handle search event using `DySearchService`:
 *
 * @stacked-example(Search Event, search/search-event.component)
 *
 * @styles
 *
 * search-background-color:
 * search-divider-color:
 * search-divider-style:
 * search-divider-width:
 * search-extra-background-color:
 * search-text-color:
 * search-text-font-family:
 * search-text-font-size:
 * search-text-font-weight:
 * search-text-line-height:
 * search-placeholder-text-color:
 * search-info-text-color:
 * search-info-text-font-family:
 * search-info-text-font-size:
 * search-info-text-font-weight:
 * search-info-text-line-height:
 */
@Component({
  selector: 'dy-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['styles/search.component.scss'],
  template: `
    <button #searchButton class="start-search" (click)="emitActivate()" dyButton ghost>
      <dy-icon icon="search-outline" pack="nebular-essentials"></dy-icon>
    </button>
    <dy-search-field
      *dyPortal
      [show]="showSearchField"
      [type]="type"
      [placeholder]="placeholder"
      [hint]="hint"
      (search)="search($event)"
      (searchInput)="emitInput($event)"
      (close)="emitDeactivate()">
    </dy-search-field>
  `,
})
export class DySearchComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  private overlayRef: DyOverlayRef;
  showSearchField = false;

  /**
   * Tags a search with some ID, can be later used in the search service
   * to determine which search component triggered the action, if multiple searches exist on the page.
   *
   * @type {string}
   */
  @Input() tag: string;

  /**
   * Search input placeholder
   * @type {string}
   */
  @Input() placeholder: string = 'Search...';

  /**
   * Hint showing under the input field to improve user experience
   *
   * @type {string}
   */
  @Input() hint: string = 'Hit enter to search';

  /**
   * Search design type, available types are
   * modal-zoomin, rotate-layout, modal-move, curtain, column-curtain, modal-drop, modal-half
   * @type {string}
   */
  @Input() type: DySearchType;

  @ViewChild(DyPortalDirective) searchFieldPortal: DyPortalDirective;
  @ViewChild('searchButton', { read: ElementRef }) searchButton: ElementRef<HTMLElement>;

  constructor(
    private searchService: DySearchService,
    private themeService: DyThemeService,
    private router: Router,
    private overlayService: DyOverlayService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.hideSearch());

    this.searchService.onSearchActivate()
      .pipe(
        filter(data => !this.tag || data.tag === this.tag),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.openSearch());

    this.searchService.onSearchDeactivate()
      .pipe(
        filter(data => !this.tag || data.tag === this.tag),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.hideSearch());
  }

  ngOnDestroy() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.removeLayoutClasses();
      this.overlayRef.detach();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  openSearch() {
    if (!this.overlayRef) {
      this.overlayRef = this.overlayService.create();
      this.overlayRef.attach(this.searchFieldPortal);
    }

    this.themeService.appendLayoutClass(this.type);
    observableOf(null).pipe(delay(0)).subscribe(() => {
      this.themeService.appendLayoutClass('with-search');
      this.showSearchField = true;
      this.changeDetector.detectChanges();
    });
  }

  hideSearch() {
    this.removeLayoutClasses();
    this.showSearchField = false;
    this.changeDetector.detectChanges();
    this.searchButton.nativeElement.focus();
  }

  search(term) {
    this.searchService.submitSearch(term, this.tag);
    this.hideSearch();
  }

  emitInput(term: string) {
    this.searchService.searchInput(term, this.tag);
  }

  emitActivate() {
    this.searchService.activateSearch(this.type, this.tag);
  }

  emitDeactivate() {
    this.searchService.deactivateSearch(this.type, this.tag);
  }

  private removeLayoutClasses() {
    this.themeService.removeLayoutClass('with-search');
    observableOf(null).pipe(delay(500)).subscribe(() => {
      this.themeService.removeLayoutClass(this.type);
    });
  }
}
