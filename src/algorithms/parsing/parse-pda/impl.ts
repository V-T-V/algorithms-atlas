// 下推自动机 PDA · 纯算法实现
export interface PdaTransition {
  state: string;
  input: string | null; // null = ε
  pop: string;
  next: string;
  push: string[]; // 自底向上（左先）
}
export interface PdaHooks {
  onStep?: (state: string, stack: string[], input: string | null) => void;
  onAccept?: () => void;
}

export class PDA {
  private stack: string[] = ['Z0'];
  constructor(
    private readonly transitions: PdaTransition[],
    private start: string,
    private accept: Set<string>,
    private hooks: PdaHooks = {},
  ) {}
  run(input: string[]): boolean {
    let state = this.start;
    let i = 0;
    this.hooks.onStep?.(state, [...this.stack], input[i] ?? null);
    while (true) {
      const sym = input[i];
      const top = this.stack[this.stack.length - 1]!;
      const t = this.transitions.find(
        (x) => x.state === state && x.pop === top && (x.input === sym || x.input === null),
      );
      if (!t) break;
      this.stack.pop();
      for (let k = t.push.length - 1; k >= 0; k--) this.stack.push(t.push[k]!);
      state = t.next;
      if (t.input !== null) i++;
      this.hooks.onStep?.(state, [...this.stack], input[i] ?? null);
      if (
        i === input.length &&
        this.accept.has(state) &&
        this.stack.length === 1 &&
        this.stack[0] === 'Z0'
      ) {
        this.hooks.onAccept?.();
        return true;
      }
    }
    return (
      i === input.length &&
      this.accept.has(state) &&
      this.stack.length === 1 &&
      this.stack[0] === 'Z0'
    );
  }
}

// 经典：识别 a^n b^n
export function buildAnBnPda(hooks: PdaHooks = {}): PDA {
  const t: PdaTransition[] = [
    { state: 'q0', input: 'a', pop: 'Z0', next: 'q0', push: ['A', 'Z0'] },
    { state: 'q0', input: 'a', pop: 'A', next: 'q0', push: ['A', 'A'] },
    { state: 'q0', input: 'b', pop: 'A', next: 'q1', push: [] },
    { state: 'q1', input: 'b', pop: 'A', next: 'q1', push: [] },
    { state: 'q1', input: null, pop: 'Z0', next: 'qf', push: ['Z0'] },
  ];
  return new PDA(t, 'q0', new Set(['qf']), hooks);
}
