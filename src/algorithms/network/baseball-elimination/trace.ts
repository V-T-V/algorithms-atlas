// =============================================================================
// 棒球淘汰 · 录制帧序列
// 用 setBars 展示各队当前胜场，setAux 展示候选队最大胜场与判定结果。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { baseballElimination, type BaseballInput } from './impl.ts';

export const DEFAULT_INPUT: BaseballInput = {
  teams: [
    { name: 'A', wins: 75, remaining: 28 },
    { name: 'B', wins: 71, remaining: 28 },
    { name: 'C', wins: 69, remaining: 28 },
    { name: 'D', wins: 63, remaining: 28 },
  ],
  games: [
    [0, 1, 6, 1],
    [1, 0, 0, 0],
    [6, 0, 0, 1],
    [1, 0, 1, 0],
  ],
};

export const DEFAULT_TEAM_IDX = 3; // 球队 D（明显被淘汰）

export function buildTrace(
  input: BaseballInput = DEFAULT_INPUT,
  teamIdx: number = DEFAULT_TEAM_IDX,
): Frame[] {
  const rec = new TraceRecorder();
  const { teams } = input;

  const toBars = (highlight?: number, cert?: number[]) =>
    teams.map((t, i) => ({
      value: t.wins,
      role: (i === teamIdx ? 'pivot' : cert?.includes(i) ? 'warn' : 'default') as BarRole,
      label: t.name,
    }));

  rec
    .begin({
      zh: `球队数据：${teams.map((t) => `${t.name}=${t.wins}胜`).join(', ')}`,
      en: `Teams: ${teams.map((t) => `${t.name}=${t.wins}`).join(', ')}`,
    })
    .setBars(toBars())
    .setAux([
      { label: '候选队', value: teams[teamIdx]!.name, role: 'pivot' as BarRole },
      { label: '当前胜场', value: String(teams[teamIdx]!.wins), role: 'pivot' as BarRole },
      { label: '剩余比赛', value: String(teams[teamIdx]!.remaining), role: 'frontier' as BarRole },
    ])
    .commit();

  let finalResult: ReturnType<typeof baseballElimination> | null = null;

  baseballElimination(input, teamIdx, {
    onTrivialCheck: (_idx, maxWins, trivialBy) => {
      rec
        .begin({
          zh:
            trivialBy !== null
              ? `Trivial 检测：候选队最大胜场 ${maxWins}，球队 ${teams[trivialBy]!.name} 已有 ${teams[trivialBy]!.wins} 胜 > ${maxWins}，直接淘汰`
              : `Trivial 检测：候选队最大胜场 ${maxWins}，无球队当前胜场超此值，需建流网络`,
          en:
            trivialBy !== null
              ? `Trivial: candidate max = ${maxWins}, team ${teams[trivialBy]!.name} has ${teams[trivialBy]!.wins} > ${maxWins}, eliminated`
              : `Trivial: candidate max = ${maxWins}, no team exceeds, build flow network`,
        })
        .setBars(toBars(trivialBy ?? undefined))
        .setAux([{ label: '最大胜场 W', value: String(maxWins), role: 'pivot' as BarRole }])
        .commit();
    },
    onBuildNetwork: (nodeCount, source, sink, edgeCount) => {
      rec
        .begin({
          zh: `建流网络：${nodeCount} 节点（源=${source}，汇=${sink}），${edgeCount} 边`,
          en: `Build network: ${nodeCount} nodes, ${edgeCount} edges`,
        })
        .setBars(toBars())
        .setAux([
          { label: '节点数', value: String(nodeCount), role: 'frontier' as BarRole },
          { label: '边数', value: String(edgeCount), role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onAugment: (totalFlow, totalGames) => {
      rec
        .begin({
          zh: `增广：累计流 ${totalFlow} / 总剩余比赛 ${totalGames}`,
          en: `Augment: flow ${totalFlow} / total games ${totalGames}`,
        })
        .setBars(toBars())
        .setAux([
          { label: '当前流', value: String(totalFlow), role: 'final' as BarRole },
          { label: '总比赛', value: String(totalGames), role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onDone: (r) => {
      finalResult = r;
    },
  });

  const r = finalResult!;
  const cert = r.certificate ?? [];
  rec
    .begin({
      zh: r.eliminated
        ? `结论：球队 ${teams[teamIdx]!.name} 已被淘汰（最大流 ${r.maxFlow} < 总比赛 ${r.totalGames}）`
        : `结论：球队 ${teams[teamIdx]!.name} 仍有夺冠可能（最大流 ${r.maxFlow} = 总比赛 ${r.totalGames}）`,
      en: r.eliminated
        ? `Result: team ${teams[teamIdx]!.name} eliminated (max flow ${r.maxFlow} < ${r.totalGames})`
        : `Result: team ${teams[teamIdx]!.name} can still win (max flow ${r.maxFlow} = ${r.totalGames})`,
    })
    .setBars(toBars(undefined, cert))
    .setAux([
      {
        label: '是否淘汰',
        value: r.eliminated ? '是' : '否',
        role: (r.eliminated ? 'warn' : 'final') as BarRole,
      },
      { label: '最大流', value: String(r.maxFlow), role: 'final' as BarRole },
      { label: '总比赛', value: String(r.totalGames), role: 'frontier' as BarRole },
      ...(cert.length > 0
        ? [
            {
              label: '反证子集',
              value: cert.map((i) => teams[i]!.name).join(','),
              role: 'warn' as BarRole,
            },
          ]
        : []),
    ])
    .commit();

  return rec.build();
}
