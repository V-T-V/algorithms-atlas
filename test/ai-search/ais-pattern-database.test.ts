import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPatternDatabase,
  queryPdb,
} from '../../src/algorithms/ai-search/ais-pattern-database/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-pattern-database/trace.ts';

test('ais-pattern-database 目标自身距离 0', () => {
  const goal = [1, 2, 3, 0];
  const db = buildPatternDatabase(2, [1, 2], goal);
  assert.equal(queryPdb(db, goal, [1, 2]), 0);
});

test('ais-pattern-database 一步状态距离 1', () => {
  const goal = [1, 2, 3, 0];
  const db = buildPatternDatabase(2, [1, 2], goal);
  // 空白与 3 交换 -> [1,2,0,3]
  assert.equal(queryPdb(db, [1, 2, 0, 3], [1, 2]), 1);
});

test('ais-pattern-database 数据库非空', () => {
  const goal = [1, 2, 3, 0];
  const db = buildPatternDatabase(2, [1, 2], goal);
  assert.ok(db.size > 1);
});

test('ais-pattern-database trace', () => {
  assert.ok(buildTrace().length > 2);
});
