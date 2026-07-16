import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bwtTransform } from '../../src/algorithms/compression/comp-bzip2-bwt/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-bzip2-bwt/trace.ts';
test('bwt banana -> annb$aa', () => assert.equal(bwtTransform('banana').last, 'annb$aa'));
test('bwt trace 非空', () => assert.ok(buildTrace().length >= 2));
