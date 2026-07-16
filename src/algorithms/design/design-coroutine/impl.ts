// 协程模式 · 实现
export interface CoroutineHooks {
  onYield?: (task: string, step: number, value: number) => void;
  onComplete?: (task: string, totalSteps: number) => void;
  onSchedule?: (running: number, done: number) => void;
}

// 一个任务协程：yield 出当前进度值，完成时 return
export type TaskCoroutine = Generator<number, void, unknown>;

export function* taskCoroutine(name: string, steps: number): TaskCoroutine {
  for (let i = 1; i <= steps; i++) {
    yield i; // 让出控制权，把当前进度告诉调度器
  }
}

export class CoroutineScheduler {
  private tasks: Array<{ name: string; gen: TaskCoroutine; done: boolean; steps: number }> = [];
  private readonly hooks: CoroutineHooks;
  constructor(hooks: CoroutineHooks = {}) {
    this.hooks = hooks;
  }

  add(name: string, steps: number): void {
    this.tasks.push({ name, gen: taskCoroutine(name, steps), done: false, steps: 0 });
  }

  run(): { completed: string[]; totalSteps: number } {
    const completed: string[] = [];
    let totalSteps = 0;
    while (true) {
      const pending = this.tasks.filter((t) => !t.done);
      if (pending.length === 0) break;
      const doneCount = this.tasks.length - pending.length;
      this.hooks.onSchedule?.(pending.length, doneCount);
      for (const t of pending) {
        const r = t.gen.next();
        if (r.done) {
          t.done = true;
          completed.push(t.name);
          this.hooks.onComplete?.(t.name, t.steps);
        } else {
          t.steps++;
          totalSteps++;
          this.hooks.onYield?.(t.name, t.steps, r.value);
        }
      }
    }
    return { completed, totalSteps };
  }
}
