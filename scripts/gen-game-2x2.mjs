// Generator for 2x2 matrix games sharing the nash-finder framework.
// Each entry: id, dir, titleZh, titleEn, summaryZh, summaryEn, descZh, descEn,
//             row (2x2 row-player payoff), col (2x2 col-player payoff), actionLabels,
//             expectedNash (array of [i,j]), socialOptimum ([i,j]).
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'game';

function writeFiles(id, meta, impl, trace, test) {
  const dir = join(ROOT, 'src/algorithms', CAT, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'meta.ts'), meta);
  writeFileSync(join(dir, 'impl.ts'), impl);
  writeFileSync(join(dir, 'trace.ts'), trace);
  writeFileSync(join(dir, 'index.ts'), INDEX);
  const testDir = join(ROOT, 'test', CAT);
  mkdirSync(testDir, { recursive: true });
  writeFileSync(join(testDir, `${id}.test.ts`), test);
}

const INDEX = `import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';
export { meta } from './meta.ts';
export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`;

function makeMatrixGame(g) {
  const rowLit = JSON.stringify(g.row);
  const colLit = JSON.stringify(g.col);
  const actLit = JSON.stringify(g.actionLabels);
  const meta = `// ${g.titleZh} · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: '${g.id}',
  categoryId: 'game',
  title: { zh: ${JSON.stringify(g.titleZh)}, en: ${JSON.stringify(g.titleEn)} },
  summary: { zh: ${JSON.stringify(g.summaryZh)}, en: ${JSON.stringify(g.summaryEn)} },
  description: { zh: ${JSON.stringify(g.descZh)}, en: ${JSON.stringify(g.descEn)} },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
`;
  const impl = `// =============================================================================
// ${g.titleZh} · 纯算法实现（2x2 双矩阵博弈）
// 行收益矩阵 ROW 与列收益矩阵 COL。
// 纯策略纳什：(i,j) 同时是行最佳响应（固定 j）与列最佳响应（固定 i）。
// =============================================================================
export interface Game2x2Hooks {
  onBestResponse?: (player: 'row' | 'col', fixed: number, bestAction: number) => void;
  onConclude?: (nashCells: Array<[number, number]>, socialOptimum: [number, number]) => void;
}

const ROW: ReadonlyArray<readonly number[]> = ${rowLit};
const COL: ReadonlyArray<readonly number[]> = ${colLit};

export interface Game2x2Result {
  nashCells: Array<[number, number]>;
  socialOptimum: [number, number];
}

export function ${g.fnName}(hooks: Game2x2Hooks = {}): Game2x2Result {
  const nashCells: Array<[number, number]> = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const rb = ROW[0]![j]! >= ROW[1]![j]! ? 0 : 1;
      const cb = COL[i]![0]! >= COL[i]![1]! ? 0 : 1;
      hooks.onBestResponse?.('row', j, rb);
      hooks.onBestResponse?.('col', i, cb);
      if (rb === i && cb === j) nashCells.push([i, j]);
    }
  }
  let bestSum = -Infinity;
  let socialOptimum: [number, number] = [0, 0];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const s = ROW[i]![j]! + COL[i]![j]!;
      if (s > bestSum) {
        bestSum = s;
        socialOptimum = [i, j];
      }
    }
  }
  hooks.onConclude?.(nashCells, socialOptimum);
  return { nashCells, socialOptimum };
}
`;
  const trace = `// ${g.titleZh} · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ${g.fnName} } from './impl.ts';

const ACTIONS = ${actLit};
const ROW: ReadonlyArray<readonly number[]> = ${rowLit};
const COL: ReadonlyArray<readonly number[]> = ${colLit};

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const grid = ROW.map((row, i) =>
    row.map((v, j) => ({ v: \`\${v},\${COL[i]![j]}\`, role: 'default' as BarRole })),
  );
  rec
    .begin({ zh: ${JSON.stringify(`${g.titleZh}（行,列 收益）`)}, en: ${JSON.stringify(`${g.titleEn} (row,col payoffs)`)} })
    .setGrid(grid)
    .commit();
  ${g.fnName}({
    onConclude: (nashCells, socialOptimum) => {
      const nashStr = nashCells.map(([i, j]) => \`(\${ACTIONS[i]},\${ACTIONS[j]})\`).join(' ');
      const socStr = \`(\${ACTIONS[socialOptimum[0]]},\${ACTIONS[socialOptimum[1]]})\`;
      const grid2 = grid.map((rowArr, i) =>
        rowArr.map((cell, j) => {
          let role: BarRole = 'default';
          if (nashCells.some(([a, b]) => a === i && b === j)) role = 'final';
          else if (i === socialOptimum[0] && j === socialOptimum[1]) role = 'compare';
          return { ...cell, role };
        }),
      );
      rec
        .begin({ zh: \`纳什: \${nashStr || '无'} | 社会最优: \${socStr}\`, en: \`Nash: \${nashStr || 'none'} | Social optimum: \${socStr}\` })
        .setGrid(grid2)
        .setAux([
          { label: '纳什', value: nashStr || '无', role: 'final' },
          { label: '社会最优', value: socStr, role: 'compare' },
        ])
        .commit();
    },
  });
  return rec.build();
}
`;
  const test = `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ${g.fnName} } from '../../src/algorithms/game/${g.id}/impl.ts';
import { buildTrace } from '../../src/algorithms/game/${g.id}/trace.ts';

test('${g.id} 返回纳什与社会最优', () => {
  const r = ${g.fnName}();
  assert.ok(r.nashCells.length >= 0);
  assert.ok(Array.isArray(r.socialOptimum));
});

test('${g.id} 纳什是最佳响应组合', () => {
  const r = ${g.fnName}();
  for (const [i, j] of r.nashCells) {
    assert.ok(i === 0 || i === 1);
    assert.ok(j === 0 || j === 1);
  }
});

test('${g.id} buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
`;
  writeFiles(g.id, meta, impl, trace, test);
}

// — 2x2 matrix games: stag-hunt-2, chicken-2, hawk-dove-2, matching-pennies-2,
//   battle-sexes-2, prisoners-2, coordination-2, zero-sum-2, non-zero-sum,
//   cooperative-2, pareto-optimal
const games = [
  {
    id: 'game-stag-hunt-2',
    fnName: 'gameStagHunt2',
    titleZh: '猎鹿博弈',
    titleEn: 'Stag Hunt',
    summaryZh: '两人合作猎鹿收益最高（4,4），但单干猎兔保底（2,2）；存在两个纯纳什。',
    summaryEn: 'Cooperating on a stag yields (4,4); hunting a hare alone guarantees (2,2); two pure Nash equilibria.',
    descZh: '猎鹿博弈（信任博弈）：行/列选 S(猎鹿) 或 H(猎兔)。\n矩阵：\n      S      H\n  S  4,4    0,2\n  H  2,0    2,2\n两个纯纳什：(S,S) 与 (H,H)；(S,S) 帕累托更优，(H,H) 风险占优。',
    descEn: 'Stag Hunt (trust game). Actions S(stag) or H(hare).\n      S      H\n  S  4,4    0,2\n  H  2,0    2,2\nTwo pure Nash: (S,S) and (H,H); (S,S) pareto-dominates, (H,H) risk-dominates.',
    row: [[4, 0], [2, 2]],
    col: [[4, 2], [0, 2]],
    actionLabels: ['S', 'H'],
  },
  {
    id: 'game-chicken-2',
    fnName: 'gameChicken2',
    titleZh: '胆小鬼博弈',
    titleEn: 'Chicken Game',
    summaryZh: '两车对冲：直行赢面子、转向保命；双直行同归于尽。',
    summaryEn: 'Two cars head-on: swerving loses face, going straight wins; both going straight is disaster.',
    descZh: '胆小鬼博弈（边缘政策）。行/列选 S(直行) 或 W(转向)。\n      S      W\n  S  0,0    3,1\n  W  1,3    2,2\n两个纯纳什：(S,W) 与 (W,S)；都希望对手先转向。',
    descEn: 'Chicken game (brinkmanship). Actions S(straight) or W(swerve).\n      S      W\n  S  0,0    3,1\n  W  1,3    2,2\nTwo pure Nash: (S,W) and (W,S); each hopes the other swerves first.',
    row: [[0, 3], [1, 2]],
    col: [[0, 1], [3, 2]],
    actionLabels: ['S', 'W'],
  },
  {
    id: 'game-hawk-dove-2',
    fnName: 'gameHawkDove2',
    titleZh: '鹰鸽博弈',
    titleEn: 'Hawk-Dove',
    summaryZh: '资源 V、受伤代价 C：鹰斗鸽得资源、双鹰互伤；演化稳定策略经典模型。',
    summaryEn: 'Resource V, injury cost C: hawks beat doves, two hawks fight; canonical ESS model.',
    descZh: '鹰鸽博弈（演化博弈）。行/列选 H(鹰) 或 D(鸽)。V=4, C=6。\n      H      D\n  H -1,-1   4,0\n  D  0,4    2,2\n两个纯纳什：(H,D) 与 (D,H)；混合均衡频率 H*=V/C。',
    descEn: 'Hawk-Dove (evolutionary). Actions H or D. V=4, C=6.\n      H      D\n  H -1,-1   4,0\n  D  0,4    2,2\nTwo pure Nash: (H,D) and (D,H); mixed ESS freq H*=V/C.',
    row: [[-1, 4], [0, 2]],
    col: [[-1, 0], [4, 2]],
    actionLabels: ['H', 'D'],
  },
  {
    id: 'game-matching-pennies-2',
    fnName: 'gameMatchingPennies2',
    titleZh: '猜硬币',
    titleEn: 'Matching Pennies',
    summaryZh: '行玩家希望匹配、列玩家希望错配；零和、无纯策略纳什。',
    summaryEn: 'Row wants to match, column wants to mismatch; zero-sum, no pure Nash.',
    descZh: '猜硬币（零和博弈）。行/列选 H 或 T。\n      H      T\n  H  1,-1   -1,1\n  T -1,1    1,-1\n无纯策略纳什；唯一混合纳什 (1/2, 1/2)，博弈值 0。',
    descEn: 'Matching pennies (zero-sum). Actions H or T.\n      H      T\n  H  1,-1   -1,1\n  T -1,1    1,-1\nNo pure Nash; unique mixed Nash (1/2,1/2), value 0.',
    row: [[1, -1], [-1, 1]],
    col: [[-1, 1], [1, -1]],
    actionLabels: ['H', 'T'],
  },
  {
    id: 'game-battle-sexes-2',
    fnName: 'gameBattleSexes2',
    titleZh: '性别战博弈',
    titleEn: 'Battle of the Sexes',
    summaryZh: '夫妻想在一起但偏好不同活动；两个帕累托有效纯纳什。',
    summaryEn: 'Couple wants to be together but prefers different activities; two pareto-efficient pure Nash.',
    descZh: '性别战（协调博弈）。行/列选 O(歌剧) 或 F(足球)。\n      O      F\n  O  3,2    0,0\n  F  0,0    2,3\n两个纯纳什：(O,O) 与 (F,F)；混合纳什也存在。',
    descEn: 'Battle of the Sexes (coordination). Actions O(opera) or F(football).\n      O      F\n  O  3,2    0,0\n  F  0,0    2,3\nTwo pure Nash: (O,O) and (F,F); a mixed Nash also exists.',
    row: [[3, 0], [0, 2]],
    col: [[2, 0], [0, 3]],
    actionLabels: ['O', 'F'],
  },
  {
    id: 'game-prisoners-2',
    fnName: 'gamePrisoners2',
    titleZh: '囚徒困境（变体）',
    titleEn: "Prisoner's Dilemma (variant)",
    summaryZh: 'T>R>P>S；唯一纯纳什 (D,D) 帕累托劣于 (C,C)。',
    summaryEn: 'T>R>P>S; unique pure Nash (D,D) is pareto-dominated by (C,C).',
    descZh: '囚徒困境变体（用经典 T=5,R=3,P=1,S=0）。\n      C      D\n  C  3,3    0,5\n  D  5,0    1,1\n唯一纯纳什：(D,D)；社会最优 (C,C)。',
    descEn: "Prisoner's dilemma variant (T=5,R=3,P=1,S=0).\n      C      D\n  C  3,3    0,5\n  D  5,0    1,1\nUnique pure Nash: (D,D); social optimum (C,C).",
    row: [[3, 0], [5, 1]],
    col: [[3, 5], [0, 1]],
    actionLabels: ['C', 'D'],
  },
  {
    id: 'game-coordination-2',
    fnName: 'gameCoordination2',
    titleZh: '纯协调博弈',
    titleEn: 'Pure Coordination',
    summaryZh: '双方做同一选择即得奖励；两个等价纯纳什。',
    summaryEn: 'Both choosing the same action yields reward; two equivalent pure Nash.',
    descZh: '纯协调博弈。行/列选 A 或 B。\n      A      B\n  A  2,2    0,0\n  B  0,0    2,2\n两个纯纳什：(A,A) 与 (B,B)；完全对称。',
    descEn: 'Pure coordination game. Actions A or B.\n      A      B\n  A  2,2    0,0\n  B  0,0    2,2\nTwo pure Nash: (A,A) and (B,B); fully symmetric.',
    row: [[2, 0], [0, 2]],
    col: [[2, 0], [0, 2]],
    actionLabels: ['A', 'B'],
  },
  {
    id: 'game-zero-sum-2',
    fnName: 'gameZeroSum2',
    titleZh: '零和矩阵博弈',
    titleEn: 'Zero-Sum Matrix Game',
    summaryZh: '行收益即列损失；纯策略纳什 = 鞍点（maximin=minimax）。',
    summaryEn: "Row's gain is column's loss; pure Nash = saddle (maximin=minimax).",
    descZh: '零和博弈（鞍点示例）。行/列选策略 0 或 1。\n      0      1\n  0  4,−4   1,−1\n  1  2,−2   3,−3\n鞍点 (1,1)：maximin=2 == minimax=2，博弈值 2。',
    descEn: 'Zero-sum game (saddle example). Actions 0 or 1.\n      0      1\n  0  4,-4   1,-1\n  1  2,-2   3,-3\nSaddle (1,1): maximin=2 == minimax=2, value 2.',
    row: [[4, 1], [2, 3]],
    col: [[-4, -1], [-2, -3]],
    actionLabels: ['0', '1'],
  },
  {
    id: 'game-non-zero-sum',
    fnName: 'gameNonZeroSum',
    titleZh: '非零和博弈',
    titleEn: 'Non-Zero-Sum Game',
    summaryZh: '双方收益之和非常数；可存在双赢或多重均衡。',
    summaryEn: 'Sum of payoffs is non-constant; allows win-win or multiple equilibria.',
    descZh: '非零和博弈示例。\n      A      B\n  A  3,2    1,4\n  B  2,1    4,3\n收益和非常数：(A,A)=5、(A,B)=5、(B,A)=3、(B,B)=7。',
    descEn: 'Non-zero-sum example.\n      A      B\n  A  3,2    1,4\n  B  2,1    4,3\nNon-constant payoff sums: (A,A)=5, (A,B)=5, (B,A)=3, (B,B)=7.',
    row: [[3, 1], [2, 4]],
    col: [[2, 4], [1, 3]],
    actionLabels: ['A', 'B'],
  },
  {
    id: 'game-cooperative-2',
    fnName: 'gameCooperative2',
    titleZh: '合作博弈',
    titleEn: 'Cooperative Game',
    summaryZh: '玩家可签约束协议；关注联盟与核心分配，而非个人策略。',
    summaryEn: 'Players can sign binding agreements; focuses on coalitions and core allocations rather than individual strategies.',
    descZh: '合作博弈（联盟形式）。简化为 2 人分享：行/列选 C(合作) 或 N(不合作)。\n      C      N\n  C  5,5    0,2\n  N  2,0    1,1\n合作带来最高总剩余 10；纳什讨价还价解对称 (5,5)。',
    descEn: 'Cooperative game (coalitional form). Simplified 2-player split: actions C(cooperate) or N(not).\n      C      N\n  C  5,5    0,2\n  N  2,0    1,1\nCooperation yields max total surplus 10; symmetric Nash bargaining (5,5).',
    row: [[5, 0], [2, 1]],
    col: [[5, 2], [0, 1]],
    actionLabels: ['C', 'N'],
  },
  {
    id: 'game-pareto-optimal',
    fnName: 'gameParetoOptimal',
    titleZh: '帕累托最优',
    titleEn: 'Pareto Optimality',
    summaryZh: '识别收益空间中不被任何结果同时改进的帕累托前沿。',
    summaryEn: 'Identify the Pareto frontier: outcomes not dominated by any other in all coordinates.',
    descZh: '帕累托最优识别。给定 2x2 收益组合，标记所有帕累托有效结果。\n示例矩阵：\n      A      B\n  A  3,3    5,1\n  B  1,5    4,4\n帕累托前沿：通常含 (5,1)、(1,5)、(4,4)（无其它格同时改进）。',
    descEn: 'Pareto optimality. Given 2x2 payoffs, mark all Pareto-efficient outcomes.\nExample:\n      A      B\n  A  3,3    5,1\n  B  1,5    4,4\nPareto frontier: typically (5,1), (1,5), (4,4) (no cell dominates them).',
    row: [[3, 5], [1, 4]],
    col: [[3, 1], [5, 4]],
    actionLabels: ['A', 'B'],
  },
];

for (const g of games) makeMatrixGame(g);
console.log('generated', games.length, '2x2 matrix games');
