const T = {
  ink: "#0d0d0d",
  muted: "#6b7280",
  subtle: "#e5e5e3",
  surface: "#f7f7f5",
  accent: "#2d2de8",
  new: "#0b6e4f",
};

function Badge() {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#fff",
        background: T.new,
        padding: "2px 7px",
        borderRadius: 4,
        marginRight: 8,
        flexShrink: 0,
      }}
    >
      New
    </span>
  );
}

function CategoryPill({ label, color }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: color ?? T.accent,
        border: `1px solid ${color ?? T.accent}`,
        padding: "2px 8px",
        borderRadius: 999,
      }}
    >
      {label}
    </span>
  );
}

function CountTile({ value, label }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${T.subtle}`,
        padding: "14px 12px",
        textAlign: "center",
      }}
    >
      <p style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", color: T.ink }}>+{value}</p>
      <p style={{ margin: "4px 0 0", fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
    </div>
  );
}

function WeekStrip({ events }) {
  const dates = [...new Set(events.map((e) => e.date).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)))].sort();
  if (!dates.length) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: `1px solid ${T.subtle}`,
        overflowX: "auto",
      }}
      aria-hidden
    >
      {dates.map((d) => (
        <div key={d} style={{ textAlign: "center", minWidth: 48, flexShrink: 0 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: T.accent,
              margin: "0 auto 6px",
            }}
          />
          <span style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>{d.slice(5).replace("-", "/")}</span>
        </div>
      ))}
    </div>
  );
}

function ChangeRow({ date, dateTime, title, href, category, color, meta }) {
  const iso = dateTime ?? (/^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined);
  return (
    <li
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        padding: "12px 0",
        borderBottom: `1px solid ${T.subtle}`,
        listStyle: "none",
      }}
    >
      <Badge />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 4 }}>
          {iso ? (
            <time style={{ fontSize: 12, color: T.muted }} dateTime={iso}>
              {date}
            </time>
          ) : (
            <span style={{ fontSize: 12, color: T.muted }}>{date}</span>
          )}
          {category ? <CategoryPill label={category} color={color} /> : null}
          {meta ? <span style={{ fontSize: 12, color: T.muted }}>{meta}</span> : null}
        </div>
        <a href={href} style={{ fontSize: 15, fontWeight: 600, color: T.ink, textDecoration: "none", lineHeight: 1.35 }}>
          {title}
        </a>
      </div>
    </li>
  );
}

/**
 * @param {{ changes: import("@/app/lib/week-changes").getWeekChanges extends (...args: any) => infer R ? R : never, compact?: boolean }} props
 */
export default function WhatsNewPanel({ changes, compact = false }) {
  if (!changes) return null;

  const { counts, timelineNew, dynastyUpdates, storiesNew, weekLabel, prevWeekLabel, weeklyReviewHref, categoryCounts } =
    changes;
  const since = prevWeekLabel ? `since ${prevWeekLabel}` : "this week";
  const hasAnything =
    counts.timelineNew > 0 || counts.dynastyUpdates > 0 || counts.storiesNew > 0;

  if (!hasAnything) return null;

  const displayTimeline = compact ? timelineNew.slice(0, 3) : timelineNew;
  const displayDynasty = compact ? dynastyUpdates.slice(0, 2) : dynastyUpdates;
  const displayStories = compact ? storiesNew.slice(0, 3) : storiesNew;
  const hiddenCount =
    (compact ? timelineNew.length - displayTimeline.length : 0) +
    (compact ? dynastyUpdates.length - displayDynasty.length : 0) +
    (compact ? storiesNew.length - displayStories.length : 0);

  return (
    <section
      aria-label="What's new this week"
      style={{
        background: T.surface,
        border: `1px solid ${T.subtle}`,
        marginBottom: compact ? 0 : 28,
        padding: compact ? "20px 0" : 24,
      }}
    >
      <div style={{ padding: compact ? `0 clamp(20px, 5vw, 64px)` : 0 }}>
        <div style={{ marginBottom: 16 }}>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: T.accent,
            }}
          >
            What&apos;s new
          </p>
          <h2 style={{ margin: 0, fontSize: compact ? 18 : 22, fontWeight: 800, letterSpacing: "-0.02em" }}>
            {weekLabel}
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: T.muted }}>
            Added to OpenPinas {since}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: 1,
            background: T.subtle,
            marginBottom: 20,
          }}
        >
          {counts.timelineNew > 0 ? <CountTile value={counts.timelineNew} label="Timeline events" /> : null}
          {counts.storiesNew > 0 ? <CountTile value={counts.storiesNew} label="Review stories" /> : null}
          {counts.dynastyUpdates > 0 ? <CountTile value={counts.dynastyUpdates} label="Dynasty updates" /> : null}
        </div>

        <WeekStrip events={timelineNew} />

        {Object.keys(categoryCounts ?? {}).length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {Object.entries(categoryCounts).map(([cat, n]) => (
              <span
                key={cat}
                style={{
                  fontSize: 12,
                  color: T.muted,
                  background: "#fff",
                  border: `1px solid ${T.subtle}`,
                  padding: "4px 10px",
                  borderRadius: 6,
                }}
              >
                <strong style={{ color: T.ink }}>{n}</strong> {cat}
              </span>
            ))}
          </div>
        ) : null}

        {displayTimeline.length > 0 ? (
          <div style={{ marginBottom: compact ? 12 : 20 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.muted }}>
              Timeline
            </h3>
            <ul style={{ margin: 0, padding: 0 }}>
              {displayTimeline.map((e) => (
                <ChangeRow
                  key={`${e.date}-${e.title}`}
                  date={e.date}
                  title={e.title}
                  href={e.href}
                  category={e.category}
                  color={e.color}
                />
              ))}
            </ul>
          </div>
        ) : null}

        {displayDynasty.length > 0 ? (
          <div style={{ marginBottom: compact ? 12 : 20 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.muted }}>
              Dynasty data
            </h3>
            <ul style={{ margin: 0, padding: 0 }}>
              {displayDynasty.map((d) => (
                <ChangeRow
                  key={`${d.dynastyId}-${d.date}-${d.headline}`}
                  date={d.date}
                  title={d.headline}
                  href={d.href}
                  category={d.category}
                  meta={d.dynastyName}
                />
              ))}
            </ul>
          </div>
        ) : null}

        {!compact && displayStories.length > 0 && counts.storiesNew !== counts.timelineNew ? (
          <div style={{ marginBottom: 0 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.muted }}>
              Weekly review
            </h3>
            <ul style={{ margin: 0, padding: 0 }}>
              {displayStories.map((s) => (
                <ChangeRow
                  key={s.title}
                  date={s.displayDate ?? s.date}
                  title={s.title}
                  href={s.href}
                  category={s.category}
                  color={s.borderColor}
                />
              ))}
            </ul>
          </div>
        ) : null}

        {hiddenCount > 0 ? (
          <p style={{ margin: "12px 0 0", fontSize: 13, color: T.muted }}>
            +{hiddenCount} more in the{" "}
            <a href={weeklyReviewHref} style={{ color: T.ink, fontWeight: 600 }}>
              full weekly review
            </a>
          </p>
        ) : null}

        {compact ? (
          <a
            href={weeklyReviewHref}
            style={{ display: "inline-block", marginTop: 12, fontSize: 13, fontWeight: 600, color: T.ink }}
          >
            See all changes →
          </a>
        ) : null}
      </div>
    </section>
  );
}
