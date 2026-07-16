import type { AlgorithmMeta } from '../types.ts';

export type LearningPathId = 'all' | 'foundation' | 'interview' | 'graph-dp' | 'systems';

export interface LearningPath {
  id: LearningPathId;
  label: string;
  description: string;
}

export const LEARNING_PATHS: readonly LearningPath[] = [
  { id: 'all', label: '全部', description: '浏览完整算法图谱' },
  { id: 'foundation', label: '入门基础', description: '排序、搜索、数据结构与递归基础' },
  { id: 'interview', label: '面试高频', description: '数组、图、动态规划、字符串与贪心' },
  { id: 'graph-dp', label: '图论 / DP', description: '图搜索、最短路、连通性与动态规划' },
  { id: 'systems', label: '工程系统', description: '解析、调度、网络、压缩、哈希与并发' },
];

const PATH_CATEGORIES: Record<Exclude<LearningPathId, 'all'>, readonly string[]> = {
  foundation: ['sorting', 'searching', 'ds', 'list', 'recursion'],
  interview: ['sorting', 'searching', 'ds', 'dp', 'graph', 'string', 'greedy', 'backtracking'],
  'graph-dp': ['graph', 'dp', 'ai-search', 'game'],
  systems: ['parsing', 'scheduling', 'network', 'compression', 'crypto', 'hashing', 'concurrency'],
};

const INTERVIEW_TAGS = new Set([
  'two-pointers',
  'sliding-window',
  'divide-and-conquer',
  'shortest-path',
  'minimum-spanning-tree',
  'dynamic-programming',
  'backtracking',
]);

export function findLearningPath(id: string): LearningPath | undefined {
  return LEARNING_PATHS.find((path) => path.id === id);
}

export function matchesLearningPath(meta: AlgorithmMeta, pathId: LearningPathId): boolean {
  if (pathId === 'all') return true;
  if (PATH_CATEGORIES[pathId].includes(meta.categoryId)) return true;
  if (pathId === 'interview') return meta.tags.some((tag) => INTERVIEW_TAGS.has(tag));
  return false;
}
