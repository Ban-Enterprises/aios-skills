import {
  BarChart,
  Button,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Code,
  CollapsibleSection,
  computeDAGLayout,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  PieChart,
  Pill,
  Row,
  Spacer,
  Stack,
  Stat,
  Swatch,
  Table,
  Text,
  TodoList,
  UsageBar,
  useCanvasAction,
  useCanvasState,
  useEffect,
  useHostTheme,
  useMemo,
  useRef,
  useState,
} from "cursor/canvas";
import type { Color, TodoItem, TodoStatus } from "cursor/canvas";

type FamilyId =
  | "cursor"
  | "firecrawl"
  | "canvas"
  | "airtable"
  | "apify"
  | "x"
  | "workspace";

/**
 * `repo` skills live in the open workspace, so their path can be opened
 * directly. Everything else sits under the machine's `~/.cursor` tree, whose
 * absolute prefix differs per machine — those are reached through the agent
 * instead of `openFile`.
 */
type Scope = "repo" | "home";

type Skill = {
  id: string;
  title: string;
  family: FamilyId;
  scope: Scope;
  when: string;
  say: string;
  path: string;
};

const FAMILIES: Record<
  FamilyId,
  { label: string; short: string; color: Color; source: string }
> = {
  workspace: {
    label: "Projekt",
    short: "Projekt",
    color: "pink",
    source: "skills/ w repo",
  },
  firecrawl: {
    label: "Firecrawl",
    short: "Firecrawl",
    color: "orange",
    source: "plugin Firecrawl",
  },
  airtable: {
    label: "Airtable i ops",
    short: "Airtable",
    color: "green",
    source: "plugin Airtable",
  },
  apify: {
    label: "Apify",
    short: "Apify",
    color: "yellow",
    source: "plugin Apify",
  },
  cursor: {
    label: "Cursor Cloud",
    short: "Cursor",
    color: "blue",
    source: "~/.cursor/skills-cursor",
  },
  canvas: {
    label: "Canvas / docs",
    short: "Canvas",
    color: "purple",
    source: "plugin docs + PR review",
  },
  x: {
    label: "X (Twitter)",
    short: "X",
    color: "cyan",
    source: "plugin X",
  },
};

const CURSOR_DIR = "~/.cursor/skills-cursor";
const PLUGIN_DIR = "~/.cursor/plugins/cache/cursor-public";

const SKILLS: Skill[] = [
  {
    id: "prime",
    title: "Prime",
    family: "workspace",
    scope: "repo",
    when: "Start sesji: odczyt kontekstu projektu, potwierdzenie gotowości.",
    say: "Prime — zorientuj się w projekcie.",
    path: "skills/prime/SKILL.md",
  },
  {
    id: "status",
    title: "Status",
    family: "workspace",
    scope: "repo",
    when: "Szybki stan: priorytety, ostatnia sesja, następne kroki.",
    say: "Jaki jest status projektu?",
    path: "skills/status/SKILL.md",
  },
  {
    id: "end-session",
    title: "End Session",
    family: "workspace",
    scope: "repo",
    when: "Koniec pracy: zapisz SESSION-STATE.md na następną sesję.",
    say: "Zakończ sesję i zapisz stan.",
    path: "skills/end-session/SKILL.md",
  },
  {
    id: "brainstorm",
    title: "Brainstorm",
    family: "workspace",
    scope: "repo",
    when: "Decyzja strategiczna: Frame, Explore, Options, Output.",
    say: "Zrób brainstorm wokół tego pytania.",
    path: "skills/brainstorm/SKILL.md",
  },
  {
    id: "deep-research",
    title: "Deep Research",
    family: "workspace",
    scope: "repo",
    when: "Wieloźródłowy research z triangulacją i cytowanym raportem.",
    say: "Zrób deep research: kto jest liderem w tej niszy.",
    path: "skills/deep-research/SKILL.md",
  },
  {
    id: "academic",
    title: "Academic Paper Search",
    family: "workspace",
    scope: "repo",
    when: "Publikacje naukowe (OpenAlex), cytowania, darmowe PDF-y.",
    say: "Znajdź papers o tym temacie i PDF-y spoza paywalla.",
    path: "skills/academic/SKILL.md",
  },
  {
    id: "reddit",
    title: "Reddit Search",
    family: "workspace",
    scope: "repo",
    when: "Dyskusje społeczności bez klucza API (publiczne .json).",
    say: "Co ludzie na Reddit mówią o tym narzędziu?",
    path: "skills/reddit/SKILL.md",
  },
  {
    id: "supadata",
    title: "Supadata",
    family: "workspace",
    scope: "repo",
    when: "Transkrypty YouTube, TikTok, IG, X, FB — nie Firecrawl.",
    say: "Wyciągnij transkrypt z tego filmu.",
    path: "skills/supadata/SKILL.md",
  },
  {
    id: "firecrawl",
    title: "Firecrawl (projekt)",
    family: "workspace",
    scope: "repo",
    when: "Lokalny skill projektu: scrape WWW przez CLI zamiast WebFetch.",
    say: "Zescrapuj konkurenta przez Firecrawl.",
    path: "skills/firecrawl/SKILL.md",
  },
  {
    id: "writing-style",
    title: "Writing Style",
    family: "workspace",
    scope: "repo",
    when: "Każdy tekst: anti-AI-slop, ludzki język.",
    say: "Napisz ten tekst w naszym stylu.",
    path: "skills/writing-style/SKILL.md",
  },
  {
    id: "frontend-design",
    title: "Frontend Design",
    family: "workspace",
    scope: "repo",
    when: "UI produkcyjny bez generycznego AI slop; 9 przykładów do mieszania.",
    say: "Zaprojektuj landing w niegenerycznym stylu.",
    path: "skills/frontend-design/SKILL.md",
  },
  {
    id: "ui-ux-pro-max",
    title: "UI/UX Pro Max",
    family: "workspace",
    scope: "repo",
    when: "Decyzje designu: style, palety, fonty, wytyczne UX, stacki.",
    say: "Dobierz paletę i typografię pod ten produkt.",
    path: "skills/ui-ux-pro-max/SKILL.md",
  },
  {
    id: "diagram",
    title: "D2 Diagrams",
    family: "workspace",
    scope: "repo",
    when: "Schemat architektury w D2, renderowany do PNG.",
    say: "Narysuj diagram przepływu danych.",
    path: "skills/diagram/SKILL.md",
  },
  {
    id: "excalidraw",
    title: "Excalidraw",
    family: "workspace",
    scope: "repo",
    when: "Diagram z analizy kodu jako .excalidraw (PNG/SVG).",
    say: "Wygeneruj excalidraw architektury z tego repo.",
    path: "skills/excalidraw/SKILL.md",
  },
  {
    id: "notion-page-builder",
    title: "Notion Page Builder",
    family: "workspace",
    scope: "repo",
    when: "Strona Notion z formatowaniem i bazami. Wymaga Notion MCP.",
    say: "Zbuduj stronę Notion jako lead magnet.",
    path: "skills/notion-page-builder/SKILL.md",
  },
  {
    id: "new-capability",
    title: "New Capability",
    family: "workspace",
    scope: "repo",
    when: "Nowa integracja API: research docs, architektura, gotowy skill.",
    say: "Dodaj capability do tej usługi.",
    path: "skills/new-capability/SKILL.md",
  },
  {
    id: "firecrawl-search",
    title: "Firecrawl Search",
    family: "firecrawl",
    scope: "home",
    when: "Szukasz w sieci z pełną treścią stron, nie samymi snippetami.",
    say: "Wyszukaj artykuły o tym temacie i wyciągnij treść.",
    path: `${PLUGIN_DIR}/789/…/skills/firecrawl-search/SKILL.md`,
  },
  {
    id: "firecrawl-scrape",
    title: "Firecrawl Scrape",
    family: "firecrawl",
    scope: "home",
    when: "Masz URL i chcesz czysty markdown, także ze SPA.",
    say: "Zescrapuj tę stronę do markdown.",
    path: `${PLUGIN_DIR}/789/…/skills/firecrawl-scrape/SKILL.md`,
  },
  {
    id: "firecrawl-crawl",
    title: "Firecrawl Crawl",
    family: "firecrawl",
    scope: "home",
    when: "Trzeba zebrać wiele stron z jednej witryny, np. całe /docs.",
    say: "Crawlnij całą sekcję dokumentacji.",
    path: `${PLUGIN_DIR}/789/…/skills/firecrawl-crawl/SKILL.md`,
  },
  {
    id: "firecrawl-map",
    title: "Firecrawl Map",
    family: "firecrawl",
    scope: "home",
    when: "Znasz domenę, ale nie wiesz, który URL jest właściwy.",
    say: "Zmapuj witrynę i znajdź stronę cennika.",
    path: `${PLUGIN_DIR}/789/…/skills/firecrawl-map/SKILL.md`,
  },
  {
    id: "firecrawl-interact",
    title: "Firecrawl Interact",
    family: "firecrawl",
    scope: "home",
    when: "Treść jest za kliknięciem, loginem, formularzem albo paginacją.",
    say: "Zaloguj się i wyciągnij dane po kliknięciu Next.",
    path: `${PLUGIN_DIR}/789/…/skills/firecrawl-interact/SKILL.md`,
  },
  {
    id: "firecrawl-agent",
    title: "Firecrawl Agent",
    family: "firecrawl",
    scope: "home",
    when: "Chcesz ustrukturyzowany JSON ze schematu: cenniki, katalogi, listingi.",
    say: "Wyciągnij wszystkie plany cenowe jako JSON.",
    path: `${PLUGIN_DIR}/789/…/skills/firecrawl-agent/SKILL.md`,
  },
  {
    id: "firecrawl-download",
    title: "Firecrawl Download",
    family: "firecrawl",
    scope: "home",
    when: "Chcesz lokalną kopię witryny (markdown, screenshoty) do offline.",
    say: "Pobierz dokumentację jako pliki lokalne.",
    path: `${PLUGIN_DIR}/789/…/skills/firecrawl-download/SKILL.md`,
  },
  {
    id: "firecrawl-parse",
    title: "Firecrawl Parse",
    family: "firecrawl",
    scope: "home",
    when: "Lokalny PDF, DOCX albo XLSX do markdown — nie URL.",
    say: "Sparsuj ten PDF do markdown.",
    path: `${PLUGIN_DIR}/789/…/skills/firecrawl-parse/SKILL.md`,
  },
  {
    id: "firecrawl-monitor",
    title: "Firecrawl Monitor",
    family: "firecrawl",
    scope: "home",
    when: "Ta sama strona ma być sprawdzana wielokrotnie — alert przy zmianie.",
    say: "Monitoruj cennik konkurenta i powiadom, gdy się zmieni.",
    path: `${PLUGIN_DIR}/789/…/skills/firecrawl-monitor/SKILL.md`,
  },
  {
    id: "firecrawl-cli",
    title: "Firecrawl CLI",
    family: "firecrawl",
    scope: "home",
    when: "Ogólny research i scrape przez CLI; też przy błędach autoryzacji.",
    say: "Użyj Firecrawl CLI do tej strony.",
    path: `${PLUGIN_DIR}/789/…/skills/firecrawl-cli/SKILL.md`,
  },
  {
    id: "airtable-overview",
    title: "Airtable Overview",
    family: "airtable",
    scope: "home",
    when: "Potrzebny model danych: bazy, tabele, pola, rekordy, widoki.",
    say: "Wyjaśnij, jak jest ułożone Airtable.",
    path: `${PLUGIN_DIR}/22025095/…/skills/airtable-overview/SKILL.md`,
  },
  {
    id: "airtable-cli",
    title: "airtable-mcp CLI",
    family: "airtable",
    scope: "home",
    when: "Czytanie i zapis rekordów, tabel oraz pól przez MCP.",
    say: "Pokaż rekordy z tej tabeli.",
    path: `${PLUGIN_DIR}/22025095/…/skills/airtable-cli/SKILL.md`,
  },
  {
    id: "airtable-filters",
    title: "Airtable Filters",
    family: "airtable",
    scope: "home",
    when: "Filtrowanie rekordów po wartościach pól: AND/OR, daty, choice.",
    say: "Znajdź rekordy ze statusem Open z ostatniego tygodnia.",
    path: `${PLUGIN_DIR}/22025095/…/skills/airtable-filters/SKILL.md`,
  },
  {
    id: "show-airtable-link",
    title: "Show Airtable Link",
    family: "airtable",
    scope: "home",
    when: "Po każdej operacji MCP trzeba oddać klikalny URL do rekordu.",
    say: "Po zapisie pokaż link do rekordu.",
    path: `${PLUGIN_DIR}/22025095/…/skills/show-airtable-link/SKILL.md`,
  },
  {
    id: "agent-activity-log",
    title: "Agent Activity Log",
    family: "airtable",
    scope: "home",
    when: "Długi workflow agenta: audyt decyzji, blokerów i pamięć między sesjami.",
    say: "Włącz log aktywności agenta w tym workflow.",
    path: `${PLUGIN_DIR}/22025095/…/skills/agent-activity-log/SKILL.md`,
  },
  {
    id: "product-ops",
    title: "Product operations",
    family: "airtable",
    scope: "home",
    when: "Roadmap, feedback, launch, OKR i sprinty w Airtable.",
    say: "Zbuduj workspace product-ops pod nasz zespół.",
    path: `${PLUGIN_DIR}/22025095/…/skills/product-ops/SKILL.md`,
  },
  {
    id: "marketing-ops",
    title: "Marketing operations",
    family: "airtable",
    scope: "home",
    when: "Kampanie, kalendarz treści, briefy, budżet, eventy.",
    say: "Zrób front door na requesty marketingowe.",
    path: `${PLUGIN_DIR}/22025095/…/skills/marketing-ops/SKILL.md`,
  },
  {
    id: "sales-ops",
    title: "Sales operations",
    family: "airtable",
    scope: "home",
    when: "Pipeline, konta, deal desk, RFP, forecast — CRM w Airtable lub obok.",
    say: "Zbuduj pipeline sprzedaży w Airtable.",
    path: `${PLUGIN_DIR}/22025095/…/skills/sales-ops/SKILL.md`,
  },
  {
    id: "apify-ultimate-scraper",
    title: "Ultimate Scraper",
    family: "apify",
    scope: "home",
    when: "Scraping z IG, TikTok, LinkedIn, Maps, Reddit i 15+ platform.",
    say: "Zescrapuj leady z Google Maps dla tej niszy.",
    path: `${PLUGIN_DIR}/32913266/…/skills/apify-ultimate-scraper/SKILL.md`,
  },
  {
    id: "apify-actor-development",
    title: "Actor Development",
    family: "apify",
    scope: "home",
    when: "Tworzysz, debugujesz albo wdrażasz własnego Actora.",
    say: "Zbuduj Actora, który zbiera oferty z tej strony.",
    path: `${PLUGIN_DIR}/32913266/…/skills/apify-actor-development/SKILL.md`,
  },
  {
    id: "apify-actorization",
    title: "Actorization",
    family: "apify",
    scope: "home",
    when: "Istniejący skrypt albo CLI ma stać się Actorem na Apify.",
    say: "Zactorizuj ten projekt w Pythonie.",
    path: `${PLUGIN_DIR}/32913266/…/skills/apify-actorization/SKILL.md`,
  },
  {
    id: "apify-generate-output-schema",
    title: "Generate Output Schema",
    family: "apify",
    scope: "home",
    when: "Actor potrzebuje dataset_schema i output_schema do Console.",
    say: "Wygeneruj output schema z kodu Actora.",
    path: `${PLUGIN_DIR}/32913266/…/skills/apify-generate-output-schema/SKILL.md`,
  },
  {
    id: "apify-sdk-integration",
    title: "SDK Integration",
    family: "apify",
    scope: "home",
    when: "Aplikacja JS/TS albo Python ma wołać Actors przez apify-client.",
    say: "Podłącz Apify do tej aplikacji.",
    path: `${PLUGIN_DIR}/32913266/…/skills/apify-sdk-integration/SKILL.md`,
  },
  {
    id: "canvas",
    title: "Canvas",
    family: "cursor",
    scope: "home",
    when: "Potrzebujesz trwałego artefaktu obok czatu: analiza, tabela, przegląd.",
    say: "Zrób canvas z podsumowaniem tych metryk.",
    path: `${CURSOR_DIR}/canvas/SKILL.md`,
  },
  {
    id: "env-setup",
    title: "Cloud Agent Environment Setup",
    family: "cursor",
    scope: "home",
    when: "Pytasz o środowisko Cloud Agenta, snapshot, build albo błąd setupu.",
    say: "Wyjaśnij, jak działa environment i co poprawić w konfiguracji.",
    path: `${CURSOR_DIR}/env-setup/SKILL.md`,
  },
  {
    id: "migrate-to-builds",
    title: "Migrate to Builds",
    family: "cursor",
    scope: "home",
    when: "Chcesz sprawdzić, czy środowisko zadziała na prebuilt builds.",
    say: "Sprawdź zgodność z environment builds.",
    path: `${CURSOR_DIR}/migrate-to-builds/SKILL.md`,
  },
  {
    id: "subscribe",
    title: "Subscribe to External Events",
    family: "cursor",
    scope: "home",
    when: "Agent ma czekać na CI, PR, Slack albo Linear zamiast pollować.",
    say: "Subskrybuj CI na tym branchu i wróć, gdy padnie.",
    path: `${CURSOR_DIR}/subscribe/SKILL.md`,
  },
  {
    id: "walkthrough-artifacts",
    title: "Walkthrough Artifacts",
    family: "cursor",
    scope: "home",
    when: "Po testach trzeba pokazać dowód: zrzut ekranu albo nagranie.",
    say: "Zrób walkthrough z nagraniem i zrzutami.",
    path: `${CURSOR_DIR}/walkthrough-artifacts/SKILL.md`,
  },
  {
    id: "docs-canvas",
    title: "Docs Canvas",
    family: "canvas",
    scope: "home",
    when: "Architektura, API reference albo how-to jako nawigowalny canvas.",
    say: "Zrób docs canvas z overview tej części kodu.",
    path: `${PLUGIN_DIR}/6306/…/skills/docs-canvas/SKILL.md`,
  },
  {
    id: "pr-review-canvas",
    title: "PR Review Canvas",
    family: "canvas",
    scope: "home",
    when: "Przegląd PR: ważne zmiany oddzielone od boilerplate.",
    say: "Zrób canvas z review tego PR.",
    path: `${PLUGIN_DIR}/6307/…/skills/pr-review-canvas/SKILL.md`,
  },
  {
    id: "x-api-mcp-guide",
    title: "X MCP Guide",
    family: "x",
    scope: "home",
    when: "Zawsze przed użyciem X MCP i przy każdym błędzie X.",
    say: "Sprawdź kredyty X i pokaż moje ostatnie posty.",
    path: `${PLUGIN_DIR}/49086599/…/skills/x-api-mcp-guide/SKILL.md`,
  },
];

const FAMILY_ORDER: FamilyId[] = [
  "workspace",
  "firecrawl",
  "airtable",
  "apify",
  "cursor",
  "canvas",
  "x",
];

type TourStep = {
  id: string;
  title: string;
  summary: string;
  family?: FamilyId;
  extraIds?: string[];
};

const TOUR: TourStep[] = [
  {
    id: "intro",
    title: "Czym jest skill",
    summary:
      "Skill to instrukcja, którą agent czyta przed pracą. Nie wywołujesz go jak narzędzia — piszesz intencję po ludzku, a agent sam sięga po pasujący plik SKILL.md.",
  },
  {
    id: "session",
    title: "Rytm sesji",
    summary:
      "Trzy skille spinają dzień pracy: Prime na starcie, Status w trakcie, End Session na końcu. Cała reszta wchodzi pomiędzy nimi.",
    extraIds: ["prime", "status", "end-session"],
  },
  {
    id: "workspace",
    title: "Skille projektu",
    summary:
      "Szesnaście skilli w katalogu skills/ tego repo: research, treść, UI, diagramy i fabryka integracji. To warstwa najbliżej Twojej roboty.",
    family: "workspace",
  },
  {
    id: "firecrawl",
    title: "Sieć: Firecrawl",
    summary:
      "Dziesięć skilli pluginu. Wybór zależy od kształtu zadania: pojedynczy URL, mapa witryny, crawl, JSON ze schematu, monitor albo lokalny plik.",
    family: "firecrawl",
  },
  {
    id: "airtable",
    title: "Airtable i ops",
    summary:
      "Najpierw model danych, potem CLI i filtry. Trzy skille opsowe scaffoldują całe workspace'y, a link i activity log zamykają pętlę kontroli.",
    family: "airtable",
  },
  {
    id: "apify-x",
    title: "Apify i X",
    summary:
      "Apify: gotowy scraping platform albo własne Actors. X: najpierw przewodnik, bo sprawdza kredyty i tłumaczy błędy — dopiero potem narzędzia.",
    extraIds: [
      "apify-ultimate-scraper",
      "apify-actor-development",
      "apify-actorization",
      "apify-generate-output-schema",
      "apify-sdk-integration",
      "x-api-mcp-guide",
    ],
  },
  {
    id: "cursor-cloud",
    title: "Cursor Cloud",
    summary:
      "Środowisko agenta, builds, subskrypcje zdarzeń, dowody testów i sam canvas. Te skille rządzą Cursorem, nie Twoim produktem.",
    family: "cursor",
  },
  {
    id: "docs",
    title: "Canvas dokumentacyjny",
    summary:
      "docs-canvas do architektury i API, pr-review-canvas do diffów. Ten przewodnik jest właśnie takim canvasem — otwierasz go obok czatu.",
    family: "canvas",
  },
];

/**
 * Local React state is the source of truth; the persisted canvas value is a
 * second layer on top. `useCanvasState` alone silently drops writes wherever
 * the host data bridge is absent, which would leave every control dead.
 */
function useDurableState<T>(key: string, initial: T): [T, (next: T) => void] {
  const [persisted, setPersisted] = useCanvasState<T>(key, initial);
  const [local, setLocal] = useState<T>(persisted);
  const lastWritten = useRef<T | null>(null);

  useEffect(() => {
    if (persisted !== lastWritten.current) setLocal(persisted);
  }, [persisted]);

  return [
    local,
    (next: T) => {
      lastWritten.current = next;
      setLocal(next);
      setPersisted(next);
    },
  ];
}

function skillsForStep(step: TourStep): Skill[] {
  if (step.family) return SKILLS.filter((s) => s.family === step.family);
  if (step.extraIds) {
    return step.extraIds
      .map((id) => SKILLS.find((s) => s.id === id))
      .filter((s): s is Skill => Boolean(s));
  }
  return [];
}

const GRAPH_LABELS: Record<string, string> = {
  zadanie: "Zadanie",
  sesja: "Prime / Status",
  siec: "Research / WWW",
  ops: "Airtable / Apify",
  ui: "Design / treść",
  cursor: "Cloud / canvas",
};

const NODE_W = 132;
const NODE_H = 36;

function SkillGraph() {
  const theme = useHostTheme();
  const layout = useMemo(
    () =>
      computeDAGLayout({
        direction: "horizontal",
        nodeWidth: NODE_W,
        nodeHeight: NODE_H,
        rankGap: 56,
        nodeGap: 18,
        padding: 12,
        nodes: Object.keys(GRAPH_LABELS).map((id) => ({ id })),
        edges: Object.keys(GRAPH_LABELS)
          .filter((id) => id !== "zadanie")
          .map((id) => ({ from: "zadanie", to: id })),
      }),
    [],
  );

  return (
    <svg
      width={layout.width}
      height={layout.height}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      style={{ maxWidth: "100%", height: "auto" }}
      role="img"
      aria-label="Mapa wyboru skilli: od zadania do rodziny"
    >
      {layout.edges.map((e) => (
        <line
          key={`${e.from}-${e.to}`}
          x1={e.sourceX}
          y1={e.sourceY}
          x2={e.targetX}
          y2={e.targetY}
          stroke={theme.stroke.secondary}
          strokeWidth={1}
        />
      ))}
      {layout.nodes.map((n) => {
        const isRoot = n.id === "zadanie";
        return (
          <g key={n.id}>
            <rect
              x={n.x}
              y={n.y}
              width={NODE_W}
              height={NODE_H}
              rx={6}
              fill={isRoot ? theme.accent.primary : theme.fill.tertiary}
              stroke={theme.stroke.tertiary}
            />
            <text
              x={n.x + NODE_W / 2}
              y={n.y + 23}
              textAnchor="middle"
              fontSize={11}
              fill={isRoot ? theme.text.onAccent : theme.text.primary}
            >
              {GRAPH_LABELS[n.id]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function SkillActions({ skill }: { skill: Skill }) {
  const dispatch = useCanvasAction();
  return (
    <Row gap={8} wrap>
      {skill.scope === "repo" ? (
        <Button
          variant="primary"
          onClick={() => dispatch({ type: "openFile", path: skill.path })}
        >
          Otwórz SKILL.md
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={() =>
            dispatch({
              type: "newComposerChat",
              userPrompt: `Przeczytaj skill ${skill.id} (${skill.path}) i streść, kiedy go używać.`,
            })
          }
        >
          Streść ten skill
        </Button>
      )}
      <Button
        variant="secondary"
        onClick={() =>
          dispatch({ type: "newComposerChat", userPrompt: skill.say })
        }
      >
        Spróbuj w czacie
      </Button>
    </Row>
  );
}

export default function SkillsWalkthrough() {
  const [stepIndex, setStepIndex] = useDurableState("tour-step", 0);
  const [selectedId, setSelectedId] = useDurableState("selected-skill", "prime");

  const safeIndex = Math.min(Math.max(stepIndex, 0), TOUR.length - 1);
  const step = TOUR[safeIndex];
  const selected = SKILLS.find((s) => s.id === selectedId) ?? SKILLS[0];
  const stepSkills = skillsForStep(step);

  const familyCounts = FAMILY_ORDER.map((id) => ({
    id,
    label: FAMILIES[id].label,
    short: FAMILIES[id].short,
    color: FAMILIES[id].color,
    value: SKILLS.filter((s) => s.family === id).length,
  }));
  const repoCount = SKILLS.filter((s) => s.scope === "repo").length;
  const homeCount = SKILLS.length - repoCount;

  const todos: TodoItem[] = TOUR.map((t, i) => {
    let status: TodoStatus = "pending";
    if (i < safeIndex) status = "completed";
    else if (i === safeIndex) status = "in_progress";
    return { id: t.id, content: t.title, status };
  });

  return (
    <Stack gap={24} style={{ maxWidth: 960 }}>
      <Stack gap={8}>
        <H1>Przewodnik po skillach</H1>
        <Text tone="secondary">
          {SKILLS.length} widocznych skilli: {repoCount} z katalogu{" "}
          <Code>skills/</Code> w tym repo i {homeCount} z Cursora oraz pluginów.
          Canvas zapamiętuje krok przewodnika między otwarciami.
        </Text>
        <Text size="small" tone="tertiary">
          Źródło: pliki SKILL.md w skills/, ~/.cursor/skills-cursor i
          ~/.cursor/plugins · stan z 6 września 2026
        </Text>
      </Stack>

      <Row gap={20} wrap>
        <Stat value={String(SKILLS.length)} label="Skille łącznie" />
        <Stat value={String(FAMILY_ORDER.length)} label="Rodziny" tone="info" />
        <Stat value={String(repoCount)} label="W repo" />
        <Stat value={String(homeCount)} label="Cursor i pluginy" tone="info" />
      </Row>

      <Callout tone="info" title="Jak agent używa skilli">
        Nie wybierasz skilla z menu. Piszesz intencję, agent czyta pasujący
        SKILL.md i dopiero wtedy działa. Ten canvas jest mapą, który plik
        powinien wejść do gry i kiedy.
      </Callout>

      <Grid columns={2} gap={20}>
        <Stack gap={8}>
          <H2>Udział rodzin</H2>
          <UsageBar
            total={SKILLS.length}
            topLeftLabel={`${SKILLS.length} skilli w ${FAMILY_ORDER.length} rodzinach`}
            topRightLabel="liczba plików, nie waga"
            segments={familyCounts.map((f) => ({
              id: f.id,
              value: f.value,
              color: f.color,
            }))}
          />
          <Row gap={10} wrap>
            {familyCounts.map((f) => (
              <Row key={f.id} gap={6} align="center">
                <Swatch color={f.color} />
                <Text size="small">
                  {f.label} ({f.value})
                </Text>
              </Row>
            ))}
          </Row>
        </Stack>
        <Stack gap={8}>
          <H2>Liczba skilli w rodzinie</H2>
          <BarChart
            categories={familyCounts.map((f) => f.short)}
            series={[
              { name: "Liczba skilli", data: familyCounts.map((f) => f.value) },
            ]}
            height={180}
          />
          <Text size="small" tone="tertiary">
            Oś X: rodzina skilli · oś Y: liczba plików SKILL.md
          </Text>
        </Stack>
      </Grid>

      <Stack gap={8}>
        <H2>Od zadania do rodziny</H2>
        <Text size="small" tone="secondary">
          Jedno wejście — zadanie — rozgałęzia się na pięć decyzji. Węzeł
          startowy jest w kolorze akcentu.
        </Text>
        <SkillGraph />
      </Stack>

      <Divider />

      <H2>Przewodnik krok po kroku</H2>
      <Text tone="secondary">
        Osiem przystanków. Lista po lewej skacze do dowolnego kroku, po prawej
        jest treść i skille tego etapu. Kliknij skill, żeby zobaczyć szczegóły
        pod spodem.
      </Text>

      <Grid columns="minmax(220px, 280px) 1fr" gap={20}>
        <Stack gap={12}>
          <TodoList
            todos={todos}
            onTodoClick={(todo) => {
              const i = TOUR.findIndex((t) => t.id === todo.id);
              if (i >= 0) setStepIndex(i);
            }}
          />
          <Row gap={8}>
            <Button
              variant="ghost"
              disabled={safeIndex <= 0}
              onClick={() => setStepIndex(Math.max(0, safeIndex - 1))}
            >
              Wstecz
            </Button>
            <Button
              variant="primary"
              disabled={safeIndex >= TOUR.length - 1}
              onClick={() =>
                setStepIndex(Math.min(TOUR.length - 1, safeIndex + 1))
              }
            >
              Dalej
            </Button>
          </Row>
        </Stack>

        <Stack gap={12}>
          <H3>
            {safeIndex + 1} / {TOUR.length} — {step.title}
          </H3>
          <Text>{step.summary}</Text>

          {step.id === "intro" ? (
            <Stack gap={8}>
              <Text>
                Widoczne skille to te dostarczone w tej sesji plus katalog repo.
                Serwery MCP (Gmail, Kit, Whop, Fathom, X, Kalendarz) to
                narzędzia, nie skille — X ma jednak obowiązkowy skill-przewodnik.
              </Text>
              <PieChart
                donut
                size={180}
                data={[
                  { label: "Repo", value: repoCount, tone: "info" },
                  { label: "Cursor i pluginy", value: homeCount, tone: "neutral" },
                ]}
              />
              <Text size="small" tone="tertiary">
                Podział {repoCount} do {homeCount} · suma w środku pierścienia
              </Text>
            </Stack>
          ) : null}

          {step.id === "firecrawl" ? (
            <Callout tone="warning" title="Nie mylić z transkryptami">
              YouTube, TikTok, Instagram, X i Facebook obsługuje{" "}
              <Code>supadata</Code>. Firecrawl jest do stron WWW, plików i
              crawli.
            </Callout>
          ) : null}

          {step.id === "apify-x" ? (
            <Callout tone="warning" title="X: najpierw kredyty">
              Przed pierwszym wywołaniem X przeczytaj{" "}
              <Code>x-api-mcp-guide</Code> i sprawdź{" "}
              <Code>get_usage_credits</Code>. Brak narzędzi to błąd setupu, nie
              paywall.
            </Callout>
          ) : null}

          {stepSkills.length > 0 ? (
            <Stack gap={6}>
              {stepSkills.map((s) => (
                <Row key={s.id} gap={8} align="center">
                  <Pill
                    active={s.id === selectedId}
                    size="sm"
                    onClick={() => setSelectedId(s.id)}
                  >
                    {s.id}
                  </Pill>
                  <Text size="small" tone="secondary" style={{ minWidth: 0 }}>
                    {s.when}
                  </Text>
                </Row>
              ))}
            </Stack>
          ) : null}
        </Stack>
      </Grid>

      <Card>
        <CardHeader
          trailing={<Pill size="sm">{FAMILIES[selected.family].label}</Pill>}
        >
          {selected.id}
        </CardHeader>
        <CardBody>
          <Stack gap={10}>
            <H3>{selected.title}</H3>
            <Text>
              <Text weight="semibold">Kiedy: </Text>
              {selected.when}
            </Text>
            <Text>
              <Text weight="semibold">Przykład: </Text>
              {selected.say}
            </Text>
            <Text size="small" tone="tertiary">
              {selected.path}
            </Text>
            <SkillActions skill={selected} />
          </Stack>
        </CardBody>
      </Card>

      <Divider />

      <H2>Katalog wszystkich skilli</H2>
      <Text tone="secondary">
        Rozwiń rodzinę i kliknij nazwę, żeby wczytać skill do karty powyżej.
      </Text>

      {FAMILY_ORDER.map((fid) => {
        const fam = FAMILIES[fid];
        const items = SKILLS.filter((s) => s.family === fid);
        return (
          <CollapsibleSection
            key={fid}
            title={fam.label}
            count={items.length}
            leading={<Swatch color={fam.color} />}
            trailing={
              <Text size="small" tone="tertiary">
                {fam.source}
              </Text>
            }
            defaultOpen={fid === "workspace"}
          >
            <Table
              framed={false}
              striped
              headers={["Skill", "Kiedy użyć"]}
              rows={items.map((s) => [
                <Pill
                  key={s.id}
                  active={s.id === selectedId}
                  size="sm"
                  onClick={() => setSelectedId(s.id)}
                >
                  {s.id}
                </Pill>,
                s.when,
              ])}
            />
          </CollapsibleSection>
        );
      })}

      <Stack gap={8}>
        <H2>Szybki wybór</H2>
        <Text size="small" tone="tertiary">
          Tabela decyzji zbudowana z opisów SKILL.md
        </Text>
        <Table
          stickyHeader
          striped
          headers={["Chcę…", "Skill"]}
          rows={[
            ["Zacząć sesję", "prime"],
            ["Szybki stan projektu", "status"],
            ["Zamknąć dzień pracy", "end-session"],
            ["Pomyśleć strategicznie", "brainstorm"],
            ["Zbadać temat na wielu źródłach", "deep-research"],
            ["Publikacje i cytowania", "academic"],
            ["Jedną stronę WWW do markdown", "firecrawl-scrape"],
            ["Całą sekcję dokumentacji", "firecrawl-crawl"],
            ["Ustrukturyzowany JSON ze strony", "firecrawl-agent"],
            ["Transkrypt wideo lub social", "supadata"],
            ["Reddit bez klucza API", "reddit"],
            ["Leady z platform", "apify-ultimate-scraper"],
            ["Własnego Actora", "apify-actor-development"],
            ["CRM i pipeline", "sales-ops"],
            ["Roadmap i launch", "product-ops"],
            ["Kampanie i kalendarz treści", "marketing-ops"],
            ["UI bez generycznego stylu", "frontend-design + ui-ux-pro-max"],
            ["Diagram architektury", "diagram albo excalidraw"],
            ["Review PR jako canvas", "pr-review-canvas"],
            ["Czekać na CI zamiast pollować", "subscribe"],
            ["Dowód, że zmiana działa", "walkthrough-artifacts"],
            ["Nową integrację API", "new-capability"],
            ["Posty i search na X", "x-api-mcp-guide (najpierw)"],
          ]}
        />
      </Stack>

      <Row gap={8} align="center">
        <Spacer />
        <Text size="small" tone="quaternary">
          {SKILLS.length} skilli · krok przewodnika zapisuje się w sidecarze
          canvas
        </Text>
      </Row>
    </Stack>
  );
}
