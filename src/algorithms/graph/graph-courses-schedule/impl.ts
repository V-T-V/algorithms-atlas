// =============================================================================
// 课程表 · 纯算法实现（Kahn 拓扑判环）
// =============================================================================

export interface CoursesScheduleHooks {
  onTake?: (course: number) => void;
  onResult?: (canFinish: boolean) => void;
}

export function canFinish(
  numCourses: number,
  prerequisites: ReadonlyArray<[number, number]>,
  hooks: CoursesScheduleHooks = {},
): boolean {
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
  let taken = 0;
  while (queue.length > 0) {
    const u = queue.shift()!;
    taken++;
    hooks.onTake?.(u);
    for (const v of adj.get(u) ?? []) {
      inDeg.set(v, (inDeg.get(v) ?? 0) - 1);
      if ((inDeg.get(v) ?? 0) === 0) queue.push(v);
    }
  }
  const ok = taken === numCourses;
  hooks.onResult?.(ok);
  return ok;
}
