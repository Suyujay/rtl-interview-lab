import { Fragment } from 'react';
import { localize, type Locale } from '@/lib/challenges';

const ports = [
  [
    'wclk / rclk',
    'input · 1 / 1',
    '寫入／讀取 clock，彼此沒有固定相位關係。',
    'Write/read clocks with no fixed phase relationship.',
  ],
  [
    'wrst_n / rrst_n',
    'input · 1 / 1',
    '各 domain 低有效 reset；本題以共同 flush 初始化，不測單側獨立重啟。',
    'Local active-low resets. This lab uses a coordinated flush, not independent one-sided restart.',
  ],
  [
    'w_en / wdata',
    'input · 1 / DATA_WIDTH',
    '在 wclk 上升沿前穩定；只有 !full 時接受。',
    'Stable before rising wclk; accepted only when !full.',
  ],
  [
    'full',
    'output · 1',
    'wclk domain 註冊；邊緣前為 1 就拒絕本次 write。',
    'Registered in wclk; pre-edge 1 rejects the write.',
  ],
  [
    'r_en',
    'input · 1',
    '在 rclk 上升沿前穩定；只有 !empty 時接受。',
    'Stable before rising rclk; accepted only when !empty.',
  ],
  [
    'rdata',
    'output · DATA_WIDTH',
    '接受 read 的上升沿後更新；否則保持。不是看到 !empty 就自動出資料。',
    'Updates after an accepted read edge; otherwise holds. !empty alone does not expose a new word.',
  ],
  [
    'empty',
    'output · 1',
    'rclk domain 註冊；邊緣前為 1 就拒絕本次 read。',
    'Registered in rclk; pre-edge 1 rejects the read.',
  ],
];

export function AsyncFifoGuide({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  return (
    <section
      className="async-fifo-guide mt-4 min-w-0 border-t border-border pt-4"
      aria-label={
        zh ? 'Async FIFO 架構與介面' : 'Async FIFO architecture and interface'
      }
    >
      <style>{`.async-fifo-guide{container-type:inline-size}.fifo-compact{display:none}@container (max-width:680px){.fifo-wide{display:none}.fifo-compact{display:grid}}`}</style>
      <h2 className="text-base font-semibold">
        {zh
          ? '先看架構：資料走 memory，進度走同步器'
          : 'Architecture: data through memory, progress through synchronizers'}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {zh
          ? '這不是兩個 clock 共用一個 count。每側只改自己的 pointer；同步過來的是對方「已完成多少」的保守進度。基本架構與介面不需要解鎖。'
          : 'There is no shared two-clock count. Each side owns its pointer and sees a delayed view of remote progress. The basic architecture and interface require no unlock.'}
      </p>
      <figure className="mt-3 overflow-x-auto rounded-xl border border-border bg-muted/30 p-3">
        <svg
          viewBox="0 0 880 420"
          className="fifo-wide w-full"
          role="img"
          aria-labelledby="fifo-architecture-title fifo-architecture-desc"
        >
          <title id="fifo-architecture-title">
            {zh
              ? '雙時脈 FIFO：兩個 pointer domain 與共享 memory'
              : 'Dual-clock FIFO: two pointer domains and shared memory'}
          </title>
          <desc id="fifo-architecture-desc">
            {zh
              ? 'wdata 寫入雙埠 memory，rdata 在 read clock 註冊。wgray 經 read clock 的兩級同步器送往 empty 比較器；rgray 經 write clock 的兩級同步器送往 full 比較器。'
              : 'wdata enters dual-port memory; rdata registers on the read clock. wgray crosses two rclk registers to empty logic; rgray crosses two wclk registers to full logic.'}
          </desc>
          <defs>
            <marker
              id="fifo-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10Z" fill="currentColor" />
            </marker>
          </defs>
          <g
            fontFamily="ui-monospace, monospace"
            fontSize="15"
            fill="currentColor"
          >
            <rect
              x="12"
              y="14"
              width="296"
              height="386"
              rx="16"
              fill="#06b6d410"
              stroke="#0891b2"
            />
            <rect
              x="572"
              y="14"
              width="296"
              height="386"
              rx="16"
              fill="#a855f710"
              stroke="#a855f7"
            />
            <text x="32" y="44" fontSize="19" fontWeight="700">
              WRITE · wclk
            </text>
            <text x="592" y="44" fontSize="19" fontWeight="700">
              READ · rclk
            </text>
            <g fill="none" stroke="currentColor" opacity=".65">
              <rect x="34" y="62" width="252" height="66" rx="8" />
              <rect x="594" y="62" width="252" height="66" rx="8" />
              <rect x="34" y="264" width="252" height="64" rx="8" />
              <rect x="594" y="180" width="252" height="64" rx="8" />
              <rect x="34" y="344" width="252" height="38" rx="8" />
              <rect x="594" y="344" width="252" height="38" rx="8" />
              <rect x="336" y="62" width="208" height="66" rx="8" />
            </g>
            <text x="48" y="87">
              w_en &amp;&amp; !full
            </text>
            <text x="48" y="112">
              mem[wbin[1:0]] ← wdata
            </text>
            <text x="608" y="87">
              r_en &amp;&amp; !empty
            </text>
            <text x="608" y="112">
              rdata ← mem[rbin[1:0]]
            </text>
            <text x="360" y="88" fontWeight="700">
              4 × DATA_WIDTH
            </text>
            <text x="358" y="113">
              dual-port memory
            </text>
            <text x="35" y="166">
              wbin[2:0] → wgray[2:0]
            </text>
            <text x="595" y="166">
              rbin[2:0] → rgray[2:0]
            </text>
            <text x="608" y="206">
              [FF1] → [FF2]
            </text>
            <text x="608" y="231">
              rclk → rq2_wgray
            </text>
            <text x="48" y="290">
              [FF1] → [FF2]
            </text>
            <text x="48" y="315">
              wclk → wq2_rgray
            </text>
            <text x="48" y="369">
              wgray_next → full FF
            </text>
            <text x="608" y="369">
              rgray_next → empty FF
            </text>
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              markerEnd="url(#fifo-arrow)"
            >
              <path d="M286 95H336" />
              <path d="M544 95H594" />
              <path d="M270 164H345V205H590" />
              <path d="M600 168H535V286H290" />
              <path d="M160 328V340" />
              <path d="M720 244V340" />
            </g>
            <text x="360" y="194" fontSize="13">
              wgray → rclk 2FF
            </text>
            <text x="356" y="276" fontSize="13">
              rgray → wclk 2FF
            </text>
          </g>
        </svg>
        <div
          className="fifo-compact gap-2 text-sm leading-6"
          role="group"
          aria-label={
            zh
              ? '窄版雙時脈 FIFO 架構圖'
              : 'Compact dual-clock FIFO architecture'
          }
        >
          <div className="rounded-lg border border-cyan-500/50 bg-cyan-500/5 p-3">
            <p className="font-semibold">WRITE · wclk</p>
            <p>
              <code>w_en &amp;&amp; !full</code> →{' '}
              {zh ? '接受寫入' : 'accept write'}
            </p>
            <p>
              <code>wdata → mem[wbin[1:0]]</code>
            </p>
            <p>
              <code>wbin[2:0] → wgray[2:0]</code>
            </p>
          </div>
          <p className="text-center font-semibold" aria-hidden="true">
            ↓
          </p>
          <div className="rounded-lg border border-border bg-background p-3 text-center">
            <p className="font-semibold">4 × DATA_WIDTH · dual-port memory</p>
            <p className="text-muted-foreground">
              {zh
                ? 'wclk 寫入端口 ／ rclk 讀取端口'
                : 'wclk write port / rclk read port'}
            </p>
          </div>
          <p className="text-center font-semibold" aria-hidden="true">
            ↓
          </p>
          <div className="rounded-lg border border-purple-500/50 bg-purple-500/5 p-3">
            <p className="font-semibold">READ · rclk</p>
            <p>
              <code>r_en &amp;&amp; !empty</code> →{' '}
              {zh ? '接受讀取' : 'accept read'}
            </p>
            <p>
              <code>mem[rbin[1:0]] → rdata FF</code>
            </p>
            <p>
              <code>rbin[2:0] → rgray[2:0]</code>
            </p>
          </div>
          <div className="mt-2 rounded-lg border border-border p-3">
            <p className="font-semibold">
              {zh ? '兩條獨立的進度回傳路徑' : 'Two independent progress paths'}
            </p>
            <p className="mt-2">
              <code>wgray → rclk FF1 → FF2</code>
              <br />+ <code>rgray_next → empty FF</code>
            </p>
            <p className="mt-2">
              <code>rgray → wclk FF1 → FF2</code>
              <br />+ <code>wgray_next → full FF</code>
            </p>
          </div>
        </div>
        <figcaption className="mt-2 text-xs leading-5 text-muted-foreground">
          {zh
            ? '圖中 [2:0]／[1:0] 對應預設深度 4。資料不逐 bit 經 2FF；資料保存在 memory，Gray pointer 控制何時能安全讀寫。兩個比較器都只能使用本地暫存器與同步器第二級。'
            : 'The [2:0]/[1:0] widths are for depth 4. Data bits do not pass through 2FF chains: memory holds data while Gray pointers govern safe access. Comparators use only local state and the second synchronizer stage.'}
        </figcaption>
      </figure>
      <details className="mt-3 rounded-xl border border-border p-3" open>
        <summary className="cursor-pointer text-sm font-semibold">
          {zh ? '介面逐項說明' : 'Port-by-port contract'}
        </summary>
        <dl className="mt-3 space-y-3">
          {ports.map(([name, width, chinese, english]) => (
            <div
              key={name}
              className="border-t border-border pt-3 first:border-0 first:pt-0"
            >
              <dt className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                <code>{name}</code>
                <span className="text-xs font-normal text-muted-foreground">
                  {width}
                </span>
              </dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground">
                {zh ? chinese : english}
              </dd>
            </div>
          ))}
        </dl>
      </details>
      <div className="mt-3 rounded-xl border border-border p-3 text-sm leading-6">
        <h3 className="font-semibold">
          {zh
            ? '從這三件事開始，不用先背 full 公式'
            : 'Start here before memorizing the full equation'}
        </h3>
        <ol className="mt-2 list-decimal space-y-2 pl-5">
          <li>
            {zh
              ? '先畫四格 memory，列出 wbin／wgray、rbin／rgray 及兩側各兩級同步器。每個 reg 標記由哪個 clock 更新。'
              : 'Draw four memory slots. List wbin/wgray, rbin/rgray and two remote-pointer stages per side. Label the clock that owns each register.'}
          </li>
          <li>
            {zh
              ? '先做接受條件與 memory 存取：寫滿不能寫、讀空不能讀；接受後才推進 pointer，rdata 只有合法 read 才更新。'
              : 'Define acceptance and memory access first. Reject writes while full and reads while empty. Advance pointers only after acceptance; update rdata only on accepted reads.'}
          </li>
          <li>
            {zh
              ? '再做 Gray、2FF 與本地旗標。先手推寫一筆、等 empty 解除、讀一筆，再測四筆滿載與繞回。進階公式與逐拍推演可在水晶／Golden 中查看。'
              : 'Then add Gray conversion, 2FF chains and local flags. Trace one write, wait for empty to release, then read once. Next test all four entries and wrap. The reasoning card and Golden trace provide the detailed derivation.'}
          </li>
        </ol>
      </div>
    </section>
  );
}

export function AsyncFifoReasoning({ locale }: { locale: Locale }) {
  const items = [
    {
      title: { zh: '為什麼是 3-bit pointer？', en: 'Why a 3-bit pointer?' },
      body: {
        zh: '四格 memory 只需地址 00、01、10、11，但寫四筆後地址回到 00，不能誤認為空。wbin 從 000 到 100，最高 bit 記錄繞回；binary 只有低兩個 bits 用來定址。',
        en: 'Four slots need addresses 00, 01, 10, 11. After four writes the address returns to 00, but the FIFO is full, not empty. wbin goes from 000 to 100; the extra bit records wrap.',
      },
    },
    {
      title: { zh: 'binary 與 Gray 各做什麼？', en: 'Binary versus Gray' },
      body: {
        zh: '3-bit binary 000→001→010→011→100；對應 Gray 000→001→011→010→110。Gray=(binary>>1)^binary。來源註冊值每次合法前進只改一個 bit；目的端較慢時可以跳過中間值，不能要求同步後每拍只改一 bit。',
        en: 'Binary 000→001→010→011→100 maps to Gray 000→001→011→010→110 using Gray=(binary>>1)^binary. Each source increment changes one bit; a slower destination may skip values, so synchronized samples can differ in multiple bits.',
      },
    },
    {
      title: {
        zh: 'full 為何反相最高兩個 bits？',
        en: 'Why invert the top two Gray bits for full?',
      },
      body: {
        zh: '深度 4 時，滿載的 binary pointer 相差 4：rbin=000、wbin=100；轉 Gray 是 000 與 110。一般地，binary 最高 bit 翻轉會讓 Gray 最高兩個 bits 翻轉，其餘相同。所以 full_next 比較 wgray_next 與 {~wq2_rgray[2:1],wq2_rgray[0]}；不是只反相 Gray 最高 bit。',
        en: 'At depth 4, full binary pointers differ by 4: rbin=000 and wbin=100 map to Gray 000 and 110. Flipping the binary wrap bit flips the top two Gray bits. Thus compare wgray_next with {~wq2_rgray[2:1],wq2_rgray[0]}, not just the top Gray bit.',
      },
    },
    {
      title: { zh: '為什麼比較 next？', en: 'Why compare the next pointer?' },
      body: {
        zh: '從空 FIFO 連寫四筆、期間沒有 read：第 4 筆 write 在邊緣前仍合法，邊緣後才滿。先用舊 full 決定 fire，再算 binary_next／gray_next，最後註冊 full_next。empty 同理：讀最後一筆後 empty 變 1，但該筆 rdata 仍有效。flag 每個本地邊緣都要重新評估，不能只在 enable=1 時更新。',
        en: 'Starting empty with no reads, the fourth write is legal before its edge and makes the FIFO full afterward. Use the old flag for fire, compute next pointers, then register the next flag. Likewise the last read sets empty but returns valid rdata. Reevaluate flags on every local edge, even when enable=0.',
      },
    },
    {
      title: {
        zh: '2FF 為什麼不是剛好兩拍旗標就變？',
        en: 'Why can flag release take three edges?',
      },
      body: {
        zh: '若 wgray 已穩定為 001：rclk 第 1 拍 FF1=001／FF2=000；第 2 拍 FF2=001，但 empty 比較仍看到舊 FF2=000；第 3 拍才註冊 empty=0。這是 nonblocking assignment 的舊值語意。實體 metastability 可能增加延遲，RTL 不模擬其機率。',
        en: 'For stable wgray=001: rclk edge 1 updates FF1; edge 2 updates FF2, while the flag logic still sees the old FF2; edge 3 registers empty=0. This follows nonblocking old-value semantics. Hardware metastability may add delay; RTL does not model its probability.',
      },
    },
    {
      title: {
        zh: 'reset 與真正 CDC 的界線',
        en: 'Reset and hardware CDC boundary',
      },
      body: {
        zh: '本題使用共同 flush，兩側 pointer 與同步器一起歸零，memory 不必清除。執行中只 reset 一側可能破壞資料關係，不能假設安全。硬體還需來源 Gray 註冊、目的端同步器辨識、bus skew／delay 約束及 reset release 檢查；跑過 simulation 不等於 CDC sign-off。',
        en: 'This lab coordinates both resets for a flush; clear pointers and synchronizers, not memory. Resetting only one side can destroy data ownership. Hardware also needs registered source Gray, recognized synchronizers, bus skew/delay constraints and reset-release checks. Simulation is not CDC sign-off.',
      },
    },
  ];
  return (
    <section
      className="logic-brief-card mt-4"
      aria-label="Async FIFO reasoning"
    >
      <h3 className="text-sm font-semibold">
        {locale === 'zh'
          ? 'Async FIFO 水晶推演：從地址到旗標'
          : 'Async FIFO reasoning: from addresses to flags'}
      </h3>
      <dl className="cpu-concept-guide">
        {items.map((item) => (
          <Fragment key={item.title.en}>
            <dt>{localize(item.title, locale)}</dt>
            <dd>{localize(item.body, locale)}</dd>
          </Fragment>
        ))}
      </dl>
    </section>
  );
}
