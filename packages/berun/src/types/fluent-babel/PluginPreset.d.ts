import { OrderableMap } from '@berun/fluent';
export declare class PluginPreset<PARENT> extends OrderableMap<PARENT> {
    options: (value: {}) => this;
    constructor(parent: PARENT, name: string, options?: {});
    merge(obj: any, omit?: any[]): this;
    toConfig(): string | any[];
}
