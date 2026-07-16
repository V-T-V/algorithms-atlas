// Tanenbaum 哲学家 · 实现

export type PhilState = 'THINKING' | 'HUNGRY' | 'EATING';

export interface PhilEvent {
  philosopher: number;
  action: 'take' | 'put';
}

export interface PhilStep {
  philosopher: number;
  action: string;
  states: PhilState[];
  blocked: boolean;
}

export interface PhilHooks {
  onHungry?: (p: number) => void;
  onEat?: (p: number) => void;
  onBlock?: (p: number) => void;
  onThink?: (p: number) => void;
}

export class TanenbaumTable {
  public readonly n: number;
  public readonly states: PhilState[];
  public readonly self: boolean[]; // 是否被阻塞（信号量模拟）

  constructor(n: number) {
    this.n = n;
    this.states = new Array(n).fill('THINKING');
    this.self = new Array(n).fill(false);
  }

  private left(i: number): number {
    return (i + this.n - 1) % this.n;
  }
  private right(i: number): number {
    return (i + 1) % this.n;
  }

  test(i: number, hooks: PhilHooks = {}): void {
    if (
      this.states[i] === 'HUNGRY' &&
      this.states[this.left(i)] !== 'EATING' &&
      this.states[this.right(i)] !== 'EATING'
    ) {
      this.states[i] = 'EATING';
      this.self[i] = false;
      hooks.onEat?.(i);
    }
  }

  takeForks(i: number, hooks: PhilHooks = {}): boolean {
    this.states[i] = 'HUNGRY';
    hooks.onHungry?.(i);
    this.test(i, hooks);
    const after = this.states[i] as PhilState;
    if (after !== 'EATING') {
      this.self[i] = true; // 阻塞
      hooks.onBlock?.(i);
      return false;
    }
    return true;
  }

  putForks(i: number, hooks: PhilHooks = {}): void {
    this.states[i] = 'THINKING';
    hooks.onThink?.(i);
    this.test(this.left(i), hooks);
    this.test(this.right(i), hooks);
  }
}

export function simulateTanenbaum(
  n: number,
  events: PhilEvent[],
  hooks: PhilHooks = {},
): PhilStep[] {
  const table = new TanenbaumTable(n);
  const steps: PhilStep[] = [];
  for (const ev of events) {
    let blocked = false;
    if (ev.action === 'take') {
      blocked = !table.takeForks(ev.philosopher, hooks);
    } else {
      table.putForks(ev.philosopher, hooks);
    }
    steps.push({
      philosopher: ev.philosopher,
      action: ev.action,
      states: [...table.states],
      blocked,
    });
  }
  return steps;
}
