import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dy-calendar-actions',
  template: `
    <button
      dyButton
      ghost
      status="primary"
      size="small"
      (click)="setCurrentTime.emit()">
      {{ currentTimeText }}</button>
    <button
      dyButton
      status="primary"
      size="small"
      (click)="saveValue.emit()">
      {{ applyText }}</button>
  `,
  styleUrls: ['./calendar-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarActionsComponent {
  @Input() set applyButtonText(value: string) {
    if (value) {
      this._applyButtonText = value;
    }
  };
  get applyText() {
    return this._applyButtonText;
  };
  protected _applyButtonText = 'ok';

  @Input() set currentTimeButtonText(value: string) {
    if (value) {
      this._currentTimeButtonText = value;
    }
  }
  get currentTimeText() {
    return this._currentTimeButtonText;
  };
  _currentTimeButtonText = 'now';

  @Output() setCurrentTime: EventEmitter<void> = new EventEmitter();
  @Output() saveValue: EventEmitter<void> = new EventEmitter();
}
