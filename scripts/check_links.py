#!/usr/bin/env python3
"""Check relationship references against known entity IDs; report unresolved links."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]/"data"
ids=set()
for path in root.glob("*.json"):
    obj=json.loads(path.read_text(encoding="utf-8"))
    if isinstance(obj,list):
        ids.update(x.get("id") for x in obj if isinstance(x,dict) and "id" in x)
relationships=json.loads((root/"relationships.json").read_text(encoding="utf-8"))
unresolved=sorted({v for r in relationships for k in ("subject","object") if (v:=r.get(k)) not in ids})
if unresolved:
    print("UNRESOLVED reference IDs (not yet imported):",", ".join(unresolved))
else:
    print("All relationship references resolve.")
# Warning-only during initial migration; enforce later when roster import is complete.
