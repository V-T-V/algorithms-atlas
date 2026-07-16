// 字符串相乘 · 实现
export interface MultiplyStrHooks {
  onPartial?: (i: number, j: number, prod: number) => void;
  onConclude?: (result: string) => void;
}
export function miscMultiplyStr(num1: string, num2: string, hooks: MultiplyStrHooks = {}): string {
  if (num1 === '0' || num2 === '0') return '0';
  const m = num1.length;
  const n = num2.length;
  const pos: number[] = new Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const prod = Number(num1[i]!) * Number(num2[j]!) + pos[i + j + 1]!;
      hooks.onPartial?.(i, j, prod);
      pos[i + j + 1] = prod % 10;
      pos[i + j]! += Math.floor(prod / 10);
    }
  }
  let result = pos.join('').replace(/^0+/, '');
  if (result === '') result = '0';
  hooks.onConclude?.(result);
  return result;
}
