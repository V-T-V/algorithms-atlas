export interface CsHooks {
  onTake?: (c: number) => void;
  onResult?: (ok: boolean) => void;
}
export function canFinish(
  numCourses: number,
  prerequisites: Array<[number, number]>,
  hooks: CsHooks = {},
): boolean {
  const indeg = new Array<number>(numCourses).fill(0);
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) {
    adj[b]!.push(a);
    indeg[a]!++;
  }
  const q: number[] = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);
  let count = 0;
  while (q.length) {
    const u = q.shift()!;
    count++;
    hooks.onTake?.(u);
    for (const v of adj[u]!) {
      indeg[v]!--;
      if (indeg[v] === 0) q.push(v);
    }
  }
  const ok = count === numCourses;
  hooks.onResult?.(ok);
  return ok;
}
