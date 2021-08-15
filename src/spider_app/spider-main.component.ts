import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './spider-main.component.html',
  styleUrls: ['./spider-main.component.scss'],
})
export class SpiderMainComponent {
  title = 'Spider-ngvv';
  constructor(){
    document.title=this.title
  }
}
