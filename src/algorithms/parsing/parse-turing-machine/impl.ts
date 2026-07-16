// 图灵机模拟器 · 纯算法实现
export interface TmTransition {
  state: string;
  read: string;
  next: string;
  write: string;
  dir: 'L' | 'R';
}
export interface TmHooks {
  onStep?: (state: string, head: number, tape: Map<number, string>) => void;
}

export class TuringMachine {
  private tape = new Map<number, string>();
  private head = 0;
  private state: string;
  private steps = 0;
  constructor(
    private readonly transitions: TmTransition[],
    start: string,
    private readonly blank: string,
    private readonly halt: Set<string>,
    private hooks: TmHooks = {},
  ) {
    this.state = start;
  }
  run(
    input: string[],
    maxSteps = 10000,
  ): { halted: boolean; steps: number; tape: Map<number, string> } {
    for (let i = 0; i < input.length; i++) this.tape.set(i, input[i]!);
    while (!this.halt.has(this.state) && this.steps < maxSteps) {
      const cell = this.tape.get(this.head) ?? this.blank;
      const t = this.transitions.find((x) => x.state === this.state && x.read === cell);
      if (!t) break;
      this.tape.set(this.head, t.write);
      this.state = t.next;
      this.head += t.dir === 'R' ? 1 : -1;
      this.steps++;
      this.hooks.onStep?.(this.state, this.head, new Map(this.tape));
    }
    return { halted: this.halt.has(this.state), steps: this.steps, tape: this.tape };
  }
}

// 例：小端二进制 +1
export function buildIncTm(hooks: TmHooks = {}): TuringMachine {
  const t: TmTransition[] = [
    { state: 'q0', read: '0', next: 'q0', write: '1', dir: 'L' },
    { state: 'q0', read: '1', next: 'q0', write: '0', dir: 'L' },
    { state: 'q0', read: '_', next: 'h', write: '_', dir: 'R' },
  ];
  return new TuringMachine(t, 'q0', '_', new Set(['h']), hooks);
}
