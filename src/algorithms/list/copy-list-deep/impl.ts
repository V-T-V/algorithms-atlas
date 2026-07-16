// =============================================================================
// 深拷贝链表（Deep Copy Linked List）· 纯算法实现
// 递归 + 哈希记忆化，支持 next + random（任意指针），正确处理环。零 DOM 依赖，可独立单测。
// =============================================================================

/** 带任意指针的链表节点。 */
export interface RandomNode {
  value: number;
  next: RandomNode | null;
  random: RandomNode | null;
}

export interface CopyListDeepHooks {
  /** 为原节点创建副本。 */
  onCreate?: (orig: RandomNode, copy: RandomNode) => void;
  /** 命中缓存：原节点已有副本，直接复用。 */
  onCacheHit?: (orig: RandomNode) => void;
  /** 设置副本的 random 指针。 */
  onRandom?: (copy: RandomNode, target: RandomNode | null) => void;
}

/**
 * 深拷贝带 next + random 的链表，递归 + 记忆化。
 * 正确处理环与共享指针。时间 O(n)，空间 O(n)。
 */
export function copyListDeep(
  head: RandomNode | null,
  hooks: CopyListDeepHooks = {},
): RandomNode | null {
  const memo = new Map<RandomNode, RandomNode>();

  const copyNode = (node: RandomNode | null): RandomNode | null => {
    if (node === null) return null;
    const cached = memo.get(node);
    if (cached) {
      hooks.onCacheHit?.(node);
      return cached;
    }
    const cp: RandomNode = { value: node.value, next: null, random: null };
    memo.set(node, cp); // 先登记，避免环导致无限递归
    hooks.onCreate?.(node, cp);
    cp.next = copyNode(node.next);
    cp.random = copyNode(node.random);
    if (cp.random !== null) hooks.onRandom?.(cp, cp.random);
    return cp;
  };

  return copyNode(head);
}

/** 从数组构建带 random 的链表：randomIdx[i] = 第 i 个节点 random 指向下标（-1 = null）。 */
export function buildRandomList(
  values: readonly number[],
  randomIdx: readonly number[],
): RandomNode | null {
  if (values.length === 0) return null;
  const nodes: RandomNode[] = values.map((v) => ({ value: v, next: null, random: null }));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i]!.next = nodes[i + 1]!;
  for (let i = 0; i < nodes.length; i++) {
    const idx = randomIdx[i] ?? -1;
    nodes[i]!.random = idx >= 0 && idx < nodes.length ? nodes[idx]! : null;
  }
  return nodes[0]!;
}

/** 拍平成 [value, randomIdx][]（便于断言）。 */
export function randomListToArray(head: RandomNode | null): Array<[number, number]> {
  const idx = new Map<RandomNode, number>();
  let i = 0;
  let cur = head;
  while (cur) {
    idx.set(cur, i++);
    cur = cur.next;
  }
  const out: Array<[number, number]> = [];
  cur = head;
  while (cur) {
    out.push([cur.value, cur.random === null ? -1 : (idx.get(cur.random) ?? -1)]);
    cur = cur.next;
  }
  return out;
}

/** 拍平成纯 next 数组（用于无 random 的简单链表断言）。 */
export function toArray(head: RandomNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}
