// =============================================================================
// 字符串 Trie（前缀树）· 纯算法实现
// 把一组字符串共用公共前缀地存进一棵树：根=空前缀，每条边一个字符，单词结束节点带标记。
// 支持：插入、整串查找、前缀枚举、前缀计数、删除。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** Trie 节点。 */
export interface TrieNode {
  id: number;
  /** 子节点：字符 → 子节点 id。 */
  children: Map<string, number>;
  /** 是否为某完整字符串的结尾。 */
  isEnd: boolean;
  /** 以本节点为前缀的完整字符串数量（含本节点）。用于前缀计数。 */
  count: number;
  /** 父节点 id（根为 -1）。 */
  parent: number;
  /** 父到本节点的字符（根为 ''）。 */
  charFromParent: string;
  /** 深度（根为 0）。 */
  depth: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface TrieStringHooks {
  /** 插入时新建边 parent→child（字符 ch）。 */
  onCreateEdge?: (parent: number, child: number, ch: string) => void;
  /** 插入时经过已存在的边。 */
  onWalkEdge?: (parent: number, child: number, ch: string) => void;
  /** 一个字符串插入完毕，标记结束节点。 */
  onMarkEnd?: (node: number) => void;
  /** 查找/枚举时访问某节点。 */
  onVisit?: (node: number) => void;
}

/** 一棵可操作的 Trie。 */
export class StringTrie {
  nodes: TrieNode[] = [];

  constructor() {
    this.make(-1, '', 0); // 根 id=0
  }

  private make(parent: number, ch: string, depth: number): number {
    const id = this.nodes.length;
    this.nodes.push({
      id,
      children: new Map(),
      isEnd: false,
      count: 0,
      parent,
      charFromParent: ch,
      depth,
    });
    return id;
  }

  /** 插入一个字符串。 */
  insert(s: string, hooks: TrieStringHooks = {}): void {
    let cur = 0;
    for (let k = 0; k < s.length; k++) {
      const ch = s[k]!;
      let nx = this.nodes[cur]!.children.get(ch);
      if (nx === undefined) {
        nx = this.make(cur, ch, this.nodes[cur]!.depth + 1);
        this.nodes[cur]!.children.set(ch, nx);
        hooks.onCreateEdge?.(cur, nx, ch);
      } else {
        hooks.onWalkEdge?.(cur, nx, ch);
      }
      cur = nx;
    }
    this.nodes[cur]!.isEnd = true;
    hooks.onMarkEnd?.(cur);
    // 更新沿路径的 count
    let p: number | undefined = cur;
    while (p !== undefined && p >= 0) {
      this.nodes[p]!.count++;
      p = this.nodes[p]!.parent;
    }
  }

  /** 是否存在完整字符串 s。 */
  contains(s: string, hooks: TrieStringHooks = {}): boolean {
    const node = this.findNode(s, hooks);
    return node !== null && this.nodes[node]!.isEnd;
  }

  /** 找到字符串 s 对应的节点（不要求是结尾）；不存在返回 null。 */
  findNode(s: string, hooks: TrieStringHooks = {}): number | null {
    let cur = 0;
    hooks.onVisit?.(cur);
    for (let k = 0; k < s.length; k++) {
      const ch = s[k]!;
      const nx = this.nodes[cur]!.children.get(ch);
      if (nx === undefined) return null;
      hooks.onVisit?.(nx);
      cur = nx;
    }
    return cur;
  }

  /** 以 prefix 为前缀的完整字符串数量。 */
  countPrefix(prefix: string): number {
    const node = this.findNode(prefix);
    return node === null ? 0 : this.nodes[node]!.count;
  }

  /** 枚举所有以 prefix 开头的完整字符串（字典序）。 */
  startsWith(prefix: string, hooks: TrieStringHooks = {}): string[] {
    const start = this.findNode(prefix, hooks);
    if (start === null) return [];
    const out: string[] = [];
    const dfs = (node: number, path: string): void => {
      hooks.onVisit?.(node);
      if (this.nodes[node]!.isEnd) out.push(path);
      const keys = Array.from(this.nodes[node]!.children.keys()).sort();
      for (const ch of keys) {
        const child = this.nodes[node]!.children.get(ch)!;
        dfs(child, path + ch);
      }
    };
    dfs(start, prefix);
    return out;
  }
}

/**
 * 便捷：用一组字符串构造 Trie 并返回。每个字符串插入触发钩子。
 * @returns 构造好的 StringTrie
 */
export function trieString(words: string[], hooks: TrieStringHooks = {}): StringTrie {
  const trie = new StringTrie();
  for (const w of words) trie.insert(w, hooks);
  return trie;
}
