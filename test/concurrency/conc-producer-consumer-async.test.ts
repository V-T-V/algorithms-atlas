import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateProducerConsumer } from '../../src/algorithms/concurrency/conc-producer-consumer-async/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-producer-consumer-async/trace.ts';

test('conc-producer-consumer-async 空队列消费会阻塞', () => {
  const steps = simulateProducerConsumer([{ who: 'consumer', action: 'consume' }]);
  assert.equal(steps[0]!.blockedConsumers, 1);
});

test('conc-producer-consumer-async 满队列生产会阻塞', () => {
  const steps = simulateProducerConsumer(
    [
      { who: 'producer', action: 'produce' },
      { who: 'producer', action: 'produce' },
      { who: 'producer', action: 'produce' },
      { who: 'producer', action: 'produce' }, // 满
    ],
    3,
  );
  assert.equal(steps[3]!.blockedProducers, 1);
});

test('conc-producer-consumer-async 生产唤醒阻塞消费者', () => {
  const steps = simulateProducerConsumer([
    { who: 'consumer', action: 'consume' },
    { who: 'producer', action: 'produce' },
  ]);
  assert.equal(steps[0]!.blockedConsumers, 1);
  assert.equal(steps[1]!.blockedConsumers, 0);
});

test('conc-producer-consumer-async trace', () => {
  assert.ok(buildTrace().length > 2);
});
