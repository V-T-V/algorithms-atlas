// =============================================================================
// 环入口（Linked List Cycle Start）· 纯算法实现
// Floyd 龟兔赛跑法：阶段一快慢指针相遇证明有环；阶段二把慢指针归零、
// 两者同速前进，再次相遇的节点即环入口。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 slow/fast 每一步。
// =============================================================================

/** 链表节点（含 next，可成环）。 */
export interface CycleListNode {
  value: number;
  next: CycleListNode | null;
}

/**
 * 由数组构造一条无环链表。返回头节点（空数组返回 null）。
 */
export function listFromValues(arr: readonly number[]): CycleListNode | null {
  const dummy: CycleListNode = { value: 0, next: null };
  let tail = dummy;
  for (const v of arr) {
    tail.next = { value: v, next: null };
    tail = tail.next;
  }
  return dummy.next;
}

/** 链表节点列表（用于可视化与索引化）。把一条链表（含环）拍平成按访问顺序的节点数组。 */
export function collectNodes(head: CycleListNode | null): CycleListNode[] {
  const out: CycleListNode[] = [];
  const seen = new Set<CycleListNode>();
  let cur = head;
  let guard = 0;
  while (cur && !seen.has(cur) && guard < 100000) {
    seen.add(cur);
    out.push(cur);
    cur = cur.next;
    guard++;
  }
  return out;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface DetectCycleHooks {
  /** 阶段一：慢/快指针各走一步后到达的节点（下标）。 */
  onStepDetect?: (slowIdx: number, fastIdx: number) => void;
  /** 阶段二：找入口过程中两者同速前进一步的节点下标。 */
  onStepFind?: (slowIdx: number, fastIdx: number) => void;
  /** 阶段一相遇（检测到环）。meetIdx = 相遇节点下标。 */
  onMeet?: (meetIdx: number) => void;
  /** 找到环入口。entryIdx = 入口节点下标；无环时为 -1。 */
  onEntry?: (entryIdx: number) => void;
  /** 阶段切换：'detect' → 'find'。 */
  onPhase?: (phase: 'detect' | 'find') => void;
}

export interface DetectCycleResult {
  hasCycle: boolean;
  /** 环入口节点；无环时为 null。 */
  entry: CycleListNode | null;
}

/**
 * Floyd 环入口检测。
 *
 * 阶段一（检测）：slow 每次走 1 步、fast 每次走 2 步；若在链尾前相遇，则存在环。
 * 阶段二（找入口）：把 slow 重置到头节点，fast 留在相遇点，两者每次各走 1 步；
 *   再次相遇的节点即为环入口（数学上：head 到入口的距离 == 相遇点到入口沿环的距离）。
 *
 * @param head 链表头
 * @param hooks 可选事件钩子（基于节点下标，便于可视化）
 * @returns 是否有环 + 环入口节点
 */
export function detectCycleStart(
  head: CycleListNode | null,
  hooks: DetectCycleHooks = {},
): DetectCycleResult {
  if (!head) {
    hooks.onEntry?.(-1);
    return { hasCycle: false, entry: null };
  }

  // 为钩子建立节点→下标映射（沿链表访问顺序）
  const nodes = collectNodes(head);
  const indexOf = (n: CycleListNode | null): number => {
    if (!n) return -1;
    return nodes.indexOf(n);
  };

  // 阶段一：检测
  hooks.onPhase?.('detect');
  let slow: CycleListNode | null = head;
  let fast: CycleListNode | null = head;
  let meet: CycleListNode | null = null;
  let guard = 0;
  // slow 走一步、fast 走两步；先各走一步再比较
  for (;;) {
    slow = slow!.next;
    if (!slow) break;
    fast = fast!.next?.next ?? null;
    if (!fast) break;
    hooks.onStepDetect?.(indexOf(slow), indexOf(fast));
    if (slow === fast) {
      meet = slow;
      hooks.onMeet?.(indexOf(meet));
      break;
    }
    if (++guard > 1_000_000) break;
  }

  if (!meet) {
    hooks.onEntry?.(-1);
    return { hasCycle: false, entry: null };
  }

  // 阶段二：找入口
  hooks.onPhase?.('find');
  slow = head;
  guard = 0;
  // 两者同速前进，直到相遇
  while (slow !== fast) {
    slow = slow!.next;
    fast = fast!.next;
    if (!slow || !fast) break; // 理论上不会发生（已有环）
    hooks.onStepFind?.(indexOf(slow), indexOf(fast));
    if (++guard > 1_000_000) break;
  }
  hooks.onEntry?.(indexOf(slow));
  return { hasCycle: true, entry: slow };
}
