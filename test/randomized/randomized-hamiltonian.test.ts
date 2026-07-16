// 随机化哈密顿路径判定 · 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  randomizedHamiltonianPath,
  hamiltonianPathBacktrack,
  makeAdjacency,
  makeRng,
} from '../../src/algorithms/randomized/randomized-hamiltonian/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/randomized/randomized-hamiltonian/trace.ts';

/** 验证一条路径是否为合法哈密顿路径。 */
function isHamiltonian(path: number[] | null, n: number, adj: boolean[][]): boolean {
  if (path === null) return false;
  if (path.length !== n) return false;
  const seen = new Set<number>();
  for (const v of path) {
    if (seen.has(v)) return false;
    seen.add(v);
  }
  for (let i = 0; i + 1 < path.length; i++) {
    if (!adj[path[i]!]![path[i + 1]!]) return false;
  }
  return true;
}

test('路径图 0-1-2-3-4 含哈密顿路径', () => {
  const adj = makeAdjacency(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ]);
  const path = randomizedHamiltonianPath(5, adj, 100, 25, makeRng(42));
  assert.ok(path !== null);
  assert.ok(isHamiltonian(path, 5, adj));
});

test('完全图必含哈密顿路径', () => {
  const n = 6;
  const adj = makeAdjacency(
    n,
    Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => [i, j] as [number, number]),
    )
      .flat()
      .filter(([a, b]) => a < b),
  );
  const path = randomizedHamiltonianPath(n, adj, 10, 36, makeRng(1));
  assert.ok(path !== null);
  assert.ok(isHamiltonian(path, n, adj));
});

test('孤立点无哈密顿路径', () => {
  // 4 顶点，仅 0-1-2 连通，3 孤立
  const adj = makeAdjacency(4, [
    [0, 1],
    [1, 2],
  ]);
  const path = randomizedHamiltonianPath(4, adj, 20, 16, makeRng(1));
  assert.equal(path, null);
});

test('确定性回溯：路径图有解', () => {
  const adj = makeAdjacency(4, [
    [0, 1],
    [1, 2],
    [2, 3],
  ]);
  const path = hamiltonianPathBacktrack(4, adj);
  assert.ok(path !== null);
  assert.ok(isHamiltonian(path, 4, adj));
});

test('确定性回溯：孤立点无解', () => {
  const adj = makeAdjacency(4, [
    [0, 1],
    [1, 2],
  ]);
  assert.equal(hamiltonianPathBacktrack(4, adj), null);
});

test('随机化与确定性结果一致（有解情形）', () => {
  const adj = makeAdjacency(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [0, 2],
    [1, 3],
  ]);
  const rand = randomizedHamiltonianPath(5, adj, 50, 25, makeRng(7));
  const det = hamiltonianPathBacktrack(5, adj);
  assert.ok(rand !== null);
  assert.ok(det !== null);
  assert.ok(isHamiltonian(rand, 5, adj));
});

test('n=1 单点返回 [0]', () => {
  const adj = makeAdjacency(1, []);
  const path = randomizedHamiltonianPath(1, adj, 1, 1, makeRng(1));
  assert.deepEqual(path, [0]);
});

test('同种子可复现', () => {
  const adj = makeAdjacency(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [0, 2],
    [1, 3],
    [2, 4],
  ]);
  const a = randomizedHamiltonianPath(5, adj, 30, 25, makeRng(123));
  const b = randomizedHamiltonianPath(5, adj, 30, 25, makeRng(123));
  assert.deepEqual(a, b);
});

test('钩子触发', () => {
  const adj = makeAdjacency(4, [
    [0, 1],
    [1, 2],
    [2, 3],
  ]);
  const restarts: number[] = [];
  let result: { p: number[] | null; r: number } | null = null;
  randomizedHamiltonianPath(4, adj, 20, 16, makeRng(42), {
    onRestart: (r) => restarts.push(r),
    onResult: (p, r) => (result = { p, r }),
  });
  assert.ok(restarts.length >= 1);
  assert.ok(result !== null);
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});

test('DEFAULT_INPUT.n=5', () => {
  assert.equal(DEFAULT_INPUT.n, 5);
});
