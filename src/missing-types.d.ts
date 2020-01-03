declare module "just-extend" {
    function extend<T extends object, U extends object>(target: T, source: U): T & U;
    function extend<T extends object, U extends object, V extends object>(target: T, source1: U, source2: V): T & U & V;
    function extend<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    function extend(target: object, ...sources: object[]): object;

    function extend<T extends object, U extends object>(deep: boolean, target: T, source: U): T & U;
    function extend<T extends object, U extends object, V extends object>(deep: boolean, target: T, source1: U, source2: V): T & U & V;
    function extend<T extends object, U extends object, V extends object, W extends object>(deep: boolean, target: T, source1: U, source2: V, source3: W): T & U & V & W;
    function extend(deep: boolean, target: object, ...sources: object[]): object;

    export = extend;
}
