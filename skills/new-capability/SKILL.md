---
name: new-capability
description: >
  Fabryka własnych integracji API. Bierze nazwę usługi i prowadzi interaktywny workflow:
  research oficjalnej dokumentacji API, scoping operacji read/write, projekt architektury
  i wygenerowanie gotowego Context Skilla. New capability, dodaj integrację, połącz API,
  podłącz usługę, build capability, service integration, add API.
type: command
install: .claude/commands/new-capability.md
pricing: premium
verified: true
aios: true
---

# New Capability — Capability Factory

> Buduj integracje API zrozumiane i kontrolowane w 100% — z oficjalnej dokumentacji, nie z czarnych skrzynek z marketplace.

## Co robi

- Bierze nazwę usługi i przeprowadza wieloetapowy, interaktywny workflow: intencja → głęboki research oficjalnych docs API → scoping operacji read/write → projekt architektury → dokument eksploracyjny → plan wdrożenia → handoff do implementacji.
- Auto-dobiera jedną z czterech **form** integracji wg kształtu API: Lean Reference, Client Wrapper, SDK Pass-Through, CLI Tool.
- Efekt zawsze ten sam: gotowy Context Skill, który ładuje się automatycznie, gdy temat pojawia się w rozmowie.

## Zasada anty-marketplace (twardy warunek)

Nie używa gotowych serwerów MCP z marketplace ani third-party wrapperów. Powód: to czarne
skrzynki — nie wiesz co pomijają, co zepsują przy zmianie API i kiedy maintainer przestanie
je rozwijać. Zwykle pokrywają 20% API i zostawiają cię z niczym przy pozostałych 80%.
Sens tego skilla = capability w pełni zrozumiana, kontrolowana i dopasowana do architektury.

## Kiedy użyć

Gdy dodajesz nowe API, podłączasz usługę albo budujesz integrację z zewnętrznym narzędziem.

---

> **Wersja w tym repo to opis.** Pełny workflow (7 etapów, szablony form, drzewo decyzyjne
> i generator skilla) jest częścią [AIOS Community](https://cyfrowyogarniacz.pl).
