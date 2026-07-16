// 二分图最小点覆盖（König 定理）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bipartite-vertex-cover',
  categoryId: 'network',
  title: { zh: '二分图最小点覆盖', en: 'Bipartite Minimum Vertex Cover' },
  summary: {
    zh: '由最大匹配构造最小点覆盖（König 定理）：覆盖大小 = 最大匹配数。',
    en: "Build a minimum vertex cover from a maximum matching (König's theorem); cover size = matching size.",
  },
  description: {
    zh: '在二分图中，**最小点覆盖**的大小等于**最大匹配**的大小（König 定理，1931）。\n\n构造算法：\n1. 先用 Kuhn 算法求一个最大匹配，得到 `matchR[r]`（与右点 r 匹配的左点）。\n2. 从所有**未匹配**的左点出发，沿「交替路」做 DFS：从左点 u 走未匹配边到右点 r，再从 r 走匹配边到 `matchR[r]`，如此交替。标记访问到的左点集 Z_L 与右点集 Z_R。\n3. 最小覆盖 = `(L \\ Z_L) ∪ Z_R`：即「未被访问的左点」+「被访问的右点」。\n\n直观理解：每条匹配边至少有一端在覆盖里；交替路构造保证每条未匹配边也被覆盖。覆盖大小恰为最大匹配数。',
    en: 'In bipartite graphs, the **minimum vertex cover** size equals the **maximum matching** size (König\'s theorem, 1931).\n\nConstruction:\n1. Compute a maximum matching (Kuhn), obtaining `matchR[r]` (left vertex matched to right r).\n2. From every **unmatched** left vertex, run DFS along "alternating paths": from u take an unmatched edge to a right vertex r, then the matched edge from r to `matchR[r]`, alternating. Mark visited lefts Z_L and rights Z_R.\n3. Min cover = `(L \\ Z_L) ∪ Z_R`: unvisited lefts + visited rights.\n\nIntuition: each matched edge has at least one endpoint in the cover; the alternating construction also covers every unmatched edge. The cover size equals the matching size.',
  },
  tags: ['network', 'vertex-cover', 'konig-theorem', 'bipartite'],
  complexity: { time: 'O(V·E)', space: 'O(V + E)' },
};
