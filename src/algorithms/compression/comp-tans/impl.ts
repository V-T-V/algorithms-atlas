// tANS · 实现（简化：构建转移表 + 查表）
export interface TansEntry {
  sym: number;
  nextState: number;
}
export interface TansHooks {
  onTable?: (table: TansEntry[]) => void;
  onEncode?: (sym: number, state: number) => void;
}
export function tansBuildTable(symbols: number[], L: number): TansEntry[] {
  // 简化：均匀分配状态
  const table: TansEntry[] = [];
  const perSym = Math.floor(L / symbols.length);
  for (let i = 0; i < L; i++) {
    const sym = symbols[i % symbols.length]!;
    table.push({ sym, nextState: (i + 1) % L });
  }
  void perSym;
  return table;
}
export function tansEncode(
  data: number[],
  table: TansEntry[],
  L: number,
  hooks: TansHooks = {},
): number {
  hooks.onTable?.(table);
  let state = L - 1;
  for (let i = data.length - 1; i >= 0; i--) {
    const entry = table[state]!;
    state = entry.nextState;
    hooks.onEncode?.(data[i]!, state);
  }
  return state;
}
