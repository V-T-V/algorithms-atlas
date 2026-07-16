import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kShortest, type GraphInput } from '../../src/algorithms/graph/k-shortest/impl.ts';

const G: GraphInput = {
  nodes: ['s', 'a', 'b', 't'],
  edges: [
    { from: 's', to: 'a', weight: 1 },
    { from: 's', to: 'b', weight: 5 },
    { from: 'a', to: 'b', weight: 1 },
    { from: 'a', to: 't', weight: 6 },
    { from: 'b', to: 't', weight: 1 },
    { from: 's', to: 't', weight: 100 },
  ],
  source: 's',
  target: 't',
  k: 3,
};

test('k-shortest 第 1 短 = 3', () => {
  const { paths } = kShortest(G);
  assert.equal(paths.length, 3);
  assert.equal(paths[0]!.weight, 3); // s→a→b→t
  assert.deepEqual(paths[0]!.path, ['s', 'a', 'b', 't']);
});

test('k-shortest 第 2 短 = 6', () => {
  const { paths } = kShortest(G);
  assert.equal(paths[1]!.weight, 6); // s→b→t
});

test('k-shortest 第 3 短 = 7', () => {
  const { paths } = kShortest(G);
  assert.equal(paths[2]!.weight, 7); // s→a→t
});

test('k-shortest 路径权递增', () => {
  const { paths } = kShortest({ ...G, k: 4 });
  for (let i = 1; i < paths.length; i++) {
    assert.ok(paths[i]!.weight >= paths[i - 1]!.weight);
  }
});

test('k-shortest 不可达返回空', () => {
  const g: GraphInput = {
    nodes: ['s', 't'],
    edges: [],
    source: 's',
    target: 't',
    k: 3,
  };
  assert.equal(kShortest(g).paths.length, 0);
});

test('k-shortest k=1', () => {
  const { paths } = kShortest({ ...G, k: 1 });
  assert.equal(paths.length, 1);
  assert.equal(paths[0]!.weight, 3);
});

test('k-shortest 钩子被调用', () => {
  const found: number[] = [];
  let doneCount = -1;
  kShortest(G, {
    onPath: (i, _p, w) => found.push(w),
    onDone: (c) => {
      doneCount = c;
    },
  });
  assert.equal(found.length, 3);
  assert.equal(found[0], 3);
  assert.equal(doneCount, 3);
});
