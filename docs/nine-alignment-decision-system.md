# Nine-alignment decision system

Status: campaign design convention (not a new official D&D rule).

Axes: Lawful / Neutral / Chaotic x Good / Neutral / Evil.

| Code | Alignment | Campaign color | Typical motivation |
|---|---|---|---|
| LG | Lawful Good | BLUE | Compassion through honor and just duty |
| NG | Neutral Good | BLUE | Help others regardless of convention |
| CG | Chaotic Good | BLUE | Liberation and compassion |
| LN | Lawful Neutral | GREEN | Rules, duty, order |
| TN | True Neutral | GREEN | Balance or situational pragmatism |
| CN | Chaotic Neutral | GREEN | Independence and freedom |
| LE | Lawful Evil | RED | Exploitation through systems and control |
| NE | Neutral Evil | RED | Self-serving harm |
| CE | Chaotic Evil | RED | Cruelty and destructive impulse |

## Player-facing controls
- Each consequential dialogue choice can carry an alignment tag, colored BLUE/GREEN/RED.
- Show exactly five clickable choices by default when running the interactive campaign; select five meaningful alternatives from the nine alignment categories based on the situation, not all nine every time.
- Keep all nine alignments available in character sheets, NPC records, encounter authoring, filters, and moral analytics.
- Present a short description, relevant skill check (if meaningful), consequences, and possible redemption outcome.
- Do not automatically assign a character a new alignment from a single action; track sustained behavior, intention, and consequences.
- A RED-aligned NPC can have a legitimate redemption path when supported by the story. BLUE does not mean incapable of wrongdoing.
- Distinguish official alignment rules from homebrew reputation, virtue, and choice-tracking mechanics.

## Suggested structured choice record
```json
{
  "choice_id": "example-001",
  "label": "Free the captives despite the order",
  "alignment": "CG",
  "color": "BLUE",
  "check": {"skill": "Persuasion", "dc": 15, "required": false},
  "outcome": "The captives escape; authorities may pursue the party.",
  "redemption_hook": null
}
```

These are UI and writing conventions, not a claim that the nine alignments mechanically dictate actions.
