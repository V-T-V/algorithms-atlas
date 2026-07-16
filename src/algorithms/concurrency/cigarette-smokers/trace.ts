// =============================================================================
// 抽烟者问题 · 录制帧序列
// 用 setGraph 展示代理 + 3 抽烟者，高亮当前放料与行动者；setAux 展示各轮记录。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateSmokers, type Ingredient, type SmokersHooks } from './impl.ts';

export const DEFAULT_OFFERS: ReadonlyArray<readonly [Ingredient, Ingredient]> = [
  ['tobacco', 'paper'],
  ['tobacco', 'matches'],
  ['paper', 'matches'],
  ['tobacco', 'paper'],
];

export function buildTrace(
  offers: ReadonlyArray<readonly [Ingredient, Ingredient]> = DEFAULT_OFFERS,
): Frame[] {
  const rec = new TraceRecorder();
  const nOffers = offers.length;

  const ingredientLabel = (i: Ingredient): string =>
    i === 'tobacco' ? 'T' : i === 'paper' ? 'P' : 'M';

  const render = (
    note: { zh: string; en: string },
    activeSmoker: number,
    tableOffer: [Ingredient, Ingredient] | null,
    completed: number,
  ): void => {
    const nodes: GraphNode[] = [
      {
        id: 'agent',
        label: '代理\nAgent',
        x: 0.5,
        y: 0.2,
        role: tableOffer ? ('pivot' as BarRole) : ('default' as BarRole),
      },
    ];
    // 三个抽烟者排列在下方
    for (let i = 0; i < 3; i++) {
      nodes.push({
        id: `s${i}`,
        label: `抽烟者${i}\n有 ${ingredientLabel(['tobacco', 'paper', 'matches'][i]! as Ingredient)}`,
        x: 0.2 + i * 0.3,
        y: 0.8,
        role: (i === activeSmoker ? 'final' : 'default') as BarRole,
      });
    }
    const e2: GraphEdge[] = [];
    if (tableOffer && activeSmoker >= 0) {
      e2.push({ from: 'agent', to: `s${activeSmoker}`, directed: true, role: 'compare' });
    }
    const aux = [
      {
        label: '桌上原料',
        value: tableOffer ? tableOffer.map(ingredientLabel).join('+') : '∅',
        role: (tableOffer ? 'frontier' : 'default') as BarRole,
      },
      {
        label: '行动者',
        value: activeSmoker >= 0 ? `抽烟者${activeSmoker}` : '无',
        role: (activeSmoker >= 0 ? 'final' : 'default') as BarRole,
      },
      { label: '已完成轮数', value: String(completed), role: 'pivot' as BarRole },
    ];
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
  };

  render(
    { zh: `初始：代理 + 3 个抽烟者（各有 T/P/M）`, en: `Init: agent + 3 smokers (each has T/P/M)` },
    -1,
    null,
    0,
  );

  let completed = 0;
  let activeSmoker = -1;
  let tableOffer: [Ingredient, Ingredient] | null = null;

  const hooks: SmokersHooks = {
    onOffer: (offer) => {
      tableOffer = offer;
      render(
        {
          zh: `代理放料：${offer.map(ingredientLabel).join(' + ')}`,
          en: `Agent offers: ${offer.map(ingredientLabel).join(' + ')}`,
        },
        -1,
        tableOffer,
        completed,
      );
    },
    onSmoke: (smoker, _has) => {
      activeSmoker = smoker;
      render(
        {
          zh: `抽烟者${smoker}（缺这俩）取走原料，开始卷烟`,
          en: `Smoker ${smoker} (lacks these) takes them, rolls a cigarette`,
        },
        activeSmoker,
        tableOffer,
        completed,
      );
    },
    onFinish: (smoker) => {
      completed++;
      render(
        {
          zh: `抽烟者${smoker} 抽完，通知代理下一轮`,
          en: `Smoker ${smoker} done, signals agent for next round`,
        },
        -1,
        null,
        completed,
      );
      activeSmoker = -1;
      tableOffer = null;
    },
  };

  simulateSmokers(offers, hooks);
  void nOffers;

  // 终态
  const nodes: GraphNode[] = [
    { id: 'agent', label: '代理', x: 0.5, y: 0.2, role: 'final' as BarRole },
  ];
  for (let i = 0; i < 3; i++) {
    nodes.push({
      id: `s${i}`,
      label: `抽烟者${i}`,
      x: 0.2 + i * 0.3,
      y: 0.8,
      role: 'final' as BarRole,
    });
  }
  rec
    .begin({
      zh: `完成，共 ${completed} 轮`,
      en: `Done, ${completed} rounds completed`,
    })
    .setGraph(nodes, [])
    .setAux([{ label: '总轮数', value: String(completed), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
