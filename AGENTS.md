# aios-skills — notatki dla agenta

To jest **katalog skilli**, nie aplikacja.

- Kontrakt: `docs/skill-contract.md`
- Audyt (2026-09): `docs/audit.md`
- Routing: `docs/routing.md`
- Ewaluacja zdań: `evals/routing.md`
- Szablon: `docs/SKILL.template.md`
- Check: `python3 scripts/check-skills.py`
- Install do innego projektu: `./scripts/install-skills.sh --host both --target /ścieżka`

Nie dodawaj canvasów, dashboardów ani UI hosta do tego repo. Skill = kontrakt + procedura + adapter.

Przy zmianie `skills/*/SKILL.md` odpal check. Description musi zawierać anty-trigger (`NIE do`). Stub premium nie może mieć `verified: true`.
