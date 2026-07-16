// =============================================================================
// 移位字符串分组 · 纯算法实现
// =============================================================================

export interface ShiftHooks {
  onKey?: (s: string, key: string) => void;
  onGroup?: (key: string, members: string[]) => void;
}

/** 计算移位签名：相邻字符的 (cur - prev + 26) % 26 序列。单字符签名为空串。 */
export function shiftedKey(s: string): string {
  if (s.length <= 1) return '';
  const parts: string[] = [];
  for (let i = 1; i < s.length; i++) {
    const diff = (((s.charCodeAt(i) - s.charCodeAt(i - 1)) % 26) + 26) % 26;
    parts.push(`${diff}`);
  }
  return parts.join(',');
}

/** 判定 a、b 是否可经统一移位互得。 */
export function isShiftEquivalent(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return shiftedKey(a) === shiftedKey(b);
}

/** 按移位等价分组。 */
export function groupShifted(strs: string[], hooks: ShiftHooks = {}): string[][] {
  const map = new Map<string, string[]>();
  for (const s of strs) {
    const key = shiftedKey(s);
    hooks.onKey?.(s, key);
    const arr = map.get(key);
    if (arr) arr.push(s);
    else map.set(key, [s]);
  }
  const groups = [...map.values()];
  for (const [key, members] of map) hooks.onGroup?.(key, members);
  return groups;
}
