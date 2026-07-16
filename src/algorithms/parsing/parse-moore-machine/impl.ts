// Moore 机 · 纯算法实现
export interface MooreState {
  name: string;
  output: string;
}
export interface MooreEdge {
  from: string;
  input: string;
  to: string;
}
export interface MooreHooks {
  onState?: (s: string, out: string) => void;
}

export class MooreMachine {
  constructor(
    private states: Map<string, MooreState>,
    private edges: MooreEdge[],
    private start: string,
    private hooks: MooreHooks = {},
  ) {}
  run(input: string[]): string[] {
    let st = this.start;
    const out: string[] = [this.states.get(st)!.output];
    this.hooks.onState?.(st, this.states.get(st)!.output);
    for (const a of input) {
      const e = this.edges.find((x) => x.from === st && x.input === a);
      if (!e) throw new Error(`no edge from ${st} on ${a}`);
      st = e.to;
      const o = this.states.get(st)!.output;
      out.push(o);
      this.hooks.onState?.(st, o);
    }
    return out;
  }
}

export function buildMooreSeq(hooks: MooreHooks = {}): MooreMachine {
  const states = new Map<string, MooreState>([
    ['S', { name: 'S', output: '0' }],
    ['A', { name: 'A', output: '0' }],
    ['B', { name: 'B', output: '1' }],
  ]);
  const edges: MooreEdge[] = [
    { from: 'S', input: '1', to: 'A' },
    { from: 'S', input: '0', to: 'S' },
    { from: 'A', input: '1', to: 'B' },
    { from: 'A', input: '0', to: 'S' },
    { from: 'B', input: '1', to: 'B' },
    { from: 'B', input: '0', to: 'S' },
  ];
  return new MooreMachine(states, edges, 'S', hooks);
}
