export interface BrHooks {
  onEcho?: (node: number) => void;
  onReady?: (node: number) => void;
  onDeliver?: (node: number) => void;
}
export function brachaBroadcast(
  n: number,
  f: number,
  hooks: BrHooks = {},
): { delivered: number; ok: boolean } {
  const echoes: number[] = [];
  const readies: number[] = [];
  let delivered = 0;
  for (let i = 0; i < n; i++) {
    echoes.push(i);
    hooks.onEcho?.(i);
  }
  for (let i = 0; i < n; i++) {
    if (echoes.length >= (n + f) / 2 || readies.length >= f + 1) {
      readies.push(i);
      hooks.onReady?.(i);
    }
  }
  for (let i = 0; i < n; i++) {
    if (readies.length >= 2 * f + 1) {
      delivered++;
      hooks.onDeliver?.(i);
    }
  }
  return { delivered, ok: delivered === n };
}
