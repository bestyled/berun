import { FluentMap, FluentSet } from '@berun/fluent';
import { Transform } from './Transform';
export declare class Jest<PARENT> extends FluentMap<PARENT> {
    collectCoverageFrom: FluentSet<this, unknown>;
    setupFiles: FluentSet<this, unknown>;
    testMatch: FluentSet<this, unknown>;
    roots: FluentSet<this, unknown>;
    transformIgnorePatterns: FluentSet<this, unknown>;
    moduleFileExtensions: FluentSet<this, unknown>;
    moduleNameMapper: FluentMap<this>;
    transforms: FluentMap<this>;
    testEnvironment: (value: any) => this;
    testURL: (value: string) => this;
    rootDir: (value: string) => this;
    constructor(parent?: PARENT, name?: string);
    transform(name: string): Transform<this>;
    toConfig(omit?: string[]): {};
    merge(obj: any, omit?: any[]): this;
}
