// =============================================================================
// Aho-Corasick 完整字典图（DFA）：goto 表完整，扫描时无需跳 fail
// =============================================================================

const ALPHABET_SIZE = 26;
const idx = (ch: string): number => ch.charCodeAt(0) - 97;

interface AhoNode {
  go: number[]; // 完整转移，长度 ALPHABET_SIZE
  fail: number;
  output: number[];
}

export interface AhoHooks {
  onGoto?: (node: number, ch: number, target: number) => void;
  onFail?: (node: number, fail: number) => void;
  onMatch?: (textPos: number, patternId: number) => void;
  onDone?: (matches: Array<{ pos: number; patternId: number }>) => void;
}

export class Aho3 {
  private nodes: AhoNode[] = [];
  private patterns: string[] = [];
  constructor(private hooks: AhoHooks = {}) {
    this.nodes.push({ go: new Array(ALPHABET_SIZE).fill(0), fail: 0, output: [] });
  }

  insert(word: string): number {
    let cur = 0;
    for (const ch of word) {
      const c = idx(ch);
      if (this.nodes[cur]!.go[c] === 0) {
        this.nodes[cur]!.go[c] = this.nodes.length;
        this.nodes.push({ go: new Array(ALPHABET_SIZE).fill(0), fail: 0, output: [] });
      }
      cur = this.nodes[cur]!.go[c]!;
    }
    const pid = this.patterns.length;
    this.patterns.push(word);
    this.nodes[cur]!.output.push(pid);
    return pid;
  }

  /** 构建 fail 链并补全 goto 转移。 */
  build(): void {
    const queue: number[] = [];
    for (let c = 0; c < ALPHABET_SIZE; c++) {
      const child = this.nodes[0]!.go[c]!;
      if (child !== 0) {
        this.nodes[child]!.fail = 0;
        queue.push(child);
      } else {
        // root 的缺失转移指向自己
        this.nodes[0]!.go[c] = 0;
      }
    }
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      for (let c = 0; c < ALPHABET_SIZE; c++) {
        const v = this.nodes[u]!.go[c]!;
        if (v !== 0) {
          this.nodes[v]!.fail = this.nodes[this.nodes[u]!.fail]!.go[c]!;
          this.nodes[v]!.output.push(...this.nodes[this.nodes[v]!.fail]!.output);
          this.hooks.onFail?.(v, this.nodes[v]!.fail);
          queue.push(v);
        } else {
          this.nodes[u]!.go[c] = this.nodes[this.nodes[u]!.fail]!.go[c]!;
        }
        this.hooks.onGoto?.(u, c, this.nodes[u]!.go[c]!);
      }
    }
  }

  match(text: string): Array<{ pos: number; patternId: number }> {
    const out: Array<{ pos: number; patternId: number }> = [];
    let cur = 0;
    for (let i = 0; i < text.length; i++) {
      const c = idx(text[i]!);
      cur = this.nodes[cur]!.go[c]!;
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
