import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  solve3SatGreedy,
  type Clause,
} from '../../src/algorithms/graph/graph-satisfiability/impl.ts';

test('satisfiability 全可满足', () => {
  // (x1∨x2∨x3)∧(¬x1∨¬x2∨¬x3)：可满足
  const clauses: Clause[] = [
    [1, 2, 3],
    [-1, -2, -3],
  ];
  const res = solve3SatGreedy(clauses, 3);
  assert.equal(res.satisfied, 2);
});

test('satisfiability 基本可满足例', () => {
  const clauses: Clause[] = [
    [1, 2, -3],
    [-1, 2, 3],
    [1, -2, 3],
  ];
  const res = solve3SatGreedy(clauses, 3);
  assert.equal(res.satisfied, 3);
});

test('satisfiability 冲突子句至少满足部分', () => {
  // (x1)∧(¬x1) 形式（用三文字扩展）：必有一个不满足
  const clauses: Clause[] = [
    [1, 1, 1],
    [-1, -1, -1],
  ];
  const res = solve3SatGreedy(clauses, 1);
  assert.equal(res.satisfied, 1);
});

test('satisfiability 空子句集', () => {
  const res = solve3SatGreedy([], 2);
  assert.equal(res.satisfied, 0);
  assert.equal(res.assignment.size, 2);
});

test('satisfiability 钩子', () => {
  let assigns = 0;
  solve3SatGreedy([[1, 2, 3]], 3, { onAssign: () => assigns++ });
  assert.equal(assigns, 3);
});
