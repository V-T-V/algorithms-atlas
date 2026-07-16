import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LinkedList } from '../../src/algorithms/design/design-iterator-pattern/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/design/design-iterator-pattern/trace.ts';

test('iterator 正向遍历', () => {
  const l = new LinkedList();
  l.push(1);
  l.push(2);
  l.push(3);
  const it = l.forwardIterator();
  const out: number[] = [];
  while (it.hasNext()) out.push(it.next());
  assert.deepEqual(out, [1, 2, 3]);
});
test('iterator 反向遍历', () => {
  const l = new LinkedList();
  l.push(1);
  l.push(2);
  l.push(3);
  const it = l.reverseIterator();
  const out: number[] = [];
  while (it.hasNext()) out.push(it.next());
  assert.deepEqual(out, [3, 2, 1]);
});
test('iterator 空链表', () => {
  const l = new LinkedList();
  const it = l.forwardIterator();
  assert.equal(it.hasNext(), false);
});
test('iterator 越界抛错', () => {
  const l = new LinkedList();
  l.push(1);
  const it = l.forwardIterator();
  it.next();
  assert.throws(() => it.next());
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
