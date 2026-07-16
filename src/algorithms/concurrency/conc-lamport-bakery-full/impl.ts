export interface BakeryHooks {
  onChoose?: (pid: number, num: number) => void;
  onEnter?: (pid: number) => void;
  onExit?: (pid: number) => void;
}
export function bakeryLock(n: number, hooks: BakeryHooks = {}): { log: string[]; nums: number[] } {
  const choosing: boolean[] = new Array(n).fill(false);
  const nums: number[] = new Array(n).fill(0);
  const log: string[] = [];
  const enter = (i: number) => {
    choosing[i] = true;
    nums[i] = 1 + Math.max(...nums);
    hooks.onChoose?.(i, nums[i]!);
    choosing[i] = false;
    for (let j = 0; j < n; j++) {
      while (choosing[j]) {}
      while (nums[j] !== 0 && (nums[j]! < nums[i]! || (nums[j] === nums[i] && j < i))) {}
    }
    hooks.onEnter?.(i);
    log.push('enter ' + i);
  };
  const exit = (i: number) => {
    nums[i] = 0;
    hooks.onExit?.(i);
    log.push('exit ' + i);
  };
  // 模拟进程依次进入并退出
  for (let i = 0; i < n; i++) {
    enter(i);
    exit(i);
  }
  return { log, nums };
}
