import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TranspositionTable,
  Zobrist,
} from '../../src/algorithms/ai-search/transposition-table/impl.ts';

test('Zobrist 相同局面产生相同哈希', () => {
  const z1 = new Zobrist(9, 2, 42);
  const z2 = new Zobrist(9, 2, 42);
  const board = [1, 2, 0, 0, 1, 0, 0, 0, 2];
  assert.equal(z1.compute(board), z2.compute(board));
});

test('Zobrist 不同局面产生不同哈希', () => {
  const z = new Zobrist(9, 2, 42);
  const h1 = z.compute([1, 0, 0, 0, 0, 0, 0, 0, 0]);
  const h2 = z.compute([0, 1, 0, 0, 0, 0, 0, 0, 0]);
  assert.notEqual(h1, h2);
});

test('Zobrist 增量更新与全量计算一致', () => {
  const zFull = new Zobrist(9, 2, 7);
  const zInc = new Zobrist(9, 2, 7);
  const target = [1, 2, 0, 0, 1, 0, 0, 0, 2];
  const fullHash = zFull.compute(target);

  // 从空棋盘增量走到 target
  zInc.compute([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  zInc.apply(0, 0, 1); // 放 X 于格 0
  zInc.apply(1, 0, 2); // 放 O 于格 1
  zInc.apply(4, 0, 1); // 放 X 于格 4
  zInc.apply(8, 0, 2); // 放 O 于格 8
  assert.equal(zInc.hash, fullHash);
});

test('置换表 EXACT 命中', () => {
  const tt = new TranspositionTable();
  const h = 123n;
  tt.store({ hash: h, depth: 4, score: 7, flag: 'EXACT' });
  const r = tt.lookup(h, 3, -Infinity, Infinity);
  assert.equal(r.usable, true);
  assert.equal(r.value, 7);
  assert.equal(tt.stats.hits, 1);
});

test('置换表深度不足不算命中', () => {
  const tt = new TranspositionTable();
  tt.store({ hash: 5n, depth: 2, score: 1, flag: 'EXACT' });
  const r = tt.lookup(5n, 4, -Infinity, Infinity);
  assert.equal(r.usable, false);
  assert.equal(tt.stats.misses, 1);
});

test('置换表 LOWER_BOUND 在窗口外可用', () => {
  const tt = new TranspositionTable();
  tt.store({ hash: 9n, depth: 5, score: 100, flag: 'LOWER_BOUND' });
  // beta=50，score>=beta → 可用作剪枝
  const r = tt.lookup(9n, 3, -Infinity, 50);
  assert.equal(r.usable, true);
  assert.equal(r.value, 100);
});

test('置换表 UPPER_BOUND 在窗口外可用', () => {
  const tt = new TranspositionTable();
  tt.store({ hash: 9n, depth: 5, score: -100, flag: 'UPPER_BOUND' });
  const r = tt.lookup(9n, 3, -50, Infinity);
  assert.equal(r.usable, true);
  assert.equal(r.value, -100);
});

test('置换表相同 hash 保留更深条目', () => {
  const tt = new TranspositionTable();
  tt.store({ hash: 1n, depth: 2, score: 3, flag: 'EXACT' });
  tt.store({ hash: 1n, depth: 1, score: 99, flag: 'EXACT' }); // 更浅，不覆盖
  const r = tt.lookup(1n, 2, -Infinity, Infinity);
  assert.equal(r.value, 3);
});

test('置换表相同 hash 更深条目覆盖', () => {
  const tt = new TranspositionTable();
  tt.store({ hash: 1n, depth: 1, score: 3, flag: 'EXACT' });
  tt.store({ hash: 1n, depth: 5, score: 99, flag: 'EXACT' }); // 更深，覆盖
  const r = tt.lookup(1n, 3, -Infinity, Infinity);
  assert.equal(r.value, 99);
});

test('置换表 clear 重置统计', () => {
  const tt = new TranspositionTable();
  tt.store({ hash: 1n, depth: 1, score: 1, flag: 'EXACT' });
  tt.lookup(1n, 1, -Infinity, Infinity);
  assert.equal(tt.size, 1);
  tt.clear();
  assert.equal(tt.size, 0);
  assert.equal(tt.stats.stores, 0);
});
