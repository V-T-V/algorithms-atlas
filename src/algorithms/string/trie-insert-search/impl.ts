// =============================================================================
// Trie 插入与查找（精简版）· 纯算法实现
// =============================================================================

export interface SimpleTrieNode {
  id: number;
  children: Map<string, number>;
  isEnd: boolean;
}

export interface SimpleTrieHooks {
  onDescend?: (nodeId: number, ch: string) => void;
  onCreate?: (parentId: number, ch: string, newNodeId: number) => void;
  onMarkEnd?: (nodeId: number) => void;
  onSearchHit?: (nodeId: number, ch: string) => void;
  onSearchMiss?: (ch: string) => void;
}

export class SimpleTrie {
  nodes: SimpleTrieNode[] = [];
  private hooks: SimpleTrieHooks;

  constructor(hooks: SimpleTrieHooks = {}) {
    this.hooks = hooks;
    this.nodes.push({ id: 0, children: new Map(), isEnd: false });
  }

  insert(word: string): void {
    let cur = 0;
    for (const ch of word) {
      this.hooks.onDescend?.(cur, ch);
      let nxt = this.nodes[cur]!.children.get(ch);
      if (nxt === undefined) {
        nxt = this.nodes.length;
        this.nodes.push({ id: nxt, children: new Map(), isEnd: false });
        this.nodes[cur]!.children.set(ch, nxt);
        this.hooks.onCreate?.(cur, ch, nxt);
      }
      cur = nxt;
    }
    this.nodes[cur]!.isEnd = true;
    this.hooks.onMarkEnd?.(cur);
  }

  /** 整串精确查找。 */
  search(word: string): boolean {
    let cur = 0;
    for (const ch of word) {
      const nxt = this.nodes[cur]!.children.get(ch);
      if (nxt === undefined) {
        this.hooks.onSearchMiss?.(ch);
        return false;
      }
      this.hooks.onSearchHit?.(nxt, ch);
      cur = nxt;
    }
    return this.nodes[cur]!.isEnd;
  }

  /** 前缀存在性。 */
  startsWith(prefix: string): boolean {
    let cur = 0;
    for (const ch of prefix) {
      const nxt = this.nodes[cur]!.children.get(ch);
      if (nxt === undefined) {
        this.hooks.onSearchMiss?.(ch);
        return false;
      }
      cur = nxt;
    }
    return true;
  }

  /** 定位前缀终点节点，返回 id 或 -1。 */
  locate(prefix: string): number {
    let cur = 0;
    for (const ch of prefix) {
      const nxt = this.nodes[cur]!.children.get(ch);
      if (nxt === undefined) return -1;
      cur = nxt;
    }
    return cur;
  }
}

export function buildTrie(words: string[], hooks: SimpleTrieHooks = {}): SimpleTrie {
  const t = new SimpleTrie(hooks);
  for (const w of words) t.insert(w);
  return t;
}
