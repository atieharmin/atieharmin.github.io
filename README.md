# atieharmin.github.io

Personal site of Atieh Armin, served by GitHub Pages at https://atieharmin.github.io.

Plain HTML, CSS and JavaScript with no build step:

```
index.html                  all content
styles.css                  layout, typography, light/dark themes
script.js                   theme toggle, nav highlighting, the oscillator figure
pic.jpeg                    portrait
Candidacy Report.pdf        linked from Research and Education
Candidacy Presentation.pdf
```

## Editing

Everything you would normally update lives in `index.html`:

- **Now**: the two-line status under the intro in the hero
- **Current projects**: one `<li class="project">` per project; the status pill is the `<span class="status">`
- **Publications**: one `<li>` per paper inside `<ol class="pubs">`; numbering is automatic
- **Footer**: bump "Last updated" when you change something

Colors are CSS variables at the top of `styles.css`, with a dark set under `prefers-color-scheme: dark` and `[data-theme="dark"]`.

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Pushing to `main` redeploys the site within a minute or two.
