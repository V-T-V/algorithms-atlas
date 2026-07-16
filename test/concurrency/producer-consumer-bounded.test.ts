import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateBoundedBuffer } from '../../src/algorithms/concurrency/producer-consumer-bounded/impl.ts';

test('bounded-buffer 缓冲区不溢出：满后 produce 阻塞', () => {
  const steps = simulateBoundedBuffer(3, [
    { type: 'produce' },
    { type: 'produce' },
    { type: 'produce' }, // 满
    { type: 'produce' }, // 应阻塞
  ]);
  assert.equal(steps[3]!.ok, false);
  assert.equal(steps[3]!.sem.full, 3);
  assert.equal(steps[3]!.buffer.length, 3);
});

test('bounded-buffer 缓冲区不空取：空时 consume 阻塞', () => {
  const steps = simulateBoundedBuffer(2, [{ type: 'consume' }]);
  assert.equal(steps[0]!.ok, false);
  assert.equal(steps[0]!.sem.full, 0);
});

test('bounded-buffer FIFO 消费顺序', () => {
  const consumed: number[] = [];
  simulateBoundedBuffer(
    3,
    [{ type: 'produce' }, { type: 'produce' }, { type: 'consume' }, { type: 'consume' }],
    {
      onConsumeV: (item) => consumed.push(item),
    },
  );
  assert.deepEqual(consumed, [0, 1]); // 先入先出
});

test('bounded-buffer 信号量约束：empty+full == capacity 恒成立', () => {
  const steps = simulateBoundedBuffer(4, [
    { type: 'produce' },
    { type: 'produce' },
    { type: 'consume' },
    { type: 'produce' },
    { type: 'produce' },
    { type: 'produce' },
    { type: 'consume' },
  ]);
  for (const s of steps) {
    assert.equal(s.sem.empty + s.sem.full, 4, `不变量违反：empty+full=${s.sem.empty + s.sem.full}`);
  }
});

test('bounded-buffer 满载生产后逐个消费清空', () => {
  const steps = simulateBoundedBuffer(2, [
    { type: 'produce' },
    { type: 'produce' },
    { type: 'consume' },
    { type: 'consume' },
  ]);
  const last = steps[steps.length - 1]!;
  assert.equal(last.buffer.length, 0);
  assert.equal(last.sem.full, 0);
  assert.equal(last.sem.empty, 2);
  assert.ok(steps.every((s) => s.ok));
});

test('bounded-buffer mutex 始终在 0/1 之间', () => {
  const steps = simulateBoundedBuffer(3, [
    { type: 'produce' },
    { type: 'consume' },
    { type: 'produce' },
  ]);
  for (const s of steps) {
    assert.ok(s.sem.mutex === 0 || s.sem.mutex === 1, `mutex 非法值：${s.sem.mutex}`);
  }
});
