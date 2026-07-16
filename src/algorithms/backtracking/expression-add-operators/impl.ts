// =============================================================================
// 表达式加运算符（Expression Add Operators）· 纯算法实现
// 回溯枚举数段与运算符；用 sum/last 处理乘法优先级。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface ExpressionAddOperatorsHooks {
  /** 选定一个数段 [start, end]，值为 value。 */
  onSegment?: (start: number, end: number, value: number) => void;
  /** 在新数段前插入运算符 op（首个数段 op 为空）。 */
  onOperator?: (op: '+' | '-' | '*' | '', operand: number) => void;
  /** 命中一个合法表达式。 */
  onSolution?: (expr: string, value: number) => void;
  /** 剪枝：前导零非法数段。 */
  onPrune?: (segment: string) => void;
}

/**
 * 在数字串中插入 +、-、* 使表达式等于 target。
 *
 * @param num 数字字符串
 * @param target 目标值
 * @param hooks 可选事件钩子
 * @returns 所有合法表达式
 */
export function expressionAddOperators(
  num: string,
  target: number,
  hooks: ExpressionAddOperatorsHooks = {},
): string[] {
  const result: string[] = [];
  const n = num.length;
  if (n === 0) return result;

  const expr: string[] = [];

  const backtrack = (start: number, sum: number, last: number, exprStr: string): void => {
    if (start === n) {
      if (sum === target) {
        result.push(exprStr);
        hooks.onSolution?.(exprStr, sum);
      }
      return;
    }
    // 选一段 [start, end]（含 start；end 递增）
    for (let end = start + 1; end <= n; end++) {
      const seg = num.slice(start, end);
      const cur = Number(seg);
      // 前导零剪枝：长度>1 且以 0 开头非法
      if (seg.length > 1 && seg[0] === '0') {
        hooks.onPrune?.(seg);
        break;
      }
      hooks.onSegment?.(start, end - 1, cur);

      if (start === 0) {
        // 第一个数段，无运算符
        hooks.onOperator?.('', cur);
        expr.push(seg);
        backtrack(end, cur, cur, seg);
        expr.pop();
      } else {
        // '+'
        hooks.onOperator?.('+', cur);
        expr.push('+', seg);
        backtrack(end, sum + cur, cur, exprStr + '+' + seg);
        expr.pop();
        expr.pop();
        // '-'
        hooks.onOperator?.('-', cur);
        expr.push('-', seg);
        backtrack(end, sum - cur, -cur, exprStr + '-' + seg);
        expr.pop();
        expr.pop();
        // '*'：撤销 last，改成 last*cur
        hooks.onOperator?.('*', cur);
        expr.push('*', seg);
        backtrack(end, sum - last + last * cur, last * cur, exprStr + '*' + seg);
        expr.pop();
        expr.pop();
      }
    }
  };

  backtrack(0, 0, 0, '');
  return result;
}
