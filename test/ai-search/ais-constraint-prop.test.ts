import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  solveCsp,
  ac3,
  type CspProblem,
} from '../../src/algorithms/ai-search/ais-constraint-prop/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-constraint-prop/trace.ts';

function fourQueens(): CspProblem {
  const vars = ['q0', 'q1', 'q2', 'q3'];
  const domains: Record<string, number[]> = {};
  for (const v of vars) domains[v] = [0, 1, 2, 3];
  return {
    variables: vars,
    domains,
    neighbors: {
      q0: ['q1', 'q2', 'q3'],
      q1: ['q0', 'q2', 'q3'],
      q2: ['q0', 'q1', 'q3'],
      q3: ['q0', 'q1', 'q2'],
    },
    consistent: (a, va, b, vb) => {
      if (va === vb) return false;
      const ia = Number(a.slice(1));
      const ib = Number(b.slice(1));
      return Math.abs(va - vb) !== Math.abs(ia - ib);
    },
  };
}
test('csp 4-皇后有解', () => {
  const sol = solveCsp(fourQueens());
  assert.ok(sol);
  // 验证不冲突
  const vs = Object.entries(sol!);
  for (let i = 0; i < vs.length; i++)
    for (let j = i + 1; j < vs.length; j++) {
      const [an, av] = vs[i]!;
      const [bn, bv] = vs[j]!;
      assert.notEqual(av, bv);
      assert.notEqual(
        Math.abs(((av as number) - bv) as number),
        Math.abs(Number(an.slice(1)) - Number(bn.slice(1))),
      );
    }
});
test('ac3 不破坏可满足性', () => {
  const p = fourQueens();
  const d: Record<string, number[]> = {};
  for (const v of p.variables) d[v] = [...p.domains[v]!];
  assert.equal(ac3(p, d), true);
});
test('csp trace 非空', () => assert.ok(buildTrace().length > 0));
