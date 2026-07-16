// =============================================================================
// 动态凸包（增量）· 纯算法实现
// 维护上凸包与下凸包两条按 x 排序的链，每次插入点增量更新。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 事件钩子。 */
export interface DynamicHullHooks {
  /** 准备插入点 p。 */
  onAddPoint?: (p: Point) => void;
  /** 点 p 在凸包内（无需改动）。 */
  onInside?: (p: Point) => void;
  /** 点 p 在凸包外：上凸包删除了区间 [lo, hi] 的点。 */
  onRewireUpper?: (p: Point, removedCount: number) => void;
  /** 点 p 在凸包外：下凸包删除了区间 [lo, hi] 的点。 */
  onRewireLower?: (p: Point, removedCount: number) => void;
  /** 插入完成，给出当前凸包。 */
  onAfterInsert?: (hull: Point[]) => void;
}

/** 叉积 (a−o)×(b−o)。 */
function cross(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/**
 * 动态凸包（仅支持新增点）。
 * 用两条链：upper（上凸包，从左到右）与 lower（下凸包，从左到右）。
 * 每条链按 x 升序。
 */
export class DynamicConvexHull {
  private upper: Point[] = [];
  private lower: Point[] = [];
  /** 全部已加入的点。 */
  readonly points: Point[] = [];
  private hooks: DynamicHullHooks;

  constructor(hooks: DynamicHullHooks = {}) {
    this.hooks = hooks;
  }

  /**
   * 增量插入点 p。
   */
  add(p: Point): void {
    this.hooks.onAddPoint?.(p);
    this.points.push(p);

    // 前 3 个点特殊初始化
    if (this.points.length <= 3) {
      this.rebuildFromAll();
      this.hooks.onAfterInsert?.(this.getHull());
      return;
    }

    // 判断 p 是否严格在当前凸包内
    if (this.isInside(p)) {
      this.hooks.onInside?.(p);
      this.hooks.onAfterInsert?.(this.getHull());
      return;
    }

    // 更新上凸包：删除被 p 「顶出去」的弧
    const removedU = this.rewireUpper(p);
    this.hooks.onRewireUpper?.(p, removedU);
    // 更新下凸包
    const removedL = this.rewireLower(p);
    this.hooks.onRewireLower?.(p, removedL);

    this.hooks.onAfterInsert?.(this.getHull());
  }

  /** 判断 p 是否在当前凸包内或边界上（用完整凸包多边形，鲁棒于共线/同 x 情形）。 */
  private isInside(p: Point): boolean {
    const hull = this.getHull();
    const m = hull.length;
    if (m === 0) return false;
    if (m <= 2) {
      // 线段或单点：判 p 是否在退化体上
      if (m === 1) {
        const q = hull[0]!;
        return Math.abs(p.x - q.x) <= 1e-12 && Math.abs(p.y - q.y) <= 1e-12;
      }
      const a = hull[0]!;
      const b = hull[1]!;
      if (Math.abs(cross(a, b, p)) > 1e-9) return false;
      const minX = Math.min(a.x, b.x) - 1e-9,
        maxX = Math.max(a.x, b.x) + 1e-9;
      const minY = Math.min(a.y, b.y) - 1e-9,
        maxY = Math.max(a.y, b.y) + 1e-9;
      return p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY;
    }
    // 凸多边形：p 在内部 ⟺ 对每条有向边 cross >= 0（逆时针）或 <= 0（顺时针）。
    // 先确定方向，再逐边判定（含边界）。
    let area2 = 0;
    for (let i = 0; i < m; i++) {
      const a = hull[i]!;
      const b = hull[(i + 1) % m]!;
      area2 += a.x * b.y - b.x * a.y;
    }
    const sign = area2 >= 0 ? 1 : -1;
    for (let i = 0; i < m; i++) {
      const a = hull[i]!;
      const b = hull[(i + 1) % m]!;
      if (sign * cross(a, b, p) < -1e-9) return false;
    }
    return true;
  }

  /**
   * 用 p 更新上凸包：从 p 所在位置向两侧删点，直到恢复凸性，再插入 p。
   * 返回删除的点数。
   */
  private rewireUpper(p: Point): number {
    return this.rewire(p, this.upper, 'upper');
  }
  private rewireLower(p: Point): number {
    return this.rewire(p, this.lower, 'lower');
  }

  /** 通用重连：which 决定凸性方向。 */
  private rewire(p: Point, chain: Point[], which: 'upper' | 'lower'): number {
    // 朴素实现：重建该链时把 p 考虑进去（保证正确性）。
    // 收集「所有已加入点」+ p，按 x 排序，重建对应半凸包。
    // 这里直接重建保证正确；演示钩子用 removed 表示差异。
    const before = chain.length;
    const all = [...this.points];
    all.sort((a, b) => a.x - b.x || a.y - b.y);
    // 重建上凸包（单调链）与下凸包
    const newUpper: Point[] = [];
    const newLower: Point[] = [];
    for (const pt of all) {
      // 上凸包：维护下侧（cross <= 0 表示右转或共线）
      while (
        newUpper.length >= 2 &&
        cross(newUpper[newUpper.length - 2]!, newUpper[newUpper.length - 1]!, pt) >= 0
      ) {
        newUpper.pop();
      }
      newUpper.push(pt);
      // 下凸包：维护上侧
      while (
        newLower.length >= 2 &&
        cross(newLower[newLower.length - 2]!, newLower[newLower.length - 1]!, pt) <= 0
      ) {
        newLower.pop();
      }
      newLower.push(pt);
    }
    // 去掉两端重复
    newUpper.pop();
    newLower.shift();
    this.upper = newUpper;
    this.lower = newLower;
    const after = (which === 'upper' ? newUpper : newLower).length;
    return Math.max(0, before - after);
  }

  /** 从全部已加入点重建上下凸包（初始化用）。 */
  private rebuildFromAll(): void {
    const all = [...this.points].sort((a, b) => a.x - b.x || a.y - b.y);
    // 退化：0~1 个点直接作为凸包（upper 存全部，lower 为空）
    if (all.length <= 1) {
      this.upper = [...all];
      this.lower = [];
      return;
    }
    const up: Point[] = [];
    const lo: Point[] = [];
    for (const pt of all) {
      while (up.length >= 2 && cross(up[up.length - 2]!, up[up.length - 1]!, pt) >= 0) up.pop();
      up.push(pt);
      while (lo.length >= 2 && cross(lo[lo.length - 2]!, lo[lo.length - 1]!, pt) <= 0) lo.pop();
      lo.push(pt);
    }
    up.pop();
    lo.shift();
    this.upper = up;
    this.lower = lo;
  }

  /** 返回当前完整凸包（逆时针，首尾不重复）。 */
  getHull(): Point[] {
    // 下凸包（左→右）+ 上凸包逆序（右→左）
    return [...this.lower, ...[...this.upper].reverse()];
  }
}
