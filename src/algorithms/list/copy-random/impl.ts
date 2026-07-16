// =============================================================================
// 复制带随机指针的链表（Copy List with Random Pointer）· 纯算法实现
// 每个节点除 next 外还有 random 指针（可指向任意节点或 null），深拷贝整条链。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 带随机指针的链表节点。 */
export interface RandomNode {
  value: number;
  next: RandomNode | null;
  random: RandomNode | null;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface CopyRandomHooks {
  /** 在每个原节点后插入其副本。 */
  onInterleave?: (orig: RandomNode, copy: RandomNode) => void;
  /** 设置副本的 random 指针。 */
  onRandom?: (copy: RandomNode, target: RandomNode | null) => void;
  /** 拆分出独立副本链。 */
  onSplit?: (copyHead: RandomNode | null) => void;
}

/**
 * 深拷贝带随机指针的链表（原地交织法，O(1) 额外空间）。
 * 步骤：1) 每个原节点后插入副本；2) 副本.random = 原节点.random.next；3) 拆分。
 * 时间 O(n)，空间 O(1)。
 */
export function copyRandom(
  head: RandomNode | null,
  hooks: CopyRandomHooks = {},
): RandomNode | null {
  if (head === null) return null;
  // 1) 交织
  let cur: RandomNode | null = head;
  while (cur !== null) {
    const copy: RandomNode = { value: cur.value, next: cur.next, random: null };
    cur.next = copy;
    hooks.onInterleave?.(cur, copy);
    cur = copy.next;
  }
  // 2) 设置 random
  cur = head;
  while (cur !== null) {
    const copy: RandomNode = cur.next!;
    copy.random = cur.random === null ? null : cur.random.next;
    hooks.onRandom?.(copy, copy.random);
    cur = copy.next;
  }
  // 3) 拆分
  const copyHead: RandomNode | null = head.next;
  cur = head;
  while (cur !== null) {
    const copy: RandomNode = cur.next!;
    const origNext: RandomNode | null = copy.next;
    cur.next = origNext; // 还原原链
    copy.next = origNext === null ? null : origNext.next;
    cur = origNext;
  }
  hooks.onSplit?.(copyHead);
  return copyHead;
}

/** 从数组构建带随机指针的链表：randomIdx[i] = 第 i 个节点 random 指向的节点下标（-1 表示 null）。 */
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

/** 把带随机指针的链表拍平成 [value, randomIdx][]。 */
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
