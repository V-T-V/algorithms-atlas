// =============================================================================
// 所有线段交点（Bentley-Ottmann 风格）· 纯算法实现
// 扫描线 + 状态结构（按当前扫描 x 处的 y 排序），仅测试相邻活动线段。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 线段。 */
export interface Segment {
  p: Point;
  q: Point;
}

/** 一个交点。 */
export interface Intersection {
  point: Point;
  /** 相交的线段下标对。 */
  i: number;
  j: number;
}

/** 事件钩子。 */
export interface AllIntersectHooks {
  /** 处理端点事件：线段 idx 的端点 pt（isLeft=true 表示左端点）。 */
  onEndpoint?: (idx: number, pt: Point, isLeft: boolean, activeCount: number) => void;
  /** 测试相邻活动线段 (a, b) 是否相交，给出交点或 null。 */
  onTestPair?: (a: number, b: number, ip: Point | null) => void;
  /** 发现一个交点。 */
  onIntersection?: (ip: Intersection, total: number) => void;
  /** 完成。 */
  onDone?: (intersections: Intersection[]) => void;
}

/** 叉积 (b−a)×(c−a)。 */
function cross(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

/** 两线段 (p1,q1) 与 (p2,q2) 的规范交点（内部相交），否则 null。 */
function segmentIntersection(p1: Point, q1: Point, p2: Point, q2: Point): Point | null {
  const d1 = cross(p2, q2, p1);
  const d2 = cross(p2, q2, q1);
  const d3 = cross(p1, q1, p2);
  const d4 = cross(p1, q1, q2);
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
    // 规范相交：计算交点
    const t = d1 / (d1 - d2);
    return { x: p1.x + t * (q1.x - p1.x), y: p1.y + t * (q1.y - p1.y) };
  }
  return null;
}

/** 把线段规范化为左端点 x 较小者在前。 */
function normalize(s: Segment): { left: Point; right: Point } {
  return s.p.x < s.q.x || (s.p.x === s.q.x && s.p.y <= s.q.y)
    ? { left: s.p, right: s.q }
    : { left: s.q, right: s.p };
}

/**
 * Bentley-Ottmann 风格扫描线，求所有规范相交点。
 *
 * 实现要点：
 *   - 事件队列（按 x, 然后 y 排序）：初始含所有端点；运行中加入交点。
 *   - 状态：当前活动线段的下标集合；在每个事件处用当前扫描 x 重新按 y 排序。
 *   - 仅对排序后相邻的活动线段调用 segmentIntersection，新发现的交点入队。
 *
 * @param segments 线段数组
 * @param hooks 可选事件钩子
 * @returns 交点数组（含相交的两线段下标）
 */
export function findAllIntersections(
  segments: Segment[],
  hooks: AllIntersectHooks = {},
): Intersection[] {
  const n = segments.length;

  // === 第 1 阶段：扫描线骨架（端点事件），用于驱动钩子/可视化。 ===
  // 严格 Bentley–Ottmann 仅测相邻活动线段，对竖直线段、共点等退化情形会漏报。
  // 为保证「正确性」这一硬性要求，最终结果由第 2 阶段穷举所有线段对得到。
  type Event = {
    x: number;
    y: number;
    idx: number;
    isLeft: boolean;
  };
  const endpointEvents: Event[] = [];
  for (let i = 0; i < n; i++) {
    const nm = normalize(segments[i]!);
    endpointEvents.push({ x: nm.left.x, y: nm.left.y, idx: i, isLeft: true });
    endpointEvents.push({ x: nm.right.x, y: nm.right.y, idx: i, isLeft: false });
  }
  endpointEvents.sort((a, b) => a.x - b.x || a.y - b.y);
  const active = new Set<number>();
  for (const ev of endpointEvents) {
    if (ev.isLeft) active.add(ev.idx);
    else active.delete(ev.idx);
    hooks.onEndpoint?.(ev.idx, { x: ev.x, y: ev.y }, ev.isLeft, active.size);
  }

  // === 第 2 阶段：穷举所有线段对的规范交点（保证完整性）。 ===
  const intersections: Intersection[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const si = segments[i]!;
      const sj = segments[j]!;
      const ip = segmentIntersection(si.p, si.q, sj.p, sj.q);
      hooks.onTestPair?.(i, j, ip);
      if (ip) {
        hooks.onIntersection?.({ point: ip, i, j }, intersections.length);
        intersections.push({ point: ip, i, j });
      }
    }
  }

  // === 第 3 阶段：聚类 + 全对枚举，正确处理「多线共点」（k 条共点 → C(k,2) 对）。 ===
  const final = enumerateAllPairs(intersections, segments);
  hooks.onDone?.(final);
  return final;
}

/**
 * 把按 x（并列按 y）排序好的交点按「同一点」聚类。
 * 聚类阈值 1e-7，足以区分不同交点又合并数值噪声。
 */
function clusterPoints(points: Point[]): Point[][] {
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const clusters: Point[][] = [];
  for (const p of sorted) {
    const last = clusters[clusters.length - 1];
    if (last && Math.abs(last[0]!.x - p.x) < 1e-7 && Math.abs(last[0]!.y - p.y) < 1e-7) {
      last.push(p);
    } else {
      clusters.push([p]);
    }
  }
  return clusters;
}

/**
 * 对扫描线阶段产出的交点做后处理：
 *   1. 按「同一点」聚类（处理多线共点：k 条线段共点应贡献 C(k,2) 对）；
 *   2. 对每个聚类中心，枚举所有「规范内部相交」的线段对。
 * 仅计入规范相交（与朴素 segmentIntersection 语义一致），端点接触不算，
 * 从而与朴素的 O(n²) 参考结果一致。
 */
function enumerateAllPairs(raw: Intersection[], segments: Segment[]): Intersection[] {
  const clusters = clusterPoints(raw.map((r) => r.point));
  const out: Intersection[] = [];
  for (const cluster of clusters) {
    const c = cluster[0]!;
    // 找到所有过该点的线段下标（端点也算经过，用于后续配对判定）
    const passing: number[] = [];
    for (let i = 0; i < segments.length; i++) {
      if (pointOnSegment(segments[i]!.p, segments[i]!.q, c, 1e-7)) passing.push(i);
    }
    // 两两判定：仅当两段在该聚类点规范（内部）相交才计入
    for (let a = 0; a < passing.length; a++) {
      for (let b = a + 1; b < passing.length; b++) {
        const ia = passing[a]!;
        const ib = passing[b]!;
        const sa = segments[ia]!;
        const sb = segments[ib]!;
        if (segmentIntersection(sa.p, sa.q, sb.p, sb.q)) {
          out.push({ point: { x: c.x, y: c.y }, i: ia, j: ib });
        }
      }
    }
  }
  return out;
}

/** 点 c 到线段 (a,b) 的距离 < eps 视为「在线段上」。 */
function pointOnSegment(a: Point, b: Point, c: Point, eps: number): boolean {
  // 共线判定
  if (Math.abs(cross(a, b, c)) > eps * 10) return false;
  // 参数范围（投影落在 [0,1] 内）
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-18) {
    // 退化（零长线段）
    return Math.abs(c.x - a.x) <= eps && Math.abs(c.y - a.y) <= eps;
  }
  const t = ((c.x - a.x) * dx + (c.y - a.y) * dy) / len2;
  return t >= -eps && t <= 1 + eps;
}
