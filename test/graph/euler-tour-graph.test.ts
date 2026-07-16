import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  eulerTourGraph,
  type TreeInput,
} from '../../src/algorithms/graph/euler-tour-graph/impl.ts';

const T: TreeInput = {
  nodes: ['0', '1', '2', '3', '4'],
  edges: [
    { from: '0', to: '1' },
    { from: '0', to: '2' },
    { from: '1', to: '3' },
    { from: '1', to: '4' },
  ],
  root: '0',
};

test('euler-tour-graph 进入序长度等于节点数', () => {
  const { dfn, euler } = eulerTourGraph(T);
  assert.equal(dfn.length, 5);
  // 完整欧拉环游长度 2V-1 = 9
  assert.equal(euler.length, 9);
});

test('euler-tour-graph 根节点最先进入', () => {
  const { dfn, inTime } = eulerTourGraph(T);
  assert.equal(dfn[0], '0');
  assert.equal(inTime.get('0'), 1);
});

test('euler-tour-graph in/out 时间戳满足子树区间', () => {
  const { inTime, outTime } = eulerTourGraph(T);
  // 1 是 3 和 4 的父，子树 in/out 落在 1 的区间内
  const i1 = inTime.get('1')!,
    o1 = outTime.get('1')!;
  for (const child of ['3', '4']) {
    const ic = inTime.get(child)!,
      oc = outTime.get(child)!;
    assert.ok(ic >= i1 && oc <= o1);
  }
});

test('euler-tour-graph 欧拉环游首尾都是根', () => {
  const { euler } = eulerTourGraph(T);
  assert.equal(euler[0], '0');
  assert.equal(euler[euler.length - 1], '0');
});

test('euler-tour-graph 钩子被调用', () => {
  const enters: string[] = [];
  eulerTourGraph(T, { onEnter: (v) => enters.push(v) });
  assert.equal(enters.length, 5);
  assert.equal(enters[0], '0');
});
