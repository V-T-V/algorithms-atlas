export interface PbHooks {
  onIter?: (i: number, u: number[]) => void;
}
export function pbkdf2(
  password: number[],
  salt: number[],
  iterations: number,
  dkLen: number,
  hooks: PbHooks = {},
): number[] {
  const block = (i: number): number[] => {
    let u = salt.concat([(i >> 24) & 0xff, (i >> 16) & 0xff, (i >> 8) & 0xff, i & 0xff]);
    let t: number[] = [];
    for (let it = 0; it < iterations; it++) {
      u = u.map((b, j) => (b ^ password[j % password.length]!) & 0xff);
      t = t.map((b, j) => b ^ u[j % u.length]!);
      if (!t.length) t = [...u];
      hooks.onIter?.(it, u);
    }
    return t;
  };
  const out: number[] = [];
  let i = 1;
  while (out.length < dkLen) {
    out.push(...block(i));
    i++;
  }
  return out.slice(0, dkLen);
}
