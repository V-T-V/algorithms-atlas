import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RingBuffer, ringBuffer } from '../../src/algorithms/ds/ring-buffer/impl.ts';
import { buildTrace } from '../../src/algorithms/ds/ring-buffer/trace.ts';

test('ring-buffer 基本 FIFO', () => {
  const rb = new RingBuffer(4);
  rb.writeValue(1);
  rb.writeValue(2);
  rb.writeValue(3);
  assert.equal(rb.size, 3);
  assert.equal(rb.readValue(), 1);
  assert.equal(rb.readValue(), 2);
  assert.equal(rb.readValue(), 3);
  assert.equal(rb.readValue(), undefined);
  assert.equal(rb.isEmpty(), true);
});

test('ring-buffer 便利函数', () => {
  // 写入 [1,2,3]，读出 1，再写入 4 → 读出序列 [1]
  assert.deepEqual(ringBuffer(4, [1, 2, 3, null]), [1]);
  assert.deepEqual(ringBuffer(4, []), []);
});

test('ring-buffer 写满后丢弃新数据', () => {
  const rb = new RingBuffer(3);
  assert.equal(rb.writeValue(1), true);
  assert.equal(rb.writeValue(2), true);
  assert.equal(rb.writeValue(3), true);
  assert.equal(rb.isFull(), true);
  assert.equal(rb.writeValue(4), false); // 满，丢弃
  assert.equal(rb.size, 3);
  assert.equal(rb.readValue(), 1);
});

test('ring-buffer 环绕：读写交替指针回绕', () => {
  const rb = new RingBuffer(3);
  rb.writeValue(1);
  rb.writeValue(2);
  rb.writeValue(3);
  // 读出 2 个，read 推进到 2
  assert.equal(rb.readValue(), 1);
  assert.equal(rb.readValue(), 2);
  // 再写入，write 从 0 环绕回... 实际 write 已在 0 附近
  rb.writeValue(4);
  rb.writeValue(5); // 现在 write 环绕
  assert.equal(rb.isFull(), true);
  // 顺序应为 3,4,5
  assert.deepEqual(rb.toSequence(), [3, 4, 5]);
  assert.equal(rb.readValue(), 3);
  assert.equal(rb.readValue(), 4);
  assert.equal(rb.readValue(), 5);
});

test('ring-buffer toSequence 保持 read→write 顺序', () => {
  const rb = new RingBuffer(4);
  rb.writeValue(1);
  rb.writeValue(2);
  rb.readValue(); // 读 1
  rb.writeValue(3);
  rb.writeValue(4);
  assert.deepEqual(rb.toSequence(), [2, 3, 4]);
});

test('ring-buffer peek 不读取', () => {
  const rb = new RingBuffer(4);
  rb.writeValue(7);
  rb.writeValue(8);
  assert.equal(rb.peek(), 7);
  assert.equal(rb.size, 2);
  assert.equal(rb.peek(), 7);
});

test('ring-buffer 钩子被调用', () => {
  let writes = 0;
  let reads = 0;
  let overflows = 0;
  const rb = new RingBuffer(2);
  rb.writeValue(1, { onWrite: () => writes++ });
  rb.writeValue(2, { onWrite: () => writes++ });
  rb.writeValue(3, { onOverflow: () => overflows++ }); // 满
  rb.readValue({ onRead: () => reads++ });
  assert.equal(writes, 2);
  assert.equal(overflows, 1);
  assert.equal(reads, 1);
});

test('ring-buffer buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars!.every((b) => b.role === 'final'));
});
