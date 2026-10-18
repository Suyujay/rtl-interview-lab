import { localize, type Locale } from '@/lib/challenges';

const ports = [
  [
    'wclk / rclk',
    'input',
    '彼此獨立的寫入／讀取 clock。',
    'Independent write/read clocks.',
  ],
  [
    'wrst_n / rrst_n',
    'input',
    '各 domain 的低有效 reset；本題兩側一起 flush。',
    'Local active-low resets; this lab flushes both sides together.',
  ],
  [
    'w_en / wdata',
    'input',
    'wclk 邊緣前有效，且 !full 才接受。',
    'Accepted at wclk only when !full.',
  ],
  [
    'full',
    'output',
    'wclk domain 的註冊旗標；為 1 就拒絕 write。',
    'Registered wclk flag; 1 rejects writes.',
  ],
  [
    'r_en',
    'input',
    'rclk 邊緣前有效，且 !empty 才接受。',
    'Accepted at rclk only when !empty.',
  ],
  [
    'rdata',
    'output',
    '合法 read 後才更新，其他時間保持。',
    'Updates only after an accepted read; otherwise holds.',
  ],
  [
    'empty',
    'output',
    'rclk domain 的註冊旗標；為 1 就拒絕 read。',
    'Registered rclk flag; 1 rejects reads.',
  ],
] as const;

const roleRows = [
  [
    'w_next_bpointer',
    'wire',
    '組合邏輯',
    'Combinational',
    '下一個 binary 值',
    'Next binary value',
  ],
  [
    'w_next_gpointer',
    'wire',
    '組合邏輯',
    'Combinational',
    '下一個 Gray 值',
    'Next Gray value',
  ],
  [
    'w_bpointer / w_gpointer',
    'reg',
    'wclk FF',
    'wclk flops',
    '來源端正式狀態',
    'Registered source state',
  ],
  [
    'rq1_wgray / rq2_wgray',
    'reg',
    'rclk FF1 / FF2',
    'rclk FF1 / FF2',
    '真正的 2FF synchronizer',
    'The actual 2FF synchronizer',
  ],
] as const;

export function AsyncFifoGuide({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  return (
    <section
      className="async-fifo-guide mt-4 min-w-0 border-t border-border pt-4"
      aria-label={zh ? 'Async FIFO 圖解' : 'Async FIFO visual guide'}
    >
      <h2 className="text-base font-semibold">
        {zh
          ? '先分清三種角色：算下一步、記住狀態、跨時脈同步'
          : 'Three roles: calculate next, store state, synchronize'}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {zh
          ? '最容易混淆的地方不是 Gray 公式，而是把 wire、來源端 FF 與目的端 2FF 當成同一件事。先看一條 write pointer 如何走到 read domain。'
          : 'The common mistake is treating a wire, source flops, and destination 2FF as the same object. Trace one write pointer into the read domain first.'}
      </p>

      <div className="mt-3 grid gap-3 xl:grid-cols-2">
        <figure className="min-w-0 rounded-xl border border-border bg-slate-950 p-3 text-slate-100">
          <h3 className="text-sm font-semibold text-cyan-200">
            {zh
              ? '① Next Gray 是 wire，來源 Gray 才是 FF'
              : '1. Next Gray is a wire; source Gray is a flop'}
          </h3>
          <div className="mt-3 overflow-x-auto pb-1">
            <div className="grid min-w-[610px] grid-cols-[210px_1fr_210px] items-center gap-3">
              <div className="rounded-2xl border-2 border-slate-500 bg-slate-900 px-4 py-5 text-center">
                <p className="text-base font-semibold">
                  {zh ? 'Gray 計算邏輯' : 'Gray calculation'}
                </p>
                <p className="mt-1 text-sm text-slate-300">XOR / Shift</p>
              </div>
              <div className="text-center">
                <code className="text-xs font-semibold text-amber-300">
                  wire w_next_gpointer
                </code>
                <div className="mt-2 flex items-center" aria-hidden="true">
                  <span className="h-0.5 flex-1 bg-slate-400" />
                  <span className="-ml-2 text-3xl leading-none text-slate-400">
                    ›
                  </span>
                </div>
              </div>
              <div>
                <div className="rounded-2xl border-2 border-cyan-500 bg-cyan-950/40 px-4 py-5 text-center">
                  <code className="text-base font-semibold">w_gpointer</code>
                  <p className="mt-1 text-sm text-slate-200">D Flip-Flops</p>
                </div>
                <div className="mx-auto h-5 w-0.5 bg-cyan-400" />
                <p className="text-center font-mono text-xs text-cyan-200">
                  wclk
                </p>
              </div>
            </div>
          </div>
          <figcaption className="mt-2 text-xs leading-5 text-slate-300">
            {zh
              ? '組合邏輯算出下一個 Gray；wclk 上升沿才把它存進 w_gpointer。'
              : 'Combinational logic calculates next Gray; rising wclk stores it in w_gpointer.'}
          </figcaption>
        </figure>

        <figure className="min-w-0 rounded-xl border border-border bg-slate-950 p-3 text-slate-100">
          <h3 className="text-sm font-semibold text-purple-200">
            {zh
              ? '② 跨過 domain 後的兩顆 FF 才叫 2FF'
              : '2. The two destination flops form the 2FF synchronizer'}
          </h3>
          <div className="mt-3 overflow-x-auto pb-1">
            <div className="relative grid min-w-[660px] grid-cols-[180px_1fr_180px_1fr_180px] items-center gap-2 rounded-xl border border-slate-700 px-3 pb-4 pt-10">
              <span className="absolute left-3 top-2 text-xs font-semibold text-cyan-200">
                Write Domain
              </span>
              <span className="absolute left-[31%] top-2 border-l border-dashed border-purple-400 pl-3 text-xs font-semibold text-purple-200">
                Read Domain
              </span>
              <div>
                <div className="rounded-xl border-2 border-slate-500 bg-slate-900 p-3 text-center">
                  <code className="text-sm font-semibold">w_gpointer</code>
                  <p className="mt-1 text-xs">Source FF</p>
                </div>
                <p className="mt-2 text-center font-mono text-xs text-cyan-200">
                  wclk
                </p>
              </div>
              <div className="flex items-center" aria-hidden="true">
                <span className="h-0.5 flex-1 bg-slate-400" />
                <span className="-ml-2 text-3xl leading-none text-slate-400">
                  ›
                </span>
              </div>
              <div>
                <div className="rounded-xl border-2 border-purple-400 bg-purple-950/30 p-3 text-center">
                  <code className="text-sm font-semibold">rq1_wgray</code>
                  <p className="mt-1 text-xs">FF1</p>
                </div>
                <p className="mt-2 text-center font-mono text-xs text-purple-200">
                  rclk
                </p>
              </div>
              <div className="flex items-center" aria-hidden="true">
                <span className="h-0.5 flex-1 bg-slate-400" />
                <span className="-ml-2 text-3xl leading-none text-slate-400">
                  ›
                </span>
              </div>
              <div>
                <div className="rounded-xl border-2 border-purple-400 bg-purple-950/30 p-3 text-center">
                  <code className="text-sm font-semibold">rq2_wgray</code>
                  <p className="mt-1 text-xs">FF2</p>
                </div>
                <p className="mt-2 text-center font-mono text-xs text-purple-200">
                  rclk
                </p>
              </div>
            </div>
          </div>
          <figcaption className="mt-2 text-xs leading-5 text-slate-300">
            {zh
              ? 'w_gpointer 屬於 Write Domain；rq1_wgray、rq2_wgray 都由 rclk 取樣，只有後兩顆是同步器。'
              : 'w_gpointer belongs to the write domain. rq1_wgray and rq2_wgray are sampled by rclk; only those two are the synchronizer.'}
          </figcaption>
        </figure>
      </div>

      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 text-xs leading-5 text-muted-foreground">
        {zh
          ? 'ADDR_WIDTH=2 時，每個 pointer 是 3 bits：w_gpointer 是 3 個來源 FF；rq1_wgray＋rq2_wgray 是 6 個同步 FF。Read → Write 方向還有一組對稱的 2FF。'
          : 'With ADDR_WIDTH=2, each pointer is 3 bits: w_gpointer uses three source flops; rq1_wgray plus rq2_wgray use six synchronizer flops. Read-to-write has a mirrored 2FF chain.'}
      </p>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <article className="rounded-xl border border-border bg-background p-3">
          <h3 className="text-sm font-semibold">
            {zh ? '① wire 只負責計算' : '1. The wire only calculates'}
          </h3>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-100">
            <code>{`wire [ADDR_WIDTH:0] w_next_gpointer;
assign w_next_gpointer =
    (w_next_bpointer >> 1) ^ w_next_bpointer;`}</code>
          </pre>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {zh
              ? '沒有 posedge，所以不會因為這個宣告額外產生 FF。'
              : 'There is no posedge, so this declaration does not add flops.'}
          </p>
        </article>
        <article className="rounded-xl border border-border bg-background p-3">
          <h3 className="text-sm font-semibold">
            {zh
              ? '② 來源先註冊，目的端再 2FF'
              : '2. Register at source, then use destination 2FF'}
          </h3>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-100">
            <code>{`// source: wclk
w_gpointer <= w_next_gpointer;

// destination: rclk
rq1_wgray <= w_gpointer;
rq2_wgray <= rq1_wgray;`}</code>
          </pre>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {zh
              ? '跨域的是來源端已註冊的 w_gpointer，不是組合輸出 w_next_gpointer。'
              : 'Cross the registered w_gpointer, never combinational w_next_gpointer.'}
          </p>
        </article>
      </div>

      <details className="mt-3 rounded-xl border border-border p-3">
        <summary className="cursor-pointer text-sm font-semibold">
          {zh
            ? '需要時再看：wire、reg 與硬體角色表'
            : 'Open when needed: wire, reg and hardware roles'}
        </summary>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[620px] text-left text-xs">
            <thead className="bg-muted/60">
              <tr>
                <th className="p-2.5">Signal</th>
                <th className="p-2.5">Verilog</th>
                <th className="p-2.5">{zh ? '硬體' : 'Hardware'}</th>
                <th className="p-2.5">{zh ? '角色' : 'Role'}</th>
              </tr>
            </thead>
            <tbody>
              {roleRows.map(
                ([signal, kind, zhHardware, enHardware, zhRole, enRole]) => (
                  <tr key={signal} className="border-t border-border">
                    <td className="p-2.5">
                      <code>{signal}</code>
                    </td>
                    <td className="p-2.5 font-semibold">{kind}</td>
                    <td className="p-2.5">{zh ? zhHardware : enHardware}</td>
                    <td className="p-2.5 text-muted-foreground">
                      {zh ? zhRole : enRole}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {zh
            ? 'reg 只是 Verilog 的變數型態，不代表一定是 FF；本題這些 reg 在 always @(posedge ...) 中更新，所以才會合成 FF。'
            : 'reg is a Verilog variable type, not an automatic flip-flop. These registers become flops because they are updated inside always @(posedge ...).'}
        </p>
      </details>

      <aside className="mt-3 rounded-xl border border-rose-300/60 bg-rose-500/5 p-3 text-sm leading-6">
        <strong>
          {zh
            ? '為什麼不能直接同步 w_next_gpointer？'
            : 'Why not synchronize w_next_gpointer directly?'}
        </strong>
        <p className="mt-1 text-muted-foreground">
          {zh
            ? '它是組合邏輯輸出，切換期間可能出現 glitch。Gray code 保證相鄰「合法值」只差一個 bit，不保證組合閘的瞬間波形沒有 glitch。先用 wclk 註冊成 w_gpointer，再跨到 rclk。'
            : 'It is a combinational output and may glitch during transitions. Gray code constrains adjacent legal values, not every transient gate waveform. Register w_gpointer on wclk before crossing to rclk.'}
        </p>
      </aside>

      <details className="mt-3 rounded-xl border border-border p-3">
        <summary className="cursor-pointer text-sm font-semibold">
          {zh
            ? '需要時再看：七個外部腳位'
            : 'Open when needed: seven external ports'}
        </summary>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          {ports.map(([name, direction, chinese, english]) => (
            <div key={name} className="rounded-lg bg-muted/30 p-3">
              <dt className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                <code>{name}</code>
                <span className="text-xs font-normal text-muted-foreground">
                  {direction}
                </span>
              </dt>
              <dd className="mt-1 text-xs leading-5 text-muted-foreground">
                {zh ? chinese : english}
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  );
}

export function AsyncFifoReasoning({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const steps = [
    {
      title: {
        zh: '地址為什麼 2 bits，pointer 卻是 3 bits？',
        en: 'Why a 2-bit address but a 3-bit pointer?',
      },
      body: {
        zh: '低 2 bits 選四格 memory；最高 bit 記住是否繞回。地址同樣回到 00 時，wrap bit 可分辨「追上＝空」與「領先一圈＝滿」。',
        en: 'The low two bits select four memory entries. The extra bit records wrap, distinguishing caught-up empty from one-lap-ahead full.',
      },
      visual: '00 → 01 → 10 → 11 → 1|00',
    },
    {
      title: {
        zh: '資料與進度走不同路',
        en: 'Data and progress take different paths',
      },
      body: {
        zh: 'wdata 直接寫進 dual-port memory；跨 clock 的不是 payload，而是已註冊的 Gray pointer。Read side 用同步後進度判斷是否可以讀。',
        en: 'wdata enters dual-port memory. The crossing signal is not payload data but the registered Gray pointer, which lets the read side decide when reading is safe.',
      },
      visual: 'wdata → memory → rdata   |   wgray → FF1 → FF2',
    },
    {
      title: {
        zh: '為什麼可能等三個 rclk？',
        en: 'Why can it take three rclk edges?',
      },
      body: {
        zh: '第 1 拍 FF1 看到新值；第 2 拍 FF2 收到它，但 empty 比較仍讀到 FF2 舊值；第 3 拍 empty 才註冊解除。這是 nonblocking assignment 的舊值語意。',
        en: 'Edge 1 updates FF1. Edge 2 updates FF2 while empty logic still sees old FF2. Edge 3 finally registers empty low because nonblocking logic reads pre-edge values.',
      },
      visual: 'R1: FF1 ✓  →  R2: FF2 ✓  →  R3: empty=0',
    },
  ];
  return (
    <section
      className="logic-brief-card mt-4"
      aria-label={zh ? 'Async FIFO 水晶圖解' : 'Async FIFO reasoning'}
    >
      <h3 className="text-sm font-semibold">
        {zh
          ? 'Timing 水晶：只推演三件最容易錯的事'
          : 'Timing crystal: the three common failure points'}
      </h3>
      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        {steps.map((item) => (
          <article
            key={item.title.en}
            className="rounded-xl border border-border bg-background p-3"
          >
            <h4 className="text-sm font-semibold">
              {localize(item.title, locale)}
            </h4>
            <div className="my-3 overflow-x-auto rounded-lg bg-slate-950 px-3 py-2 text-center font-mono text-xs font-semibold text-cyan-200">
              {item.visual}
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              {localize(item.body, locale)}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-3 grid gap-2 rounded-xl border border-border bg-muted/20 p-3 text-xs sm:grid-cols-2">
        <p>
          <strong>empty_next</strong>
          <br />
          <code>r_next_gpointer == rq2_wgray</code>
        </p>
        <p>
          <strong>full_next · depth 4</strong>
          <br />
          <code>w_next_gpointer == {'{~wq2_rgray[2:1], wq2_rgray[0]}'}</code>
        </p>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        {zh
          ? '先用舊 full／empty 決定本拍能不能操作，再算 next pointer，最後把 next flag 註冊起來。不要先背公式；先確認每個比較值屬於哪個 clock domain。'
          : 'Use the old full/empty flag to accept this operation, compute the next pointer, then register the next flag. Before memorizing equations, identify the clock domain of every compared value.'}
      </p>
    </section>
  );
}
