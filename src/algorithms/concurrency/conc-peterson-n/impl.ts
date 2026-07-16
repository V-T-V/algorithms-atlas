// Peterson n 线程推广（锦标赛树）· 实现

/** 单个二元 Peterson 锁。 */
export class Peterson2 {
  public flag = [false, false];
  public victim = 0;
  /** 0 或 1 表示当前持有者；-1 表示空闲。 */
  public holder = -1;

  lock(id: number): void {
    const other = 1 - id;
    this.flag[id] = true;
    this.victim = id;
    // 等待：对方未申请 或 自己不是受害者
    while (this.flag[other] && this.victim === id) {
      // 单线程模拟中无真实并发，直接通过
      break;
    }
    this.holder = id;
  }

  unlock(id: number): void {
    this.flag[id] = false;
    this.holder = -1;
  }
}

export interface PetersonTreeStep {
  thread: number;
  phase: string;
  levels: Array<Array<{ flag: boolean[]; victim: number; holder: number }>>;
  inCs: number[];
}

export interface PetersonTreeHooks {
  onDuel?: (thread: number, level: number) => void;
  onEnter?: (thread: number) => void;
  onExit?: (thread: number) => void;
}

/** n 线程锦标赛 Peterson：levels[i] 是第 i 层（自底向上）的锁数组。 */
export class PetersonN {
  public readonly levels: Peterson2[][];
  public readonly nLeaves: number;

  constructor(nThreads: number) {
    // 向上取 2 的幂
    let p = 1;
    while (p < nThreads) p <<= 1;
    this.nLeaves = p;
    const nLevels = Math.log2(p);
    this.levels = [];
    let count = p >> 1;
    for (let l = 0; l < nLevels; l++) {
      const arr: Peterson2[] = [];
      for (let k = 0; k < count; k++) arr.push(new Peterson2());
      this.levels.push(arr);
      count >>= 1;
    }
  }

  /** 线程 t 从叶向上锁定路径。 */
  lock(t: number, hooks: PetersonTreeHooks = {}): number[] {
    const path: number[] = [];
    let idx = t;
    for (let l = 0; l < this.levels.length; l++) {
      const nodeIdx = idx >> 1;
      const role = idx & 1;
      const lock = this.levels[l]![nodeIdx]!;
      hooks.onDuel?.(t, l);
      lock.lock(role);
      path.push(nodeIdx);
      idx = nodeIdx;
    }
    hooks.onEnter?.(t);
    return path;
  }

  unlock(t: number, path: number[], hooks: PetersonTreeHooks = {}): void {
    hooks.onExit?.(t);
    let idx = t;
    const pathCopy = [...path];
    for (let l = 0; l < this.levels.length; l++) {
      const nodeIdx = pathCopy[l]!;
      const role = idx & 1;
      this.levels[l]![nodeIdx]!.unlock(role);
      idx = nodeIdx;
    }
  }
}

export function simulatePetersonN(
  nThreads: number,
  order: number[],
  hooks: PetersonTreeHooks = {},
): PetersonTreeStep[] {
  const lock = new PetersonN(nThreads);
  const steps: PetersonTreeStep[] = [];
  const inCs: number[] = [];
  const snap = (thread: number, phase: string): void => {
    steps.push({
      thread,
      phase,
      levels: lock.levels.map((arr) =>
        arr.map((p) => ({ flag: [...p.flag], victim: p.victim, holder: p.holder })),
      ),
      inCs: [...inCs],
    });
  };
  snap(-1, 'init');
  for (const t of order) {
    const path = lock.lock(t, hooks);
    inCs.push(t);
    snap(t, 'enter');
    lock.unlock(t, path, hooks);
    const i = inCs.indexOf(t);
    if (i >= 0) inCs.splice(i, 1);
    snap(t, 'exit');
  }
  return steps;
}
