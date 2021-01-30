
import { DyAuthStrategyOptions, DyStrategyToken } from '../auth-strategy-options';
import { DyAuthSimpleToken } from '../../services/token/token';

export class DyDummyAuthStrategyOptions extends DyAuthStrategyOptions {
  token?: DyStrategyToken = {
    class: DyAuthSimpleToken,
  };
  delay?: number = 1000;
  alwaysFail?: boolean = false;
}

export const dummyStrategyOptions: DyDummyAuthStrategyOptions = new DyDummyAuthStrategyOptions();
