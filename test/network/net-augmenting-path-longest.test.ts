import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  widestAugmentingPath,
  type WidestEdge,
} from '../../src/algorithms/network/net-augmenting-path-longest/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-augmenting-path-longest/trace.ts';

test('net-augmenting-path-longest 正确最大流', () => {
  const edges: WidestEdge[] = [
    { from: 'S', to: 'A', cap: 10 },
    { from: 'S', to: 'B', cap: 10 },
    { from: 'A', to: 'B', cap: 2 },
    { from: 'A', to: 'C', cap: 4 },
    { from: 'A', to: 'T', cap: 8 },
    { from: 'B', to: 'C', cap: 9 },
    { from: 'C', to: 'T', cap: 10 },
  ];
  assert.equal(widestAugmentingPath(['S', 'A', 'B', 'C', 'T'], edges, 'S', 'T'), 18);
});

test('net-augmenting-path-longest 直连', () => {
  assert.equal(widestAugmentingPath(['s', 't'], [{ from: 's', to: 't', cap: 7 }], 's', 't'), 7);
});

test('net-augmenting-path-longest 不连通返回 0', () => {
  assert.equal(
    widestAugmentingPath(['s', 'a', 't'], [{ from: 's', to: 'a', cap: 5 }], 's', 't'),
    0,
  );
});

test('net-augmenting-path-longest CLRS 经典 = 23', () => {
  const edges: WidestEdge[] = [
    { from: 's', to: 'v1', cap: 16 },
    { from: 's', to: 'v2', cap: 13 },
    { from: 'v1', to: 'v3', cap: 12 },
    { from: 'v2', to: 'v1', cap: 4 },
    { from: 'v2', to: 'v4', cap: 14 },
    { from: 'v3', to: 'v2', cap: 9 },
    { from: 'v3', to: 't', cap: 20 },
    { from: 'v4', to: 'v3', cap: 7 },
    { from: 'v4', to: 't', cap: 4 },
  ];
  assert.equal(widestAugmentingPath(['s', 'v1', 'v2', 'v3', 'v4', 't'], edges, 's', 't'), 23);
});

test('net-augmenting-path-longest 首轮取最大瓶颈', () => {
  let firstBottleneck = 0;
  widestAugmentingPath(
    ['s', 'a', 't'],
    [
      { from: 's', to: 'a', cap: 5 },
      { from: 'a', to: 't', cap: 5 },
    ],
    's',
    't',
    {
      onAugment: (_p, b) => {
        firstBottleneck = b;
      },
    },
  );
  assert.equal(firstBottleneck, 5);
});

test('net-augmenting-path-longest trace', () => {
  assert.ok(buildTrace().length >= 2);
});
