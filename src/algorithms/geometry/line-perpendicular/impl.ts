// =============================================================================
// 过点作直线垂线（Perpendicular Line Through Point）· 纯算法实现
// =============================================================================

export interface Pt {
  x: number;
  y: number;
}

/** 直线点法式表示：normal·(X − P) = 0。 */
export interface LineNormalForm {
  /** 法向量。 */
  nx: number;
  ny: number;
  /** 直线上一点。 */
  px: number;
  py: number;
}

export interface PerpLineHooks {
  /** 计算出垂线（点法式）。 */
  onPerpLine?: (line: LineNormalForm) => void;
  /** 计算出 P 到 AB 的垂足 H。 */
  onFoot?: (h: Pt) => void;
}

/**
 * 过点 P 作直线 AB 的垂线。
 * @returns 垂线的点法式（法向量 = AB 方向）。
 */
export function perpendicularLine(a: Pt, b: Pt, p: Pt, hooks: PerpLineHooks = {}): LineNormalForm {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const line: LineNormalForm = { nx: dx, ny: dy, px: p.x, py: p.y };
  hooks.onPerpLine?.(line);

  // 顺带计算垂足（在 AB 上的投影）
  const len2 = dx * dx + dy * dy;
  if (len2 > 0) {
    const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
    const h: Pt = { x: a.x + t * dx, y: a.y + t * dy };
    hooks.onFoot?.(h);
  }
  return line;
}

/** 把点代入直线方程的值（=0 表示在直线上）。 */
export function evaluateLine(line: LineNormalForm, x: number, y: number): number {
  return line.nx * (x - line.px) + line.ny * (y - line.py);
}
