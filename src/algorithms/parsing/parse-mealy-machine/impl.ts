// Mealy 机 · 纯算法实现
export interface MealyEdge {
  from: string;
  input: string;
  to: string;
  output: string;
}
export interface MealyHooks {
  onEdge?: (from: string, input: string, to: string, out: string) => void;
}

export class MealyMachine {
  constructor(
    private edges: MealyEdge[],
    private start: string,
    private hooks: MealyHooks = {},
  ) {}
  run(input: string[]): string[] {
    let st = this.start;
    const out: string[] = [];
    for (const a of input) {
      const e = this.edges.find((x) => x.from === st && x.input === a);
      if (!e) throw new Error(`no edge from ${st} on ${a}`);
      out.push(e.output);
      this.hooks.onEdge?.(st, a, e.to, e.output);
      st = e.to;
    }
    return out;
  }
}

// 例：检测连续 "11"
export function buildSeqDetector(hooks: MealyHooks = {}): MealyMachine {
  return new MealyMachine(
    [
      { from: 'S', input: '1', to: 'A', output: '0' },
      { from: 'S', input: '0', to: 'S', output: '0' },
      { from: 'A', input: '1', to: 'A', output: '1' },
      { from: 'A', input: '0', to: 'S', output: '0' },
    ],
    'S',
    hooks,
  );
}
