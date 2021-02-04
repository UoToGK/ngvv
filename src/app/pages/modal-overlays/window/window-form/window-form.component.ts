import { Component } from '@angular/core';
import { DyWindowRef } from 'src/framework/theme/public_api';

@Component({
  template: `
    <form class="form">
      <label for="subject">Subject:</label>
      <input dyInput id="subject" type="text">

      <label class="text-label" for="text">Text:</label>
      <textarea dyInput id="text"></textarea>
    </form>
  `,
  styleUrls: ['window-form.component.scss'],
})
export class WindowFormComponent {
  constructor(public windowRef: DyWindowRef) {}

  close() {
    this.windowRef.close();
  }
}
