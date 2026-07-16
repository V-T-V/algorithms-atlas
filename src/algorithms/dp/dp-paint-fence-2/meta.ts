import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-paint-fence-2',
  categoryId: 'dp',
  title: { zh: '栅栏涂色（最多 2 同色）', en: 'Paint Fence (≤2 Adjacent Same)' },
  summary: {
    zh: 'k 种颜色涂 n 根栅栏，任意 3 相邻不能同色，求方案数。',
    en: 'Paint n fences with k colors; no three adjacent fences may share a color.',
  },
  description: {
    zh: 'LeetCode 276。same[i] = 与上一根同色方案数；diff[i] = 不同色方案数。same[i]=diff[i-1]；diff[i]=(same[i-1]+diff[i-1])*(k-1)。总数=same+diff。',
    en: 'LC 276. same[i]=diff[i-1]; diff[i]=(same+diff)*(k-1). Total=same+diff.',
  },
  tags: ['dp', 'combinatorics', 'counting'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
