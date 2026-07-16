// =============================================================================
// 面包店算法（Lamport Bakery Algorithm）· 纯算法实现（事件序列模拟）
// 零 DOM 依赖，可独立单测。n 线程互斥：取号 + 字典序排队。
// 真实算法依赖共享变量的非原子读写与 choosing 标记；这里用确定性「请求序列」模拟，
// 保证任意时刻至多一个线程在临界区，便于验证互斥性。
// =============================================================================

/** 单个请求事件。 */
export interface BakeryRequest {
  /** 发起线程 id（0..nThreads-1）。 */
  thread: number;
  /** 'lock' 取号并尝试进入；'critical' 已在临界区（模拟执行）；'unlock' 退出临界区。 */
  action: 'lock' | 'critical' | 'unlock';
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface BakeryHooks {
  /** 线程 thread 取号 ticket。 */
  onTakeNumber?: (thread: number, ticket: number) => void;
  /** 线程 thread 在等待（未轮到自己）。给出当前它需要等待的线程集合。 */
  onWait?: (thread: number, blockedBy: number[]) => void;
  /** 线程 thread 进入临界区。 */
  onEnter?: (thread: number) => void;
  /** 线程 thread 退出临界区（号牌清零）。 */
  onLeave?: (thread: number) => void;
}

/** 线程状态。 */
export type BakeryThreadState = 'idle' | 'choosing' | 'waiting' | 'critical';

/** 模拟中线程的内部状态。 */
export interface BakeryThread {
  thread: number;
  ticket: number;
  state: BakeryThreadState;
}

/** 模拟结果：每个请求处理后的状态快照。 */
export interface BakeryStep {
  /** 触发本步的线程与动作。 */
  thread: number;
  action: BakeryRequest['action'];
  /** 处理后各线程号牌（0 表示未取号）。 */
  numbers: number[];
  /** 处理后各线程状态。 */
  states: BakeryThreadState[];
  /** 当前在临界区的线程（-1 表示无）。 */
  inCritical: number;
}

/**
 * 判断线程 i 是否「可以进入」：对所有 j != i，number[j]==0 或 (number[i],i) < (number[j],j)。
 * （choosing 模拟为瞬时完成，故略去 choosing 检查；互斥性由号牌+字典序保证。）
 */
function canEnter(number: number[], i: number): boolean {
  const ni = number[i]!;
  for (let j = 0; j < number.length; j++) {
    if (j === i) continue;
    const nj = number[j]!;
    if (nj === 0) continue;
    // (ni, i) < (nj, j) ?
    if (ni > nj || (ni === nj && i > j)) return false;
  }
  return true;
}

/**
 * 面包店互斥模拟：按给定请求序列推进。
 *
 * @param nThreads 线程数
 * @param requests 请求序列（lock/critical/unlock）
 * @param hooks 可选事件钩子
 * @returns 每步状态快照
 */
export function bakeryLock(
  nThreads: number,
  requests: BakeryRequest[],
  hooks: BakeryHooks = {},
): BakeryStep[] {
  const number: number[] = new Array(nThreads).fill(0);
  const states: BakeryThreadState[] = new Array(nThreads).fill('idle');
  let inCritical = -1;
  let ticketCounter = 0;
  const steps: BakeryStep[] = [];

  const snapshot = (thread: number, action: BakeryRequest['action']): BakeryStep => {
    const step: BakeryStep = {
      thread,
      action,
      numbers: [...number],
      states: [...states],
      inCritical,
    };
    steps.push(step);
    return step;
  };

  for (const req of requests) {
    const { thread, action } = req;
    if (action === 'lock') {
      // 取号
      ticketCounter++;
      number[thread] = ticketCounter;
      states[thread] = 'waiting';
      hooks.onTakeNumber?.(thread, ticketCounter);
      // 判断能否进入
      const blockedBy: number[] = [];
      for (let j = 0; j < nThreads; j++) {
        if (j === thread) continue;
        const nj = number[j]!;
        if (nj === 0) continue;
        const ni = number[thread]!;
        if (ni > nj || (ni === nj && thread > j)) blockedBy.push(j);
      }
      if (canEnter(number, thread)) {
        states[thread] = 'critical';
        inCritical = thread;
        hooks.onEnter?.(thread);
      } else {
        hooks.onWait?.(thread, blockedBy);
      }
      snapshot(thread, action);
    } else if (action === 'critical') {
      // 模拟临界区执行（号牌不变，状态应为 critical）
      snapshot(thread, action);
    } else {
      // unlock：号牌清零
      number[thread] = 0;
      states[thread] = 'idle';
      if (inCritical === thread) inCritical = -1;
      hooks.onLeave?.(thread);
      // 释放后，唤醒等待队列中号牌最小者进入（确定性模拟）
      let best = -1;
      for (let j = 0; j < nThreads; j++) {
        if (number[j]! > 0 && states[j]! === 'waiting') {
          if (best === -1) {
            best = j;
          } else {
            const nb = number[best]!;
            const nj = number[j]!;
            if (nj < nb || (nj === nb && j < best)) best = j;
          }
        }
      }
      if (best !== -1) {
        states[best] = 'critical';
        inCritical = best;
        hooks.onEnter?.(best);
      }
      snapshot(thread, action);
    }
  }

  return steps;
}
