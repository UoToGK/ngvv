import { Component } from '@angular/core';

import './ckeditor.loader';
import 'ckeditor';

@Component({
  selector: 'ngx-ckeditor',
  template: `
    <dy-card>
      <dy-card-header>
        CKEditor
      </dy-card-header>
      <dy-card-body>
        <ckeditor [config]="{ extraPlugins: 'divarea', height: '320' }"></ckeditor>
      </dy-card-body>
    </dy-card>
  `,
})
export class CKEditorComponent {
}
