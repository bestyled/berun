import { FluentMap } from '@berun/fluent';
export declare class Transform<PARENT> extends FluentMap<PARENT> {
    test(test: RegExp | string): this;
    use(plugin?: string): this;
    merge(obj: any, omit?: any[]): this;
}
