export type Expr = { eval: (ctx: Map<string, number>) => number };
export const num = (v: number): Expr => ({ eval: () => v });
export const varr = (name: string): Expr => ({ eval: (ctx) => ctx.get(name) ?? 0 });
export const addE = (a: Expr, b: Expr): Expr => ({ eval: (ctx) => a.eval(ctx) + b.eval(ctx) });
export const mulE = (a: Expr, b: Expr): Expr => ({ eval: (ctx) => a.eval(ctx) * b.eval(ctx) });
export interface IpHooks {
  onEval?: (depth: number, val: number) => void;
}
export function evaluate(
  e: Expr,
  ctx: Map<string, number>,
  hooks: IpHooks = {},
  depth = 0,
): number {
  const v = e.eval(ctx);
  hooks.onEval?.(depth, v);
  return v;
}
