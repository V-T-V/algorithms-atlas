// =============================================================================
// Peterson 算法 · 纯算法实现（步骤序列模拟）
// 零 DOM 依赖，可独立单测。两线程互斥：flag[2] + turn。
// 真实算法依赖共享变量读写交错；这里用确定性「步骤序列」模拟两个线程的
// lock / critical / unlock，每次 lock 时检查 Peterson 进入条件，保证互斥。
// =============================================================================

/** 单个步骤事件。 */
export interface PetersonStep {
  /** 线程 id（仅 0 或 1）。 */
  thread: 0 | 1;
  /** 'lock' 设置 flag+turn 并尝试进入；'critical' 在临界区；'unlock' 退出。 */
  action: 'lock' | 'critical' | 'unlock';
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface PetersonHooks {
  /** 线程 i 设置 flag[i]=true（想进）。给出当前 flag、turn。 */
  onFlag?: (thread: 0 | 1, flag: [boolean, boolean], turn: 0 | 1) => void;
  /** 线程 i 设置 turn=1-i（谦让）。给出当前 turn。 */
  onYield?: (thread: 0 | 1, turn: 0 | 1) => void;
  /** 线程 i 因对方想进且 turn 不在自己手上而等待。 */
  onWait?: (thread: 0 | 1) => void;
  /** 线程 i 进入临界区。 */
  onEnter?: (thread: 0 | 1) => void;
  /** 线程 i 退出临界区（flag[i]=false）。 */
  onLeave?: (thread: 0 | 1) => void;
}

/** Peterson 状态。 */
export interface PetersonState {
  flag: [boolean, boolean];
  turn: 0 | 1;
  /** 当前在临界区的线程（-1 表示无）。 */
  inCritical: number;
  /** 各线程逻辑状态：'idle'|'wanting'|'waiting'|'critical'。 */
  states: [
    'idle' | 'wanting' | 'waiting' | 'critical',
    'idle' | 'wanting' | 'waiting' | 'critical',
  ];
}

/**
 * Peterson 进入条件：线程 i 能进入当且仅当 对方不想进 (flag[1-i]==false) 或 turn==i。
 * （对方谦让后，turn 在我手上，我即可进；否则继续等。）
 */
function canEnter(flag: [boolean, boolean], turn: 0 | 1, i: 0 | 1): boolean {
  const other = (1 - i) as 0 | 1;
  return !flag[other] || turn === i;
}

/**
 * Peterson 互斥模拟：按给定步骤序列推进。
 *
 * @param steps 步骤序列（lock/critical/unlock）
 * @param hooks 可选事件钩子
 * @returns 每步后的状态快照
 */
export function simulatePeterson(
  steps: PetersonStep[],
  hooks: PetersonHooks = {},
): PetersonState[] {
  const flag: [boolean, boolean] = [false, false];
  let turn: 0 | 1 = 0;
  let inCritical = -1;
  const states: PetersonState['states'] = ['idle', 'idle'];
  const snapshots: PetersonState[] = [];

  const snap = (): PetersonState => ({
    flag: [flag[0], flag[1]],
    turn,
    inCritical,
    states: [states[0], states[1]],
  });

  for (const step of steps) {
    const { thread, action } = step;
    const other = (1 - thread) as 0 | 1;
    if (action === 'lock') {
      // flag[i] = true
      flag[thread] = true;
      states[thread] = 'wanting';
      hooks.onFlag?.(thread, [flag[0], flag[1]], turn);
      // turn = 1 - i（谦让）
      turn = other;
      hooks.onYield?.(thread, turn);
      // 检查能否进入
      if (canEnter(flag, turn, thread)) {
        states[thread] = 'critical';
        inCritical = thread;
        hooks.onEnter?.(thread);
      } else {
        states[thread] = 'waiting';
        hooks.onWait?.(thread);
      }
    } else if (action === 'critical') {
      // 模拟临界区执行（状态保持）
      if (inCritical === thread) states[thread] = 'critical';
    } else {
      // unlock：flag[i] = false
      flag[thread] = false;
      states[thread] = 'idle';
      if (inCritical === thread) inCritical = -1;
      hooks.onLeave?.(thread);
      // 唤醒等待的对方（如对方在等且现在满足条件）
      if (states[other] === 'waiting' && canEnter(flag, turn, other)) {
        states[other] = 'critical';
        inCritical = other;
        hooks.onEnter?.(other);
      }
    }
    snapshots.push(snap());
  }

  return snapshots;
}
