// =============================================================================
// Link-Cut Tree · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LinkCutTree, type LctHooks } from './impl.ts';

export const DEFAULT_INPUT: {
  n: number;
  ops: Array<{ t: 'link' | 'cut' | 'query'; u: number; v: number }>;
} = {
  n: 6,
  ops: [
    { t: 'link', u: 0, v: 1 },
    { t: 'link', u: 2, v: 3 },
    { t: 'query', u: 1, v: 2 },
    { t: 'link', u: 1, v: 2 },
    { t: 'query', u: 0, v: 3 },
    { t: 'cut', u: 1, v: 2 },
    { t: 'query', u: 0, v: 3 },
  ],
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, ops } = input;

  rec
    .begin({ zh: `LCT 初始 ${n} 个孤立点`, en: `LCT starts with ${n} isolated nodes` })
    .setAux([{ label: 'n', value: String(n), role: 'frontier' }])
    .commit();

  const hooks: LctHooks = {
    onLink: (u, v) => {
      rec
        .begin({ zh: `link(${u},${v})`, en: `link(${u},${v})` })
        .setAux([{ label: '连边', value: `${u}-${v}`, role: 'final' }])
        .commit();
    },
    onCut: (u, v) => {
      rec
        .begin({ zh: `cut(${u},${v})`, en: `cut(${u},${v})` })
        .setAux([{ label: '断边', value: `${u}-${v}`, role: 'warn' }])
        .commit();
    },
    onAccess: (u) => {
      rec
        .begin({ zh: `access(${u})`, en: `access(${u})` })
        .setAux([{ label: 'access', value: String(u), role: 'compare' }])
        .commit();
    },
  };

  const lct = new LinkCutTree(n, hooks);
  for (const op of ops) {
    if (op.t === 'link') {
      const r = lct.link(op.u, op.v);
      rec
        .begin({
          zh: `link(${op.u},${op.v}) → ${r ? '成功' : '失败(已连通)'}`,
          en: `link(${op.u},${op.v}) → ${r ? 'ok' : 'fail(connected)'}`,
        })
        .setAux([{ label: '结果', value: String(r), role: r ? 'final' : 'warn' }])
        .commit();
    } else if (op.t === 'cut') {
      const r = lct.cut(op.u, op.v);
      rec
        .begin({
          zh: `cut(${op.u},${op.v}) → ${r ? '成功' : '失败'}`,
          en: `cut(${op.u},${op.v}) → ${r ? 'ok' : 'fail'}`,
        })
        .setAux([{ label: '结果', value: String(r), role: r ? 'final' : 'warn' }])
        .commit();
    } else {
      const r = lct.connected(op.u, op.v);
      rec
        .begin({ zh: `connected(${op.u},${op.v}) = ${r}`, en: `connected(${op.u},${op.v}) = ${r}` })
        .setAux([{ label: '连通', value: String(r), role: r ? 'final' : 'warn' }])
        .commit();
    }
  }

  return rec.build();
}
