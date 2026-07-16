import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mcmf, type FlowNetworkInput } from '../../src/algorithms/graph/mcmf/impl.ts';

test('mcmf 经典教材示例', () => {
  // s→a (4,1), s→b (3,4), a→b (2,2), a→t (2,5), b→t (3,1)
  const g: FlowNetworkInput = {
    nodes: ['s', 'a', 'b', 't'],
    edges: [
      { from: 's', to: 'a', capacity: 4, cost: 1 },
      { from: 's', to: 'b', capacity: 3, cost: 4 },
      { from: 'a', to: 'b', capacity: 2, cost: 2 },
      { from: 'a', to: 't', capacity: 2, cost: 5 },
      { from: 'b', to: 't', capacity: 3, cost: 1 },
    ],
    source: 's',
    sink: 't',
  };
  const { maxFlow, minCost } = mcmf(g);
  // 最大流：s 出边容量 4+3=7，t 入边 2+3=5 → 上限 5
  // 最短费用路优先：s→a→b→t (1+2+1=4) 推 min(4,2,3)=2；再用 s→a→t (1+5=6) 推 2；
  //                再 s→b→t (4+1=5) 推 1。总流 5，费用 = 2*4 + 2*6 + 1*5 = 25
  assert.equal(maxFlow, 5);
  assert.equal(minCost, 25);
});

test('mcmf 单链', () => {
  const g: FlowNetworkInput = {
    nodes: ['s', 'm', 't'],
    edges: [
      { from: 's', to: 'm', capacity: 3, cost: 2 },
      { from: 'm', to: 't', capacity: 3, cost: 4 },
    ],
    source: 's',
    sink: 't',
  };
  const { maxFlow, minCost } = mcmf(g);
  assert.equal(maxFlow, 3);
  assert.equal(minCost, 3 * (2 + 4));
});

test('mcmf 源汇相同', () => {
  const g: FlowNetworkInput = {
    nodes: ['s'],
    edges: [],
    source: 's',
    sink: 's',
  };
  assert.equal(mcmf(g).maxFlow, 0);
});

test('mcmf 不可达', () => {
  const g: FlowNetworkInput = {
    nodes: ['s', 't'],
    edges: [],
    source: 's',
    sink: 't',
  };
  const { maxFlow, minCost } = mcmf(g);
  assert.equal(maxFlow, 0);
  assert.equal(minCost, 0);
});

test('mcmf 钩子被调用', () => {
  const augments: Array<{ flow: number; unitCost: number }> = [];
  let doneFlow = -1;
  let doneCost = -1;
  const g: FlowNetworkInput = {
    nodes: ['s', 'a', 't'],
    edges: [
      { from: 's', to: 'a', capacity: 2, cost: 1 },
      { from: 'a', to: 't', capacity: 2, cost: 3 },
    ],
    source: 's',
    sink: 't',
  };
  mcmf(g, {
    onAugment: (_p, f, uc) => augments.push({ flow: f, unitCost: uc }),
    onDone: (tf, tc) => {
      doneFlow = tf;
      doneCost = tc;
    },
  });
  assert.equal(augments.length, 1);
  assert.equal(augments[0]!.flow, 2);
  assert.equal(augments[0]!.unitCost, 4);
  assert.equal(doneFlow, 2);
  assert.equal(doneCost, 8);
});
