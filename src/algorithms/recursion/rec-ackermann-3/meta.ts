// 阿克曼函数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-ackermann-3',
  categoryId: 'recursion',
  title: { zh: '阿克曼函数', en: 'Ackermann Function' },
  summary: {
    zh: 'A(m,n)：经典的非原始递归函数，增长极快。基线 A(0,n)=n+1。',
    en: 'A(m,n): classic non-primitive-recursive function with explosive growth. Base A(0,n)=n+1.',
  },
  description: {
    zh: '阿克曼函数：A(0,n)=n+1；A(m,0)=A(m−1,1)；A(m,n)=A(m−1,A(m,n−1))。是计算理论的重要例子。',
    en: 'Ackermann: A(0,n)=n+1; A(m,0)=A(m−1,1); A(m,n)=A(m−1,A(m,n−1)). A key example in computability theory.',
  },
  tags: ['recursion', 'theory', 'ackermann'],
  complexity: { time: 'O(A(m,n))', space: 'O(m)' },
};
