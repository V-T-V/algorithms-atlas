// 简化路径 · 实现
export interface SimplifyPathHooks {
  onToken?: (token: string) => void;
  onConclude?: (result: string) => void;
}
export function miscSimplifyPath(path: string, hooks: SimplifyPathHooks = {}): string {
  const stack: string[] = [];
  const parts = path.split('/');
  for (const p of parts) {
    hooks.onToken?.(p);
    if (p === '' || p === '.') continue;
    if (p === '..') stack.pop();
    else stack.push(p);
  }
  const result = '/' + stack.join('/');
  hooks.onConclude?.(result);
  return result;
}
