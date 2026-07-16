// =============================================================================
// 换水瓶 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { numWaterBottles, type WaterBottlesHooks } from './impl.ts';

export const DEFAULT_BOTTLES = 9;
export const DEFAULT_EXCHANGE = 3;

export function buildTrace(
  numBottles: number = DEFAULT_BOTTLES,
  numExchange: number = DEFAULT_EXCHANGE,
): Frame[] {
  const rec = new TraceRecorder();
  const drinks: Array<{ full: number; total: number }> = [];
  const exchanges: Array<{ empties: number; gained: number }> = [];

  rec
    .begin({
      zh: `${numBottles} 瓶满水，${numExchange} 空瓶换 1 满`,
      en: `${numBottles} full, ${numExchange} empties per full`,
    })
    .setAux([
      { label: '初始满', value: String(numBottles), role: 'pivot' as BarRole },
      { label: '兑换率', value: String(numExchange), role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: WaterBottlesHooks = {
    onDrink: (full, total) => drinks.push({ full, total }),
    onExchange: (empties, gained) => exchanges.push({ empties, gained }),
  };

  const result = numWaterBottles(numBottles, numExchange, hooks);

  for (let i = 0; i < drinks.length; i++) {
    const d = drinks[i]!;
    rec
      .begin({
        zh: `第 ${i + 1} 轮：喝 ${d.full} 瓶，累计 ${d.total}`,
        en: `Round ${i + 1}: drink ${d.full}, total ${d.total}`,
      })
      .setAux([
        { label: '本轮喝', value: String(d.full), role: 'compare' as BarRole },
        { label: '累计', value: String(d.total), role: 'final' as BarRole },
      ])
      .commit();
    const ex = exchanges[i];
    if (ex) {
      rec
        .begin({
          zh: `兑换：用 ${ex.empties} 空瓶换 ${ex.gained} 满`,
          en: `Exchange: ${ex.empties} empties -> ${ex.gained} full`,
        })
        .setAux([
          { label: '用空瓶', value: String(ex.empties), role: 'pivot' as BarRole },
          { label: '得满瓶', value: String(ex.gained), role: 'final' as BarRole },
        ])
        .commit();
    }
  }

  rec
    .begin({ zh: `完成：共喝 ${result} 瓶`, en: `Done: drank ${result}` })
    .setAux([{ label: '总数', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
