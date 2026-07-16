import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eulerPath, type EulerGraphInput } from '../../src/algorithms/graph/euler-path/impl.ts';

/** 校验：路径节点序列相邻性必须对应原图的一条边，且经过每条边恰好一次。 */
function isValidEuler(
  input: EulerGraphInput,
  path: string[],
  expectedCircuit: boolean,
): { valid: boolean; reason?: string } {
  const isCircuit = path.length > 0 && path[0] === path[path.length - 1];
  if (isCircuit !== expectedCircuit) return { valid: false, reason: `circuit mismatch` };
  // 消耗每条边恰好一次
  const remaining = new Map<string, number>();
  const key = (a: string, b: string) => (a < b ? `${a}>${b}` : `${b}>${a}`);
  for (const e of input.edges)
    remaining.set(key(e.from, e.to), (remaining.get(key(e.from, e.to)) ?? 0) + 1);
  for (let i = 0; i + 1 < path.length; i++) {
    const k = key(path[i]!, path[i + 1]!);
    const cnt = remaining.get(k);
    if (!cnt) return { valid: false, reason: `边 ${k} 不存在或已用尽` };
    remaining.set(k, cnt - 1);
  }
  for (const [k, v] of remaining)
    if (v !== 0) return { valid: false, reason: `边 ${k} 剩余 ${v} 次` };
  return { valid: true };
}

test('euler-path 三角形回路', () => {
  const g: EulerGraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  const r = eulerPath(g);
  assert.ok(r.path, '应存在欧拉回路');
  assert.equal(r.isCircuit, true);
  const check = isValidEuler(g, r.path!, true);
  assert.ok(check.valid, check.reason);
});

test('euler-path 双奇点欧拉路径', () => {
  const g: EulerGraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'B', to: 'D' },
    ],
  };
  const r = eulerPath(g);
  assert.ok(r.path);
  assert.equal(r.isCircuit, false);
  const check = isValidEuler(g, r.path!, false);
  assert.ok(check.valid, check.reason);
});

test('euler-path 非欧拉图（4 个奇点）', () => {
  // 星形：中心 X 连 A,B,C,D → 4 个叶子度数为 1（奇），X 度数 4（偶）→ 4 个奇点，非欧拉
  const g: EulerGraphInput = {
    nodes: ['X', 'A', 'B', 'C', 'D'],
    edges: [
      { from: 'X', to: 'A' },
      { from: 'X', to: 'B' },
      { from: 'X', to: 'C' },
      { from: 'X', to: 'D' },
    ],
  };
  const r = eulerPath(g);
  assert.equal(r.path, null);
});

test('euler-path 有向欧拉回路', () => {
  const g: EulerGraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
    directed: true,
  };
  const r = eulerPath(g);
  assert.ok(r.path);
  assert.equal(r.isCircuit, true);
});

test('euler-path 单点空图', () => {
  const r = eulerPath({ nodes: ['X'], edges: [] });
  assert.deepEqual(r.path, ['X']);
});

test('euler-path 钩子被调用', () => {
  const traversed: Array<[string, string]> = [];
  const state: { path: string[] | null } = { path: null };
  const g: EulerGraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  eulerPath(g, {
    onTraverse: (u, v) => traversed.push([u, v]),
    onDone: (p) => {
      state.path = p;
    },
  });
  assert.equal(traversed.length, 3, '应遍历每条边一次');
  assert.ok(state.path !== null && state.path.length === 4);
});
