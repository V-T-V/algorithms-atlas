// 后缀数组 · 纯算法实现
export function buildSuffixArray(s: string): number[] {
  const n = s.length;
  const sa = Array.from({ length: n }, (_, i) => i);
  sa.sort((a, b) => {
    let i = a,
      j = b;
    while (i < n && j < n) {
      if (s[i] !== s[j]) return s.charCodeAt(i) - s.charCodeAt(j);
      i++;
      j++;
    }
    return n - a - (n - b);
  });
  return sa;
}
