import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { panicRecover } from './impl.ts';

export const DEFAULT_INPUT = ['a', '@', 'b', ';', '!', 'c', '}'];

export function buildTrace(toks: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const valid = new Set(['a', 'b', 'c']);
  rec.begin({ zh: `输入: ${toks.join(' ')}`, en: `Input: ${toks.join(' ')}` }).commit();
  const r = panicRecover(toks, valid, {
    onError: (tk, p) =>
      rec
        .begin({ zh: `错误 @${p}: "${tk}"`, en: `error @${p}: "${tk}"` })
        .setAux([{ label: 'err', value: tk, role: 'warn' as BarRole }])
        .commit(),
    onSkip: (tk, p) =>
      rec
        .begin({ zh: `跳过 @${p} "${tk}"`, en: `skip @${p} "${tk}"` })
        .setAux([{ label: 'skip', value: tk, role: 'compare' as BarRole }])
        .commit(),
    onSync: (tk, p) =>
      rec
        .begin({ zh: `同步点 @${p} "${tk}"`, en: `sync @${p} "${tk}"` })
        .setAux([{ label: 'sync', value: tk, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({
      zh: `恢复后: ${r.tokens.join(' ')}, 错误数=${r.errors.length}`,
      en: `Recovered: ${r.tokens.join(' ')}, errors=${r.errors.length}`,
    })
    .commit();
  return rec.build();
}
