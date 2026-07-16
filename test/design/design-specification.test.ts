import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  filterBy,
  andSpec,
  orSpec,
  notSpec,
  type Spec,
} from '../../src/algorithms/design/design-specification/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-specification/trace.ts';
const gt2: Spec<number> = { isSatisfiedBy: (n) => n > 2 };
const lt8: Spec<number> = { isSatisfiedBy: (n) => n < 8 };
test('and 组合', () => assert.deepEqual(filterBy([1, 3, 5, 9], andSpec(gt2, lt8)), [3, 5]));
test('or/not 组合', () => assert.deepEqual(filterBy([1, 3, 9], notSpec(gt2)), [1]));
test('spec trace 非空', () => assert.ok(buildTrace().length > 0));
