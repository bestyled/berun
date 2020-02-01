import { OrderableMap, FluentMap } from '@berun/fluent';
export declare class Bundle<PARENT> extends OrderableMap<PARENT> {
    watch: (value: string) => this;
    globals: (value: any) => this;
    tsConfig: (value: string) => this;
    shim: (value: any) => this;
    hmr: (value: {
        port?: number;
        socketURI?: string;
        reload?: boolean;
    }) => this;
    alias: FluentMap<this>;
    cache: (value: boolean) => this;
    splitConfig: (value: {
        browser?: string;
        server?: string;
        dest?: string;
    }) => this;
    log: (value: boolean) => this;
    extensionOverrides: (value: string[]) => this;
    plugins: FluentMap<this>;
    natives: (value: any) => this;
    instructions: (value: string) => this;
    target: (value: string) => this;
    sourceMaps: (value: any) => this;
    test: (value: string) => this;
    testOptions: (value: any) => this;
    completed: (value: (process: any) => void) => this;
    constructor(parent?: PARENT, name?: string);
    exec(): Promise<any>;
    plugin(name: any): any;
    merge(obj: any, omit?: any[]): this;
    toConfig(omit?: string[]): {};
}
