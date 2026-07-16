import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { distinctSubsequences } from './impl.ts';

export const DEFAULT_S = 'abc';

export function buildTrace(opts: { s?: string } = {}): Frame[] {
  const s = opts.s ?? DEFAULT_S;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 s="${s}"`, en: `Init s="${s}"` })
    .setBars([...s].map((c, i) => ({ value: i + 1, role: 'default' as BarRole, label: c })))
    .setAux([{ label: '目标', value: '不同子序列数', role: 'compare' as BarRole }])
    .commit();

  distinctSubsequences(s, {
    onChar: (index, char, count) => {
      rec
        .begin({
          zh: `处理 s[${index}]='${char}' 计数=${count}`,
          en: `process s[${index}]='${char}' count=${count}`,
        })
        .setBars(
          [...s].map((c, i) => ({
            value: i + 1,
            role: (i === index ? 'pivot' : i < index ? 'sorted' : 'default') as BarRole,
            label: c,
          })),
        )
        .setAux([{ label: '当前计数', value: String(count), role: 'final' as BarRole }])
        .commit();
    },
  });

  const result = distinctSubsequences(s);
  rec
    .begin({ zh: `完成：${result} 个不同子序列`, en: `Done: ${result} distinct subsequences` })
    .setAux([{ label: '结果', value: String(result), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
