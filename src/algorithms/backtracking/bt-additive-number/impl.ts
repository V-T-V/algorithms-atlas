// =============================================================================
// 累加数 · 纯算法实现 (LeetCode 306)
// 枚举前两个数长度，大数加法验证后续序列。
// =============================================================================
export interface BtAdditiveNumberHooks {
  onTryPrefix?: (first: string, second: string) => void;
  onTerm?: (a: string, b: string, sum: string) => void;
  onConclude?: (isAdditive: boolean) => void;
}

function addStr(a: string, b: string): string {
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;
  const out: string[] = [];
  while (i >= 0 || j >= 0 || carry > 0) {
    const x = i >= 0 ? Number(a[i--]) : 0;
    const y = j >= 0 ? Number(b[j--]) : 0;
    const sum = x + y + carry;
    out.push(String(sum % 10));
    carry = Math.floor(sum / 10);
  }
  return out.reverse().join('');
}

export function btAdditiveNumber(num: string, hooks: BtAdditiveNumberHooks = {}): boolean {
  const n = num.length;
  for (let i = 1; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const first = num.slice(0, i);
      const second = num.slice(i, j);
      if ((first.length > 1 && first[0] === '0') || (second.length > 1 && second[0] === '0')) {
        continue;
      }
      hooks.onTryPrefix?.(first, second);
      let a = first;
      let b = second;
      let k = j;
      let valid = true;
      while (k < n) {
        const sum = addStr(a, b);
        hooks.onTerm?.(a, b, sum);
        if (!num.startsWith(sum, k)) {
          valid = false;
          break;
        }
        k += sum.length;
        a = b;
        b = sum;
      }
      if (valid && k === n) {
        // 至少三个数
        if (j < n) {
          hooks.onConclude?.(true);
          return true;
        }
      }
    }
  }
  hooks.onConclude?.(false);
  return false;
}
