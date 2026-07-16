// =============================================================================
// 谱聚类（归一化拉普拉斯）· 纯算法实现
// 高斯相似度 + 对称归一化拉普拉斯 + Jacobi 特征分解 + K-均值。
// =============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface SpectralClusteringHooks {
  /** 求出拉普拉斯矩阵。 */
  onLaplacian?: (L: number[][]) => void;
  /** 求出前 k 个特征值（升序）。 */
  onEigenvalues?: (eigenvalues: number[]) => void;
  /** K-均值完成。 */
  onDone?: (labels: number[]) => void;
}

type Mat = number[][];

function dist2(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

/** Jacobi 特征分解（对称矩阵）→ { eigenvalues, eigenvectors }，列向量。 */
function jacobiEig(A0: Mat, maxIter = 200, tol = 1e-12): { values: number[]; vectors: Mat } {
  const n = A0.length;
  let A = A0.map((r) => [...r]);
  let V: Mat = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );
  for (let it = 0; it < maxIter; it++) {
    // 找最大非对角
    let p = 0;
    let q = 1;
    let max = 0;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(A[i]![j]!) > max) {
          max = Math.abs(A[i]![j]!);
          p = i;
          q = j;
        }
      }
    if (max < tol) break;
    const app = A[p]![p]!;
    const aqq = A[q]![q]!;
    const apq = A[p]![q]!;
    const theta = 0.5 * Math.atan2(2 * apq, aqq - app);
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const newA = A.map((r) => [...r]);
    for (let i = 0; i < n; i++) {
      const aip = A[i]![p]!;
      const aiq = A[i]![q]!;
      newA[i]![p] = c * aip - s * aiq;
      newA[i]![q] = s * aip + c * aiq;
    }
    for (let j = 0; j < n; j++) {
      const apj = newA[p]![j]!;
      const aqj = newA[q]![j]!;
      newA[p]![j] = c * apj - s * aqj;
      newA[q]![j] = s * apj + c * aqj;
    }
    A = newA;
    const newV = V.map((r) => [...r]);
    for (let i = 0; i < n; i++) {
      const vip = V[i]![p]!;
      const viq = V[i]![q]!;
      newV[i]![p] = c * vip - s * viq;
      newV[i]![q] = s * vip + c * viq;
    }
    V = newV;
  }
  const values = A.map((row, i) => row[i]!);
  return { values, vectors: V };
}

/** 简单 K-均值（输入是任意特征向量集合），返回标签。 */
function kmeansOnRows(features: Mat, k: number, maxIter = 100, seed = 42): number[] {
  const n = features.length;
  const d = n > 0 ? features[0]!.length : 0;
  if (n === 0 || k <= 0) return new Array(n).fill(0);
  // 最远优先初始化：第一个质心取首行，后续取距已选质心最远的行
  const centroids: Mat = [];
  const firstIdx = 0;
  centroids.push([...features[firstIdx]!]);
  const chosen = new Set<number>([firstIdx]);
  while (centroids.length < k && centroids.length < n) {
    let bestIdx = -1;
    let bestMinDist = -Infinity;
    for (let i = 0; i < n; i++) {
      if (chosen.has(i)) continue;
      let minD = Infinity;
      for (const c of centroids) {
        let s = 0;
        for (let j = 0; j < d; j++) s += (features[i]![j]! - c[j]!) ** 2;
        if (s < minD) minD = s;
      }
      if (minD > bestMinDist) {
        bestMinDist = minD;
        bestIdx = i;
      }
    }
    if (bestIdx === -1) break;
    centroids.push([...features[bestIdx]!]);
    chosen.add(bestIdx);
  }
  // 若可用行不足 k，补零质心
  while (centroids.length < k) centroids.push(new Array(d).fill(0));
  const labels = new Array(n).fill(0);
  for (let iter = 0; iter < maxIter; iter++) {
    let moved = false;
    for (let i = 0; i < n; i++) {
      let bestK = 0;
      let bestD = Infinity;
      for (let c = 0; c < k; c++) {
        let s = 0;
        for (let j = 0; j < d; j++) s += (features[i]![j]! - centroids[c]![j]!) ** 2;
        if (s < bestD) {
          bestD = s;
          bestK = c;
        }
      }
      if (labels[i] !== bestK) {
        labels[i] = bestK;
        moved = true;
      }
    }
    // 更新质心
    const sums: Mat = Array.from({ length: k }, () => new Array(d).fill(0));
    const counts = new Array(k).fill(0);
    for (let i = 0; i < n; i++) {
      counts[labels[i]!]! += 1;
      for (let j = 0; j < d; j++) sums[labels[i]!]![j]! += features[i]![j]!;
    }
    for (let c = 0; c < k; c++) {
      if (counts[c]! > 0) for (let j = 0; j < d; j++) centroids[c]![j] = sums[c]![j]! / counts[c]!;
    }
    if (!moved) break;
  }
  void seed;
  return labels;
}

/**
 * 谱聚类。
 * @param points 数据点
 * @param k 簇数
 * @param sigma 高斯核带宽
 */
export function spectralClustering(
  points: readonly Point[],
  k: number,
  sigma = 1,
  hooks: SpectralClusteringHooks = {},
): number[] {
  const n = points.length;
  if (n === 0) return [];
  if (k < 1) throw new RangeError(`k 须 >= 1，收到 ${k}`);
  if (sigma <= 0) throw new RangeError(`sigma 须 > 0，收到 ${sigma}`);

  // 1. 相似度矩阵 W
  const W: Mat = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      W[i]![j] = Math.exp(-dist2(points[i]!, points[j]!) / (2 * sigma * sigma));
    }
  }
  // 2. 度矩阵 D，归一化拉普拉斯 L = I − D^(−1/2) W D^(−1/2)
  const deg = new Array(n).fill(0);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) deg[i]! += W[i]![j]!;
  const L: Mat = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => {
      if (i === j) return 1;
      const di = deg[i]! > 0 ? Math.sqrt(deg[i]!) : 1;
      const dj = deg[j]! > 0 ? Math.sqrt(deg[j]!) : 1;
      return -W[i]![j]! / (di * dj);
    }),
  );
  hooks.onLaplacian?.(L.map((r) => [...r]));

  // 3. 特征分解，取最小 k 个特征值对应特征向量
  const { values, vectors } = jacobiEig(L);
  const idx = values.map((_, i) => i).sort((a, b) => values[a]! - values[b]!);
  hooks.onEigenvalues?.(idx.slice(0, k).map((i) => values[i]!));

  // 4. 拼成 n×k 矩阵 U
  const U: Mat = Array.from({ length: n }, () => new Array(k).fill(0));
  for (let i = 0; i < n; i++) {
    for (let c = 0; c < k; c++) {
      U[i]![c] = vectors[i]![idx[c]!]!;
    }
  }
  // 5. 行 L2 归一化
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let c = 0; c < k; c++) s += U[i]![c]! ** 2;
    s = Math.sqrt(s);
    if (s > 1e-12) for (let c = 0; c < k; c++) U[i]![c] = U[i]![c]! / s;
  }

  // 6. K-均值
  const labels = kmeansOnRows(U, k);
  hooks.onDone?.(labels);
  return labels;
}
