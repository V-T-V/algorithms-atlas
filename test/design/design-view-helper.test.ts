import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FormatHelper, renderView } from '../../src/algorithms/design/design-view-helper/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-view-helper/trace.ts';
test('money 格式', () => assert.equal(FormatHelper.money(19.5, '$'), '$19.50'));
test('truncate', () => assert.equal(FormatHelper.truncate('abcdef', 3), 'abc...'));
test('view-helper trace 非空', () => assert.ok(buildTrace().length > 0));
