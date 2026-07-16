// Lamport 面包店算法 · 实现（确定性事件模拟）

export interface BakeryStep {
  thread: number;
  phase: string;
  numbers: number[];
  choosing: boolean[];
  inCs: number[];
}

export interface BakeryHooks {
  onChoose?: (thread: number) => void;
  onTakeNumber?: (thread: number, num: number) => void;
  onWait?: (thread: number, j: number) => void;
  onEnter?: (thread: number) => void;
  onExit?: (thread: number) => void;
}

export function bakerySimulate(
  nThreads: number,
  order: number[],
  hooks: BakeryHooks = {},
): BakeryStep[] {
  const numbers = new Array(nThreads).fill(0);
  const choosing = new Array(nThreads).fill(false);
  const steps: BakeryStep[] = [];
  const inCs: number[] = [];

  const snap = (thread: number, phase: string): void => {
    steps.push({ thread, phase, numbers: [...numbers], choosing: [...choosing], inCs: [...inCs] });
  };

  // 模拟每个线程经历 doorway + waiting + CS + exit
  // order 是依次发起请求的线程顺序
  const pending = [...order];
  // 先全部取号
  for (const t of pending) {
    choosing[t] = true;
    hooks.onChoose?.(t);
    snap(t, 'choosing');
    numbers[t] = 1 + Math.max(0, ...numbers);
    hooks.onTakeNumber?.(t, numbers[t]!);
    choosing[t] = false;
    snap(t, 'taken');
  }
  // 按 (number, id) 排序进入
  const sorted = [...pending].sort((a, b) => numbers[a]! - numbers[b]! || a - b);
  for (const t of sorted) {
    // 等待：直到自己是所有在线者中最小
    for (const j of pending) {
      if (j === t) continue;
      if (
        numbers[j]! !== 0 &&
        (numbers[j]! < numbers[t]! || (numbers[j]! === numbers[t]! && j < t))
      ) {
        hooks.onWait?.(t, j);
        snap(t, `wait-for-T${j}`);
      }
    }
    inCs.push(t);
    hooks.onEnter?.(t);
    snap(t, 'critical');
    numbers[t] = 0;
    const idx = inCs.indexOf(t);
    if (idx >= 0) inCs.splice(idx, 1);
    hooks.onExit?.(t);
    snap(t, 'exit');
  }
  return steps;
}

/** 比较两个 (number, id) 元组。 */
export function less(a: [number, number], b: [number, number]): boolean {
  return a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);
}
