// 任务调度器（Task Scheduler, 冷却期版, LeetCode 621）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'task-scheduler-cooldown',
  categoryId: 'greedy',
  title: { zh: '任务调度器（冷却期）', en: 'Task Scheduler (Cooldown)' },
  summary: {
    zh: '同类任务需 n 单位冷却，求完成所有任务的最短时间（公式法）。',
    en: 'Same-type tasks need n cooldown; minimize total time (formula approach).',
  },
  description: {
    zh: '给定字符数组 tasks（每种字符代表一种任务）和冷却时间 n：CPU 一个单位时间执行一个任务，同种任务之间必须间隔至少 n 个单位时间（可执行别的任务或空闲）。求完成所有任务的最短时间。\n\n贪心公式法（与模拟法对照）：设最大频次为 maxFreq，达到该频次的任务有 maxCount 种。最短时间 = max( tasks.length, (maxFreq-1)*(n+1) + maxCount )。直觉：把最高频任务排成 (maxFreq-1) 段「桶」，每桶宽 (n+1)，最后一段接上所有 maxFreq 任务。其它任务填进桶的空隙；若填不满则用空闲，若填得满则总长就是 tasks.length。',
    en: 'Given a task array tasks (each char is a task type) and cooldown n: the CPU runs one task per unit time; between two same-type tasks there must be at least n units (filled with other tasks or idle). Minimize total time to finish all tasks.\n\nGreedy formula approach (contrast with simulation): let maxFreq be the highest frequency and maxCount be the number of task types reaching it. Answer = max( tasks.length, (maxFreq-1)*(n+1) + maxCount ). Intuition: arrange the most frequent task into (maxFreq-1) "buckets" each of width (n+1), then append the maxCount tasks in a final segment. Other tasks fill bucket gaps; unfilled gaps become idle, filled-up buckets mean the answer is just tasks.length.',
  },
  tags: ['greedy', 'counting', 'scheduling'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  references: [{ label: 'LeetCode 621', url: 'https://leetcode.com/problems/task-scheduler/' }],
  defaultInput: { tasks: ['A', 'A', 'A', 'B', 'B', 'B'], n: 2 },
};
