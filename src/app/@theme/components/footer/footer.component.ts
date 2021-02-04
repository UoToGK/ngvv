import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created with ♥ by <b><a href=""
                              target="_blank">嘉美高科</a></b> 2021.
      Made with
      <b>
        <a href="" target="_blank">
        DyThemes.
        </a>
      </b>
    </span>
    <div class="socials">
      <!-- <i class="eva eva-5x eva-github-outline"></i> -->
      <a href="https://github.com" target="_blank" class="ion ion-social-github"></a>
      <a href="https://www.microsoft.com/zh-cn/" target="_blank" class="ion ion-social-windows"></a>
      <a href="https://www.linux.org/" target="_blank" class="ion ion-social-tux"></a>
      <a href="https://www.xbox.com/" target="_blank" class="ion ion-xbox"></a>
    </div>
  `,
})
export class FooterComponent {
}
