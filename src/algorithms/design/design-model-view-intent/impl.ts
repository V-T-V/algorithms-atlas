export type Intent = { type: string; payload: number };
export type Model = { count: number };
export type View = string;
export function reduce(m: Model, intent: Intent): Model {
  switch (intent.type) {
    case 'inc':
      return { count: m.count + intent.payload };
    case 'dec':
      return { count: m.count - intent.payload };
    default:
      return m;
  }
}
export function view(m: Model): View {
  return 'count=' + m.count;
}
export interface MviHooks {
  onIntent?: (i: Intent) => void;
  onModel?: (m: Model) => void;
  onView?: (v: View) => void;
}
export function cycle(
  m: Model,
  intent: Intent,
  hooks: MviHooks = {},
): { model: Model; view: View } {
  hooks.onIntent?.(intent);
  const nm = reduce(m, intent);
  hooks.onModel?.(nm);
  const v = view(nm);
  hooks.onView?.(v);
  return { model: nm, view: v };
}
