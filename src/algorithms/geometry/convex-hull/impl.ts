// =============================================================================
// 凸包 Graham 扫描 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ConvexHullHooks {
  /** 选定极点（最下/最左点）作为排序基准。 */
  onPickAnchor?: (anchor: Point) => void;
  /** 完成按极角（及距离）的排序。给出排序后的下标顺序。 */
  onSortByAngle?: (order: number[]) => void;
  /** 把下标 i 的点压入候选栈。 */
  onPush?: (i: number) => void;
  /** 因「非左转（右转/共线）」把栈顶弹出。 */
  onPop?: (i: number) => void;
}

/** 叉积 (b - a) × (c - a)：>0 左转（逆时针），<0 右转，=0 共线。 */
function cross(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

/** 两点距离平方（避免开方，用于共线时按距离排序）。 */
function distSq(a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return dx * dx + dy * dy;
}

/**
 * 凸包 —— Graham 扫描。
 *
 * 步骤：\n
 * 1. 选 **极点** anchor：y 最小（同 y 取 x 最小）的点，它一定在凸包上\n
 * 2. 其余点按「相对 anchor 的极角」升序排序；极角相同按距离升序\n
 * 3. 维护一个栈；扫描每个点 p：\n
 *    - 当栈中至少 2 个点、且「栈顶→次顶→p」不是严格左转（即右转或共线）时，\n
 *      弹出栈顶（共线点不是凸包顶点，弹出）\n
 *    - 压入 p\n
 * 4. 栈中剩余点即为凸包顶点（逆时针顺序，含 anchor 起首，不含末尾重复的 anchor）\n
 *
 * 时间 `O(n log n)`（排序主导），空间 `O(n)`。\n
 * 共线点处理：本实现默认**剔除凸包边上的共线点**（弹出右转/共线），返回「最小顶点集」。\n
 *
 * @param points 输入点集（不会被修改）
 * @param hooks 可选事件钩子
 * @returns 凸包顶点（逆时针顺序，最少 1 个点）。点数 < 3 时返回去重后的全部点。
 */
export function convexHull(points: readonly Point[], hooks: ConvexHullHooks = {}): Point[] {
  const n = points.length;
  if (n <= 1) return points.map((p) => ({ ...p }));

  // 1) 找极点：y 最小（同 y 取 x 最小）
  let anchorIdx = 0;
  for (let i = 1; i < n; i++) {
    const a = points[anchorIdx]!;
    const p = points[i]!;
    if (p.y < a.y || (p.y === a.y && p.x < a.x)) anchorIdx = i;
  }
  const anchor = points[anchorIdx]!;
  hooks.onPickAnchor?.({ ...anchor });

  // 2) 其余点按极角（同极角按距离）排序
  const order: number[] = [];
  for (let i = 0; i < n; i++) if (i !== anchorIdx) order.push(i);
  order.sort((i, j) => {
    const c = cross(anchor, points[i]!, points[j]!);
    if (c !== 0) return c > 0 ? -1 : 1; // 极角升序（左转在前 → c>0 排前）
    return distSq(anchor, points[i]!) - distSq(anchor, points[j]!); // 同极角近的在前
  });
  hooks.onSortByAngle?.([anchorIdx, ...order]);

  // 3) 构造扫描序列（anchor 在最前），用栈维护左转链
  const seq = [anchorIdx, ...order];
  const stack: number[] = [];
  for (const idx of seq) {
    while (
      stack.length >= 2 &&
      cross(points[stack[stack.length - 2]!]!, points[stack[stack.length - 1]!]!, points[idx]!) <= 0 // 非严格左转（右转或共线）→ 弹出
    ) {
      const popped = stack.pop()!;
      hooks.onPop?.(popped);
    }
    stack.push(idx);
    hooks.onPush?.(idx);
  }

  return stack.map((idx) => ({ ...points[idx]! }));
}
