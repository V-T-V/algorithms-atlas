// =============================================================================
// 字典树 Trie · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：以字符串为键的多叉前缀树。
//   - 每个节点持有 children（按字符映射）与 isEnd（是否某个完整单词的结尾）。
//   - insert / search / startsWith 三个经典操作。
// =============================================================================

/** Trie 内部节点。 */
export interface TrieNode {
  /** 子节点：字符 → 子树。用对象以便 O(1) 查找且支持任意字符。 */
  children: Map<string, TrieNode>;
  /** 是否某个完整键的结尾。 */
  isEnd: boolean;
}

/** 创建空节点。 */
function newNode(): TrieNode {
  return { children: new Map(), isEnd: false };
}

/** 插入与查找过程中比较/走向某条字符边时的事件钩子。任一可选。 */
export interface TrieHooks {
  /** 插入：从当前节点走向字符 ch 对应的子节点。existed 表示该边原本就存在。 */
  onStep?: (depth: number, ch: string, existed: boolean) => void;
  /** 插入：新建了一个节点（即当前键此前不存在的某前缀）。 */
  onCreate?: (depth: number, ch: string) => void;
  /** 插入：标记某节点为单词结尾（isEnd 置 true）。redundant=true 表示原本已是结尾（重复插入）。 */
  onMarkEnd?: (depth: number, redundant: boolean) => void;
  /** 查找/前缀匹配：在 depth 处比较字符 ch，hit 表示是否命中（边是否存在）。 */
  onCompare?: (depth: number, ch: string, hit: boolean) => void;
  /** 查找/前缀匹配结束：给出结果。 */
  onResult?: (kind: 'search' | 'prefix', key: string, ok: boolean) => void;
}

/**
 * 字典树（Trie / Prefix Tree）。
 * 支持插入字符串键、精确查找、前缀判定。
 */
export class Trie {
  /** 根节点（空字符串对应的虚拟根）。 */
  readonly root: TrieNode = newNode();
  /** 已存键数。 */
  private count = 0;

  /** 当前键数量。 */
  get size(): number {
    return this.count;
  }

  /** 是否为空。 */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /** 插入一个键。重复插入视为已存在（不增加计数）。返回是否实际新增。 */
  insert(key: string, hooks: TrieHooks = {}): boolean {
    let node = this.root;
    for (let i = 0; i < key.length; i++) {
      const ch = key[i]!;
      const next = node.children.get(ch);
      if (next) {
        hooks.onStep?.(i + 1, ch, true);
        node = next;
      } else {
        const created = newNode();
        node.children.set(ch, created);
        hooks.onCreate?.(i + 1, ch);
        hooks.onStep?.(i + 1, ch, false);
        node = created;
      }
    }
    const redundant = node.isEnd;
    if (!redundant) {
      node.isEnd = true;
      this.count++;
    }
    hooks.onMarkEnd?.(key.length, redundant);
    return !redundant;
  }

  /** 精确查找键是否作为完整单词存在。 */
  search(key: string, hooks: TrieHooks = {}): boolean {
    const node = this.locate(key, hooks, 'search');
    const ok = node !== null && node.isEnd;
    hooks.onResult?.('search', key, ok);
    return ok;
  }

  /** 是否存在以 prefix 为前缀的键。 */
  startsWith(prefix: string, hooks: TrieHooks = {}): boolean {
    const node = this.locate(prefix, hooks, 'prefix');
    const ok = node !== null;
    hooks.onResult?.('prefix', prefix, ok);
    return ok;
  }

  /** 沿 key 走到对应节点；中途任一字符缺失则返回 null。 */
  private locate(key: string, hooks: TrieHooks, _kind: 'search' | 'prefix'): TrieNode | null {
    let node = this.root;
    for (let i = 0; i < key.length; i++) {
      const ch = key[i]!;
      const next = node.children.get(ch);
      hooks.onCompare?.(i + 1, ch, next !== undefined);
      if (!next) return null;
      node = next;
    }
    return node;
  }
}

/**
 * 便利函数：批量插入构建 Trie（驱动 trace/测试）。返回 Trie 实例。
 */
export function trie(keys: readonly string[], hooks: TrieHooks = {}): Trie {
  const t = new Trie();
  for (const k of keys) t.insert(k, hooks);
  return t;
}

// —— 可视化辅助：把内部树转成可视化树（与 types.ts 的 TreeNode 兼容）——

/** 可视化节点（与 TreeNode 兼容）。 */
export interface VizNode {
  id: string;
  value: string;
  children?: VizNode[];
  isEnd?: boolean;
  role?: import('../../../types.ts').BarRole;
}

/** 把 Trie 转为可视化树。highlightPath 标记当前比较/插入路径上的「depth」集合。 */
export function toVizTree(
  root: TrieNode,
  highlightDepth: ReadonlySet<number> = new Set(),
  hotChar: string | null = null,
): VizNode {
  let counter = 0;
  const build = (n: TrieNode, prefix: string, depth: number): VizNode => {
    const id = `n${counter++}`;
    const children: VizNode[] = [];
    // 排序使渲染稳定
    const sorted = [...n.children.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
    for (const [ch, child] of sorted) {
      const childNode = build(child, prefix + ch, depth + 1);
      childNode.value = ch; // 边的字符挂到子节点的 value 上展示
      children.push(childNode);
    }
    const onPath = highlightDepth.has(depth);
    return {
      id,
      value: depth === 0 ? 'ε' : prefix.slice(-1) || 'ε',
      children: children.length ? children : undefined,
      isEnd: n.isEnd,
      // 用 onPath + 字符命中决定角色：调用方可在外部二次标记
      role: onPath && hotChar === prefix.slice(-1) ? 'compare' : undefined,
    };
  };
  return build(root, '', 0);
}
