export interface PforHooks {
  onBlock?: (b: number, exc: number) => void;
}
export function pforDeltaEncode(
  values: number[],
  b: number,
  hooks: PforHooks = {},
): { core: number[]; exc: Array<{ idx: number; val: number }> } {
  const mask = (1 << b) - 1;
  const core: number[] = [];
  const exc: Array<{ idx: number; val: number }> = [];
  values.forEach((v, i) => {
    if (v >= 0 && v <= mask) core.push(v);
    else {
      core.push(0);
      exc.push({ idx: i, val: v });
      hooks.onBlock?.(b, exc.length);
    }
  });
  return { core, exc };
}
