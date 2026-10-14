#!/usr/bin/env python3
"""Evidence-gated 25-criterion scorecard. No fabricated verification or playtest credit."""
import argparse
import json
from pathlib import Path

CATEGORIES = ["Fun","Agency","Story","Character","Living World","Culture","Politics","Economy","History","Geography","Quest Design","Combat","2024 Compliance","Enemy AI","Magic Economy","Progression","Exploration","Dialogue","Morality","Pacing","Visual Maps","Audio","Interface","Documentation","Replayability"]
FIELDS = ("concept","written","verified","playtested")

def score(rows):
    assert len(rows) == 25, "Exactly 25 categories required"
    total = {k: 0 for k in FIELDS}
    for expected, row in zip(CATEGORIES, rows):
        assert row["category"] == expected
        for k in FIELDS:
            v = row[k]
            assert type(v) is int and 0 <= v <= 10, (expected, k, v)
            total[k] += v
        if row["verified"] and not row.get("verification_evidence"):
            raise ValueError(f"Missing verification evidence: {expected}")
        if row["playtested"] and not row.get("playtest_evidence"):
            raise ValueError(f"Missing real-playtest evidence: {expected}")
    return {**total,"total":sum(total.values()),"max":1000}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("input", type=Path)
    args = p.parse_args()
    rows = json.loads(args.input.read_text(encoding="utf-8"))["categories"]
    print(json.dumps(score(rows), indent=2))

if __name__ == "__main__":
    main()
