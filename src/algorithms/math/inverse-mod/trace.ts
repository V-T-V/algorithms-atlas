// =============================================================================
// 模逆元 Modular Inverse · 录制帧序列
// 用 setAux 展示 a、m、当前结果与（扩展欧几里得路径的）每轮算式 a = q·b + r。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { inverseModFermat, inverseModExtGcd, extGcd, type InverseModHooks } from './impl.ts';

export const DEFAULT_INPUT = { a: 3, m: 11, method: 'fermat' as 'fermat' | 'extgcd' };

/** 录制演示帧序列。 */
export function buildTrace(
  input: { a: number; m: number; method?: 'fermat' | 'extgcd' } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { a, m } = input;
  const method = input.method ?? 'fermat';

  let result = 0n;
  let base = BigInt(a);
  let curExp = BigInt(m - 2);
  const steps: Array<{ key: string; value: string; role?: BarRole }> = [];

  const auxRows = (): Array<{ label: string; value: string; role?: BarRole }> => {
    const rows: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'a', value: String(a), role: 'pivot' },
      { label: 'm', value: String(m), role: 'pivot' },
    ];
    if (method === 'fermat') {
      rows.push({ label: 'base', value: base.toString(), role: 'frontier' });
      rows.push({ label: 'exp 剩余', value: curExp.toString(), role: 'compare' });
      rows.push({ label: 'result', value: result.toString(), role: 'final' });
    } else {
      rows.push({ label: 'result', value: result.toString(), role: 'final' });
    }
    return rows;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setAux(auxRows()).setMap(steps.slice()).commit();
  };

  if (method === 'fermat') {
    snapshot({
      zh: `费马小定理：a^(-1) ≡ a^(m-2) = ${a}^${m - 2} (mod ${m})`,
      en: `Fermat: a^(-1) ≡ a^(m-2) = ${a}^${m - 2} (mod ${m})`,
    });

    const hooks: InverseModHooks = {
      onBit: (bit, exp) => {
        curExp = exp;
        if (bit === 1) {
          steps.push({
            key: `bit=1`,
            value: `result = result · base mod ${m}`,
            role: 'compare',
          });
        }
      },
      onSquare: (b) => {
        base = b;
        steps.push({ key: `平方`, value: `base = base² mod ${m} = ${b}`, role: 'frontier' });
        snapshot({
          zh: `base 自乘（平方）→ ${b}`,
          en: `base squared → ${b}`,
        });
      },
      onMultiply: (r, b) => {
        result = r;
        base = b;
        snapshot({
          zh: `该位为 1：result = result · base = ${r}`,
          en: `Bit is 1: result = result · base = ${r}`,
        });
      },
      onDone: (inv) => {
        result = inv;
      },
    };
    inverseModFermat(a, m, hooks);
  } else {
    snapshot({
      zh: `扩展欧几里得：求 x 使 ${a}·x + ${m}·y = gcd = 1`,
      en: `Ext-GCD: find x with ${a}·x + ${m}·y = gcd = 1`,
    });
    let stepNo = 0;
    const hooks: InverseModHooks = {
      onExtGcdStep: (s) => {
        stepNo++;
        steps.push({
          key: `轮 ${stepNo}`,
          value: `${s.a} = ${s.q}·${s.b} + ${s.r}`,
          role: 'frontier',
        });
        snapshot({
          zh: `${s.a} ÷ ${s.b} = ${s.q} 余 ${s.r}`,
          en: `${s.a} ÷ ${s.b} = ${s.q} r ${s.r}`,
        });
      },
      onExtGcdDone: (g, x, _y) => {
        steps.push({
          key: '结果',
          value: `gcd=${g}, x=${x} → a^(-1) ≡ x mod ${m}`,
          role: 'final',
        });
      },
      onDone: (inv) => {
        result = inv;
      },
    };
    inverseModExtGcd(a, m, hooks);
  }

  // 验证：a · inv ≡ 1 mod m
  const check = (BigInt(a) * result) % BigInt(m);
  rec
    .begin({
      zh: `完成：${a}^(-1) mod ${m} = ${result}（验证 ${a}·${result} mod ${m} = ${check}）`,
      en: `Done: ${a}^(-1) mod ${m} = ${result} (check ${a}·${result} mod ${m} = ${check})`,
    })
    .setAux([
      { label: 'a^(-1) mod m', value: result.toString(), role: 'final' },
      { label: '验证 a·inv mod m', value: check.toString(), role: check === 1n ? 'final' : 'warn' },
      ...auxRows(),
    ])
    .setMap(steps.slice())
    .commit();

  // 引用 extGcd 防止未用告警（extgcd 路径已用，这里保留接口可见性）
  void extGcd;

  return rec.build();
}
