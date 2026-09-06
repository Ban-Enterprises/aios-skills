# Canvases

Interaktywne canvasy Cursora dla tego repo.

## skills-walkthrough.canvas.tsx

Przewodnik po wszystkich skillach widocznych w sesji: 16 z katalogu `skills/`
tego repo plus skille Cursora i pluginów. Zawiera mapę rodzin, ośmiokrokowy
tour z zapisywanym postępem, kartę wybranego skilla i tabelę decyzyjną.

### Instalacja

Cursor wykrywa canvasy tylko w `~/.cursor/projects/<workspace>/canvases/`,
więc plik trzeba tam skopiować:

```bash
./canvases/install.sh
```

Skrypt zgaduje nazwę workspace'u z nazwy katalogu repo i wypisuje listę
dostępnych projektów. Jeśli trafił źle, podaj nazwę ręcznie:

```bash
./canvases/install.sh moj-workspace
```

Potem otwórz plik `skills-walkthrough.canvas.tsx` z tego katalogu w Cursorze.

### Ścieżki w przyciskach

Skille z repo otwierają się wprost (`openFile` na ścieżce względnej wobec
workspace'u). Skille z `~/.cursor` mają ścieżkę zależną od maszyny i wersji
pluginu, więc zamiast otwierania pliku canvas zleca agentowi streszczenie
skilla w nowym czacie.
