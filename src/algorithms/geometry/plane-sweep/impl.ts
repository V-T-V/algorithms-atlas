// =============================================================================
// 平面扫描线（通用框架）· 纯算法实现
// 演示一维区间并集长度：把每个区间端点作为「事件」，扫描累加并集长度。
// 这是理解二维扫描线（矩形并面积、Bentley-Ottmann）的基础。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** 一维区间。 */
export interface Interval {
  l: number;
  r: number;
}

/** 事件钩子。 */
export interface PlaneSweepHooks {
  /** 扫描到某个事件 x，当前「活动区间数」count 与累计并集长度 total。 */
  onEvent?: (x: number, count: number, total: number) => void;
  /** 处理完所有事件。 */
  onDone?: (unionLength: number) => void;
}

/**
 * 平面扫描线（一维区间并集长度）。
 *
 * 事件设计：每个区间的左端点是一个「+1」事件，右端点是一个「−1」事件。
 * 按坐标 x 升序处理事件（同一 x 先处理 −1 再处理 +1，或反之，依实现而定）。
 * 维护当前「活动区间数」count：count>0 表示扫描线处于某个区间内部。
 * 每两个相邻事件 x_{k}, x_{k+1} 之间，若 count>0，则把 x_{k+1}−x_k 累加到并集长度。
 *
 * @param intervals 区间数组
 * @param hooks 可选钩子
 * @returns 并集总长度
 */
export function sweepIntervalUnion(intervals: Interval[], hooks: PlaneSweepHooks = {}): number {
  type Event = { x: number; delta: number };
  const events: Event[] = [];
  for (const itv of intervals) {
    if (itv.r <= itv.l) continue; // 跳过退化区间
    events.push({ x: itv.l, delta: 1 });
    events.push({ x: itv.r, delta: -1 });
  }
  // 按 x 升序；同 x 先处理右端点（−1）以避免把零长度片段算进去
  events.sort((a, b) => (a.x !== b.x ? a.x - b.x : a.delta - b.delta));

  let total = 0;
  let count = 0;
  let prevX = 0;
  let hasPrev = false;

  for (const e of events) {
    if (hasPrev && count > 0) {
      total += e.x - prevX;
    }
    prevX = e.x;
    hasPrev = true;
    count += e.delta;
    hooks.onEvent?.(e.x, count, total);
  }

  hooks.onDone?.(total);
  return total;
}

/**
 * 二维矩形并集面积（扫描线 + 离散化）。
 * 把矩形 [x1,x2]×[y1,y2] 沿 x 方向扫描：
 *   - 每个 x 事件（左边 +1，右边 −1）更新 y 方向的「活动覆盖」并查并集长度，
 *   - 相邻 x 之间的贡献 = y 并集长度 × Δx。
 * 这是平面扫描线在二维的标准应用。
 *
 * @param rects 矩形数组，每个 {x1,y1,x2,y2}
 * @param hooks 可选钩子
 * @returns 并集面积
 */
export interface Rect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function sweepRectUnionArea(rects: Rect[], hooks: PlaneSweepHooks = {}): number {
  // 收集 y 坐标并去重排序（离散化）
  const ys: number[] = [];
  for (const r of rects) {
    ys.push(r.y1, r.y2);
  }
  ys.sort((a, b) => a - b);
  const uniqY: number[] = [];
  for (const y of ys) {
    if (uniqY.length === 0 || uniqY[uniqY.length - 1] !== y) uniqY.push(y);
  }
  const m = uniqY.length;
  // 每个 y 段 [uniqY[i], uniqY[i+1]] 的计数
  const segCount = new Array<number>(Math.max(0, m - 1)).fill(0);
  const segLen = (i: number): number => uniqY[i + 1]! - uniqY[i]!;

  // 把矩形的 y 范围映射到段索引
  const yIndex = (y: number): number => {
    // 二分
    let lo = 0;
    let hi = uniqY.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (uniqY[mid]! < y) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  // x 事件
  type XEvent = { x: number; delta: number; y1: number; y2: number };
  const xevents: XEvent[] = [];
  for (const r of rects) {
    if (r.x2 <= r.x1 || r.y2 <= r.y1) continue;
    xevents.push({ x: r.x1, delta: 1, y1: r.y1, y2: r.y2 });
    xevents.push({ x: r.x2, delta: -1, y1: r.y1, y2: r.y2 });
  }
  xevents.sort((a, b) => (a.x !== b.x ? a.x - b.x : a.delta - b.delta));

  let area = 0;
  let prevX = 0;
  let hasPrev = false;

  const activeYLen = (): number => {
    let len = 0;
    for (let i = 0; i < segCount.length; i++) {
      if (segCount[i]! > 0) len += segLen(i);
    }
    return len;
  };

  for (const e of xevents) {
    if (hasPrev) {
      const dx = e.x - prevX;
      if (dx > 0) {
        area += dx * activeYLen();
      }
    }
    prevX = e.x;
    hasPrev = true;
    // 在 y 方向应用 delta
    const i1 = yIndex(e.y1);
    const i2 = yIndex(e.y2);
    for (let i = i1; i < i2; i++) segCount[i]! += e.delta;
    hooks.onEvent?.(e.x, segCount.filter((c) => c > 0).length, area);
  }

  hooks.onDone?.(area);
  return area;
}
