// =============================================================================
// 拉马努金出租车数 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ramanujanTaxicab, type TaxicabHooks } from './impl.ts';

export const DEFAULT_INPUT = 20; // a,b 上限 20 足以找到 1729

type Found = { sum: number; reprs: Array<[number, number]> };

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const limit = input;
  const map = new Map<number, Array<[number, number]>>();
  let curPair: { a: number; b: number; sum: number } | null = null;
  const foundRef: { value: Found | null } = { value: null };

  const render = (note: { zh: string; en: string }): void => {
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      {
        label: '当前',
        value: curPair ? `${curPair.a}³+${curPair.b}³=${curPair.sum}` : '—',
        role: 'compare',
      },
    ];
    // 显示已收集的「两种表示」候选
    const candidates = [...map.entries()]
      .filter(([, v]) => v.length >= 2)
      .sort((x, y) => x[0] - y[0]);
    for (const c of candidates.slice(0, 3)) {
      aux.push({
        label: `候选 ${c[0]}`,
        value: c[1].map(([a, b]) => `${a}³+${b}³`).join(' = '),
        role: 'final',
      });
    }
    if (foundRef.value) {
      aux.push({
        label: '答案',
        value: `${foundRef.value.sum} = ${foundRef.value.reprs.map(([a, b]) => `${a}³+${b}³`).join(' = ')}`,
        role: 'final',
      });
    }
    rec
      .begin(note)
      .setBars(
        curPair
          ? [
              {
                value: Math.pow(curPair.a, 3),
                role: 'frontier' as BarRole,
                label: `${curPair.a}³`,
              },
              {
                value: Math.pow(curPair.b, 3),
                role: 'frontier' as BarRole,
                label: `${curPair.b}³`,
              },
              { value: curPair.sum, role: 'compare' as BarRole, label: String(curPair.sum) },
            ]
          : [],
      )
      .setAux(aux)
      .commit();
  };

  render({ zh: `枚举 a³+b³，a<b<=${limit}`, en: `Enumerate a³+b³, a<b<=${limit}` });

  const hooks: TaxicabHooks = {
    onPair: (a, b, sum) => {
      curPair = { a, b, sum };
      const list = map.get(sum);
      if (list) {
        if (list.every(([x, y]) => x !== a && y !== b)) list.push([a, b]);
      } else {
        map.set(sum, [[a, b]]);
      }
      // 只在出现新候选或接近时渲染，避免过多帧
      if (map.get(sum)!.length >= 2) {
        render({
          zh: `${sum} = ${map
            .get(sum)!
            .map(([x, y]) => `${x}³+${y}³`)
            .join(' = ')}`,
          en: `${sum} = ${map
            .get(sum)!
            .map(([x, y]) => `${x}³+${y}³`)
            .join(' = ')}`,
        });
      }
    },
    onFound: (sum, reprs) => {
      foundRef.value = { sum, reprs };
      render({ zh: `找到 ${sum}`, en: `Found ${sum}` });
    },
    onResult: () => {
      curPair = null;
    },
  };

  ramanujanTaxicab(limit, hooks);

  rec
    .begin({
      zh: foundRef.value ? `Ta(2) = ${foundRef.value.sum}` : '未找到',
      en: foundRef.value ? `Ta(2) = ${foundRef.value.sum}` : 'not found',
    })
    .setBars(
      foundRef.value
        ? [
            { value: 1, role: 'final' as BarRole, label: '1³' },
            { value: 1728, role: 'final' as BarRole, label: '12³' },
            { value: 729, role: 'final' as BarRole, label: '9³' },
            { value: 1000, role: 'final' as BarRole, label: '10³' },
            {
              value: foundRef.value.sum,
              role: 'compare' as BarRole,
              label: String(foundRef.value.sum),
            },
          ]
        : [],
    )
    .setAux([
      {
        label: '答案',
        value: foundRef.value
          ? `${foundRef.value.sum} = ${foundRef.value.reprs.map(([a, b]) => `${a}³+${b}³`).join(' = ')}`
          : '未找到',
        role: foundRef.value ? 'final' : 'warn',
      },
    ])
    .commit();

  return rec.build();
}
