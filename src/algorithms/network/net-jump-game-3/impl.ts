export interface JgHooks {
  onVisit?: (i: number) => void;
  onResult?: (ok: boolean) => void;
}
export function canReach(arr: number[], start: number, hooks: JgHooks = {}): boolean {
  const n = arr.length;
  const visited = new Array(n).fill(false);
  const q: number[] = [start];
  visited[start] = true;
  while (q.length) {
    const i = q.shift()!;
    hooks.onVisit?.(i);
    if (arr[i] === 0) {
      hooks.onResult?.(true);
      return true;
    }
    for (const ni of [i + arr[i]!, i - arr[i]!])
      if (ni >= 0 && ni < n && !visited[ni]) {
        visited[ni] = true;
        q.push(ni);
      }
  }
  hooks.onResult?.(false);
  return false;
}
