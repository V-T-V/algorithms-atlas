// 几何哈希 · 实现
export interface Pt {
  x: number;
  y: number;
}

export interface GeometricHashHooks {
  onBasis?: (p1: Pt, p2: Pt, count: number) => void;
  onPoint?: (p1: Pt, p2: Pt, original: Pt, localX: number, localY: number) => void;
  onResult?: (hash: string) => void;
}

// 在 basis (p1, p2) 下把点 p 投影到局部坐标
function project(p1: Pt, p2: Pt, p: Pt): Pt {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return { x: 0, y: 0 };
  const ex = dx / Math.sqrt(len2);
  const ey = dy / Math.sqrt(len2);
  // 正交单位向量
  const px = -ey;
  const py = ex;
  const vx = p.x - p1.x;
  const vy = p.y - p1.y;
  const localX = vx * ex + vy * ey; // 沿 basis 方向
  const localY = vx * px + vy * py; // 正交方向
  return { x: localX, y: localY };
}

export function geometricHash(
  points: readonly Pt[],
  quant: number = 1,
  hooks: GeometricHashHooks = {},
): Map<string, Array<{ basisKey: string; lx: number; ly: number }>> {
  const table = new Map<string, Array<{ basisKey: string; lx: number; ly: number }>>();
  const n = points.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const p1 = points[i]!;
      const p2 = points[j]!;
      let count = 0;
      hooks.onBasis?.(p1, p2, 0);
      for (let k = 0; k < n; k++) {
        if (k === i || k === j) continue;
        const p = points[k]!;
        const local = project(p1, p2, p);
        const qx = Math.round(local.x / quant);
        const qy = Math.round(local.y / quant);
        const key = `${qx},${qy}`;
        if (!table.has(key)) table.set(key, []);
        table.get(key)!.push({ basisKey: `${i}-${j}`, lx: local.x, ly: local.y });
        hooks.onPoint?.(p1, p2, p, local.x, local.y);
        count++;
      }
      hooks.onBasis?.(p1, p2, count);
    }
  }
  hooks.onResult?.(`table with ${table.size} cells`);
  return table;
}
