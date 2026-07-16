import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  beautifulArrangement,
  BEAUTIFUL_COUNT,
  type BeautifulArrangementHooks,
} from '../../src/algorithms/backtracking/beautiful-arrangement/impl.ts';

test('beautiful-arrangement n=1 = 1', () => {
  assert.equal(beautifulArrangement(1), 1);
});

test('beautiful-arrangement n=2 = 2', () => {
  assert.equal(beautifulArrangement(2), 2);
});

test('beautiful-arrangement n=4 = 8', () => {
  assert.equal(beautifulArrangement(4), 8);
});

test('beautiful-arrangement n=3 = 3', () => {
  // [1,2,3], [2,1,3], [3,2,1]
  assert.equal(beautifulArrangement(3), 3);
});

test('beautiful-arrangement 与已知解数表一致（n=1..9）', () => {
  for (let n = 1; n <= 9; n++) {
    assert.equal(beautifulArrangement(n), BEAUTIFUL_COUNT[n]!, `n=${n}`);
  }
});

test('beautiful-arrangement 非法输入返回 0', () => {
  assert.equal(beautifulArrangement(0), 0);
  assert.equal(beautifulArrangement(-1), 0);
});

test('beautiful-arrangement 钩子被调用', () => {
  let places = 0;
  let arrangements = 0;
  const hooks: BeautifulArrangementHooks = {
    onPlace: () => places++,
    onArrangement: () => arrangements++,
  };
  const total = beautifulArrangement(4, hooks);
  assert.equal(total, 8);
  assert.equal(arrangements, 8);
  assert.ok(places > 0);
});

test('beautiful-arrangement 找到的排列确实满足约束', () => {
  const arrs: number[][] = [];
  beautifulArrangement(4, { onArrangement: (a) => arrs.push(a) });
  for (const a of arrs) {
    for (let i = 0; i < a.length; i++) {
      const pos = i + 1;
      const v = a[i]!;
      assert.ok(v % pos === 0 || pos % v === 0, `pos ${pos} value ${v} 不满足约束`);
    }
  }
});
