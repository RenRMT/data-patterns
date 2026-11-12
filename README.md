# Data smells and patterns

A plain-language, tool-agnostic catalogue of 36 data smells and 16 data patterns, with examples for Excel, Power Query / Power BI and Databricks. Built with Jekyll for GitHub Pages and styled with the REN Data design system.

## Structure

| Path | What it holds |
| --- | --- |
| `_smells/` | One Markdown file per smell. Front matter: `title`, `plain`, `icon`, `category`, `order`, `symptom`, `aka`, `search`, `patterns` (slugs of the patterns that treat it) |
| `_patterns/` | One Markdown file per pattern. Front matter: `title`, `plain`, `icon`, `group`, `order`, `tier`, `guarantee`, `symptom`, `question` (self-assessment), `first_step`, `aka`, `search` |
| `_data/icons.yml` | One icon per smell and pattern: the inside of a 48 x 48 SVG, keyed by slug |
| `_data/smell_categories.yml`, `_data/pattern_groups.yml` | The five smell families and four pattern groups |
| `guides/`, `sources.md` | Supporting pages |
| `_layouts/item.html` | The shared page layout for smells and patterns |
| `assets/ren/` | Tokens and fonts copied unchanged from the `design-system` repo. Re-copy `tokens/*.css` and `fonts/` to update |
| `assets/css/main.css` | Site layout and components, built on those tokens |
| `notes/` | The original notes (excluded from the build) |

## Adding a smell or pattern

1. Add `_smells/<slug>.md` or `_patterns/<slug>.md` with the front matter above.
2. Add an icon under the same slug in `_data/icons.yml`. Classes: no class = outline, `f` = tinted fill, `d` = solid dot, `t` = text, `dash` = dashed line.
3. Wrap each stack example in `<div class="stack" data-stack="excel|powerbi|databricks" markdown="1">`.
4. Power Query code that contains double braces must be wrapped in `{% raw %}...{% endraw %}`, or Liquid will swallow it.

## Run locally

Needs Ruby. Then:

```
bundle install
bundle exec jekyll serve
```

and open http://localhost:4000/data-patterns/.

## Publish

1. Create a repository named `data-patterns` under the account that serves rendata.nl and push this folder to `main`.
2. Settings > Pages > Deploy from a branch > `main` / root.

The site then appears at https://rendata.nl/data-patterns/. If the repository gets another name, change `baseurl` in `_config.yml` to match.
