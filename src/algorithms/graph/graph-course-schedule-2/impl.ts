// =============================================================================
// 课程表 II · 纯算法实现（Kahn 输出拓扑序）
// =============================================================================

export interface CourseSchedule2Hooks {
  onOutput?: (course: number, position: number) => void;
  onResult?: (order: number[], feasible: boolean) => void;
}

export function findOrder(
  numCourses: number,
  prerequisites: ReadonlyArray<[number, number]>,
  hooks: CourseSchedule2Hooks = {},
): number[] {
  const adj = new Map<number, number[]>();
  const inDeg = new Map<number, number>();
  for (let i = 0; i < numCourses; i++) {
    adj.set(i, []);
    inDeg.set(i, 0);
  }
  for (const [a, b] of prerequisites) {
    adj.get(b)!.push(a);
    inDeg.set(a, (inDeg.get(a) ?? 0) + 1);
  }
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if ((inDeg.get(i) ?? 0) === 0) queue.push(i);
  }
  const order: number[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    hooks.onOutput?.(u, order.length - 1);
    for (const v of adj.get(u) ?? []) {
      inDeg.set(v, (inDeg.get(v) ?? 0) - 1);
      if ((inDeg.get(v) ?? 0) === 0) queue.push(v);
    }
  }
  const feasible = order.length === numCourses;
  hooks.onResult?.(feasible ? order : [], feasible);
  return feasible ? order : [];
}
