import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  readersWriters,
  defaultEvents,
  type RwEvent,
} from '../../src/algorithms/concurrency/readers-writers/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/readers-writers/trace.ts';

test('readers-writers 读者可共享进入', () => {
  const evs: RwEvent[] = [
    { type: 'read', actor: 0 },
    { type: 'read', actor: 1 },
    { type: 'release', actor: 0, role: 'reader' },
    { type: 'release', actor: 1, role: 'reader' },
  ];
  const { result, state } = readersWriters(evs);
  assert.equal(result.readCount, 2);
  assert.equal(result.writeCount, 0);
  assert.equal(result.readerBlocks, 0);
  assert.equal(state.activeReaders, 0);
});

test('readers-writers 写者独占：写时读者阻塞', () => {
  const evs: RwEvent[] = [
    { type: 'write', actor: 0 },
    { type: 'read', actor: 1 }, // 阻塞
    { type: 'read', actor: 2 }, // 阻塞
    { type: 'release', actor: 0, role: 'writer' }, // 唤醒两个读者
    { type: 'release', actor: 1, role: 'reader' },
    { type: 'release', actor: 2, role: 'reader' },
  ];
  const { result, state } = readersWriters(evs);
  assert.equal(result.writeCount, 1);
  assert.equal(result.readCount, 2);
  assert.equal(result.readerBlocks, 2);
  assert.equal(state.activeReaders, 0);
  assert.equal(state.writerActive, 0);
});

test('readers-writers 读优先：有读者时新读者不阻塞（即使写者在等）', () => {
  const evs: RwEvent[] = [
    { type: 'read', actor: 0 },
    { type: 'write', actor: 0 }, // 阻塞（有读者）
    { type: 'read', actor: 1 }, // 读优先：直接进入，不阻塞
    { type: 'release', actor: 0, role: 'reader' },
    { type: 'release', actor: 1, role: 'reader' }, // 读者全退 → 唤醒写者
    { type: 'release', actor: 0, role: 'writer' },
  ];
  const { result } = readersWriters(evs);
  assert.equal(result.readCount, 2);
  assert.equal(result.writeCount, 1);
  assert.equal(result.writerBlocks, 1, '写者应阻塞一次');
  assert.equal(result.readerBlocks, 0, '读者不应阻塞（读优先）');
});

test('readers-writers 写者互斥：写时另一写者阻塞', () => {
  const evs: RwEvent[] = [
    { type: 'write', actor: 0 },
    { type: 'write', actor: 1 }, // 阻塞
    { type: 'release', actor: 0, role: 'writer' }, // 唤醒写者1
    { type: 'release', actor: 1, role: 'writer' },
  ];
  const { result } = readersWriters(evs);
  assert.equal(result.writeCount, 2);
  assert.equal(result.writerBlocks, 1);
});

test('readers-writers 空事件', () => {
  const { result, state } = readersWriters([]);
  assert.equal(result.readCount, 0);
  assert.equal(state.activeReaders, 0);
  assert.equal(state.writerActive, 0);
});

test('readers-writers 钩子被调用', () => {
  const enters: string[] = [];
  const blocks: string[] = [];
  readersWriters(
    [
      { type: 'write', actor: 0 },
      { type: 'read', actor: 1 },
      { type: 'release', actor: 0, role: 'writer' },
      { type: 'release', actor: 1, role: 'reader' },
    ],
    {
      onWriteEnter: (a) => enters.push(`W${a}`),
      onReadEnter: (a) => enters.push(`R${a}`),
      onReaderBlock: (a) => blocks.push(`R${a}`),
      onWriterBlock: (a) => blocks.push(`W${a}`),
    },
  );
  assert.deepEqual(enters, ['W0', 'R1']);
  assert.deepEqual(blocks, ['R1']);
});

test('readers-writers defaultEvents 跑完无残留活跃者', () => {
  const { state, result } = readersWriters(defaultEvents());
  assert.equal(state.activeReaders, 0);
  assert.equal(state.writerActive, 0);
  assert.ok(result.readCount >= 2);
  assert.ok(result.writeCount >= 1);
});

test('buildTrace 含 array 与 aux，末帧资源空闲', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  const first = frames[0]!;
  assert.ok(first.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const resState = last.aux!.find((e) => e.label === '资源状态');
  assert.ok(resState, '末帧应含资源状态');
  assert.equal(resState!.value, '空闲');
});
