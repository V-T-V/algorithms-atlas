export interface GraphInput {
  left: string[];
  right: string[];
  edges: Array<{ from: string; to: string }>;
}
export interface MatchHooks {
  onMatch?: (a: string, b: string) => void;
  onResult?: (size: number) => void;
}
export function greedyMatching(g: GraphInput, hooks: MatchHooks = {}): number {
  const matchedL = new Set<string>(),
    matchedR = new Set<string>();
  let size = 0;
  for (const e of g.edges) {
    if (!matchedL.has(e.from) && !matchedR.has(e.to)) {
      matchedL.add(e.from);
      matchedR.add(e.to);
      size++;
      hooks.onMatch?.(e.from, e.to);
    }
  }
  hooks.onResult?.(size);
  return size;
}
