export type Logical = { tag: string; text: string };
export interface TsHooks {
  onLogical?: (i: number, l: Logical) => void;
  onRender?: (html: string) => void;
}
export function twoStep<T>(
  data: T[],
  toLogical: (r: T) => Logical,
  theme: (l: Logical) => string,
  hooks: TsHooks = {},
): string {
  const html = data
    .map((r, i) => {
      const l = toLogical(r);
      hooks.onLogical?.(i, l);
      return theme(l);
    })
    .join('');
  hooks.onRender?.(html);
  return html;
}
