// =============================================================================
// 拜占庭协定（简化）· 录制帧序列
// 用 setAux 展示各进程的决策、是否一致；用 setMap 展示 round1 收到的值矩阵。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runByzantine, type ByzantineHooks } from './impl.ts';

/** 默认演示：4 个将军（1 叛徒），无叛变时全 1，达成攻；叛徒造谣时仍一致。 */
export function defaultInput(): {
  n: number;
  honestValues: number[];
  honestIndices: number[];
  traitorValuesByRound: Array<Record<number, Record<number, number>>>;
  f: number;
} {
  // P3 是叛徒
  return {
    n: 4,
    honestValues: [1, 1, 1],
    honestIndices: [0, 1, 2],
    f: 1,
    // P3 每轮对不同人发不同值（制造混乱）
    traitorValuesByRound: [{ 3: { 0: 0, 1: 1, 2: 0 } }, { 3: { 0: 1, 1: 0, 2: 1 } }],
  };
}

interface TraceOptions {
  n: number;
  honestValues: number[];
  honestIndices: number[];
  traitorValuesByRound: Array<Record<number, Record<number, number>>>;
  f: number;
}

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const def = defaultInput();
  const n = opts.n ?? def.n;
  const honestValues = opts.honestValues ?? def.honestValues;
  const honestIndices = opts.honestIndices ?? def.honestIndices;
  const traitorValuesByRound = opts.traitorValuesByRound ?? def.traitorValuesByRound;
  const f = opts.f ?? def.f;
  const rec = new TraceRecorder();

  const decisions = new Array<number>(n).fill(-1);
  const honestSet = new Set(honestIndices);

  const snapshot = (note: { zh: string; en: string }, highlightProc?: number): void => {
    const map = decisions.map((d, p) => ({
      key: `P${p}${honestSet.has(p) ? '' : '(叛)'}`,
      value: d === -1 ? '?' : String(d),
      role: (p === highlightProc ? 'swap' : honestSet.has(p) ? 'compare' : 'warn') as BarRole,
    }));
    rec
      .begin(note)
      .setMap(map)
      .setAux([
        {
          label: '诚实进程决策',
          value: honestIndices.map((i) => `P${i}=${decisions[i]}`).join(', '),
          role: 'final' as BarRole,
        },
        {
          label: '叛徒',
          value:
            Array.from({ length: n }, (_, i) => i)
              .filter((i) => !honestSet.has(i))
              .map((i) => `P${i}`)
              .join(',') || '无',
          role: 'warn' as BarRole,
        },
      ])
      .commit();
  };

  snapshot({ zh: `初始化：${n} 将军，${f} 叛徒`, en: `Init: ${n} generals, ${f} traitors` });

  rec
    .begin({
      zh: 'Round 1：各将军广播初始值（叛徒可对不同人发不同值）',
      en: 'Round 1: each general broadcasts initial value (traitors may equivocate)',
    })
    .setAux([
      ...honestIndices.map((i, k) => ({
        label: `P${i} 初始`,
        value: String(honestValues[k]),
        role: 'compare' as BarRole,
      })),
      { label: 'P3(叛)', value: '造谣: {0,1,0}', role: 'warn' as BarRole },
    ])
    .commit();

  rec
    .begin({
      zh: 'Round 2：每个将军转发自己 Round 1 收到的值',
      en: 'Round 2: each general forwards what it received in Round 1',
    })
    .setAux([
      { label: '转发', value: '诚实者如实转发，叛徒可继续造谣', role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: ByzantineHooks = {
    onDecide: (p, d) => {
      decisions[p] = d;
    },
  };

  runByzantine(n, honestValues, honestIndices, traitorValuesByRound, f, hooks);

  // 决策帧：逐个高亮
  for (let p = 0; p < n; p++) {
    snapshot({ zh: `P${p} 决策 = ${decisions[p]}`, en: `P${p} decides = ${decisions[p]}` }, p);
  }

  const honestDecisions = honestIndices.map((i) => decisions[i]!);
  const agree = honestDecisions.every((d) => d === honestDecisions[0]);
  rec
    .begin({
      zh: `完成：诚实进程${agree ? '达成一致（决策=' + honestDecisions[0] + '）' : '未一致'}`,
      en: `Done: honest processes ${agree ? 'agreed (decision=' + honestDecisions[0] + ')' : 'disagree'}`,
    })
    .setMap(
      decisions.map((d, p) => ({
        key: `P${p}`,
        value: String(d),
        role: (honestSet.has(p) ? 'final' : 'warn') as BarRole,
      })),
    )
    .setAux([
      { label: '一致?', value: agree ? '是' : '否', role: (agree ? 'final' : 'warn') as BarRole },
    ])
    .commit();

  return rec.build();
}
