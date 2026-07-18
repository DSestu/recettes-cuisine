# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "marimo>=0.23.3",
#     "plotly[express]>=6.9.0",
#     "polars>=1.42.1",
# ]
# ///

import marimo

__generated_with = "0.23.9"
app = marimo.App(width="full", auto_download=["ipynb", "html"])


@app.cell
def _():
    from pathlib import Path
    import re
    import yaml
    import polars as pl
    ROOT = Path("..").resolve()
    return Path, ROOT, pl, re, yaml


@app.cell
def _(ROOT, yaml):
    with open(ROOT / "_data/seasonality.yml", "r") as _f:
        seasonality = yaml.safe_load(_f)
    return (seasonality,)


@app.cell
def _(ROOT, yaml):
    with open(ROOT / "_data/recipe_tags.yml", "r") as _f:
        tag_registry = yaml.safe_load(_f)
    ingredient_tags = {e["id"] for e in tag_registry if e.get("ingredient")}
    return (ingredient_tags,)


@app.cell
def _(Path, re, yaml):
    FM_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)

    def load_frontmatter(path: Path) -> dict:
        text = path.read_text(encoding="utf-8")
        m = FM_RE.match(text)
        if not m:
            return {}
        return yaml.safe_load(m.group(1)) or {}

    return (load_frontmatter,)


@app.cell
def _(ROOT, ingredient_tags, load_frontmatter):
    def flatten_ingredients(raw) -> list[str]:
        if raw is None:
            return []
        if isinstance(raw, list):
            out = []
            for item in raw:
                out.extend(flatten_ingredients(item))
            return out
        if isinstance(raw, dict):
            out = []
            for v in raw.values():
                out.extend(flatten_ingredients(v))
            return out
        return [str(raw)]

    recipes = []
    for md in sorted((ROOT / "_recipes").glob("*.md")):
        fm = load_frontmatter(md)
        tags = fm.get("tags") or []
        recipes.append({
            "slug": md.stem,
            "title": fm.get("title", md.stem),
            "tags": tags,
            "ingredient_tags": [t for t in tags if t in ingredient_tags],
            "ingredients": flatten_ingredients(fm.get("ingredients")),
        })
    return (recipes,)


@app.cell
def _(pl, recipes):
    recipes_df = pl.DataFrame(
        recipes,
        schema={
            "slug": pl.Utf8,
            "title": pl.Utf8,
            "tags": pl.List(pl.Utf8),
            "ingredient_tags": pl.List(pl.Utf8),
            "ingredients": pl.List(pl.Utf8),
        },
    )
    recipe_ingredients_df = (
        recipes_df
        .select("slug", "title", "ingredient_tags")
        .explode("ingredient_tags")
        .rename({"ingredient_tags": "ingredient"})
        .drop_nulls("ingredient")
    )
    return (recipe_ingredients_df,)


@app.cell
def _(pl, seasonality):
    MONTHS = {
        "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
        "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12,
    }

    def parse_season(s: str):
        out = []
        if not s:
            return out
        for tok in s.split(","):
            tok = tok.strip()
            if not tok:
                continue
            fortnight, phase = tok.split(":")
            mon, half = fortnight.strip().split("-")
            m = MONTHS[mon.strip().lower()]
            h = int(half)
            out.append({
                "month": m,
                "half": h,
                "fortnight_idx": (m - 1) * 2 + (h - 1),
                "fortnight": f"{mon}-{h}",
                "phase": phase.strip(),
            })
        return out

    seasonality_df = pl.DataFrame(
        [
            {
                "id": e["id"],
                "category": e.get("category"),
                "fortnights": parse_season(e.get("season", "")),
            }
            for e in seasonality
        ],
        schema={
            "id": pl.Utf8,
            "category": pl.Utf8,
            "fortnights": pl.List(
                pl.Struct({
                    "month": pl.Int64,
                    "half": pl.Int64,
                    "fortnight_idx": pl.Int64,
                    "fortnight": pl.Utf8,
                    "phase": pl.Utf8,
                })
            ),
        },
    )

    seasonality_long_df = (
        seasonality_df
        .explode("fortnights")
        .unnest("fortnights")
        .drop_nulls("fortnight_idx")
    )
    return (seasonality_long_df,)


@app.cell
def _(recipe_ingredients_df, seasonality_long_df):
    recipe_ingredients_df, seasonality_long_df
    return


@app.cell
def _(seasonality_long_df):
    seasonality_long_df
    return


@app.cell
def _(pl, recipe_ingredients_df):
    _a = recipe_ingredients_df.rename({"slug": "slug_a", "title": "title_a"})
    _b = recipe_ingredients_df.rename({"slug": "slug_b", "title": "title_b"})

    pairs_df = (
        _a.join(_b, on="ingredient")
        .filter(pl.col("slug_a") < pl.col("slug_b"))
        .group_by("slug_a", "title_a", "slug_b", "title_b")
        .agg(
            shared=pl.col("ingredient").unique().sort(),
        )
        .with_columns(n_shared=pl.col("shared").list.len())
    )

    _counts = (
        recipe_ingredients_df
        .group_by("slug")
        .agg(ingredients=pl.col("ingredient").unique())
        .with_columns(n_ingredients=pl.col("ingredients").list.len())
    )

    recipe_pairs_df = (
        pairs_df
        .join(
            _counts.rename({
                "slug": "slug_a",
                "ingredients": "ingredients_a",
                "n_ingredients": "n_a",
            }),
            on="slug_a",
        )
        .join(
            _counts.rename({
                "slug": "slug_b",
                "ingredients": "ingredients_b",
                "n_ingredients": "n_b",
            }),
            on="slug_b",
        )
        .with_columns(
            only_a=pl.col("ingredients_a").list.set_difference(pl.col("ingredients_b")).list.sort(),
            only_b=pl.col("ingredients_b").list.set_difference(pl.col("ingredients_a")).list.sort(),
        )
        .with_columns(
            n_only_a=pl.col("only_a").list.len(),
            n_only_b=pl.col("only_b").list.len(),
            jaccard=pl.col("n_shared") / (pl.col("n_a") + pl.col("n_b") - pl.col("n_shared")),
        )
        .select(
            "slug_a", "title_a", "slug_b", "title_b",
            "n_shared", "shared",
            "n_only_a", "only_a",
            "n_only_b", "only_b",
            "n_a", "n_b", "jaccard",
        )
        .sort("jaccard", descending=True)
    )
    return (recipe_pairs_df,)


@app.cell
def _(recipe_pairs_df):
    recipe_pairs_df
    return


@app.cell
def _():
    OVERLAP_CATEGORIES = {"legume", "fruit", "champignon", "coquillage"}
    return (OVERLAP_CATEGORIES,)


@app.cell
def _(OVERLAP_CATEGORIES, pl, recipe_ingredients_df, seasonality_long_df):
    # Per recipe, for each fortnight, which seasonal ingredients are in season.
    # Restrict to categories that have meaningful temporal seasonality
    # (produce, mushrooms, shellfish) — exclude viande/poisson/fromage/herbe.
    seasonal_ingredients = (
        recipe_ingredients_df
        .join(
            seasonality_long_df
                .filter(pl.col("category").is_in(list(OVERLAP_CATEGORIES)))
                .select(
                    pl.col("id").alias("ingredient"),
                    "category", "fortnight_idx", "fortnight", "phase",
                ),
            on="ingredient",
            how="inner",
        )
    )

    recipe_fortnight_df = (
        seasonal_ingredients
        .group_by("slug", "title", "fortnight_idx", "fortnight")
        .agg(
            in_season=pl.col("ingredient").unique().sort(),
        )
        .with_columns(n_in_season=pl.col("in_season").list.len())
        .sort("slug", "fortnight_idx")
    )

    # Per recipe: how many seasonal ingredients total, and the fortnights where
    # ALL seasonal ingredients overlap simultaneously (temporal intersection).
    _totals = (
        seasonal_ingredients
        .group_by("slug", "title")
        .agg(
            all_seasonal=pl.col("ingredient").unique().sort(),
        )
        .with_columns(n_seasonal=pl.col("all_seasonal").list.len())
    )

    recipe_temporal_overlap_df = (
        recipe_fortnight_df
        .join(_totals, on=["slug", "title"])
        .with_columns(
            all_overlap=pl.col("n_in_season") == pl.col("n_seasonal"),
        )
        .group_by("slug", "title", "all_seasonal", "n_seasonal")
        .agg(
            overlap_fortnights=pl.col("fortnight")
                .filter(pl.col("all_overlap"))
                .sort(),
            per_fortnight=pl.struct("fortnight_idx", "fortnight", "in_season", "n_in_season"),
        )
        .with_columns(
            n_overlap_fortnights=pl.col("overlap_fortnights").list.len(),
            has_full_overlap=pl.col("overlap_fortnights").list.len() > 0,
        )
        .sort("has_full_overlap", "n_overlap_fortnights", descending=[False, True])
    )
    return recipe_fortnight_df, recipe_temporal_overlap_df


@app.cell
def _(recipe_fortnight_df, recipe_temporal_overlap_df):
    recipe_fortnight_df, recipe_temporal_overlap_df
    return


@app.cell
def _():
    import plotly.graph_objects as go

    return (go,)


@app.cell
def _(go, pl, recipe_ingredients_df, seasonality_long_df):
    MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    PHASE_COLOR = {"start": "#f6c667", "peak": "#2f8f3f", "end": "#c8794d"}

    def plot_recipe_seasons(slug: str, title: str | None = None):
        ings = (
            recipe_ingredients_df.filter(pl.col("slug") == slug)
            .join(
                seasonality_long_df.select(
                    pl.col("id").alias("ingredient"),
                    "fortnight_idx", "phase",
                ),
                on="ingredient",
                how="left",
            )
            .sort("ingredient", "fortnight_idx")
        )

        seasonal_ings = sorted(
            ings.filter(pl.col("fortnight_idx").is_not_null())
                .get_column("ingredient").unique().to_list()
        )
        non_seasonal = sorted(
            set(
                recipe_ingredients_df.filter(pl.col("slug") == slug)
                .get_column("ingredient").to_list()
            ) - set(seasonal_ings)
        )
        y_order = seasonal_ings + non_seasonal
        y_idx = {ing: i for i, ing in enumerate(y_order)}

        # Compute intersection fortnights (all seasonal ings simultaneously).
        per_fortnight = (
            ings.filter(pl.col("fortnight_idx").is_not_null())
            .group_by("fortnight_idx")
            .agg(k=pl.col("ingredient").n_unique())
        )
        overlap_bins = (
            per_fortnight.filter(pl.col("k") == len(seasonal_ings))
            .get_column("fortnight_idx").to_list()
            if seasonal_ings else []
        )

        fig = go.Figure()
        # Shaded overlap columns
        for fi in overlap_bins:
            fig.add_vrect(
                x0=fi - 0.5, x1=fi + 0.5,
                fillcolor="#2f8f3f", opacity=0.12, layer="below", line_width=0,
            )

        # One dot per (ingredient, fortnight) coloured by phase
        pts = ings.filter(pl.col("fortnight_idx").is_not_null())
        for phase in ("start", "peak", "end"):
            sub = pts.filter(pl.col("phase") == phase)
            if sub.is_empty():
                continue
            fig.add_trace(go.Scatter(
                x=sub.get_column("fortnight_idx").to_list(),
                y=[y_idx[i] for i in sub.get_column("ingredient").to_list()],
                mode="markers",
                marker=dict(symbol="square", size=16, color=PHASE_COLOR[phase]),
                name=phase,
                hovertemplate="%{text}<extra></extra>",
                text=[f"{i} — {phase}" for i in sub.get_column("ingredient").to_list()],
            ))

        # Non-seasonal ingredients: greyed row
        for ing in non_seasonal:
            fig.add_shape(
                type="rect", x0=-0.5, x1=23.5,
                y0=y_idx[ing] - 0.4, y1=y_idx[ing] + 0.4,
                fillcolor="#eeeeee", line_width=0, layer="below",
            )

        fig.update_layout(
            title=title or slug,
            xaxis=dict(
                tickmode="array",
                tickvals=[m * 2 + 0.5 for m in range(12)],
                ticktext=MONTH_NAMES,
                range=[-0.5, 23.5],
                showgrid=False,
            ),
            yaxis=dict(
                tickmode="array",
                tickvals=list(range(len(y_order))),
                ticktext=y_order,
                autorange="reversed",
            ),
            height=90 + 28 * max(len(y_order), 1),
            margin=dict(l=140, r=20, t=50, b=40),
            plot_bgcolor="white",
        )
        return fig

    return (plot_recipe_seasons,)


@app.cell
def _(pl, recipe_temporal_overlap_df):
    # Pick example recipes for typical vs edge cases.
    _r = recipe_temporal_overlap_df.filter(pl.col("n_seasonal") >= 2)

    typical = (
        _r.filter(pl.col("has_full_overlap"))
          .sort("n_overlap_fortnights", descending=True)
          .head(1)
    )
    narrow = (
        _r.filter(pl.col("has_full_overlap"))
          .sort("n_overlap_fortnights")
          .head(1)
    )
    no_overlap = (
        _r.filter(~pl.col("has_full_overlap"))
          .sort("n_seasonal", descending=True)
          .head(1)
    )
    many_ings = _r.sort("n_seasonal", descending=True).head(1)

    examples = {
        "typical (wide overlap)": typical,
        "edge: narrow overlap (1 fortnight)": narrow,
        "edge: no simultaneous overlap": no_overlap,
        "edge: many seasonal ingredients": many_ings,
    }
    return (examples,)


@app.cell
def _(examples, plot_recipe_seasons):
    figs = {}
    for label, df in examples.items():
        if df.is_empty():
            continue
        row = df.row(0, named=True)
        figs[label] = plot_recipe_seasons(
            row["slug"], title=f"{label} — {row['title']}"
        )
    figs
    return


if __name__ == "__main__":
    app.run()
