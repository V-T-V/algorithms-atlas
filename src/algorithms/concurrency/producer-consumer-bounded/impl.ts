// =============================================================================
// 有界缓冲（生产者-消费者 PV 经典）· 纯算法实现（事件序列模拟）
// 零 DOM 依赖，可独立单测。用 empty/full/mutex 三个信号量模拟 PV 操作，
// 跟踪缓冲区内容与各信号量值，验证不溢出/不空取。
// =============================================================================

/** 单个操作。 */
export interface BoundedOp {
  /** 'produce' 生产者尝试放入一件；'consume' 消费者尝试取走一件。 */
  type: 'produce' | 'consume';
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface BoundedHooks {
  /** 生产者开始：P(empty); P(mutex)。给出当前 empty、full、mutex 值。 */
  onProduceP?: (empty: number, full: number, mutex: number) => void;
  /** 生产者放入成功，写入产品 item 到槽位 slot。给出放入后缓冲区。 */
  onProduceV?: (item: number, slot: number, buffer: number[]) => void;
  /** 因缓冲区满（empty==0）生产者阻塞。 */
  onProducerBlock?: () => void;
  /** 消费者开始：P(full); P(mutex)。 */
  onConsumeP?: (empty: number, full: number, mutex: number) => void;
  /** 消费者取出成功，取走产品 item。给出取出后缓冲区。 */
  onConsumeV?: (item: number, buffer: number[]) => void;
  /** 因缓冲区空（full==0）消费者阻塞。 */
  onConsumerBlock?: () => void;
}

/** 三个信号量的值。 */
export interface BoundedSemaphores {
  /** 剩余空槽数。 */
  empty: number;
  /** 已用槽数。 */
  full: number;
  /** 互斥锁（0/1）。 */
  mutex: number;
}

/** 模拟结果：每个操作处理后的状态快照。 */
export interface BoundedStep {
  /** 触发本步的操作。 */
  type: BoundedOp['type'];
  /** 是否成功（false 表示阻塞）。 */
  ok: boolean;
  /** 处理后缓冲区内容（副本）。 */
  buffer: number[];
  /** 处理后信号量值。 */
  sem: BoundedSemaphores;
}

/**
 * 有界缓冲 PV 模拟：按给定操作序列推进。
 *
 * 生产者：P(empty); P(mutex); 写入; V(mutex); V(full)
 * 消费者：P(full); P(mutex); 取出; V(mutex); V(empty)
 *
 * 阻塞（满/空）时本步 ok=false，信号量与缓冲区不变（在确定性模拟里事件被「丢弃」）。
 *
 * @param capacity 缓冲区容量（>= 1）
 * @param ops 操作序列
 * @param hooks 可选事件钩子
 * @returns 每步状态快照
 */
export function simulateBoundedBuffer(
  capacity: number,
  ops: BoundedOp[],
  hooks: BoundedHooks = {},
): BoundedStep[] {
  const cap = Math.max(1, Math.floor(capacity));
  const buffer: number[] = [];
  const sem: BoundedSemaphores = { empty: cap, full: 0, mutex: 1 };
  let product = 0; // 自增产品编号
  const steps: BoundedStep[] = [];

  for (const op of ops) {
    if (op.type === 'produce') {
      hooks.onProduceP?.(sem.empty, sem.full, sem.mutex);
      // P(empty)
      if (sem.empty <= 0) {
        hooks.onProducerBlock?.();
        steps.push({ type: 'produce', ok: false, buffer: [...buffer], sem: { ...sem } });
        continue;
      }
      sem.empty--;
      // P(mutex)
      sem.mutex--;
      // 写入
      const slot = buffer.length;
      const item = product;
      buffer.push(item);
      hooks.onProduceV?.(item, slot, [...buffer]);
      product++;
      // V(mutex); V(full)
      sem.mutex++;
      sem.full++;
      steps.push({ type: 'produce', ok: true, buffer: [...buffer], sem: { ...sem } });
    } else {
      hooks.onConsumeP?.(sem.empty, sem.full, sem.mutex);
      // P(full)
      if (sem.full <= 0) {
        hooks.onConsumerBlock?.();
        steps.push({ type: 'consume', ok: false, buffer: [...buffer], sem: { ...sem } });
        continue;
      }
      sem.full--;
      // P(mutex)
      sem.mutex--;
      // 取出（FIFO）
      const item = buffer.shift()!;
      hooks.onConsumeV?.(item, [...buffer]);
      // V(mutex); V(empty)
      sem.mutex++;
      sem.empty++;
      steps.push({ type: 'consume', ok: true, buffer: [...buffer], sem: { ...sem } });
    }
  }

  return steps;
}
