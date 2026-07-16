// =============================================================================
// VirtualList —— 虚拟滚动
// 3000 张卡片只渲染可视窗口。支持响应式列数（由 CSS grid auto-fill 决定）。
//
// 实现策略：
//   - 外层 .vlist 是滚动容器，内部 .vlist__ph 是总高度占位（撑出滚动条）。
//   - .vlist__win 绝对定位、translateY 偏移到当前行，承载可见行（CSS grid）。
//   - 列数从 .vlist__win 的 grid-template-columns 的 auto-fill 实际列数推导。
// =============================================================================

export interface VirtualListOptions<T> {
  items: readonly T[];
  renderItem: (item: T, index: number) => HTMLElement;
  /** 预估行高（px）。 */
  itemHeight: number;
  /** 显式列数；<=0 表示响应式（由 CSS auto-fill 决定）。 */
  columns?: number;
  maxHeight?: number;
}

export class VirtualList<T> {
  private host: HTMLElement;
  private opts: VirtualListOptions<T>;
  private ph!: HTMLElement;
  private win!: HTMLElement;
  private ro: ResizeObserver | null = null;
  private lastKey = '';
  private cols = 1;

  constructor(host: HTMLElement, opts: VirtualListOptions<T>) {
    this.host = host;
    this.opts = opts;
    this.build();
    this.observe();
    this.render();
  }

  setItems(items: readonly T[]): void {
    this.opts.items = items;
    this.lastKey = '';
    this.render();
  }

  dispose(): void {
    this.ro?.disconnect();
    this.host.removeEventListener('scroll', this.onScroll);
  }

  private build(): void {
    this.host.classList.add('vlist');
    if (this.opts.maxHeight) this.host.style.maxHeight = `${this.opts.maxHeight}px`;
    this.ph = document.createElement('div');
    this.ph.className = 'vlist__ph';
    this.win = document.createElement('div');
    this.win.className = 'vlist__win';
    this.host.replaceChildren(this.ph, this.win);
    this.host.addEventListener('scroll', this.onScroll, { passive: true });
  }

  private observe(): void {
    if (typeof ResizeObserver === 'undefined') return;
    this.ro = new ResizeObserver(() => {
      this.detectColumns();
      this.render();
    });
    this.ro.observe(this.host);
  }

  private onScroll = (): void => {
    this.render();
  };

  /** 从 CSS grid auto-fill 推断实际列数。 */
  private detectColumns(): void {
    if ((this.opts.columns ?? 0) > 0) {
      this.cols = this.opts.columns!;
      return;
    }
    // 用 win 的 computed grid-template-columns 列数
    const raw = getComputedStyle(this.win).gridTemplateColumns;
    const parts = raw.split(' ').filter(Boolean);
    if (parts.length > 0) this.cols = parts.length;
  }

  private render(): void {
    if (this.win.children.length === 0) {
      // 首次：先放一个占位卡片让 grid 能测出列宽
      const probe = document.createElement('div');
      probe.style.visibility = 'hidden';
      this.win.append(probe);
      this.detectColumns();
      probe.remove();
    }

    const { items, itemHeight, renderItem } = this.opts;
    const cols = this.cols;
    const rowH = itemHeight;
    const totalRows = Math.ceil(items.length / cols);
    const totalH = totalRows * rowH;
    this.ph.style.height = `${totalH}px`;

    const hostH = this.host.clientHeight;
    const scrollTop = this.host.scrollTop;
    const visibleRows = Math.ceil(hostH / rowH) + 2;
    const startRow = Math.max(0, Math.floor(scrollTop / rowH) - 1);
    const endRow = Math.min(totalRows, startRow + visibleRows);

    const start = startRow * cols;
    const end = Math.min(items.length, endRow * cols);

    const key = `${start}-${end}-${cols}-${items.length}`;
    if (key === this.lastKey) return;
    this.lastKey = key;

    this.win.style.transform = `translateY(${startRow * rowH}px)`;
    this.win.replaceChildren();
    for (let i = start; i < end; i++) {
      this.win.append(renderItem(items[i]!, i));
    }
  }
}
