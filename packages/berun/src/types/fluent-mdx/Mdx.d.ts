import { FluentMap } from '@berun/fluent';
import { Plugin } from './Plugin';
export declare class Mdx extends FluentMap<any> {
    mdPlugins: FluentMap<this>;
    hastPlugins: FluentMap<this>;
    constructor(parent?: any, name?: any);
    plugin(name: string, use?: string | Function, opts?: any): Plugin<this>;
    hast(name: string, use?: string | Function, opts?: any): Plugin<this>;
    toConfig(omit?: string[]): {};
    merge(obj: any, omit?: any[]): this;
}
