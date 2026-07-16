// =============================================================================
// 贝塞尔曲线（de Casteljau）· 纯算法实现
// =============================================================================

export interface Pt {
  x: number;
  y: number;
}

export interface BezierHooks {
  /** de Casteljau 每一层结束后给出当前层点集。 */
  onLayer?: (layer: number, points: Pt[]) => void;
  /** 计算出曲线点。 */
  onPoint?: (t: number, point: Pt) => void;
}

/** 两点线性插值。 */
function lerp(p: Pt, q: Pt, t: number): Pt {
  return { x: (1 - t) * p.x + t * q.x, y: (1 - t) * p.y + t * q.y };
}

/**
 * 用 de Casteljau 算法求贝塞尔曲线在参数 t 处的点。
 * @param controls 控制点（n+1 个，n = 次数）
 * @param t 参数 ∈ [0,1]
 */
export function bezierPoint(controls: readonly Pt[], t: number, hooks: BezierHooks = {}): Pt {
  if (controls.length === 0) throw new RangeError('控制点不能为空');
  if (t < 0 || t > 1) throw new RangeError(`t 须 ∈ [0,1]，收到 ${t}`);
  let pts: Pt[] = controls.map((p) => ({ ...p }));
  hooks.onLayer?.(0, pts);
  let layer = 1;
  while (pts.length > 1) {
    const next: Pt[] = [];
    for (let i = 0; i + 1 < pts.length; i++) {
      next.push(lerp(pts[i]!, pts[i + 1]!, t));
    }
    pts = next;
    hooks.onLayer?.(layer, pts);
    layer++;
  }
  const result = pts[0]!;
  hooks.onPoint?.(t, result);
  return result;
}

/** 沿曲线采样 steps+1 个点。 */
export function bezierCurve(controls: readonly Pt[], steps = 50, hooks: BezierHooks = {}): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 0 : i / steps;
    out.push(bezierPoint(controls, t, hooks));
  }
  return out;
}
