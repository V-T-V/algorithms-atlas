// =============================================================================
// 字典树（Trie）：插入 / 查询 / 前缀计数
// =============================================================================

interface TrieNode {
  children: Map<string, number>;
  count: number; // 以此节点结尾的单词数
  passCount: number; // 经过此节点的单词数（前缀计数）
}

export interface TrieHooks {
  onInsertChar?: (depth: number, ch: string, node: number) => void;
  onInsertDone?: (word: string, node: number) => void;
  onSearch?: (word: string, found: boolean) => void;
}

export class Trie2 {
  private nodes: TrieNode[] = [{ children: new Map(), count: 0, passCount: 0 }];
  constructor(private hooks: TrieHooks = {}) {}

  insert(word: string): void {
    let cur = 0;
    this.nodes[0]!.passCount++;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i]!;
      let nx = this.nodes[cur]!.children.get(ch);
      if (nx === undefined) {
        nx = this.nodes.length;
        this.nodes.push({ children: new Map(), count: 0, passCount: 0 });
        this.nodes[cur]!.children.set(ch, nx);
      }
      cur = nx;
      this.nodes[cur]!.passCount++;
      this.hooks.onInsertChar?.(i + 1, ch, cur);
    }
    this.nodes[cur]!.count++;
    this.hooks.onInsertDone?.(word, cur);
  }

  /** 查找完整单词是否被插入过（含次数）。 */
  count(word: string): number {
    let cur = 0;
    for (const ch of word) {
      const nx = this.nodes[cur]!.children.get(ch);
      if (nx === undefined) return 0;
      cur = nx;
    }
    return this.nodes[cur]!.count;
  }

  contains(word: string): boolean {
    const c = this.count(word);
    this.hooks.onSearch?.(word, c > 0);
    return c > 0;
  }

  /** 以 prefix 为前缀的单词数。 */
  prefixCount(prefix: string): number {
    let cur = 0;
    for (const ch of prefix) {
      const nx = this.nodes[cur]!.children.get(ch);
      if (nx === undefined) return 0;
      cur = nx;
    }
    return this.nodes[cur]!.passCount;
  }

  get nodeCount(): number {
    return this.nodes.length;
  }
}
