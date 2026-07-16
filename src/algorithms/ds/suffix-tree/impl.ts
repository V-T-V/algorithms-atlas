// =============================================================================
// 后缀树 Suffix Tree · 纯算法实现（零 DOM 依赖，可独立单测）
// 实现：显式构造的压缩后缀树（朴素 O(n²) 版本）。
//   - 对文本 T（自动补结尾哨兵 '$'）的所有后缀，逐个插入压缩 Trie
//   - 边用「子串 [start, end)」表示（路径压缩）
//   - 支持模式串匹配 contains(pattern)、最长重复子串 LRS
// =============================================================================

/** 构建过程中的事件钩子。任一可选。 */
export interface SuffixTreeHooks {
  /** 开始插入第 i 个后缀 T[i..]。 */
  onInsertSuffix?: (start: number) => void;
  /** 新建一个节点（叶或内部），label 为它对应的子串片段。 */
  onCreateNode?: (label: string, isLeaf: boolean) => void;
  /** 沿一条边匹配到公共前缀长度 commonLen。 */
  onMatchEdge?: (edgeLabel: string, commonLen: number) => void;
  /** 一条边在 pos 处被分裂（用于插入分叉）。 */
  onSplitEdge?: (edgeLabel: string, pos: number) => void;
  /** 构造完成，节点总数。 */
  onBuilt?: (nodeCount: number) => void;
  /** 模式匹配结果。 */
  onSearch?: (pattern: string, found: boolean) => void;
}

/** 压缩后缀树的节点。 */
export class STNode {
  children = new Map<string, STEdge>();
  /** 叶子对应的后缀起始下标（-1 表示内部节点）。 */
  suffixStart = -1;
}

/** 边：表示文本 [start, end) 的子串，指向 child 节点。end 用闭区间。 */
export class STEdge {
  start: number;
  end: number; // 闭区间末下标
  child: STNode;
  constructor(start: number, end: number, child: STNode) {
    this.start = start;
    this.end = end;
    this.child = child;
  }
  length(): number {
    return this.end - this.start + 1;
  }
}

/**
 * 后缀树（显式构造）。
 */
export class SuffixTree {
  readonly text: string;
  readonly root: STNode;
  private nodeCount = 0;

  constructor(text: string, hooks: SuffixTreeHooks = {}) {
    // 自动补哨兵
    this.text = text.endsWith('$') ? text : text + '$';
    this.root = this.newNode();
    // 逐后缀插入
    for (let i = 0; i < this.text.length; i++) {
      hooks.onInsertSuffix?.(i);
      this.insert(i, hooks);
    }
    hooks.onBuilt?.(this.nodeCount);
  }

  private newNode(): STNode {
    this.nodeCount++;
    return new STNode();
  }

  /** 插入后缀 text[start..]。 */
  private insert(start: number, hooks: SuffixTreeHooks): void {
    let node = this.root;
    let pos = start; // 当前后缀待处理位置
    const n = this.text.length;
    while (pos < n) {
      const firstCh = this.text[pos]!;
      const edge = node.children.get(firstCh);
      if (!edge) {
        // 新建叶子边
        const leaf = this.newNode();
        leaf.suffixStart = start;
        node.children.set(firstCh, new STEdge(pos, n - 1, leaf));
        hooks.onCreateNode?.(this.text.slice(pos), true);
        return;
      }
      // 沿边匹配公共前缀
      let common = 0;
      while (
        common < edge.length() &&
        pos + common < n &&
        this.text[edge.start + common] === this.text[pos + common]
      ) {
        common++;
      }
      hooks.onMatchEdge?.(this.text.slice(edge.start, edge.end + 1), common);
      if (common === edge.length()) {
        // 整条边匹配：继续下到 child
        node = edge.child;
        pos += common;
        continue;
      }
      // 边中间分叉：分裂 edge
      hooks.onSplitEdge?.(this.text.slice(edge.start, edge.end + 1), common);
      const splitNode = this.newNode();
      hooks.onCreateNode?.(this.text.slice(edge.start, edge.start + common), false);
      // 原 edge 后半段作为 splitNode 的子边
      const oldChild = edge.child;
      const secondCh = this.text[edge.start + common]!;
      splitNode.children.set(secondCh, new STEdge(edge.start + common, edge.end, oldChild));
      // edge 缩短到公共部分
      edge.end = edge.start + common - 1;
      edge.child = splitNode;
      // 新叶子挂在 splitNode
      const leaf = this.newNode();
      leaf.suffixStart = start;
      const newCh = this.text[pos + common]!;
      splitNode.children.set(newCh, new STEdge(pos + common, n - 1, leaf));
      hooks.onCreateNode?.(this.text.slice(pos + common), true);
      return;
    }
  }

  /** 是否包含模式串 pattern（子串匹配）。 */
  contains(pattern: string, hooks: SuffixTreeHooks = {}): boolean {
    let node = this.root;
    let pi = 0;
    while (pi < pattern.length) {
      const ch = pattern[pi]!;
      const edge = node.children.get(ch);
      if (!edge) {
        hooks.onSearch?.(pattern, false);
        return false;
      }
      let k = 0;
      while (k < edge.length() && pi < pattern.length) {
        if (this.text[edge.start + k] !== pattern[pi]) {
          hooks.onSearch?.(pattern, false);
          return false;
        }
        k++;
        pi++;
      }
      if (pi >= pattern.length) {
        hooks.onSearch?.(pattern, true);
        return true;
      }
      node = edge.child;
    }
    hooks.onSearch?.(pattern, true);
    return true;
  }

  /** 收集所有叶子（后缀起始下标）。 */
  private collectLeaves(node: STNode, out: number[]): void {
    if (node.children.size === 0) {
      out.push(node.suffixStart);
      return;
    }
    for (const e of node.children.values()) this.collectLeaves(e.child, out);
  }

  /** 查找 pattern 出现的所有起始下标。 */
  occurrences(pattern: string): number[] {
    let node = this.root;
    let pi = 0;
    while (pi < pattern.length) {
      const ch = pattern[pi]!;
      const edge = node.children.get(ch);
      if (!edge) return [];
      let k = 0;
      while (k < edge.length() && pi < pattern.length) {
        if (this.text[edge.start + k] !== pattern[pi]) return [];
        k++;
        pi++;
      }
      node = edge.child;
    }
    const out: number[] = [];
    this.collectLeaves(node, out);
    return out.sort((a, b) => a - b);
  }

  /** 节点总数。 */
  get totalNodes(): number {
    return this.nodeCount;
  }
}

/**
 * 便利函数：构造后缀树并返回多个模式串的匹配结果（布尔）。
 */
export function suffixTree(
  input: { text: string; patterns: string[] },
  hooks: SuffixTreeHooks = {},
): boolean[] {
  const st = new SuffixTree(input.text, hooks);
  return input.patterns.map((p) => st.contains(p, hooks));
}
