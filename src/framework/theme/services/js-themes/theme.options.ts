export interface DyJSThemeOptions {
  name: string;
  base?: string;
  variables?: DyJSThemeVariable;
}

export interface DyJSThemeVariable {
  [key: string]: string | string[] | DyJSThemeVariable;
}
