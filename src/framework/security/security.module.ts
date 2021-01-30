import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DY_SECURITY_OPTIONS_TOKEN, DyAclOptions } from './security.options';
import { DyAclService } from './services/acl.service';
import { DyAccessChecker } from './services/access-checker.service';
import { DyIsGrantedDirective } from './directives/is-granted.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DyIsGrantedDirective,
  ],
  exports: [
    DyIsGrantedDirective,
  ],
})
export class DySecurityModule {
  static forRoot(dySecurityOptions?: DyAclOptions): ModuleWithProviders<DySecurityModule> {
    return {
      ngModule: DySecurityModule,
      providers: [
        { provide: DY_SECURITY_OPTIONS_TOKEN, useValue: dySecurityOptions },
        DyAclService,
        DyAccessChecker,
      ],
    };
  }
}
