import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  conflictBackjumping,
  type Csp,
} from '../../src/algorithms/ai-search/ais-backjumping/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-backjumping/trace.ts';
const C: Csp = {
  vars: [0, 1],
  domain: [0, 1],
  consistent: (p, i, v) => {
    for (const [k, val] of p) if (k !== i && val === v) return false;
    return true;
  },
};
test('cbj 求解', () => assert.notEqual(conflictBackjumping(C), null));
test('cbj trace 非空', () => assert.ok(buildTrace().length >= 2));
