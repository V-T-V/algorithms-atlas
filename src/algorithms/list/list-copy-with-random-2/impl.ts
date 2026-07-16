// =============================================================================
// 带随机指针深拷贝（穿插法）· 纯算法实现
// =============================================================================

export interface RandomNode {
  value: number;
  next: RandomNode | null;
  random: RandomNode | null;
}

export function buildRandomList(
  values: readonly number[],
  randomIndex: readonly (number | null)[],
): RandomNode | null {
  if (values.length === 0) return null;
  const nodes: RandomNode[] = values.map((v) => ({ value: v, next: null, random: null }));
  for (let i = 0; i < nodes.length; i++) {
    if (i + 1 < nodes.length) nodes[i]!.next = nodes[i + 1]!;
    const ri = randomIndex[i];
    nodes[i]!.random = ri === null ? null : nodes[ri!]!;
  }
  return nodes[0]!;
}

export interface CopyWithRandom2Hooks {
  onWeave?: (originalValue: number, copyValue: number) => void;
  onRandomLink?: (copyValue: number, pointsTo: number | null) => void;
  onSplit?: (copiedCount: number) => void;
  onDone?: (head: RandomNode | null) => void;
}

/**
 * 穿插法深拷贝带随机指针的链表。
 */
export function copyWithRandom2(
  head: RandomNode | null,
  hooks: CopyWithRandom2Hooks = {},
): RandomNode | null {
  if (head === null) {
    hooks.onDone?.(null);
    return null;
  }
  // 1. 穿插复制节点
  let cur: RandomNode | null = head;
  while (cur !== null) {
    const copy: RandomNode = { value: cur.value, next: cur.next, random: null };
    cur.next = copy;
    hooks.onWeave?.(cur.value, copy.value);
    cur = copy.next;
  }
  // 2. 设置 random 指针
  cur = head;
  while (cur !== null) {
    const copy: RandomNode = cur.next!;
    copy.random = cur.random !== null ? cur.random.next : null;
    hooks.onRandomLink?.(copy.value, copy.random ? copy.random.value : null);
    cur = copy.next;
  }
  // 3. 分离
  const dummy: RandomNode = { value: NaN, next: null, random: null };
  let tail = dummy;
  cur = head;
  let count = 0;
  while (cur !== null) {
    const copy: RandomNode = cur.next!;
    cur.next = copy.next;
    tail.next = copy;
    tail = copy;
    count++;
    cur = copy.next;
  }
  hooks.onSplit?.(count);
  const newHead = dummy.next;
  hooks.onDone?.(newHead);
  return newHead;
}

/** 把随机指针链表拍平为 (value, randomIndex) 数组。 */
export function randomListToArray(
  head: RandomNode | null,
): Array<{ value: number; random: number | null }> {
  const indexMap = new Map<RandomNode, number>();
  let i = 0;
  let cur = head;
  while (cur) {
    indexMap.set(cur, i++);
    cur = cur.next;
  }
  const out: Array<{ value: number; random: number | null }> = [];
  cur = head;
  while (cur) {
    out.push({ value: cur.value, random: cur.random ? (indexMap.get(cur.random) ?? null) : null });
    cur = cur.next;
  }
  return out;
}
