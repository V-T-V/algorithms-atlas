import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-attendance-2',
  categoryId: 'dp',
  title: { zh: '学生出勤记录 II', en: 'Student Attendance Record II' },
  summary: {
    zh: '长度为 n 的串，A<2 且无连续 3 个 L，统计合法出勤记录方案数。',
    en: 'Count attendance strings of length n with <2 A and no "LLL", modulo 1e9+7.',
  },
  description: {
    zh: 'LeetCode 552。状态 dp[A][L]：A 表示已用缺勤数(0/1)，L 表示末尾连续迟到数(0/1/2)。每次添 P/L/A。共 6 个状态滚动。',
    en: 'LC 552. State dp[A][L] with A∈{0,1} and L∈{0,1,2}. Add P/L/A each step; 6-state rolling.',
  },
  tags: ['dp', 'state-machine', 'counting'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
