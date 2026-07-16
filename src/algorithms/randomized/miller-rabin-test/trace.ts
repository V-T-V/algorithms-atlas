// =============================================================================
// Miller-Rabin 随机化素性测试 · 录制帧序列
// 用 setAux 展示分解 n−1=2^s·d、每轮的基 a、a^d (mod n) 与判定。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { millerRabin, makeRng, type MillerRabinHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // 561 = 3·11·17 是最小的 Carmichael 数（费马伪素数，但 Miller-Rabin 能识破）
  n: 561n,
  rounds: 8,
  seed: 42,
  useDeterministic: false,
};

interface BuildTraceInput {
  n?: bigint;
  rounds?: number;
  seed?: number;
  useDeterministic?: boolean;
}

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const n = input.n ?? DEFAULT_INPUT.n;
  const rounds = input.rounds ?? DEFAULT_INPUT.rounds;
  const seed = input.seed ?? DEFAULT_INPUT.seed;
  const useDeterministic = input.useDeterministic ?? DEFAULT_INPUT.useDeterministic;

  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `Miller-Rabin 检验 n=${n}（${useDeterministic ? '确定性基组' : `${rounds} 轮随机`}）`,
      en: `Miller-Rabin test n=${n} (${useDeterministic ? 'deterministic bases' : `${rounds} random rounds`})`,
    })
    .setAux([
      { label: 'n', value: String(n), role: 'pivot' as BarRole },
      { label: '模式', value: useDeterministic ? '确定性' : '随机化', role: 'frontier' as BarRole },
      {
        label: '轮数',
        value: useDeterministic ? '基组大小' : String(rounds),
        role: 'default' as BarRole,
      },
      {
        label: '单边错误',
        value: useDeterministic ? '0（n<2^64）' : '≤1/4',
        role: 'default' as BarRole,
      },
    ])
    .commit();

  const hooks: MillerRabinHooks = {
    onDecompose: (s, d) => {
      rec
        .begin({
          zh: `分解 n−1 = 2^${s} · ${d}`,
          en: `Decompose n−1 = 2^${s} · ${d}`,
        })
        .setAux([
          { label: 'n−1', value: String(n - 1n), role: 'pivot' as BarRole },
          { label: 's', value: String(s), role: 'compare' as BarRole },
          { label: 'd', value: String(d), role: 'compare' as BarRole },
        ])
        .commit();
    },
    onBase: (round, a) => {
      rec
        .begin({
          zh: `轮 ${round + 1}：选基 a=${a}`,
          en: `Round ${round + 1}: pick base a=${a}`,
        })
        .setAux([
          { label: '轮', value: String(round + 1), role: 'pivot' as BarRole },
          { label: 'a', value: String(a), role: 'swap' as BarRole },
        ])
        .commit();
    },
    onAd: (round, ad) => {
      rec
        .begin({
          zh: `轮 ${round + 1}：a^d mod n = ${ad}`,
          en: `Round ${round + 1}: a^d mod n = ${ad}`,
        })
        .setAux([
          { label: '轮', value: String(round + 1), role: 'pivot' as BarRole },
          { label: 'a^d mod n', value: String(ad), role: 'compare' as BarRole },
        ])
        .commit();
    },
    onRound: (round, passed) => {
      rec
        .begin({
          zh: `轮 ${round + 1}：${passed ? '通过（无法证伪）' : '失败（a 证明 n 为合数）'}`,
          en: `Round ${round + 1}: ${passed ? 'pass (cannot disprove)' : 'fail (a proves composite)'}`,
        })
        .setAux([
          { label: '轮', value: String(round + 1), role: 'pivot' as BarRole },
          {
            label: '结果',
            value: passed ? '通过' : '失败',
            role: (passed ? 'default' : 'warn') as BarRole,
          },
        ])
        .commit();
    },
    onResult: (probablyPrime, roundsRun) => {
      rec
        .begin({
          zh: probablyPrime
            ? `完成：${roundsRun} 轮全通过 → ${n} 极可能为素数`
            : `完成：第 ${roundsRun} 轮证伪 → ${n} 一定为合数`,
          en: probablyPrime
            ? `Done: all ${roundsRun} rounds passed → ${n} is probably prime`
            : `Done: disproven at round ${roundsRun} → ${n} is definitely composite`,
        })
        .setAux([
          {
            label: '结论',
            value: probablyPrime ? '极可能素数' : '一定合数',
            role: (probablyPrime ? 'final' : 'warn') as BarRole,
          },
          { label: '轮数', value: String(roundsRun), role: 'default' as BarRole },
        ])
        .commit();
    },
  };

  millerRabin(n, rounds, makeRng(seed), useDeterministic, hooks);

  return rec.build();
}
