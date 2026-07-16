// =============================================================================
// 汇合点同步（两线程对称交换）· 纯算法实现（步骤序列模拟）
// 零 DOM 依赖。两把信号量 aArrived/bArrived 初值 0：
//   A: a1; signal(aArrived); wait(bArrived); a2;
//   B: b1; signal(bArrived); wait(aArrived); b2;
// arrive 即 signal 自己的信号量；proceed 即 wait 对方的信号量。
// =============================================================================

/** 步骤事件。 */
export interface RendezvousStep {
  /** 线程名。 */
  thread: 'A' | 'B';
  /** 'pre' 执行 a1/b1；'arrive' signal 自己到达；'proceed' wait 对方到达后执行 a2/b2。 */
  action: 'pre' | 'arrive' | 'proceed';
}

/** 事件钩子。 */
export interface RendezvousHooks {
  /** signal 自己的信号量（value 变为 v）。 */
  onArrive?: (thread: 'A' | 'B', sem: 'aArrived' | 'bArrived', value: number) => void;
  /** 成功 wait 对方信号量（value 变为 v，可能 0）；若阻塞则记录阻塞。 */
  onProceed?: (
    thread: 'A' | 'B',
    sem: 'aArrived' | 'bArrived',
    value: number,
    blocked: boolean,
  ) => void;
  /** 线程执行 pre 阶段。 */
  onPre?: (thread: 'A' | 'B') => void;
}

/** 状态。 */
export interface RendezvousState {
  /** 两把信号量的值。 */
  aArrived: number;
  bArrived: number;
  /** 各线程所处阶段：'idle'|'pre'|'arrived'|'done'。 */
  phase: { A: Phase; B: Phase };
  /** 各线程是否当前阻塞（在 proceed 时对方尚未到达）。 */
  blocked: { A: boolean; B: boolean };
}

type Phase = 'idle' | 'pre' | 'arrived' | 'done';

/**
 * 按步骤序列推进汇合点模拟。
 * arrive: signal(自己) —— value++，且若对方正在阻塞等待，则唤醒对方。
 * proceed: wait(对方) —— 若对方信号量>0 则消费一个（value--）并通过；否则本线程阻塞，
 *          待对方 arrive 时被唤醒。
 */
export function simulateRendezvous(
  steps: RendezvousStep[],
  hooks: RendezvousHooks = {},
): RendezvousState[] {
  let aArrived = 0;
  let bArrived = 0;
  const phase: { A: Phase; B: Phase } = { A: 'idle', B: 'idle' };
  const blocked: { A: boolean; B: boolean } = { A: false, B: false };
  const snaps: RendezvousState[] = [];

  const snap = (): RendezvousState => ({
    aArrived,
    bArrived,
    phase: { A: phase.A, B: phase.B },
    blocked: { A: blocked.A, B: blocked.B },
  });

  for (const step of steps) {
    const { thread, action } = step;
    const other = thread === 'A' ? 'B' : 'A';
    if (action === 'pre') {
      phase[thread] = 'pre';
      hooks.onPre?.(thread);
    } else if (action === 'arrive') {
      phase[thread] = 'arrived';
      // signal 自己的信号量
      if (thread === 'A') {
        aArrived += 1;
        hooks.onArrive?.(thread, 'aArrived', aArrived);
      } else {
        bArrived += 1;
        hooks.onArrive?.(thread, 'bArrived', bArrived);
      }
      // 若对方阻塞等待我的信号，唤醒并让它通过（消费一个）
      if (blocked[other]) {
        blocked[other] = false;
        if (thread === 'A') {
          aArrived -= 1;
          phase.B = 'done';
          hooks.onProceed?.('B', 'aArrived', aArrived, false);
        } else {
          bArrived -= 1;
          phase.A = 'done';
          hooks.onProceed?.('A', 'bArrived', bArrived, false);
        }
      }
    } else {
      // proceed: wait 对方的信号量
      const otherSem = thread === 'A' ? bArrived : aArrived;
      const semName = thread === 'A' ? 'bArrived' : 'aArrived';
      if (otherSem > 0) {
        // 立即通过，消费一个
        if (thread === 'A') {
          bArrived -= 1;
          hooks.onProceed?.(thread, 'bArrived', bArrived, false);
        } else {
          aArrived -= 1;
          hooks.onProceed?.(thread, 'aArrived', aArrived, false);
        }
        phase[thread] = 'done';
      } else {
        // 阻塞
        blocked[thread] = true;
        hooks.onProceed?.(thread, semName, otherSem, true);
      }
    }
    snaps.push(snap());
  }

  return snaps;
}
