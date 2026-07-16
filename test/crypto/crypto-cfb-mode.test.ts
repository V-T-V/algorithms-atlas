import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cfbEncrypt } from '../../src/algorithms/crypto/crypto-cfb-mode/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-cfb-mode/trace.ts';
const E = (b: number[]) => b.map((x) => x + 1);
test('cfb 输出块数一致', () => assert.equal(cfbEncrypt([[1, 2]], [0, 0], E).length, 1));
test('cfb trace 非空', () => assert.ok(buildTrace().length > 0));
