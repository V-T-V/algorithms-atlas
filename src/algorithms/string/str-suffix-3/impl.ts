// =============================================================================
// 后缀树（朴素构造）
// 用压缩 Trie 表示：每条边存 (start, end) 表示原串的子串区间
// =============================================================================

interface SuffixEdge {
  child: number;
  start: number;
  end: number; // 含
}

interface STreeNode {
  edges: Map<string, SuffixEdge>;
  suffixStart: number; // 若为叶子，记录对应后缀的起点；-1 表示内部节点
}

export interface SuffixTreeHooks {
  onInsertSuffix?: (start: number) => void;
  onSplit?: (parent: number, newNode: number, at: number) => void;
  onLeaf?: (node: number, start: number) => void;
  onDone?: (nodeCount: number, leafCount: number) => void;
}

export class SuffixTree3 {
  public nodes: STreeNode[] = [{ edges: new Map(), suffixStart: -1 }];
  private s: string;
  private n: number;
  constructor(
    input: string,
    private hooks: SuffixTreeHooks = {},
  ) {
    this.s = input;
    this.n = input.length;
    for (let i = 0; i < this.n; i++) this.insertSuffix(i);
    let leafCount = 0;
    for (const nd of this.nodes) if (nd.suffixStart >= 0) leafCount++;
    this.hooks.onDone?.(this.nodes.length, leafCount);
  }
  private insertSuffix(start: number): void {
    this.hooks.onInsertSuffix?.(start);
    let node = 0;
    let i = start;
    while (i < this.n) {
      const ch = this.s[i]!;
      const edge = this.nodes[node]!.edges.get(ch);
      if (edge === undefined) {
        // 直接挂叶子
        const leafId = this.nodes.length;
        this.nodes.push({ edges: new Map(), suffixStart: start });
        this.nodes[node]!.edges.set(ch, { child: leafId, start: i, end: this.n - 1 });
        this.hooks.onLeaf?.(leafId, start);
        return;
      }
      // 沿边匹配
      let k = 0;
      while (
        k <= edge.end - edge.start &&
        i + k < this.n &&
        this.s[edge.start + k] === this.s[i + k]
      ) {
        k++;
      }
      if (k > edge.end - edge.start) {
        // 走完整个边，下移
        node = edge.child;
        i += k;
        continue;
      }
      // 在第 k 个字符处分裂
      const splitNode = this.nodes.length;
      this.nodes.push({ edges: new Map(), suffixStart: -1 });
      const newLeaf = this.nodes.length;
      this.nodes.push({ edges: new Map(), suffixStart: start });
      // 原 edge.child 重新挂到 splitNode
      this.nodes[splitNode]!.edges.set(this.s[edge.start + k]!, {
        child: edge.child,
        start: edge.start + k,
        end: edge.end,
      });
      this.nodes[splitNode]!.edges.set(this.s[i + k]!, {
        child: newLeaf,
        start: i + k,
        end: this.n - 1,
      });
      this.hooks.onSplit?.(node, splitNode, k);
      this.hooks.onLeaf?.(newLeaf, start);
      edge.end = edge.start + k - 1;
      edge.child = splitNode;
      return;
    }
  }
  /** 判断 sub 是否为原串的子串。 */
  contains(sub: string): boolean {
    let node = 0;
    let i = 0;
    while (i < sub.length) {
      const ch = sub[i]!;
      const edge = this.nodes[node]!.edges.get(ch);
      if (edge === undefined) return false;
      let k = 0;
      while (k <= edge.end - edge.start && i < sub.length && this.s[edge.start + k] === sub[i]) {
        k++;
        i++;
      }
      if (i >= sub.length) return true;
      if (k <= edge.end - edge.start) return false;
      node = edge.child;
    }
    return true;
  }
  get nodeCount(): number {
    return this.nodes.length;
  }
}
