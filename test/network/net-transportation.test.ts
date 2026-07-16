import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  transportation,
  type TransportationInput,
} from '../../src/algorithms/network/net-transportation/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-transportation/trace.ts';

test('net-transportation 平衡运输', () => {
  // 总供 50 = 总需 50
  const input: TransportationInput = {
    supply: [
      { id: 0, amount: 20 },
      { id: 1, amount: 30 },
    ],
    demand: [
      { id: 0, amount: 10 },
      { id: 1, amount: 25 },
      { id: 2, amount: 15 },
    ],
    cost: [
      [3, 5, 7],
      [6, 4, 2],
    ],
  };
  const r = transportation(input);
  assert.equal(r.totalShipped, 50);
  // 验证需求满足
  for (let j = 0; j < 3; j++) {
    const colSum = r.plan.reduce((s, row) => s + row[j]!, 0);
    assert.equal(colSum, input.demand[j]!.amount);
  }
});

test('net-transportation 单源单汇', () => {
  const input: TransportationInput = {
    supply: [{ id: 0, amount: 5 }],
    demand: [{ id: 0, amount: 5 }],
    cost: [[2]],
  };
  const r = transportation(input);
  assert.equal(r.totalCost, 10);
});

test('net-transportation 供大于需', () => {
  const input: TransportationInput = {
    supply: [{ id: 0, amount: 100 }],
    demand: [{ id: 0, amount: 3 }],
    cost: [[4]],
  };
  const r = transportation(input);
  assert.equal(r.totalShipped, 3);
  assert.equal(r.totalCost, 12);
});

test('net-transportation 供应约束满足', () => {
  const input: TransportationInput = {
    supply: [
      { id: 0, amount: 5 },
      { id: 1, amount: 5 },
    ],
    demand: [
      { id: 0, amount: 6 },
      { id: 1, amount: 4 },
    ],
    cost: [
      [1, 2],
      [3, 4],
    ],
  };
  const r = transportation(input);
  for (let i = 0; i < 2; i++) {
    const rowSum = r.plan[i]!.reduce((s, x) => s + x, 0);
    assert.ok(rowSum <= input.supply[i]!.amount);
  }
});

test('net-transportation trace', () => {
  assert.ok(buildTrace().length >= 2);
});
