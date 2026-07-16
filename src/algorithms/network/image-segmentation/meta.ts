// 图像分割（Graph Cut Image Segmentation）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'image-segmentation',
  categoryId: 'network',
  title: { zh: '图像分割（s-t 最小割）', en: 'Image Segmentation (s-t Min-Cut)' },
  summary: {
    zh: '把像素前景/背景二分建模为 s-t 最小割：源=前景，汇=背景。',
    en: 'Model foreground/background pixel partitioning as an s-t min-cut: source=foreground, sink=background.',
  },
  description: {
    zh: 'GrabCut/Boykov-Jolly 风格的图割分割：把每个像素当作图节点，建两类边：\n\n1. **n-链（邻域边）**：相邻像素 p、q 之间连一条无向边，权重 B(p,q) 反映「平滑项」——两个像素颜色越接近，权越大，被割开的代价越高（鼓励相邻像素同类）。\n2. **t-链（终端边）**：每个像素 p 与源 s（前景）和汇 t（背景）各连一条边。权重由像素对前景/背景的「似然」决定：颜色越像前景，s→p 权越大；越像背景，p→t 权越大。\n\n最小 s-t 割把所有边分成两集合：与 s 同侧的像素=前景，与 t 同侧=背景。最小割=最大分割能量下的最优分割（Boykov-Kolmogorov 推进-重标 max-flow 求解）。\n\n本实现用 Edmonds-Karp 求解小图，并支持硬约束（种子像素）。结果是一个 0/1 数组（0=背景，1=前景）。',
    en: 'GrabCut/Boykov-Jolly style graph-cut segmentation: each pixel is a node, with two kinds of edges:\n\n1. **n-links (neighborhood)**: between adjacent pixels p,q, weight B(p,q) reflects smoothness — similar colors get large weight (costly to cut, encouraging same label).\n2. **t-links (terminal)**: each pixel p connects to source s (foreground) and sink t (background). Weights come from likelihoods: colors likely foreground get large s→p; likely background get large p→t.\n\nThe min s-t cut partitions pixels: those on s-side are foreground, t-side background. Min cut = optimal segmentation energy (solved by Boykov-Kolmogorov push-relabel max-flow).\n\nThis implementation uses Edmonds-Karp on small grids and supports hard constraints (seeds). Output is a 0/1 array (0=background, 1=foreground).',
  },
  tags: ['network', 'min-cut', 'application', 'image-segmentation', 'graph-cut'],
  complexity: { time: 'O(V·E²)', space: 'O(V + E)' },
  references: [
    {
      label: 'Boykov-Jolly (2001) Interactive Graph Cuts',
      url: 'https://link.springer.com/article/10.1023/A:1012596801871',
    },
  ],
};
