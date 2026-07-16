// 中国象棋局面评估（Chinese Chess Evaluation）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'chinese-chess-eval',
  categoryId: 'game',
  title: { zh: '中国象棋局面评估', en: 'Chinese Chess Evaluation' },
  summary: {
    zh: '给一个中国象棋局面打分：子力 + 位置（PST）。',
    en: 'Score a Chinese chess position: material + piece-square table.',
  },
  description: {
    zh: '局面评估函数（evaluation function）是棋类 AI 的核心。本实现对中国象棋（象棋）的一个简化局面打分，分两部分：\n\n1) 子力（material）：每种棋子有基础价值——帅/将 10000、车 900、马 400、炮 450、相/象 200、士 200、兵/卒 100（过河兵 200）。\n2) 位置（piece-square table, PST）：把每个棋子放到棋盘上的位置奖励/惩罚，例如马在中心更好、兵过河后价值翻倍。\n\n返回红方视角的总分（正数红优、负数黑优）。这是 alpha-beta 搜索树叶子的估值函数。',
    en: "An evaluation function is the heart of a chess AI. This implementation scores a simplified Chinese chess (Xiangqi) position in two parts:\n\n1) Material: each piece has a base value — General 10000, Chariot 900, Horse 400, Cannon 450, Advisor/Elephant 200, Soldier 100 (200 if crossed the river).\n2) Piece-square table (PST): positional bonus/penalty per cell, e.g. horses prefer the center, soldiers double in value after crossing the river.\n\nReturns a total score from Red's perspective (positive = Red better, negative = Black better). This is the leaf evaluation function for alpha-beta search.",
  },
  tags: ['game', 'evaluation', 'heuristic', 'board'],
  complexity: { time: 'O(90)', space: 'O(1)' },
  defaultInput: 'initial',
};
