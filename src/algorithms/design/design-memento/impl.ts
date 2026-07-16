// 备忘录模式 · 实现
export interface TextEditorHooks {
  onSave?: (snapshot: string, stackDepth: number) => void;
  onRestore?: (snapshot: string, stackDepth: number) => void;
  onChange?: (text: string) => void;
}

export class TextEditorMemento {
  constructor(public readonly text: string) {}
}

export class TextEditor {
  private text = '';
  private history: TextEditorMemento[] = [];
  private readonly hooks: TextEditorHooks;

  constructor(hooks: TextEditorHooks = {}) {
    this.hooks = hooks;
  }

  getText(): string {
    return this.text;
  }

  save(): TextEditorMemento {
    const m = new TextEditorMemento(this.text);
    this.history.push(m);
    this.hooks.onSave?.(m.text, this.history.length);
    return m;
  }

  restore(m: TextEditorMemento): void {
    this.text = m.text;
    this.hooks.onRestore?.(m.text, this.history.length);
  }

  undo(): boolean {
    if (this.history.length === 0) return false;
    const m = this.history.pop()!;
    this.text = m.text;
    this.hooks.onRestore?.(m.text, this.history.length);
    return true;
  }

  type(s: string): void {
    this.text += s;
    this.hooks.onChange?.(this.text);
  }

  backspace(): void {
    this.text = this.text.slice(0, -1);
    this.hooks.onChange?.(this.text);
  }
}
