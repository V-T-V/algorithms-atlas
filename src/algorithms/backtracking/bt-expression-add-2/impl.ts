// =============================================================================
// 表达式加运算符 · 纯算法实现
// 回溯插入 + - * ，维护当前总和与上一项以处理乘法。
// =============================================================================
export interface BtExpressionAdd2Hooks {
  onPick?: (expr: string, value: number) => void;
  onEmit?: (expr: string) => void;
}

export function btExpressionAdd2(
  num: string,
  target: number,
  hooks: BtExpressionAdd2Hooks = {},
): string[] {
  const result: string[] = [];
  const n = num.length;

  const dfs = (idx: number, expr: string, value: number, prev: number): void => {
    if (idx === n) {
      if (value === target) {
        result.push(expr);
        hooks.onEmit?.(expr);
      }
      return;
    }
    for (let j = idx + 1; j <= n; j++) {
      const segStr = num.slice(idx, j);
      // 前导零限制
      if (segStr.length > 1 && segStr[0] === '0') break;
      const cur = Number(segStr);
      hooks.onPick?.(idx === 0 ? segStr : expr + '+' + segStr, idx === 0 ? cur : value + cur);
      if (idx === 0) {
        dfs(j, segStr, cur, cur);
      } else {
        dfs(j, expr + '+' + cur, value + cur, cur);
        dfs(j, expr + '-' + cur, value - cur, -cur);
        // 乘法：撤销上一项，改用 prev*cur
        dfs(j, expr + '*' + cur, value - prev + prev * cur, prev * cur);
      }
    }
  };

  if (n > 0) dfs(0, '', 0, 0);
  return result;
}
