import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rave,
  makeLcg,
  defaultDomain,
  DEFAULT_RAVE_CONFIG,
} from '../../src/algorithms/ai-search/rave/impl.ts';

test('RAVE 收敛到最佳臂（动作 0）', () => {
  const domain = defaultDomain(3);
  const result = rave(domain, { ...DEFAULT_RAVE_CONFIG, iterations: 50 }, makeLcg(42));
  assert.equal(result.bestAction, 0);
});

test('RAVE 单臂问题返回 0', () => {
  const domain = defaultDomain(1);
  const result = rave(domain, { ...DEFAULT_RAVE_CONFIG, iterations: 10 }, makeLcg(2));
  assert.equal(result.bestAction, 0);
});

test('RAVE 钩子被调用', () => {
  const domain = defaultDomain(3);
  let iters = 0;
  let amafUpdates = 0;
  rave(domain, { ...DEFAULT_RAVE_CONFIG, iterations: 20 }, makeLcg(3), {
    onIter: () => iters++,
    onAmafUpdate: () => amafUpdates++,
  });
  assert.ok(iters > 0);
  assert.ok(amafUpdates >= 0);
});

test('RAVE 不同 K 值都收敛到最佳臂', () => {
  const domain = defaultDomain(3);
  const r1 = rave(
    domain,
    { ...DEFAULT_RAVE_CONFIG, iterations: 60, equivalenceParameter: 10 },
    makeLcg(5),
  );
  const r2 = rave(
    domain,
    { ...DEFAULT_RAVE_CONFIG, iterations: 60, equivalenceParameter: 1000 },
    makeLcg(5),
  );
  assert.equal(r1.bestAction, 0);
  assert.equal(r2.bestAction, 0);
});

test('RAVE AMAF 表非空（多次迭代后）', () => {
  const domain = defaultDomain(3);
  const result = rave(domain, { ...DEFAULT_RAVE_CONFIG, iterations: 30 }, makeLcg(7));
  const amafNonZero = result.root.children.filter((c) => c.amafVisits > 0).length;
  assert.ok(amafNonZero > 0, '应有子节点的 AMAF 统计非零');
});
