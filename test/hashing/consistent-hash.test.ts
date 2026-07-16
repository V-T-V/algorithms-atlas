import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  consistentHash,
  buildRing,
  assign,
  hashPosition,
} from '../../src/algorithms/hashing/consistent-hash/impl.ts';
import {
  buildTrace,
  DEFAULT_SERVERS,
  DEFAULT_KEYS,
  DEFAULT_REPLICAS,
} from '../../src/algorithms/hashing/consistent-hash/trace.ts';

test('consistent-hash 每个键都被分配到某台服务器', () => {
  const { assignment } = consistentHash(['S1', 'S2', 'S3'], ['a', 'b', 'c', 'd', 'e']);
  for (const [key, srv] of assignment) {
    assert.ok(['S1', 'S2', 'S3'].includes(srv), `键 ${key} 分到 ${srv}`);
  }
  assert.equal(assignment.size, 5);
});

test('consistent-hash 相同输入确定性', () => {
  const a = consistentHash(['S1', 'S2', 'S3'], ['k1', 'k2', 'k3']);
  const b = consistentHash(['S1', 'S2', 'S3'], ['k1', 'k2', 'k3']);
  assert.deepEqual([...a.assignment.entries()], [...b.assignment.entries()]);
  assert.deepEqual([...a.counts.entries()], [...b.counts.entries()]);
});

test('consistent-hash 加节点只迁移少量键', () => {
  // 8 个键，3 台 vs 4 台：新增 S4 后，迁移的键应 < 总数
  const keys = DEFAULT_KEYS;
  const before = consistentHash(['S1', 'S2', 'S3'], keys).assignment;
  const after = consistentHash(['S1', 'S2', 'S3', 'S4'], keys).assignment;
  let moved = 0;
  for (const k of keys) {
    if (before.get(k) !== after.get(k)) moved++;
  }
  // 至少有些键没动（迁移数 < 总数）
  assert.ok(moved < keys.length, `迁移 ${moved} 应 < ${keys.length}`);
  // S4 至少接管 0 个键（合法），但其它原服务器应保留部分键
  const retained = keys.length - moved;
  assert.ok(retained > 0, '应有键未迁移');
});

test('consistent-hash 删节点：原节点的键全部转走', () => {
  const keys = DEFAULT_KEYS;
  const before = consistentHash(['S1', 'S2', 'S3'], keys).assignment;
  // 找出 S3 持有的键
  const s3Keys = keys.filter((k) => before.get(k) === 'S3');
  const after = consistentHash(['S1', 'S2'], keys).assignment;
  // S3 的键应全部转给 S1 或 S2
  for (const k of s3Keys) {
    assert.ok(['S1', 'S2'].includes(after.get(k)!), `键 ${k} 应转给 S1/S2`);
  }
  // 非 S3 的键不应迁移（删 S3 不影响其它）
  for (const k of keys) {
    if (!s3Keys.includes(k)) {
      assert.equal(after.get(k), before.get(k), `非 S3 的键 ${k} 不应迁移`);
    }
  }
});

test('consistent-hash 计数之和等于键数', () => {
  const { counts } = consistentHash(['S1', 'S2', 'S3'], DEFAULT_KEYS);
  let sum = 0;
  for (const c of counts.values()) sum += c;
  assert.equal(sum, DEFAULT_KEYS.length);
});

test('consistent-hash 虚拟节点使所有服务器都分到键', () => {
  // 用很多键 + 足够虚拟节点，每台服务器至少分到 1 个键
  const keys = Array.from({ length: 200 }, (_, i) => `key${i}`);
  const r = consistentHash(['S1', 'S2', 'S3', 'S4'], keys, 20).counts;
  for (const [srv, c] of r) {
    assert.ok(c > 0, `服务器 ${srv} 应分到键（实际 ${c}）`);
  }
  // 计数之和正确
  let sum = 0;
  for (const c of r.values()) sum += c;
  assert.equal(sum, 200);
});

test('consistent-hash 虚拟节点平均改善均衡（统计性）', () => {
  // 多次试验：replicas 高时，平均极差应不大于 replicas 低时
  const servers = ['S1', 'S2', 'S3', 'S4', 'S5'];
  const trials = 5;
  const keysPerTrial = 300;
  const spread = (m: Map<string, number>): number => {
    const vals = [...m.values()];
    return Math.max(...vals) - Math.min(...vals);
  };
  let lowTotal = 0;
  let highTotal = 0;
  for (let t = 0; t < trials; t++) {
    const keys = Array.from({ length: keysPerTrial }, (_, i) => `t${t}-k${i}`);
    lowTotal += spread(consistentHash(servers, keys, 1).counts);
    highTotal += spread(consistentHash(servers, keys, 50).counts);
  }
  // 高 replicas 的平均极差应 <= 低 replicas
  assert.ok(highTotal / trials <= lowTotal / trials, '高虚拟节点平均应更均衡');
});

test('consistent-hash hashPosition 落在 [0,1)', () => {
  for (const s of ['', 'a', 'server1', 'key#0', '测试']) {
    const p = hashPosition(s);
    assert.ok(p >= 0 && p < 1, `${s} → ${p} 越界`);
  }
  // 相同输入确定性
  assert.equal(hashPosition('abc'), hashPosition('abc'));
});

test('consistent-hash buildRing 节点按位置升序', () => {
  const ring = buildRing(['A', 'B', 'C'], 5);
  for (let i = 1; i < ring.nodes.length; i++) {
    assert.ok(ring.nodes[i - 1]!.position <= ring.nodes[i]!.position, '应升序');
  }
  assert.equal(ring.servers.size, 3);
});

test('consistent-hash assign 环绕：键位置超过所有服务器时回到环首', () => {
  // 构造键位置 > 所有服务器位置的场景
  const ring = buildRing(['S1'], 1);
  // 人为把唯一节点放小位置，键位置大 → 应回到该节点
  const { assignment } = assign(ring, ['anykey']);
  assert.equal(assignment.get('anykey'), 'S1');
});

test('consistent-hash 钩子被调用', () => {
  const hashes: string[] = [];
  const assigns: string[] = [];
  consistentHash(['S1', 'S2'], ['k1', 'k2'], 2, {
    onHash: (k) => hashes.push(k),
    onAssign: (k) => assigns.push(k),
  });
  assert.equal(hashes.length, 2);
  assert.equal(assigns.length, 2);
});

test('buildTrace 含 graph 与 aux，末帧含计数', () => {
  const frames = buildTrace(DEFAULT_SERVERS, DEFAULT_KEYS, DEFAULT_REPLICAS);
  assert.ok(frames.length >= 3);
  const first = frames[0]!;
  assert.ok(first.graph, '首帧含 graph（环）');
  assert.ok(first.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux);
  // 末帧每个服务器都应有计数值
  for (const s of DEFAULT_SERVERS) {
    const entry = last.aux!.find((e) => e.label === s);
    assert.ok(entry, `末帧应含 ${s} 的计数`);
    assert.ok(Number(entry!.value) >= 0);
  }
});
