import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bell-number',
  categoryId: 'math',
  title: { zh: '贝尔数', en: 'Bell Number' },
  summary: {
    zh: 'n 个元素划分为任意非空集合的方案数，用 Bell 三角递推。',
    en: 'Number of partitions of n elements into any non-empty sets, via the Bell triangle.',
  },
  description: {
    zh: '贝尔数 B(n) 表示将 n 个不同元素划分为任意多个非空集合（划分）的方案总数。它等于第二类 Stirling 数之和：B(n)=Σ_k S(n,k)。本实现用 Bell 三角递推：构造下三角阵列，a[0][0]=1；每行首项 a[i][0]=a[i-1][i-1]（即上一行末项）；其余 a[i][j]=a[i-1][j-1]+a[i][j-1]。则 B(n)=a[n][0]，同时 a[n][n]=B(n+1)。时间 O(n²)。',
    en: 'The Bell number B(n) counts partitions of n distinct elements into any number of non-empty sets; it equals Σ_k S(n,k). This implementation uses the Bell triangle: a[0][0]=1; each row starts at a[i][0]=a[i-1][i-1] (previous row end); a[i][j]=a[i-1][j-1]+a[i][j-1]; then B(n)=a[n][0] and a[n][n]=B(n+1). Time O(n²).',
  },
  tags: ['math', 'combinatorics', 'bell', 'partition', 'recurrence'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
