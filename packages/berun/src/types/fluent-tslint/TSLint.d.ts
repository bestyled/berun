import { FluentMap, FluentSet } from '@berun/fluent';
export declare class TSLint<PARENT> extends FluentMap<PARENT> {
    extends: FluentSet<this, unknown>;
    rulesDirectory: FluentSet<this, unknown>;
    rules: FluentMap<this>;
    jsRules: FluentMap<this>;
    defaultSeverity: (value: any) => this;
    linterOptions: (value: any) => this;
    constructor(parent?: PARENT, name?: string);
}
