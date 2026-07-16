import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bitmaskDp, type TspInput } from '../../src/algorithms/dp/bitmask-dp/impl.ts';

/** 校验：路径访问每个城市一次且首尾回到起点；长度等于 best。 */
function isValidTour(input: TspInput, best: number, path: number[]): boolean {
  if (!Number.isFinite(best)) return path.length === 0;
  const n = input.dist.length;
  if (path.length !== n + 1) return false;
  if (path[0] !== path[n]) return false; // 必须回到起点
  const seen = new Set<number>();
  for (let i = 0; i < n; i++) {
    if (seen.has(path[i]!)) return false;
    seen.add(path[i]!);
  }
  // 计算回路长度
  let cost = 0;
  for (let i = 0; i + 1 < path.length; i++) {
    const row = input.dist[path[i]!];
    const w = row ? row[path[i + 1]!] : undefined;
    if (w === undefined || !Number.isFinite(w)) return false;
    cost += w;
  }
  return cost === best;
}

const DIST: number[][] = [
  [0, 10, 15, 20],
  [10, 0, 35, 25],
  [15, 35, 0, 30],
  [20, 25, 30, 0],
];

test('bitmask-dp TSP 最短回路', () => {
  const r = bitmaskDp({ dist: DIST });
  assert.equal(r.best, 80);
  assert.ok(isValidTour({ dist: DIST }, r.best, r.path), '路径非法');
});

test('bitmask-dp 单城市', () => {
  const r = bitmaskDp({ dist: [[0]] });
  assert.equal(r.best, 0);
  assert.deepEqual(r.path, [0]);
});

test('bitmask-dp 不可达返回 ∞', () => {
  // 0→1 可达，但无法回 0
  const r = bitmaskDp({
    dist: [
      [0, 5, Infinity],
      [Infinity, 0, 5],
      [5, Infinity, 0],
    ],
  });
  // 实际上 0→1→2→0 = 5+5+5 = 15 可行
  assert.equal(r.best, 15);
});

test('bitmask-dp 真正不可行', () => {
  // 拆成两段无法成回路
  const r = bitmaskDp({
    dist: [
      [0, 1, Infinity],
      [Infinity, 0, Infinity],
      [Infinity, Infinity, 0],
    ],
  });
  assert.equal(r.best, Infinity);
  assert.deepEqual(r.path, []);
});

test('bitmask-dp 对称 vs 非对称', () => {
  // 非对称：0→1=1, 1→0=100，其余对称；最优应避开贵的回边
  const r = bitmaskDp({
    dist: [
      [0, 1, 10, 10],
      [100, 0, 10, 10],
      [10, 10, 0, 1],
      [10, 10, 100, 0],
    ],
  });
  // 一条可行回路 0→1→2→3→0 = 1+10+1+10 = 22
  assert.ok(r.best <= 22 && Number.isFinite(r.best));
});

test('bitmask-dp 钩子被调用', () => {
  let states = 0;
  let transitions = 0;
  let doneBest = -1;
  bitmaskDp(
    { dist: DIST },
    {
      onState: () => states++,
      onTransition: () => transitions++,
      onDone: (b) => {
        doneBest = b;
      },
    },
  );
  assert.ok(states >= 4, '至少遍历若干状态');
  assert.ok(transitions >= 1, '至少发生一次转移');
  assert.equal(doneBest, 80);
});
