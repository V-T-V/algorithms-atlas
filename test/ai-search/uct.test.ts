import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UCT, uctValue, uctBandit, makeLcg } from '../../src/algorithms/ai-search/uct/impl.ts';

test('uctValue visits=0 返回 Infinity（强制探索）', () => {
  assert.equal(uctValue(0, 0, 10), Infinity);
});

test('uctValue 利用项 = wins/visits', () => {
  // 探索项 = C * sqrt(ln(10)/4)，但利用项必为 0.75
  const v = uctValue(4, 3, 10, 0); // C=0 → 纯利用
  assert.equal(v, 0.75);
});

test('uctValue 探索项随 visits 增大而减小（固定 wins 比例）', () => {
  // 同样 50% 胜率，访问数多的探索项更小
  const c = Math.SQRT2;
  const v1 = uctValue(2, 1, 100, c);
  const v2 = uctValue(100, 50, 100, c);
  assert.ok(v2 < v1, '访问多的节点 UCB 应更小');
});

test('UCT.selectBest 全未访问时返回第一个（Infinity 平局取首个）', () => {
  const uct = new UCT();
  const parent = { visits: 0, wins: 0 };
  const children = [
    { visits: 0, wins: 0 },
    { visits: 0, wins: 0 },
  ];
  assert.equal(uct.selectBest(parent, children), 0);
});

test('UCT.selectBest 高胜率低访问 vs 低胜率高访问，平衡选择', () => {
  const uct = new UCT(Math.SQRT2);
  const parent = { visits: 20, wins: 0 };
  // 子 A：1 次 1 胜（exploit=1, explore 大）
  // 子 B：10 次 5 胜（exploit=0.5, explore 小）
  const children = [
    { visits: 1, wins: 1 },
    { visits: 10, wins: 5 },
  ];
  const idx = uct.selectBest(parent, children);
  // A 的 UCB = 1 + sqrt(ln20/1) ≈ 1 + 3.0 = 4.0
  // B 的 UCB = 0.5 + sqrt(ln20/10) ≈ 0.5 + 0.44 = 0.94
  // A 明显更高
  assert.equal(idx, 0);
});

test('UCT.selectBest 钩子被调用', () => {
  const uct = new UCT();
  let called = 0;
  uct.selectBest({ visits: 5, wins: 0 }, [{ visits: 1, wins: 1 }], Math.SQRT2, {
    onSelect: () => called++,
  });
  assert.equal(called, 1);
});

test('UCT.selectBest 空数组抛错', () => {
  const uct = new UCT();
  assert.throws(() => uct.selectBest({ visits: 0, wins: 0 }, []), /不能为空/);
});

test('uctBandit 收敛到真实最优臂', () => {
  const rewards = [0.9, 0.1];
  const r = uctBandit(rewards, 100, Math.SQRT2, makeLcg(42));
  const bestArm = r.selections.indexOf(Math.max(...r.selections));
  assert.equal(bestArm, 0, '应选真实最优臂 0');
});

test('uctBandit 总选择次数 = 迭代次数', () => {
  const r = uctBandit([0.5, 0.5, 0.5], 50, Math.SQRT2, makeLcg(1));
  assert.equal(
    r.selections.reduce((a, b) => a + b, 0),
    50,
  );
  assert.equal(r.parent.visits, 50);
});

test('uctBandit 固定种子可复现', () => {
  const a = uctBandit([0.8, 0.3, 0.5], 30, Math.SQRT2, makeLcg(7));
  const b = uctBandit([0.8, 0.3, 0.5], 30, Math.SQRT2, makeLcg(7));
  assert.deepEqual(a.selections, b.selections);
});

test('UCT.ucbValues 长度 = 子节点数', () => {
  const uct = new UCT();
  const v = uct.ucbValues({ visits: 10, wins: 0 }, [
    { visits: 2, wins: 1 },
    { visits: 3, wins: 0 },
    { visits: 0, wins: 0 },
  ]);
  assert.equal(v.length, 3);
  assert.equal(v[2], Infinity); // 第三个未访问
});
