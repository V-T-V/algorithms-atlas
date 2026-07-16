import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  stateCompression,
  type TilingInput,
} from '../../src/algorithms/dp/state-compression/impl.ts';

test('state-compression 演示默认 3×4 = 11', () => {
  const { count } = stateCompression({ rows: 3, cols: 4 });
  assert.equal(count, 11);
});

test('state-compression 2×2 = 2', () => {
  assert.equal(stateCompression({ rows: 2, cols: 2 }).count, 2);
});

test('state-compression 2×3 = 3', () => {
  assert.equal(stateCompression({ rows: 2, cols: 3 }).count, 3);
});

test('state-compression 2×n 满足斐波那契递推', () => {
  // f(1)=1, f(2)=2, f(3)=3, f(4)=5, f(5)=8, f(6)=13
  const fib = [1, 2, 3, 5, 8, 13];
  for (let n = 1; n <= 6; n++) {
    assert.equal(stateCompression({ rows: 2, cols: n }).count, fib[n - 1]!, `2×${n}`);
  }
});

test('state-compression 4×4 = 36', () => {
  assert.equal(stateCompression({ rows: 4, cols: 4 }).count, 36);
});

test('state-compression 奇数×奇数面积无法铺满 = 0', () => {
  // 3×3 共 9 格为奇数，无法用 1×2 完全覆盖
  assert.equal(stateCompression({ rows: 3, cols: 3 }).count, 0);
  assert.equal(stateCompression({ rows: 1, cols: 3 }).count, 0);
});

test('state-compression 1×m 仅偶数可铺（=1）', () => {
  assert.equal(stateCompression({ rows: 1, cols: 1 }).count, 0);
  assert.equal(stateCompression({ rows: 1, cols: 2 }).count, 1);
  assert.equal(stateCompression({ rows: 1, cols: 4 }).count, 1);
  assert.equal(stateCompression({ rows: 1, cols: 5 }).count, 0);
});

test('state-compression 结果对称（n×m == m×n）', () => {
  for (const [n, m] of [
    [3, 4],
    [2, 5],
    [4, 4],
  ] as Array<[number, number]>) {
    const a = stateCompression({ rows: n, cols: m }).count;
    const b = stateCompression({ rows: m, cols: n }).count;
    assert.equal(a, b, `${n}×${m} 应与 ${m}×${n} 同`);
  }
});

test('state-compression 非法规模返回 0', () => {
  assert.equal(stateCompression({ rows: 0, cols: 5 }).count, 0);
  assert.equal(stateCompression({ rows: 5, cols: 0 }).count, 0);
});

test('state-compression 钩子被调用', () => {
  let transitions = 0;
  let doneCount = -1;
  stateCompression({ rows: 3, cols: 4 } as TilingInput, {
    onTransition: () => transitions++,
    onDone: (c) => {
      doneCount = c;
    },
  });
  assert.ok(transitions >= 1, '至少一次转移');
  assert.equal(doneCount, 11);
});
