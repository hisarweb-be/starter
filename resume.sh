#!/bin/bash
echo "=== HisarWeb Starter Project Status ==="
echo "Versie: 1.0.0"
echo "Laatste update: $(grep 'Laatste update' TODO.md | cut -d: -f2-)"
echo ""
echo "--- Sprint Status (TODO.md) ---"
head -n 20 TODO.md
echo ""
echo "--- Laatste Oplevering (DELIVERY_NOTES.md) ---"
head -n 15 DELIVERY_NOTES.md
echo ""
echo "TIP: Lees AGENTS.md voor de volledige context van dit project."
