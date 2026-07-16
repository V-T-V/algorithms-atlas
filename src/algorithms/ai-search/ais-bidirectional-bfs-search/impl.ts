export interface BiBfsHooks {
  onExpand?: (side: 'f' | 'b', node: number) => void;
  onMeet?: (node: number) => void;
}
export interface BiBfsGraph {
  start: number;
  goal: number;
  adj: (n: number) => number[];
}
export function bidirectionalBfs(g: BiBfsGraph, hooks: BiBfsHooks = {}): number[] {
  if (g.start === g.goal) return [g.start];
  const seenF = new Map<number, number>([[g.start, -1]]);
  const seenB = new Map<number, number>([[g.goal, -1]]);
  const qF = [g.start];
  const qB = [g.goal];
  while (qF.length && qB.length) {
    const expandSide = (
      front: number[],
      seen: Map<number, number>,
      other: Map<number, number>,
      side: 'f' | 'b',
    ): number | null => {
      const next: number[] = [];
      for (const n of front) {
        hooks.onExpand?.(side, n);
        for (const m of g.adj(n)) {
          if (!seen.has(m)) {
            seen.set(m, n);
            if (other.has(m)) {
              hooks.onMeet?.(m);
              return m;
            }
            next.push(m);
          }
        }
      }
      front.length = 0;
      front.push(...next);
      return null;
    };
    const meet =
      qF.length <= qB.length
        ? expandSide(qF, seenF, seenB, 'f')
        : expandSide(qB, seenB, seenF, 'b');
    if (meet !== null) {
      const pf: number[] = [];
      let c: number | undefined = meet;
      while (c !== undefined && c !== -1) {
        pf.unshift(c);
        c = seenF.get(c);
      }
      const pb: number[] = [];
      let d: number | undefined = seenB.get(meet);
      while (d !== undefined && d !== -1) {
        pb.push(d);
        d = seenB.get(d);
      }
      return [...pf, ...pb];
    }
  }
  return [];
}
