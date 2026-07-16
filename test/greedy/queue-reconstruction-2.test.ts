import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  queueRecon2,
  type QueueRecon2Hooks,
} from '../../src/algorithms/greedy/queue-reconstruction-2/impl.ts';

test('queue-reconstruction-2 经典例子', () => {
  const input: ReadonlyArray<readonly [number, number]> = [
    [7, 0],
    [4, 4],
    [7, 1],
    [5, 0],
    [6, 1],
    [5, 2],
  ];
  const r = queueRecon2(input);
  const expected = [
    [5, 0],
    [7, 0],
    [5, 2],
    [6, 1],
    [4, 4],
    [7, 1],
  ];
  assert.deepEqual(
    r.queue.map((p) => [p.h, p.k]),
    expected,
  );
});

test('queue-reconstruction-2 空输入', () => {
  assert.deepEqual(queueRecon2([]).queue, []);
});

test('queue-reconstruction-2 单元素', () => {
  const r = queueRecon2([[3, 0]]);
  assert.equal(r.queue.length, 1);
  assert.deepEqual([r.queue[0]!.h, r.queue[0]!.k], [3, 0]);
});

test('queue-reconstruction-2 结果满足 k 约束', () => {
  const input: ReadonlyArray<readonly [number, number]> = [
    [7, 0],
    [4, 4],
    [7, 1],
    [5, 0],
    [6, 1],
    [5, 2],
  ];
  const r = queueRecon2(input);
  for (let i = 0; i < r.queue.length; i++) {
    const h = r.queue[i]!.h;
    const k = r.queue[i]!.k;
    let cnt = 0;
    for (let j = 0; j < i; j++) {
      if (r.queue[j]!.h >= h) cnt++;
    }
    assert.equal(cnt, k, `位置 ${i} 的 k 约束不满足`);
  }
});

test('queue-reconstruction-2 同身高', () => {
  const input: ReadonlyArray<readonly [number, number]> = [
    [5, 0],
    [5, 1],
    [5, 2],
  ];
  const r = queueRecon2(input);
  assert.deepEqual(
    r.queue.map((p) => [p.h, p.k]),
    [
      [5, 0],
      [5, 1],
      [5, 2],
    ],
  );
});

test('queue-reconstruction-2 钩子被调用', () => {
  let places = 0;
  const hooks: QueueRecon2Hooks = {
    onPlace: () => places++,
  };
  // 用合法的等身高 2 人输入（[7,0],[4,4] 在 n=2 时不可能成立，故排除）
  queueRecon2(
    [
      [5, 0],
      [5, 1],
    ],
    hooks,
  );
  assert.equal(places, 2);
});
