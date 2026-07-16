import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  backupSingle,
  backupTwoPlayer,
  pathToRoot,
  type BPNode,
} from '../../src/algorithms/ai-search/ais-backpropagate/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-backpropagate/trace.ts';

test('ais-backpropagate 单人回传累加', () => {
  const root: BPNode = { visits: 0, wins: 0, parent: null };
  const child: BPNode = { visits: 0, wins: 0, parent: root };
  backupSingle(child, 1);
  assert.equal(child.visits, 1);
  assert.equal(child.wins, 1);
  assert.equal(root.visits, 1);
  assert.equal(root.wins, 1);
});

test('ais-backpropagate 多次回传累积', () => {
  const root: BPNode = { visits: 0, wins: 0, parent: null };
  const child: BPNode = { visits: 0, wins: 0, parent: root };
  backupSingle(child, 1);
  backupSingle(child, 0);
  backupSingle(child, 1);
  assert.equal(child.visits, 3);
  assert.equal(child.wins, 2);
});

test('ais-backpropagate 双人交替取反', () => {
  const root: BPNode = { visits: 0, wins: 0, parent: null };
  const child: BPNode = { visits: 0, wins: 0, parent: root };
  backupTwoPlayer(child, 1); // child wins+=1, root wins+=0
  assert.equal(child.wins, 1);
  assert.equal(root.wins, 0);
});

test('ais-backpropagate pathToRoot', () => {
  const root: BPNode = { visits: 0, wins: 0, parent: null };
  const mid: BPNode = { visits: 0, wins: 0, parent: root };
  const leaf: BPNode = { visits: 0, wins: 0, parent: mid };
  const path = pathToRoot(leaf);
  assert.equal(path.length, 3);
  assert.equal(path[0], leaf);
  assert.equal(path[2], root);
});

test('ais-backpropagate trace', () => {
  assert.ok(buildTrace().length > 2);
});
