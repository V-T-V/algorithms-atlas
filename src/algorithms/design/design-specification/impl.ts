export type Spec<T> = { isSatisfiedBy: (t: T) => boolean };
export function andSpec<T>(a: Spec<T>, b: Spec<T>): Spec<T> {
  return { isSatisfiedBy: (t) => a.isSatisfiedBy(t) && b.isSatisfiedBy(t) };
}
export function orSpec<T>(a: Spec<T>, b: Spec<T>): Spec<T> {
  return { isSatisfiedBy: (t) => a.isSatisfiedBy(t) || b.isSatisfiedBy(t) };
}
export function notSpec<T>(a: Spec<T>): Spec<T> {
  return { isSatisfiedBy: (t) => !a.isSatisfiedBy(t) };
}
export interface SpHooks {
  onCheck?: (item: number, ok: boolean) => void;
}
export function filterBy<T>(items: T[], spec: Spec<T>, hooks: SpHooks = {}): T[] {
  return items.filter((it, i) => {
    const ok = spec.isSatisfiedBy(it);
    hooks.onCheck?.(i, ok);
    return ok;
  });
}
