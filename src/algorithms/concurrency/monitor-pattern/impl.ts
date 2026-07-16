// =============================================================================
// 管程模式（条件变量）· 纯算法实现（步骤序列模拟）
// 模拟一个互斥锁 + 多个条件变量。条件变量维护一个 FIFO 等待队列。
//   wait(cond)  : 调用线程进入 cond 的等待队列（释放逻辑锁）
//   signal(cond): 从 cond 队列唤醒队首线程
//   broadcast   : 唤醒 cond 队列所有线程
// =============================================================================

/** 步骤事件。 */
export interface MonitorStep {
  /** 线程 id。 */
  thread: number;
  /** 'enter' 进入管程(获取锁)；'exit' 离开；'wait' 等待条件；'signal' 唤醒；'broadcast' 唤醒全部。 */
  action: 'enter' | 'exit' | 'wait' | 'signal' | 'broadcast';
  /** 条件变量名（wait/signal/broadcast 用）。 */
  cond?: string;
}

/** 事件钩子。 */
export interface MonitorHooks {
  onEnter?: (thread: number) => void;
  onExit?: (thread: number) => void;
  onWait?: (thread: number, cond: string, queue: number[]) => void;
  onSignal?: (thread: number, cond: string, woken: number | null, queue: number[]) => void;
  onBroadcast?: (thread: number, cond: string, woken: number[], queue: number[]) => void;
}

/** 状态。 */
export interface MonitorState {
  /** 锁持有者（-1 = 空闲）。 */
  lockHolder: number;
  /** 各条件变量的等待队列。 */
  queues: Record<string, number[]>;
  /** 各线程阶段。 */
  phase: string[];
}

/**
 * 按步骤序列推进管程模拟。
 */
export function simulateMonitor(
  nThread: number,
  steps: MonitorStep[],
  hooks: MonitorHooks = {},
): MonitorState[] {
  let lockHolder = -1;
  const queues: Record<string, number[]> = {};
  const phase = new Array<string>(nThread).fill('idle');
  const snaps: MonitorState[] = [];

  const snap = (): MonitorState => ({
    lockHolder,
    queues: Object.fromEntries(Object.entries(queues).map(([k, v]) => [k, [...v]])),
    phase: [...phase],
  });

  const ensureQueue = (cond: string): number[] => {
    if (!queues[cond]) queues[cond] = [];
    return queues[cond]!;
  };

  for (const step of steps) {
    const t = step.thread;
    switch (step.action) {
      case 'enter': {
        lockHolder = t;
        phase[t] = 'inside';
        hooks.onEnter?.(t);
        break;
      }
      case 'exit': {
        if (lockHolder === t) lockHolder = -1;
        phase[t] = 'idle';
        hooks.onExit?.(t);
        break;
      }
      case 'wait': {
        const cond = step.cond!;
        const q = ensureQueue(cond);
        q.push(t);
        // 释放锁
        if (lockHolder === t) lockHolder = -1;
        phase[t] = `wait:${cond}`;
        hooks.onWait?.(t, cond, [...q]);
        break;
      }
      case 'signal': {
        const cond = step.cond!;
        const q = ensureQueue(cond);
        const woken = q.length > 0 ? q.shift()! : null;
        if (woken !== null) {
          phase[woken] = 'woken';
        }
        hooks.onSignal?.(t, cond, woken, [...q]);
        break;
      }
      case 'broadcast': {
        const cond = step.cond!;
        const q = ensureQueue(cond);
        const woken = [...q];
        q.length = 0;
        for (const w of woken) phase[w] = 'woken';
        hooks.onBroadcast?.(t, cond, woken, [...q]);
        break;
      }
    }
    snaps.push(snap());
  }

  return snaps;
}
