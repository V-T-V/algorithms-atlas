export interface RcuHooks {
  onRead?: (val: number) => void;
  onWrite?: (old: number, neu: number) => void;
  onGrace?: () => void;
}
export function rcuModel(
  initial: number,
  writes: number[],
  reads: number,
  hooks: RcuHooks = {},
): number {
  let cur = initial;
  let gen = 0;
  for (let r = 0; r < reads; r++) hooks.onRead?.(cur);
  for (const w of writes) {
    const neu = cur + w;
    hooks.onWrite?.(cur, neu);
    cur = neu;
    gen++;
    hooks.onGrace?.();
  }
  return cur;
}
