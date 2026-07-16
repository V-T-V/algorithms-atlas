// 二进制求和 · 实现
export interface AddBinaryHooks {
  onDigit?: (carry: number, sum: number) => void;
  onConclude?: (result: string) => void;
}
export function miscAddBinary2(a: string, b: string, hooks: AddBinaryHooks = {}): string {
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;
  const out: string[] = [];
  while (i >= 0 || j >= 0 || carry > 0) {
    const da = i >= 0 ? Number(a[i]!) : 0;
    const db = j >= 0 ? Number(b[j]!) : 0;
    const sum = da + db + carry;
    hooks.onDigit?.(carry, sum);
    out.push(String(sum % 2));
    carry = Math.floor(sum / 2);
    i--;
    j--;
  }
  const result = out.reverse().join('');
  hooks.onConclude?.(result);
  return result;
}
