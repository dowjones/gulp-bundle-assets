// AVA TS patch
declare global {
    export interface SymbolConstructor {
        readonly observable: symbol;
    }
}

import test from "ava";

test.todo("Small number of bundles with all dependencies met");

test.todo("Lots of bundles with all dependencies met");

test.todo("Small number of bundles with unmet dependencies");

test.todo("Lots of bundles with all unmet dependencies");
