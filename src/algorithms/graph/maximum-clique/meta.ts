import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'maximum-clique',
  categoryId: 'graph',
  title: { zh: '最大团', en: 'Maximum Clique' },
  summary: {
    zh: 'Bron-Kerbosch 带 pivot 与退化序，枚举极大团并取最大者。',
    en: 'Bron-Kerbosch with pivoting and degeneracy order finds the largest clique.',
  },
  description: {
    zh: '团（clique）是两两相邻的顶点集合；最大团是顶点数最多的团，其求解是 NP 困难。Bron-Kerbosch 算法递归维护三元组 (R=当前团, P=候选, X=已排除)：当 P、X 均空时 R 是极大团。引入 pivot u 后只递归 P\\N(u)，配合退化序外层遍历，可在 O(3^(n/3)) 内枚举所有极大团，从而得到最大团。',
    en: 'A clique is a pairwise-adjacent vertex set; finding the largest is NP-hard. Bron-Kerbosch recurses on (R=current clique, P=candidates, X=excluded); when P and X are empty, R is maximal. Pivoting (recurse only on P\\N(u)) and a degeneracy outer order enumerate all maximal cliques in O(3^(n/3)), yielding the maximum clique.',
  },
  tags: ['graph', 'clique', 'bron-kerbosch', 'np-hard', 'backtracking'],
  complexity: { time: 'O(3^(n/3))', space: 'O(n²)' },
};
