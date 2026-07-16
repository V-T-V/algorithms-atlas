import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  minConflicts,
  type McProblem,
} from '../../src/algorithms/ai-search/ais-min-conflicts/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-min-conflicts/trace.ts';
const P: McProblem = {
  n: 3,
  domain: [0, 1, 2],
  conflicts: (a, i, v) => {
    let c = 0;
    for (let k = 0; k < a.length; k++) if (k !== i && a[k] === v) c++;
    return c;
  },
  rand: () => 0,
};
test('mc 求解', () => assert.notEqual(minConflicts(P, 50, [0, 0, 0]), null));
test('mc trace 非空', () => assert.ok(buildTrace().length >= 2));
