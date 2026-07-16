export interface OlHooks {
  onVisit?: (s: string, d: number) => void;
  onResult?: (steps: number) => void;
}
export function openLock(deadends: string[], target: string, hooks: OlHooks = {}): number {
  const dead = new Set(deadends);
  if (dead.has('0000')) {
    hooks.onResult?.(-1);
    return -1;
  }
  const visited = new Set<string>(['0000']);
  const q: Array<[string, number]> = [['0000', 0]];
  while (q.length) {
    const [s, d] = q.shift()!;
    if (s === target) {
      hooks.onResult?.(d);
      return d;
    }
    for (let i = 0; i < 4; i++) {
      for (const delta of [1, -1]) {
        const dig = (Number(s[i]) + delta + 10) % 10;
        const ns = s.slice(0, i) + dig + s.slice(i + 1);
        if (!visited.has(ns) && !dead.has(ns)) {
          visited.add(ns);
          hooks.onVisit?.(ns, d + 1);
          q.push([ns, d + 1]);
        }
      }
    }
  }
  hooks.onResult?.(-1);
  return -1;
}
