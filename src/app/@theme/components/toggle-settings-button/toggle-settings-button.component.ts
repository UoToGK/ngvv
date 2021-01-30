import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { DySidebarService } from 'src/framework/theme/public_api';
import { StateService } from '../../../@core/utils';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-toggle-settings-button',
  styleUrls: ['./toggle-settings-button.component.scss'],
  template: `
    <button dyButton appearance="outline" class="toggle-settings" (click)="toggleSettings()">
      <dy-icon class="icon" [class.icon-pulse]="enablePulse" icon="settings-2-outline" pack="eva"></dy-icon>
    </button>
  `,
})
export class ToggleSettingsButtonComponent implements OnInit, OnDestroy {

  protected destroy$ = new Subject<void>();

  enablePulse = true;

  @HostBinding('class.position-start') positionStart = false;
  @HostBinding('class.position-end') positionEnd = false;
  @HostBinding('class.expanded') expanded = false;

  constructor(
    protected sidebarService: DySidebarService,
    protected stateService: StateService,
  ) {}

  ngOnInit() {
    this.stateService.onSidebarState()
      .pipe(
        map(sidebar => sidebar.id !== 'end'),
        takeUntil(this.destroy$),
      )
      .subscribe((isSettingsSidebarEnd: boolean) => {
        this.positionEnd = isSettingsSidebarEnd;
        this.positionStart = !isSettingsSidebarEnd;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSettings() {
    this.sidebarService.toggle(false, 'settings-sidebar');
    this.expanded = !this.expanded;
    this.enablePulse = false;
  }
}
