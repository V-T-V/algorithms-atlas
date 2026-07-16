// =============================================================================
// CSV 解析器（状态机）· 纯算法实现
// 逐字符状态机：FieldStart / Unquoted / Quoted / QuoteEnd。
// 支持：引号字段、转义双引号 ("")、字段内换行、\r\n / \n / \r 统一。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 状态机状态。 */
export type CsvState = 'FieldStart' | 'Unquoted' | 'Quoted' | 'QuoteEnd';

/** 事件钩子。 */
export interface CsvHooks {
  /** 进入新记录（行）。 */
  onRecord?: (recordIndex: number) => void;
  /** 进入新字段。 */
  onField?: (recordIndex: number, fieldIndex: number) => void;
  /** 状态转换。 */
  onTransition?: (from: CsvState, to: CsvState, char: string) => void;
  /** 字段完成。 */
  onFieldEnd?: (value: string, quoted: boolean) => void;
  /** 记录完成。 */
  onRecordEnd?: (fields: string[]) => void;
  /** 解析完成。 */
  onResult?: (rows: string[][]) => void;
}

export interface CsvOptions {
  /** 字段分隔符，默认 ','。 */
  delimiter?: string;
}

/**
 * 解析 CSV 字符串为二维数组（行 × 字段）。
 *
 * @param text CSV 文本
 * @param options 选项
 * @param hooks 可选事件钩子
 * @returns 行数组，每行是字段数组
 */
export function parseCsv(text: string, options: CsvOptions = {}, hooks: CsvHooks = {}): string[][] {
  const delimiter = options.delimiter ?? ',';
  const rows: string[][] = [];
  let curRow: string[] = [];
  let curField = '';
  let quoted = false;
  let state: CsvState = 'FieldStart';
  let recordIndex = 0;
  let fieldIndex = 0;
  let fieldStarted = false;

  hooks.onRecord?.(recordIndex);
  hooks.onField?.(recordIndex, fieldIndex);

  const finishField = (): void => {
    curRow.push(curField);
    hooks.onFieldEnd?.(curField, quoted);
    curField = '';
    quoted = false;
    fieldIndex++;
    fieldStarted = false;
  };

  const finishRecord = (): void => {
    // 确保最后一个字段被收尾（除非字段尚未开始且为空行——这里保留空字段）
    if (fieldStarted || curField.length > 0 || state !== 'FieldStart') {
      finishField();
    } else if (curRow.length === 0 && curField.length === 0) {
      // 空行：仍算一个空字段，保持每行字段数一致行为由调用方判断
      finishField();
    }
    rows.push(curRow);
    hooks.onRecordEnd?.(curRow);
    curRow = [];
    curField = '';
    fieldIndex = 0;
    recordIndex++;
    hooks.onRecord?.(recordIndex);
    hooks.onField?.(recordIndex, fieldIndex);
    state = 'FieldStart';
    fieldStarted = false;
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    fieldStarted = true;

    if (ch === '\r') {
      // 可能是 \r\n 或单独 \r
      if (state === 'Quoted' || state === 'QuoteEnd') {
        // 引号内的换行：作为字段内容
        curField += state === 'QuoteEnd' ? '"' : '';
        if (state === 'QuoteEnd') state = 'Quoted';
        curField += '\r';
        continue;
      }
      // 记录结束
      finishRecord();
      // 跳过可能的 \n
      if (text[i + 1] === '\n') i++;
      continue;
    }

    if (ch === '\n') {
      if (state === 'Quoted' || state === 'QuoteEnd') {
        curField += state === 'QuoteEnd' ? '"' : '';
        if (state === 'QuoteEnd') state = 'Quoted';
        curField += '\n';
        continue;
      }
      finishRecord();
      continue;
    }

    const prevState: CsvState = state;
    switch (state) {
      case 'FieldStart': {
        if (ch === '"') {
          state = 'Quoted';
          quoted = true;
        } else if (ch === delimiter) {
          // 空字段
          finishField();
          hooks.onField?.(recordIndex, fieldIndex);
          state = 'FieldStart';
          fieldStarted = false;
        } else {
          curField += ch;
          state = 'Unquoted';
        }
        break;
      }
      case 'Unquoted': {
        if (ch === delimiter) {
          finishField();
          hooks.onField?.(recordIndex, fieldIndex);
          state = 'FieldStart';
          fieldStarted = false;
        } else {
          curField += ch;
        }
        break;
      }
      case 'Quoted': {
        if (ch === '"') {
          state = 'QuoteEnd';
        } else {
          curField += ch;
        }
        break;
      }
      case 'QuoteEnd': {
        if (ch === '"') {
          // 转义：两个引号 = 一个字面引号
          curField += '"';
          state = 'Quoted';
        } else if (ch === delimiter) {
          finishField();
          hooks.onField?.(recordIndex, fieldIndex);
          state = 'FieldStart';
          fieldStarted = false;
        } else {
          // 引号后的其他字符：容忍处理（RFC 严格模式会报错，这里追加）
          curField += ch;
          state = 'Unquoted';
        }
        break;
      }
    }
    if (state !== prevState) hooks.onTransition?.(prevState, state, ch);
  }

  // 收尾：最后一条记录
  if (fieldStarted || curField.length > 0 || state !== 'FieldStart' || curRow.length > 0) {
    if (state === 'QuoteEnd') {
      // 闭合引号
    }
    if (fieldStarted || curField.length > 0) {
      finishField();
    } else if (curRow.length === 0 && text.length > 0) {
      finishField();
    }
    if (curRow.length > 0) {
      rows.push(curRow);
      hooks.onRecordEnd?.(curRow);
    }
  }

  hooks.onResult?.(rows);
  return rows;
}

/** 便捷：解析后返回行数组。 */
export function parseCsvSimple(text: string, options: CsvOptions = {}): string[][] {
  return parseCsv(text, options);
}
