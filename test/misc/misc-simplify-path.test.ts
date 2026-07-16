import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscSimplifyPath } from '../../src/algorithms/misc/misc-simplify-path/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-simplify-path/trace.ts';
test('simplify "/home//foo/"="/home/foo"', () => {
  assert.equal(miscSimplifyPath('/home//foo/'), '/home/foo');
});
test('simplify "/a/./b/../../c/"="/c"', () => {
  assert.equal(miscSimplifyPath('/a/./b/../../c/'), '/c');
});
test('simplify "/../"="/"', () => {
  assert.equal(miscSimplifyPath('/../'), '/');
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
