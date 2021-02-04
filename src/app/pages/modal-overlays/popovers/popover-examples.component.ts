import { Component } from '@angular/core';

@Component({
  selector: 'ngx-popover-tabs',
  template: `
    <dy-tabset>
      <dy-tab tabTitle="What's up?">
        <div class="p-4">
          Such a wonderful day!
        </div>
      </dy-tab>
      <dy-tab tabTitle="Second Tab">
        <div class="p-4">
          Indeed!
        </div>
      </dy-tab>
    </dy-tabset>
  `,
})
export class NgxPopoverTabsComponent {
}

@Component({
  selector: 'ngx-popover-form',
  template: `
    <div class="p-4">
      <form>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Recipients">
        </div>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Subject">
        </div>
        <div class="form-group">
          <textarea class="form-control" placeholder="Message"></textarea>
        </div>
        <button matRipple type="submit" class="btn btn-primary w-100">Send</button>
      </form>
    </div>
  `,
})
export class NgxPopoverFormComponent {
}

@Component({
  selector: 'ngx-popover-card',
  template: `
    <dy-card class="popover-card">
      <dy-card-header status="warning">
        Hello!
      </dy-card-header>
      <dy-card-body>
        Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,
        there live the blind texts.
        Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.
      </dy-card-body>
    </dy-card>
  `,
  styles: [`
    dy-card {
      margin: 0;
      max-width: 20rem;
    }
  `],
})
export class NgxPopoverCardComponent {
}
