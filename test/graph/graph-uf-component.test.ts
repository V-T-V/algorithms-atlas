import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ufComponentCount, UnionFind } from '../../src/algorithms/graph/graph-uf-component/impl.ts';

test('uf-component 基本分量', () => {
  const nodes = ['1', '2', '3', '4', '5', '6', '7'];
  const edges = [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '4', to: '5' },
    { from: '6', to: '7' },
  ];
  assert.equal(ufComponentCount(nodes, edges), 3);
});

test('uf-component 全连通', () => {
  const nodes = ['A', 'B', 'C'];
  const edges = [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
  ];
  assert.equal(ufComponentCount(nodes, edges), 1);
});

test('uf-component 无边每点独立', () => {
  assert.equal(ufComponentCount(['A', 'B', 'C'], []), 3);
});

test('uf-component 空图', () => {
  assert.equal(ufComponentCount([], []), 0);
});

test('uf-component UnionFind 类 find/union', () => {
  const uf = new UnionFind(['a', 'b', 'c']);
  uf.union('a', 'b');
  assert.equal(uf.find('a'), uf.find('b'));
  assert.notEqual(uf.find('a'), uf.find('c'));
  assert.equal(uf.parts, 2);
});

test('uf-component 钩子', () => {
  let unions = 0;
  ufComponentCount(['A', 'B'], [{ from: 'A', to: 'B' }], { onUnion: () => unions++ });
  assert.equal(unions, 1);
});
