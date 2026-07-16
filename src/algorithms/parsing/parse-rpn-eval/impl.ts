// 逆波兰求值 · 纯算法实现
export const RPN_OPS: Record<string, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  '%': (a, b) => a % b,
  '^': (a, b) => Math.pow(a, b),
};

export interface RpnHooks {
  onPush?: (value: number) => void;
  onApply?: (op: string, left: number, right: number, result: number) => void;
}

export function rpnEval(tokens: readonly string[], hooks: RpnHooks = {}): number {
  const stack: number[] = [];
  for (const tk of tokens) {
    const op = RPN_OPS[tk];
    if (op) {
      const b = stack.pop()!;
      const a = stack.pop()!;
      const r = op(a, b);
      hooks.onApply?.(tk, a, b, r);
      stack.push(r);
      hooks.onPush?.(r);
    } else {
      const v = Number(tk);
      stack.push(v);
      hooks.onPush?.(v);
    }
  }
  if (stack.length !== 1) throw new Error('invalid RPN expression');
  return stack[0]!;
}
