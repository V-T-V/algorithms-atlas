import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CircularBuffer } from '../../src/algorithms/ds/circular-buffer-ds/impl.ts';

test('CircularBuffer 基本读写', () => {
  const cb = new CircularBuffer(3);
  assert.equal(cb.writeValue(1), true);
  assert.equal(cb.writeValue(2), true);
  assert.deepEqual(cb.toSequence(), [1, 2]);
  assert.equal(cb.readValue(), 1);
  assert.equal(cb.readValue(), 2);
  assert.equal(cb.isEmpty(), true);
});

test('CircularBuffer 满时阻塞写入返回 false', () => {
  const cb = new CircularBuffer(2);
  cb.writeValue(1);
  cb.writeValue(2);
  assert.equal(cb.isFull(), true);
  assert.equal(cb.writeValue(3, false), false);
  assert.deepEqual(cb.toSequence(), [1, 2]);
});

test('CircularBuffer 满时覆盖写入', () => {
  const cb = new CircularBuffer(3);
  cb.writeValue(1);
  cb.writeValue(2);
  cb.writeValue(3);
  // 覆盖
  assert.equal(cb.writeValue(4, true), true);
  assert.deepEqual(cb.toSequence(), [2, 3, 4]);
  assert.equal(cb.writeValue(5, true), true);
  assert.deepEqual(cb.toSequence(), [3, 4, 5]);
});

test('CircularBuffer 环形回绕', () => {
  const cb = new CircularBuffer(3);
  cb.writeValue(1);
  cb.writeValue(2);
  cb.readValue(); // 读出 1，read 前进
  cb.writeValue(3);
  cb.writeValue(4); // write 回绕
  assert.deepEqual(cb.toSequence(), [2, 3, 4]);
  assert.equal(cb.isFull(), true);
});

test('CircularBuffer 空读取返回 null', () => {
  const cb = new CircularBuffer(3);
  assert.equal(cb.readValue(), null);
  assert.equal(cb.peek(), null);
});

test('CircularBuffer peek 不移除', () => {
  const cb = new CircularBuffer(3);
  cb.writeValue(10);
  assert.equal(cb.peek(), 10);
  assert.equal(cb.size, 1);
});

test('CircularBuffer 钩子被调用', () => {
  let writes = 0;
  let reads = 0;
  let full = 0;
  const cb = new CircularBuffer(2);
  cb.writeValue(1, false, { onWrite: () => writes++ });
  cb.writeValue(2);
  cb.writeValue(3, false, { onFull: () => full++ }); // 满
  cb.readValue({ onRead: () => reads++ });
  assert.ok(writes >= 1, '应至少写一次');
  assert.ok(reads >= 1, '应至少读一次');
  assert.ok(full >= 1, '应触发满事件');
});
