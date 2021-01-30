
import { DyAuthTokenClass } from '../services/token/token';

export interface DyStrategyToken {
  class?: DyAuthTokenClass;
  [key: string]: any;
}

export class DyAuthStrategyOptions {
  name: string;
  token?: DyStrategyToken;
}
