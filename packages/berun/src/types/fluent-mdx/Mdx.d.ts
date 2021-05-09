import { FluentMap } from '@berun/fluent';
import { Plugin } from './Plugin';
export declare class Mdx extends FluentMap<any> {
    remarkPlugins: FluentMap<this>;
    rehypePlugins: FluentMap<this>;
    constructor(parent?: any, name?: any);
    remark(name: string, use?: string | Function, opts?: any): Plugin<this>;
    rehype(name: string, use?: string | Function, opts?: any): Plugin<this>;
    toConfig(omit?: string[]): {};
    merge(obj: any, omit?: any[]): this;
}
