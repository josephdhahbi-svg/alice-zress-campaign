#!/usr/bin/env python3
"""Illustrative encounter probability simulator, not a complete D&D combat engine."""
import argparse
import random

def simulate(seed=2026, trials=10000, target_ac=15, attack_bonus=5, damage=7, target_hp=21, rounds=3):
    rng = random.Random(seed)
    wins = 0
    for _ in range(trials):
        hp = target_hp
        for _ in range(rounds):
            roll = rng.randint(1, 20)
            if roll == 20 or (roll != 1 and roll + attack_bonus >= target_ac):
                hp -= damage * (2 if roll == 20 else 1)
            if hp <= 0:
                wins += 1
                break
    return wins / trials

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--test", action="store_true")
    args = parser.parse_args()
    rate = simulate()
    assert 0 <= rate <= 1
    if args.test:
        assert simulate() == simulate(), "simulation must be reproducible"
    print(f"Illustrative probability of defeating target in three attacks: {rate:.1%}")
