import { FluentMap } from '@berun/fluent';
export declare class PluginSet<PARENT> extends FluentMap<PARENT> {
    plugin(name: any): any;
    toConfig(): any[];
}
