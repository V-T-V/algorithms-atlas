import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  producerConsumer,
  altEvents,
  type PcEvent,
} from '../../src/algorithms/concurrency/producer-consumer/impl.ts';
import {
  buildTrace,
  DEFAULT_CAPACITY,
} from '../../src/algorithms/concurrency/producer-consumer/trace.ts';

test('producer-consumer 交替生产消费：无阻塞，产量正确', () => {
  const evs = altEvents(3); // P0,C0,P1,C1,P2,C2
  const r = producerConsumer(2, evs);
  assert.equal(r.produced.length, 3);
  assert.equal(r.producerBlocks, 0);
  assert.equal(r.consumerBlocks, 0);
  // 生产的产品按序被消费
  assert.deepEqual(r.produced, [0, 1, 2]);
});

test('producer-consumer 缓冲区满时生产者阻塞', () => {
  // 容量 2，连产 4 个：后两个应阻塞
  const evs: PcEvent[] = [
    { type: 'produce', actor: 0 },
    { type: 'produce', actor: 1 },
    { type: 'produce', actor: 2 }, // 满，阻塞
    { type: 'produce', actor: 3 }, // 满，阻塞
  ];
  const r = producerConsumer(2, evs);
  assert.equal(r.produced.length, 2);
  assert.equal(r.producerBlocks, 2);
  assert.equal(r.consumerBlocks, 0);
});

test('producer-consumer 缓冲区空时消费者阻塞', () => {
  const evs: PcEvent[] = [
    { type: 'consume', actor: 0 }, // 空，阻塞
    { type: 'consume', actor: 1 }, // 空，阻塞
  ];
  const r = producerConsumer(2, evs);
  assert.equal(r.produced.length, 0);
  assert.equal(r.consumerBlocks, 2);
  assert.equal(r.producerBlocks, 0);
});

test('producer-consumer 生产后唤醒等待的消费者', () => {
  // 容量 2：先消费（阻塞）→ 生产（应成功且唤醒）→ 再消费（成功）
  const evs: PcEvent[] = [
    { type: 'consume', actor: 0 }, // 阻塞
    { type: 'produce', actor: 0 }, // 放入并唤醒
    { type: 'consume', actor: 1 }, // 成功
  ];
  const r = producerConsumer(2, evs);
  assert.equal(r.consumerBlocks, 1, '首次消费应阻塞一次');
  assert.equal(r.produced.length, 1);
});

test('producer-consumer 产品编号单调递增', () => {
  const r = producerConsumer(3, altEvents(4));
  for (let i = 0; i < r.produced.length; i++) {
    assert.equal(r.produced[i], i, `产品 ${i} 编号应为 ${i}`);
  }
});

test('producer-consumer 钩子被调用且数量匹配', () => {
  let tryP = 0;
  let tryC = 0;
  let produce = 0;
  let consume = 0;
  let blockP = 0;
  let blockC = 0;
  producerConsumer(2, altEvents(3), {
    onProduceTry: () => tryP++,
    onConsumeTry: () => tryC++,
    onProduce: () => produce++,
    onConsume: () => consume++,
    onProducerBlock: () => blockP++,
    onConsumerBlock: () => blockC++,
  });
  assert.equal(tryP, 3);
  assert.equal(tryC, 3);
  assert.equal(produce, 3);
  assert.equal(consume, 3);
  assert.equal(blockP, 0);
  assert.equal(blockC, 0);
});

test('producer-consumer 容量<=0 归一为 1', () => {
  const r = producerConsumer(0, altEvents(2));
  assert.equal(r.produced.length, 2);
  assert.equal(r.producerBlocks, 0);
});

test('buildTrace 含 array 与 aux，末帧为终态', () => {
  const frames = buildTrace(DEFAULT_CAPACITY);
  assert.ok(frames.length >= 3);
  const first = frames[0]!;
  assert.ok(first.array, '首帧含 array（缓冲区）');
  assert.ok(first.aux, '首帧含 aux（信号量）');
  const last = frames[frames.length - 1]!;
  // 末帧缓冲区应全空（值为 -1）
  assert.ok(last.array);
  assert.ok(
    last.array!.values.every((v) => v === -1),
    '末帧缓冲区应全空',
  );
});
