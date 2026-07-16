export interface FenceHooks {
  onInstr?: (op: string) => void;
  onFence?: () => void;
  onReorderBlocked?: () => void;
}
export function memoryFenceModel(
  program: string[],
  hooks: FenceHooks = {},
): { order: string[]; fences: number } {
  const order: string[] = [];
  let fences = 0;
  for (const op of program) {
    if (op === 'fence') {
      fences++;
      hooks.onFence?.();
      hooks.onReorderBlocked?.();
    } else hooks.onInstr?.(op);
    order.push(op);
  }
  return { order, fences };
}
