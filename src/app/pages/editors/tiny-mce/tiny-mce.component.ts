import { Component } from '@angular/core';

@Component({
  selector: 'ngx-tiny-mce-page',
  template: `
    <dy-card>
      <dy-card-header>
        Tiny MCE
      </dy-card-header>
      <dy-card-body>
        <ngx-tiny-mce></ngx-tiny-mce>
      </dy-card-body>
    </dy-card>
  `,
})
export class TinyMCEComponent {
}
