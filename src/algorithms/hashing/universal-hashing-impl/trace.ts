// =============================================================================
// 全域哈希族 · 录制帧序列
// 采样若干哈希函数，把一组键分配到桶，展示冲突分布。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { UniversalHashFamily, type HashFunction, type UniversalHashHooks } from './impl.ts';

export const DEFAULT_INPUT: { keys: number[]; m: number; numTrials: number } = {
  keys: [10, 22, 37, 45, 51, 63, 78, 84, 99, 105, 117, 130],
  m: 8,
  numTrials: 3,
};

function renderBuckets(counts: number[], maxCount: number): { values: number[]; roles: BarRole[] } {
  void maxCount;
  const values = [...counts];
  const roles: BarRole[] = counts.map((c) => {
    if (c === 0) return 'default';
    if (c === 1) return 'final';
    return 'warn';
  });
  return { values, roles };
}

/** 录制演示帧序列。 */
export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { keys, m, numTrials } = input;
  const family = new UniversalHashFamily(m);

  rec
    .begin({
      zh: `全域哈希族：${keys.length} 个键分配到 ${m} 个桶，共采样 ${numTrials} 个不同哈希函数。素数 P=${family.prime}`,
      en: `Universal hash family: ${keys.length} keys into ${m} buckets, sampling ${numTrials} distinct hash functions. prime P=${family.prime}`,
    })
    .setArray(new Array(m).fill(0), new Array(m).fill('default' as BarRole), [])
    .setAux([
      { label: '桶数 m', value: String(m), role: 'pivot' as BarRole },
      { label: '素数 P', value: String(family.prime), role: 'frontier' as BarRole },
      { label: '键数', value: String(keys.length), role: 'compare' as BarRole },
    ])
    .commit();

  for (let trial = 0; trial < numTrials; trial++) {
    const fn: HashFunction = family.sample();
    const counts = family.assign(keys, fn);
    const { values, roles } = renderBuckets(counts, Math.max(...counts));
    const collisions = counts.reduce((acc, c) => acc + (c > 1 ? c - 1 : 0), 0);
    const occupiedBuckets = counts.filter((c) => c > 0).length;
    const maxLoad = Math.max(...counts);

    rec
      .begin({
        zh: `采样 ${trial + 1}/${numTrials}：a=${fn.a}, b=${fn.b}。冲突键数 = ${collisions}，最大桶负载 = ${maxLoad}`,
        en: `Sample ${trial + 1}/${numTrials}: a=${fn.a}, b=${fn.b}. Collisions = ${collisions}, max load = ${maxLoad}`,
      })
      .setArray(values, roles, [])
      .setAux([
        { label: 'a', value: String(fn.a), role: 'compare' as BarRole },
        { label: 'b', value: String(fn.b), role: 'frontier' as BarRole },
        {
          label: '冲突键数',
          value: String(collisions),
          role: (collisions === 0 ? 'final' : 'warn') as BarRole,
        },
        { label: '已用桶', value: `${occupiedBuckets}/${m}`, role: 'default' as BarRole },
        { label: '最大负载', value: String(maxLoad), role: 'pivot' as BarRole },
      ])
      .commit();
  }

  // 终态：理论分析
  const expectedCollisions = (keys.length * (keys.length - 1)) / (2 * m);
  rec
    .begin({
      zh: `理论：任意两键碰撞概率 ≤ 1/m = ${1 / m}，期望冲突对数 ≈ ${expectedCollisions.toFixed(2)}。随机抽样使对手无法构造最坏输入。`,
      en: `Theory: collision prob of any pair ≤ 1/m = ${1 / m}, expected colliding pairs ≈ ${expectedCollisions.toFixed(2)}. Random sampling prevents worst-case adversarial inputs.`,
    })
    .setArray(new Array(m).fill(0), new Array(m).fill('sorted' as BarRole), [])
    .setAux([
      { label: '理论碰撞率', value: `${(100 / m).toFixed(1)}%`, role: 'compare' as BarRole },
      {
        label: '期望冲突对',
        value: expectedCollisions.toFixed(2),
        role: 'final' as BarRole,
      },
      { label: '键数 n', value: String(keys.length), role: 'default' as BarRole },
      { label: '桶数 m', value: String(m), role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: UniversalHashHooks = {};
  void hooks;

  return rec.build();
}
