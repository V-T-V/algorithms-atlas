export class FormatHelper {
  static money(n: number, sym: string): string {
    return sym + n.toFixed(2);
  }
  static date(d: Date): string {
    return d.toISOString().slice(0, 10);
  }
  static truncate(s: string, n: number): string {
    return s.length <= n ? s : s.slice(0, n) + '...';
  }
}
export interface VhHooks {
  onFormat?: (kind: string, out: string) => void;
}
export function renderView(price: number, title: string, hooks: VhHooks = {}): string {
  const p = FormatHelper.money(price, '$');
  hooks.onFormat?.('money', p);
  const t = FormatHelper.truncate(title, 10);
  hooks.onFormat?.('truncate', t);
  return '<h1>' + t + '</h1><span>' + p + '</span>';
}
