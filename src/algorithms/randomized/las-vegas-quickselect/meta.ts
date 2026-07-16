// Las Vegas Quickselect · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'las-vegas-quickselect',
  categoryId: 'randomized',
  title: {
    zh: 'Las Vegas 快速选择（随机化快速选择）',
    en: 'Las Vegas Quickselect (Randomized Quickselect)',
  },
  summary: {
    zh: '随机化选第 k 小：每次随机选 pivot 划分。结果始终正确（Las Vegas），期望时间 O(n)。',
    en: 'Randomized selection of the k-th smallest: partition around a random pivot. Result is always correct (Las Vegas), expected O(n) time.',
  },
  description: {
    zh: '快速选择（Quickselect）是 Hoare 选择算法的随机化版本：要找数组中第 k 小（0 基）的元素。每次随机均匀地选取一个 pivot，用 Lomuto/Hoare 划分把数组分成小于、等于、大于三段，根据 k 落在哪段递归（只递归其中一段，不合并）。与「总是确定型选 pivot」相比，随机化 pivot 让最坏情况 O(n²) 的概率极低：期望比较次数 < 4n，期望时间为 Θ(n)。这是 Las Vegas 算法——结果永远正确，只有运行时间是随机的。它是「随机化把指数/高次最坏情况变成期望多项式」的教科书例子，与 Monte Carlo（可能出错）形成对比。',
    en: "Quickselect is the randomized version of Hoare's selection algorithm: find the k-th smallest (0-indexed) element of an array. At each step a pivot is chosen uniformly at random; a Lomuto/Hoare partition splits the array into less-than, equal, and greater-than segments, and we recurse into only the segment containing k (no merge). Compared to a deterministic pivot choice, randomization makes the worst-case O(n²) extremely unlikely: the expected number of comparisons is < 4n, with expected time Θ(n). This is a Las Vegas algorithm — the answer is always correct, only the running time is random. It is the textbook example of randomization turning an exponential/high-degree worst case into expected polynomial, contrasted with Monte Carlo (which may err).",
  },
  tags: ['randomized', 'selection', 'divide-and-conquer', 'las-vegas'],
  complexity: { time: 'Θ(n) expected', space: 'O(log n) expected' },
};
