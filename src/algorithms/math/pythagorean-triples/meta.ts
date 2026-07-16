import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pythagorean-triples',
  categoryId: 'math',
  title: { zh: '勾股数生成', en: 'Pythagorean Triples' },
  summary: {
    zh: '欧几里得公式：a=m²-n², b=2mn, c=m²+n² 生成本原勾股数。',
    en: "Euclid's formula: a=m²-n², b=2mn, c=m²+n² generates primitive triples.",
  },
  description: {
    zh: '勾股数是满足 a²+b²=c² 的正整数组。本原勾股数 gcd(a,b,c)=1 且 a 为奇、b 为偶。欧几里得公式：对任意 m>n≥1，满足 gcd(m,n)=1 且 m-n 为奇数时，(m²-n², 2mn, m²+n²) 给出全部本原勾股数（不计 a/b 顺序）。把这些本原三元组乘以任意正整数 k 即得所有勾股数。本实现枚举 c≤上限 的全部本原勾股数，并可扩展为全体勾股数。时间约 O(上限)。',
    en: "A Pythagorean triple (a,b,c) satisfies a²+b²=c². A primitive triple has gcd 1 with a odd, b even. Euclid's formula: for m>n>=1 with gcd(m,n)=1 and m-n odd, (m²-n², 2mn, m²+n²) yields all primitive triples up to swapping a,b; multiplying by any positive k gives all triples. This implementation enumerates primitive triples with c up to a bound and can extend to all triples. Time about O(bound).",
  },
  tags: ['math', 'number-theory', 'pythagorean', 'euclid', 'generation'],
  complexity: { time: 'O(maxC)', space: 'O(maxC)' },
};
