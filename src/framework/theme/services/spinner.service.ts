
import { Injectable, Inject } from '@angular/core';
import { DY_DOCUMENT } from '../theme.options';

/**
 * Service to control the global page spinner.
 */
@Injectable()
export class DySpinnerService {

  private loaders: Promise<any>[] = [];
  private selector: string = 'dy-global-spinner';

  constructor(@Inject(DY_DOCUMENT) private document) {}

  /**
   * Appends new loader to the list of loader to be completed before
   * spinner will be hidden
   * @param method Promise<any>
   */
  registerLoader(method: Promise<any>): void {
    this.loaders.push(method);
  }

  /**
   * Clears the list of loader
   */
  clear(): void {
    this.loaders = [];
  }

  /**
   * Start the loader process, show spinnder and execute loaders
   */
  load(): void {
    this.showSpinner();
    this.executeAll();
  }

  private executeAll(done = () => {}): void {
    Promise.all(this.loaders).then((values) => {
      this.hideSpinner();
      done.call(null, values);
    })
      .catch((error) => {
        // TODO: Promise.reject
        console.error(error);
      });
  }

  // TODO is there any better way of doing this?
  private showSpinner(): void {
    const el = this.getSpinnerElement();
    if (el) {
      el.style['display'] = 'block';
    }
  }

  private hideSpinner(): void {
    const el = this.getSpinnerElement();
    if (el) {
      el.style['display'] = 'none';
    }
  }

  private getSpinnerElement() {
    return this.document.getElementById(this.selector);
  }
}
