// 独裁者博弈 · 实现
export interface DictHooks {
  onGive?: (g: number) => void;
  onPayoff?: (dictator: number, recipient: number) => void;
}
export function dictatorGame(
  endowment: number,
  give: number,
  hooks: DictHooks = {},
): { dictator: number; recipient: number } {
  hooks.onGive?.(give);
  const d = endowment - give,
    r = give;
  hooks.onPayoff?.(d, r);
  return { dictator: d, recipient: r };
}
