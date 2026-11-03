import report from "@/content/special-reports/pax-silica.json";
import { resolveSources } from "@/lib/get-special-report";
import s from "./report.module.css";

export const dynamic = "force-static";

export const metadata = {
  title: "Pax Silica: the AI hub, the land, and the summit · OpenPinas",
  description:
    "What's signed, what's promised, who stands where, and how the online version compares with the record on the US-backed Pax Silica hub in Tarlac.",
  openGraph: {
    title: "Pax Silica: the AI hub, the land, and the summit",
    description: "A special report from OpenPinas ahead of the ASEAN Summit in Manila, Nov 16–18.",
    images: ["/special-reports/pax-silica/numbers-ig.png"],
  },
};

const CARD_DIR = "/special-reports/pax-silica";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(iso) {
  const [y, m, d] = iso.split("-");
  const mon = MONTHS[Number(m) - 1];
  return d ? `${mon} ${Number(d)}, ${y}` : `${mon} ${y}`;
}

function toneClass(tone) {
  if (tone === "done") return s.done;
  if (tone === "flag") return s.flag;
  return s.pending;
}

function Sources({ ids, verified }) {
  const list = resolveSources(report, ids);
  if (!list.length) return null;
  return (
    <div className={s.src}>
      {list.map((src, i) => (
        <span key={src.id}>
          {i > 0 ? " · " : ""}
          <a href={src.url} target="_blank" rel="noopener noreferrer">
            {src.outlet}
          </a>
        </span>
      ))}
      {verified === false ? <span className={s.unverified}>unverified</span> : null}
    </div>
  );
}

function ShareLinks({ id }) {
  const files = report.share_cards?.[id];
  if (!files) return null;
  const [ig, tiktok] = files;
  return (
    <div className={s.share}>
      <a href={`${CARD_DIR}/${ig}`} download>
        ⬇ Instagram (1080×1350)
      </a>
      <a href={`${CARD_DIR}/${tiktok}`} download>
        ⬇ TikTok / Reels (1080×1920)
      </a>
    </div>
  );
}

export default function PaxSilicaReport() {
  const sourceIds = Object.keys(report.sources);
  const bar = report.land_bar;
  const barPct = ((bar.part_ha / bar.whole_ha) * 100).toFixed(1);

  return (
    <main className={s.page}>
      {report.status === "draft" ? <div className={s.draft}>{report.status_note}</div> : null}

      <header className={s.hero}>
        <p className={s.kicker}>{report.kicker}</p>
        <h1 className={s.title}>{report.title}</h1>
        <p className={s.dek}>{report.dek}</p>
        <p className={s.stamp}>
          Updated {fmtDate(report.updated)} · {sourceIds.length} sources
        </p>
        <span className={s.countdown}>
          ⏱ {report.countdown.label} · {report.countdown.dates}
        </span>
      </header>

      <nav className={s.jump} aria-label="Report sections">
        {report.sections.map((sec) => (
          <a key={sec.id} href={`#${sec.id}`}>
            {sec.label}
          </a>
        ))}
      </nav>

      <section id="signed" className={s.section}>
        <p className={s.kicker}>01</p>
        <h2 className={s.h2}>Signed vs. planned</h2>
        {report.signed_vs_planned.map((item) => (
          <div key={item.text} className={s.row}>
            <span className={`${s.pill} ${toneClass(item.state)}`}>{item.pill}</span>
            <div>
              {item.text}
              <Sources ids={item.sources} verified={item.verified} />
            </div>
          </div>
        ))}
        <ShareLinks id="signed" />
      </section>

      <section id="numbers" className={s.section}>
        <p className={s.kicker}>02</p>
        <h2 className={s.h2}>{report.numbers_headline}</h2>
        <p className={s.sectionDek}>{report.numbers_dek}</p>
        <div className={s.tableWrap}>
          <table className={s.ledger}>
            <thead>
              <tr>
                <th scope="col">Figure</th>
                <th scope="col">Claim</th>
                <th scope="col">Who says</th>
                <th scope="col">Check</th>
              </tr>
            </thead>
            <tbody>
              {report.numbers.map((n) => (
                <tr key={n.figure}>
                  <td>{n.figure}</td>
                  <td>
                    {n.claim}
                    <Sources ids={n.sources} verified={n.verified} />
                  </td>
                  <td>{n.who}</td>
                  <td>
                    <span className={`${s.pill} ${toneClass(n.tone)}`}>{n.check}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className={s.bar}
          role="img"
          aria-label={`${bar.part_label}: ${bar.part_ha.toLocaleString()} hectares, ${barPct}% of the ${bar.whole_ha.toLocaleString()}-hectare ${bar.whole_label}`}
        >
          <div className={s.barFill} style={{ width: `${barPct}%` }} />
        </div>
        <div className={s.barLabels}>
          <span>
            {bar.part_label}: {bar.part_ha.toLocaleString()} ha ({barPct}%)
          </span>
          <span>
            {bar.whole_label}: {bar.whole_ha.toLocaleString()} ha
          </span>
        </div>
        <ShareLinks id="numbers" />
      </section>

      <section id="sides" className={s.section}>
        <p className={s.kicker}>03</p>
        <h2 className={s.h2}>Every side, in their own words</h2>
        <div className={s.sides}>
          {report.sides.map((side) => (
            <div key={side.side} className={s.card}>
              <span className={s.cardSide}>{side.side}</span>
              <p className={s.cardLine}>{side.line}</p>
              <div className={s.src}>{side.who}</div>
              <Sources ids={side.sources} />
            </div>
          ))}
        </div>
        {report.sides_pending ? <p className={s.note}>{report.sides_pending}</p> : null}
      </section>

      <section id="viral" className={s.section}>
        <p className={s.kicker}>04</p>
        <h2 className={s.h2}>Viral vs. the record</h2>
        {report.viral.map((v) => (
          <div key={v.claim} className={s.viral}>
            <div className={s.viralClaim}>{v.claim}</div>
            <div className={s.viralRecord}>
              <span className={`${s.pill} ${s.pending}`}>{v.label}</span>
              <p>{v.record}</p>
              <Sources ids={v.sources} />
            </div>
          </div>
        ))}
        <ShareLinks id="viral" />
      </section>

      <section id="social" className={s.section}>
        <p className={s.kicker}>05</p>
        <h2 className={s.h2}>Social vs. press</h2>
        <div className={s.placeholder}>{report.pending_sections.social}</div>
        <ul className={s.events}>
          {report.events.map((e) => (
            <li key={e.date + e.text}>
              <time dateTime={e.date}>{fmtDate(e.date)}</time>
              <span>{e.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="map" className={s.section}>
        <p className={s.kicker}>06</p>
        <h2 className={s.h2}>Map</h2>
        <div className={s.placeholder}>{report.pending_sections.map}</div>
      </section>

      <section id="sources" className={s.section}>
        <p className={s.kicker}>Sources</p>
        <h2 className={s.h2}>Every source in this report</h2>
        <ol className={s.sourceList}>
          {resolveSources(report, sourceIds).map((src) => (
            <li key={src.id}>
              <a href={src.url} target="_blank" rel="noopener noreferrer">
                {src.outlet}: {src.title}
              </a>
              <span className={s.sourceType}>{src.type}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
