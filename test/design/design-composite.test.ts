import { test } from 'node:test';
import assert from 'node:assert/strict';
import { File, Directory } from '../../src/algorithms/design/design-composite/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-composite/trace.ts';

test('composite 叶子 size', () => {
  assert.equal(new File('a', 10).size(), 10);
});
test('composite 目录 size 求和', () => {
  const d = new Directory('d').add(new File('a', 10)).add(new File('b', 20));
  assert.equal(d.size(), 30);
});
test('composite 嵌套目录', () => {
  const root = new Directory('root');
  const sub = new Directory('sub').add(new File('x', 5));
  root.add(sub).add(new File('y', 7));
  assert.equal(root.size(), 12);
});
test('composite count 节点数', () => {
  const root = new Directory('root').add(new File('a', 1)).add(new File('b', 1));
  assert.equal(root.count(), 3); // root + 2 files
});
test('composite 统一接口', () => {
  const file: { size(): number } = new File('a', 3);
  const dir: { size(): number } = new Directory('d');
  // 都有 size() 接口
  assert.equal(typeof file.size, 'function');
  assert.equal(typeof dir.size, 'function');
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
