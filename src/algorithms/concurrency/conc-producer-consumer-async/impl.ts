// 异步生产消费 · 实现

export interface PcEvent {
  who: 'producer' | 'consumer';
  action: 'produce' | 'consume';
}

export interface PcStep {
  who: string;
  action: string;
  queue: number[];
  blockedProducers: number;
  blockedConsumers: number;
  totalProduced: number;
  totalConsumed: number;
}

export interface PcHooks {
  onProduce?: (item: number) => void;
  onConsume?: (item: number) => void;
  onBlockProducer?: () => void;
  onBlockConsumer?: () => void;
}

export function simulateProducerConsumer(
  events: PcEvent[],
  capacity = 3,
  hooks: PcHooks = {},
): PcStep[] {
  const queue: number[] = [];
  let blockedProducers = 0;
  let blockedConsumers = 0;
  let totalProduced = 0;
  let totalConsumed = 0;
  let itemId = 0;
  const steps: PcStep[] = [];

  for (const ev of events) {
    if (ev.action === 'produce') {
      if (queue.length < capacity) {
        const item = itemId++;
        queue.push(item);
        totalProduced++;
        hooks.onProduce?.(item);
        // 唤醒一个等待消费者
        if (blockedConsumers > 0) {
          blockedConsumers--;
          const item2 = queue.shift()!;
          totalConsumed++;
          hooks.onConsume?.(item2);
        }
      } else {
        blockedProducers++;
        hooks.onBlockProducer?.();
      }
    } else {
      if (queue.length > 0) {
        const item = queue.shift()!;
        totalConsumed++;
        hooks.onConsume?.(item);
        // 唤醒一个等待生产者
        if (blockedProducers > 0) {
          blockedProducers--;
          const item3 = itemId++;
          queue.push(item3);
          totalProduced++;
          hooks.onProduce?.(item3);
        }
      } else {
        blockedConsumers++;
        hooks.onBlockConsumer?.();
      }
    }
    steps.push({
      who: ev.who,
      action: ev.action,
      queue: [...queue],
      blockedProducers,
      blockedConsumers,
      totalProduced,
      totalConsumed,
    });
  }
  return steps;
}
