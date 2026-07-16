import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ImageProxy } from './impl.ts';

interface TraceInput {
  keys: string[];
  cost: number;
}
export const DEFAULT_INPUT: TraceInput = { keys: ['a', 'b', 'a', 'c', 'a'], cost: 10 };

export function buildTrace(input: TraceInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const proxies = new Map<string, ImageProxy>();
  let loadCount = 0;
  let cacheHit = 0;
  const hooks = {
    onLoad: (key: string) => {
      loadCount++;
      rec
        .begin({ zh: `加载图像 "${key}"（实际加载）`, en: `Load image "${key}" (real)` })
        .setAux([
          { label: 'key', value: key, role: 'frontier' as BarRole },
          { label: '累计加载', value: String(loadCount), role: 'pivot' as BarRole },
        ])
        .commit();
    },
    onAccess: (key: string, cached: boolean) => {
      if (cached) cacheHit++;
      rec
        .begin({
          zh: `访问 "${key}" → ${cached ? '缓存命中' : '首次加载'}`,
          en: `Access "${key}" → ${cached ? 'cache hit' : 'first load'}`,
        })
        .setAux([
          {
            label: '缓存命中',
            value: cached ? 'yes' : 'no',
            role: (cached ? 'sorted' : 'final') as BarRole,
          },
        ])
        .commit();
    },
  };
  rec
    .begin({ zh: '准备访问图像序列', en: 'Ready to access image sequence' })
    .setAux([{ label: '访问次数', value: String(input.keys.length), role: 'default' as BarRole }])
    .commit();
  for (const k of input.keys) {
    if (!proxies.has(k)) proxies.set(k, new ImageProxy(k, input.cost, hooks));
    proxies.get(k)!.render();
  }
  rec
    .begin({
      zh: `实际加载 ${loadCount} 次，缓存命中 ${cacheHit} 次`,
      en: `${loadCount} real loads, ${cacheHit} cache hits`,
    })
    .setAux([
      { label: '加载', value: String(loadCount), role: 'final' as BarRole },
      { label: '命中', value: String(cacheHit), role: 'sorted' as BarRole },
    ])
    .commit();
  return rec.build();
}
