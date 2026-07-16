import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dependentKnapsack,
  type DepItem,
} from '../../src/algorithms/dp/dependent-knapsack/impl.ts';

test('dependent-knapsack 基本行为', () => {
  assert.equal(dependentKnapsack([], 10), 0);
  assert.equal(dependentKnapsack([{ weight: 2, value: 3, parent: -1 }], 0), 0);
  // 单个无依赖物品
  assert.equal(dependentKnapsack([{ weight: 2, value: 3, parent: -1 }], 5), 3);
});

test('dependent-knapsack 必须先选父', () => {
  // 0=(w2,v3) 是 1=(w3,v10) 的父：选 1 必须也选 0
  // 容量 3：只能选 0 → v3；容量 5：选 0+1 → v13
  const items: DepItem[] = [
    { weight: 2, value: 3, parent: -1 },
    { weight: 3, value: 10, parent: 0 },
  ];
  assert.equal(dependentKnapsack(items, 3), 3);
  assert.equal(dependentKnapsack(items, 5), 13);
  assert.equal(dependentKnapsack(items, 2), 3);
});

test('dependent-knapsack 链式依赖', () => {
  // 0 → 1 → 2，必须全选或全不选（后者）
  const items: DepItem[] = [
    { weight: 1, value: 1, parent: -1 },
    { weight: 1, value: 1, parent: 0 },
    { weight: 1, value: 1, parent: 1 },
  ];
  // 容量 2：选 0+1（不能选 2，否则需 0+1+2=3）→ v2
  assert.equal(dependentKnapsack(items, 2), 2);
  // 容量 3：选 0+1+2 → v3
  assert.equal(dependentKnapsack(items, 3), 3);
});

test('dependent-knapsack 与无依赖等价（全 parent=-1 即 0/1）', () => {
  const items: DepItem[] = [
    { weight: 2, value: 3, parent: -1 },
    { weight: 3, value: 4, parent: -1 },
    { weight: 4, value: 5, parent: -1 },
  ];
  // 容量 5：选 (w2,v3)+(w3,v4) = v7
  assert.equal(dependentKnapsack(items, 5), 7);
});

test('dependent-knapsack 钩子被调用', () => {
  let enter = 0;
  let merge = 0;
  let done = -1;
  dependentKnapsack(
    [
      { weight: 2, value: 3, parent: -1 },
      { weight: 3, value: 4, parent: 0 },
    ],
    5,
    {
      onEnter: () => enter++,
      onMerge: () => merge++,
      onDone: (v) => {
        done = v;
      },
    },
  );
  assert.ok(enter >= 3, '应进入各节点（含虚拟根）');
  assert.ok(merge >= 1, '应触发至少一次合并');
  assert.equal(done, 7);
});
