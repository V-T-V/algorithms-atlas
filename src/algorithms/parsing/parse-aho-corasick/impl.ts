// Aho-Corasick · 纯算法实现
export interface AcNode {
  children: Map<string, number>;
  fail: number;
  out: string[];
}

export class AhoCorasick {
  private nodes: AcNode[] = [{ children: new Map(), fail: 0, out: [] }];
  constructor(patterns: string[]) {
    for (const p of patterns) this.insert(p);
    this.buildFail();
  }
  private insert(p: string): void {
    let cur = 0;
    for (const c of p) {
      let nx = this.nodes[cur]!.children.get(c);
      if (nx === undefined) {
        nx = this.nodes.length;
        this.nodes.push({ children: new Map(), fail: 0, out: [] });
        this.nodes[cur]!.children.set(c, nx);
      }
      cur = nx;
    }
    this.nodes[cur]!.out.push(p);
  }
  private buildFail(): void {
    const q: number[] = [];
    for (const [, c] of this.nodes[0]!.children) q.push(c);
    while (q.length) {
      const u = q.shift()!;
      for (const [ch, v] of this.nodes[u]!.children) {
        q.push(v);
        let f = this.nodes[u]!.fail;
        while (f !== 0 && !this.nodes[f]!.children.has(ch)) f = this.nodes[f]!.fail;
        const ff = this.nodes[f]!.children.get(ch);
        this.nodes[v]!.fail = ff && ff !== v ? ff : 0;
        this.nodes[v]!.out.push(...this.nodes[this.nodes[v]!.fail]!.out);
      }
    }
  }
  search(text: string): Array<{ at: number; pattern: string }> {
    const res: Array<{ at: number; pattern: string }> = [];
    let cur = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text[i]!;
      while (cur !== 0 && !this.nodes[cur]!.children.has(c)) cur = this.nodes[cur]!.fail;
      cur = this.nodes[cur]!.children.get(c) ?? 0;
      for (const p of this.nodes[cur]!.out) res.push({ at: i - p.length + 1, pattern: p });
    }
    return res;
  }
}
