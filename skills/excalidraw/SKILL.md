---
name: excalidraw
description: >
  Generowanie diagramów architektury jako pliki .excalidraw z analizy codebase,
  z opcjonalnym eksportem do PNG/SVG. Architecture diagrams, system diagrams,
  visualize codebase, generate excalidraw files, export to PNG/SVG.
type: skill
install: .claude/skills/excalidraw/SKILL.md
pricing: free
verified: false
aios: true
---

# Excalidraw Diagram Generator

Generate architecture diagrams as `.excalidraw` files directly from codebase analysis, with optional export to PNG and SVG.

---

## Quick Start

**User just asks:**
```
"Generate an architecture diagram for this project"
"Create an excalidraw diagram of the system"
"Visualize this codebase as an excalidraw file"
```

**Claude Code will:**
1. Analyze the codebase (any language/framework)
2. Identify components, services, databases, APIs
3. Map relationships and data flows
4. Generate valid `.excalidraw` JSON with dynamic IDs and labels
5. Optionally export to PNG and/or SVG using Playwright

**No prerequisites:** Works without existing diagrams, Terraform, or specific file types.

---

## Critical Rules

### 1. NEVER Use Diamond Shapes

Diamond arrow connections are broken in raw Excalidraw JSON. Use styled rectangles instead:

| Semantic Meaning | Rectangle Style |
|------------------|-----------------|
| Orchestrator/Hub | Coral (`#ffa8a8`/`#c92a2a`) + strokeWidth: 3 |
| Decision Point | Orange (`#ffd8a8`/`#e8590c`) + dashed stroke |

### 2. Labels Require TWO Elements

The `label` property does NOT work in raw JSON. Every labeled shape needs:

```json
// 1. Shape with boundElements reference
{
  "id": "my-box",
  "type": "rectangle",
  "boundElements": [{ "type": "text", "id": "my-box-text" }]
}

// 2. Separate text element with containerId
{
  "id": "my-box-text",
  "type": "text",
  "containerId": "my-box",
  "text": "My Label"
}
```

### 3. Elbow Arrows Need Three Properties

For 90-degree corners (not curved):

```json
{
  "type": "arrow",
  "roughness": 0,        // Clean lines
  "roundness": null,     // Sharp corners
  "elbowed": true        // 90-degree mode
}
```

### 4. Arrow Edge Calculations

Arrows must start/end at shape edges, not centers:

| Edge | Formula |
|------|---------|
| Top | `(x + width/2, y)` |
| Bottom | `(x + width/2, y + height)` |
| Left | `(x, y + height/2)` |
| Right | `(x + width, y + height/2)` |

**Detailed arrow routing:** See `references/arrows.md`

---

## Element Types

| Type | Use For |
|------|---------|
| `rectangle` | Services, databases, containers, orchestrators |
| `ellipse` | Users, external systems, start/end points |
| `text` | Labels inside shapes, titles, annotations |
| `arrow` | Data flow, connections, dependencies |
| `line` | Grouping boundaries, separators |

**Full JSON format:** See `references/json-format.md`

---

## Workflow

### Step 1: Analyze Codebase

Discover components by looking for:

| Codebase Type | What to Look For |
|---------------|------------------|
| Monorepo | `packages/*/package.json`, workspace configs |
| Microservices | `docker-compose.yml`, k8s manifests |
| IaC | Terraform/Pulumi resource definitions |
| Backend API | Route definitions, controllers, DB models |
| Frontend | Component hierarchy, API calls |

**Use tools:**
- `Glob` -> `**/package.json`, `**/Dockerfile`, `**/*.tf`
- `Grep` -> `app.get`, `@Controller`, `CREATE TABLE`
- `Read` -> README, config files, entry points

### Step 2: Plan Layout

**Vertical flow (most common):**
```
Row 1: Users/Entry points (y: 100)
Row 2: Frontend/Gateway (y: 230)
Row 3: Orchestration (y: 380)
Row 4: Services (y: 530)
Row 5: Data layer (y: 680)

Columns: x = 100, 300, 500, 700, 900
Element size: 160-200px x 80-90px
```

**Other patterns:** See `references/examples.md`

### Step 3: Generate Elements

For each component:
1. Create shape with unique `id`
2. Add `boundElements` referencing text
3. Create text with `containerId`
4. Choose color based on type

**Color palettes:** See `references/colors.md`

### Step 4: Add Connections

For each relationship:
1. Calculate source edge point
2. Plan elbow route (avoid overlaps)
3. Create arrow with `points` array
4. Match stroke color to destination type

**Arrow patterns:** See `references/arrows.md`

### Step 5: Add Grouping (Optional)

For logical groupings:
- Large transparent rectangle with `strokeStyle: "dashed"`
- Standalone text label at top-left

### Step 6: Validate and Write

Run validation before writing. Save to `docs/` or user-specified path.

**Validation checklist:** See `references/validation.md`

### Step 7: Export to PNG/SVG (Optional)

After writing the `.excalidraw` file, ask the user if they want PNG, SVG, or both exports.

Uses Playwright MCP tools and `@excalidraw/utils` to programmatically render the diagram -- no manual upload to excalidraw.com needed.

**Requires:** Playwright MCP tools (`browser_navigate`, `browser_run_code`, `browser_close`).

**Full export procedure:** See `references/export.md`

---

## Quick Arrow Reference

**Straight down:**
```json
{ "points": [[0, 0], [0, 110]], "x": 590, "y": 290 }
```

**L-shape (left then down):**
```json
{ "points": [[0, 0], [-325, 0], [-325, 125]], "x": 525, "y": 420 }
```

**U-turn (callback):**
```json
{ "points": [[0, 0], [50, 0], [50, -125], [20, -125]], "x": 710, "y": 440 }
```

**Arrow width/height** = bounding box of points:
```
points [[0,0], [-440,0], [-440,70]] -> width=440, height=70
```

**Multiple arrows from same edge** - stagger positions:
```
5 arrows: 20%, 35%, 50%, 65%, 80% across edge width
```

---

## Default Color Palette

| Component | Background | Stroke |
|-----------|------------|--------|
| Frontend | `#a5d8ff` | `#1971c2` |
| Backend/API | `#d0bfff` | `#7048e8` |
| Database | `#b2f2bb` | `#2f9e44` |
| Storage | `#ffec99` | `#f08c00` |
| AI/ML | `#e599f7` | `#9c36b5` |
| External APIs | `#ffc9c9` | `#e03131` |
| Orchestration | `#ffa8a8` | `#c92a2a` |
| Message Queue | `#fff3bf` | `#fab005` |
| Cache | `#ffe8cc` | `#fd7e14` |
| Users | `#e7f5ff` | `#1971c2` |

**Cloud-specific palettes:** See `references/colors.md`

---

## Quick Validation Checklist

Before writing file:
- [ ] Every shape with label has boundElements + text element
- [ ] Text elements have containerId matching shape
- [ ] Multi-point arrows have `elbowed: true`, `roundness: null`
- [ ] Arrow x,y = source shape edge point
- [ ] Arrow final point offset reaches target edge
- [ ] No diamond shapes
- [ ] No duplicate IDs

**Full validation algorithm:** See `references/validation.md`

---

## Common Issues

| Issue | Fix |
|-------|-----|
| Labels don't appear | Use TWO elements (shape + text), not `label` property |
| Arrows curved | Add `elbowed: true`, `roundness: null`, `roughness: 0` |
| Arrows floating | Calculate x,y from shape edge, not center |
| Arrows overlapping | Stagger start positions across edge |

**Detailed bug fixes:** See `references/validation.md`

---

## Business Diagram Types

Beyond architecture diagrams, this skill supports business/marketing visualizations:

### Sales Funnel / Value Ladder
```
Row 1: Traffic sources (YouTube, X, IG, Blog, Podcast)  y: 160
Row 2: Capture mechanism (Newsletter, Lead Magnet)       y: 310
Row 3: Entry products (low-price courses)                y: 460  ← dashed group border
Row 4: Flagship product                                  y: 620  ← strokeWidth: 3
Row 5: Recurring revenue (SaaS, Community)               y: 780

Use dashed arrows for "credit system" / upgrade paths.
Use layer labels (mono font, left-aligned) for section names.
```

### Color Coding for Business Diagrams

| Component | Background | Stroke |
|-----------|------------|--------|
| Social/Traffic | Platform colors (red=YT, purple=IG, etc.) | Matching darker |
| Newsletter/Capture | `#ffd8a8` | `#e8590c` |
| Entry Products | `#ffec99` | `#f08c00` |
| Flagship | `#ffa8a8` | `#c92a2a` + strokeWidth: 3 |
| SaaS/Recurring | `#d0bfff` | `#7048e8` |
| Annotations | `#868e96` | — (text only, opacity: 70-80) |

### Layout Annotations Pattern
Add contextual notes using standalone text elements:
- `fontFamily: 3` (monospace) for technical/data annotations
- `opacity: 50-80` for secondary info
- Position to the right of the main flow with "←" prefix

### Grouping with Dashed Borders
Wrap related elements with a transparent rectangle:
```json
{ "type": "rectangle", "strokeStyle": "dashed", "backgroundColor": "transparent", "opacity": 40 }
```

---

## ExcalidrawAutomate API Patterns

Reference from `obsidian-excalidraw-plugin/docs/API/`:

### Key API Methods (for Obsidian scripting, not raw JSON)
- `addRect/addEllipse/addLine/addFrame(topX, topY, width, height)`
- `addText(topX, topY, text, { box, wrapAt, textAlign })`
- `connectObjects(objA, "right", objB, "left", formatting)` — smart arrow routing
- `addToGroup(objectIds)` — returns groupId
- `addElementsToFrame(frameId, elementIDs)`
- `addAppendUpdateCustomData(id, data)` — persist arbitrary data on elements

### Style Object (EA API)
```javascript
ea.style.fillStyle = "solid"       // "hachure" | "cross-hatch" | "solid"
ea.style.strokeStyle = "dashed"    // "solid" | "dashed" | "dotted"
ea.style.fontFamily = 1            // 1: Virgil, 2: Helvetica, 3: Cascadia
ea.style.roughness = 0             // 0-3 (0 = clean, 3 = max sketch)
ea.style.roundness = { type: 3 }   // null = sharp corners
```

### Element Types (complete list from API)
| Type | Raw JSON `type` | EA Method |
|------|----------------|-----------|
| Rectangle | `rectangle` | `addRect()` |
| Ellipse | `ellipse` | `addEllipse()` |
| Diamond | `diamond` | BANNED in raw JSON |
| Line | `line` | `addLine()` |
| Arrow | `arrow` | `addArrow()` / `connectObjects()` |
| Text | `text` | `addText()` |
| Frame | `frame` | `addFrame()` |
| Image | `image` | `addImage()` |
| Embeddable | `embeddable` | `addEmbeddable()` |

---

## Reference Files

| File | Contents |
|------|----------|
| `references/json-format.md` | Element types, required properties, text bindings |
| `references/arrows.md` | Routing algorithm, patterns, bindings, staggering |
| `references/colors.md` | Default, AWS, Azure, GCP, K8s palettes |
| `references/examples.md` | Complete JSON examples, layout patterns |
| `references/validation.md` | Checklists, validation algorithm, bug fixes |
| `references/export.md` | PNG/SVG export procedure via Playwright |

---

## Output

- **Location:** `docs/architecture/` or user-specified
- **Filename:** Descriptive, e.g., `system-architecture.excalidraw`
- **Exports (optional):** `system-architecture.svg` and/or `system-architecture.png` in same directory
- **Testing:** Open `.excalidraw` in https://excalidraw.com or VS Code extension; `.svg` and `.png` can be viewed directly or embedded in documentation
