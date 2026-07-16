// =============================================================================
// 生产者-消费者（Producer-Consumer）· 纯算法实现（确定性事件序列模拟）
// 零 DOM 依赖，可独立单测。用「信号量」概念，按预定事件序列推进状态机，
// 不真起多线程，便于录制与测试。
// =============================================================================

/** 一个事件：某生产者生产一件产品 / 某消费者取走一件产品。 */
export interface PcEvent {
  /** 'produce' 生产者尝试放入；'consume' 消费者尝试取走。 */
  type: 'produce' | 'consume';
  /** 角色 id（生产者 P0..Pn / 消费者 C0..Cm）。 */
  actor: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface ProducerConsumerHooks {
  /** 生产者 actor 尝试放入产品 item。 */
  onProduceTry?: (actor: number, item: number) => void;
  /** 因缓冲区满，生产者阻塞等待。 */
  onProducerBlock?: (actor: number) => void;
  /** 产品 item 成功放入缓冲区 slot。 */
  onProduce?: (actor: number, item: number, slot: number) => void;
  /** 消费者 actor 尝试取走。 */
  onConsumeTry?: (actor: number) => void;
  /** 因缓冲区空，消费者阻塞等待。 */
  onConsumerBlock?: (actor: number) => void;
  /** 消费者取走产品 item。 */
  onConsume?: (actor: number, item: number) => void;
}

export interface ProducerConsumerResult {
  /** 成功生产并入缓冲的产品序列（= 被消费的产品序列）。 */
  produced: number[];
  /** 因缓冲区满而阻塞的次数。 */
  producerBlocks: number;
  /** 因缓冲区空而阻塞的次数。 */
  consumerBlocks: number;
}

/**
 * 生产者-消费者：用「信号量」概念做确定性模拟。
 *
 * 模型：\n
 * - 一个容量为 `capacity` 的环形缓冲区（FIFO 队列）\n
 * - 信号量 *empty* = 剩余空槽数（初值 capacity），*full* = 已用槽数（初值 0）\n
 * - 生产：若 empty>0 则 empty--, 写入产品 full++；否则阻塞（记录一次 block）\n
 * - 消费：若 full>0 则 full--, 取出产品 empty++；否则阻塞（记录一次 block）\n
 *
 * 这里不真并发：按给定 `events` 顺序逐个处理，每个事件即时反映信号量与缓冲区状态。
 * 这样帧序列确定，便于可视化与测试。
 *
 * @param capacity 缓冲区容量
 * @param events 预定事件序列（produce / consume）
 * @param hooks 可选事件钩子
 * @returns 统计结果
 */
export function producerConsumer(
  capacity: number,
  events: PcEvent[],
  hooks: ProducerConsumerHooks = {},
): ProducerConsumerResult {
  if (capacity <= 0) capacity = 1;
  const buffer: number[] = []; // 当作 FIFO 队列
  let empty = capacity; // 空槽数
  let full = 0; // 已用槽数
  let product = 0; // 自增的产品编号
  const produced: number[] = [];
  let producerBlocks = 0;
  let consumerBlocks = 0;
  // 阻塞队列：因满阻塞的生产者 / 因空阻塞的消费者（这里只统计，事件丢失）
  const blockedProducers: number[] = [];
  const blockedConsumers: number[] = [];

  for (const ev of events) {
    if (ev.type === 'produce') {
      hooks.onProduceTry?.(ev.actor, product);
      if (empty > 0) {
        const slot = buffer.length;
        buffer.push(product);
        empty--;
        full++;
        hooks.onProduce?.(ev.actor, product, slot);
        produced.push(product);
        product++;
        // 唤醒一个等待的消费者（如有）：本确定性模拟里，先唤醒则下一个消费事件直接成功
        if (blockedConsumers.length > 0) blockedConsumers.shift();
      } else {
        producerBlocks++;
        blockedProducers.push(ev.actor);
        hooks.onProducerBlock?.(ev.actor);
      }
    } else {
      hooks.onConsumeTry?.(ev.actor);
      if (full > 0) {
        const item = buffer.shift()!;
        empty++;
        full--;
        hooks.onConsume?.(ev.actor, item);
        // 唤醒一个等待的生产者
        if (blockedProducers.length > 0) blockedProducers.shift();
      } else {
        consumerBlocks++;
        blockedConsumers.push(ev.actor);
        hooks.onConsumerBlock?.(ev.actor);
      }
    }
  }

  return { produced, producerBlocks, consumerBlocks };
}

/** 便捷：交替生成 n 个生产 + n 个消费事件，生产者 P0..，消费者 C0..。 */
export function altEvents(n: number): PcEvent[] {
  const evs: PcEvent[] = [];
  for (let i = 0; i < n; i++) {
    evs.push({ type: 'produce', actor: i });
    evs.push({ type: 'consume', actor: i });
  }
  return evs;
}
