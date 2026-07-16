// =============================================================================
// 分数背包 · 录制帧序列
// 通过 fractionalKnapsack 的钩子，把贪心执行过程录成 Frame[]。
// 可视化：setBars 渲染按密度排序后的物品（柱高=价值密度），setAux 展示背包余量/总价值。
// roles: 已整件装入='final'，部分装入='swap'，跳过='warn'，当前='pivot'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fractionalKnapsack, type FractionalKnapsackHooks, type KnapsackItem } from './impl.ts';

export interface FKInput {
  items: KnapsackItem[];
  capacity: number;
}

export const DEFAULT_INPUT: FKInput = {
  items: [
    { weight: 10, value: 60 },
    { weight: 20, value: 100 },
    { weight: 30, value: 120 },
  ],
  capacity: 50,
};

/** 录制演示帧序列。 */
export function buildTrace(input: FKInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { items, capacity } = input;

  // 排序后的物品（在 onSort 中同步）
  let order: KnapsackItem[] = [...items];
  const roles: BarRole[] = [];
  let remaining = capacity;
  let totalValue = 0;
  let currentIndex = -1;

  /** 计算每个物品的价值密度，用作柱高（便于直观比较）。 */
  const density = (it: KnapsackItem): number => (it.weight > 0 ? it.value / it.weight : 0);

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = order.map((it, i) => ({
      value: density(it),
      role: roles[i] ?? 'default',
      label: `w${it.weight}/v${it.value}`,
    }));
    const aux = [
      { label: '容量 / capacity', value: String(capacity), role: 'default' as BarRole },
      {
        label: '剩余 / remaining',
        value: remaining.toFixed(2),
        role: 'pivot' as BarRole,
      },
      { label: '总价值 / value', value: totalValue.toFixed(2), role: 'final' as BarRole },
    ];
    const pointers: Array<{ index: number; label: string }> = [];
    if (currentIndex >= 0) pointers.push({ index: currentIndex, label: '当前 current' });
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  // 初始：按原始顺序展示物品密度
  rec
    .begin({
      zh: `背包容量 ${capacity}，${items.length} 个物品（柱高 = 价值密度 v/w）`,
      en: `Capacity ${capacity}, ${items.length} items (bar height = value density v/w)`,
    })
    .setBars(
      items.map((it) => ({
        value: density(it),
        role: 'default' as BarRole,
        label: `w${it.weight}/v${it.value}`,
      })),
    )
    .setAux([
      { label: '容量 / capacity', value: String(capacity), role: 'default' },
      { label: '剩余 / remaining', value: String(capacity), role: 'pivot' },
      { label: '总价值 / value', value: '0', role: 'final' },
    ])
    .commit();

  const hooks: FractionalKnapsackHooks = {
    onSort: (sorted) => {
      order = sorted;
      roles.length = 0;
      for (let i = 0; i < sorted.length; i++) roles.push('default');
      snapshot({
        zh: `按价值密度降序排序：[${order
          .map(density)
          .map((d) => d.toFixed(2))
          .join(', ')}]`,
        en: `Sorted by value density desc: [${order
          .map(density)
          .map((d) => d.toFixed(2))
          .join(', ')}]`,
      });
    },
    onTakeFull: (i, it, rem, tv) => {
      roles[i] = 'final';
      currentIndex = i;
      remaining = rem;
      totalValue = tv;
      snapshot({
        zh: `整件装入物品 #${it.id}（w=${it.weight}, v=${it.value}），余 ${rem.toFixed(2)}`,
        en: `Take full item #${it.id} (w=${it.weight}, v=${it.value}), remaining ${rem.toFixed(2)}`,
      });
    },
    onTakeFraction: (i, it, frac, tv) => {
      roles[i] = 'swap';
      currentIndex = i;
      remaining = 0;
      totalValue = tv;
      snapshot({
        zh: `部分装入物品 #${it.id}：取 ${(frac * 100).toFixed(1)}%（价值 +${(it.value * frac).toFixed(2)}）`,
        en: `Take fraction of item #${it.id}: ${(frac * 100).toFixed(1)}% (value +${(it.value * frac).toFixed(2)})`,
      });
    },
    onSkip: (i, it, reason) => {
      roles[i] = 'warn';
      currentIndex = i;
      snapshot({
        zh: reason === 'full' ? `背包已满，跳过物品 #${it.id}` : `物品 #${it.id} 重量为 0，跳过`,
        en:
          reason === 'full'
            ? `Knapsack full, skip item #${it.id}`
            : `Item #${it.id} has zero weight, skip`,
      });
    },
  };

  const result = fractionalKnapsack(items, capacity, hooks);

  // 终态
  currentIndex = -1;
  rec
    .begin({
      zh: `完成：最大价值 = ${result.totalValue.toFixed(2)}（总重量 ${result.totalWeight.toFixed(2)}）`,
      en: `Done: max value = ${result.totalValue.toFixed(2)} (total weight ${result.totalWeight.toFixed(2)})`,
    })
    .setBars(
      order.map((it, i) => ({
        value: density(it),
        role: roles[i] ?? 'default',
        label: `w${it.weight}/v${it.value}`,
      })),
    )
    .setAux([
      { label: '最大价值', value: result.totalValue.toFixed(2), role: 'final' },
      { label: '总重量', value: result.totalWeight.toFixed(2), role: 'pivot' },
      {
        label: '装入方案',
        value: result.takes
          .map((t) => `#${t.id}:${t.fraction >= 1 ? '全' : (t.fraction * 100).toFixed(0) + '%'}`)
          .join(', '),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
