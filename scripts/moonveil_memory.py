#!/usr/bin/env python3
"""Moonveil Memory Engine v2: local SQLite, explicit canon approval, searchable briefings."""
import argparse
import datetime as dt
import json
import pathlib
import sqlite3

ROOT = pathlib.Path(__file__).resolve().parents[1]
DB = ROOT / "local" / "moonveil-memory.sqlite3"
CAMPAIGN = "moonveil-dhampir"
SEED = [
 ("character","ancestry","Dhampir","confirmed"),
 ("character","class","Undead Warlock","confirmed"),
 ("character","gender","female","confirmed"),
 ("character","patron","Vaelthara, benevolent Archlich of Mystra","confirmed"),
 ("character","appearance","Raven-black hair; red eyes; gothic robes","confirmed"),
 ("character","ethos","Heroic; redemption and preservation of souls","confirmed"),
 ("opening","level_1_to_4","Rabbit Hole through Netherese ruins","confirmed"),
 ("opening","level_5_arrival","Eye of the First World (Richat-inspired fictional location)","confirmed"),
 ("progression","level_17","Lich (homebrew)","confirmed"),
 ("progression","level_20","Archlich (homebrew)","confirmed"),
 ("cosmology","taijitu_bagua_eye","Combined fictional Wheel of the Infinite Journey","proposed"),
 ("structure","books_per_cycle","30","confirmed"),
 ("structure","cycles","7","confirmed"),
 ("structure","book_traversals","210","confirmed"),
 ("armory","weapons","15","confirmed"),
 ("armory","defenses","15","confirmed"),
 ("armory","trinkets","15","confirmed"),
 ("armory","relic_chains","45","confirmed"),
 ("armory","stages_per_chain","7","confirmed"),
 ("armory","quest_stages","315","confirmed"),
 ("deities","positions","90","confirmed"),
 ("deities","elite_subset","15","confirmed"),
 ("targets","powers","72","confirmed"),
 ("targets","major_boss_fights","81","confirmed"),
 ("targets","lich_soul_gems","500","confirmed"),
 ("targets","gems","13500","confirmed"),
 ("targets","gold","108000","confirmed"),
]
def connect(path=DB):
    path = pathlib.Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(path)
    con.row_factory = sqlite3.Row
    con.executescript("""
    PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS facts (
      campaign TEXT NOT NULL, section TEXT NOT NULL, key TEXT NOT NULL,
      value TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('confirmed','proposed','disputed','superseded')),
      source TEXT NOT NULL, updated_at TEXT NOT NULL,
      PRIMARY KEY(campaign,section,key)
    );
    CREATE TABLE IF NOT EXISTS changes (
      id INTEGER PRIMARY KEY AUTOINCREMENT, campaign TEXT, section TEXT, key TEXT,
      old_value TEXT, new_value TEXT, decision TEXT, source TEXT, changed_at TEXT
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT, campaign TEXT NOT NULL,
      session TEXT NOT NULL, level INTEGER, narrative TEXT NOT NULL,
      recorded_at TEXT NOT NULL
    );
    """)
    return con

def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()

def init(con):
    for section,key,value,status in SEED:
        con.execute("""INSERT OR IGNORE INTO facts
        (campaign,section,key,value,status,source,updated_at) VALUES (?,?,?,?,?,?,?)""",
        (CAMPAIGN,section,key,value,status,"Moonveil working agreement",now()))
    con.commit()

def propose(con, campaign, section, key, value, source, approve=False):
    if not source.strip():
        raise ValueError("A source or decision reference is required")
    old=con.execute("SELECT * FROM facts WHERE campaign=? AND section=? AND key=?",
                    (campaign,section,key)).fetchone()
    if old and old["value"] != value and old["status"] == "confirmed" and not approve:
        con.execute("INSERT INTO changes(campaign,section,key,old_value,new_value,decision,source,changed_at) VALUES(?,?,?,?,?,?,?,?)",
                    (campaign,section,key,old["value"],value,"BLOCKED_CONFLICT",source,now()))
        con.commit()
        return "BLOCKED: confirmed canon differs; repeat with --approve only after explicit user approval."
    status="confirmed" if approve else "proposed"
    if old and old["value"] == value and old["status"] == "confirmed":
        return "UNCHANGED: confirmed canon preserved."
    con.execute("""INSERT INTO facts(campaign,section,key,value,status,source,updated_at)
    VALUES(?,?,?,?,?,?,?) ON CONFLICT(campaign,section,key) DO UPDATE SET
    value=excluded.value,status=excluded.status,source=excluded.source,updated_at=excluded.updated_at""",
    (campaign,section,key,value,status,source,now()))
    con.execute("INSERT INTO changes(campaign,section,key,old_value,new_value,decision,source,changed_at) VALUES(?,?,?,?,?,?,?,?)",
                (campaign,section,key,old["value"] if old else None,value,
                 "APPROVED" if approve else "PROPOSED",source,now()))
    con.commit()
    return "SAVED: "+status

def briefing(con,campaign):
    lines=["# Moonveil Memory Briefing", "", "Campaign: "+campaign,
           "Generated: "+now(), "", "## Canon and proposals"]
    for row in con.execute("SELECT * FROM facts WHERE campaign=? ORDER BY section,key",(campaign,)):
        lines.append("- ["+row["status"]+"] "+row["section"]+"."+row["key"]+
                     " = "+row["value"]+" (source: "+row["source"]+")")
    lines.extend(["", "## Recent session events"])
    for row in con.execute("SELECT * FROM events WHERE campaign=? ORDER BY id DESC LIMIT 15",(campaign,)):
        lines.append("- "+row["session"]+" (level "+str(row["level"])+"): "+row["narrative"])
    lines.extend(["","## Continuity rules",
      "- Do not treat proposals as confirmed canon.",
      "- Do not overwrite confirmed facts without explicit approval.",
      "- Distinguish Moonveil Dhampir from Alice Z'ress.",
      "- Local database is not automatically connected to ChatGPT or GitHub."])
    return "\n".join(lines)+"\n"

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--db",type=pathlib.Path,default=DB)
    s=p.add_subparsers(dest="command",required=True)
    s.add_parser("init")
    b=s.add_parser("briefing"); b.add_argument("--campaign",default=CAMPAIGN); b.add_argument("--output",type=pathlib.Path)
    f=s.add_parser("fact"); f.add_argument("section"); f.add_argument("key"); f.add_argument("value")
    f.add_argument("--campaign",default=CAMPAIGN); f.add_argument("--source",required=True); f.add_argument("--approve",action="store_true")
    e=s.add_parser("event"); e.add_argument("session"); e.add_argument("level",type=int); e.add_argument("narrative"); e.add_argument("--campaign",default=CAMPAIGN)
    q=s.add_parser("search"); q.add_argument("text"); q.add_argument("--campaign",default=CAMPAIGN)
    args=p.parse_args(); con=connect(args.db)
    if args.command=="init":
        init(con); print("Initialized; existing facts preserved.")
    elif args.command=="briefing":
        output=briefing(con,args.campaign)
        if args.output:
            args.output.parent.mkdir(parents=True,exist_ok=True)
            args.output.write_text(output,encoding="utf-8")
            print("Written:",args.output)
        else: print(output)
    elif args.command=="fact":
        print(propose(con,args.campaign,args.section,args.key,args.value,args.source,args.approve))
    elif args.command=="event":
        con.execute("INSERT INTO events(campaign,session,level,narrative,recorded_at) VALUES(?,?,?,?,?)",
                    (args.campaign,args.session,args.level,args.narrative,now()))
        con.commit(); print("Event saved.")
    elif args.command=="search":
        pattern="%"+args.text+"%"
        for row in con.execute("""SELECT * FROM facts WHERE campaign=? AND
        (section LIKE ? OR key LIKE ? OR value LIKE ?) ORDER BY section,key""",
        (args.campaign,pattern,pattern,pattern)):
            print("["+row["status"]+"] "+row["section"]+"."+row["key"]+": "+row["value"])
if __name__=="__main__":
    main()
