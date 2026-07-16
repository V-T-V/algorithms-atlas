// =============================================================================
// 双模滚动哈希 · 录制帧序列
// 在文本上查询多个子串，用 setArray 高亮子串范围；setAux 显示双哈希元组。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { DoubleRollingHash, PARAMS, type DoubleHashHooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; queries: Array<[number, number]> } = {
  text: 'abcabcabcabc',
  // 查询若干子串：[0,3] 'abc'、[3,6] 'abc'、[1,4] 'bca'、[6,9] 'abc'
  queries: [
    [0, 3],
    [3, 6],
    [1, 4],
    [6, 9],
    [2, 5],
  ],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { text: string; queries: Array<[number, number]> } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { text, queries } = input;
  const values = Array.from(text).map((c) => c.charCodeAt(0));
  const n = values.length;
  const dh = new DoubleRollingHash(text);

  rec
    .begin({
      zh: `文本 "${text}"（${n} 字符）。两套参数：base1=${PARAMS.base1},P1=${PARAMS.prime1} 与 base2=${PARAMS.base2},P2=${PARAMS.prime2}`,
      en: `Text "${text}" (${n} chars). Two param sets: base1=${PARAMS.base1},P1=${PARAMS.prime1} and base2=${PARAMS.base2},P2=${PARAMS.prime2}`,
    })
    .setArray(
      values,
      values.map(() => 'default' as BarRole),
      [],
    )
    .setAux([
      {
        label: 'base1 / P1',
        value: `${PARAMS.base1} / ${PARAMS.prime1}`,
        role: 'compare' as BarRole,
      },
      {
        label: 'base2 / P2',
        value: `${PARAMS.base2} / ${PARAMS.prime2}`,
        role: 'frontier' as BarRole,
      },
      { label: '查询数', value: String(queries.length), role: 'pivot' as BarRole },
    ])
    .commit();

  const seen = new Map<string, number[]>();
  for (let qi = 0; qi < queries.length; qi++) {
    const [l, r] = queries[qi]!;
    const q = dh.hashOf(l, r);
    const key = `${q.h1},${q.h2}`;
    const dupStarts = seen.get(key) ?? [];
    const isDup = dupStarts.length > 0;

    const r2: BarRole[] = values.map((_, j) => {
      if (j >= l && j < r) return isDup ? 'warn' : 'frontier';
      return 'default';
    });
    rec
      .begin({
        zh: `查询[${qi}] 子串 [${l}, ${r}) = "${text.slice(l, r)}"：h1=${q.h1}, h2=${q.h2}${
          isDup ? `（双哈希与已有窗口相同 → 内容相同）` : ''
        }`,
        en: `Query[${qi}] substring [${l}, ${r}) = "${text.slice(l, r)}": h1=${q.h1}, h2=${q.h2}${
          isDup ? ' (both hashes match a prior window → identical content)' : ''
        }`,
      })
      .setArray(values, r2, [
        { index: l, label: 'L' },
        { index: r - 1, label: 'R' },
      ])
      .setAux([
        { label: 'h1', value: String(q.h1), role: 'compare' as BarRole },
        { label: 'h2', value: String(q.h2), role: 'frontier' as BarRole },
        {
          label: '子串内容',
          value: text.slice(l, r),
          role: 'pivot' as BarRole,
        },
        {
          label: '双哈希重复?',
          value: isDup ? '是 → 内容相同' : '否',
          role: (isDup ? 'warn' : 'final') as BarRole,
        },
      ])
      .commit();

    dupStarts.push(l);
    seen.set(key, dupStarts);
  }

  // 终态：分组统计
  const groups = new Map<string, number>();
  for (const [l, r] of queries) {
    const q = dh.hashOf(l, r);
    const key = `${q.h1},${q.h2}`;
    groups.set(key, (groups.get(key) ?? 0) + 1);
  }
  const distinct = groups.size;
  rec
    .begin({
      zh: `完成。${queries.length} 个查询归为 ${distinct} 组（按双哈希）。碰撞概率 ~1/(P1·P2)≈10⁻¹⁸`,
      en: `Done. ${queries.length} queries collapse into ${distinct} group(s) by double hash. Collision prob ~1/(P1·P2)≈10⁻¹⁸`,
    })
    .setArray(
      values,
      values.map(() => 'sorted' as BarRole),
      [],
    )
    .setAux([
      { label: '查询总数', value: String(queries.length), role: 'default' as BarRole },
      {
        label: '不同组数',
        value: String(distinct),
        role: 'final' as BarRole,
      },
      {
        label: '理论碰撞率',
        value: '~10^-18',
        role: 'compare' as BarRole,
      },
    ])
    .commit();

  const hooks: DoubleHashHooks = {};
  void hooks;

  return rec.build();
}
