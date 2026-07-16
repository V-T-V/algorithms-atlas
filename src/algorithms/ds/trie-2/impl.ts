// =============================================================================
// 压缩字典树 Radix Tree (Patricia Trie) · 纯算法实现（零 DOM 依赖，可独立单测）
// 实现：对 Trie 做「路径压缩」——每条边存一段字符串而非单字符。
//   - insert：沿边匹配公共前缀；边中间分叉则分裂边，再挂新叶
//   - search / startsWith：同样沿边匹配
//   - 相比普通 Trie 节点数更少（= 键数 + 内部分叉数），节省空间
// =============================================================================

/** 操作过程中的事件钩子。任一可选。 */
export interface RadixTreeHooks {
  /** 插入：沿边匹配，公共前缀长度为 commonLen，边标签 edgeLabel。 */
  onMatchEdge?: (edgeLabel: string, commonLen: number) => void;
  /** 插入：新建叶子节点，边标签为 label。 */
  onCreateLeaf?: (label: string) => void;
  /** 插入：分裂一条边（原标签 label，在 splitPos 处断开）。 */
  onSplitEdge?: (label: string, splitPos: number) => void;
  /** 标记某节点为键结尾。 */
  onMarkEnd?: (key: string, redundant: boolean) => void;
  /** 查找/前缀匹配结束。 */
  onResult?: (kind: 'search' | 'prefix', key: string, ok: boolean) => void;
}

/** Radix 树节点。 */
export class RadixNode {
  /** 子边：首字符 → { label, child }。 */
  children = new Map<string, { label: string; child: RadixNode }>();
  /** 是否某完整键的结尾。 */
  isEnd = false;
}

/** 公共前缀长度。 */
function commonPrefixLen(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

/**
 * 压缩字典树（Radix Tree / Patricia Trie）。
 */
export class RadixTree {
  readonly root: RadixNode = new RadixNode();
  private count = 0;

  get size(): number {
    return this.count;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  /** 插入键。重复插入不计数。返回是否新增。 */
  insert(key: string, hooks: RadixTreeHooks = {}): boolean {
    let node = this.root;
    let remaining = key;
    while (remaining.length > 0) {
      const firstCh = remaining[0]!;
      const edge = node.children.get(firstCh);
      if (!edge) {
        // 新建叶子
        const leaf = new RadixNode();
        leaf.isEnd = true;
        node.children.set(firstCh, { label: remaining, child: leaf });
        hooks.onCreateLeaf?.(remaining);
        this.count++;
        hooks.onMarkEnd?.(key, false);
        return true;
      }
      const cpl = commonPrefixLen(edge.label, remaining);
      hooks.onMatchEdge?.(edge.label, cpl);
      if (cpl === edge.label.length) {
        // 整条边匹配：继续下到 child
        node = edge.child;
        remaining = remaining.slice(cpl);
        continue;
      }
      // 部分匹配：分裂 edge
      if (cpl < edge.label.length) {
        const splitPos = cpl;
        hooks.onSplitEdge?.(edge.label, splitPos);
        const splitNode = new RadixNode();
        const oldLabel = edge.label;
        const keptLabel = oldLabel.slice(0, splitPos); // 上半段
        const tailLabel = oldLabel.slice(splitPos); // 下半段（原 child）
        const tailFirstCh = tailLabel[0]!;
        // splitNode 继承原 child 的下半段
        splitNode.children.set(tailFirstCh, { label: tailLabel, child: edge.child });
        // edge 缩短为上半段，指向 splitNode
        edge.label = keptLabel;
        edge.child = splitNode;
        node = splitNode;
        remaining = remaining.slice(cpl);
        if (remaining.length === 0) {
          // 键恰好在分叉点结束
          if (!splitNode.isEnd) {
            splitNode.isEnd = true;
            this.count++;
            hooks.onMarkEnd?.(key, false);
            return true;
          }
          hooks.onMarkEnd?.(key, true);
          return false;
        }
      }
    }
    // remaining === ""：键已存在前缀路径，标记当前节点
    const redundant = node.isEnd;
    if (!redundant) {
      node.isEnd = true;
      this.count++;
    }
    hooks.onMarkEnd?.(key, redundant);
    return !redundant;
  }

  /** 精确查找。 */
  search(key: string, hooks: RadixTreeHooks = {}): boolean {
    const node = this.locate(key, hooks, 'search');
    const ok = node !== null && node.isEnd;
    hooks.onResult?.('search', key, ok);
    return ok;
  }

  /** 前缀判定。 */
  startsWith(prefix: string, hooks: RadixTreeHooks = {}): boolean {
    const node = this.locate(prefix, hooks, 'prefix');
    const ok = node !== null;
    hooks.onResult?.('prefix', prefix, ok);
    return ok;
  }

  /** 沿 key 走到节点；任一段缺失则返回 null。 */
  private locate(key: string, hooks: RadixTreeHooks, _kind: 'search' | 'prefix'): RadixNode | null {
    let node = this.root;
    let remaining = key;
    while (remaining.length > 0) {
      const firstCh = remaining[0]!;
      const edge = node.children.get(firstCh);
      if (!edge) return null;
      const cpl = commonPrefixLen(edge.label, remaining);
      hooks.onMatchEdge?.(edge.label, cpl);
      if (cpl === edge.label.length) {
        node = edge.child;
        remaining = remaining.slice(cpl);
      } else if (cpl === remaining.length) {
        // 剩余 key 是边标签前缀 → 命中（前缀匹配）
        return edge.child;
      } else {
        return null;
      }
    }
    return node;
  }
}

/**
 * 便利函数：批量插入构建 Radix 树，返回实例。
 */
export function trie2(keys: readonly string[], hooks: RadixTreeHooks = {}): RadixTree {
  const t = new RadixTree();
  for (const k of keys) t.insert(k, hooks);
  return t;
}
