import { OrderableMap } from '@berun/fluent';
export declare class Plugin<PARENT> extends OrderableMap<PARENT> {
    options: (value: {}) => this;
    constructor(parent: PARENT, name: string);
    use(plugin: any, options?: {}): this;
    tap(f: (_: any) => any): this;
    merge(obj: any, omit?: any[]): this;
    toConfig(): any;
}
