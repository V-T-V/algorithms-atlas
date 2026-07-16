// Generator for 45 tree algorithms (55 -> 100). ids use 'tree-' prefix to stay unique.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'tree';
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
// BST node helper inlined in each impl that needs it
const BST = `
export class BstNode {
  constructor(public value: number, public left: BstNode | null = null, public right: BstNode | null = null) {}
}
export function buildBST(keys: number[]): BstNode | null {
  let root: BstNode | null = null;
  for (const k of keys) root = insert(root, k);
  return root;
}
function insert(root: BstNode | null, key: number): BstNode {
  if (root === null) return new BstNode(key);
  if (key < root.value) root.left = insert(root.left, key);
  else if (key > root.value) root.right = insert(root.right, key);
  return root;
}
`;

const ALGS = [];

// 1. tree-preorder-2  —— 前序遍历（递归）
ALGS.push({
  id: 'tree-preorder-2',
  m: ['前序遍历v2', 'Preorder Traversal v2', '递归前序遍历二叉树：根→左→右。', 'Recursive preorder: root, left, right.',
    '访问根，再递归左子树，再递归右子树。', 'Visit root, recurse left, recurse right. O(n).', 'O(n)', 'O(h)', ['tree', 'traversal', 'preorder']],
  impl: `export class TreeNode {
  constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {}
}
export interface PreorderHooks { onVisit?: (v: number) => void; onResult?: (out: number[]) => void; }
export function preorder(root: TreeNode | null, hooks: PreorderHooks = {}): number[] {
  const out: number[] = [];
  const go = (n: TreeNode | null) => {
    if (!n) return;
    hooks.onVisit?.(n.value);
    out.push(n.value);
    go(n.left); go(n.right);
  };
  go(root);
  hooks.onResult?.(out);
  return out;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root];
  let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, preorder } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5, null, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '前序遍历', en: 'Preorder' }).commit();
  const out = preorder(root, { onVisit: (v) => rec.begin({ zh: '访问 ' + v, en: 'visit ' + v }).setAux([{ label: 'current', value: String(v), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '结果：' + out.join(' → '), en: 'Result: ' + out.join(' → ') }).setBars(out.map((v) => ({ value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, preorder } from '../../src/algorithms/tree/tree-preorder-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-preorder-2/trace.ts';
test('preorder 正确', () => {
  assert.deepEqual(preorder(buildTree([1,2,3,4,5,null,7])), [1,2,4,5,3,7]);
  assert.deepEqual(preorder(null), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 2. tree-inorder-2  —— 中序遍历
ALGS.push({
  id: 'tree-inorder-2',
  m: ['中序遍历v2', 'Inorder Traversal v2', '递归中序遍历：左→根→右。', 'Recursive inorder: left, root, right.',
    '递归左子树，访问根，递归右子树。BST 中序得升序。', 'Recurse left, visit root, recurse right. O(n).', 'O(n)', 'O(h)', ['tree', 'traversal', 'inorder']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface InorderHooks { onVisit?: (v: number) => void; onResult?: (out: number[]) => void; }
export function inorder(root: TreeNode | null, hooks: InorderHooks = {}): number[] {
  const out: number[] = [];
  const go = (n: TreeNode | null) => { if (!n) return; go(n.left); hooks.onVisit?.(n.value); out.push(n.value); go(n.right); };
  go(root);
  hooks.onResult?.(out);
  return out;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, inorder } from './impl.ts';
export const DEFAULT_INPUT = [4, 2, 6, 1, 3, 5, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '中序遍历', en: 'Inorder' }).commit();
  const out = inorder(root, { onVisit: (v) => rec.begin({ zh: '访问 ' + v, en: 'visit ' + v }).setAux([{ label: 'current', value: String(v), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '结果：' + out.join(' → '), en: 'Result: ' + out.join(' → ') }).setBars(out.map((v) => ({ value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, inorder } from '../../src/algorithms/tree/tree-inorder-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-inorder-2/trace.ts';
test('inorder 正确', () => {
  assert.deepEqual(inorder(buildTree([4,2,6,1,3,5,7])), [1,2,3,4,5,6,7]);
  assert.deepEqual(inorder(null), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 3. tree-postorder-2  —— 后序遍历
ALGS.push({
  id: 'tree-postorder-2',
  m: ['后序遍历v2', 'Postorder Traversal v2', '递归后序遍历：左→右→根。', 'Recursive postorder: left, right, root.',
    '递归左右子树后再访问根。常用于删除/计算。', 'Recurse left, right, then visit root. O(n).', 'O(n)', 'O(h)', ['tree', 'traversal', 'postorder']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface PostorderHooks { onVisit?: (v: number) => void; onResult?: (out: number[]) => void; }
export function postorder(root: TreeNode | null, hooks: PostorderHooks = {}): number[] {
  const out: number[] = [];
  const go = (n: TreeNode | null) => { if (!n) return; go(n.left); go(n.right); hooks.onVisit?.(n.value); out.push(n.value); };
  go(root);
  hooks.onResult?.(out);
  return out;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, postorder } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5, null, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '后序遍历', en: 'Postorder' }).commit();
  const out = postorder(root, { onVisit: (v) => rec.begin({ zh: '访问 ' + v, en: 'visit ' + v }).setAux([{ label: 'current', value: String(v), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '结果：' + out.join(' → '), en: 'Result: ' + out.join(' → ') }).setBars(out.map((v) => ({ value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, postorder } from '../../src/algorithms/tree/tree-postorder-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-postorder-2/trace.ts';
test('postorder 正确', () => {
  assert.deepEqual(postorder(buildTree([1,2,3,4,5,null,7])), [4,5,2,7,3,1]);
  assert.deepEqual(postorder(null), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 4. tree-levelorder-2  —— 层序遍历 (BFS)
ALGS.push({
  id: 'tree-levelorder-2',
  m: ['层序遍历v2', 'Level Order Traversal v2', 'BFS 按层自上而下遍历二叉树。', 'BFS level-by-level traversal.',
    '队列驱动：每弹出一个节点，把其值入列，再把非空子节点入队。', 'Queue-driven BFS. O(n), O(w).', 'O(n)', 'O(w)', ['tree', 'traversal', 'bfs']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface LevelHooks { onLevel?: (depth: number, vals: number[]) => void; onResult?: (out: number[][]) => void; }
export function levelOrder(root: TreeNode | null, hooks: LevelHooks = {}): number[][] {
  const out: number[][] = [];
  if (!root) { hooks.onResult?.(out); return out; }
  const q: TreeNode[] = [root];
  while (q.length) {
    const sz = q.length;
    const vals: number[] = [];
    for (let i = 0; i < sz; i++) {
      const node = q.shift()!;
      vals.push(node.value);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    hooks.onLevel?.(out.length, vals);
    out.push(vals);
  }
  hooks.onResult?.(out);
  return out;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, levelOrder } from './impl.ts';
export const DEFAULT_INPUT = [3, 9, 20, null, null, 15, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '层序遍历', en: 'Level order' }).commit();
  const levels = levelOrder(root, { onLevel: (d, vals) => rec.begin({ zh: '第 ' + d + ' 层：' + vals.join(','), en: 'level ' + d + ': ' + vals.join(',') }).setBars(vals.map((v) => ({ value: v, role: 'pivot' as BarRole }))).commit() });
  const flat = levels.flat();
  rec.begin({ zh: '结果：' + flat.join(' → '), en: 'Result: ' + flat.join(' → ') }).setBars(flat.map((v) => ({ value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, levelOrder } from '../../src/algorithms/tree/tree-levelorder-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-levelorder-2/trace.ts';
test('levelOrder 正确', () => {
  assert.deepEqual(levelOrder(buildTree([3,9,20,null,null,15,7])), [[3],[9,20],[15,7]]);
  assert.deepEqual(levelOrder(null), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 5. tree-max-depth-2  —— 最大深度
ALGS.push({
  id: 'tree-max-depth-2',
  m: ['最大深度v2', 'Maximum Depth v2', '递归求二叉树最大深度。', 'Recursive maximum depth of a binary tree.',
    'depth(node) = 1 + max(depth(left), depth(right))。', 'depth = 1 + max(left, right). O(n).', 'O(n)', 'O(h)', ['tree', 'depth', 'recursion']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface DepthHooks { onVisit?: (v: number, d: number) => void; onResult?: (d: number) => void; }
export function maxDepth(root: TreeNode | null, hooks: DepthHooks = {}): number {
  const go = (n: TreeNode | null): number => {
    if (!n) return 0;
    const l = go(n.left), r = go(n.right);
    const d = 1 + Math.max(l, r);
    hooks.onVisit?.(n.value, d);
    return d;
  };
  const d = go(root);
  hooks.onResult?.(d);
  return d;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, maxDepth } from './impl.ts';
export const DEFAULT_INPUT = [3, 9, 20, null, null, 15, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '求最大深度', en: 'Max depth' }).commit();
  const d = maxDepth(root, { onVisit: (v, dep) => rec.begin({ zh: '节点 ' + v + ' 深度 ' + dep, en: 'node ' + v + ' depth ' + dep }).setAux([{ label: 'depth', value: String(dep), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '最大深度 = ' + d, en: 'max depth = ' + d }).setAux([{ label: 'maxDepth', value: String(d), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, maxDepth } from '../../src/algorithms/tree/tree-max-depth-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-max-depth-2/trace.ts';
test('maxDepth 正确', () => {
  assert.equal(maxDepth(buildTree([3,9,20,null,null,15,7])), 3);
  assert.equal(maxDepth(buildTree([1])), 1);
  assert.equal(maxDepth(null), 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 6. tree-invert-2  —— 翻转二叉树
ALGS.push({
  id: 'tree-invert-2',
  m: ['翻转二叉树v2', 'Invert Binary Tree v2', '交换每个节点的左右子树。', 'Swap left and right children of every node.',
    '递归：node.left, node.right = invert(right), invert(left)。', 'Swap children recursively. O(n).', 'O(n)', 'O(h)', ['tree', 'invert']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface InvertHooks { onSwap?: (v: number) => void; onResult?: (root: TreeNode | null) => void; }
export function invertTree(root: TreeNode | null, hooks: InvertHooks = {}): TreeNode | null {
  if (!root) return null;
  hooks.onSwap?.(root.value);
  const l = invertTree(root.left, hooks);
  const r = invertTree(root.right, hooks);
  root.left = r; root.right = l;
  hooks.onResult?.(root);
  return root;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, invertTree } from './impl.ts';
export const DEFAULT_INPUT = [4, 2, 7, 1, 3, 6, 9];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '翻转二叉树', en: 'Invert tree' }).commit();
  invertTree(root, { onSwap: (v) => rec.begin({ zh: '交换 ' + v + ' 的子树', en: 'swap children of ' + v }).setAux([{ label: 'swap', value: String(v), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).setAux([{ label: 'inverted', value: 'yes', role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, invertTree } from '../../src/algorithms/tree/tree-invert-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-invert-2/trace.ts';
const levelVals = (root: any): number[] => {
  if (!root) return [];
  const out: number[] = []; const q = [root];
  while (q.length) { const n = q.shift()!; out.push(n.value); if (n.left) q.push(n.left); if (n.right) q.push(n.right); }
  return out;
};
test('invertTree 正确', () => {
  assert.deepEqual(levelVals(invertTree(buildTree([4,2,7,1,3,6,9]))), [4,7,2,9,6,3,1]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 7. tree-symmetric-2  —— 对称二叉树
ALGS.push({
  id: 'tree-symmetric-2',
  m: ['对称二叉树v2', 'Symmetric Tree v2', '判断二叉树是否镜像对称。', 'Check if a binary tree is a mirror of itself.',
    '递归比较左右子树是否互为镜像：left.left vs right.right。', 'Recurse: isMirror(left, right). O(n).', 'O(n)', 'O(h)', ['tree', 'symmetric']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface SymHooks { onCompare?: (a: number | null, b: number | null) => void; onResult?: (s: boolean) => void; }
function isMirror(a: TreeNode | null, b: TreeNode | null, hooks: SymHooks): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  hooks.onCompare?.(a.value, b.value);
  return a.value === b.value && isMirror(a.left, b.right, hooks) && isMirror(a.right, b.left, hooks);
}
export function isSymmetric(root: TreeNode | null, hooks: SymHooks = {}): boolean {
  const r = !root ? true : isMirror(root.left, root.right, hooks);
  hooks.onResult?.(r);
  return r;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, isSymmetric } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 2, 3, 4, 4, 3];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '对称判断', en: 'Symmetric check' }).commit();
  const r = isSymmetric(root, { onCompare: (a, b) => rec.begin({ zh: '比较 ' + a + ' 与 ' + b, en: 'compare ' + a + ' vs ' + b }).setAux([{ label: 'a', value: String(a), role: 'pivot' as BarRole }, { label: 'b', value: String(b), role: 'frontier' as BarRole }]).commit() });
  rec.begin({ zh: '对称？' + r, en: 'symmetric? ' + r }).setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, isSymmetric } from '../../src/algorithms/tree/tree-symmetric-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-symmetric-2/trace.ts';
test('isSymmetric 正确', () => {
  assert.equal(isSymmetric(buildTree([1,2,2,3,4,4,3])), true);
  assert.equal(isSymmetric(buildTree([1,2,2,null,3,null,3])), false);
  assert.equal(isSymmetric(null), true);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 8. tree-path-sum-2  —— 路径和（根到叶是否存在和=target）
ALGS.push({
  id: 'tree-path-sum-2',
  m: ['路径和v2', 'Path Sum v2', '判断是否存在根到叶路径，节点值之和等于 target。', 'Whether a root-to-leaf path sums to target.',
    '递归减去当前值，到叶时判断剩余是否为 0。', 'Subtract node value; at leaf check remainder==0. O(n).', 'O(n)', 'O(h)', ['tree', 'path-sum', 'dfs']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface PathSumHooks { onVisit?: (v: number, remain: number) => void; onResult?: (has: boolean) => void; }
export function hasPathSum(root: TreeNode | null, target: number, hooks: PathSumHooks = {}): boolean {
  const go = (n: TreeNode | null, rem: number): boolean => {
    if (!n) return false;
    hooks.onVisit?.(n.value, rem - n.value);
    if (!n.left && !n.right) return rem - n.value === 0;
    return go(n.left, rem - n.value) || go(n.right, rem - n.value);
  };
  const r = go(root, target);
  hooks.onResult?.(r);
  return r;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, hasPathSum } from './impl.ts';
export const DEFAULT_INPUT = { arr: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], target: 22 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input.arr);
  rec.begin({ zh: '路径和 = ' + input.target, en: 'Path sum = ' + input.target }).commit();
  const r = hasPathSum(root, input.target, { onVisit: (v, rem) => rec.begin({ zh: '节点 ' + v + ' 剩余 ' + rem, en: 'node ' + v + ' remain ' + rem }).setAux([{ label: 'remain', value: String(rem), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '存在？' + r, en: 'has? ' + r }).setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, hasPathSum } from '../../src/algorithms/tree/tree-path-sum-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-path-sum-2/trace.ts';
test('hasPathSum 正确', () => {
  assert.equal(hasPathSum(buildTree([5,4,8,11,null,13,4,7,2,null,null,null,1]), 22), true);
  assert.equal(hasPathSum(buildTree([1,2,3]), 5), false);
  assert.equal(hasPathSum(null, 0), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 9. tree-count-nodes-2  —— 统计节点数
ALGS.push({
  id: 'tree-count-nodes-2',
  m: ['统计节点数v2', 'Count Nodes v2', '递归统计二叉树节点总数。', 'Recursively count total nodes.',
    'count = 1 + left + right。', 'count = 1 + left + right. O(n).', 'O(n)', 'O(h)', ['tree', 'count']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface CountHooks { onVisit?: (v: number) => void; onResult?: (n: number) => void; }
export function countNodes(root: TreeNode | null, hooks: CountHooks = {}): number {
  const go = (n: TreeNode | null): number => { if (!n) return 0; hooks.onVisit?.(n.value); return 1 + go(n.left) + go(n.right); };
  const n = go(root);
  hooks.onResult?.(n);
  return n;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, countNodes } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '统计节点', en: 'Count nodes' }).commit();
  const n = countNodes(root, { onVisit: (v) => rec.begin({ zh: '访问 ' + v, en: 'visit ' + v }).setAux([{ label: 'node', value: String(v), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '节点数 = ' + n, en: 'count = ' + n }).setAux([{ label: 'count', value: String(n), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, countNodes } from '../../src/algorithms/tree/tree-count-nodes-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-count-nodes-2/trace.ts';
test('countNodes 正确', () => {
  assert.equal(countNodes(buildTree([1,2,3,4,5,6])), 6);
  assert.equal(countNodes(buildTree([1])), 1);
  assert.equal(countNodes(null), 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 10. tree-leaf-count-2  —— 统计叶子节点
ALGS.push({
  id: 'tree-leaf-count-2',
  m: ['叶子数v2', 'Count Leaves v2', '递归统计二叉树叶子节点数。', 'Recursively count leaf nodes.',
    '无左右子即叶子。', 'Leaf if both children null. O(n).', 'O(n)', 'O(h)', ['tree', 'leaf', 'count']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface LeafHooks { onLeaf?: (v: number) => void; onResult?: (n: number) => void; }
export function countLeaves(root: TreeNode | null, hooks: LeafHooks = {}): number {
  const go = (n: TreeNode | null): number => {
    if (!n) return 0;
    if (!n.left && !n.right) { hooks.onLeaf?.(n.value); return 1; }
    return go(n.left) + go(n.right);
  };
  const n = go(root);
  hooks.onResult?.(n);
  return n;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, countLeaves } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '统计叶子', en: 'Count leaves' }).commit();
  const n = countLeaves(root, { onLeaf: (v) => rec.begin({ zh: '叶子 ' + v, en: 'leaf ' + v }).setAux([{ label: 'leaf', value: String(v), role: 'final' as BarRole }]).commit() });
  rec.begin({ zh: '叶子数 = ' + n, en: 'leaves = ' + n }).setAux([{ label: 'leaves', value: String(n), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, countLeaves } from '../../src/algorithms/tree/tree-leaf-count-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-leaf-count-2/trace.ts';
test('countLeaves 正确', () => {
  assert.equal(countLeaves(buildTree([1,2,3,4,5])), 3);
  assert.equal(countLeaves(buildTree([1])), 1);
  assert.equal(countLeaves(null), 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 11. tree-is-balanced-2  —— 判断平衡
ALGS.push({
  id: 'tree-is-balanced-2',
  m: ['平衡判断v2', 'Is Balanced v2', '判断二叉树是否高度平衡（左右子树高差≤1）。', 'Check if a binary tree is height-balanced.',
    '递归返回高度，发现不平衡返回 -1 提前剪枝。', 'Return -1 when unbalanced, else height. O(n).', 'O(n)', 'O(h)', ['tree', 'balanced', 'dfs']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface BalanceHooks { onVisit?: (v: number, balanced: boolean) => void; onResult?: (b: boolean) => void; }
export function isBalanced(root: TreeNode | null, hooks: BalanceHooks = {}): boolean {
  const go = (n: TreeNode | null): number => {
    if (!n) return 0;
    const l = go(n.left), r = go(n.right);
    const bal = l !== -1 && r !== -1 && Math.abs(l - r) <= 1;
    hooks.onVisit?.(n.value, bal);
    return bal ? 1 + Math.max(l, r) : -1;
  };
  const b = go(root) !== -1;
  hooks.onResult?.(b);
  return b;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, isBalanced } from './impl.ts';
export const DEFAULT_INPUT = [3, 9, 20, null, null, 15, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '平衡判断', en: 'Is balanced' }).commit();
  const b = isBalanced(root, { onVisit: (v, bal) => rec.begin({ zh: '节点 ' + v + (bal ? ' 平衡' : ' 不平衡'), en: 'node ' + v + (bal ? ' balanced' : ' unbalanced') }).setAux([{ label: 'balanced', value: String(bal), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平衡？' + b, en: 'balanced? ' + b }).setAux([{ label: 'result', value: String(b), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, isBalanced } from '../../src/algorithms/tree/tree-is-balanced-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-is-balanced-2/trace.ts';
test('isBalanced 正确', () => {
  assert.equal(isBalanced(buildTree([3,9,20,null,null,15,7])), true);
  assert.equal(isBalanced(buildTree([1,2,2,3,3,null,null,4,4])), false);
  assert.equal(isBalanced(null), true);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 12. tree-is-same-2  —— 两棵树是否相同
ALGS.push({
  id: 'tree-is-same-2',
  m: ['两树相同v2', 'Same Tree v2', '递归判断两棵二叉树结构与值完全相同。', 'Recursively check two trees are structurally identical.',
    '同时递归：值相等且左右子树相同。', 'Recurse: same value, same left, same right. O(n).', 'O(n)', 'O(h)', ['tree', 'compare']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface SameHooks { onCompare?: (a: number | null, b: number | null) => void; onResult?: (s: boolean) => void; }
export function isSameTree(a: TreeNode | null, b: TreeNode | null, hooks: SameHooks = {}): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  hooks.onCompare?.(a.value, b.value);
  return a.value === b.value && isSameTree(a.left, b.left, hooks) && isSameTree(a.right, b.right, hooks);
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, isSameTree } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 2, 3], b: [1, 2, 3] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildTree(input.a), b = buildTree(input.b);
  rec.begin({ zh: '两树相同', en: 'Same tree' }).commit();
  const r = isSameTree(a, b, { onCompare: (va, vb) => rec.begin({ zh: '比较 ' + va + ' 与 ' + vb, en: 'compare ' + va + ' vs ' + vb }).setAux([{ label: 'a', value: String(va), role: 'pivot' as BarRole }, { label: 'b', value: String(vb), role: 'frontier' as BarRole }]).commit() });
  rec.begin({ zh: '相同？' + r, en: 'same? ' + r }).setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, isSameTree } from '../../src/algorithms/tree/tree-is-same-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-is-same-2/trace.ts';
test('isSameTree 正确', () => {
  assert.equal(isSameTree(buildTree([1,2,3]), buildTree([1,2,3])), true);
  assert.equal(isSameTree(buildTree([1,2]), buildTree([1,null,2])), false);
  assert.equal(isSameTree(null, null), true);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 13. tree-min-depth-2  —— 最小深度
ALGS.push({
  id: 'tree-min-depth-2',
  m: ['最小深度v2', 'Minimum Depth v2', '求根到最近叶子的最短路径长度。', 'Shortest root-to-leaf path length.',
    '递归：若某子为空则取另一子（避免把单侧空当叶子）。', 'If one side empty, take the other. O(n).', 'O(n)', 'O(h)', ['tree', 'depth', 'dfs']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface MinDepthHooks { onVisit?: (v: number) => void; onResult?: (d: number) => void; }
export function minDepth(root: TreeNode | null, hooks: MinDepthHooks = {}): number {
  const go = (n: TreeNode | null): number => {
    if (!n) return 0;
    hooks.onVisit?.(n.value);
    if (!n.left) return 1 + go(n.right);
    if (!n.right) return 1 + go(n.left);
    return 1 + Math.min(go(n.left), go(n.right));
  };
  const d = go(root);
  hooks.onResult?.(d);
  return d;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, minDepth } from './impl.ts';
export const DEFAULT_INPUT = [3, 9, 20, null, null, 15, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '最小深度', en: 'Min depth' }).commit();
  const d = minDepth(root, { onVisit: (v) => rec.begin({ zh: '访问 ' + v, en: 'visit ' + v }).setAux([{ label: 'node', value: String(v), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '最小深度 = ' + d, en: 'min depth = ' + d }).setAux([{ label: 'minDepth', value: String(d), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, minDepth } from '../../src/algorithms/tree/tree-min-depth-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-min-depth-2/trace.ts';
test('minDepth 正确', () => {
  assert.equal(minDepth(buildTree([3,9,20,null,null,15,7])), 2);
  assert.equal(minDepth(buildTree([1,2])), 2);
  assert.equal(minDepth(null), 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 14. tree-diameter-2  —— 二叉树直径
ALGS.push({
  id: 'tree-diameter-2',
  m: ['二叉树直径v2', 'Tree Diameter v2', '求二叉树中任意两节点路径上的最大边数。', 'Longest path (in edges) between any two nodes.',
    '后序递归：diameter = max(leftH + rightH)，高度同时返回。', 'Post-order: update ans with leftH+rightH. O(n).', 'O(n)', 'O(h)', ['tree', 'diameter', 'dfs']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface DiameterHooks { onVisit?: (v: number, path: number) => void; onResult?: (d: number) => void; }
export function diameter(root: TreeNode | null, hooks: DiameterHooks = {}): number {
  let best = 0;
  const go = (n: TreeNode | null): number => {
    if (!n) return 0;
    const l = go(n.left), r = go(n.right);
    best = Math.max(best, l + r);
    hooks.onVisit?.(n.value, l + r);
    return 1 + Math.max(l, r);
  };
  go(root);
  hooks.onResult?.(best);
  return best;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, diameter } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '求直径', en: 'Diameter' }).commit();
  const d = diameter(root, { onVisit: (v, path) => rec.begin({ zh: '节点 ' + v + ' 路径 ' + path, en: 'node ' + v + ' path ' + path }).setAux([{ label: 'path', value: String(path), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '直径 = ' + d, en: 'diameter = ' + d }).setAux([{ label: 'diameter', value: String(d), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, diameter } from '../../src/algorithms/tree/tree-diameter-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-diameter-2/trace.ts';
test('diameter 正确', () => {
  assert.equal(diameter(buildTree([1,2,3,4,5])), 3);
  assert.equal(diameter(buildTree([1])), 0);
  assert.equal(diameter(null), 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 15. tree-lca-2  —— 最近公共祖先 (一般二叉树)
ALGS.push({
  id: 'tree-lca-2',
  m: ['最近公共祖先v2', 'Lowest Common Ancestor v2', '在一般二叉树中求两节点 p、q 的最近公共祖先。', 'Lowest common ancestor of p and q in a binary tree.',
    '递归：在当前子树找 p/q，若左右各命中一个则当前即 LCA。', 'Recurse; if p,q split across children, current is LCA. O(n).', 'O(n)', 'O(h)', ['tree', 'lca', 'dfs']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface LcaHooks { onVisit?: (v: number) => void; onResult?: (v: number | null) => void; }
export function lowestCommonAncestor(root: TreeNode | null, p: number, q: number, hooks: LcaHooks = {}): TreeNode | null {
  const go = (n: TreeNode | null): TreeNode | null => {
    if (!n) return null;
    if (n.value === p || n.value === q) { hooks.onVisit?.(n.value); return n; }
    const l = go(n.left), r = go(n.right);
    hooks.onVisit?.(n.value);
    if (l && r) return n;
    return l ?? r;
  };
  const res = go(root);
  hooks.onResult?.(res?.value ?? null);
  return res;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, lowestCommonAncestor } from './impl.ts';
export const DEFAULT_INPUT = { arr: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 5, q: 1 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input.arr);
  rec.begin({ zh: 'LCA(' + input.p + ',' + input.q + ')', en: 'LCA(' + input.p + ',' + input.q + ')' }).commit();
  const node = lowestCommonAncestor(root, input.p, input.q, { onVisit: (v) => rec.begin({ zh: '访问 ' + v, en: 'visit ' + v }).setAux([{ label: 'node', value: String(v), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: 'LCA = ' + (node?.value ?? null), en: 'LCA = ' + (node?.value ?? null) }).setAux([{ label: 'lca', value: String(node?.value ?? null), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, lowestCommonAncestor } from '../../src/algorithms/tree/tree-lca-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-lca-2/trace.ts';
test('lowestCommonAncestor 正确', () => {
  assert.equal(lowestCommonAncestor(buildTree([3,5,1,6,2,0,8,null,null,7,4]), 5, 1)!.value, 3);
  assert.equal(lowestCommonAncestor(buildTree([3,5,1,6,2,0,8,null,null,7,4]), 5, 4)!.value, 5);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 16. tree-all-paths-2  —— 所有根到叶路径
ALGS.push({
  id: 'tree-all-paths-2',
  m: ['所有路径v2', 'All Root-to-Leaf Paths v2', '收集所有根到叶路径。', 'Collect every root-to-leaf path.',
    'DFS 维护当前路径，到叶时拷贝入结果。', 'DFS, push a copy at each leaf. O(n^2) worst.', 'O(n^2)', 'O(h)', ['tree', 'paths', 'dfs']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface PathsHooks { onLeaf?: (path: number[]) => void; onResult?: (paths: number[][]) => void; }
export function allPaths(root: TreeNode | null, hooks: PathsHooks = {}): number[][] {
  const out: number[][] = [], cur: number[] = [];
  const go = (n: TreeNode | null) => {
    if (!n) return;
    cur.push(n.value);
    if (!n.left && !n.right) { out.push([...cur]); hooks.onLeaf?.([...cur]); }
    else { go(n.left); go(n.right); }
    cur.pop();
  };
  go(root);
  hooks.onResult?.(out);
  return out;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, allPaths } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, null, 5];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '所有路径', en: 'All paths' }).commit();
  const paths = allPaths(root, { onLeaf: (path) => rec.begin({ zh: '叶路径 ' + path.join('→'), en: 'path ' + path.join('→') }).setBars(path.map((v) => ({ value: v, role: 'final' as BarRole }))).commit() });
  rec.begin({ zh: '共 ' + paths.length + ' 条', en: paths.length + ' paths' }).setAux([{ label: 'count', value: String(paths.length), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, allPaths } from '../../src/algorithms/tree/tree-all-paths-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-all-paths-2/trace.ts';
test('allPaths 正确', () => {
  assert.deepEqual(allPaths(buildTree([1,2,3,null,5])), [[1,2,5],[1,3]]);
  assert.deepEqual(allPaths(null), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 17. tree-bst-insert-2  —— BST 插入
ALGS.push({
  id: 'tree-bst-insert-2',
  m: ['BST插入v2', 'BST Insert v2', '在 BST 中插入一个值（保持 BST 性质）。', 'Insert a value into a BST, preserving the BST property.',
    '递归：小于当前走左，大于走右，遇空挂节点。', 'Recurse left/right until a null slot. O(h).', 'O(h)', 'O(h)', ['tree', 'bst', 'insert']],
  impl: `${BST}
export interface InsertHooks { onCompare?: (cur: number, dir: 'left' | 'right') => void; onResult?: (root: BstNode | null) => void; }
export { insert as bstInsert };
export function insertTracked(root: BstNode | null, key: number, hooks: InsertHooks = {}): BstNode | null {
  const go = (n: BstNode | null): BstNode => {
    if (n === null) return new BstNode(key);
    if (key < n.value) { hooks.onCompare?.(n.value, 'left'); n.left = go(n.left); }
    else if (key > n.value) { hooks.onCompare?.(n.value, 'right'); n.right = go(n.right); }
    return n;
  };
  const r = go(root);
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, insertTracked } from './impl.ts';
export const DEFAULT_INPUT = { keys: [50, 30, 70], insert: 40 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let root = buildBST(input.keys);
  rec.begin({ zh: 'BST 插入 ' + input.insert, en: 'Insert ' + input.insert }).commit();
  root = insertTracked(root, input.insert, { onCompare: (cur, dir) => rec.begin({ zh: cur + ' → ' + dir, en: cur + ' → ' + dir }).setAux([{ label: 'dir', value: dir, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).setAux([{ label: 'inserted', value: String(input.insert), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, insertTracked } from '../../src/algorithms/tree/tree-bst-insert-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bst-insert-2/trace.ts';
const inorder = (r: any): number[] => !r ? [] : [...inorder(r.left), r.value, ...inorder(r.right)];
test('bstInsert 正确', () => {
  const r = insertTracked(buildBST([50,30,70]), 40);
  assert.deepEqual(inorder(r), [30,40,50,70]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 18. tree-bst-search-2  —— BST 查找
ALGS.push({
  id: 'tree-bst-search-2',
  m: ['BST查找v2', 'BST Search v2', '在 BST 中查找某值是否存在。', 'Search a value in a BST.',
    '小于当前走左，大于走右，相等即命中。', 'Compare and descend. O(h).', 'O(h)', 'O(1)', ['tree', 'bst', 'search']],
  impl: `${BST}
export interface SearchHooks { onCompare?: (cur: number, dir: 'left' | 'right' | 'hit' | 'miss') => void; onResult?: (found: boolean) => void; }
export function bstSearch(root: BstNode | null, key: number, hooks: SearchHooks = {}): boolean {
  let node = root;
  while (node) {
    if (key === node.value) { hooks.onCompare?.(node.value, 'hit'); hooks.onResult?.(true); return true; }
    if (key < node.value) { hooks.onCompare?.(node.value, 'left'); node = node.left; }
    else { hooks.onCompare?.(node.value, 'right'); node = node.right; }
  }
  hooks.onCompare?.(NaN, 'miss'); hooks.onResult?.(false);
  return false;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, bstSearch } from './impl.ts';
export const DEFAULT_INPUT = { keys: [50, 30, 70, 20, 40, 60, 80], key: 60 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildBST(input.keys);
  rec.begin({ zh: '查找 ' + input.key, en: 'Search ' + input.key }).commit();
  const found = bstSearch(root, input.key, { onCompare: (cur, dir) => rec.begin({ zh: Number.isNaN(cur) ? '未命中' : cur + ' → ' + dir, en: Number.isNaN(cur) ? 'miss' : cur + ' → ' + dir }).setAux([{ label: 'cur', value: Number.isNaN(cur) ? 'null' : String(cur), role: 'compare' as BarRole }]).commit() });
  rec.begin({ zh: '找到？' + found, en: 'found? ' + found }).setAux([{ label: 'found', value: String(found), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, bstSearch } from '../../src/algorithms/tree/tree-bst-search-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bst-search-2/trace.ts';
test('bstSearch 正确', () => {
  const root = buildBST([50,30,70,20,40,60,80]);
  assert.equal(bstSearch(root, 60), true);
  assert.equal(bstSearch(root, 25), false);
  assert.equal(bstSearch(null, 1), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 19. tree-bst-validate-2  —— 验证 BST
ALGS.push({
  id: 'tree-bst-validate-2',
  m: ['验证BSTv2', 'Validate BST v2', '判断一棵二叉树是否是合法 BST（用上下界）。', 'Validate a BST using min/max bounds.',
    '递归传递 (lo, hi)：节点值必须落在区间内。', 'Pass (lo, hi) bounds down. O(n).', 'O(n)', 'O(h)', ['tree', 'bst', 'validate']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface ValidateHooks { onVisit?: (v: number, ok: boolean) => void; onResult?: (ok: boolean) => void; }
export function isValidBST(root: TreeNode | null, hooks: ValidateHooks = {}): boolean {
  const go = (n: TreeNode | null, lo: number, hi: number): boolean => {
    if (!n) return true;
    const ok = n.value > lo && n.value < hi;
    hooks.onVisit?.(n.value, ok);
    if (!ok) return false;
    return go(n.left, lo, n.value) && go(n.right, n.value, hi);
  };
  const r = go(root, -Infinity, Infinity);
  hooks.onResult?.(r);
  return r;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, isValidBST } from './impl.ts';
export const DEFAULT_INPUT = [5, 1, 8, null, null, 6, 9];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '验证 BST', en: 'Validate BST' }).commit();
  const ok = isValidBST(root, { onVisit: (v, k) => rec.begin({ zh: '检查 ' + v + (k ? ' ✓' : ' ✗'), en: 'check ' + v + (k ? ' ok' : ' bad') }).setAux([{ label: 'ok', value: String(k), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '合法 BST？' + ok, en: 'valid? ' + ok }).setAux([{ label: 'valid', value: String(ok), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, isValidBST } from '../../src/algorithms/tree/tree-bst-validate-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bst-validate-2/trace.ts';
test('isValidBST 正确', () => {
  assert.equal(isValidBST(buildTree([5,1,8,null,null,6,9])), true);
  assert.equal(isValidBST(buildTree([5,1,4,null,null,3,6])), false);
  assert.equal(isValidBST(null), true);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 20. tree-bst-min-2  —— BST 最小值
ALGS.push({
  id: 'tree-bst-min-2',
  m: ['BST最小值v2', 'BST Minimum v2', 'BST 中最小值即最左节点。', 'The minimum is the leftmost node of a BST.',
    '一路向左直到 left 为 null。', 'Descend left until null. O(h).', 'O(h)', 'O(1)', ['tree', 'bst', 'min']],
  impl: `${BST}
export interface MinHooks { onVisit?: (v: number) => void; onResult?: (v: number | null) => void; }
export function bstMin(root: BstNode | null, hooks: MinHooks = {}): number | null {
  if (!root) { hooks.onResult?.(null); return null; }
  let node = root;
  while (node.left) { hooks.onVisit?.(node.value); node = node.left; }
  hooks.onVisit?.(node.value);
  hooks.onResult?.(node.value);
  return node.value;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, bstMin } from './impl.ts';
export const DEFAULT_INPUT = [50, 30, 70, 20, 40];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildBST(input);
  rec.begin({ zh: 'BST 最小值', en: 'BST minimum' }).commit();
  const v = bstMin(root, { onVisit: (val) => rec.begin({ zh: '经过 ' + val, en: 'pass ' + val }).setAux([{ label: 'node', value: String(val), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '最小 = ' + v, en: 'min = ' + v }).setAux([{ label: 'min', value: String(v), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, bstMin } from '../../src/algorithms/tree/tree-bst-min-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bst-min-2/trace.ts';
test('bstMin 正确', () => {
  assert.equal(bstMin(buildBST([50,30,70,20,40])), 20);
  assert.equal(bstMin(buildBST([5])), 5);
  assert.equal(bstMin(null), null);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 21. tree-bst-max-2  —— BST 最大值
ALGS.push({
  id: 'tree-bst-max-2',
  m: ['BST最大值v2', 'BST Maximum v2', 'BST 中最大值即最右节点。', 'The maximum is the rightmost node of a BST.',
    '一路向右直到 right 为 null。', 'Descend right until null. O(h).', 'O(h)', 'O(1)', ['tree', 'bst', 'max']],
  impl: `${BST}
export interface MaxHooks { onVisit?: (v: number) => void; onResult?: (v: number | null) => void; }
export function bstMax(root: BstNode | null, hooks: MaxHooks = {}): number | null {
  if (!root) { hooks.onResult?.(null); return null; }
  let node = root;
  while (node.right) { hooks.onVisit?.(node.value); node = node.right; }
  hooks.onVisit?.(node.value);
  hooks.onResult?.(node.value);
  return node.value;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, bstMax } from './impl.ts';
export const DEFAULT_INPUT = [50, 30, 70, 60, 80];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildBST(input);
  rec.begin({ zh: 'BST 最大值', en: 'BST maximum' }).commit();
  const v = bstMax(root, { onVisit: (val) => rec.begin({ zh: '经过 ' + val, en: 'pass ' + val }).setAux([{ label: 'node', value: String(val), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '最大 = ' + v, en: 'max = ' + v }).setAux([{ label: 'max', value: String(v), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, bstMax } from '../../src/algorithms/tree/tree-bst-max-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bst-max-2/trace.ts';
test('bstMax 正确', () => {
  assert.equal(bstMax(buildBST([50,30,70,60,80])), 80);
  assert.equal(bstMax(buildBST([5])), 5);
  assert.equal(bstMax(null), null);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 22. tree-right-view-2  —— 二叉树右视图
ALGS.push({
  id: 'tree-right-view-2',
  m: ['右视图v2', 'Right Side View v2', '从右侧看二叉树能看到的节点（每层最右）。', 'Nodes visible from the right (rightmost of each level).',
    '层序遍历，每层取最后一个。', 'Level order, take last of each level. O(n).', 'O(n)', 'O(w)', ['tree', 'right-view', 'bfs']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface RightViewHooks { onLevel?: (depth: number, v: number) => void; onResult?: (out: number[]) => void; }
export function rightSideView(root: TreeNode | null, hooks: RightViewHooks = {}): number[] {
  const out: number[] = [];
  if (!root) { hooks.onResult?.(out); return out; }
  const q: TreeNode[] = [root];
  while (q.length) {
    const sz = q.length;
    for (let i = 0; i < sz; i++) {
      const node = q.shift()!;
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
      if (i === sz - 1) { out.push(node.value); hooks.onLevel?.(out.length - 1, node.value); }
    }
  }
  hooks.onResult?.(out);
  return out;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, rightSideView } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, null, 5, null, 4];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '右视图', en: 'Right side view' }).commit();
  const out = rightSideView(root, { onLevel: (d, v) => rec.begin({ zh: '第 ' + d + ' 层最右 = ' + v, en: 'level ' + d + ' rightmost = ' + v }).setAux([{ label: 'right', value: String(v), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '右视图：' + out.join(' → '), en: 'View: ' + out.join(' → ') }).setBars(out.map((v) => ({ value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, rightSideView } from '../../src/algorithms/tree/tree-right-view-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-right-view-2/trace.ts';
test('rightSideView 正确', () => {
  assert.deepEqual(rightSideView(buildTree([1,2,3,null,5,null,4])), [1,3,4]);
  assert.deepEqual(rightSideView(null), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 23. tree-left-view-2  —— 左视图
ALGS.push({
  id: 'tree-left-view-2',
  m: ['左视图v2', 'Left Side View v2', '每层最左节点。', 'Leftmost node of each level.',
    '层序遍历，每层取第一个。', 'Level order, take first of each level. O(n).', 'O(n)', 'O(w)', ['tree', 'left-view', 'bfs']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface LeftViewHooks { onLevel?: (depth: number, v: number) => void; onResult?: (out: number[]) => void; }
export function leftSideView(root: TreeNode | null, hooks: LeftViewHooks = {}): number[] {
  const out: number[] = [];
  if (!root) { hooks.onResult?.(out); return out; }
  const q: TreeNode[] = [root];
  while (q.length) {
    const sz = q.length;
    for (let i = 0; i < sz; i++) {
      const node = q.shift()!;
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
      if (i === 0) { out.push(node.value); hooks.onLevel?.(out.length - 1, node.value); }
    }
  }
  hooks.onResult?.(out);
  return out;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, leftSideView } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, null, null, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '左视图', en: 'Left side view' }).commit();
  const out = leftSideView(root, { onLevel: (d, v) => rec.begin({ zh: '第 ' + d + ' 层最左 = ' + v, en: 'level ' + d + ' leftmost = ' + v }).setAux([{ label: 'left', value: String(v), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '左视图：' + out.join(' → '), en: 'View: ' + out.join(' → ') }).setBars(out.map((v) => ({ value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, leftSideView } from '../../src/algorithms/tree/tree-left-view-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-left-view-2/trace.ts';
test('leftSideView 正确', () => {
  assert.deepEqual(leftSideView(buildTree([1,2,3,4,null,null,7])), [1,2,4]);
  assert.deepEqual(leftSideView(null), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 24. tree-flatten-2  —— 二叉树展开为链表（前序，原地右链）
ALGS.push({
  id: 'tree-flatten-2',
  m: ['展开为链表v2', 'Flatten to Linked List v2', '把二叉树按前序展开成只有右孩子的链表。', 'Flatten a tree into a right-skewed list (preorder).',
    '递归：展开左子、展开右子，把左子插到当前与右子之间。', 'Flatten left/right then splice. O(n).', 'O(n)', 'O(h)', ['tree', 'flatten']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface FlattenHooks { onSplice?: (parent: number, child: number | null) => void; onResult?: () => void; }
export function flatten(root: TreeNode | null, hooks: FlattenHooks = {}): void {
  const go = (n: TreeNode | null): TreeNode | null => {
    if (!n) return null;
    const leftTail = go(n.left);
    const rightTail = go(n.right);
    if (n.left) {
      leftTail!.right = n.right;
      n.right = n.left;
      hooks.onSplice?.(n.value, n.left.value);
      n.left = null;
    }
    return rightTail ?? leftTail ?? n;
  };
  go(root);
  hooks.onResult?.();
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, flatten } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 5, 3, 4, null, 6];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '展开为链表', en: 'Flatten' }).commit();
  flatten(root, { onSplice: (p, c) => rec.begin({ zh: p + ' 接右 ' + (c ?? 'null'), en: p + ' → right ' + (c ?? 'null') }).setAux([{ label: 'splice', value: String(c), role: 'pivot' as BarRole }]).commit() });
  const arr: number[] = []; let cur = root;
  while (cur) { arr.push(cur.value); cur = cur.right; }
  rec.begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') }).setBars(arr.map((v) => ({ value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, flatten } from '../../src/algorithms/tree/tree-flatten-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-flatten-2/trace.ts';
test('flatten 正确', () => {
  const root = buildTree([1,2,5,3,4,null,6]);
  flatten(root);
  const arr: number[] = []; let cur = root;
  while (cur) { arr.push(cur.value); cur = cur.right; }
  assert.deepEqual(arr, [1,2,3,4,5,6]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 25. tree-level-zigzag-2  —— 锯齿层序
ALGS.push({
  id: 'tree-level-zigzag-2',
  m: ['锯齿层序v2', 'Zigzag Level Order v2', '层序遍历，奇数层反向。', 'Level order with odd levels reversed.',
    '层序收集，每隔一层 reverse。', 'BFS, reverse odd levels. O(n).', 'O(n)', 'O(w)', ['tree', 'zigzag', 'bfs']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface ZigHooks { onLevel?: (depth: number, vals: number[]) => void; onResult?: (out: number[][]) => void; }
export function zigzagLevelOrder(root: TreeNode | null, hooks: ZigHooks = {}): number[][] {
  const out: number[][] = [];
  if (!root) { hooks.onResult?.(out); return out; }
  const q: TreeNode[] = [root];
  while (q.length) {
    const sz = q.length;
    const vals: number[] = [];
    for (let i = 0; i < sz; i++) { const node = q.shift()!; vals.push(node.value); if (node.left) q.push(node.left); if (node.right) q.push(node.right); }
    if (out.length % 2 === 1) vals.reverse();
    hooks.onLevel?.(out.length, vals);
    out.push(vals);
  }
  hooks.onResult?.(out);
  return out;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, zigzagLevelOrder } from './impl.ts';
export const DEFAULT_INPUT = [3, 9, 20, null, null, 15, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '锯齿层序', en: 'Zigzag level order' }).commit();
  const levels = zigzagLevelOrder(root, { onLevel: (d, vals) => rec.begin({ zh: '第 ' + d + ' 层：' + vals.join(','), en: 'level ' + d + ': ' + vals.join(',') }).setBars(vals.map((v) => ({ value: v, role: 'pivot' as BarRole }))).commit() });
  rec.begin({ zh: '完成，共 ' + levels.length + ' 层', en: levels.length + ' levels' }).setBars(levels.flat().map((v) => ({ value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, zigzagLevelOrder } from '../../src/algorithms/tree/tree-level-zigzag-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-level-zigzag-2/trace.ts';
test('zigzagLevelOrder 正确', () => {
  assert.deepEqual(zigzagLevelOrder(buildTree([3,9,20,null,null,15,7])), [[3],[20,9],[15,7]]);
  assert.deepEqual(zigzagLevelOrder(null), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 26. tree-leaf-similar-2  —— 叶子序列相同
ALGS.push({
  id: 'tree-leaf-similar-2',
  m: ['叶子序列相似v2', 'Leaf-Similar v2', '判断两棵树叶子序列（左到右）是否相同。', 'Whether two trees share the same leaf sequence.',
    '分别 DFS 收集叶子，比较。', 'Collect leaves of each, compare. O(n+m).', 'O(n+m)', 'O(h)', ['tree', 'leaf', 'compare']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface LeafSimHooks { onLeaf?: (v: number) => void; onResult?: (same: boolean) => void; }
function leaves(root: TreeNode | null, hooks: LeafSimHooks): number[] {
  const out: number[] = [];
  const go = (n: TreeNode | null) => { if (!n) return; if (!n.left && !n.right) { out.push(n.value); hooks.onLeaf?.(n.value); } go(n.left); go(n.right); };
  go(root);
  return out;
}
export function leafSimilar(a: TreeNode | null, b: TreeNode | null, hooks: LeafSimHooks = {}): boolean {
  const la = leaves(a, hooks), lb = leaves(b, hooks);
  const r = la.length === lb.length && la.every((v, i) => v === lb[i]);
  hooks.onResult?.(r);
  return r;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, leafSimilar } from './impl.ts';
export const DEFAULT_INPUT = { a: [3,5,1,6,2,9,8,null,null,7,4], b: [3,5,1,6,7,4,2,null,null,null,null,null,9,8] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildTree(input.a), b = buildTree(input.b);
  rec.begin({ zh: '叶子序列相似', en: 'Leaf similar' }).commit();
  const r = leafSimilar(a, b, { onLeaf: (v) => rec.begin({ zh: '叶子 ' + v, en: 'leaf ' + v }).setAux([{ label: 'leaf', value: String(v), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '相似？' + r, en: 'similar? ' + r }).setAux([{ label: 'similar', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, leafSimilar } from '../../src/algorithms/tree/tree-leaf-similar-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-leaf-similar-2/trace.ts';
test('leafSimilar 正确', () => {
  assert.equal(leafSimilar(buildTree([3,5,1,6,2,9,8,null,null,7,4]), buildTree([3,5,1,6,7,4,2,null,null,null,null,null,9,8])), true);
  assert.equal(leafSimilar(buildTree([1,2,3]), buildTree([1,3,2])), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 27. tree-build-preorder-2  —— 由前序+中序重建
ALGS.push({
  id: 'tree-build-preorder-2',
  m: ['前序+中序重建v2', 'Build Tree from Pre+In v2', '由前序与中序遍历重建二叉树。', 'Rebuild a binary tree from preorder and inorder.',
    '前序首元素是根，在中序里定位根，左右子树递归。', 'Root = pre[0]; split in-order around it. O(n).', 'O(n)', 'O(n)', ['tree', 'construct', 'preorder']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface BuildHooks { onCreate?: (v: number) => void; onResult?: (root: TreeNode | null) => void; }
export function buildFromPreIn(preorder: number[], inorder: number[], hooks: BuildHooks = {}): TreeNode | null {
  const idx = new Map<number, number>();
  inorder.forEach((v, i) => idx.set(v, i));
  let pi = 0;
  const go = (lo: number, hi: number): TreeNode | null => {
    if (lo > hi) return null;
    const v = preorder[pi++]!;
    hooks.onCreate?.(v);
    const node = new TreeNode(v);
    const m = idx.get(v)!;
    node.left = go(lo, m - 1);
    node.right = go(m + 1, hi);
    return node;
  };
  const r = go(0, inorder.length - 1);
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildFromPreIn } from './impl.ts';
export const DEFAULT_INPUT = { pre: [3, 9, 20, 15, 7], in: [9, 3, 15, 20, 7] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '前序+中序重建', en: 'Build from pre+in' }).commit();
  const root = buildFromPreIn(input.pre, input.in, { onCreate: (v) => rec.begin({ zh: '创建节点 ' + v, en: 'create ' + v }).setAux([{ label: 'create', value: String(v), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '根 = ' + (root?.value ?? null), en: 'root = ' + (root?.value ?? null) }).setAux([{ label: 'root', value: String(root?.value ?? null), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildFromPreIn } from '../../src/algorithms/tree/tree-build-preorder-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-build-preorder-2/trace.ts';
const pre = (r: any): number[] => !r ? [] : [r.value, ...pre(r.left), ...pre(r.right)];
test('buildFromPreIn 正确', () => {
  const r = buildFromPreIn([3,9,20,15,7], [9,3,15,20,7]);
  assert.deepEqual(pre(r), [3,9,20,15,7]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 28. tree-build-inpost-2  —— 由中序+后序重建
ALGS.push({
  id: 'tree-build-inpost-2',
  m: ['中序+后序重建v2', 'Build Tree from In+Post v2', '由中序与后序遍历重建二叉树。', 'Rebuild a binary tree from inorder and postorder.',
    '后序末元素是根。', 'Root = post[last]; split in-order. O(n).', 'O(n)', 'O(n)', ['tree', 'construct', 'postorder']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface BuildHooks { onCreate?: (v: number) => void; onResult?: (root: TreeNode | null) => void; }
export function buildFromInPost(inorder: number[], postorder: number[], hooks: BuildHooks = {}): TreeNode | null {
  const idx = new Map<number, number>();
  inorder.forEach((v, i) => idx.set(v, i));
  let pi = postorder.length - 1;
  const go = (lo: number, hi: number): TreeNode | null => {
    if (lo > hi) return null;
    const v = postorder[pi--]!;
    hooks.onCreate?.(v);
    const node = new TreeNode(v);
    const m = idx.get(v)!;
    node.right = go(m + 1, hi);
    node.left = go(lo, m - 1);
    return node;
  };
  const r = go(0, inorder.length - 1);
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildFromInPost } from './impl.ts';
export const DEFAULT_INPUT = { in: [9, 3, 15, 20, 7], post: [9, 15, 7, 20, 3] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '中序+后序重建', en: 'Build from in+post' }).commit();
  const root = buildFromInPost(input.in, input.post, { onCreate: (v) => rec.begin({ zh: '创建节点 ' + v, en: 'create ' + v }).setAux([{ label: 'create', value: String(v), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '根 = ' + (root?.value ?? null), en: 'root = ' + (root?.value ?? null) }).setAux([{ label: 'root', value: String(root?.value ?? null), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildFromInPost } from '../../src/algorithms/tree/tree-build-inpost-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-build-inpost-2/trace.ts';
const post = (r: any): number[] => !r ? [] : [...post(r.left), ...post(r.right), r.value];
test('buildFromInPost 正确', () => {
  const r = buildFromInPost([9,3,15,20,7], [9,15,7,20,3]);
  assert.deepEqual(post(r), [9,15,7,20,3]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 29. tree-merge-2  —— 合并两棵 BST（叠加同位置值）
ALGS.push({
  id: 'tree-merge-2',
  m: ['合并二叉树v2', 'Merge Two Binary Trees v2', '把两棵二叉树同位置节点值相加合并。', 'Overlay two binary trees, summing overlapping nodes.',
    '同步递归：都存在则相加，否则取存在的一边。', 'Recurse in parallel, sum when both present. O(n).', 'O(n)', 'O(h)', ['tree', 'merge']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface MergeHooks { onMerge?: (a: number | null, b: number | null, sum: number) => void; onResult?: (root: TreeNode | null) => void; }
export function mergeTrees(a: TreeNode | null, b: TreeNode | null, hooks: MergeHooks = {}): TreeNode | null {
  if (!a) return b;
  if (!b) return a;
  const sum = a.value + b.value;
  hooks.onMerge?.(a.value, b.value, sum);
  const node = new TreeNode(sum);
  node.left = mergeTrees(a.left, b.left, hooks);
  node.right = mergeTrees(a.right, b.right, hooks);
  hooks.onResult?.(node);
  return node;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, mergeTrees } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 3, 2, 5], b: [2, 1, 3, null, 4, null, 7] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildTree(input.a), b = buildTree(input.b);
  rec.begin({ zh: '合并二叉树', en: 'Merge trees' }).commit();
  const r = mergeTrees(a, b, { onMerge: (va, vb, sum) => rec.begin({ zh: va + ' + ' + vb + ' = ' + sum, en: va + ' + ' + vb + ' = ' + sum }).setAux([{ label: 'sum', value: String(sum), role: 'pivot' as BarRole }]).commit() });
  const arr: number[] = []; const q: any[] = r ? [r] : [];
  while (q.length) { const n = q.shift(); arr.push(n.value); if (n.left) q.push(n.left); if (n.right) q.push(n.right); }
  rec.begin({ zh: '结果层序：' + arr.join(','), en: 'BFS: ' + arr.join(',') }).setBars(arr.map((v) => ({ value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, mergeTrees } from '../../src/algorithms/tree/tree-merge-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-merge-2/trace.ts';
const bfs = (r: any): number[] => { if (!r) return []; const out: number[] = []; const q = [r]; while (q.length) { const n = q.shift()!; out.push(n.value); if (n.left) q.push(n.left); if (n.right) q.push(n.right); } return out; };
test('mergeTrees 正确', () => {
  assert.deepEqual(bfs(mergeTrees(buildTree([1,3,2,5]), buildTree([2,1,3,null,4,null,7]))), [3,4,5,5,4,null,7]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 30. tree-tilt-2  —— 树的坡度
ALGS.push({
  id: 'tree-tilt-2',
  m: ['树的坡度v2', 'Binary Tree Tilt v2', '每个节点坡度=左右子树和之差的绝对值，求总坡度。', 'Tilt = |sum(left) - sum(right)| per node; sum all tilts.',
    '后序递归同时返回子树和与累计坡度。', 'Post-order; return subtree sum, accumulate tilt. O(n).', 'O(n)', 'O(h)', ['tree', 'tilt', 'postorder']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface TiltHooks { onNode?: (v: number, tilt: number) => void; onResult?: (total: number) => void; }
export function findTilt(root: TreeNode | null, hooks: TiltHooks = {}): number {
  let total = 0;
  const sum = (n: TreeNode | null): number => {
    if (!n) return 0;
    const l = sum(n.left), r = sum(n.right);
    const tilt = Math.abs(l - r);
    total += tilt;
    hooks.onNode?.(n.value, tilt);
    return n.value + l + r;
  };
  sum(root);
  hooks.onResult?.(total);
  return total;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, findTilt } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '求坡度', en: 'Find tilt' }).commit();
  const t = findTilt(root, { onNode: (v, tilt) => rec.begin({ zh: '节点 ' + v + ' 坡度 ' + tilt, en: 'node ' + v + ' tilt ' + tilt }).setAux([{ label: 'tilt', value: String(tilt), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '总坡度 = ' + t, en: 'total tilt = ' + t }).setAux([{ label: 'total', value: String(t), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, findTilt } from '../../src/algorithms/tree/tree-tilt-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-tilt-2/trace.ts';
test('findTilt 正确', () => {
  assert.equal(findTilt(buildTree([1,2,3])), 1);
  assert.equal(findTilt(buildTree([4,2,9,3,5,null,7])), 15);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 31. tree-cousins-2  —— 判断是否为兄弟节点
ALGS.push({
  id: 'tree-cousins-2',
  m: ['兄弟判断v2', 'Are Cousins v2', '判断两节点是否同层但不同父（cousins）。', 'Check if two nodes are same depth but different parent.',
    'BFS 记录每个节点的深度与父节点。', 'BFS tracking depth and parent. O(n).', 'O(n)', 'O(w)', ['tree', 'cousins', 'bfs']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface CousinHooks { onFind?: (v: number, depth: number) => void; onResult?: (c: boolean) => void; }
export function areCousins(root: TreeNode | null, x: number, y: number, hooks: CousinHooks = {}): boolean {
  if (!root) return false;
  const q: Array<{ node: TreeNode; parent: number | null }> = [{ node: root, parent: null }];
  let depth = 0;
  let xInfo: { depth: number; parent: number | null } | null = null;
  let yInfo: { depth: number; parent: number | null } | null = null;
  while (q.length && (!xInfo || !yInfo)) {
    const sz = q.length;
    for (let i = 0; i < sz; i++) {
      const { node, parent } = q.shift()!;
      if (node.value === x) { xInfo = { depth, parent }; hooks.onFind?.(x, depth); }
      if (node.value === y) { yInfo = { depth, parent }; hooks.onFind?.(y, depth); }
      if (node.left) q.push({ node: node.left, parent: node.value });
      if (node.right) q.push({ node: node.right, parent: node.value });
    }
    depth++;
  }
  const r = !!xInfo && !!yInfo && xInfo.depth === yInfo.depth && xInfo.parent !== yInfo.parent;
  return r;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, areCousins } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, null, null, 5], x: 4, y: 5 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input.arr);
  rec.begin({ zh: '兄弟判断 ' + input.x + ' 与 ' + input.y, en: 'Cousins? ' + input.x + ' & ' + input.y }).commit();
  const r = areCousins(root, input.x, input.y, { onFind: (v, d) => rec.begin({ zh: '找到 ' + v + ' 深度 ' + d, en: 'found ' + v + ' depth ' + d }).setAux([{ label: 'depth', value: String(d), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '兄弟？' + r, en: 'cousins? ' + r }).setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, areCousins } from '../../src/algorithms/tree/tree-cousins-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-cousins-2/trace.ts';
test('areCousins 正确', () => {
  assert.equal(areCousins(buildTree([1,2,3,4]), 4, 3), false); // 同父
  assert.equal(areCousins(buildTree([1,2,3,null,4,null,5]), 4, 5), true);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 32. tree-balance-check-2  —— 判断完全二叉树
ALGS.push({
  id: 'tree-balance-check-2',
  m: ['完全二叉树判断', 'Is Complete Tree', '判断二叉树是否为完全二叉树。', 'Check if a binary tree is complete.',
    'BFS：遇到空节点后不应再有非空节点。', 'BFS; once null seen, no non-null allowed after. O(n).', 'O(n)', 'O(w)', ['tree', 'complete', 'bfs']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface CompleteHooks { onVisit?: (v: number | null) => void; onResult?: (c: boolean) => void; }
export function isCompleteTree(root: TreeNode | null, hooks: CompleteHooks = {}): boolean {
  if (!root) return true;
  const q: Array<TreeNode | null> = [root];
  let seenNull = false;
  while (q.length) {
    const node = q.shift()!;
    hooks.onVisit?.(node?.value ?? null);
    if (!node) { seenNull = true; continue; }
    if (seenNull) { hooks.onResult?.(false); return false; }
    q.push(node.left);
    q.push(node.right);
  }
  hooks.onResult?.(true);
  return true;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, isCompleteTree } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '完全二叉树判断', en: 'Is complete tree' }).commit();
  const r = isCompleteTree(root, { onVisit: (v) => rec.begin({ zh: '访问 ' + (v ?? 'null'), en: 'visit ' + (v ?? 'null') }).setAux([{ label: 'node', value: String(v), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '完全？' + r, en: 'complete? ' + r }).setAux([{ label: 'complete', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, isCompleteTree } from '../../src/algorithms/tree/tree-balance-check-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-balance-check-2/trace.ts';
test('isCompleteTree 正确', () => {
  assert.equal(isCompleteTree(buildTree([1,2,3,4,5,6])), true);
  assert.equal(isCompleteTree(buildTree([1,2,3,4,5,null,7])), false);
  assert.equal(isCompleteTree(null), true);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 33. tree-sum-root-leaf-2  —— 根到叶数字之和
ALGS.push({
  id: 'tree-sum-root-leaf-2',
  m: ['根到叶数字和v2', 'Sum Root to Leaf Numbers v2', '每条根到叶路径构成一个数字（如 1→2 = 12），求所有数字之和。', 'Each root-to-leaf path forms a number (e.g. 1->2 = 12); sum them.',
    'DFS 维护当前累积值 cur = cur*10 + val，到叶累加。', 'DFS: cur = cur*10 + val; add at leaf. O(n).', 'O(n)', 'O(h)', ['tree', 'numbers', 'dfs']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface SumNumHooks { onLeaf?: (num: number) => void; onResult?: (sum: number) => void; }
export function sumNumbers(root: TreeNode | null, hooks: SumNumHooks = {}): number {
  let total = 0;
  const go = (n: TreeNode | null, cur: number) => {
    if (!n) return;
    cur = cur * 10 + n.value;
    if (!n.left && !n.right) { hooks.onLeaf?.(cur); total += cur; return; }
    go(n.left, cur); go(n.right, cur);
  };
  go(root, 0);
  hooks.onResult?.(total);
  return total;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, sumNumbers } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '根到叶数字和', en: 'Sum root-leaf numbers' }).commit();
  const s = sumNumbers(root, { onLeaf: (num) => rec.begin({ zh: '叶数字 ' + num, en: 'leaf num ' + num }).setAux([{ label: 'num', value: String(num), role: 'final' as BarRole }]).commit() });
  rec.begin({ zh: '总和 = ' + s, en: 'sum = ' + s }).setAux([{ label: 'sum', value: String(s), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, sumNumbers } from '../../src/algorithms/tree/tree-sum-root-leaf-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-sum-root-leaf-2/trace.ts';
test('sumNumbers 正确', () => {
  assert.equal(sumNumbers(buildTree([1,2,3])), 25);
  assert.equal(sumNumbers(buildTree([4,9,0,5,1])), 1026);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 34. tree-serialize-2  —— 序列化（前序+null 标记）
ALGS.push({
  id: 'tree-serialize-2',
  m: ['序列化v2', 'Serialize Tree v2', '把二叉树序列化为字符串（前序 + null 标记）。', 'Serialize a tree to a string (preorder + null markers).',
    '前序遍历，空节点记 null，逗号分隔。', 'Preorder with null sentinels. O(n).', 'O(n)', 'O(h)', ['tree', 'serialize']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface SerHooks { onVisit?: (v: number | null) => void; onResult?: (s: string) => void; }
export function serialize(root: TreeNode | null, hooks: SerHooks = {}): string {
  const out: string[] = [];
  const go = (n: TreeNode | null) => {
    if (!n) { out.push('null'); hooks.onVisit?.(null); return; }
    out.push(String(n.value)); hooks.onVisit?.(n.value);
    go(n.left); go(n.right);
  };
  go(root);
  const s = out.join(',');
  hooks.onResult?.(s);
  return s;
}
export function deserialize(s: string): TreeNode | null {
  const arr = s.split(',');
  let i = 0;
  const go = (): TreeNode | null => {
    const v = arr[i++];
    if (v === 'null' || v === undefined) return null;
    return new TreeNode(Number(v), go(), go());
  };
  return go();
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, serialize } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, null, null, 4, 5];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '序列化', en: 'Serialize' }).commit();
  const s = serialize(root, { onVisit: (v) => rec.begin({ zh: '写 ' + (v ?? 'null'), en: 'write ' + (v ?? 'null') }).setAux([{ label: 'token', value: String(v), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '结果：' + s, en: 'Result: ' + s }).setAux([{ label: 'string', value: s, role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, serialize, deserialize } from '../../src/algorithms/tree/tree-serialize-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-serialize-2/trace.ts';
const pre = (r: any): number[] => !r ? [] : [r.value, ...pre(r.left), ...pre(r.right)];
test('serialize/deserialize 互逆', () => {
  const root = buildTree([1,2,3,null,null,4,5]);
  assert.deepEqual(pre(deserialize(serialize(root))), pre(root));
  assert.equal(serialize(null), 'null');
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 35. tree-path-sum-all-2  —— 所有满足和的路径
ALGS.push({
  id: 'tree-path-sum-all-2',
  m: ['路径和2v2', 'Path Sum II v2', '收集所有节点值之和等于 target 的根到叶路径。', 'Collect all root-to-leaf paths summing to target.',
    'DFS 维护当前路径，到叶判断和。', 'DFS with current path; check sum at leaf. O(n^2).', 'O(n^2)', 'O(h)', ['tree', 'path-sum', 'dfs']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface PathAllHooks { onPath?: (path: number[]) => void; onResult?: (paths: number[][]) => void; }
export function pathSumAll(root: TreeNode | null, target: number, hooks: PathAllHooks = {}): number[][] {
  const out: number[][] = [], cur: number[] = [];
  const go = (n: TreeNode | null, sum: number) => {
    if (!n) return;
    cur.push(n.value);
    if (!n.left && !n.right && sum + n.value === target) { out.push([...cur]); hooks.onPath?.([...cur]); }
    else { go(n.left, sum + n.value); go(n.right, sum + n.value); }
    cur.pop();
  };
  go(root, 0);
  hooks.onResult?.(out);
  return out;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, pathSumAll } from './impl.ts';
export const DEFAULT_INPUT = { arr: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], target: 22 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input.arr);
  rec.begin({ zh: '路径和 = ' + input.target, en: 'Path sum = ' + input.target }).commit();
  const paths = pathSumAll(root, input.target, { onPath: (p) => rec.begin({ zh: p.join('→') + ' = ' + input.target, en: p.join('→') }).setBars(p.map((v) => ({ value: v, role: 'final' as BarRole }))).commit() });
  rec.begin({ zh: '共 ' + paths.length + ' 条', en: paths.length + ' paths' }).setAux([{ label: 'count', value: String(paths.length), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, pathSumAll } from '../../src/algorithms/tree/tree-path-sum-all-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-path-sum-all-2/trace.ts';
test('pathSumAll 正确', () => {
  assert.deepEqual(pathSumAll(buildTree([5,4,8,11,null,13,4,7,2,null,null,5,1]), 22), [[5,4,11,2],[5,8,4,5]]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 36. tree-count-unival-2  —— 统计同值子树
ALGS.push({
  id: 'tree-count-unival-2',
  m: ['同值子树v2', 'Count Unival Subtrees v2', '统计二叉树中所有节点值相同的子树数量。', 'Count subtrees where all nodes share the same value.',
    '后序：左右都是 unival 且等于根时，本子树也是 unival。', 'Post-order; unival if children match root. O(n).', 'O(n)', 'O(h)', ['tree', 'unival', 'postorder']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface UnivalHooks { onUnival?: (v: number) => void; onResult?: (n: number) => void; }
export function countUnival(root: TreeNode | null, hooks: UnivalHooks = {}): number {
  let cnt = 0;
  const go = (n: TreeNode | null): boolean => {
    if (!n) return true;
    const l = go(n.left), r = go(n.right);
    if (l && r && (!n.left || n.left.value === n.value) && (!n.right || n.right.value === n.value)) {
      cnt++; hooks.onUnival?.(n.value); return true;
    }
    return false;
  };
  go(root);
  hooks.onResult?.(cnt);
  return cnt;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, countUnival } from './impl.ts';
export const DEFAULT_INPUT = [5, 1, 5, 5, 5, null, 5];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '同值子树', en: 'Unival subtrees' }).commit();
  const n = countUnival(root, { onUnival: (v) => rec.begin({ zh: '同值子树根 ' + v, en: 'unival root ' + v }).setAux([{ label: 'root', value: String(v), role: 'final' as BarRole }]).commit() });
  rec.begin({ zh: '共 ' + n + ' 个', en: n + ' unival' }).setAux([{ label: 'count', value: String(n), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, countUnival } from '../../src/algorithms/tree/tree-count-unival-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-count-unival-2/trace.ts';
test('countUnival 正确', () => {
  assert.equal(countUnival(buildTree([5,1,5,5,5,null,5])), 4);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 37. tree-subtree-check-2  —— 子树判断
ALGS.push({
  id: 'tree-subtree-check-2',
  m: ['子树判断v2', 'Is Subtree v2', '判断一棵树是否是另一棵树的子树（结构与值完全相同）。', 'Whether one tree is a subtree of another (identical structure).',
    '对每个节点尝试匹配。', 'Try matching at each node. O(n*m).', 'O(n*m)', 'O(h)', ['tree', 'subtree', 'match']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface SubHooks { onTry?: (v: number) => void; onResult?: (b: boolean) => void; }
function same(a: TreeNode | null, b: TreeNode | null): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.value === b.value && same(a.left, b.left) && same(a.right, b.right);
}
export function isSubtree(root: TreeNode | null, sub: TreeNode | null, hooks: SubHooks = {}): boolean {
  if (!sub) { hooks.onResult?.(true); return true; }
  if (!root) { hooks.onResult?.(false); return false; }
  if (same(root, sub)) { hooks.onTry?.(root.value); hooks.onResult?.(true); return true; }
  return isSubtree(root.left, sub, hooks) || isSubtree(root.right, sub, hooks);
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, isSubtree } from './impl.ts';
export const DEFAULT_INPUT = { root: [3, 4, 5, 1, 2], sub: [4, 1, 2] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input.root), sub = buildTree(input.sub);
  rec.begin({ zh: '子树判断', en: 'Is subtree' }).commit();
  const r = isSubtree(root, sub, { onTry: (v) => rec.begin({ zh: '在 ' + v + ' 处匹配', en: 'match at ' + v }).setAux([{ label: 'match', value: String(v), role: 'final' as BarRole }]).commit() });
  rec.begin({ zh: '是子树？' + r, en: 'subtree? ' + r }).setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, isSubtree } from '../../src/algorithms/tree/tree-subtree-check-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-subtree-check-2/trace.ts';
test('isSubtree 正确', () => {
  assert.equal(isSubtree(buildTree([3,4,5,1,2]), buildTree([4,1,2])), true);
  assert.equal(isSubtree(buildTree([3,4,5,1,2,null,null,null,null,0]), buildTree([4,1,2])), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 38. tree-longest-univalue-2  —— 最长同值路径
ALGS.push({
  id: 'tree-longest-univalue-2',
  m: ['最长同值路径v2', 'Longest Univalue Path v2', '求二叉树中节点值相同的最长路径边数。', 'Longest path (edges) where all nodes share the same value.',
    '后序：左右单臂长度，若与父同值则 +1；更新 diameter。', 'Post-order; arm length +1 if matches parent. O(n).', 'O(n)', 'O(h)', ['tree', 'univalue', 'path']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface LongUniHooks { onNode?: (v: number, path: number) => void; onResult?: (d: number) => void; }
export function longestUnivaluePath(root: TreeNode | null, hooks: LongUniHooks = {}): number {
  let best = 0;
  const go = (n: TreeNode | null): number => {
    if (!n) return 0;
    const l = go(n.left), r = go(n.right);
    let la = 0, ra = 0;
    if (n.left && n.left.value === n.value) la = l + 1;
    if (n.right && n.right.value === n.value) ra = r + 1;
    best = Math.max(best, la + ra);
    hooks.onNode?.(n.value, la + ra);
    return Math.max(la, ra);
  };
  go(root);
  hooks.onResult?.(best);
  return best;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, longestUnivaluePath } from './impl.ts';
export const DEFAULT_INPUT = [5, 4, 5, 1, 1, null, 5];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '最长同值路径', en: 'Longest univalue path' }).commit();
  const d = longestUnivaluePath(root, { onNode: (v, path) => rec.begin({ zh: '节点 ' + v + ' 路径 ' + path, en: 'node ' + v + ' path ' + path }).setAux([{ label: 'path', value: String(path), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '最长 = ' + d, en: 'longest = ' + d }).setAux([{ label: 'longest', value: String(d), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, longestUnivaluePath } from '../../src/algorithms/tree/tree-longest-univalue-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-longest-univalue-2/trace.ts';
test('longestUnivaluePath 正确', () => {
  assert.equal(longestUnivaluePath(buildTree([5,4,5,1,1,null,5])), 2);
  assert.equal(longestUnivaluePath(buildTree([1,4,5,4,4,null,5])), 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 39. tree-second-min-2  —— 二叉树第二小值
ALGS.push({
  id: 'tree-second-min-2',
  m: ['第二小值v2', 'Second Minimum Node v2', '在特殊二叉树（每个节点值=子节点最小值）中找严格第二小值。', 'Find the strictly second minimum value in such a tree.',
    '递归：根值即最小；找比根大的最小值。', 'Recurse; find smallest value > root. O(n).', 'O(n)', 'O(h)', ['tree', 'second-min']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface SecMinHooks { onCand?: (v: number) => void; onResult?: (v: number) => void; }
export function findSecondMinimumValue(root: TreeNode | null, hooks: SecMinHooks = {}): number {
  if (!root) return -1;
  const min = root.value;
  let second = Infinity;
  const go = (n: TreeNode | null) => {
    if (!n) return;
    if (n.value > min && n.value < second) { second = n.value; hooks.onCand?.(n.value); }
    if (n.value === min) { go(n.left); go(n.right); }
  };
  go(root);
  const r = second === Infinity ? -1 : second;
  hooks.onResult?.(r);
  return r;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, findSecondMinimumValue } from './impl.ts';
export const DEFAULT_INPUT = [2, 2, 5, null, null, 5, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '第二小值', en: 'Second minimum' }).commit();
  const v = findSecondMinimumValue(root, { onCand: (val) => rec.begin({ zh: '候选 ' + val, en: 'candidate ' + val }).setAux([{ label: 'cand', value: String(val), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '第二小 = ' + v, en: 'second min = ' + v }).setAux([{ label: 'second', value: String(v), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, findSecondMinimumValue } from '../../src/algorithms/tree/tree-second-min-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-second-min-2/trace.ts';
test('findSecondMinimumValue 正确', () => {
  assert.equal(findSecondMinimumValue(buildTree([2,2,5,null,null,5,7])), 5);
  assert.equal(findSecondMinimumValue(buildTree([2,2,2])), -1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 40. tree-max-path-sum-2  —— 最大路径和
ALGS.push({
  id: 'tree-max-path-sum-2',
  m: ['最大路径和v2', 'Max Path Sum v2', '求二叉树中任意节点到任意节点的最大路径和。', 'Maximum path sum between any two nodes.',
    '后序：返回单臂最大和，更新 max(left+right+node)。', 'Post-order; arm gain, update best. O(n).', 'O(n)', 'O(h)', ['tree', 'path-sum', 'max']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface MaxSumHooks { onNode?: (v: number, sum: number) => void; onResult?: (m: number) => void; }
export function maxPathSum(root: TreeNode | null, hooks: MaxSumHooks = {}): number {
  let best = -Infinity;
  const go = (n: TreeNode | null): number => {
    if (!n) return 0;
    const l = Math.max(0, go(n.left));
    const r = Math.max(0, go(n.right));
    best = Math.max(best, n.value + l + r);
    hooks.onNode?.(n.value, n.value + l + r);
    return n.value + Math.max(l, r);
  };
  go(root);
  hooks.onResult?.(best);
  return best;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, maxPathSum } from './impl.ts';
export const DEFAULT_INPUT = [-10, 9, 20, null, null, 15, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '最大路径和', en: 'Max path sum' }).commit();
  const m = maxPathSum(root, { onNode: (v, sum) => rec.begin({ zh: '节点 ' + v + ' 路径和 ' + sum, en: 'node ' + v + ' sum ' + sum }).setAux([{ label: 'sum', value: String(sum), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '最大 = ' + m, en: 'max = ' + m }).setAux([{ label: 'max', value: String(m), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, maxPathSum } from '../../src/algorithms/tree/tree-max-path-sum-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-max-path-sum-2/trace.ts';
test('maxPathSum 正确', () => {
  assert.equal(maxPathSum(buildTree([-10,9,20,null,null,15,7])), 42);
  assert.equal(maxPathSum(buildTree([1,2,3])), 6);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 41. tree-bst-balance-2  —— BST 平衡判断（高度因子）
ALGS.push({
  id: 'tree-bst-balance-2',
  m: ['BST平衡因子', 'BST Balance Factor', '计算每个节点平衡因子（左高-右高）。', 'Compute balance factor (left height - right height) per node.',
    '后序返回高度，因子 = 左 - 右。', 'Post-order height; factor = L - R. O(n).', 'O(n)', 'O(h)', ['tree', 'balance-factor']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface BfHooks { onNode?: (v: number, bf: number) => void; onResult?: (factors: Array<{ v: number; bf: number }>) => void; }
export function balanceFactors(root: TreeNode | null, hooks: BfHooks = {}): Array<{ v: number; bf: number }> {
  const out: Array<{ v: number; bf: number }> = [];
  const go = (n: TreeNode | null): number => {
    if (!n) return 0;
    const l = go(n.left), r = go(n.right);
    const bf = l - r;
    out.push({ v: n.value, bf });
    hooks.onNode?.(n.value, bf);
    return 1 + Math.max(l, r);
  };
  go(root);
  hooks.onResult?.(out);
  return out;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, balanceFactors } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '平衡因子', en: 'Balance factors' }).commit();
  const fs = balanceFactors(root, { onNode: (v, bf) => rec.begin({ zh: '节点 ' + v + ' bf=' + bf, en: 'node ' + v + ' bf=' + bf }).setAux([{ label: 'bf', value: String(bf), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '共 ' + fs.length + ' 个节点', en: fs.length + ' nodes' }).setBars(fs.map((f) => ({ value: f.bf, role: 'final' as BarRole, label: String(f.v) }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, balanceFactors } from '../../src/algorithms/tree/tree-bst-balance-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bst-balance-2/trace.ts';
test('balanceFactors 正确', () => {
  const fs = balanceFactors(buildTree([1,2,3,4]));
  const m = new Map(fs.map((f) => [f.v, f.bf]));
  assert.equal(m.get(4), 0);
  assert.equal(m.get(2), 1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 42. tree-bfs-path-2  —— BFS 找从根到目标的路径
ALGS.push({
  id: 'tree-bfs-path-2',
  m: ['BFS根到节点路径', 'Path from Root to Node', '给定目标值，找从根到该节点的路径。', 'Find the path from root to the node with a given value.',
    'DFS 记录路径，命中时返回。', 'DFS tracking path; return on hit. O(n).', 'O(n)', 'O(h)', ['tree', 'path', 'dfs']],
  impl: `export class TreeNode { constructor(public value: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {} }
export interface PathHooks { onVisit?: (v: number) => void; onResult?: (path: number[] | null) => void; }
export function pathToNode(root: TreeNode | null, target: number, hooks: PathHooks = {}): number[] | null {
  const cur: number[] = [];
  const go = (n: TreeNode | null): boolean => {
    if (!n) return false;
    cur.push(n.value); hooks.onVisit?.(n.value);
    if (n.value === target) return true;
    if (go(n.left) || go(n.right)) return true;
    cur.pop();
    return false;
  };
  const found = go(root);
  const r = found ? [...cur] : null;
  hooks.onResult?.(r);
  return r;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]!); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]!); q.push(node.right); }
    i++;
  }
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, pathToNode } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5], target: 5 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input.arr);
  rec.begin({ zh: '路径到 ' + input.target, en: 'Path to ' + input.target }).commit();
  const p = pathToNode(root, input.target, { onVisit: (v) => rec.begin({ zh: '访问 ' + v, en: 'visit ' + v }).setAux([{ label: 'node', value: String(v), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '路径：' + (p?.join(' → ') ?? '未找到'), en: 'Path: ' + (p?.join(' → ') ?? 'not found') }).setBars((p ?? []).map((v) => ({ value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, pathToNode } from '../../src/algorithms/tree/tree-bfs-path-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bfs-path-2/trace.ts';
test('pathToNode 正确', () => {
  assert.deepEqual(pathToNode(buildTree([1,2,3,4,5]), 5), [1,2,5]);
  assert.equal(pathToNode(buildTree([1,2,3]), 9), null);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 43. tree-range-sum-bst-2  —— BST 区间和
ALGS.push({
  id: 'tree-range-sum-bst-2',
  m: ['BST区间和v2', 'Range Sum of BST v2', '求 BST 中值在 [lo, hi] 范围内的节点之和。', 'Sum of BST nodes with values in [lo, hi].',
    '利用 BST 性质剪枝递归。', 'Prune using BST property. O(n) worst, O(h+k) typical.', 'O(n)', 'O(h)', ['tree', 'bst', 'range-sum']],
  impl: `${BST}
export interface RangeHooks { onVisit?: (v: number, inRange: boolean) => void; onResult?: (sum: number) => void; }
export function rangeSumBST(root: BstNode | null, lo: number, hi: number, hooks: RangeHooks = {}): number {
  const go = (n: BstNode | null): number => {
    if (!n) return 0;
    const inRange = n.value >= lo && n.value <= hi;
    hooks.onVisit?.(n.value, inRange);
    let s = 0;
    if (n.value > lo) s += go(n.left);
    if (inRange) s += n.value;
    if (n.value < hi) s += go(n.right);
    return s;
  };
  const s = go(root);
  hooks.onResult?.(s);
  return s;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, rangeSumBST } from './impl.ts';
export const DEFAULT_INPUT = { keys: [10, 5, 15, 3, 7, 13, 18, 1, null, 6], lo: 6, hi: 10 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildBST(input.keys);
  rec.begin({ zh: '区间和 [' + input.lo + ',' + input.hi + ']', en: 'Range sum [' + input.lo + ',' + input.hi + ']' }).commit();
  const s = rangeSumBST(root, input.lo, input.hi, { onVisit: (v, inRange) => rec.begin({ zh: v + (inRange ? ' 命中' : ''), en: v + (inRange ? ' in range' : '') }).setAux([{ label: 'inRange', value: String(inRange), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '和 = ' + s, en: 'sum = ' + s }).setAux([{ label: 'sum', value: String(s), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, rangeSumBST } from '../../src/algorithms/tree/tree-range-sum-bst-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-range-sum-bst-2/trace.ts';
test('rangeSumBST 正确', () => {
  assert.equal(rangeSumBST(buildBST([10,5,15,3,7,13,18,1,null,6]), 6, 10), 23);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 44. tree-kth-smallest-bst-2  —— BST 第k小
ALGS.push({
  id: 'tree-kth-smallest-bst-2',
  m: ['BST第k小v2', 'Kth Smallest in BST v2', '中序遍历找 BST 第 k 小元素。', 'Inorder traversal to find the kth smallest in a BST.',
    '中序遍历到第 k 个即停。', 'Inorder, stop at kth. O(h+k).', 'O(h+k)', 'O(h)', ['tree', 'bst', 'kth']],
  impl: `${BST}
export interface KthHooks { onVisit?: (v: number) => void; onResult?: (v: number | null) => void; }
export function kthSmallest(root: BstNode | null, k: number, hooks: KthHooks = {}): number | null {
  let result: number | null = null, count = 0;
  const go = (n: BstNode | null) => {
    if (!n || result !== null) return;
    go(n.left);
    if (result !== null) return;
    count++;
    hooks.onVisit?.(n.value);
    if (count === k) { result = n.value; return; }
    go(n.right);
  };
  go(root);
  hooks.onResult?.(result);
  return result;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, kthSmallest } from './impl.ts';
export const DEFAULT_INPUT = { keys: [5, 3, 6, 2, 4, null, null, 1], k: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildBST(input.keys);
  rec.begin({ zh: '第 ' + input.k + ' 小', en: 'kth smallest k=' + input.k }).commit();
  const v = kthSmallest(root, input.k, { onVisit: (val) => rec.begin({ zh: '中序 ' + val, en: 'inorder ' + val }).setAux([{ label: 'visit', value: String(val), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '结果 = ' + v, en: 'result = ' + v }).setAux([{ label: 'kth', value: String(v), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, kthSmallest } from '../../src/algorithms/tree/tree-kth-smallest-bst-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-kth-smallest-bst-2/trace.ts';
test('kthSmallest 正确', () => {
  assert.equal(kthSmallest(buildBST([5,3,6,2,4,null,null,1]), 3), 3);
  assert.equal(kthSmallest(buildBST([5,3,6,2,4,null,null,1]), 1), 1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 45. tree-bst-delete-2  —— BST 删除
ALGS.push({
  id: 'tree-bst-delete-2',
  m: ['BST删除v2', 'BST Delete v2', '从 BST 删除指定值节点，保持 BST 性质。', 'Delete a value from a BST, preserving the property.',
    '三种情况：无子直接删、单子顶替、双子用中序后继替换。', 'Three cases; two-child uses successor. O(h).', 'O(h)', 'O(h)', ['tree', 'bst', 'delete']],
  impl: `${BST}
export interface DelHooks { onCase?: (caseType: 'leaf' | 'one-child' | 'two-child') => void; onResult?: (root: BstNode | null) => void; }
function minNode(n: BstNode): BstNode { while (n.left) n = n.left; return n; }
export function bstDelete(root: BstNode | null, key: number, hooks: DelHooks = {}): BstNode | null {
  if (!root) return null;
  if (key < root.value) root.left = bstDelete(root.left, key, hooks);
  else if (key > root.value) root.right = bstDelete(root.right, key, hooks);
  else {
    if (!root.left && !root.right) { hooks.onCase?.('leaf'); return null; }
    if (!root.left) { hooks.onCase?.('one-child'); return root.right; }
    if (!root.right) { hooks.onCase?.('one-child'); return root.left; }
    hooks.onCase?.('two-child');
    const succ = minNode(root.right);
    root.value = succ.value;
    root.right = bstDelete(root.right, succ.value, hooks);
  }
  hooks.onResult?.(root);
  return root;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, bstDelete } from './impl.ts';
export const DEFAULT_INPUT = { keys: [5, 3, 6, 2, 4, 7], key: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildBST(input.keys);
  rec.begin({ zh: '删除 ' + input.key, en: 'Delete ' + input.key }).commit();
  bstDelete(root, input.key, { onCase: (c) => rec.begin({ zh: '情况：' + c, en: 'case: ' + c }).setAux([{ label: 'case', value: c, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).setAux([{ label: 'deleted', value: String(input.key), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBST, bstDelete } from '../../src/algorithms/tree/tree-bst-delete-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bst-delete-2/trace.ts';
const inorder = (r: any): number[] => !r ? [] : [...inorder(r.left), r.value, ...inorder(r.right)];
test('bstDelete 正确', () => {
  assert.deepEqual(inorder(bstDelete(buildBST([5,3,6,2,4,7]), 3)), [2,4,5,6,7]);
  assert.deepEqual(inorder(bstDelete(buildBST([5,3,6,2,4,7]), 5)), [2,3,4,6,7]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

for (const a of ALGS) {
  const m = a.m;
  const metaSrc = meta(a.id, m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]);
  writeAlg(a.id, metaSrc, a.impl, a.trace, a.test);
}
console.log(`tree: wrote ${ALGS.length} algorithms`);
