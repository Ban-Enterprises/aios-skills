# aios-skills — notatki dla agenta

To jest **katalog skilli**, nie aplikacja.

- Kontrakt: `docs/skill-contract.md`
- Manifest produktu: `catalog.yaml`
- Audyt (2026-09): `docs/audit.md`
- Routing: `docs/routing.md`
- Ewaluacja zdań: `evals/routing.md`
- Szablon: `docs/SKILL.template.md`
- Check: `python3 scripts/check-skills.py`
- Install portable: `python3 scripts/install-skills.py --host portable --target /ścieżka`

Nie dodawaj canvasów, dashboardów ani UI hosta do tego repo. Skill = kontrakt + procedura + adapter.

`SKILL.md` ma być zgodny z Agent Skills; nie dodawaj tam pól handlowych i
instalacyjnych. `pricing`, `verified`, `completeness`, `aios` oraz host adapters
żyją wyłącznie w `catalog.yaml`.

Przy zmianie `skills/*/SKILL.md` lub `catalog.yaml` odpal check. Stub premium
nie może mieć `verified: true`.
