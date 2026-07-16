export interface RiHooks {
  onVisit?: (from: string, to: string) => void;
  onResult?: (path: string[]) => void;
}
export function findItinerary(tickets: Array<[string, string]>, hooks: RiHooks = {}): string[] {
  const adj = new Map<string, string[]>();
  const ensure = (k: string) => {
    if (!adj.has(k)) adj.set(k, []);
  };
  for (const [f, t] of tickets) {
    ensure(f);
    ensure(t);
    adj.get(f)!.push(t);
  }
  for (const [, list] of adj) list.sort().reverse();
  const path: string[] = [];
  const stack: string[] = ['JFK'];
  while (stack.length) {
    const top = stack[stack.length - 1]!;
    const list = adj.get(top);
    if (list && list.length) {
      const next = list.pop()!;
      hooks.onVisit?.(top, next);
      stack.push(next);
    } else {
      path.push(stack.pop()!);
    }
  }
  path.reverse();
  hooks.onResult?.(path);
  return path;
}
