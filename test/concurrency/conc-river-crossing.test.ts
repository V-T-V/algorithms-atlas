import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  solveRiverCrossing,
  isSafe,
  nextMoves,
} from '../../src/algorithms/concurrency/conc-river-crossing/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-river-crossing/trace.ts';

test('conc-river-crossing 3M3C 有解', () => {
  const sol = solveRiverCrossing(3, 3);
  assert.ok(sol);
  assert.equal(sol!.path[0]!.state.leftM, 3);
  assert.equal(sol!.path[sol!.path.length - 1]!.state.leftM, 0);
});

test('conc-river-crossing 最少步数为 11', () => {
  const sol = solveRiverCrossing(3, 3);
  assert.equal(sol!.steps, 11);
});

test('conc-river-crossing isSafe 判定', () => {
  assert.equal(isSafe({ leftM: 1, leftC: 2, boat: 0 }, 3, 3), false); // 左岸传教士1野人2不安全
  assert.equal(isSafe({ leftM: 3, leftC: 3, boat: 0 }, 3, 3), true);
});

test('conc-river-crossing nextMoves 非空', () => {
  const moves = nextMoves({ leftM: 3, leftC: 3, boat: 0 }, 3, 3);
  assert.ok(moves.length > 0);
});

test('conc-river-crossing trace', () => {
  assert.ok(buildTrace().length > 2);
});
