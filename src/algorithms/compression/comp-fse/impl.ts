export interface FseHooks {
  onState?: (state: number, sym: number) => void;
}
export function fseEncode(
  symbols: number[],
  stateTable: Map<number, number[]>,
  hooks: FseHooks = {},
): number {
  let state = 0;
  for (const sym of symbols) {
    const states = stateTable.get(sym) ?? [0];
    state = states[state % states.length]!;
    hooks.onState?.(state, sym);
  }
  return state;
}
