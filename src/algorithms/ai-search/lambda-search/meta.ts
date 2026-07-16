// Lambda 搜索（Lambda Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lambda-search',
  categoryId: 'ai-search',
  title: { zh: 'Lambda 搜索', en: 'Lambda Search' },
  summary: {
    zh: '基于威胁数 λ 的搜索：第 λ 层只搜索「恰好 λ 步威胁」的攻击线，逐层放大。',
    en: 'Threat-number based search: level λ searches only attack lines that constitute a λ-move threat, escalating level by level.',
  },
  description: {
    zh: 'Lambda 搜索（Thomsen, 2000）是为六子棋/五子棋等「连子类」游戏设计的搜索算法，核心是把「威胁」按所需步数分层：\n\n- **λ=1**：当前玩家走一步即可获胜的「直接威胁」。\n- **λ=2**：对手必须回应（否则下步即输），回应后仍有 λ=1 威胁的「二步威胁」。\n- 一般地，**λ=k** 的威胁链：当前玩家可在 k 个连续强制步内获胜，对手每步都无法解除。\n\n搜索时，对每个 λ 自底向上：\n1. 找出当前局面的所有 λ=1 威胁。\n2. 用 λ=k 的攻击线作为「强制走法」，递归检验对手能否在 λ=k+1 中找到反威胁。\n\n这极大压缩了分支因子（只考虑威胁性走法）。本实现在简化的「连 N 子获胜」数值游戏中演示：节点带 utility，威胁线 = 效用超过阈值的子节点序列。',
    en: 'Lambda search (Thomsen, 2000) is designed for connection games (Connect-6, Gomoku). It stratifies "threats" by the number of moves needed:\n\n- **λ=1**: a direct threat where the side to move wins in one move.\n- **λ=2**: the opponent must respond (else they lose next move), and after the response the mover still has a λ=1 threat.\n- Generally, a **λ=k** threat chain means the mover can win in k consecutive forcing moves while the opponent cannot break it.\n\nSearch proceeds bottom-up over λ:\n1. Find all λ=1 threats at the current position.\n2. Treat λ=k attack lines as forcing moves and recurse to check whether the opponent has a λ=k+1 counter-threat.\n\nThis drastically cuts the branching factor (only forcing moves are considered). This implementation demonstrates it on a simplified "connect-N" numeric game: nodes carry utilities, and a threat line is a sequence of children whose utility exceeds a threshold.',
  },
  tags: ['ai-search', 'threat-search', 'lambda', 'connection-games'],
  complexity: { time: 'O(b_λ^λ)', space: 'O(λ)' },
  references: [
    {
      label: 'Lambda Search — Thomsen, 2000',
      url: 'https://www.liacs.nl/assets/Masterscripties/CS-Master/0303MarkThomsen.pdf',
    },
  ],
};
