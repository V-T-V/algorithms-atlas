// 除自身以外数组的乘积 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-array-product-except',
  categoryId: 'recursion',
  title: { zh: '除自身以外数组的乘积（递归）', en: 'Product of Array Except Self (Recursive)' },
  summary: {
    zh: '递归前缀积 + 后缀积，O(n) 求每个位置除自身外所有元素的乘积，不用除法。',
    en: 'Recursively compute prefix and suffix products to get, in O(n) and without division, each positions product of all other elements.',
  },
  description: {
    zh: '经典问题：给定数组 nums，返回数组 answer，answer[i] = nums 中除 nums[i] 之外各元素的乘积。要求不用除法、O(n)。递归解法：用两个递归函数分别从左、右累积前缀积与后缀积。prefix(i) 累积 nums[0..i-1] 的积，suffix(i) 累积 nums[i+1..n-1] 的积，answer[i] = prefix(i)·suffix(i)。本实现用递归填充前缀/后缀数组。',
    en: 'Classic problem: given nums, return answer where answer[i] = product of all elements except nums[i], without division in O(n). Recursive solution: two recursions accumulate prefix and suffix products. prefix(i) holds the product of nums[0..i-1], suffix(i) holds nums[i+1..n-1], and answer[i] = prefix(i)·suffix(i). This implementation fills prefix/suffix arrays recursively.',
  },
  tags: ['recursion', 'array', 'prefix-product', 'suffix-product'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
