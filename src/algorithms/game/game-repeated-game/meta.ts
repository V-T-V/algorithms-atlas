// 重复博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-repeated-game',
  categoryId: 'game',
  title: { zh: '重复博弈', en: 'Repeated Game' },
  summary: {
    zh: '把单次囚徒困境重复 T 轮；触发策略（如 Tit-for-Tat）可维持合作。',
    en: 'Repeat a stage game (PD) for T rounds; trigger strategies (Tit-for-Tat) can sustain cooperation.',
  },
  description: {
    zh: '重复博弈：每轮玩一次阶段博弈。在无限/足够长有限重复中，子博弈完美均衡可支持合作，只要贴现因子 δ 足够大使未来报复威慑足够强。本实现模拟 Tit-for-Tat 对 Always-Defect 的轨迹。',
    en: 'Repeated game: play a stage game each round. With infinite or long finite repetition, subgame-perfect equilibria can sustain cooperation if discount δ is high enough. This simulates Tit-for-Tat vs Always-Defect.',
  },
  tags: ['game', 'game-theory', 'repeated'],
  complexity: { time: 'O(T)', space: 'O(T)' },
};
