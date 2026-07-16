import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Blocking2D, blocking } from '../../src/algorithms/ds/blocking/impl.ts';

function mat(R: number, C: number): number[][] {
  return Array.from({ length: R }, (_, r) => Array.from({ length: C }, (_, c) => r * 10 + c));
}

test('blocking 子矩阵求和 与暴力一致', () => {
  const b = new Blocking2D(mat(6, 6));
  const cases: Array<[number, number, number, number]> = [
    [0, 0, 5, 5],
    [1, 1, 4, 4],
    [2, 2, 2, 2],
    [0, 0, 0, 5],
    [3, 0, 5, 3],
    [1, 2, 3, 4],
  ];
  for (const [r1, c1, r2, c2] of cases) {
    assert.equal(b.query(r1, c1, r2, c2), b.brute(r1, c1, r2, c2), `(${r1},${c1})-(${r2},${c2})`);
  }
});

test('blocking 整块 vs 散块正确', () => {
  // 9x9, B=3 → 3x3 块
  const b = new Blocking2D(mat(9, 9));
  // 精确对齐整块边界 (3,3)-(5,5) 应等于 blockSum[1][1]
  assert.equal(b.query(3, 3, 5, 5), b.blockSum[1]![1]!);
  assert.equal(b.query(0, 0, 8, 8), b.brute(0, 0, 8, 8));
});

test('blocking 越界与空', () => {
  const b = new Blocking2D(mat(4, 4));
  assert.equal(b.query(-2, -2, 100, 100), b.brute(0, 0, 3, 3));
  assert.equal(b.query(2, 2, 1, 1), 0); // 空
  const empty = new Blocking2D([]);
  assert.equal(empty.query(0, 0, 5, 5), 0);
});

test('blocking 便利函数批量查询', () => {
  const out = blocking({
    matrix: mat(4, 4),
    queries: [
      [0, 0, 3, 3],
      [1, 1, 2, 2],
    ],
  });
  const b = new Blocking2D(mat(4, 4));
  assert.deepEqual(out, [b.brute(0, 0, 3, 3), b.brute(1, 1, 2, 2)]);
});

test('blocking 钩子被调用', () => {
  const b = new Blocking2D(mat(6, 6));
  let cells = 0;
  let blocks = 0;
  let results = 0;
  // 跨块查询必触发 onBlock(整块) 与 onCell(散块)
  b.query(1, 1, 4, 4, {
    onCell: () => cells++,
    onBlock: () => blocks++,
    onResult: () => results++,
  });
  assert.ok(blocks > 0, '应有整块');
  assert.ok(cells > 0, '应有散格');
  assert.equal(results, 1);
});

test('blocking 建块钩子', () => {
  let built = 0;
  const info = { br: 0, bc: 0 };
  const _b = new Blocking2D(mat(9, 9), {
    onBuild: (_r, _c, _br, _bc, br, bc) => {
      built++;
      info.br = br;
      info.bc = bc;
    },
  });
  assert.equal(built, 1);
  assert.equal(info.br, 3);
  assert.equal(info.bc, 3);
});
