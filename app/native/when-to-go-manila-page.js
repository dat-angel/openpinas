"use client";

import { useEffect, useMemo } from "react";
import fxData from "../../data/php-usd-weekly-2025.json";
import paxData from "../../data/airport-passenger-summary.json";
import styles from "./when-to-go-manila.module.css";

const width = 1000;
const height = 420;
const margin = { top: 24, right: 70, bottom: 48, left: 70 };
const plotWidth = width - margin.left - margin.right;
const plotHeight = height - margin.top - margin.bottom;

const parseDate = (str) => new Date(`${str}T00:00:00`);
const formatMonth = (date) => date.toLocaleString("en-US", { month: "short" });

function buildChartModel(fx, pax) {
  const weeks = fx.weeks.map((d) => ({
    ...d,
    date: parseDate(d.week_start),
    mid: (d.low + d.high) / 2,
  }));

  const ceb = pax.ceb.map((d) => ({
    ...d,
    date: parseDate(`${d.month}-15`),
    label: d.month,
  }));

  const cebCargo = (pax.ceb_cargo_kg || []).map((d) => ({
    ...d,
    date: parseDate(`${d.month}-15`),
  }));

  const cebMovements = (pax.ceb_aircraft_movements || []).map((d) => ({
    ...d,
    date: parseDate(`${d.month}-15`),
  }));

  const dvo = pax.dvo_2024.map((d) => ({
    ...d,
    date: parseDate(`2025-${d.month.slice(5)}-15`),
    label: d.month,
  }));

  const xMin = weeks[0].date;
  const xMax = weeks[weeks.length - 1].date;
  const fxMin = Math.min(...weeks.map((d) => d.low));
  const fxMax = Math.max(...weeks.map((d) => d.high));
  const paxMax = Math.max(...ceb.map((d) => d.passengers), ...dvo.map((d) => d.passengers));

  const xScale = (date) => margin.left + ((date - xMin) / (xMax - xMin)) * plotWidth;
  const fxScale = (val) => margin.top + plotHeight - ((val - fxMin) / (fxMax - fxMin)) * plotHeight;
  const paxScale = (val) => margin.top + plotHeight - (val / paxMax) * plotHeight;

  const months = [];
  const cursor = new Date(xMin);
  cursor.setDate(1);
  while (cursor <= xMax) {
    months.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const topMonths = [...ceb].sort((a, b) => b.passengers - a.passengers).slice(0, 3);
  const peakChips = topMonths.map((item) => {
    const date = parseDate(`${item.month}-01`);
    const label = `${formatMonth(date)} ${date.getFullYear()} — ${item.passengers.toLocaleString()} passengers (CEB)`;
    return label;
  });

  const topCargo = [...cebCargo].sort((a, b) => b.cargo_kg - a.cargo_kg).slice(0, 3);
  const cargoChips = topCargo.map((item) => {
    const date = parseDate(`${item.month}-01`);
    const label = `${formatMonth(date)} ${date.getFullYear()} — ${item.cargo_kg.toLocaleString()} kg (CEB)`;
    return label;
  });

  const topMovements = [...cebMovements].sort((a, b) => b.movements - a.movements).slice(0, 3);
  const movementChips = topMovements.map((item) => {
    const date = parseDate(`${item.month}-01`);
    const label = `${formatMonth(date)} ${date.getFullYear()} — ${item.movements.toLocaleString()} movements (CEB)`;
    return label;
  });

  const topWeeks = [...weeks].sort((a, b) => b.high - a.high).slice(0, 6);
  const priceChips = topWeeks.map((item) => {
    const start = parseDate(item.week_start);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const label = `${start.toISOString().slice(0, 10)} to ${end.toISOString().slice(0, 10)} — high ${item.high.toFixed(3)} PHP/USD`;
    return label;
  });

  const areaPath =
    weeks.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.date)} ${fxScale(d.high)}`).join(" ") +
    " " +
    weeks
      .slice()
      .reverse()
      .map((d) => `L ${xScale(d.date)} ${fxScale(d.low)}`)
      .join(" ") +
    " Z";

  const midPath = weeks.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.date)} ${fxScale(d.mid)}`).join(" ");

  const cebPath = ceb.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.date)} ${paxScale(d.passengers)}`).join(" ");

  const dvoPath = dvo.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.date)} ${paxScale(d.passengers)}`).join(" ");

  const cebCircles = ceb.map((d) => ({
    cx: xScale(d.date),
    cy: paxScale(d.passengers),
  }));

  const monthLines = months.map((date) => ({
    x1: xScale(date),
    y1: margin.top,
    x2: xScale(date),
    y2: margin.top + plotHeight,
  }));

  const monthTexts = months.map((date) => ({
    x: xScale(date),
    y: margin.top + plotHeight + 26,
    text: formatMonth(date),
  }));

  const peakRects = topMonths.map((item) => {
    const monthDate = parseDate(`${item.month}-01`);
    const nextMonth = new Date(monthDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return {
      x: xScale(monthDate),
      y: margin.top,
      width: xScale(nextMonth) - xScale(monthDate),
      height: plotHeight,
    };
  });

  return {
    peakChips,
    cargoChips,
    movementChips,
    priceChips,
    svg: {
      areaPath,
      midPath,
      cebPath,
      dvoPath,
      cebCircles,
      monthLines,
      monthTexts,
      peakRects,
    },
  };
}

export default function WhenToGoManilaPage() {
  useEffect(() => {
    const id = "whentogo-fonts";
    if (document.getElementById(id)) return;
    const pre1 = document.createElement("link");
    pre1.rel = "preconnect";
    pre1.href = "https://fonts.googleapis.com";
    const pre2 = document.createElement("link");
    pre2.rel = "preconnect";
    pre2.href = "https://fonts.gstatic.com";
    pre2.crossOrigin = "anonymous";
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;500;600;700&family=Source+Serif+Pro:wght@400;600;700&display=swap";
    document.head.append(pre1, pre2, link);
  }, []);

  const model = useMemo(() => {
    try {
      return buildChartModel(fxData, paxData);
    } catch {
      return null;
    }
  }, []);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>When to Go to the Philippines?</h1>
        <p className={styles.lede}>
          A simple read on timing: weekly PHP:USD ranges for 2025 plus airport traffic signals. Use it to spot busy
          months and weeks when your dollars stretch further.
        </p>
      </header>

      <main className={styles.main}>
        {!model ? (
          <div className={styles.card}>
            <p className={styles.lede}>Data failed to load.</p>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              <div className={styles.card}>
                <div className={styles.chartWrap}>
                  <svg className={styles.chartSvg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                    <path d={model.svg.areaPath} fill="rgba(18, 69, 89, 0.18)" stroke="none" />
                    <path d={model.svg.midPath} fill="none" stroke="#124559" strokeWidth={2} />
                    {model.svg.peakRects.map((r, i) => (
                      <rect
                        key={i}
                        x={r.x}
                        y={r.y}
                        width={r.width}
                        height={r.height}
                        fill="rgba(196, 73, 0, 0.08)"
                      />
                    ))}
                    <path d={model.svg.cebPath} fill="none" stroke="#c44900" strokeWidth={2} />
                    {model.svg.cebCircles.map((c, i) => (
                      <circle key={i} cx={c.cx} cy={c.cy} r={3} fill="#c44900" />
                    ))}
                    <path d={model.svg.dvoPath} fill="none" stroke="#7f8c8d" strokeWidth={1.6} strokeDasharray="4 4" />
                    {model.svg.monthLines.map((ln, i) => (
                      <line
                        key={i}
                        x1={ln.x1}
                        y1={ln.y1}
                        x2={ln.x2}
                        y2={ln.y2}
                        stroke="rgba(0,0,0,0.05)"
                      />
                    ))}
                    {model.svg.monthTexts.map((t, i) => (
                      <text key={i} x={t.x} y={t.y} textAnchor="middle" fontSize={11} fill="#5e5e5e">
                        {t.text}
                      </text>
                    ))}
                    <text x={margin.left - 12} y={margin.top - 6} textAnchor="start" fontSize={12} fill="#124559">
                      PHP per USD
                    </text>
                    <text x={width - margin.right + 8} y={margin.top - 6} textAnchor="start" fontSize={12} fill="#c44900">
                      Passengers
                    </text>
                  </svg>
                </div>
                <div className={styles.legend}>
                  <span>
                    <i style={{ background: "#124559" }} />
                    PHP:USD weekly range (2025)
                  </span>
                  <span>
                    <i style={{ background: "#c44900" }} />
                    CEB passengers (2025 YTD)
                  </span>
                  <span>
                    <i style={{ background: "#7f8c8d" }} />
                    DVO passengers (2024, seasonality only)
                  </span>
                </div>
              </div>

              <div className={`${styles.card} ${styles.summary}`}>
                <h2>High travel season (signal)</h2>
                <p>
                  Cebu (CEB) peaks are a proxy for travel pressure. If Cebu is crowded, Manila usually feels it too.
                  This is seasonality, not a Manila headcount.
                </p>
                <div className={styles.chipList}>
                  {model.peakChips.map((t) => (
                    <span key={t} className={styles.chip}>
                      {t}
                    </span>
                  ))}
                </div>

                <h2 style={{ marginTop: 18 }}>Cebu cargo peaks (signal)</h2>
                <p>Cargo tonnage is another congestion signal. Higher cargo months often mean fuller schedules.</p>
                <div className={styles.chipList}>
                  {model.cargoChips.map((t) => (
                    <span key={t} className={styles.chip}>
                      {t}
                    </span>
                  ))}
                </div>

                <h2 style={{ marginTop: 18 }}>Cebu aircraft movements (signal)</h2>
                <p>Aircraft movements show runway activity. Use this to sanity‑check peak months.</p>
                <div className={styles.chipList}>
                  {model.movementChips.map((t) => (
                    <span key={t} className={styles.chip}>
                      {t}
                    </span>
                  ))}
                </div>

                <h2 style={{ marginTop: 18 }}>Price windows (USD advantage)</h2>
                <p>
                  These are the weeks when USD buys the most PHP in 2025. If you are spending in pesos, these windows can
                  lower trip costs.
                </p>
                <div className={styles.chipList}>
                  {model.priceChips.map((t) => (
                    <span key={t} className={styles.chip}>
                      {t}
                    </span>
                  ))}
                </div>

                <p className={styles.note} style={{ marginTop: 16 }}>
                  If you spend in PHP, a lower PHP per USD rate is better for you.
                </p>
              </div>
            </div>

            <div className={`${styles.card} ${styles.methodology}`}>
              <h3>Methodology Notes</h3>
              <p>
                FX data is BSP daily reference rates aggregated to weekly highs and lows for 2025. Passenger data uses
                MCIAA 2025 YTD passenger, cargo, and aircraft movement charts for CEB and CAAP 2024 Airpasscar totals
                for DVO. NAIA/MNL monthly series are not publicly available.
              </p>
              <ul>
                <li>
                  <a href="https://www.bsp.gov.ph/statistics/external/pesodollar.xlsx" target="_blank" rel="noopener noreferrer">
                    BSP Peso-Dollar Reference Rate (daily)
                  </a>
                </li>
                <li>
                  <a href="https://mciaa.gov.ph/statistics/" target="_blank" rel="noopener noreferrer">
                    MCIAA Statistics (passenger charts)
                  </a>
                </li>
                <li>
                  <a
                    href="https://caap.gov.ph/wp-content/uploads/2025/01/AirpasscarANNUAL-2024.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CAAP Airpasscar Annual 2024 (PDF)
                  </a>
                </li>
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
