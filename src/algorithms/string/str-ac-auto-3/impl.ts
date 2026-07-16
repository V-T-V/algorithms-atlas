// =============================================================================
// AC 自动机：多模式匹配
// =============================================================================

interface AcNode {
  next: Map<string, number>;
  fail: number;
  output: number[]; // 命中的模式编号
}

export interface AcHooks {
  onInsert?: (word: string, node: number) => void;
  onFail?: (node: number, fail: number) => void;
  onMatch?: (textIndex: number, patternId: number) => void;
  onDone?: (matches: Array<{ pos: number; patternId: number }>) => void;
}

export class ACAutomaton3 {
  private nodes: AcNode[] = [{ next: new Map(), fail: 0, output: [] }];
  private patterns: string[] = [];
  constructor(private hooks: AcHooks = {}) {}

  insert(word: string): number {
    let cur = 0;
    for (const ch of word) {
      let nx = this.nodes[cur]!.next.get(ch);
      if (nx === undefined) {
        nx = this.nodes.length;
        this.nodes.push({ next: new Map(), fail: 0, output: [] });
        this.nodes[cur]!.next.set(ch, nx);
      }
      cur = nx;
    }
    const patternId = this.patterns.length;
    this.patterns.push(word);
    this.nodes[cur]!.output.push(patternId);
    this.hooks.onInsert?.(word, cur);
    return patternId;
  }

  build(): void {
    const queue: number[] = [];
    // 第一层 fail = 0
    for (const [, child] of this.nodes[0]!.next) {
      this.nodes[child]!.fail = 0;
      queue.push(child);
    }
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      for (const [ch, v] of this.nodes[u]!.next) {
        const f = this.nodes[u]!.fail;
        let fail = this.nodes[f]!.next.get(ch) ?? 0;
        if (fail === v) fail = 0;
        this.nodes[v]!.fail = fail;
        // 把 fail 节点的 output 合并过来
        this.nodes[v]!.output.push(...this.nodes[fail]!.output);
        this.hooks.onFail?.(v, fail);
        queue.push(v);
      }
    }
  }

  /** 在 text 中扫描，返回所有匹配：{ 文本下标(结束位置), 模式编号 }。 */
  match(text: string): Array<{ pos: number; patternId: number }> {
    const out: Array<{ pos: number; patternId: number }> = [];
    let cur = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]!;
      while (cur !== 0 && !this.nodes[cur]!.next.has(ch)) cur = this.nodes[cur]!.fail;
      const nx = this.nodes[cur]!.next.get(ch);
      if (nx !== undefined) cur = nx;
      for (const pid of this.nodes[cur]!.output) {
        out.push({ pos: i, patternId: pid });
        this.hooks.onMatch?.(i, pid);
      }
    }
    this.hooks.onDone?.(out);
    return out;
  }

  getPattern(id: number): string {
    return this.patterns[id]!;
  }

  get nodeCount(): number {
    return this.nodes.length;
  }
}
