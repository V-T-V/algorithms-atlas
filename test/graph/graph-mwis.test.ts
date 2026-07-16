import { test } from 'node:test';
import assert from 'node:assert/strict';
import { treeMwis } from '../../src/algorithms/graph/graph-mwis/impl.ts';

const isIndependent = (
  chosen: string[],
  children: ReadonlyArray<{ parent: string; child: string }>,
): boolean => {
  const set = new Set(chosen);
  for (const e of children) {
    if (set.has(e.parent) && set.has(e.child)) return false;
  }
  return true;
};

test('mwis 树形例', () => {
  const input = {
    nodes: [
      { id: 'R', weight: 5 },
      { id: 'A', weight: 3 },
      { id: 'B', weight: 4 },
      { id: 'C', weight: 1 },
      { id: 'D', weight: 2 },
    ],
    children: [
      { parent: 'R', child: 'A' },
      { parent: 'R', child: 'B' },
      { parent: 'A', child: 'C' },
      { parent: 'B', child: 'D' },
    ],
    root: 'R',
  };
  // 取 R:5 + 不能取 A,B; 取 C:1, D:2 => 8
  // 或不取 R: 取 A:3+B:4=7 + C,D 不能取（A,B 取了） => 7
  // 最优 8
  const r = treeMwis(input);
  assert.equal(r.best, 8);
  assert.ok(isIndependent(r.chosen, input.children));
});

test('mwis 单节点', () => {
  const r = treeMwis({ nodes: [{ id: 'X', weight: 7 }], children: [], root: 'X' });
  assert.equal(r.best, 7);
  assert.deepEqual(r.chosen, ['X']);
});

test('mwis 路径', () => {
  // X-w2 - Y-w3 - Z-w2: 取 Y:3 或 X+Z:4 => 4
  const r = treeMwis({
    nodes: [
      { id: 'X', weight: 2 },
      { id: 'Y', weight: 3 },
      { id: 'Z', weight: 2 },
    ],
    children: [
      { parent: 'X', child: 'Y' },
      { parent: 'Y', child: 'Z' },
    ],
    root: 'X',
  });
  assert.equal(r.best, 4);
});

test('mwis 负权重不取', () => {
  const r = treeMwis({ nodes: [{ id: 'X', weight: -5 }], children: [], root: 'X' });
  // take=-5, skip=0, max=0, 但 trace 中 takeThis = -5>=0 为 false, 不选
  assert.equal(r.best, 0);
  assert.deepEqual(r.chosen, []);
});
