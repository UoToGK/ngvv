import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { SpiderMainModule } from "./spider_app/spider-main.module";
import { environment } from "./environments/environment";

import { hmrBootstrap } from "./hmr";

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(SpiderMainModule);

if (environment.hmr) {
  // console.log(module['hot'])
  if (module["hot"]) {
    hmrBootstrap(module, bootstrap);
  } else {
    console.error("HMR is not enabled for webpack-dev-server!");
    // console.log('Are you using the --hmr flag for ng serve?');
  }
} else {
  bootstrap();
}
