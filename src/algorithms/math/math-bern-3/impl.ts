// =============================================================================
// Bernoulli 数（有理）
// =============================================================================

import { Combinatorics } from '../math-comb-3/impl.ts';

export interface Rational {
  num: bigint;
  den: bigint;
}

function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

function simplify(r: Rational): Rational {
  if (r.num === 0n) return { num: 0n, den: 1n };
  const g = gcd(r.num, r.den);
  return { num: r.num / g, den: r.den / g };
}

function rAdd(a: Rational, b: Rational): Rational {
  return simplify({ num: a.num * b.den + b.num * a.den, den: a.den * b.den });
}
function rMul(a: Rational, b: Rational): Rational {
  return simplify({ num: a.num * b.num, den: a.den * b.den });
}
function rSub(a: Rational, b: Rational): Rational {
  return simplify({ num: a.num * b.den - b.num * a.den, den: a.den * b.den });
}
function rDiv(a: Rational, b: Rational): Rational {
  return simplify({ num: a.num * b.den, den: a.den * b.num });
}

export interface BernoulliHooks {
  onValue?: (m: number, value: Rational) => void;
  onDone?: (values: Rational[]) => void;
}

export function bernoulliTable(maxM: number, hooks: BernoulliHooks = {}): Rational[] {
  const comb = new Combinatorics(maxM + 2);
  const B: Rational[] = [{ num: 1n, den: 1n }];
  hooks.onValue?.(0, B[0]!);
  for (let m = 1; m <= maxM; m++) {
    let s: Rational = { num: 0n, den: 1n };
    for (let k = 0; k < m; k++) {
      // C(m+1, k) * B[k]
      const c = comb.choose(m + 1, k);
      s = rAdd(s, rMul({ num: c, den: 1n }, B[k]!));
    }
    // B[m] = -s / (m+1)
    const bm = rDiv(rSub({ num: 0n, den: 1n }, s), { num: BigInt(m + 1), den: 1n });
    B.push(bm);
    hooks.onValue?.(m, bm);
  }
  hooks.onDone?.(B);
  return B;
}
