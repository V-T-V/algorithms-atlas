// 队列重建 · 实现
export interface Person {
  h: number;
  k: number;
}
export interface QueueHooks {
  onInsert?: (idx: number, p: Person) => void;
  onConclude?: (queue: Person[]) => void;
}
export interface QueueResult {
  queue: Person[];
}
export function greedyQueue2(people: ReadonlyArray<Person>, hooks: QueueHooks = {}): QueueResult {
  const sorted = [...people].sort((a, b) => (a.h !== b.h ? b.h - a.h : a.k - b.k));
  const queue: Person[] = [];
  for (const p of sorted) {
    queue.splice(p.k, 0, p);
    hooks.onInsert?.(p.k, p);
  }
  hooks.onConclude?.(queue);
  return { queue };
}
