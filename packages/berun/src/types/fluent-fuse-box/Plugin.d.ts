import { Plugin as PluginSuper } from '@berun/fluent';
export declare class Plugin<PARENT> extends PluginSuper<PARENT> {
    constructor(parent: PARENT, name: string);
}
