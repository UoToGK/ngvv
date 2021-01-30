
import { Injectable } from '@angular/core';
import { DyRoleProvider } from './role.provider';
import { DyAclService } from './acl.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Access checker service.
 *
 * Injects `DyRoleProvider` to determine current user role, and checks access permissions using `DyAclService`
 */
@Injectable()
export class DyAccessChecker {

  constructor(protected roleProvider: DyRoleProvider, protected acl: DyAclService) {
  }

  /**
   * Checks whether access is granted or not
   *
   * @param {string} permission
   * @param {string} resource
   * @returns {Observable<boolean>}
   */
  isGranted(permission: string, resource: string): Observable<boolean> {
    return this.roleProvider.getRole()
      .pipe(
        map((role: string|string[]) => Array.isArray(role) ? role : [role]),
        map((roles: string[]) => {
          return roles.some(role => this.acl.can(role, permission, resource));
        }),
      );
  }
}
