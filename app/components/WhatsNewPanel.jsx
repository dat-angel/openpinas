"use client";
import { useState } from "react";

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


function CountTile({ value, label, active, onClick }) {
  return <button type="button" className="new-control" aria-pressed={active} onClick={onClick}
    style={{background:active?"#efefff":"#fff", border:`2px solid ${active?T.accent:T.subtle}`, cursor:"pointer",
      minHeight:94, padding:"14px 12px", textAlign:"center", fontFamily:"inherit", width:"100%"}}>
    <span style={{display:"block",fontSize:28,fontWeight:800,color:T.ink}}>+{value}</span>
    <span style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:active?T.accent:T.muted}}>{label}</span>
  </button>;
}
function WeekStrip({events, selected, onSelect}) {
  const dates=[...new Set(events.map(e=>e.date).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)))].sort();
  if (!dates.length) return null;
  return <div role="group" aria-label="Filter by date" style={{display:"flex",gap:8,overflowX:"auto",
    borderBottom:`1px solid ${T.subtle}`,paddingBottom:12,marginBottom:16}}>
    {dates.map(d=><button type="button" className="new-control" key={d} aria-pressed={selected===d}
      aria-label={`Filter to ${d}`} onClick={()=>onSelect(selected===d?null:d)}
      style={{cursor:"pointer",fontFamily:"inherit",border:`1px solid ${selected===d?T.accent:"transparent"}`,
      borderRadius:8,background:selected===d?"#efefff":"transparent",minWidth:58,minHeight:52,padding:"7px 8px",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
      <span aria-hidden="true" style={{height:11,width:11,borderRadius:"50%",background:T.accent,
        outline:selected===d?`2px solid ${T.accent}`:"none",outlineOffset:3}}/>
      <span aria-hidden="true" style={{fontSize:11,fontWeight:selected===d?800:600,color:selected===d?T.accent:T.muted}}>
        {d.slice(5).replace("-","/")}</span>
    </button>)}
  </div>;
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


export default function WhatsNewPanel({changes,compact=false}) {
  const [view,setView]=useState("timeline");
  const [date,setDate]=useState(null);
  const [category,setCategory]=useState(null);
  if (!changes) return null;
  const {counts,timelineNew=[],storiesNew=[],dynastyUpdates=[],weekLabel,prevWeekLabel,
    weeklyReviewHref,categoryCounts={}}=changes;
  if (!counts.timelineNew&&!counts.storiesNew&&!counts.dynastyUpdates) return null;
  const filtered=(view==="timeline"?timelineNew:view==="stories"?storiesNew:dynastyUpdates)
    .filter(e=>(!date||e.date===date)&&(!category||e.category===category));
  const defaultTeaser=compact&&view==="timeline"&&!date&&!category;
  const display=defaultTeaser?filtered.slice(0,3):filtered;
  const hiddenCount=filtered.length-display.length;
  const reset=()=>{setView("timeline");setDate(null);setCategory(null)};
  const chooseCategory=cat=>{setView("timeline");setCategory(category===cat?null:cat)};
  const chooseView=next=>{setView(next);if(next==="dynasty")setCategory(null)};
  const kind=view==="timeline"?"Timeline events":view==="stories"?"Weekly review stories":"Dynasty updates";
  return <section aria-label="What's new this week" style={{background:T.surface,
      border:`1px solid ${T.subtle}`,padding:compact?"20px 0":24,marginBottom:compact?0:28}}>
    <style>{`.new-control:hover{background:#efefff!important}
      .new-control:focus-visible{outline:3px solid #2d2de8;outline-offset:3px}`}</style>
    <div style={{padding:compact?"0 clamp(20px, 5vw, 64px)":0}}>
      <p style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",
        color:T.accent,margin:"0 0 4px"}}>What's new</p>
      <h2 style={{fontSize:compact?18:22,margin:0,fontWeight:800,letterSpacing:"-.02em"}}>{weekLabel}</h2>
      <p style={{fontSize:13,color:T.muted,margin:"6px 0 16px"}}>
        Added to OpenPinas {prevWeekLabel?`since ${prevWeekLabel}`:"this week"}</p>
      <div role="group" aria-label="Choose content" style={{display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,120px),1fr))",gap:2,marginBottom:20}}>
        {counts.timelineNew>0&&<CountTile value={counts.timelineNew} label="Timeline events"
          active={view==="timeline"} onClick={()=>chooseView("timeline")}/>}
        {counts.storiesNew>0&&<CountTile value={counts.storiesNew} label="Review stories"
          active={view==="stories"} onClick={()=>chooseView("stories")}/>}
        {counts.dynastyUpdates>0&&<CountTile value={counts.dynastyUpdates} label="Dynasty updates"
          active={view==="dynasty"} onClick={()=>chooseView("dynasty")}/>}
      </div>
      <WeekStrip events={timelineNew} selected={date} onSelect={setDate}/>
      <div role="group" aria-label="Filter by category" style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
        {Object.entries(categoryCounts).map(([cat,n])=><button key={cat} type="button" className="new-control"
          aria-pressed={category===cat} onClick={()=>chooseCategory(cat)}
          style={{cursor:"pointer",background:category===cat?"#efefff":"#fff",
            border:`1px solid ${category===cat?T.accent:T.subtle}`,borderRadius:6,
            color:category===cat?T.accent:T.muted,fontSize:12,fontFamily:"inherit",
            padding:"8px 12px",minHeight:44}}>
          <strong style={{color:category===cat?T.accent:T.ink}}>{n}</strong> {cat}
        </button>)}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap",marginBottom:8}}>
        <h3 style={{margin:0,fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",color:T.muted}}>
          <span role="status" aria-live="polite">{kind} · {filtered.length} {filtered.length===1?"result":"results"}</span></h3>
        {(date||category||view!=="timeline")&&<button type="button" onClick={reset} className="new-control"
          style={{cursor:"pointer",border:"none",background:"transparent",color:T.accent,
            textDecoration:"underline",fontSize:13,fontWeight:700,minHeight:44}}>Clear filters</button>}
      </div>
      {display.length?<ul style={{margin:0,padding:0}}>{display.map(e=>
        <ChangeRow key={`${e.date}-${e.title||e.headline}`} date={e.displayDate||e.date}
          dateTime={e.date} title={e.title||e.headline} href={e.href}
          category={e.category} color={e.color||e.borderColor}
          meta={view==="dynasty"?e.dynastyName:null}/>)}</ul>:
        <p role="status" style={{color:T.muted}}>No matching updates. Try another date or clear filters.</p>}
      {hiddenCount>0&&<p style={{fontSize:13,color:T.muted}}>+{hiddenCount} more —{" "}
        <a href={weeklyReviewHref} style={{color:T.ink,fontWeight:600}}>read the full review</a></p>}
      <a href={weeklyReviewHref} style={{display:"inline-block",marginTop:16,fontSize:13,
        fontWeight:600,color:T.ink}}>Open weekly review →</a>
    </div>
  </section>;
}
