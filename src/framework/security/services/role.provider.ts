
import { Observable } from 'rxjs';

export abstract class DyRoleProvider {

  /**
   * Returns current user role
   * @returns {Observable<string | string[]>}
   */
  abstract getRole(): Observable<string|string[]>;
}
