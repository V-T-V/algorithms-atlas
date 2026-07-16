import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twoSat, type TwoSatInput } from '../../src/algorithms/graph/two-sat/impl.ts';

/** 校验一组赋值是否满足所有子句。 */
function satisfies(input: TwoSatInput, asg: boolean[]): boolean {
  for (const [a, b] of input.clauses) {
    const va = asg[a.var] !== a.neg; // 取非则翻转
    const vb = asg[b.var] !== b.neg;
    if (!(va || vb)) return false;
  }
  return true;
}

const SAT: TwoSatInput = {
  n: 4,
  clauses: [
    [
      { var: 0, neg: false },
      { var: 1, neg: false },
    ],
    [
      { var: 0, neg: true },
      { var: 2, neg: false },
    ],
    [
      { var: 1, neg: true },
      { var: 2, neg: true },
    ],
    [
      { var: 3, neg: false },
      { var: 2, neg: true },
    ],
  ],
};

test('two-sat 可满足实例', () => {
  const { sat, assignment } = twoSat(SAT);
  assert.equal(sat, true);
  assert.ok(assignment !== null);
  assert.equal(assignment!.length, 4);
  assert.ok(satisfies(SAT, assignment!), '求得的赋值应满足所有子句');
});

test('two-sat 不可满足实例 (x ∧ ¬x)', () => {
  const unsat: TwoSatInput = {
    n: 1,
    clauses: [
      // (x0 ∨ x0) ∧ (¬x0 ∨ ¬x0)  ⟺  x0 ∧ ¬x0
      [
        { var: 0, neg: false },
        { var: 0, neg: false },
      ],
      [
        { var: 0, neg: true },
        { var: 0, neg: true },
      ],
    ],
  };
  const { sat, assignment } = twoSat(unsat);
  assert.equal(sat, false);
  assert.equal(assignment, null);
});

test('two-sat 经典环约束 (x→y→¬x)', () => {
  // (x0 ∨ x1) ∧ (¬x0 ∨ x1) ∧ (¬x1 ∨ x1=恒真略)... 用蕴含链
  // 强制 x1 必真、x0 任意：¬x0→x1, ¬x1→x0 即 (x0∨x1)(x1∨x0)
  const g: TwoSatInput = {
    n: 2,
    clauses: [
      [
        { var: 0, neg: false },
        { var: 1, neg: false },
      ],
      [
        { var: 0, neg: true },
        { var: 1, neg: false },
      ],
    ],
  };
  const { sat, assignment } = twoSat(g);
  assert.equal(sat, true);
  assert.ok(assignment !== null);
  // 子句强制 x1 必为真
  assert.equal(assignment![1], true);
});

test('two-sat 等价类：三变量互斥不可全满足', () => {
  // 三角约束：(x0∨x1)(¬x0∨x1)... 改用经典不可满足：x0↔¬x0 链
  // (x0∨x0)(¬x0∨¬x0) 已覆盖，这里测多变量可达同一矛盾
  const g: TwoSatInput = {
    n: 3,
    clauses: [
      // x0→x1, x1→x2, x2→¬x0, 且 ¬x0→¬x1 ... 构造 x0 ⇔ ¬x0
      [
        { var: 0, neg: true },
        { var: 1, neg: false },
      ], // x0→x1
      [
        { var: 1, neg: true },
        { var: 2, neg: false },
      ], // x1→x2
      [
        { var: 2, neg: true },
        { var: 0, neg: true },
      ], // x2→¬x0
      [
        { var: 0, neg: false },
        { var: 0, neg: false },
      ], // x0 ∨ x0  => x0 必真
    ],
  };
  const { sat } = twoSat(g);
  assert.equal(sat, false, 'x0 必真但 x0→x1→x2→¬x0 矛盾');
});

test('two-sat 空子句恒可满足', () => {
  const g: TwoSatInput = { n: 3, clauses: [] };
  const { sat, assignment } = twoSat(g);
  assert.equal(sat, true);
  assert.equal(assignment!.length, 3);
});

test('two-sat 钩子被调用', () => {
  let edges = 0;
  let comps = 0;
  let doneSat: boolean | null = null;
  twoSat(SAT, {
    onImplication: () => edges++,
    onComponent: () => comps++,
    onDone: (s) => {
      doneSat = s;
    },
  });
  assert.equal(edges, SAT.clauses.length * 2);
  assert.ok(comps >= 1, '至少形成一个 SCC');
  assert.equal(doneSat, true);
});

test('two-sat 赋值与计算结果一致', () => {
  const { assignment } = twoSat(SAT);
  // 由算法赋值，逐子句核对
  assert.ok(assignment !== null);
  for (const [a, b] of SAT.clauses) {
    const va = assignment![a.var] !== a.neg;
    const vb = assignment![b.var] !== b.neg;
    assert.ok(
      va || vb,
      `子句 (${a.var}${a.neg ? '¬' : ''} ∨ ${b.var}${b.neg ? '¬' : ''}) 未被满足`,
    );
  }
});
