// 最长单词（DFS）· 实现

export interface TrieNode {
  children: Map<string, TrieNode>;
  isWord: boolean;
}

export function makeTrieNode(): TrieNode {
  return { children: new Map(), isWord: false };
}

export interface LwHooks {
  onVisit?: (word: string) => void;
  onCandidate?: (word: string) => void;
}

/** 构建 Trie。 */
export function buildTrie(words: string[]): TrieNode {
  const root = makeTrieNode();
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node.children.has(ch)) node.children.set(ch, makeTrieNode());
      node = node.children.get(ch)!;
    }
    node.isWord = true;
  }
  return root;
}

/**
 * DFS 找最长可逐步构建的单词。
 */
export function longestWord(words: string[], hooks: LwHooks = {}): string {
  const root = buildTrie(words);
  let best = '';

  const dfs = (node: TrieNode, current: string): void => {
    hooks.onVisit?.(current);
    if (current.length > best.length || (current.length === best.length && current < best)) {
      if (current.length > 0) {
        best = current;
        hooks.onCandidate?.(current);
      }
    }
    // 按字典序遍历子节点
    const keys = [...node.children.keys()].sort();
    for (const ch of keys) {
      const child = node.children.get(ch)!;
      if (child.isWord) dfs(child, current + ch);
    }
  };

  dfs(root, '');
  return best;
}
