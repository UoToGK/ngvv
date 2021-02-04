import { Component } from '@angular/core';
import {
  DyComponentStatus,
  DyGlobalLogicalPosition,
  DyGlobalPhysicalPosition,
  DyGlobalPosition,
  DyToastrService,
  DyToastrConfig,
} from 'src/framework/theme/public_api';

@Component({
  selector: 'ngx-toastr',
  styleUrls: ['./toastr.component.scss'],
  templateUrl: './toastr.component.html',
})
export class ToastrComponent {
  constructor(private toastrService: DyToastrService) {}

  config: DyToastrConfig;

  index = 1;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: DyGlobalPosition = DyGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: DyComponentStatus = 'primary';

  title = 'HI there!';
  content = `I'm cool toaster!`;

  types: DyComponentStatus[] = [
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ];
  positions: string[] = [
    DyGlobalPhysicalPosition.TOP_RIGHT,
    DyGlobalPhysicalPosition.TOP_LEFT,
    DyGlobalPhysicalPosition.BOTTOM_LEFT,
    DyGlobalPhysicalPosition.BOTTOM_RIGHT,
    DyGlobalLogicalPosition.TOP_END,
    DyGlobalLogicalPosition.TOP_START,
    DyGlobalLogicalPosition.BOTTOM_END,
    DyGlobalLogicalPosition.BOTTOM_START,
  ];

  quotes = [
    { title: null, body: 'We rock at Angular' },
    { title: null, body: 'Titles are not always needed' },
    { title: null, body: 'Toastr rock!' },
  ];

  makeToast() {
    this.showToast(this.status, this.title, this.content);
  }

  openRandomToast () {
    const typeIndex = Math.floor(Math.random() * this.types.length);
    const quoteIndex = Math.floor(Math.random() * this.quotes.length);
    const type = this.types[typeIndex];
    const quote = this.quotes[quoteIndex];

    this.showToast(type, quote.title, quote.body);
  }

  private showToast(type: DyComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };
    const titleContent = title ? `. ${title}` : '';

    this.index += 1;
    this.toastrService.show(
      body,
      `Toast ${this.index}${titleContent}`,
      config);
  }
}
