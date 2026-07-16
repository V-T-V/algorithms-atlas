// =============================================================================
// 外星人词典 · 纯算法实现
// 相邻词比较建边 → Kahn 拓扑排序。
// =============================================================================

export interface AlienDictHooks {
  onEdge?: (from: string, to: string) => void;
  onOutput?: (ch: string) => void;
  onResult?: (order: string) => void;
}

export function alienOrder(words: string[], hooks: AlienDictHooks = {}): string {
  // 收集所有字母
  const adj = new Map<string, Set<string>>();
  const inDeg = new Map<string, number>();
  for (const w of words) {
    for (const ch of w) {
      if (!adj.has(ch)) {
        adj.set(ch, new Set());
        inDeg.set(ch, 0);
      }
    }
  }
  // 相邻词建边
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i]!;
    const b = words[i + 1]!;
    let foundDiff = false;
    const minLen = Math.min(a.length, b.length);
    for (let j = 0; j < minLen; j++) {
      if (a[j] !== b[j]) {
        if (!adj.get(a[j]!)!.has(b[j]!)) {
          adj.get(a[j]!)!.add(b[j]!);
          inDeg.set(b[j]!, (inDeg.get(b[j]!) ?? 0) + 1);
          hooks.onEdge?.(a[j]!, b[j]!);
        }
        foundDiff = true;
        break;
      }
    }
    // a 是 b 的前缀但更长 → 非法（a 应更小）
    if (!foundDiff && a.length > b.length) {
      hooks.onResult?.('');
      return '';
    }
  }
  // Kahn
  const queue: string[] = [];
  for (const [ch, d] of inDeg) if (d === 0) queue.push(ch);
  let order = '';
  while (queue.length > 0) {
    const u = queue.shift()!;
    order += u;
    hooks.onOutput?.(u);
    for (const v of adj.get(u) ?? []) {
      inDeg.set(v, (inDeg.get(v) ?? 0) - 1);
      if ((inDeg.get(v) ?? 0) === 0) queue.push(v);
    }
  }
  const result = order.length === inDeg.size ? order : '';
  hooks.onResult?.(result);
  return result;
}
