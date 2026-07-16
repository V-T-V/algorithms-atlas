// Generator for 45 list algorithms (55 -> 100). ids use 'list-' prefix to stay unique.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'list';
const INDEX = `import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';
export { meta } from './meta.ts';
export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`;
function writeAlg(id, metaSrc, impl, trace, test) {
  const dir = join(ROOT, 'src/algorithms', CAT, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'meta.ts'), metaSrc);
  writeFileSync(join(dir, 'impl.ts'), impl);
  writeFileSync(join(dir, 'trace.ts'), trace);
  writeFileSync(join(dir, 'index.ts'), INDEX);
  mkdirSync(join(ROOT, 'test', CAT), { recursive: true });
  writeFileSync(join(ROOT, 'test', CAT, `${id}.test.ts`), test);
}
function meta(id, zh, en, sumZh, sumEn, descZh, descEn, time, space, tags) {
  return `// ${zh} · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: '${id}',
  categoryId: '${CAT}',
  title: { zh: ${JSON.stringify(zh)}, en: ${JSON.stringify(en)} },
  summary: { zh: ${JSON.stringify(sumZh)}, en: ${JSON.stringify(sumEn)} },
  description: { zh: ${JSON.stringify(descZh)}, en: ${JSON.stringify(descEn)} },
  tags: ${JSON.stringify(tags)},
  complexity: { time: '${time}', space: '${space}' },
};`;
}

const ALGS = [];
// Shared list helpers (inlined per alg to be self-contained)
const LIST_HELPERS = `
export interface ListNode { value: number; next: ListNode | null; }
export function buildList(values: readonly number[]): ListNode | null {
  if (values.length === 0) return null;
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  for (const v of values) { tail.next = { value: v, next: null }; tail = tail.next; }
  return dummy.next;
}
export function listToArray(head: ListNode | null): number[] {
  const out: number[] = []; let cur = head;
  while (cur) { out.push(cur.value); cur = cur.next; }
  return out;
}
`;

// 1. list-merge-3  —— 合并两个有序链表 (迭代)
ALGS.push({
  id: 'list-merge-3',
  m: ['合并有序链表v3', 'Merge Two Sorted Lists v3', '迭代合并两个升序链表为一个新的升序链表。', 'Iteratively merge two ascending lists into one.',
    '用 dummy 头 + tail 指针：每步取较小节点接到 tail 后。O(n+m)。', 'Dummy head + tail; append the smaller each step. O(n+m).', 'O(n+m)', 'O(1)', ['list', 'merge', 'two-pointers']],
  impl: `${LIST_HELPERS}
export interface MergeHooks { onAppend?: (v: number) => void; onResult?: (h: ListNode | null) => void; }
export function mergeSorted(a: ListNode | null, b: ListNode | null, hooks: MergeHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  while (a && b) {
    if (a.value <= b.value) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; }
    tail = tail.next;
    hooks.onAppend?.(tail.value);
  }
  tail.next = a ?? b;
  const head = dummy.next;
  hooks.onResult?.(head);
  return head;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, mergeSorted } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 3, 5], b: [2, 4, 6] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildList(input.a), b = buildList(input.b);
  rec.begin({ zh: '合并 ' + JSON.stringify(input.a) + ' 与 ' + JSON.stringify(input.b), en: 'Merge' }).commit();
  const merged = mergeSorted(a, b, { onAppend: (v) => rec.begin({ zh: '追加 ' + v, en: 'append ' + v }).setAux([{ label: 'appended', value: String(v), role: 'pivot' as BarRole }]).commit() });
  const arr = listToArray(merged);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, mergeSorted } from '../../src/algorithms/list/list-merge-3/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-merge-3/trace.ts';
test('mergeSorted 正确', () => {
  assert.deepEqual(listToArray(mergeSorted(buildList([1,3,5]), buildList([2,4,6]))), [1,2,3,4,5,6]);
  assert.deepEqual(listToArray(mergeSorted(buildList([]), buildList([1,2]))), [1,2]);
  assert.deepEqual(listToArray(mergeSorted(buildList([1]), buildList([]))), [1]);
  assert.deepEqual(listToArray(mergeSorted(null, null)), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 2. list-reverse-3  —— 三指针原地反转
ALGS.push({
  id: 'list-reverse-3',
  m: ['反转链表v3', 'Reverse Linked List v3', '用三指针迭代原地反转单链表。', 'Reverse a singly linked list iteratively with three pointers.',
    'prev=null, cur=head；每步把 cur.next 指向 prev 并整体右移。', 'prev/cur/next pointers; flip each link. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'reverse', 'iterative']],
  impl: `${LIST_HELPERS}
export interface ReverseHooks { onFlip?: (v: number) => void; onResult?: (h: ListNode | null) => void; }
export function reverseList(head: ListNode | null, hooks: ReverseHooks = {}): ListNode | null {
  let prev: ListNode | null = null, cur = head;
  while (cur) {
    const nxt = cur.next;
    cur.next = prev;
    hooks.onFlip?.(cur.value);
    prev = cur; cur = nxt;
  }
  hooks.onResult?.(prev);
  return prev;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, reverseList } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '反转', en: 'Reverse' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const nh = reverseList(head, { onFlip: (v) => rec.begin({ zh: '翻转 ' + v, en: 'flip ' + v }).setArray([...input], input.map(() => 'default' as BarRole), []).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, reverseList } from '../../src/algorithms/list/list-reverse-3/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-reverse-3/trace.ts';
test('reverseList 正确', () => {
  assert.deepEqual(listToArray(reverseList(buildList([1,2,3,4,5]))), [5,4,3,2,1]);
  assert.deepEqual(listToArray(reverseList(buildList([1]))), [1]);
  assert.deepEqual(listToArray(reverseList(null)), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 3. list-cycle-detect-2  —— 快慢指针判环
ALGS.push({
  id: 'list-cycle-detect-2',
  m: ['快慢判环v2', 'Floyd Cycle Detection v2', '快慢指针判环：快走2步、慢走1步，相遇即有环。', 'Floyd tortoise/hare: if they meet, a cycle exists.',
    'slow 每次走一步，fast 走两步；若有环必然相遇，否则 fast 到 null。', 'Slow=1, fast=2; meet iff cycle. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'cycle', 'floyd']],
  impl: `${LIST_HELPERS}
export interface CycleHooks { onStep?: (slow: number | null, fast: number | null) => void; onResult?: (has: boolean) => void; }
export function hasCycle(head: ListNode | null, hooks: CycleHooks = {}): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    hooks.onStep?.(slow?.value ?? null, fast?.value ?? null);
    if (slow === fast) { hooks.onResult?.(true); return true; }
  }
  hooks.onResult?.(false);
  return false;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, hasCycle } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  // 构造一个有环链表 1->2->3->4->2
  const n1 = { value: 1, next: null } as any, n2 = { value: 2, next: null } as any, n3 = { value: 3, next: null } as any, n4 = { value: 4, next: null } as any;
  n1.next = n2; n2.next = n3; n3.next = n4; n4.next = n2;
  rec.begin({ zh: '带环链表 1→2→3→4→2', en: 'Cyclic list' }).commit();
  const has = hasCycle(n1, { onStep: (s, f) => rec.begin({ zh: 'slow=' + s + ' fast=' + f, en: 'slow=' + s + ' fast=' + f }).setAux([{ label: 'slow', value: String(s), role: 'pivot' as BarRole }, { label: 'fast', value: String(f), role: 'frontier' as BarRole }]).commit() });
  rec.begin({ zh: '有环？' + has, en: 'has cycle? ' + has }).setAux([{ label: 'hasCycle', value: String(has), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, hasCycle } from '../../src/algorithms/list/list-cycle-detect-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-cycle-detect-2/trace.ts';
test('hasCycle 无环', () => {
  assert.equal(hasCycle(buildList([1,2,3,4])), false);
  assert.equal(hasCycle(null), false);
});
test('hasCycle 有环', () => {
  const a: any = { value: 1, next: null }, b: any = { value: 2, next: null }, c: any = { value: 3, next: null };
  a.next = b; b.next = c; c.next = b;
  assert.equal(hasCycle(a), true);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 4. list-mid-2  —— 快慢指针找中点
ALGS.push({
  id: 'list-mid-2',
  m: ['找中点v2', 'Find Middle v2', '快慢指针一次遍历找链表中点。', 'One-pass middle via fast/slow pointers.',
    'slow 走一步、fast 走两步；fast 到末尾时 slow 即中点（偶数取前半最后一个）。', 'fast=2, slow=1; slow ends at middle. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'middle', 'two-pointers']],
  impl: `${LIST_HELPERS}
export interface MidHooks { onStep?: (slow: number) => void; onResult?: (mid: number | null) => void; }
export function findMiddle(head: ListNode | null, hooks: MidHooks = {}): ListNode | null {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next; fast = fast.next.next;
    hooks.onStep?.(slow.value);
  }
  hooks.onResult?.(slow?.value ?? null);
  return slow;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, findMiddle } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '找中点', en: 'Find middle' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const mid = findMiddle(head, { onStep: (v) => rec.begin({ zh: 'slow 走到 ' + v, en: 'slow at ' + v }).setArray([...input], input.map(() => 'default' as BarRole), []).commit() });
  rec.begin({ zh: '中点 = ' + (mid?.value ?? null), en: 'mid = ' + (mid?.value ?? null) }).setAux([{ label: 'mid', value: String(mid?.value ?? null), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, findMiddle } from '../../src/algorithms/list/list-mid-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-mid-2/trace.ts';
test('findMiddle 正确', () => {
  assert.equal(findMiddle(buildList([1,2,3,4,5]))!.value, 3);
  assert.equal(findMiddle(buildList([1,2,3,4]))!.value, 3);
  assert.equal(findMiddle(buildList([1]))!.value, 1);
  assert.equal(findMiddle(null), null);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 5. list-remove-nth-2  —— 删除倒数第n个
ALGS.push({
  id: 'list-remove-nth-2',
  m: ['删倒数第n', 'Remove Nth From End v2', '一次遍历删除倒数第 n 个节点。', 'Remove the nth node from end in one pass.',
    'fast 先走 n 步，再 slow/fast 同步走；fast 到末尾时 slow.next 即待删节点。', 'fast advances n first, then move together. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'remove', 'two-pointers']],
  impl: `${LIST_HELPERS}
export interface RemoveNthHooks { onRemove?: (v: number) => void; onResult?: (h: ListNode | null) => void; }
export function removeNthEnd(head: ListNode | null, n: number, hooks: RemoveNthHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let fast: ListNode | null = head;
  for (let i = 0; i < n; i++) fast = fast ? fast.next : null;
  let slow = dummy;
  while (fast) { slow = slow.next!; fast = fast.next; }
  const target = slow.next;
  if (target) hooks.onRemove?.(target.value);
  slow.next = target ? target.next : null;
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, removeNthEnd } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5], n: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '删倒数第 ' + input.n, en: 'Remove nth from end' }).setArray([...input.arr], input.arr.map(() => 'default' as BarRole), []).commit();
  const nh = removeNthEnd(head, input.n, { onRemove: (v) => rec.begin({ zh: '删除 ' + v, en: 'remove ' + v }).setAux([{ label: 'removed', value: String(v), role: 'swap' as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, removeNthEnd } from '../../src/algorithms/list/list-remove-nth-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-remove-nth-2/trace.ts';
test('removeNthEnd 正确', () => {
  assert.deepEqual(listToArray(removeNthEnd(buildList([1,2,3,4,5]), 2)), [1,2,3,5]);
  assert.deepEqual(listToArray(removeNthEnd(buildList([1,2,3]), 3)), [2,3]);
  assert.deepEqual(listToArray(removeNthEnd(buildList([1]), 1)), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 6. list-delete-dup-2  —— 有序链表去重
ALGS.push({
  id: 'list-delete-dup-2',
  m: ['有序去重v2', 'Remove Duplicates from Sorted v2', '删除有序链表中的重复节点，保留唯一副本。', 'Drop duplicates from a sorted list, keeping one copy each.',
    '遍历时若 cur.value == cur.next.value 则跳过 next。', 'Skip next when cur.val==next.val. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'duplicates', 'sorted']],
  impl: `${LIST_HELPERS}
export interface DedupHooks { onDrop?: (v: number) => void; onResult?: (h: ListNode | null) => void; }
export function deleteDuplicates(head: ListNode | null, hooks: DedupHooks = {}): ListNode | null {
  let cur = head;
  while (cur && cur.next) {
    if (cur.value === cur.next.value) {
      hooks.onDrop?.(cur.next.value);
      cur.next = cur.next.next;
    } else cur = cur.next;
  }
  hooks.onResult?.(head);
  return head;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, deleteDuplicates } from './impl.ts';
export const DEFAULT_INPUT = [1, 1, 2, 3, 3, 3, 4];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '有序去重', en: 'Remove duplicates' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const nh = deleteDuplicates(head, { onDrop: (v) => rec.begin({ zh: '删除重复 ' + v, en: 'drop dup ' + v }).setAux([{ label: 'dropped', value: String(v), role: 'swap' as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, deleteDuplicates } from '../../src/algorithms/list/list-delete-dup-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-delete-dup-2/trace.ts';
test('deleteDuplicates 正确', () => {
  assert.deepEqual(listToArray(deleteDuplicates(buildList([1,1,2,3,3,4]))), [1,2,3,4]);
  assert.deepEqual(listToArray(deleteDuplicates(buildList([1,1,1]))), [1]);
  assert.deepEqual(listToArray(deleteDuplicates(null)), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 7. list-palindrome-3  —— 判断回文链表（快慢+反转后半）
ALGS.push({
  id: 'list-palindrome-3',
  m: ['回文链表v3', 'Palindrome List v3', '快慢指针找中点后反转后半段比较判断回文。', 'Check palindrome by reversing the second half and comparing.',
    '找中点 → 反转后半 → 双指针比较。O(n) 时间 O(1) 空间。', 'Find mid, reverse second half, compare. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'palindrome', 'two-pointers']],
  impl: `${LIST_HELPERS}
export interface PalHooks { onCompare?: (a: number, b: number) => void; onResult?: (p: boolean) => void; }
function reverse(h: ListNode | null): ListNode | null {
  let prev: ListNode | null = null, cur = h;
  while (cur) { const n = cur.next; cur.next = prev; prev = cur; cur = n; }
  return prev;
}
export function isPalindrome(head: ListNode | null, hooks: PalHooks = {}): boolean {
  if (!head || !head.next) { hooks.onResult?.(true); return true; }
  let slow = head, fast = head;
  while (fast.next && fast.next.next) { slow = slow.next!; fast = fast.next.next; }
  let second = reverse(slow.next);
  let p1 = head, p2 = second;
  let ok = true;
  while (p2) {
    hooks.onCompare?.(p1.value, p2.value);
    if (p1.value !== p2.value) ok = false;
    p1 = p1.next!; p2 = p2.next;
  }
  slow.next = reverse(second); // 恢复
  hooks.onResult?.(ok);
  return ok;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, isPalindrome } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 2, 1];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '回文判断', en: 'Palindrome check' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const r = isPalindrome(head, { onCompare: (a, b) => rec.begin({ zh: '比较 ' + a + ' 与 ' + b, en: 'compare ' + a + ' vs ' + b }).setAux([{ label: 'a', value: String(a), role: 'pivot' as BarRole }, { label: 'b', value: String(b), role: 'frontier' as BarRole }]).commit() });
  rec.begin({ zh: '回文？' + r, en: 'palindrome? ' + r }).setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, isPalindrome } from '../../src/algorithms/list/list-palindrome-3/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-palindrome-3/trace.ts';
test('isPalindrome 正确', () => {
  assert.equal(isPalindrome(buildList([1,2,3,2,1])), true);
  assert.equal(isPalindrome(buildList([1,2,2,1])), true);
  assert.equal(isPalindrome(buildList([1,2,3])), false);
  assert.equal(isPalindrome(buildList([1])), true);
  assert.equal(isPalindrome(null), true);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 8. list-intersect-2  —— 两链表交点
ALGS.push({
  id: 'list-intersect-2',
  m: ['链表交点v2', 'Intersection of Two Lists v2', '双指针走完自身再走对方，相遇即交点。', 'Two pointers swap heads after reaching the end; meet at the intersection.',
    '让两指针走过相同总长（a+b）：pA 走完 A 走 B，pB 走完 B 走 A，必在交点相遇或同时为 null。', 'Swap traversal: pA walks A then B, pB walks B then A. O(n+m), O(1).', 'O(n+m)', 'O(1)', ['list', 'intersection', 'two-pointers']],
  impl: `${LIST_HELPERS}
export interface IntersectHooks { onStep?: (va: number | null, vb: number | null) => void; onResult?: (v: number | null) => void; }
export function getIntersection(headA: ListNode | null, headB: ListNode | null, hooks: IntersectHooks = {}): ListNode | null {
  if (!headA || !headB) { hooks.onResult?.(null); return null; }
  let pa: ListNode | null = headA, pb: ListNode | null = headB;
  while (pa !== pb) {
    pa = pa ? pa.next : headB;
    pb = pb ? pb.next : headA;
    hooks.onStep?.(pa?.value ?? null, pb?.value ?? null);
  }
  hooks.onResult?.(pa?.value ?? null);
  return pa;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { getIntersection } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const shared: any = { value: 8, next: { value: 10, next: null } };
  const a: any = { value: 1, next: { value: 2, next: shared } };
  const b: any = { value: 3, next: shared };
  rec.begin({ zh: '求交点', en: 'Find intersection' }).commit();
  const node = getIntersection(a, b, { onStep: (va, vb) => rec.begin({ zh: 'pa=' + va + ' pb=' + vb, en: 'pa=' + va + ' pb=' + vb }).setAux([{ label: 'pa', value: String(va), role: 'pivot' as BarRole }, { label: 'pb', value: String(vb), role: 'frontier' as BarRole }]).commit() });
  rec.begin({ zh: '交点 = ' + (node?.value ?? null), en: 'intersect = ' + (node?.value ?? null) }).setAux([{ label: 'intersect', value: String(node?.value ?? null), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getIntersection } from '../../src/algorithms/list/list-intersect-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-intersect-2/trace.ts';
test('getIntersection 有交点', () => {
  const shared: any = { value: 8, next: { value: 10, next: null } };
  const a: any = { value: 1, next: { value: 2, next: shared } };
  const b: any = { value: 3, next: shared };
  assert.equal(getIntersection(a, b), shared);
});
test('getIntersection 无交点', () => {
  const a: any = { value: 1, next: { value: 2, next: null } };
  const b: any = { value: 3, next: { value: 4, next: null } };
  assert.equal(getIntersection(a, b), null);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 9. list-partition-3  —— 按值分区 (小于x在前)
ALGS.push({
  id: 'list-partition-3',
  m: ['按值分区v3', 'Partition List v3', '把小于 x 的节点移到前面，保持相对顺序。', 'Move nodes smaller than x to the front, preserving order.',
    '维护两个子链表（less / ge），最后拼接。', 'Build two sublists (<x and >=x) then concatenate. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'partition']],
  impl: `${LIST_HELPERS}
export interface PartHooks { onMove?: (v: number, side: 'lt' | 'ge') => void; onResult?: (h: ListNode | null) => void; }
export function partition(head: ListNode | null, x: number, hooks: PartHooks = {}): ListNode | null {
  const ltD: ListNode = { value: NaN, next: null };
  const geD: ListNode = { value: NaN, next: null };
  let lt = ltD, ge = geD, cur = head;
  while (cur) {
    if (cur.value < x) { lt.next = cur; lt = cur; hooks.onMove?.(cur.value, 'lt'); }
    else { ge.next = cur; ge = cur; hooks.onMove?.(cur.value, 'ge'); }
    cur = cur.next;
  }
  ge.next = null;
  lt.next = geD.next;
  const h = ltD.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, partition } from './impl.ts';
export const DEFAULT_INPUT = { arr: [3, 5, 8, 5, 10, 2, 1], x: 5 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '按 ' + input.x + ' 分区', en: 'Partition by ' + input.x }).setArray([...input.arr], input.arr.map(() => 'default' as BarRole), []).commit();
  const nh = partition(head, input.x, { onMove: (v, side) => rec.begin({ zh: v + ' → ' + side, en: v + ' → ' + side }).setAux([{ label: side, value: String(v), role: (side === 'lt' ? 'pivot' : 'frontier') as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, partition } from '../../src/algorithms/list/list-partition-3/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-partition-3/trace.ts';
test('partition 正确', () => {
  assert.deepEqual(listToArray(partition(buildList([3,5,8,5,10,2,1]), 5)), [3,2,1,5,8,5,10]);
  assert.deepEqual(listToArray(partition(buildList([2,1]), 2)), [1,2]);
  assert.deepEqual(listToArray(partition(null, 1)), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 10. list-rotate-3  —— 向右旋转k位
ALGS.push({
  id: 'list-rotate-3',
  m: ['旋转链表v3', 'Rotate List Right v3', '把链表向右旋转 k 位。', 'Rotate the list to the right by k positions.',
    'k mod n，把尾节点连回头形成环，再在第 (n-k) 处断开。', 'Close the ring, then cut at n-k. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'rotate']],
  impl: `${LIST_HELPERS}
export interface RotateHooks { onCut?: (cutVal: number) => void; onResult?: (h: ListNode | null) => void; }
export function rotateRight(head: ListNode | null, k: number, hooks: RotateHooks = {}): ListNode | null {
  if (!head || !head.next || k === 0) return head;
  let n = 1, tail = head;
  while (tail.next) { tail = tail.next; n++; }
  k = ((k % n) + n) % n;
  if (k === 0) return head;
  tail.next = head;
  let steps = n - k;
  let cur = tail;
  while (steps > 0) { cur = cur.next!; steps--; }
  const newHead = cur.next!;
  hooks.onCut?.(cur.value);
  cur.next = null;
  hooks.onResult?.(newHead);
  return newHead;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, rotateRight } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5], k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '右旋 ' + input.k, en: 'Rotate right ' + input.k }).setArray([...input.arr], input.arr.map(() => 'default' as BarRole), []).commit();
  const nh = rotateRight(head, input.k, { onCut: (v) => rec.begin({ zh: '在 ' + v + ' 后断开', en: 'cut after ' + v }).setAux([{ label: 'cut', value: String(v), role: 'swap' as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, rotateRight } from '../../src/algorithms/list/list-rotate-3/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-rotate-3/trace.ts';
test('rotateRight 正确', () => {
  assert.deepEqual(listToArray(rotateRight(buildList([1,2,3,4,5]), 2)), [4,5,1,2,3]);
  assert.deepEqual(listToArray(rotateRight(buildList([1,2,3]), 4)), [3,1,2]);
  assert.deepEqual(listToArray(rotateRight(buildList([1]), 5)), [1]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 11. list-split-2  —— 按值拆分链表为两段
ALGS.push({
  id: 'list-split-2',
  m: ['拆分链表v2', 'Split List by Value v2', '把链表按值 x 拆成 <x 与 >=x 两段（返回两个头）。', 'Split a list into two (<x and >=x) by a pivot value.',
    '一次遍历把节点分别接到 less 或 ge 链。', 'Single pass, append to less/ge lists. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'split']],
  impl: `${LIST_HELPERS}
export interface SplitHooks { onSplit?: (v: number, side: 'lt' | 'ge') => void; onResult?: (a: ListNode | null, b: ListNode | null) => void; }
export function splitByValue(head: ListNode | null, x: number, hooks: SplitHooks = {}): [ListNode | null, ListNode | null] {
  const ltD: ListNode = { value: NaN, next: null };
  const geD: ListNode = { value: NaN, next: null };
  let lt = ltD, ge = geD, cur = head;
  while (cur) {
    const side = cur.value < x ? 'lt' : 'ge';
    if (side === 'lt') { lt.next = cur; lt = cur; } else { ge.next = cur; ge = cur; }
    hooks.onSplit?.(cur.value, side);
    cur = cur.next;
  }
  lt.next = null; ge.next = null;
  hooks.onResult?.(ltD.next, geD.next);
  return [ltD.next, geD.next];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, splitByValue } from './impl.ts';
export const DEFAULT_INPUT = { arr: [4, 1, 3, 2, 5], x: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '按 ' + input.x + ' 拆分', en: 'Split by ' + input.x }).commit();
  const [a, b] = splitByValue(head, input.x, { onSplit: (v, side) => rec.begin({ zh: v + ' → ' + side, en: v + ' → ' + side }).setAux([{ label: side, value: String(v), role: (side === 'lt' ? 'pivot' : 'frontier') as BarRole }]).commit() });
  rec.begin({ zh: 'lt: ' + listToArray(a).join(',') + ' | ge: ' + listToArray(b).join(','), en: 'split done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, splitByValue } from '../../src/algorithms/list/list-split-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-split-2/trace.ts';
test('splitByValue 正确', () => {
  const [a, b] = splitByValue(buildList([4,1,3,2,5]), 3);
  assert.deepEqual(listToArray(a), [1,2]);
  assert.deepEqual(listToArray(b), [4,3,5]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 12. list-add-numbers-3  —— 两数相加（链表逆序表示）
ALGS.push({
  id: 'list-add-numbers-3',
  m: ['链表加法v3', 'Add Two Numbers v3', '两个逆序链表表示的数相加，返回逆序结果链表。', 'Add two numbers represented as reversed lists.',
    '逐位相加并维护进位。', 'Digit-wise add with carry. O(max(n,m)), O(max(n,m)).', 'O(max(n,m))', 'O(max(n,m))', ['list', 'addition', 'arithmetic']],
  impl: `${LIST_HELPERS}
export interface AddNumHooks { onDigit?: (d: number, carry: number) => void; onResult?: (h: ListNode | null) => void; }
export function addTwoNumbers(a: ListNode | null, b: ListNode | null, hooks: AddNumHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy, carry = 0;
  while (a || b || carry) {
    const sum = (a ? a.value : 0) + (b ? b.value : 0) + carry;
    carry = Math.floor(sum / 10);
    tail.next = { value: sum % 10, next: null };
    tail = tail.next;
    hooks.onDigit?.(tail.value, carry);
    a = a ? a.next : null;
    b = b ? b.next : null;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, addTwoNumbers } from './impl.ts';
export const DEFAULT_INPUT = { a: [2, 4, 3], b: [5, 6, 4] }; // 342 + 465 = 807
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildList(input.a), b = buildList(input.b);
  rec.begin({ zh: '342 + 465', en: '342 + 465' }).commit();
  const h = addTwoNumbers(a, b, { onDigit: (d, c) => rec.begin({ zh: '位 ' + d + ' 进位 ' + c, en: 'digit ' + d + ' carry ' + c }).setAux([{ label: 'digit', value: String(d), role: 'pivot' as BarRole }, { label: 'carry', value: String(c), role: 'frontier' as BarRole }]).commit() });
  const arr = listToArray(h);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, addTwoNumbers } from '../../src/algorithms/list/list-add-numbers-3/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-add-numbers-3/trace.ts';
test('addTwoNumbers 正确', () => {
  assert.deepEqual(listToArray(addTwoNumbers(buildList([2,4,3]), buildList([5,6,4]))), [7,0,8]);
  assert.deepEqual(listToArray(addTwoNumbers(buildList([0]), buildList([0]))), [0]);
  assert.deepEqual(listToArray(addTwoNumbers(buildList([9,9]), buildList([1]))), [0,0,1]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 13. list-copy-random-2  —— 深拷贝带随机指针
ALGS.push({
  id: 'list-copy-random-2',
  m: ['拷贝随机指针v2', 'Copy List with Random Pointer v2', '深拷贝每个节点带 next 与 random 指针的链表。', 'Deep-copy a list whose nodes carry next and random pointers.',
    '第一遍在原节点后插入拷贝，第二遍连接 random，第三遍拆分。', 'Interleave copies, link random, then split. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'copy', 'random-pointer']],
  impl: `export interface RNode { value: number; next: RNode | null; random: RNode | null; }
export interface CopyRandomHooks { onLink?: (v: number, rv: number | null) => void; }
export function copyRandomList(head: RNode | null, hooks: CopyRandomHooks = {}): RNode | null {
  if (!head) return null;
  // 1. 插入拷贝
  let cur: RNode | null = head;
  while (cur) {
    const copy: RNode = { value: cur.value, next: cur.next, random: null };
    cur.next = copy;
    cur = copy.next;
  }
  // 2. 连 random
  cur = head;
  while (cur) {
    if (cur.random) cur.next!.random = cur.random.next;
    if (cur.random) hooks.onLink?.(cur.value, cur.random.next ? cur.random.next.value : null);
    cur = cur.next!.next;
  }
  // 3. 拆分
  const dummy: RNode = { value: NaN, next: null, random: null };
  let tail = dummy;
  cur = head;
  while (cur) {
    tail.next = cur.next!;
    tail = tail.next;
    cur.next = cur.next!.next;
    cur = cur.next;
  }
  return dummy.next;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { copyRandomList, type RNode } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n1: RNode = { value: 1, next: null, random: null };
  const n2: RNode = { value: 2, next: null, random: null };
  n1.next = n2; n1.random = n2; n2.random = n1;
  rec.begin({ zh: '拷贝带随机指针', en: 'Copy random list' }).commit();
  const c = copyRandomList(n1, { onLink: (v, rv) => rec.begin({ zh: '节点 ' + v + ' random → ' + rv, en: 'node ' + v + ' random → ' + rv }).setAux([{ label: 'random', value: String(rv), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '拷贝头 = ' + (c?.value ?? null), en: 'copy head = ' + (c?.value ?? null) }).setAux([{ label: 'head', value: String(c?.value ?? null), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { copyRandomList, type RNode } from '../../src/algorithms/list/list-copy-random-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-copy-random-2/trace.ts';
test('copyRandomList 深拷贝', () => {
  const n1: RNode = { value: 1, next: null, random: null };
  const n2: RNode = { value: 2, next: null, random: null };
  n1.next = n2; n1.random = n2; n2.random = n1;
  const c1 = copyRandomList(n1)!;
  assert.equal(c1.value, 1);
  assert.equal(c1.next!.value, 2);
  assert.equal(c1.random!.value, 2);
  assert.equal(c1.next!.random!.value, 1);
  assert.notEqual(c1, n1); // 独立对象
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 14. list-swap-k-2  —— 交换第k个与倒数第k个
ALGS.push({
  id: 'list-swap-k-2',
  m: ['交换第k与倒数k', 'Swap Kth from Both Ends', '交换链表正数第 k 个与倒数第 k 个节点的值。', 'Swap values of the kth node from head and kth from end.',
    '一遍扫描得长度 n，定位第 k 与第 (n-k+1) 个节点，交换其 value。', 'Find length, locate both, swap values. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'swap', 'indexing']],
  impl: `${LIST_HELPERS}
export interface SwapKHooks { onSwap?: (a: number, b: number) => void; onResult?: (h: ListNode | null) => void; }
export function swapNodes(head: ListNode | null, k: number, hooks: SwapKHooks = {}): ListNode | null {
  let n = 0, cur = head;
  while (cur) { n++; cur = cur.next; }
  if (k < 1 || k > n) return head;
  let front: ListNode | null = null, back: ListNode | null = null;
  cur = head;
  for (let i = 1; i <= n; i++) {
    if (i === k) front = cur;
    if (i === n - k + 1) back = cur;
    cur = cur!.next;
  }
  if (front && back) {
    const t = front.value; front.value = back.value; back.value = t;
    hooks.onSwap?.(front.value, back.value);
  }
  hooks.onResult?.(head);
  return head;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, swapNodes } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5], k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '交换第 ' + input.k + ' 与倒数 ' + input.k, en: 'Swap kth from both ends' }).setArray([...input.arr], input.arr.map(() => 'default' as BarRole), []).commit();
  const nh = swapNodes(head, input.k, { onSwap: (a, b) => rec.begin({ zh: '交换 ' + a + ' ↔ ' + b, en: 'swap ' + a + ' ↔ ' + b }).setAux([{ label: 'swap', value: a + ',' + b, role: 'swap' as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, swapNodes } from '../../src/algorithms/list/list-swap-k-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-swap-k-2/trace.ts';
test('swapNodes 正确', () => {
  assert.deepEqual(listToArray(swapNodes(buildList([1,2,3,4,5]), 2)), [1,4,3,2,5]);
  assert.deepEqual(listToArray(swapNodes(buildList([7,9,6,6,7,8,3,0,9,5]), 5)), [7,9,6,6,8,7,3,0,9,5]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 15. list-reverse-kgroup-2  —— k个一组反转
ALGS.push({
  id: 'list-reverse-kgroup-2',
  m: ['k个一组反转v2', 'Reverse Nodes in k-Group v2', '每 k 个节点一组反转；不足 k 个保持原序。', 'Reverse in groups of k; leave the last partial group as-is.',
    '先统计长度，按组翻转，组间重新连接。', 'Count length, flip each full group, relink. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'reverse', 'group']],
  impl: `${LIST_HELPERS}
export interface ReverseGroupHooks { onGroup?: (start: number) => void; onResult?: (h: ListNode | null) => void; }
function reverseOne(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null, cur = head;
  while (cur) { const n = cur.next; cur.next = prev; prev = cur; cur = n; }
  return prev;
}
export function reverseKGroup(head: ListNode | null, k: number, hooks: ReverseGroupHooks = {}): ListNode | null {
  let n = 0, cur = head;
  while (cur) { n++; cur = cur.next; }
  const dummy: ListNode = { value: NaN, next: head };
  let prevGroupEnd = dummy;
  cur = head;
  while (n >= k) {
    const groupStart = cur;
    let prev: ListNode | null = null;
    for (let i = 0; i < k; i++) { const nx = cur!.next; cur!.next = prev; prev = cur; cur = nx; }
    hooks.onGroup?.(groupStart.value);
    prevGroupEnd.next = prev;
    groupStart.next = cur;
    prevGroupEnd = groupStart;
    n -= k;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, reverseKGroup } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5], k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '每 ' + input.k + ' 个一组反转', en: 'Reverse in k-group' }).setArray([...input.arr], input.arr.map(() => 'default' as BarRole), []).commit();
  const nh = reverseKGroup(head, input.k, { onGroup: (s) => rec.begin({ zh: '反转组起于 ' + s, en: 'reverse group from ' + s }).setAux([{ label: 'group', value: String(s), role: 'swap' as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, reverseKGroup } from '../../src/algorithms/list/list-reverse-kgroup-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-reverse-kgroup-2/trace.ts';
test('reverseKGroup 正确', () => {
  assert.deepEqual(listToArray(reverseKGroup(buildList([1,2,3,4,5]), 2)), [2,1,4,3,5]);
  assert.deepEqual(listToArray(reverseKGroup(buildList([1,2,3,4,5]), 3)), [3,2,1,4,5]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 16. list-sort-merge-2  —— 归并排序链表
ALGS.push({
  id: 'list-sort-merge-2',
  m: ['链表归并排序v2', 'Merge Sort Linked List v2', '对链表做归并排序（O(n log n) 时间 O(1) 空间）。', 'Merge sort a linked list in O(n log n), O(1).',
    '快慢找中点 → 分两段 → 递归排序 → 合并。', 'Split by mid, recurse, merge. O(n log n), O(log n) stack.', 'O(n log n)', 'O(log n)', ['list', 'sort', 'merge-sort']],
  impl: `${LIST_HELPERS}
export interface SortMergeHooks { onMerge?: (a: number, b: number) => void; onResult?: (h: ListNode | null) => void; }
function merge(a: ListNode | null, b: ListNode | null): ListNode | null {
  const d: ListNode = { value: NaN, next: null }; let t = d;
  while (a && b) { if (a.value <= b.value) { t.next = a; a = a.next; } else { t.next = b; b = b.next; } t = t.next; }
  t.next = a ?? b; return d.next;
}
export function mergeSortList(head: ListNode | null, hooks: SortMergeHooks = {}): ListNode | null {
  if (!head || !head.next) return head;
  let slow = head, fast = head.next;
  while (fast && fast.next) { slow = slow.next!; fast = fast.next.next; }
  const mid = slow.next; slow.next = null;
  const left = mergeSortList(head, hooks);
  const right = mergeSortList(mid, hooks);
  if (left && right) hooks.onMerge?.(left.value, right.value);
  const h = merge(left, right);
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, mergeSortList } from './impl.ts';
export const DEFAULT_INPUT = [4, 2, 1, 3];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '链表归并排序', en: 'Merge sort list' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const nh = mergeSortList(head, { onMerge: (a, b) => rec.begin({ zh: '合并 ' + a + ' 与 ' + b, en: 'merge ' + a + ' & ' + b }).setAux([{ label: 'merge', value: a + ',' + b, role: 'pivot' as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, mergeSortList } from '../../src/algorithms/list/list-sort-merge-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-sort-merge-2/trace.ts';
test('mergeSortList 正确', () => {
  assert.deepEqual(listToArray(mergeSortList(buildList([4,2,1,3]))), [1,2,3,4]);
  assert.deepEqual(listToArray(mergeSortList(buildList([5,4,3,2,1]))), [1,2,3,4,5]);
  assert.deepEqual(listToArray(mergeSortList(buildList([1]))), [1]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 17. list-insert-sort-2  —— 插入排序链表
ALGS.push({
  id: 'list-insert-sort-2',
  m: ['链表插入排序v2', 'Insertion Sort List v2', '对链表做插入排序。', 'Insertion sort on a linked list.',
    '维护已排序段，每步把下一个节点插入正确位置。', 'Maintain sorted prefix, insert next node. O(n^2), O(1).', 'O(n^2)', 'O(1)', ['list', 'sort', 'insertion-sort']],
  impl: `${LIST_HELPERS}
export interface InsertSortHooks { onInsert?: (v: number) => void; onResult?: (h: ListNode | null) => void; }
export function insertionSortList(head: ListNode | null, hooks: InsertSortHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let cur = head;
  while (cur) {
    const next = cur.next;
    let prev = dummy;
    while (prev.next && prev.next.value < cur.value) prev = prev.next;
    cur.next = prev.next;
    prev.next = cur;
    hooks.onInsert?.(cur.value);
    cur = next;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, insertionSortList } from './impl.ts';
export const DEFAULT_INPUT = [4, 2, 1, 3];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '链表插入排序', en: 'Insertion sort' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const nh = insertionSortList(head, { onInsert: (v) => rec.begin({ zh: '插入 ' + v, en: 'insert ' + v }).setAux([{ label: 'insert', value: String(v), role: 'pivot' as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, insertionSortList } from '../../src/algorithms/list/list-insert-sort-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-insert-sort-2/trace.ts';
test('insertionSortList 正确', () => {
  assert.deepEqual(listToArray(insertionSortList(buildList([4,2,1,3]))), [1,2,3,4]);
  assert.deepEqual(listToArray(insertionSortList(buildList([3,2,1]))), [1,2,3]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 18. list-oddeven-2  —— 奇偶位置分离
ALGS.push({
  id: 'list-oddeven-2',
  m: ['奇偶分离v2', 'Odd Even Linked List v2', '把奇数位节点放前、偶数位节点放后，保持相对顺序。', 'Group odd-indexed nodes before even-indexed nodes.',
    'odd/even 两条链表交替前进，最后 even 接到 odd 末尾。', 'Two pointers for odd/even, then concat. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'odd-even', 'reorder']],
  impl: `${LIST_HELPERS}
export interface OddEvenHooks { onGroup?: (v: number, side: 'odd' | 'even') => void; onResult?: (h: ListNode | null) => void; }
export function oddEvenList(head: ListNode | null, hooks: OddEvenHooks = {}): ListNode | null {
  if (!head || !head.next) return head;
  let odd = head, even = head.next, evenHead = even;
  while (even && even.next) {
    odd.next = even.next; odd = odd.next; hooks.onGroup?.(odd.value, 'odd');
    even.next = odd.next; even = even.next; if (even) hooks.onGroup?.(even.value, 'even');
  }
  odd.next = evenHead;
  hooks.onResult?.(head);
  return head;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, oddEvenList } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '奇偶分离', en: 'Odd even' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const nh = oddEvenList(head, { onGroup: (v, side) => rec.begin({ zh: v + ' → ' + side, en: v + ' → ' + side }).setAux([{ label: side, value: String(v), role: (side === 'odd' ? 'pivot' : 'frontier') as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, oddEvenList } from '../../src/algorithms/list/list-oddeven-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-oddeven-2/trace.ts';
test('oddEvenList 正确', () => {
  assert.deepEqual(listToArray(oddEvenList(buildList([1,2,3,4,5]))), [1,3,5,2,4]);
  assert.deepEqual(listToArray(oddEvenList(buildList([2,1,3,5,6,4,7]))), [2,3,6,7,1,5,4]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 19. list-reorder-2  —— 重排 L0→Ln→L1→Ln-1...
ALGS.push({
  id: 'list-reorder-2',
  m: ['重排链表v2', 'Reorder List v2', '把 L0→L1→...→Ln 重排为 L0→Ln→L1→Ln-1→...。', 'Reorder L0,L1,...,Ln as L0,Ln,L1,Ln-1,...',
    '找中点 → 反转后半 → 交替合并。', 'Find mid, reverse second half, interleave. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'reorder']],
  impl: `${LIST_HELPERS}
export interface ReorderHooks { onMerge?: (a: number, b: number) => void; onResult?: (h: ListNode | null) => void; }
function reverse(h: ListNode | null): ListNode | null {
  let p: ListNode | null = null, c = h;
  while (c) { const n = c.next; c.next = p; p = c; c = n; }
  return p;
}
export function reorderList(head: ListNode | null, hooks: ReorderHooks = {}): void {
  if (!head || !head.next) return;
  let slow = head, fast = head.next;
  while (fast && fast.next) { slow = slow.next!; fast = fast.next.next; }
  let second = reverse(slow.next);
  slow.next = null;
  let first = head;
  while (second) {
    const f1 = first.next, s1 = second.next;
    first.next = second; second.next = f1;
    hooks.onMerge?.(first.value, second.value);
    first = f1!; second = s1;
  }
  hooks.onResult?.(head);
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, reorderList } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '重排链表', en: 'Reorder list' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  reorderList(head, { onMerge: (a, b) => rec.begin({ zh: a + ' → ' + b, en: a + ' → ' + b }).setAux([{ label: 'pair', value: a + ',' + b, role: 'pivot' as BarRole }]).commit() });
  const arr = listToArray(head);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, reorderList } from '../../src/algorithms/list/list-reorder-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-reorder-2/trace.ts';
test('reorderList 正确', () => {
  const h = buildList([1,2,3,4]);
  reorderList(h);
  assert.deepEqual(listToArray(h), [1,4,2,3]);
  const h2 = buildList([1,2,3,4,5]);
  reorderList(h2);
  assert.deepEqual(listToArray(h2), [1,5,2,4,3]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 20. list-delete-val-2  —— 删除所有等于x的节点
ALGS.push({
  id: 'list-delete-val-2',
  m: ['删除等于x', 'Remove Elements by Value', '删除链表中所有值等于 x 的节点。', 'Remove all nodes whose value equals x.',
    '用 dummy 头简化头删，遍历跳过目标值。', 'Dummy head; skip nodes matching x. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'remove', 'filter']],
  impl: `${LIST_HELPERS}
export interface RemoveValHooks { onRemove?: (v: number) => void; onResult?: (h: ListNode | null) => void; }
export function removeElements(head: ListNode | null, x: number, hooks: RemoveValHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy, cur = head;
  while (cur) {
    if (cur.value === x) { prev.next = cur.next; hooks.onRemove?.(cur.value); }
    else prev = cur;
    cur = cur.next;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, removeElements } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 6, 3, 4, 6, 5], x: 6 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '删除所有 ' + input.x, en: 'Remove all ' + input.x }).setArray([...input.arr], input.arr.map(() => 'default' as BarRole), []).commit();
  const nh = removeElements(head, input.x, { onRemove: (v) => rec.begin({ zh: '删除 ' + v, en: 'remove ' + v }).setAux([{ label: 'removed', value: String(v), role: 'swap' as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, removeElements } from '../../src/algorithms/list/list-delete-val-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-delete-val-2/trace.ts';
test('removeElements 正确', () => {
  assert.deepEqual(listToArray(removeElements(buildList([1,2,6,3,4,6,5]), 6)), [1,2,3,4,5]);
  assert.deepEqual(listToArray(removeElements(buildList([7,7,7]), 7)), []);
  assert.deepEqual(listToArray(removeElements(null, 1)), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 21. list-flatten-2  —— 拍平带 child 的多级链表
ALGS.push({
  id: 'list-flatten-2',
  m: ['拍平多级链表v2', 'Flatten Multilevel List v2', '把带 child 指针的多级链表拍平为单级。', 'Flatten a multilevel doubly list with child pointers into one level.',
    '遇到 child：把 child 链插入当前与 next 之间，递归处理。', 'Insert child sublist between current and next. O(n), O(1).', 'O(n)', 'O(n)', ['list', 'flatten', 'multilevel']],
  impl: `export interface MNode { value: number; next: MNode | null; prev: MNode | null; child: MNode | null; }
export interface FlattenHooks { onInsert?: (parent: number, child: number) => void; }
export function flatten(head: MNode | null, hooks: FlattenHooks = {}): MNode | null {
  if (!head) return null;
  let cur: MNode | null = head;
  while (cur) {
    if (cur.child) {
      const next = cur.next;
      let c = cur.child;
      hooks.onInsert?.(cur.value, c.value);
      cur.next = c; c.prev = cur; cur.child = null;
      let tail = c;
      while (tail.next) tail = tail.next;
      tail.next = next;
      if (next) next.prev = tail;
    }
    cur = cur.next;
  }
  return head;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { flatten, type MNode } from './impl.ts';
const mk = (v: number): MNode => ({ value: v, next: null, prev: null, child: null });
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n1 = mk(1), n2 = mk(2), n3 = mk(3), n4 = mk(4), n5 = mk(5), n6 = mk(6), n7 = mk(7);
  n1.next = n2; n2.prev = n1; n2.child = n3; n3.next = n4; n4.prev = n3; n4.next = n5; n5.prev = n4; n2.next = n6; n6.prev = n2; n3.child = n7;
  rec.begin({ zh: '拍平多级链表', en: 'Flatten multilevel' }).commit();
  flatten(n1, { onInsert: (p, c) => rec.begin({ zh: p + ' 接入子 ' + c, en: p + ' insert child ' + c }).setAux([{ label: 'child', value: String(c), role: 'pivot' as BarRole }]).commit() });
  const arr: number[] = []; let cur: MNode | null = n1;
  while (cur) { arr.push(cur.value); cur = cur.next; }
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flatten, type MNode } from '../../src/algorithms/list/list-flatten-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-flatten-2/trace.ts';
const mk = (v: number): MNode => ({ value: v, next: null, prev: null, child: null });
test('flatten 正确', () => {
  const a = mk(1), b = mk(2), c = mk(3);
  a.next = b; b.prev = a; b.child = c;
  flatten(a);
  const arr: number[] = []; let cur: MNode | null = a;
  while (cur) { arr.push(cur.value); cur = cur.next; }
  assert.deepEqual(arr, [1, 2, 3]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 22. list-sort-bubble-2  —— 冒泡排序链表
ALGS.push({
  id: 'list-sort-bubble-2',
  m: ['链表冒泡v2', 'Bubble Sort List v2', '对链表做冒泡排序（交换值）。', 'Bubble sort a linked list by swapping values.',
    '每轮把最大值冒到末尾，n-1 轮。', 'Each pass bubbles the max to the end. O(n^2), O(1).', 'O(n^2)', 'O(1)', ['list', 'sort', 'bubble-sort']],
  impl: `${LIST_HELPERS}
export interface BubbleHooks { onSwap?: (a: number, b: number) => void; onResult?: (h: ListNode | null) => void; }
export function bubbleSortList(head: ListNode | null, hooks: BubbleHooks = {}): ListNode | null {
  if (!head) return null;
  let swapped = true;
  while (swapped) {
    swapped = false;
    let cur = head;
    while (cur && cur.next) {
      if (cur.value > cur.next.value) {
        const t = cur.value; cur.value = cur.next.value; cur.next.value = t;
        hooks.onSwap?.(cur.value, cur.next.value);
        swapped = true;
      }
      cur = cur.next;
    }
  }
  hooks.onResult?.(head);
  return head;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, bubbleSortList } from './impl.ts';
export const DEFAULT_INPUT = [4, 2, 1, 3];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '冒泡排序', en: 'Bubble sort' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  bubbleSortList(head, { onSwap: (a, b) => rec.begin({ zh: '交换 ' + a + ' ↔ ' + b, en: 'swap ' + a + ' ↔ ' + b }).setArray(listToArray(head), listToArray(head).map(() => 'default' as BarRole), []).commit() });
  const arr = listToArray(head);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, bubbleSortList } from '../../src/algorithms/list/list-sort-bubble-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-sort-bubble-2/trace.ts';
test('bubbleSortList 正确', () => {
  assert.deepEqual(listToArray(bubbleSortList(buildList([4,2,1,3]))), [1,2,3,4]);
  assert.deepEqual(listToArray(bubbleSortList(buildList([3,1,2]))), [1,2,3]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 23. list-swap-adj-2  —— 两两交换相邻节点
ALGS.push({
  id: 'list-swap-adj-2',
  m: ['两两交换v2', 'Swap Adjacent Nodes v2', '相邻节点两两交换：A→B→C→D → B→A→D→C。', 'Swap every two adjacent nodes.',
    'dummy + 三指针，每次交换 prev.next 与 prev.next.next。', 'Dummy + relink pairs. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'swap', 'pairs']],
  impl: `${LIST_HELPERS}
export interface SwapAdjHooks { onSwap?: (a: number, b: number) => void; onResult?: (h: ListNode | null) => void; }
export function swapPairs(head: ListNode | null, hooks: SwapAdjHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy;
  while (prev.next && prev.next.next) {
    const a = prev.next, b = a.next!;
    a.next = b.next; b.next = a; prev.next = b;
    hooks.onSwap?.(a.value, b.value);
    prev = a;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, swapPairs } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '两两交换', en: 'Swap pairs' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const nh = swapPairs(head, { onSwap: (a, b) => rec.begin({ zh: '交换 ' + a + ' ↔ ' + b, en: 'swap ' + a + ' ↔ ' + b }).setAux([{ label: 'swap', value: a + ',' + b, role: 'swap' as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, swapPairs } from '../../src/algorithms/list/list-swap-adj-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-swap-adj-2/trace.ts';
test('swapPairs 正确', () => {
  assert.deepEqual(listToArray(swapPairs(buildList([1,2,3,4]))), [2,1,4,3]);
  assert.deepEqual(listToArray(swapPairs(buildList([1,2,3]))), [2,1,3]);
  assert.deepEqual(listToArray(swapPairs(null)), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 24. list-get-index-2  —— 取第k个节点值
ALGS.push({
  id: 'list-get-index-2',
  m: ['取第k个', 'Get kth Element', '返回链表第 k 个节点（0-based）的值，越界返回 null。', 'Return value of the kth node (0-based); null if out of range.',
    '顺序遍历到第 k 个。', 'Walk to index k. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'indexing']],
  impl: `${LIST_HELPERS}
export interface GetIdxHooks { onVisit?: (i: number, v: number) => void; onResult?: (v: number | null) => void; }
export function getAt(head: ListNode | null, k: number, hooks: GetIdxHooks = {}): number | null {
  let cur = head, i = 0;
  while (cur) {
    hooks.onVisit?.(i, cur.value);
    if (i === k) { hooks.onResult?.(cur.value); return cur.value; }
    cur = cur.next; i++;
  }
  hooks.onResult?.(null);
  return null;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, getAt } from './impl.ts';
export const DEFAULT_INPUT = { arr: [10, 20, 30, 40], k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '取第 ' + input.k + ' 个', en: 'Get index ' + input.k }).setArray([...input.arr], input.arr.map(() => 'default' as BarRole), []).commit();
  const v = getAt(head, input.k, { onVisit: (i, val) => { const roles = input.arr.map(() => 'default' as BarRole); roles[i] = 'compare' as BarRole; rec.begin({ zh: '访问 ' + i + ' = ' + val, en: 'visit ' + i + ' = ' + val }).setArray([...input.arr], roles, [{ index: i, label: 'i' }]).commit(); } });
  rec.begin({ zh: '结果 = ' + v, en: 'result = ' + v }).setAux([{ label: 'value', value: String(v), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, getAt } from '../../src/algorithms/list/list-get-index-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-get-index-2/trace.ts';
test('getAt 正确', () => {
  assert.equal(getAt(buildList([10,20,30,40]), 2), 30);
  assert.equal(getAt(buildList([10,20,30,40]), 0), 10);
  assert.equal(getAt(buildList([10,20,30,40]), 10), null);
  assert.equal(getAt(null, 0), null);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 25. list-insert-at-2  —— 在第k个位置插入节点
ALGS.push({
  id: 'list-insert-at-2',
  m: ['插入第k位', 'Insert at Index', '在链表第 k 个位置插入值为 x 的节点。', 'Insert a node with value x at index k.',
    '用 dummy 头定位前驱，把新节点接到前驱与后继之间。', 'Dummy head, locate predecessor, splice. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'insert']],
  impl: `${LIST_HELPERS}
export interface InsertHooks { onInsert?: (i: number, v: number) => void; onResult?: (h: ListNode | null) => void; }
export function insertAt(head: ListNode | null, k: number, x: number, hooks: InsertHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy, i = 0;
  while (i < k && prev.next) { prev = prev.next; i++; }
  if (i < k) return dummy.next; // 越界不插
  const node: ListNode = { value: x, next: prev.next };
  prev.next = node;
  hooks.onInsert?.(k, x);
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, insertAt } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 4], k: 2, x: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '在第 ' + input.k + ' 位插入 ' + input.x, en: 'Insert ' + input.x + ' at ' + input.k }).setArray([...input.arr], input.arr.map(() => 'default' as BarRole), []).commit();
  const nh = insertAt(head, input.k, input.x, { onInsert: (i, v) => rec.begin({ zh: '插入 ' + v + ' @' + i, en: 'insert ' + v + ' @' + i }).setAux([{ label: 'insert', value: String(v), role: 'pivot' as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, insertAt } from '../../src/algorithms/list/list-insert-at-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-insert-at-2/trace.ts';
test('insertAt 正确', () => {
  assert.deepEqual(listToArray(insertAt(buildList([1,2,4]), 2, 3)), [1,2,3,4]);
  assert.deepEqual(listToArray(insertAt(buildList([1,2]), 0, 0)), [0,1,2]);
  assert.deepEqual(listToArray(insertAt(null, 0, 5)), [5]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 26. list-delete-at-2  —— 删除第k个节点
ALGS.push({
  id: 'list-delete-at-2',
  m: ['删除第k位', 'Delete at Index', '删除链表第 k 个节点（0-based）。', 'Delete the node at index k (0-based).',
    'dummy 头定位前驱后跳过目标。', 'Dummy head, skip target. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'delete']],
  impl: `${LIST_HELPERS}
export interface DeleteAtHooks { onDelete?: (v: number) => void; onResult?: (h: ListNode | null) => void; }
export function deleteAt(head: ListNode | null, k: number, hooks: DeleteAtHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy, i = 0;
  while (i < k && prev.next) { prev = prev.next; i++; }
  if (prev.next) { hooks.onDelete?.(prev.next.value); prev.next = prev.next.next; }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, deleteAt } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4], k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '删除第 ' + input.k + ' 个', en: 'Delete index ' + input.k }).setArray([...input.arr], input.arr.map(() => 'default' as BarRole), []).commit();
  const nh = deleteAt(head, input.k, { onDelete: (v) => rec.begin({ zh: '删除 ' + v, en: 'delete ' + v }).setAux([{ label: 'deleted', value: String(v), role: 'swap' as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, deleteAt } from '../../src/algorithms/list/list-delete-at-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-delete-at-2/trace.ts';
test('deleteAt 正确', () => {
  assert.deepEqual(listToArray(deleteAt(buildList([1,2,3,4]), 2)), [1,2,4]);
  assert.deepEqual(listToArray(deleteAt(buildList([1,2,3]), 0)), [2,3]);
  assert.deepEqual(listToArray(deleteAt(buildList([1]), 0)), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 27. list-count-2  —— 计数链表长度
ALGS.push({
  id: 'list-count-2',
  m: ['计数v2', 'Count List Length v2', '遍历统计链表节点数。', 'Traverse and count nodes.',
    '顺序遍历累加。', 'Walk and increment. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'length']],
  impl: `${LIST_HELPERS}
export interface CountHooks { onVisit?: (i: number, v: number) => void; onResult?: (n: number) => void; }
export function countList(head: ListNode | null, hooks: CountHooks = {}): number {
  let n = 0, cur = head;
  while (cur) { hooks.onVisit?.(n, cur.value); n++; cur = cur.next; }
  hooks.onResult?.(n);
  return n;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, countList } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '计数', en: 'Count' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const n = countList(head, { onVisit: (i, v) => { const roles = input.map(() => 'default' as BarRole); roles[i] = 'compare' as BarRole; rec.begin({ zh: '访问 ' + v, en: 'visit ' + v }).setArray([...input], roles, [{ index: i, label: 'i' }]).commit(); } });
  rec.begin({ zh: '长度 = ' + n, en: 'length = ' + n }).setAux([{ label: 'length', value: String(n), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, countList } from '../../src/algorithms/list/list-count-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-count-2/trace.ts';
test('countList 正确', () => {
  assert.equal(countList(buildList([1,2,3,4,5])), 5);
  assert.equal(countList(buildList([1])), 1);
  assert.equal(countList(null), 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 28. list-concat-2  —— 连接两链表
ALGS.push({
  id: 'list-concat-2',
  m: ['连接两表v2', 'Concatenate Two Lists v2', '把链表 b 接到链表 a 的末尾。', 'Append list b to the end of list a.',
    '找到 a 的尾节点，next 指向 b。', 'Find tail of a, set its next to b. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'concat']],
  impl: `${LIST_HELPERS}
export interface ConcatHooks { onAppend?: (bv: number) => void; onResult?: (h: ListNode | null) => void; }
export function concatList(a: ListNode | null, b: ListNode | null, hooks: ConcatHooks = {}): ListNode | null {
  if (!a) return b;
  let cur = a;
  while (cur.next) cur = cur.next;
  cur.next = b;
  let c = b;
  while (c) { hooks.onAppend?.(c.value); c = c.next; }
  hooks.onResult?.(a);
  return a;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, concatList } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 2], b: [3, 4, 5] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildList(input.a), b = buildList(input.b);
  rec.begin({ zh: '连接', en: 'Concat' }).commit();
  const h = concatList(a, b, { onAppend: (v) => rec.begin({ zh: '追加 ' + v, en: 'append ' + v }).setAux([{ label: 'append', value: String(v), role: 'pivot' as BarRole }]).commit() });
  const arr = listToArray(h);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, concatList } from '../../src/algorithms/list/list-concat-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-concat-2/trace.ts';
test('concatList 正确', () => {
  assert.deepEqual(listToArray(concatList(buildList([1,2]), buildList([3,4,5]))), [1,2,3,4,5]);
  assert.deepEqual(listToArray(concatList(null, buildList([1,2]))), [1,2]);
  assert.deepEqual(listToArray(concatList(buildList([1,2]), null)), [1,2]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 29. list-max-2  —— 求链表最大值
ALGS.push({
  id: 'list-max-2',
  m: ['求最大值v2', 'Find Max in List v2', '遍历链表找最大节点值。', 'Traverse to find the maximum value.',
    '维护当前最大值。', 'Track running max. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'max']],
  impl: `${LIST_HELPERS}
export interface MaxHooks { onCompare?: (cur: number, best: number) => void; onResult?: (m: number | null) => void; }
export function listMax(head: ListNode | null, hooks: MaxHooks = {}): number | null {
  if (!head) { hooks.onResult?.(null); return null; }
  let best = head.value, cur = head.next;
  while (cur) { hooks.onCompare?.(cur.value, best); if (cur.value > best) best = cur.value; cur = cur.next; }
  hooks.onResult?.(best);
  return best;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listMax } from './impl.ts';
export const DEFAULT_INPUT = [3, 7, 2, 9, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '求最大', en: 'Find max' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const m = listMax(head, { onCompare: (cur, best) => rec.begin({ zh: '比较 ' + cur + '，当前最大 ' + best, en: 'compare ' + cur + ', best ' + best }).setAux([{ label: 'best', value: String(best), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '最大 = ' + m, en: 'max = ' + m }).setAux([{ label: 'max', value: String(m), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listMax } from '../../src/algorithms/list/list-max-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-max-2/trace.ts';
test('listMax 正确', () => {
  assert.equal(listMax(buildList([3,7,2,9,5])), 9);
  assert.equal(listMax(buildList([1])), 1);
  assert.equal(listMax(null), null);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 30. list-sum-2  —— 求链表元素和
ALGS.push({
  id: 'list-sum-2',
  m: ['求和v2', 'Sum List v2', '遍历链表求所有节点值之和。', 'Sum all node values.',
    '累加每个节点值。', 'Accumulate values. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'sum']],
  impl: `${LIST_HELPERS}
export interface SumHooks { onAcc?: (cur: number, total: number) => void; onResult?: (s: number) => void; }
export function listSum(head: ListNode | null, hooks: SumHooks = {}): number {
  let s = 0, cur = head;
  while (cur) { s += cur.value; hooks.onAcc?.(cur.value, s); cur = cur.next; }
  hooks.onResult?.(s);
  return s;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listSum } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '求和', en: 'Sum' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const s = listSum(head, { onAcc: (cur, total) => rec.begin({ zh: '+' + cur + ' → ' + total, en: '+' + cur + ' → ' + total }).setAux([{ label: 'total', value: String(total), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '和 = ' + s, en: 'sum = ' + s }).setAux([{ label: 'sum', value: String(s), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listSum } from '../../src/algorithms/list/list-sum-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-sum-2/trace.ts';
test('listSum 正确', () => {
  assert.equal(listSum(buildList([1,2,3,4,5])), 15);
  assert.equal(listSum(buildList([1])), 1);
  assert.equal(listSum(null), 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 31. list-sorted-intersect-2  —— 有序链表交集
ALGS.push({
  id: 'list-sorted-intersect-2',
  m: ['有序交集v2', 'Sorted List Intersection v2', '求两个有序链表的交集（共同元素）。', 'Intersection of two sorted lists.',
    '双指针同步前进，相等时收录。', 'Two pointers, collect when equal. O(n+m), O(1).', 'O(n+m)', 'O(n+m)', ['list', 'intersection', 'sorted']],
  impl: `${LIST_HELPERS}
export interface IntersectHooks2 { onMatch?: (v: number) => void; onResult?: (h: ListNode | null) => void; }
export function sortedIntersect(a: ListNode | null, b: ListNode | null, hooks: IntersectHooks2 = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  while (a && b) {
    if (a.value === b.value) { tail.next = { value: a.value, next: null }; tail = tail.next; hooks.onMatch?.(a.value); a = a.next; b = b.next; }
    else if (a.value < b.value) a = a.next; else b = b.next;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, sortedIntersect } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 2, 3, 5], b: [2, 3, 4, 5, 6] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildList(input.a), b = buildList(input.b);
  rec.begin({ zh: '有序交集', en: 'Sorted intersect' }).commit();
  const h = sortedIntersect(a, b, { onMatch: (v) => rec.begin({ zh: '命中 ' + v, en: 'match ' + v }).setAux([{ label: 'match', value: String(v), role: 'final' as BarRole }]).commit() });
  const arr = listToArray(h);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, sortedIntersect } from '../../src/algorithms/list/list-sorted-intersect-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-sorted-intersect-2/trace.ts';
test('sortedIntersect 正确', () => {
  assert.deepEqual(listToArray(sortedIntersect(buildList([1,2,3,5]), buildList([2,3,4,5,6]))), [2,3,5]);
  assert.deepEqual(listToArray(sortedIntersect(buildList([1,2]), buildList([3,4]))), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 32. list-sorted-union-2  —— 有序链表并集
ALGS.push({
  id: 'list-sorted-union-2',
  m: ['有序并集v2', 'Sorted List Union v2', '求两个有序链表的并集（去重）。', 'Union of two sorted lists, dedup.',
    '双指针，每次取较小；相等取其一并都前进。', 'Two pointers, take smaller; if equal take one. O(n+m), O(n+m).', 'O(n+m)', 'O(n+m)', ['list', 'union', 'sorted']],
  impl: `${LIST_HELPERS}
export interface UnionHooks { onAdd?: (v: number) => void; onResult?: (h: ListNode | null) => void; }
export function sortedUnion(a: ListNode | null, b: ListNode | null, hooks: UnionHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  const push = (v: number) => { if (tail.value !== v || tail === dummy) { tail.next = { value: v, next: null }; tail = tail.next; hooks.onAdd?.(v); } };
  while (a && b) {
    if (a.value === b.value) { push(a.value); a = a.next; b = b.next; }
    else if (a.value < b.value) { push(a.value); a = a.next; }
    else { push(b.value); b = b.next; }
  }
  while (a) { push(a.value); a = a.next; }
  while (b) { push(b.value); b = b.next; }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, sortedUnion } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 2, 3], b: [2, 3, 4, 5] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildList(input.a), b = buildList(input.b);
  rec.begin({ zh: '有序并集', en: 'Sorted union' }).commit();
  const h = sortedUnion(a, b, { onAdd: (v) => rec.begin({ zh: '加入 ' + v, en: 'add ' + v }).setAux([{ label: 'add', value: String(v), role: 'pivot' as BarRole }]).commit() });
  const arr = listToArray(h);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, sortedUnion } from '../../src/algorithms/list/list-sorted-union-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-sorted-union-2/trace.ts';
test('sortedUnion 正确', () => {
  assert.deepEqual(listToArray(sortedUnion(buildList([1,2,3]), buildList([2,3,4,5]))), [1,2,3,4,5]);
  assert.deepEqual(listToArray(sortedUnion(buildList([1]), buildList([1]))), [1]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 33. list-sorted-diff-2  —— 有序链表差集 A-B
ALGS.push({
  id: 'list-sorted-diff-2',
  m: ['有序差集v2', 'Sorted List Difference v2', '求 A - B（A 中不在 B 的元素）。', 'Set difference A minus B for sorted lists.',
    '双指针：a<b 时收录 a 并前进，相等都前进。', 'Two pointers: take a when smaller, skip when equal. O(n+m), O(n).', 'O(n+m)', 'O(n)', ['list', 'difference', 'sorted']],
  impl: `${LIST_HELPERS}
export interface DiffHooks { onKeep?: (v: number) => void; onResult?: (h: ListNode | null) => void; }
export function sortedDifference(a: ListNode | null, b: ListNode | null, hooks: DiffHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  while (a && b) {
    if (a.value < b.value) { tail.next = { value: a.value, next: null }; tail = tail.next; hooks.onKeep?.(a.value); a = a.next; }
    else if (a.value > b.value) b = b.next;
    else { a = a.next; b = b.next; }
  }
  while (a) { tail.next = { value: a.value, next: null }; tail = tail.next; hooks.onKeep?.(a.value); a = a.next; }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, sortedDifference } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 2, 3, 5], b: [2, 4] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildList(input.a), b = buildList(input.b);
  rec.begin({ zh: 'A - B', en: 'A minus B' }).commit();
  const h = sortedDifference(a, b, { onKeep: (v) => rec.begin({ zh: '保留 ' + v, en: 'keep ' + v }).setAux([{ label: 'keep', value: String(v), role: 'pivot' as BarRole }]).commit() });
  const arr = listToArray(h);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, sortedDifference } from '../../src/algorithms/list/list-sorted-diff-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-sorted-diff-2/trace.ts';
test('sortedDifference 正确', () => {
  assert.deepEqual(listToArray(sortedDifference(buildList([1,2,3,5]), buildList([2,4]))), [1,3,5]);
  assert.deepEqual(listToArray(sortedDifference(buildList([1,2]), buildList([1,2,3]))), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 34. list-binary-decimal-2  —— 链表表示的二进制转十进制
ALGS.push({
  id: 'list-binary-decimal-2',
  m: ['二进制转十进制', 'Binary List to Decimal', '链表每个节点是 0/1，从高位到低位表示二进制数，求十进制值。', 'Each node holds a bit (MSB first); compute the decimal value.',
    '从高到低：ans = ans * 2 + bit。', 'ans = ans*2 + bit, MSB first. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'binary', 'conversion']],
  impl: `${LIST_HELPERS}
export interface BinHooks { onStep?: (bit: number, acc: number) => void; onResult?: (v: number) => void; }
export function binaryToDecimal(head: ListNode | null, hooks: BinHooks = {}): number {
  let ans = 0, cur = head;
  while (cur) { ans = ans * 2 + cur.value; hooks.onStep?.(cur.value, ans); cur = cur.next; }
  hooks.onResult?.(ans);
  return ans;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, binaryToDecimal } from './impl.ts';
export const DEFAULT_INPUT = [1, 0, 1, 0]; // 10
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '二进制 → 十进制', en: 'Binary to decimal' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const v = binaryToDecimal(head, { onStep: (bit, acc) => rec.begin({ zh: 'bit=' + bit + ' → ' + acc, en: 'bit=' + bit + ' → ' + acc }).setAux([{ label: 'acc', value: String(acc), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '十进制 = ' + v, en: 'decimal = ' + v }).setAux([{ label: 'value', value: String(v), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, binaryToDecimal } from '../../src/algorithms/list/list-binary-decimal-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-binary-decimal-2/trace.ts';
test('binaryToDecimal 正确', () => {
  assert.equal(binaryToDecimal(buildList([1,0,1,0])), 10);
  assert.equal(binaryToDecimal(buildList([1,1,1])), 7);
  assert.equal(binaryToDecimal(buildList([0])), 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 35. list-reverse-range-2  —— 反转区间 [m,n]
ALGS.push({
  id: 'list-reverse-range-2',
  m: ['反转区间v2', 'Reverse Sublist v2', '反转链表第 m 到第 n 个节点（1-based）。', 'Reverse nodes from position m to n (1-based).',
    '定位前驱，逐个头插到前驱之后。', 'Locate predecessor, head-insert. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'reverse', 'range']],
  impl: `${LIST_HELPERS}
export interface RevRangeHooks { onMove?: (v: number) => void; onResult?: (h: ListNode | null) => void; }
export function reverseBetween(head: ListNode | null, m: number, n: number, hooks: RevRangeHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy;
  for (let i = 1; i < m; i++) prev = prev.next!;
  const start = prev.next!;
  let then = start.next;
  for (let i = 0; i < n - m; i++) {
    start.next = then!.next;
    then!.next = prev.next;
    prev.next = then;
    hooks.onMove?.(then!.value);
    then = start.next;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, reverseBetween } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5], m: 2, n: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '反转 [' + input.m + ',' + input.n + ']', en: 'Reverse [' + input.m + ',' + input.n + ']' }).setArray([...input.arr], input.arr.map(() => 'default' as BarRole), []).commit();
  const nh = reverseBetween(head, input.m, input.n, { onMove: (v) => rec.begin({ zh: '移动 ' + v, en: 'move ' + v }).setAux([{ label: 'move', value: String(v), role: 'swap' as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, reverseBetween } from '../../src/algorithms/list/list-reverse-range-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-reverse-range-2/trace.ts';
test('reverseBetween 正确', () => {
  assert.deepEqual(listToArray(reverseBetween(buildList([1,2,3,4,5]), 2, 4)), [1,4,3,2,5]);
  assert.deepEqual(listToArray(reverseBetween(buildList([1,2,3]), 1, 3)), [3,2,1]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 36. list-detect-cycle-start-2  —— 找环入口
ALGS.push({
  id: 'list-detect-cycle-start-2',
  m: ['找环入口v2', 'Find Cycle Start v2', 'Floyd 判环后定位环的入口节点。', 'Locate the cycle entry after Floyd detection.',
    '快慢相遇后，把一指针放回头，两者同速再相遇即环入口。', 'After meeting, reset one to head; meet at entry. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'cycle', 'floyd']],
  impl: `${LIST_HELPERS}
export interface CycleStartHooks { onMeet?: (slow: number, fast: number) => void; onResult?: (v: number | null) => void; }
export function detectCycleStart(head: ListNode | null, hooks: CycleStartHooks = {}): ListNode | null {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next; fast = fast.next.next;
    if (slow === fast) {
      hooks.onMeet?.(slow!.value, fast.value);
      let p: ListNode | null = head;
      while (p !== slow) { p = p!.next; slow = slow!.next; }
      hooks.onResult?.(p.value);
      return p;
    }
  }
  hooks.onResult?.(null);
  return null;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { detectCycleStart } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n1: any = { value: 1, next: null }, n2: any = { value: 2, next: null }, n3: any = { value: 3, next: null }, n4: any = { value: 4, next: null };
  n1.next = n2; n2.next = n3; n3.next = n4; n4.next = n2;
  rec.begin({ zh: '找环入口', en: 'Find cycle start' }).commit();
  const node = detectCycleStart(n1, { onMeet: (s, f) => rec.begin({ zh: '相遇 slow=' + s + ' fast=' + f, en: 'meet slow=' + s + ' fast=' + f }).setAux([{ label: 'meet', value: String(s), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '入口 = ' + (node?.value ?? null), en: 'start = ' + (node?.value ?? null) }).setAux([{ label: 'start', value: String(node?.value ?? null), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectCycleStart } from '../../src/algorithms/list/list-detect-cycle-start-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-detect-cycle-start-2/trace.ts';
test('detectCycleStart 找到入口', () => {
  const n1: any = { value: 1, next: null }, n2: any = { value: 2, next: null }, n3: any = { value: 3, next: null }, n4: any = { value: 4, next: null };
  n1.next = n2; n2.next = n3; n3.next = n4; n4.next = n2;
  assert.equal(detectCycleStart(n1), n2);
});
test('detectCycleStart 无环', () => {
  const n1: any = { value: 1, next: { value: 2, next: null } };
  assert.equal(detectCycleStart(n1), null);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 37. list-zip-2  —— 交替合并两链表
ALGS.push({
  id: 'list-zip-2',
  m: ['交替合并v2', 'Zip Two Lists v2', '把两链表交替合并：a1,b1,a2,b2,...。', 'Interleave two lists: a1,b1,a2,b2,...',
    '轮流取 a、b 的节点接到结果。', 'Take turns appending from a and b. O(n+m), O(1).', 'O(n+m)', 'O(1)', ['list', 'merge', 'interleave']],
  impl: `${LIST_HELPERS}
export interface ZipHooks { onAppend?: (v: number, src: 'a' | 'b') => void; onResult?: (h: ListNode | null) => void; }
export function zipLists(a: ListNode | null, b: ListNode | null, hooks: ZipHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy, turn = 0;
  while (a && b) {
    if (turn % 2 === 0) { tail.next = a; a = a.next; hooks.onAppend?.(tail.next!.value, 'a'); }
    else { tail.next = b; b = b.next; hooks.onAppend?.(tail.next!.value, 'b'); }
    tail = tail.next; turn++;
  }
  tail.next = a ?? b;
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, zipLists } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 3, 5], b: [2, 4, 6] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildList(input.a), b = buildList(input.b);
  rec.begin({ zh: '交替合并', en: 'Zip lists' }).commit();
  const h = zipLists(a, b, { onAppend: (v, src) => rec.begin({ zh: '取 ' + v + ' from ' + src, en: 'take ' + v + ' from ' + src }).setAux([{ label: src, value: String(v), role: 'pivot' as BarRole }]).commit() });
  const arr = listToArray(h);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, zipLists } from '../../src/algorithms/list/list-zip-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-zip-2/trace.ts';
test('zipLists 正确', () => {
  assert.deepEqual(listToArray(zipLists(buildList([1,3,5]), buildList([2,4,6]))), [1,2,3,4,5,6]);
  assert.deepEqual(listToArray(zipLists(buildList([1]), buildList([2,3,4]))), [1,2,3,4]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 38. list-kth-from-end-2  —— 倒数第k个
ALGS.push({
  id: 'list-kth-from-end-2',
  m: ['倒数第k个v2', 'Kth From End v2', '一次遍历返回倒数第 k 个节点值。', 'Return the kth node from the end in one pass.',
    'fast 先走 k 步，slow 同步走，fast 到末尾时 slow 即答案。', 'fast advances k first, then move together. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'two-pointers']],
  impl: `${LIST_HELPERS}
export interface KthEndHooks { onArrive?: (v: number) => void; onResult?: (v: number | null) => void; }
export function kthFromEnd(head: ListNode | null, k: number, hooks: KthEndHooks = {}): number | null {
  let fast = head, slow = head;
  for (let i = 0; i < k; i++) { if (!fast) { hooks.onResult?.(null); return null; } fast = fast.next; }
  while (fast) { slow = slow!.next; fast = fast.next; }
  hooks.onArrive?.(slow!.value);
  hooks.onResult?.(slow!.value);
  return slow!.value;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, kthFromEnd } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5], k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '倒数第 ' + input.k, en: 'kth from end' }).setArray([...input.arr], input.arr.map(() => 'default' as BarRole), []).commit();
  const v = kthFromEnd(head, input.k, { onArrive: (val) => rec.begin({ zh: '到达 ' + val, en: 'arrive ' + val }).setAux([{ label: 'value', value: String(val), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '结果 = ' + v, en: 'result = ' + v }).setAux([{ label: 'result', value: String(v), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, kthFromEnd } from '../../src/algorithms/list/list-kth-from-end-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-kth-from-end-2/trace.ts';
test('kthFromEnd 正确', () => {
  assert.equal(kthFromEnd(buildList([1,2,3,4,5]), 2), 4);
  assert.equal(kthFromEnd(buildList([1,2,3]), 3), 1);
  assert.equal(kthFromEnd(buildList([1]), 1), 1);
  assert.equal(kthFromEnd(buildList([1,2]), 5), null);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 39. list-merge-k-2  —— 合并k个有序链表
ALGS.push({
  id: 'list-merge-k-2',
  m: ['合并k个链表v2', 'Merge k Sorted Lists v2', '顺序两两合并 k 个有序链表。', 'Merge k sorted lists by pairwise sequential merge.',
    '累加式合并：result = merge(result, lists[i])。', 'Sequential pairwise merge. O(kN), O(1).', 'O(kN)', 'O(1)', ['list', 'merge', 'k-way']],
  impl: `${LIST_HELPERS}
export interface MergeKHooks { onMerge?: (a: number, b: number) => void; onResult?: (h: ListNode | null) => void; }
function merge(a: ListNode | null, b: ListNode | null): ListNode | null {
  const d: ListNode = { value: NaN, next: null }; let t = d;
  while (a && b) { if (a.value <= b.value) { t.next = a; a = a.next; } else { t.next = b; b = b.next; } t = t.next; }
  t.next = a ?? b; return d.next;
}
export function mergeKLists(lists: Array<ListNode | null>, hooks: MergeKHooks = {}): ListNode | null {
  let res: ListNode | null = null;
  for (const l of lists) {
    if (res && l) hooks.onMerge?.(res.value, l.value);
    res = merge(res, l);
  }
  hooks.onResult?.(res);
  return res;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, mergeKLists } from './impl.ts';
export const DEFAULT_INPUT = [[1,4,5],[1,3,4],[2,6]];
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const lists = input.map(buildList);
  rec.begin({ zh: '合并 ' + input.length + ' 个链表', en: 'Merge ' + input.length + ' lists' }).commit();
  const h = mergeKLists(lists, { onMerge: (a, b) => rec.begin({ zh: '合并 ' + a + ' 与 ' + b, en: 'merge ' + a + ' & ' + b }).setAux([{ label: 'merge', value: a + ',' + b, role: 'pivot' as BarRole }]).commit() });
  const arr = listToArray(h);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, mergeKLists } from '../../src/algorithms/list/list-merge-k-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-merge-k-2/trace.ts';
test('mergeKLists 正确', () => {
  const r = mergeKLists([buildList([1,4,5]), buildList([1,3,4]), buildList([2,6])]);
  assert.deepEqual(listToArray(r), [1,1,2,3,4,4,5,6]);
  assert.equal(mergeKLists([]), null);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 40. list-contains-2  —— 判断值是否存在
ALGS.push({
  id: 'list-contains-2',
  m: ['包含判断v2', 'List Contains v2', '线性查找链表是否含某值。', 'Linear search for a value in the list.',
    '顺序遍历比较。', 'Walk and compare. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'search', 'contains']],
  impl: `${LIST_HELPERS}
export interface ContainsHooks { onCompare?: (v: number, hit: boolean) => void; onResult?: (found: boolean) => void; }
export function containsValue(head: ListNode | null, x: number, hooks: ContainsHooks = {}): boolean {
  let cur = head;
  while (cur) {
    const hit = cur.value === x;
    hooks.onCompare?.(cur.value, hit);
    if (hit) { hooks.onResult?.(true); return true; }
    cur = cur.next;
  }
  hooks.onResult?.(false);
  return false;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, containsValue } from './impl.ts';
export const DEFAULT_INPUT = { arr: [4, 2, 7, 1, 9], x: 7 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '查找 ' + input.x, en: 'Search ' + input.x }).setArray([...input.arr], input.arr.map(() => 'default' as BarRole), []).commit();
  const found = containsValue(head, input.x, { onCompare: (v, hit) => { const i = input.arr.indexOf(v); const roles = input.arr.map(() => 'default' as BarRole); if (i >= 0) roles[i] = (hit ? 'final' : 'compare') as BarRole; rec.begin({ zh: '比较 ' + v, en: 'compare ' + v }).setArray([...input.arr], roles, []).commit(); } });
  rec.begin({ zh: '找到？' + found, en: 'found? ' + found }).setAux([{ label: 'found', value: String(found), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, containsValue } from '../../src/algorithms/list/list-contains-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-contains-2/trace.ts';
test('containsValue 正确', () => {
  assert.equal(containsValue(buildList([4,2,7,1,9]), 7), true);
  assert.equal(containsValue(buildList([4,2,7,1,9]), 8), false);
  assert.equal(containsValue(null, 1), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 41. list-rotate-left-2  —— 向左旋转k位
ALGS.push({
  id: 'list-rotate-left-2',
  m: ['左旋v2', 'Rotate List Left v2', '把链表向左旋转 k 位。', 'Rotate the list left by k positions.',
    'k mod n，新头是第 k 个，把原尾连回原头。', 'New head at index k, link old tail to old head. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'rotate']],
  impl: `${LIST_HELPERS}
export interface RotLeftHooks { onCut?: (v: number) => void; onResult?: (h: ListNode | null) => void; }
export function rotateLeft(head: ListNode | null, k: number, hooks: RotLeftHooks = {}): ListNode | null {
  if (!head || !head.next || k === 0) return head;
  let n = 1, tail = head;
  while (tail.next) { tail = tail.next; n++; }
  k = ((k % n) + n) % n;
  if (k === 0) return head;
  let cur = head;
  for (let i = 1; i < k; i++) cur = cur.next!;
  const newHead = cur.next!;
  cur.next = null;
  tail.next = head;
  hooks.onCut?.(cur.value);
  hooks.onResult?.(newHead);
  return newHead;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, rotateLeft } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5], k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '左旋 ' + input.k, en: 'Rotate left ' + input.k }).setArray([...input.arr], input.arr.map(() => 'default' as BarRole), []).commit();
  const nh = rotateLeft(head, input.k, { onCut: (v) => rec.begin({ zh: '在 ' + v + ' 后断开', en: 'cut after ' + v }).setAux([{ label: 'cut', value: String(v), role: 'swap' as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, rotateLeft } from '../../src/algorithms/list/list-rotate-left-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-rotate-left-2/trace.ts';
test('rotateLeft 正确', () => {
  assert.deepEqual(listToArray(rotateLeft(buildList([1,2,3,4,5]), 2)), [3,4,5,1,2]);
  assert.deepEqual(listToArray(rotateLeft(buildList([1,2,3]), 5)), [3,1,2]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 42. list-reverse-alt-k-2  —— 交替k组反转
ALGS.push({
  id: 'list-reverse-alt-k-2',
  m: ['交替k组反转', 'Reverse Alternate k-Group', '每 k 个一组，但只反转偶数序的组。', 'Reverse every other group of k nodes.',
    '遍历时组序+1，奇数组保持、偶数组反转。', 'Group counter; reverse even-indexed groups. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'reverse', 'group']],
  impl: `${LIST_HELPERS}
export interface RevAltHooks { onGroup?: (idx: number, reverse: boolean) => void; onResult?: (h: ListNode | null) => void; }
function reverseSeg(start: ListNode | null, k: number): { head: ListNode | null; tail: ListNode | null; after: ListNode | null } {
  let prev: ListNode | null = null, cur = start, i = 0;
  while (cur && i < k) { const n = cur.next; cur.next = prev; prev = cur; cur = n; i++; }
  return { head: prev, tail: start, after: cur };
}
export function reverseAltKGroup(head: ListNode | null, k: number, hooks: RevAltHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prevEnd = dummy, cur = head, gi = 0;
  while (cur) {
    gi++;
    const reverse = gi % 2 === 0;
    hooks.onGroup?.(gi, reverse);
    if (reverse) {
      const seg = reverseSeg(cur, k);
      prevEnd.next = seg.head;
      seg.tail!.next = seg.after;
      prevEnd = seg.tail!;
      cur = seg.after;
    } else {
      let i = 0;
      while (cur && i < k - 1) { cur = cur.next; i++; }
      prevEnd = cur!;
      cur = cur!.next;
    }
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, reverseAltKGroup } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1,2,3,4,5,6,7,8], k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '交替k组反转', en: 'Reverse alt k-group' }).setArray([...input.arr], input.arr.map(() => 'default' as BarRole), []).commit();
  const nh = reverseAltKGroup(head, input.k, { onGroup: (idx, rev) => rec.begin({ zh: '组 ' + idx + (rev ? ' 反转' : ' 保持'), en: 'group ' + idx + (rev ? ' reverse' : ' keep') }).setAux([{ label: 'group', value: String(idx), role: 'pivot' as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, reverseAltKGroup } from '../../src/algorithms/list/list-reverse-alt-k-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-reverse-alt-k-2/trace.ts';
test('reverseAltKGroup 正确', () => {
  // [1,2,3,4,5,6,7,8] k=2: 组1保持(1,2), 组2反转(4,3), 组3保持(5,6), 组4反转(8,7)
  assert.deepEqual(listToArray(reverseAltKGroup(buildList([1,2,3,4,5,6,7,8]), 2)), [1,2,4,3,5,6,8,7]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 43. list-delete-all-dup-2  —— 删除所有出现过的重复值
ALGS.push({
  id: 'list-delete-all-dup-2',
  m: ['删除所有重复值', 'Remove All Duplicates', '有序链表中如果一个值出现多次，全部删除。', 'In a sorted list, delete every value that appears more than once.',
    '用 dummy 头，遇到 cur/cur.next/cur.next.next 相同时跳过整段。', 'Dummy head; skip runs of duplicates entirely. O(n), O(1).', 'O(n)', 'O(1)', ['list', 'duplicates', 'sorted']],
  impl: `${LIST_HELPERS}
export interface DelAllDupHooks { onDrop?: (v: number) => void; onResult?: (h: ListNode | null) => void; }
export function deleteAllDuplicates(head: ListNode | null, hooks: DelAllDupHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy;
  while (prev.next && prev.next.next) {
    if (prev.next.value === prev.next.next.value) {
      const dup = prev.next.value;
      while (prev.next && prev.next.value === dup) { hooks.onDrop?.(prev.next.value); prev.next = prev.next.next; }
    } else prev = prev.next;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, deleteAllDuplicates } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 3, 4, 4, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '删除所有重复', en: 'Delete all duplicates' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  const nh = deleteAllDuplicates(head, { onDrop: (v) => rec.begin({ zh: '删除 ' + v, en: 'drop ' + v }).setAux([{ label: 'drop', value: String(v), role: 'swap' as BarRole }]).commit() });
  const arr = listToArray(nh);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, deleteAllDuplicates } from '../../src/algorithms/list/list-delete-all-dup-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-delete-all-dup-2/trace.ts';
test('deleteAllDuplicates 正确', () => {
  assert.deepEqual(listToArray(deleteAllDuplicates(buildList([1,2,3,3,4,4,5]))), [1,2,5]);
  assert.deepEqual(listToArray(deleteAllDuplicates(buildList([1,1,1]))), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 44. list-sort-selection-2  —— 选择排序链表
ALGS.push({
  id: 'list-sort-selection-2',
  m: ['链表选择排序v2', 'Selection Sort List v2', '对链表做选择排序（交换值）。', 'Selection sort a linked list by swapping values.',
    '每轮在剩余段中找最小值与当前位置交换。', 'Find min in remainder, swap with current. O(n^2), O(1).', 'O(n^2)', 'O(1)', ['list', 'sort', 'selection-sort']],
  impl: `${LIST_HELPERS}
export interface SelHooks { onSwap?: (a: number, b: number) => void; onResult?: (h: ListNode | null) => void; }
export function selectionSortList(head: ListNode | null, hooks: SelHooks = {}): ListNode | null {
  let cur = head;
  while (cur) {
    let minNode = cur, scan = cur.next;
    while (scan) { if (scan.value < minNode.value) minNode = scan; scan = scan.next; }
    if (minNode !== cur) { const t = cur.value; cur.value = minNode.value; minNode.value = t; hooks.onSwap?.(cur.value, minNode.value); }
    cur = cur.next;
  }
  hooks.onResult?.(head);
  return head;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, selectionSortList } from './impl.ts';
export const DEFAULT_INPUT = [4, 2, 1, 3];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '选择排序', en: 'Selection sort' }).setArray([...input], input.map(() => 'default' as BarRole), []).commit();
  selectionSortList(head, { onSwap: (a, b) => rec.begin({ zh: '交换 ' + a + ' ↔ ' + b, en: 'swap ' + a + ' ↔ ' + b }).setArray(listToArray(head), listToArray(head).map(() => 'default' as BarRole), []).commit() });
  const arr = listToArray(head);
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, selectionSortList } from '../../src/algorithms/list/list-sort-selection-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-sort-selection-2/trace.ts';
test('selectionSortList 正确', () => {
  assert.deepEqual(listToArray(selectionSortList(buildList([4,2,1,3]))), [1,2,3,4]);
  assert.deepEqual(listToArray(selectionSortList(buildList([3,1,2]))), [1,2,3]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 45. list-to-array-2  —— 链表转数组
ALGS.push({
  id: 'list-to-array-2',
  m: ['链表转数组v2', 'List to Array v2', '把链表拍平成数组。', 'Flatten a linked list into an array.',
    '顺序遍历 push。', 'Walk and push. O(n), O(n).', 'O(n)', 'O(n)', ['list', 'conversion']],
  impl: `${LIST_HELPERS}
export interface ToArrHooks { onPush?: (i: number, v: number) => void; onResult?: (arr: number[]) => void; }
export function toArray(head: ListNode | null, hooks: ToArrHooks = {}): number[] {
  const arr: number[] = []; let cur = head, i = 0;
  while (cur) { arr.push(cur.value); hooks.onPush?.(i, cur.value); cur = cur.next; i++; }
  hooks.onResult?.(arr);
  return arr;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, toArray } from './impl.ts';
export const DEFAULT_INPUT = [5, 4, 3, 2, 1];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '链表转数组', en: 'List to array' }).commit();
  const arr = toArray(head, { onPush: (i, v) => rec.begin({ zh: 'push [' + i + '] = ' + v, en: 'push [' + i + '] = ' + v }).setArray(input.slice(0, i + 1), input.slice(0, i + 1).map(() => 'final' as BarRole), []).commit() });
  rec.begin({ zh: '数组 = [' + arr.join(', ') + ']', en: 'array = [' + arr.join(', ') + ']' }).setArray(arr, arr.map(() => 'final' as BarRole), []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, toArray } from '../../src/algorithms/list/list-to-array-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-to-array-2/trace.ts';
test('toArray 正确', () => {
  assert.deepEqual(toArray(buildList([5,4,3,2,1])), [5,4,3,2,1]);
  assert.deepEqual(toArray(null), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

for (const a of ALGS) {
  const m = a.m;
  const metaSrc = meta(a.id, m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]);
  writeAlg(a.id, metaSrc, a.impl, a.trace, a.test);
}
console.log(`list: wrote ${ALGS.length} algorithms`);
