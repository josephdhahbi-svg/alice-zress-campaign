#!/usr/bin/env python3
"""Produce reproducible CSV counts and an SVG chart from repository data."""
import csv
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"reports"
OUT.mkdir(exist_ok=True)
rows=[]
for file in sorted((ROOT/"data").glob("*.json")):
    if file.name in {"schema.json","story_phases.json"}:
        continue
    data=json.loads(file.read_text(encoding="utf-8"))
    if not isinstance(data,list):
        continue
    pending=sum(r.get("continuity_status")=="pending_review" for r in data)
    rows.append((file.stem,len(data),pending))
with (OUT/"record_counts.csv").open("w",newline="",encoding="utf-8") as f:
    w=csv.writer(f);w.writerow(["category","records","pending_review"]);w.writerows(rows)
width=800;height=100+len(rows)*48
mx=max([v for _,v,_ in rows] or [1])
elements=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">','<rect width="100%" height="100%" fill="#101525"/>','<text x="30" y="40" fill="#fff" font-family="sans-serif" font-size="23">Campaign record inventory</text>']
for i,(name,count,pending) in enumerate(rows):
    y=80+i*48
    label=name.replace("&","&amp;").replace("<","&lt;")
    elements.append(f'<text x="30" y="{y}" fill="#ddd" font-family="sans-serif" font-size="16">{label}</text>')
    elements.append(f'<rect x="210" y="{y-17}" width="{int(470*count/max(mx,1))}" height="22" rx="5" fill="#9b8de5"/>')
    elements.append(f'<text x="700" y="{y}" fill="#fff" font-family="sans-serif" font-size="15">{count} ({pending} pending)</text>')
elements.append("</svg>")
(OUT/"record_counts.svg").write_text("\n".join(elements),encoding="utf-8")
print(f"Wrote {len(rows)} category counts and SVG chart")
