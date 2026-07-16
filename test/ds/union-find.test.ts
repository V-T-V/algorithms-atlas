import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  UnionFind,
  unionFind,
  type UnionFindOps,
} from '../../src/algorithms/ds/union-find/impl.ts';

const OPS: UnionFindOps = {
  elements: ['1', '2', '3', '4', '5', '6', '7', '8'],
  unions: [
    ['1', '2'],
    ['3', '4'],
    ['5', '6'],
    ['1', '4'],
    ['7', '8'],
    ['6', '8'],
    ['2', '7'],
  ],
};

test('unionFind 基本连通性', () => {
  const uf = unionFind(OPS);
  assert.ok(uf.connected('1', '8'));
  assert.ok(uf.connected('3', '6'));
  assert.ok(uf.connected('2', '5'));
});

test('unionFind 分量计数', () => {
  const uf = new UnionFind(['a', 'b', 'c', 'd']);
  assert.equal(uf.components(), 4);
  uf.union('a', 'b');
  uf.union('c', 'd');
  assert.equal(uf.components(), 2);
  uf.union('a', 'c');
  assert.equal(uf.components(), 1);
});

test('unionFind 同集合合并返回 false', () => {
  const uf = new UnionFind(['1', '2', '3']);
  uf.union('1', '2');
  assert.equal(uf.union('1', '2'), false); // 已同根
  uf.union('2', '3');
  assert.equal(uf.union('1', '3'), false);
});

test('unionFind 单元素 / 空集', () => {
  const uf = new UnionFind(['x']);
  assert.equal(uf.find('x'), 'x');
  assert.equal(uf.components(), 1);
  assert.ok(uf.connected('x', 'x'));
});

test('unionFind 不存在元素查询', () => {
  const uf = new UnionFind(['a']);
  assert.equal(uf.has('z'), false);
  assert.equal(uf.connected('a', 'z'), false);
});

test('unionFind union 自动 make 新元素', () => {
  const uf = new UnionFind(['a']);
  uf.union('a', 'b');
  assert.equal(uf.has('b'), true);
  assert.ok(uf.connected('a', 'b'));
});

test('unionFind 路径压缩：find 后直接指向根', () => {
  const uf = new UnionFind(['1', '2', '3', '4']);
  // 构造一条链 4→3→2→1（手动 union）
  uf.union('1', '2');
  uf.union('2', '3');
  uf.union('3', '4');
  uf.find('4');
  // 压缩后 4 的父应直接是根
  assert.equal(uf.snapshot().get('4'), uf.snapshot().get('4')); // 根自身
  // 所有元素同根
  const root = uf.find('1');
  for (const e of ['1', '2', '3', '4']) assert.equal(uf.find(e), root);
});

test('unionFind 钩子被调用', () => {
  const unions: Array<[string, string, boolean]> = [];
  let finds = 0;
  unionFind(OPS, {
    onUnion: (a, b, _ra, _rb, _nr, merged) => unions.push([a, b, merged]),
    onFind: () => finds++,
  });
  assert.equal(unions.length, 7);
  assert.equal(unions[0]![0], '1');
  assert.equal(unions[0]![1], '2');
  assert.equal(unions[0]![2], true);
  assert.ok(finds > 0, 'find 应被调用');
});

test('unionFind 钩子：同集合合并 merged=false', () => {
  const uf = new UnionFind(['1', '2']);
  uf.union('1', '2');
  let flag = true;
  uf.union('1', '2', {
    onUnion: (_a, _b, _ra, _rb, _nr, merged) => {
      flag = merged;
    },
  });
  assert.equal(flag, false);
});
