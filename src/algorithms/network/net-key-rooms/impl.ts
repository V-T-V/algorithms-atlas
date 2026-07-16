export interface KrHooks {
  onVisit?: (r: number) => void;
  onResult?: (ok: boolean) => void;
}
export function canVisitAllRooms(rooms: number[][], hooks: KrHooks = {}): boolean {
  const visited = new Set<number>([0]);
  const stack = [0];
  while (stack.length) {
    const r = stack.pop()!;
    hooks.onVisit?.(r);
    for (const k of rooms[r] ?? [])
      if (!visited.has(k)) {
        visited.add(k);
        stack.push(k);
      }
  }
  const ok = visited.size === rooms.length;
  hooks.onResult?.(ok);
  return ok;
}
