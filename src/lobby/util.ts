// =============================================================================
// Lobby 小工具
// =============================================================================

/** 读取 CSS 变量的计算值（带回退）。 */
export function getCssVar(name: string): string {
  if (typeof window === 'undefined') return '';
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v;
}

/** 根据复杂度字符串估算一个粗略的「量级」分组，便于筛选。 */
export function complexityBucket(time: string): string {
  const t = time.toLowerCase();
  if (t.includes('1') && t.includes(')')) return 'O(1)';
  if (t.includes('log')) return 'O(log n)';
  if (t.includes('n)') && !t.includes('n ')) return 'O(n)';
  if (t.includes('n log')) return 'O(n log n)';
  if (t.includes('n^2') || t.includes('n²')) return 'O(n²)';
  if (t.includes('2^n') || t.includes('2ⁿ')) return 'O(2ⁿ)';
  if (t.includes('n!')) return 'O(n!)';
  return 'other';
}

/** 把本地化的中英文名/摘要合并成可搜索的字符串。 */
export function searchable(meta: {
  title: { zh: string; en: string };
  summary: { zh: string; en: string };
  tags: string[];
}): string {
  return [meta.title.zh, meta.title.en, meta.summary.zh, meta.summary.en, ...meta.tags]
    .join(' ')
    .toLowerCase();
}
