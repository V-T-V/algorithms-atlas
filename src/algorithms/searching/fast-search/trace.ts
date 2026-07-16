// =============================================================================
// Fast Search（块二分）· 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fastSearch, type FastSearchHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 11, 17, 23, 29, 35, 41, 47, 53, 59, 65, 71, 77, 83, 89, 95];
export const DEFAULT_TARGET = 47;

/** 录制演示帧序列。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  const b = Math.max(1, Math.floor(Math.sqrt(n)));
  let phase: 'block' | 'inblock' = 'block';
  let blockLo = 0;
  let blockHi = n;
  let probe = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (blockHi > blockLo) for (let k = blockLo; k < blockHi; k++) roles[k] = 'frontier';
    if (probe >= 0) roles[probe] = phase === 'block' ? 'pivot' : 'compare';
    rec
      .begin(note)
      .setArray(
        values,
        roles,
        probe >= 0 ? [{ index: probe, label: phase === 'block' ? 'blk' : 'mid' }] : [],
      )
      .setAux([
        { label: '阶段', value: phase === 'block' ? '块摘要二分' : '块内二分', role: 'pivot' },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `块大小 b = √${n} = ${b}，查找 ${target}`,
      en: `block size b = √${n} = ${b}, find ${target}`,
    })
    .setArray(values, new Array(n).fill('default'), [])
    .commit();

  const hooks: FastSearchHooks = {
    onBlocks: (firsts, bs) => {
      rec
        .begin({
          zh: `切成 ${firsts.length} 个块（块首元素 [${firsts.join(', ')}]）`,
          en: `${firsts.length} blocks (firsts [${firsts.join(', ')}])`,
        })
        .setAux([
          { label: '块大小', value: String(bs), role: 'pivot' },
          { label: '块数', value: String(firsts.length), role: 'pivot' },
        ])
        .commit();
    },
    onBlockProbe: (bi, first) => {
      phase = 'block';
      probe = bi * b;
      snapshot({
        zh: `块摘要二分：块 ${bi} 首元素 ${first}`,
        en: `Block binary: block ${bi} first ${first}`,
      });
    },
    onBlockLocated: (lo, hi) => {
      blockLo = lo;
      blockHi = hi;
      probe = -1;
      snapshot({ zh: `定位到块 [${lo}, ${hi})`, en: `Located block [${lo}, ${hi})` });
    },
    onInBlockProbe: (mid, v) => {
      phase = 'inblock';
      probe = mid;
      const rel = v < target ? '< 目标' : v > target ? '> 目标' : '= 目标';
      snapshot({ zh: `块内二分 a[${mid}]=${v} ${rel}`, en: `In-block a[${mid}]=${v} ${rel}` });
    },
    onDone: (found) => {
      const roles: BarRole[] = new Array(n).fill('default');
      if (found >= 0) roles[found] = 'final';
      rec
        .begin(
          found >= 0
            ? { zh: `命中：下标 ${found}`, en: `Found at ${found}` }
            : { zh: `未找到`, en: `Not found` },
        )
        .setArray(values, roles, found >= 0 ? [{ index: found, label: '✓' }] : [])
        .commit();
    },
  };

  fastSearch(input, target, hooks);

  return rec.build();
}
