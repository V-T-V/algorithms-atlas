// =============================================================================
// 跨越式棋盘密码 · 纯算法实现
// 默认布局：
//   行0（无前缀）：8 字母 ESTONIAR 映射 0..7
//   行1（前缀 8）：8 字母 BCDFGHKL 映射 80..87
//   行2（前缀 9）：10 字符 JMPQUVWXYZ 映射 90..99
// =============================================================================
const ROW0 = 'ESTONIAR'; // 8 字母 -> 0..7
const ROW1 = 'BCDFGHKL'; // 8 字母 -> 80..87（前缀 8）
const ROW2 = 'JMPQUVWXYZ'; // 10 字母 -> 90..99（前缀 9）

export interface StraddlingHooks {
  onTable?: (desc: string) => void;
  onChar?: (i: number, original: string, code: string) => void;
}

function buildTable(): Map<string, string> {
  const m = new Map<string, string>();
  for (let i = 0; i < ROW0.length; i++) m.set(ROW0[i]!, String(i));
  for (let i = 0; i < ROW1.length; i++) m.set(ROW1[i]!, '8' + i);
  for (let i = 0; i < ROW2.length; i++) m.set(ROW2[i]!, '9' + i);
  return m;
}

export function straddlingEncrypt(text: string, hooks: StraddlingHooks = {}): string {
  const table = buildTable();
  hooks.onTable?.(`${ROW0}|${ROW1}|${ROW2}`);
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const up = text[i]!.toUpperCase();
    if (table.has(up)) {
      const code = table.get(up)!;
      out += code;
      hooks.onChar?.(i, text[i]!, code);
    }
  }
  return out;
}
