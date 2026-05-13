(function () {
  // Data injected by recherche.html via a Liquid-templated inline <script>.
  // See window.__RECHERCHE_DATA in recherche.html for the source of these values.
  var __D = window.__RECHERCHE_DATA || { HOME_CATEGORIES: [], RECIPES: [], INGREDIENT_TAG_IDS: [], BASE: "" };

  // -----------------------------
  // Catégories d'accueil (Jekyll)
  // -----------------------------
  const HOME_CATEGORIES = __D.HOME_CATEGORIES;

  // -----------------------------
  // Données générées côté Jekyll
  // -----------------------------
  const DATA = __D.RECIPES;

  // Ingredient tag ids from registry (for "J'ai ces ingrédients" mode)
  const INGREDIENT_TAG_IDS = new Set(__D.INGREDIENT_TAG_IDS.map(function (id) {
    return String(id).toLowerCase().trim();
  }));

  // -----------------------------
  // Normalisation & Indexation
  // -----------------------------
  const FRENCH_STOPWORDS = new Set([
    'de','du','des','la','le','les','et','ou','au','aux','à','d\'','l\'','en','sur','avec','sans','un','une','vos','mes','ses','nos','vos','ces','ce','cette','pour','par','dans',
    // mesures / quantités / adjectifs communs
    'g','gramme','grammes','kg','mg','ml','cl','l','litre','litres','cuillere','cuillère','cuilleres','cuillères','cac','cas','càs','càc','tasse','verre','pincee','pincée','tranche','tranches',
    'gros','grosses','grandes','grand','petit','petite','petites','petits','noix','poignee','poignée','morceaux','morceau','environ','environs','semi','epaisse','épaisse','fraiche','fraîche','fin','fins','fine','fines','bio','frais','fraichement','seche','sèche','sec','secs','degraines','degraines',
    // articles/liaisons courants
    'le','la','les','des','de','d','l','au','aux','du'
  ]);

  function normalizeBasic(s) {
    return String(s).toLowerCase()
      .normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .replace(/œ/g, 'oe')
      .replace(/[^a-z0-9\-\s']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // For title search (same as main page)
  function normalize(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function isSubsequence(query, text) {
    if (!query) return true;
    let i = 0, j = 0;
    while (i < query.length && j < text.length) {
      if (query[i] === text[j]) i++;
      j++;
    }
    return i === query.length;
  }

  function singularize(frWord) {
    let w = frWord;
    if (w.endsWith('es') && w.length > 4) return w.slice(0, -2);
    if (w.endsWith('s') && w.length > 3) return w.slice(0, -1);
    if (w.endsWith('x') && w.length > 3) return w.slice(0, -1);
    return w;
  }

  function levenshtein(a, b){
    const m = a.length, n = b.length;
    if (m === 0) return n; if (n === 0) return m;
    const dp = new Array(n + 1);
    for (let j = 0; j <= n; j++) dp[j] = j;
    for (let i = 1; i <= m; i++) {
      let prev = i - 1; // dp[i-1][j-1]
      dp[0] = i;
      for (let j = 1; j <= n; j++) {
        const temp = dp[j];
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[j] = Math.min(
          dp[j] + 1,      // deletion
          dp[j - 1] + 1,  // insertion
          prev + cost     // substitution
        );
        prev = temp;
      }
    }
    return dp[n];
  }

  function buildCanonicalMap(vocabulary) {
    const canonicalMap = new Map();
    const representatives = [];
    function toCandidate(t){
      return singularize(normalizeBasic(t));
    }
    const tokens = Array.from(vocabulary).map(toCandidate).filter(t => t && !FRENCH_STOPWORDS.has(t));
    for (const tok of tokens) {
      let best = null, bestDist = Infinity;
      for (const rep of representatives) {
        const dist = levenshtein(tok, rep);
        const thr = rep.length <= 4 ? 1 : (rep.length <= 7 ? 2 : 3);
        if (dist < bestDist && dist <= thr) { bestDist = dist; best = rep; }
      }
      if (best) canonicalMap.set(tok, best); else { representatives.push(tok); canonicalMap.set(tok, tok); }
    }
    return { canonicalMap, representatives: new Set(representatives) };
  }

  function tokenizeIngredient(line) {
    if (!line) return [];
    const tokens = normalizeBasic(String(line))
      .replace(/\d+[\w\s\/.,-]*/g, ' ') // retire quantités simples
      .split(/\s+/)
      .map(t => singularize(t))
      .filter(t => t.length > 2 && !FRENCH_STOPWORDS.has(t));
    return Array.from(new Set(tokens));
  }

  const BASE = __D.BASE;

  function normalizePath(p) {
    if (!p) return null;
    if (p.startsWith('http')) return p;
    if (p.startsWith(BASE)) return p;
    if (p.startsWith('/')) return `${BASE}${p}`;
    if (p.startsWith('images/')) return `${BASE}/${p}`;
    if (p.startsWith('/images/')) return `${BASE}${p}`;
    return `${BASE}/images/${p}`;
  }

  function resolveImageUrl(imageField) {
    try {
      if (Array.isArray(imageField) && imageField.length > 0) {
        const first = String(imageField[0]).trim();
        const norm = normalizePath(first);
        if (norm) return norm;
      }
      if (typeof imageField === 'string' && imageField.trim().length > 0) {
        const norm = normalizePath(imageField.trim());
        if (norm) return norm;
      }
    } catch (_) {}
    return `${BASE}/assets/social.png`;
  }

  function resolveCardImageUrl(imageField) {
    try {
      let filename = null;
      if (Array.isArray(imageField) && imageField.length > 0) {
        filename = String(imageField[0]).trim();
      } else if (typeof imageField === 'string' && imageField.trim().length > 0) {
        filename = imageField.trim();
      }
      if (filename) {
        const basename = filename.replace(/^.*[/\\]/, '');
        return `${BASE}/images/cards/${basename}`;
      }
    } catch (_) {}
    return `${BASE}/assets/social.png`;
  }

  const ITEMS = DATA.map(item => {
    const tokens = new Set((item.ingredients_lines || []).flatMap(tokenizeIngredient));
    const textBlob = [item.title, ...(item.ingredients_lines || [])].join(' ').toLowerCase();
    const image = resolveCardImageUrl(item.image_field);
    // also create a mutable ctokens placeholder that we will fill after canonical map is built
    return { ...item, image, tokens, ctokens: new Set(), textBlob };
  });

  // Build canonical vocabulary from all items and attach canonical tokens per item
  const VOCAB = new Set();
  for (const it of ITEMS) { for (const t of it.tokens) VOCAB.add(t); }
  const { canonicalMap: TOKEN_TO_CANON } = buildCanonicalMap(VOCAB);
  function toCanonical(t){
    const cand = singularize(normalizeBasic(t));
    return TOKEN_TO_CANON.get(cand) || cand;
  }
  for (const it of ITEMS) {
    it.ctokens.clear();
    for (const t of it.tokens) it.ctokens.add(toCanonical(t));
  }

  const ALL_TOKENS = new Map();
  const ALL_TAGS = new Map();
  for (const it of ITEMS) {
    for (const t of it.ctokens) ALL_TOKENS.set(t, (ALL_TOKENS.get(t) || 0) + 1);
    // Count explicit tags
    for (const tag of (it.tags || [])) {
      const clean = String(tag).trim();
      if (!clean) continue;
      ALL_TAGS.set(clean, (ALL_TAGS.get(clean) || 0) + 1);
    }
    // Fallback for components without tags: index their ingredient tokens as tags
    if (it.type === 'component' && (!it.tags || (Array.isArray(it.tags) && it.tags.length === 0))) {
      for (const t of it.ctokens) ALL_TAGS.set(t, (ALL_TAGS.get(t) || 0) + 1);
    }
  }

  // -----------------------------
  // categoryIds per item (from HOME_CATEGORIES)
  // -----------------------------
  const BASES_ID = 'bases';
  const othersCat = (HOME_CATEGORIES || []).find(c => c.mode === 'other');
  for (const it of ITEMS) {
    const tags = new Set((it.tags || []).map(String));
    const categoryIds = [];
    for (const cat of HOME_CATEGORIES || []) {
      if (cat.mode === 'other') continue;
      if ((cat.tags || []).some(t => tags.has(String(t)))) categoryIds.push(cat.id);
    }
    if (it.type === 'component' && categoryIds.indexOf(BASES_ID) === -1) {
      const hasBases = (HOME_CATEGORIES || []).some(c => c.id === BASES_ID);
      if (hasBases) categoryIds.push(BASES_ID);
    }
    if (categoryIds.length === 0 && othersCat) categoryIds.push(othersCat.id);
    it.categoryIds = categoryIds;
  }

  // Ingredient tags per item (subset of tags that are in INGREDIENT_TAG_IDS)
  for (const it of ITEMS) {
    it.ingredientTags = (it.tags || []).filter(function(t) {
      return INGREDIENT_TAG_IDS.has(String(t).toLowerCase().trim());
    });
  }

  // -----------------------------
  // Etat UI
  // -----------------------------
  const state = {
    includeComponents: true,
    missingTolerance: 0,
    infiniteTolerance: false,
    mode: 'tag', // 'tag' | 'what_i_have'
    query: '',
    titleQuery: '',
    activeCategoryIds: new Set(),
    selectedTags: new Set(),
  };

  // -----------------------------
  // Helpers UI
  // -----------------------------
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  function chip(label, onRemove) {
    const span = document.createElement('span');
    span.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-200 text-primary text-sm';
    span.textContent = label;
    // Allow removing by clicking anywhere on the chip
    span.addEventListener('click', onRemove);
    const btn = document.createElement('button');
    btn.innerHTML = '&times;';
    btn.className = 'ml-1 hover:opacity-70';
    // Keep the small cross; prevent double triggering by stopping propagation
    btn.addEventListener('click', (e)=>{ e.stopPropagation(); onRemove(); });
    span.appendChild(btn);
    return span;
  }

  function pill(label, onClick, active=false) {
    const span = document.createElement('button');
    span.className = `px-3 py-1 rounded-full border text-sm ${active ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-primary hover:bg-red-50'}`;
    span.textContent = label;
    span.addEventListener('click', onClick);
    return span;
  }

  function autocompleteItem(text, onClick) {
    const btn = document.createElement('button');
    btn.className = 'w-full text-left px-3 py-2 hover:bg-red-50';
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    return btn;
  }

  // -----------------------------
  // Rendu des suggestions (Top 20)
  // -----------------------------
  function renderSuggestions(items) {
    // Tag suggestions: compute counts across CURRENT filtered items
    const baseItems = Array.isArray(items) ? items : getFiltered();
    const tagCount = new Map();
    const onlyIngredientTags = (state.mode === 'what_i_have');
    for (const it of baseItems) {
      const tagsToCount = onlyIngredientTags ? (it.ingredientTags || []) : (it.tags || []);
      for (const tg of tagsToCount) tagCount.set(String(tg), (tagCount.get(String(tg))||0)+1);
    }
    // Exclude already selected
    for (const sel of state.selectedTags) tagCount.delete(sel);
    // Compute muted keys based on hide-top slider; do not mute selected tags
    const hideTop = Number(document.getElementById('hide-top-ingredients').value || 0);
    const sortedByGlobal = Array.from(tagCount.entries()).sort((a,b)=>{
      if (a[1] !== b[1]) return a[1]-b[1];
      return String(a[0]).localeCompare(String(b[0]), 'fr', { sensitivity: 'base' });
    });
    window.__hiddenTopBlacklist = window.__hiddenTopBlacklist || new Set();
    const selectedTagSet = new Set(state.selectedTags || []);
    const mutedKeys = new Set(sortedByGlobal
      .slice(0, hideTop)
      .map(([k])=>k)
      .filter(k => !window.__hiddenTopBlacklist.has(k))
      .filter(k => !selectedTagSet.has(String(k)))
    );
    // Sort by count desc, then alpha asc (fr locale), take top 20
    const sorted = Array.from(tagCount.entries())
      .sort((a,b)=>{
        if (b[1] !== a[1]) return b[1]-a[1];
        return String(a[0]).localeCompare(String(b[0]), 'fr', { sensitivity: 'base' });
      })
      .slice(0,20);

    const maxVal = sorted.length ? sorted[0][1] : 1;
    // Inverted gradient relative to charts: red (low) -> orange -> green (high)
    const colorScale = d3.scaleLinear()
      .domain([0, maxVal*0.4, maxVal])
      .range(['#F53200', '#f97316', '#22c55e']);

    const tagC = $('#tag-suggestions');
    if (tagC) {
      tagC.innerHTML = '';
      for (const [tg, cnt] of sorted) {
        const btn = pill(tg, ()=>{ state.selectedTags.add(tg); updateSelectedChips(); refresh(); });
        // Wrap to add colored bubble count
        const wrap = document.createElement('span');
        wrap.className = 'tag-sugg';
        // Color the pill border/text according to count
        const color = colorScale(cnt);
        btn.classList.add('sugg-pill');
        btn.style.borderWidth = '2px';
        btn.style.borderColor = '#ffffff';
        btn.style.color = '#ffffff';
        btn.style.background = color;
        btn.style.boxShadow = '0 6px 14px rgba(0,0,0,0.10)';
        if (mutedKeys.has(tg)) {
          btn.style.background = '#e5e7eb';
          btn.style.color = '#6b7280';
          btn.style.boxShadow = 'none';
        }
        // Count tooltip bubble
        const tip = document.createElement('span');
        tip.className = 'count-tip';
        tip.textContent = String(cnt);
        tip.style.background = mutedKeys.has(tg) ? '#9ca3af' : color;
        tip.title = `${cnt} occurrence${cnt>1?'s':''}`;
        wrap.appendChild(btn);
        wrap.appendChild(tip);
        tagC.appendChild(wrap);
      }
    }
    // Store muted keys globally so bar charts can adopt same muting
    window.__mutedKeys = mutedKeys;
  }

  function updateSelectedChips() {
    const tagSel = $('#selected-tags');
    tagSel.innerHTML = '';
    // Add clear button at the beginning when there are selected tags
    if (state.selectedTags.size > 0 && tagSel) {
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.title = 'Effacer les tags';
      clearBtn.ariaLabel = 'Effacer les tags';
      clearBtn.className = 'inline-flex items-center justify-center w-8 h-8 rounded-full border border-primary text-white bg-primary shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40 relative z-20';
      clearBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4"><path d="M6 6l12 12M18 6l-12 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      clearBtn.addEventListener('click', ()=>{
        state.selectedTags.clear();
        updateSelectedChips();
        if (typeof refresh === 'function') refresh();
        if (typeof pushControlsToUrl === 'function') pushControlsToUrl();
      });
      const spacer = document.createElement('span');
      spacer.className = 'w-2';
      tagSel.appendChild(clearBtn);
      tagSel.appendChild(spacer);
    }
    for (const t of state.selectedTags) {
      tagSel.appendChild(chip(t, ()=>{ state.selectedTags.delete(t); updateSelectedChips(); refresh(); }));
    }
    // Keep fullscreen overlay tags in sync
    if (window.__renderFsTags) {
      try { window.__renderFsTags(); } catch (_) {}
    }
    // Sync selected tags/tokens to URL so navigation back restores selections
    if (window.pushControlsToUrl) {
      try { window.pushControlsToUrl(); } catch (_) {}
    }
    if (window.syncMobileAccordionUI) { try { window.syncMobileAccordionUI(); } catch (_) {} }
  }

  // -----------------------------
  // Filtrage
  // -----------------------------
  function itemMatches(it) {
    if (!state.includeComponents && it.type !== 'recipe') return false;
    var sectionEnabled = (typeof window.isMobileSectionEnabled === 'function') ? window.isMobileSectionEnabled : function() { return true; };
    // Category filter (multi-select: item must match at least one selected category) — only when section enabled on mobile
    if (sectionEnabled('categories') && state.activeCategoryIds && state.activeCategoryIds.size > 0) {
      const catIds = it.categoryIds || [];
      const hasMatch = Array.from(state.activeCategoryIds).some(id => catIds.indexOf(id) !== -1);
      if (!hasMatch) return false;
    }
    // Title search: each word of query must match — only when section enabled on mobile
    if (sectionEnabled('name') && state.titleQuery) {
      const q = normalize(state.titleQuery);
      const words = q.split(' ').filter(Boolean);
      const normTitle = normalize(it.title || '');
      for (const w of words) {
        if (normTitle.includes(w)) continue;
        if (!isSubsequence(w, normTitle)) return false;
      }
    }
    // Tag/what_i_have filter — only when tags section enabled on mobile
    if (!sectionEnabled('tags')) return true;
    if (state.mode === 'what_i_have') {
      return true;
    }
    if (state.mode === 'tag') {
      if (!state.infiniteTolerance) {
        let missing = 0;
        const itTags = new Set((it.tags || []).map(s=>String(s).trim().toLowerCase()));
        for (const tg of state.selectedTags) if (!itTags.has(String(tg).toLowerCase())) missing += 1;
        if (missing > state.missingTolerance) return false;
      }
    }
    return true;
  }

  function getFiltered() {
    const filtered = ITEMS.filter(itemMatches);
    var sectionEnabled = (typeof window.isMobileSectionEnabled === 'function') ? window.isMobileSectionEnabled : function() { return true; };
    if (!sectionEnabled('name') && !sectionEnabled('categories') && !sectionEnabled('tags')) {
      return filtered;
    }
    if (sectionEnabled('tags') && state.mode === 'what_i_have') {
      const sel = new Set(Array.from(state.selectedTags).map(s => String(s).toLowerCase().trim()));
      filtered.sort((a, b) => {
        const ingA = a.ingredientTags || [];
        const ingB = b.ingredientTags || [];
        const totalA = ingA.length;
        const totalB = ingB.length;
        const missA = ingA.filter(function(t) { return !sel.has(String(t).toLowerCase().trim()); }).length;
        const missB = ingB.filter(function(t) { return !sel.has(String(t).toLowerCase().trim()); }).length;
        const pctA = totalA === 0 ? 100 : Math.round(((totalA - missA) / totalA) * 100);
        const pctB = totalB === 0 ? 100 : Math.round(((totalB - missB) / totalB) * 100);
        if (pctA !== pctB) return pctB - pctA;
        return String(a.title).localeCompare(String(b.title));
      });
      return filtered;
    }
    if (sectionEnabled('tags')) {
      const sel = Array.from(state.selectedTags).map(s=>String(s).toLowerCase());
      if (sel.length > 0 && (state.infiniteTolerance || state.missingTolerance > 0)) {
        filtered.sort((a, b) => {
          const tagsA = new Set((a.tags || []).map(x=>String(x).toLowerCase().trim()));
          const tagsB = new Set((b.tags || []).map(x=>String(x).toLowerCase().trim()));
          const ma = sel.reduce((acc, t) => acc + (tagsA.has(t) ? 1 : 0), 0);
          const mb = sel.reduce((acc, t) => acc + (tagsB.has(t) ? 1 : 0), 0);
          if (mb !== ma) return mb - ma;
          return String(a.title).localeCompare(String(b.title));
        });
      }
    }
    return filtered;
  }

  // -----------------------------
  // Résultats
  // -----------------------------
  function renderResults(items) {
    $('#result-count').textContent = items.length;
    const grid = $('#results-grid');
    grid.innerHTML = '';
    var sectionEnabled = (typeof window.isMobileSectionEnabled === 'function') ? window.isMobileSectionEnabled : function() { return true; };
    const selectedTagsLower = new Set(Array.from(state.selectedTags, s => String(s).toLowerCase().trim()));
    const selectedCount = selectedTagsLower.size;
    const tagsFilterActiveForDisplay = sectionEnabled('tags') && selectedCount > 0;
    const isWhatIHave = (state.mode === 'what_i_have');
    for (const it of items) {
      const itemIngTags = (isWhatIHave ? (it.ingredientTags || []) : (it.tags || [])).map(x => String(x).toLowerCase().trim());
      const itemTagSet = new Set(itemIngTags);
      let overlap = 0;
      let badgeColor = '';
      let badgeText = '';
      if (selectedCount > 0) {
        if (isWhatIHave) {
          for (const tg of selectedTagsLower) if (itemTagSet.has(tg)) overlap += 1;
          const totalIng = itemIngTags.length;
          const missingCount = totalIng - overlap;
          const pct = totalIng === 0 ? 100 : Math.round((overlap / totalIng) * 100);
          badgeText = pct + '%';
          if (pct >= 100) badgeColor = '#22c55e';
          else if (pct >= 50) badgeColor = '#f97316';
          else badgeColor = '#F53200';
        } else {
          const itemTags = new Set((it.tags || []).map(x => String(x).toLowerCase().trim()));
          for (const tg of selectedTagsLower) if (itemTags.has(tg)) overlap += 1;
          badgeText = overlap + '/' + selectedCount;
          if (overlap === 0) badgeColor = '#F53200';
          else if (overlap === selectedCount) badgeColor = '#22c55e';
          else badgeColor = '#f97316';
        }
      }

      const a = document.createElement('a');
      a.href = it.url;
      a.className = 'recipe relative md:hover:scale-105 md:hover:rotate-1 transition';
      a.style.position = 'relative';
      a.style.zIndex = 'auto';

      const outlineStyle = tagsFilterActiveForDisplay ? `outline:2px solid ${badgeColor}; outline-offset: 0px;` : '';
      const badgeHtml = tagsFilterActiveForDisplay
        ? `<span class="overlap-badge absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-xs font-bold text-white border-2 border-white" style="background:${badgeColor}">${badgeText}</span>`
        : '';

      a.innerHTML = `
        ${badgeHtml}
        <canvas class="aspect-video w-full rounded-xl bg-gray-100 mb-1 bg-cover bg-center" style="${outlineStyle}background-image:url('${encodeURI(it.image)}');"></canvas>
        <h1 class="font-semibold leading-tight">${window.escapeHtml(it.title)}</h1>
      `;
      // Attach fancy tooltip with present/missing tags when tolerance is active or in "what I have" mode
      const showTooltip = tagsFilterActiveForDisplay && (isWhatIHave || state.infiniteTolerance || state.missingTolerance > 0);
      if (showTooltip) {
        const presentTags = [];
        const missingTags = [];
        if (isWhatIHave) {
          for (const tg of (it.ingredientTags || [])) {
            const t = String(tg).toLowerCase().trim();
            if (selectedTagsLower.has(t)) presentTags.push(tg); else missingTags.push(tg);
          }
        } else {
          const itemTags = new Set((it.tags || []).map(x => String(x).toLowerCase().trim()));
          for (const tg of selectedTagsLower) {
            if (itemTags.has(tg)) presentTags.push(tg); else missingTags.push(tg);
          }
        }
        const tip = document.createElement('div');
        tip.className = 'result-tooltip';
        const chipsHtml = (arr, cls) => arr.map(t => `<span class="tag-chip ${cls}">${window.escapeHtml(t)}</span>`).join('');
        const missingCountTip = isWhatIHave ? (itemIngTags.length - presentTags.length) : 0;
        const pctTip = isWhatIHave && itemIngTags.length > 0 ? Math.round((presentTags.length / itemIngTags.length) * 100) : 0;
        const summaryLine = isWhatIHave
          ? `<p class="text-sm font-semibold mb-2">${pctTip}% - <i>${missingCountTip === 0 ? '0 manquant' : (missingCountTip === 1 ? '1 manquant' : missingCountTip + ' manquants')}</i></p>`
          : '';
        tip.innerHTML = isWhatIHave
          ? summaryLine + `<h5>Ingrédients que vous avez</h5><div class="chips">${chipsHtml(presentTags, 'present')}</div><h5>Ingrédients manquants</h5><div class="chips">${chipsHtml(missingTags, 'missing')}</div>`
          : `<h5>Tags présents</h5><div class="chips">${chipsHtml(presentTags, 'present')}</div><h5>Tags manquants</h5><div class="chips">${chipsHtml(missingTags, 'missing')}</div>`;
        a.appendChild(tip);
        // Clicking a present chip removes that tag from the selection; clicking a missing chip adds it.
        tip.addEventListener('click', (e) => {
          const chip = e.target && e.target.closest ? e.target.closest('.tag-chip') : null;
          if (!chip) return;
          if (!(chip.classList.contains('missing') || chip.classList.contains('present'))) return;
          e.preventDefault();
          e.stopPropagation();
          const label = (chip.textContent || '').trim();
          if (!label) return;
          if (chip.classList.contains('missing')) {
            state.selectedTags.add(label);
          } else {
            // Remove matching tag from state.selectedTags (case-insensitive)
            const toRemove = [];
            for (const t of state.selectedTags) {
              if (String(t).toLowerCase().trim() === label.toLowerCase().trim()) toRemove.push(t);
            }
            for (const t of toRemove) state.selectedTags.delete(t);
          }
          if (typeof updateSelectedChips === 'function') updateSelectedChips();
          if (typeof refresh === 'function') refresh();
          if (typeof pushControlsToUrl === 'function') pushControlsToUrl();
        });
        const badgeEl = a.querySelector('.overlap-badge');
        let hideTimer = null;
        function showTip(){
          clearTimeout(hideTimer);
          tip.classList.add('visible');
        }
        function hideTipSoon(){
          clearTimeout(hideTimer);
          hideTimer = setTimeout(() => { tip.classList.remove('visible'); }, 120);
        }
        const openTip = () => { a.classList.add('tooltip-open'); a.style.zIndex = '100'; showTip(); };
        const closeTipSoon = () => { hideTipSoon(); setTimeout(() => { a.classList.remove('tooltip-open'); a.style.zIndex = 'auto'; }, 200); };
        if (badgeEl) {
          badgeEl.addEventListener('mouseenter', openTip);
          badgeEl.addEventListener('mouseleave', closeTipSoon);
          badgeEl.addEventListener('focus', openTip);
          badgeEl.addEventListener('blur', closeTipSoon);
        }
        // Show on whole card hover as well
        a.addEventListener('mouseenter', openTip);
        a.addEventListener('mouseleave', closeTipSoon);
        // Keep tooltip open if hovered; close smoothly when leaving
        tip.addEventListener('mouseenter', openTip);
        tip.addEventListener('mouseleave', closeTipSoon);
      }

      grid.appendChild(a);
    }
  }

  // -----------------------------
  // Recommendations (simple TF count overlap on tags/ingredients)
  // -----------------------------
  function renderRecommendations(baseItems) {
    try {
      const host = document.getElementById('reco-section');
      const grid = document.getElementById('reco-grid');
      if (!host || !grid) return;
      const selectedTags = Array.from(state.selectedTags || []);
      const hasFilters = selectedTags.length > 0;
      // Build a candidate pool (include components if enabled)
      const pool = ITEMS.filter(it => (state.includeComponents || it.type === 'recipe'));
      // Score by overlap with selected tags/tokens
      function score(it){
        let s = 0;
        if (selectedTags.length) {
          const tags = new Set((it.tags || []).map(x=>String(x)));
          for (const t of selectedTags) if (tags.has(t)) s += 1;
        }
        return s;
      }
      const ranked = pool
        .map(it => ({ it, s: score(it) }))
        .filter(x => x.s > 0)
        .sort((a,b)=> b.s - a.s || String(a.it.title).localeCompare(String(b.it.title)) )
        .slice(0, 6)
        .map(x => x.it);
      if (!hasFilters || ranked.length === 0) {
        host.classList.add('hidden');
        grid.innerHTML = '';
        return;
      }
      host.classList.remove('hidden');
      grid.innerHTML = '';
      for (const it of ranked) {
        const a = document.createElement('a');
        a.href = it.url;
        a.className = 'recipe relative md:hover:scale-105 md:hover:rotate-1 transition';
        a.innerHTML = `
          <canvas class="aspect-video w-full rounded-xl bg-gray-100 mb-1 bg-cover bg-center" style="background-image:url('${encodeURI(it.image)}');"></canvas>
          <h1 class="font-semibold leading-tight">${window.escapeHtml(it.title)}</h1>
        `;
        grid.appendChild(a);
      }
    } catch (_) {}
  }

  // -----------------------------
  // Dataviz (bar charts)
  // -----------------------------
  function renderBarChart(svgSel, data, onClick, activeSet = new Set()) {
    // Allow muted keys to be passed via global or optional param (backward compat)
    const maybeArgs = arguments;
    const mutedSet = maybeArgs.length >= 5 ? (maybeArgs[4] || new Set()) : (window.__mutedKeys || new Set());
    const svg = d3.select(svgSel);
    svg.selectAll('*').remove();
    const width = svg.node().clientWidth || 300;
    const height = svg.node().clientHeight || 360;
    const margin = {top: 10, right: 10, bottom: 0, left: 120};
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const g = svg.attr('viewBox', `0 0 ${width} ${height}`).append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, d3.max(data, d=>d.value)||1]).nice().range([0, innerW]);
    const y = d3.scaleBand().domain(data.map(d=>d.key)).range([0, innerH]).padding(0.15);

    // Remove X axis for cleaner look
    // g.append('g').attr('transform', `translate(0,${innerH})`).call(d3.axisBottom(x).ticks(4));
    g.append('g').call(d3.axisLeft(y));

    // Gradient scale matching site palette (green -> primary orange -> red)
    const maxVal = d3.max(data, d=>d.value)||1;
    const color = d3.scaleLinear()
      .domain([0, maxVal*0.4, maxVal])
      .range(['#F53200', '#f97316', '#22c55e']);

    // Define a smooth red glow for selected bars
    let defs = svg.select('defs');
    if (defs.empty()) defs = svg.append('defs');
    if (defs.select('#selGlow').empty()) {
      const f = defs.append('filter').attr('id','selGlow');
      f.append('feDropShadow')
        .attr('dx', 0).attr('dy', 0)
        .attr('stdDeviation', 2)
        .attr('flood-color', '#F53200')
        .attr('flood-opacity', 0.6);
    }
    // Diagonal hatch pattern for selected bars
    if (defs.select('#diagHatch').empty()) {
      const p = defs.append('pattern')
        .attr('id', 'diagHatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 6)
        .attr('height', 6)
        .attr('patternTransform', 'rotate(45)');
      p.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', 0).attr('y2', 6)
        .attr('stroke', '#111')
        .attr('stroke-width', 0.5);
    }

    const bars = g.selectAll('rect.bar').data(data).enter().append('rect')
      .attr('class','bar')
      .attr('x', 0).attr('y', d=>y(d.key))
      .attr('height', y.bandwidth())
      .attr('width', d=>x(d.value))
      .attr('fill', d=> (mutedSet && mutedSet.has(d.key)) ? '#d1d5db' : color(d.value))
      .attr('opacity', d => (mutedSet && mutedSet.has(d.key)) ? 0.35 : (activeSet.has(d.key) ? 0.95 : 0.7))
      .style('cursor', 'pointer')
      .on('click', (_, d) => onClick(d.key));

    // Apply outline and subtle glow to selected bars
    bars
      .attr('stroke', d => activeSet.has(d.key) ? '#F53200' : 'none')
      .attr('stroke-width', d => activeSet.has(d.key) ? 2 : 0)
      .attr('filter', d => activeSet.has(d.key) ? 'url(#selGlow)' : null);

    // Overlay diagonal hatch only on selected bars
    g.selectAll('rect.hatch').data(data.filter(d=>activeSet.has(d.key)))
      .enter().append('rect')
        .attr('class','hatch pointer-events-none')
        .attr('x', 0).attr('y', d=>y(d.key))
        .attr('height', y.bandwidth())
        .attr('width', d=>x(d.value))
        .attr('fill', 'url(#diagHatch)')
        .attr('opacity', 0.25);

    // Value labels near origin on the right side (inside the chart area)
    g.selectAll('text.value').data(data).enter().append('text')
      .attr('class', 'value')
      .attr('x', 6)
      .attr('y', d=> (y(d.key) || 0) + y.bandwidth()/2 + 3)
      .attr('text-anchor', 'start')
      .attr('fill', '#ffffff')
      .attr('font-size', 11)
      .text(d=> d.value);
  }

  function updateCharts(items) {
    // Tags chart
    const tagCount = new Map();
    for (const it of items) {
      for (const tg of (it.tags || [])) tagCount.set(tg, (tagCount.get(tg)||0)+1);
    }
    const tagData = Array.from(tagCount.entries()).map(([key,value])=>({key,value})).sort((a,b)=>b.value-a.value).slice(0,20);
    renderBarChart('#tags-chart', tagData, (key)=>{ if (state.selectedTags.has(key)) state.selectedTags.delete(key); else state.selectedTags.add(key); updateSelectedChips(); refresh(); }, state.selectedTags);

    // Second chart: tag distribution (same as tags-chart but for the "ingredients-chart" panel)
    const tokCount = new Map();
    for (const it of items) for (const tg of (it.tags || [])) tokCount.set(String(tg), (tokCount.get(String(tg))||0)+1);
    const tokData = Array.from(tokCount.entries()).map(([key,value])=>({key,value})).sort((a,b)=>b.value-a.value).slice(0,20);
    renderBarChart('#ingredients-chart', tokData, (key)=>{ if (state.selectedTags.has(key)) state.selectedTags.delete(key); else state.selectedTags.add(key); updateSelectedChips(); refresh(); }, state.selectedTags);
  }

  // -----------------------------
  // Visualisations avancées
  // -----------------------------
  // Listener controller scoped to a single renderForceGraph invocation.
  // Each call aborts the previous controller, removing every window/document
  // listener the prior render attached. Without this, refresh() would leak
  // resize / fullscreenchange / pointerdown listeners on every interaction.
  let forceGraphAbort = null;
  function renderForceGraph(items) {
    if (forceGraphAbort) { try { forceGraphAbort.abort(); } catch (_) {} }
    forceGraphAbort = new AbortController();
    const fgSignal = forceGraphAbort.signal;
    const svg = d3.select('#force-graph');
    svg.selectAll('*').remove();
    const container = document.getElementById('force-container');
    function getSize() {
      // In fullscreen, prefer screen size; otherwise use container rect
      const isFs = !!document.fullscreenElement && document.fullscreenElement === container;
      if (isFs) {
        const w = Math.max(320, window.innerWidth || screen.width || 1024);
        const h = Math.max(320, window.innerHeight || screen.height || 768);
        return { w, h };
      }
      const r = container.getBoundingClientRect();
      const w = Math.max(320, Math.floor(r.width));
      const h = Math.max(320, Math.floor(r.height));
      return { w, h };
    }
    let { w: width, h: height } = getSize();
    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio','xMidYMid meet')
      .append('g');

    // Zoom & pan
    const zoom = d3.zoom().scaleExtent([0.3, 3]).on('zoom', (event) => { g.attr('transform', event.transform); });
    svg.call(zoom);

    // Select top tags (or ingredient tags in "what I have" mode)
    const tokCount = new Map();
    const tagsToCount = (state.mode === 'what_i_have') ? function(it) { return it.ingredientTags || []; } : function(it) { return it.tags || []; };
    for (const it of items) for (const tg of tagsToCount(it)) tokCount.set(String(tg), (tokCount.get(String(tg))||0)+1);
    let maxIng = Number(document.getElementById('max-ingredients').value || 60);
    let maxRec = Number(document.getElementById('max-recipes').value || 60);
    const pruneRare = false;
    const hideTop = Number(document.getElementById('hide-top-ingredients').value || 0);
    const sortedTokensArr = Array.from(tokCount.entries()).sort((a,b)=>{
      if (a[1] !== b[1]) return a[1]-b[1];
      return String(a[0]).localeCompare(String(b[0]), 'fr', { sensitivity: 'base' });
    });
    // Maintain a persistent blacklist across refreshes during the session
    window.__hiddenTopBlacklist = window.__hiddenTopBlacklist || new Set();
    // Compute the currently hidden top ingredients, taking blacklist into account
    const selectedTagSet = new Set(state.selectedTags || []);
    const hiddenTop = sortedTokensArr
      .slice(0, hideTop)
      .map(([k])=>k)
      .filter(k => !window.__hiddenTopBlacklist.has(k))
      .filter(k => !selectedTagSet.has(String(k)));
    const limitedTokensArr = sortedTokensArr
      .filter(([k]) => !hiddenTop.includes(k))
      .slice(-maxIng);
    const topTokens = new Set(limitedTokensArr.map(([k])=>k));
    const tokenWeight = new Map(limitedTokensArr.map(([k,v])=>[k, v]));
    const recipes = items.slice(0, maxRec); // limit

    const nodes = [];
    const links = [];
    const tokenId = new Map();
    const recipeId = new Map();
    let id = 0;
    const showTokens = document.getElementById('show-tokens').checked;
    const showRecipes = document.getElementById('show-recipes').checked;
    const showComponents = document.getElementById('show-components').checked;

    for (const tok of topTokens) {
      if (!showTokens) break;
      tokenId.set(tok, id++);
      nodes.push({ id: tokenId.get(tok), label: tok, type: 'tag' });
    }
    for (const r of recipes) {
      if ((r.type === 'recipe' && !showRecipes) || (r.type === 'component' && !showComponents)) continue;
      recipeId.set(r.title, id++);
      nodes.push({ id: recipeId.get(r.title), label: r.title, url: r.url, type: r.type });
    }
    const tagsForRecipe = (state.mode === 'what_i_have') ? function(r) { return (r.ingredientTags || []).map(String); } : function(r) { return (r.tags || []).map(String); };
    // Document frequency for tags among selected recipes/components
    const df = new Map();
    for (const r of recipes) {
      const rtags = new Set(tagsForRecipe(r));
      for (const tg of rtags) if (topTokens.has(tg)) df.set(tg, (df.get(tg)||0)+1);
    }
    const Ndocs = Math.max(1, recipes.length);

    const weightMode = (document.getElementById('edge-weight-mode')?.value) || 'select';
    const impact = Number(document.getElementById('edge-impact')?.value || 60) / 100; // 0..1
    const weightingEnabled = true; // always enabled, but mode can be 'uniform'
    const layoutMode = (document.getElementById('layout-mode')?.value) || 'force';

    // Build links
    const linkMode = (document.getElementById('link-mode')?.value) || 'auto';
    const useRecipeToken = linkMode === 'recipe-token' || (linkMode === 'auto' && (showRecipes || showComponents));
    const useTokenToken = linkMode === 'token-token' || (linkMode === 'auto' && !(showRecipes || showComponents));
    const useRecipeRecipe = linkMode === 'recipe-recipe';

    if (useRecipeToken) {
      // Standard recipe/component → token links
      for (const r of recipes) {
        if ((r.type === 'recipe' && !showRecipes) || (r.type === 'component' && !showComponents)) continue;
        const setForLinks = new Set(tagsForRecipe(r));
        for (const tok of setForLinks) if (topTokens.has(tok) && showTokens) {
          const freq = df.get(tok) || 1;
          const idf = Math.log(1 + Ndocs / freq);
          let wRaw = 1;
          if (weightMode === 'idf') wRaw = idf;
          else if (weightMode === 'freq') wRaw = freq;
          else wRaw = 1;
          links.push({ source: recipeId.get(r.title), target: tokenId.get(tok), weightRaw: wRaw });
        }
      }
    } else if (useTokenToken && showTokens) {
      // No recipes/components displayed: infer token↔token edges via hidden recipes/components
      const pairCount = new Map(); // key: "a||b" where a<b
      for (const r of recipes) {
        const toks = Array.from(new Set(tagsForRecipe(r).filter(t => topTokens.has(t))));
        for (let i = 0; i < toks.length; i++) {
          for (let j = i + 1; j < toks.length; j++) {
            const a = toks[i] < toks[j] ? toks[i] : toks[j];
            const b = toks[i] < toks[j] ? toks[j] : toks[i];
            const key = `${a}||${b}`;
            pairCount.set(key, (pairCount.get(key) || 0) + 1);
          }
        }
      }

      for (const [key, count] of pairCount.entries()) {
        const [a, b] = key.split('||');
        if (!tokenId.has(a) || !tokenId.has(b)) continue;
        const fa = df.get(a) || 1;
        const fb = df.get(b) || 1;
        const idfa = Math.log(1 + Ndocs / fa);
        const idfb = Math.log(1 + Ndocs / fb);
        let wRaw = 1;
        if (weightMode === 'idf') wRaw = count * (idfa + idfb) / 2;
        else if (weightMode === 'freq') wRaw = count;
        else wRaw = 1;
        links.push({ source: tokenId.get(a), target: tokenId.get(b), weightRaw: wRaw });
      }
    } else if (useRecipeRecipe) {
      // Build recipe↔recipe edges based on shared tags (or ingredient tags in "what I have" mode)
      const recs = recipes.filter(r => (r.type === 'recipe' && showRecipes) || (r.type === 'component' && showComponents));
      for (let i = 0; i < recs.length; i++) {
        for (let j = i+1; j < recs.length; j++) {
          const a = recs[i], b = recs[j];
          const setA = new Set(tagsForRecipe(a));
          const setB = new Set(tagsForRecipe(b));
          let shared = 0;
          for (const t of setA) if (setB.has(t)) shared++;
          if (shared > 0) {
            const wRaw = (weightMode === 'idf') ? shared : shared; // idf not meaningful here; use shared count
            links.push({ source: recipeId.get(a.title), target: recipeId.get(b.title), weightRaw: wRaw });
          }
        }
      }
    }

    // Remove isolated nodes: keep only nodes that participate in at least one link
    const usedIds = new Set();
    for (const l of links) { usedIds.add(l.source); usedIds.add(l.target); }
    let filteredNodes = nodes.filter(n => usedIds.has(n.id));
    let filteredLinks = links.filter(l => usedIds.has(l.source) && usedIds.has(l.target));
    // Optional: filter out terminal nodes (degree == 1) when toggle is on
    const hideTerminal = !!window.__hideTerminalNodes;
    if (hideTerminal) {
      const deg = new Map();
      for (const l of filteredLinks) {
        const a = (typeof l.source === 'object') ? l.source.id : l.source;
        const b = (typeof l.target === 'object') ? l.target.id : l.target;
        deg.set(a, (deg.get(a) || 0) + 1);
        deg.set(b, (deg.get(b) || 0) + 1);
      }
      const keep = new Set(filteredNodes.filter(n => (deg.get(n.id) || 0) > 1).map(n=>n.id));
      filteredNodes = filteredNodes.filter(n => keep.has(n.id));
      filteredLinks = filteredLinks.filter(l => keep.has((typeof l.source === 'object') ? l.source.id : l.source) && keep.has((typeof l.target === 'object') ? l.target.id : l.target));
      // After removing terminals, recipes/components that lost all edges should also be removed
      const usedAfter = new Set();
      for (const l of filteredLinks) {
        const sa = (typeof l.source === 'object') ? l.source.id : l.source;
        const sb = (typeof l.target === 'object') ? l.target.id : l.target;
        usedAfter.add(sa); usedAfter.add(sb);
      }
      filteredNodes = filteredNodes.filter(n => usedAfter.has(n.id));
    }

    // Normalize link weights to [0,1] based on filtered links
    const ext = d3.extent(filteredLinks, d=>d.weightRaw);
    const norm = d3.scaleLinear().domain(ext[0] === ext[1] ? [0,1] : ext).range([0,1]);
    for (const l of filteredLinks) l.weight = norm(l.weightRaw);

    // In selection mode, compute adjacency to selected tags and adjust link/node visuals later
    const selectionModeActive = (weightMode === 'select');
    const selectedSet = new Set(state.selectedTags);
    const idToNode = new Map(filteredNodes.map(n => [n.id, n]));
    const nodeToDegreeWithinSelection = new Map();
    if (selectionModeActive && selectedSet.size > 0) {
      // mark nodes adjacent to any selected tag node (only when mode===tag)
      for (const l of filteredLinks) {
        const a = idToNode.get(typeof l.source === 'object' ? l.source.id : l.source);
        const b = idToNode.get(typeof l.target === 'object' ? l.target.id : l.target);
        const aIsSel = (a?.type === 'tag' && selectedSet.has(a.label));
        const bIsSel = (b?.type === 'tag' && selectedSet.has(b.label));
        if (aIsSel) nodeToDegreeWithinSelection.set(b.id, (nodeToDegreeWithinSelection.get(b.id) || 0) + 1);
        if (bIsSel) nodeToDegreeWithinSelection.set(a.id, (nodeToDegreeWithinSelection.get(a.id) || 0) + 1);
      }
    }

    // Color by type (modern palette)
    const colorByType = d => d.type === 'recipe' ? '#f97316' : (d.type === 'component' ? '#F53200' : '#22c55e');

    const minDist = 24;
    const baseDist = 80;
    const useWeighted = weightingEnabled && weightMode !== 'uniform';
    const linkForce = d3.forceLink(filteredLinks)
      .id(d => d.id)
      .distance(d => useWeighted ? (baseDist - (baseDist - minDist) * d.weight * impact) : baseDist)
      .strength(d => useWeighted ? (0.2 + 0.6 * d.weight * impact) : 0.4);

    // Prepare simulation
    let simulation = d3.forceSimulation(filteredNodes)
      .force('link', linkForce)
      .force('charge', d3.forceManyBody().strength(-80))
      .force('center', d3.forceCenter(width/2, height/2))
      .force('collide', d3.forceCollide(18));

    // Apply non-directed layouts if selected
    if (layoutMode === 'radial') {
      const radiusByType = (d)=> d.type === 'recipe' || d.type === 'component' ? Math.min(width, height)/3 : Math.min(width, height)/2;
      simulation.force('radial', d3.forceRadial(radiusByType, width/2, height/2).strength(0.3));
    } else if (layoutMode === 'circle') {
      const R = Math.min(width, height)/2.4;
      const cx = width/2, cy = height/2;
      filteredNodes.forEach((n, i)=>{ const a = (2*Math.PI*i)/filteredNodes.length; n.fx = cx + R*Math.cos(a); n.fy = cy + R*Math.sin(a); });
      simulation.force('charge', d3.forceManyBody().strength(-10));
    } else if (layoutMode === 'rings') {
      // Rings by type: ingredients outer, recipes inner, components middle
      const cx = width/2, cy = height/2;
      const rIngr = Math.min(width, height) * 0.42;
      const rComp = Math.min(width, height) * 0.30;
      const rRec = Math.min(width, height) * 0.18;
      const byType = { token: [], recipe: [], component: [] };
      filteredNodes.forEach(n => byType[n.type === 'component' ? 'component' : (n.type === 'recipe' ? 'recipe' : 'token')].push(n));
      const placeRing = (arr, R) => {
        arr.forEach((n, i) => { const a = (2*Math.PI*i)/Math.max(1,arr.length); n.fx = cx + R*Math.cos(a); n.fy = cy + R*Math.sin(a); });
      };
      placeRing(byType.token, rIngr);
      placeRing(byType.component, rComp);
      placeRing(byType.recipe, rRec);
      simulation.force('charge', d3.forceManyBody().strength(-10));
    } else if (layoutMode === 'spiral') {
      const cx = width/2, cy = height/2;
      const a0 = 10;
      const b = 6; // spacing factor
      filteredNodes.forEach((n, i) => {
        const a = 0.35 * i; // angle
        const r = a0 + b * a; // radius grows with angle
        n.fx = cx + r * Math.cos(a);
        n.fy = cy + r * Math.sin(a);
      });
      simulation.force('charge', d3.forceManyBody().strength(-8));
    }

    const linkScale = d3.scaleLinear().domain([0,1]).range([1, 4 + 6*impact]);
    // Edge color scale (colorblind-friendly, no red/green): soft → blue, medium → indigo, strong → deep purple
    const edgeColorScale = d3.scaleLinear()
      .domain([0, 0.5, 1])
      .range(['#93c5fd', '#6366f1', '#7e22ce']);
    const colorizeByWeight = (useTokenToken || useRecipeRecipe) && weightingEnabled && weightMode !== 'uniform';
    const linkLayer = g.append('g').attr('class','link-layer');
    // Precompute tag degrees for selection mode coloring by originating tag degree
    const tagDegree = new Map();
    if (selectionModeActive) {
      for (const l of filteredLinks) {
        const a = idToNode.get(typeof l.source === 'object' ? l.source.id : l.source);
        const b = idToNode.get(typeof l.target === 'object' ? l.target.id : l.target);
        if (a && a.type === 'tag') tagDegree.set(a.id, (tagDegree.get(a.id) || 0) + 1);
        if (b && b.type === 'tag') tagDegree.set(b.id, (tagDegree.get(b.id) || 0) + 1);
      }
    }
    const link = linkLayer.attr('stroke', 'rgba(148,163,184,0.55)').selectAll('line').data(filteredLinks).enter().append('line')
      .attr('stroke-width', d => {
        if (!weightingEnabled) return 1;
        if (weightMode === 'uniform') return 1;
        if (weightMode === 'select' && selectedSet.size === 0) return 1; // no selection -> uniform width
        if (weightMode === 'select' && selectedSet.size > 0) {
          // boost width for edges adjacent to selected tag by degree of the selected node
          const sa = idToNode.get(typeof d.source === 'object' ? d.source.id : d.source);
          const sb = idToNode.get(typeof d.target === 'object' ? d.target.id : d.target);
          const aSel = sa?.type === 'tag' && selectedSet.has(sa.label);
          const bSel = sb?.type === 'tag' && selectedSet.has(sb.label);
          if (aSel || bSel) {
            const selNode = aSel ? sa : sb;
            const adj = filteredLinks.reduce((acc, L)=>{
              const sid = (typeof L.source === 'object') ? L.source.id : L.source;
              const tid = (typeof L.target === 'object') ? L.target.id : L.target;
              return acc + (sid === selNode.id || tid === selNode.id ? 1 : 0);
            }, 0);
            // slightly thicker red edges in selection mode: ~3-4px depending on degree
            const extra = Math.min(1, Math.log2(1 + adj) / 2);
            return 3 + extra;
          }
          return 1; // non-adjacent stay uniform
        }
        return linkScale(d.weight);
      })
      .attr('stroke', d => {
        // In selection mode: color by originating tag degree (proportional, independent from width)
        // Otherwise (recipe-recipe / token-token): color by link weight
        let useIntensityColor = colorizeByWeight;
        if (selectionModeActive) {
          useIntensityColor = true;
          // pick the tag endpoint (if any) and use its degree; fallback to link weight
          const a = idToNode.get(typeof d.source === 'object' ? d.source.id : d.source);
          const b = idToNode.get(typeof d.target === 'object' ? d.target.id : d.target);
          let degree = 0;
          if (a && a.type === 'tag') degree = tagDegree.get(a.id) || 0;
          else if (b && b.type === 'tag') degree = tagDegree.get(b.id) || 0;
          // normalize degree to [0,1] locally based on current edges involving tags
          let maxDeg = 1;
          for (const v of tagDegree.values()) if (v > maxDeg) maxDeg = v;
          const normDeg = Math.max(0, Math.min(1, degree / maxDeg));
          const c = edgeColorScale(normDeg);
          d.baseColor = c;
        } else if (useIntensityColor) {
          const c = edgeColorScale(d.weight);
          d.baseColor = c;
        } else {
          d.baseColor = null;
        }
        // Preserve selection-based red for edges adjacent to selected tags
        if (selectionModeActive && selectedSet.size > 0) {
          const sa = idToNode.get(typeof d.source === 'object' ? d.source.id : d.source);
          const sb = idToNode.get(typeof d.target === 'object' ? d.target.id : d.target);
          const aSel = sa?.type === 'tag' && selectedSet.has(sa.label);
          const bSel = sb?.type === 'tag' && selectedSet.has(sb.label);
          if (aSel || bSel) return '#F53200';
        }
        if (useIntensityColor && d.baseColor) return d.baseColor;
        return 'rgba(148,163,184,0.55)';
      });
    // Draw wider (stronger) edges last so they appear on top (but still under nodes)
    if (colorizeByWeight) {
      try { link.sort((a, b) => (a.weight - b.weight)); } catch (_) {}
    }
    // In selection mode, ensure red edges are on top of other edges (still behind nodes)
    if (selectionModeActive && selectedSet.size > 0) {
      try {
        const redEdges = [];
        const otherEdges = [];
        link.each(function(d){
          const sa = idToNode.get(typeof d.source === 'object' ? d.source.id : d.source);
          const sb = idToNode.get(typeof d.target === 'object' ? d.target.id : d.target);
          const aSel = sa?.type === 'tag' && selectedSet.has(sa.label);
          const bSel = sb?.type === 'tag' && selectedSet.has(sb.label);
          ((aSel || bSel) ? redEdges : otherEdges).push(this);
        });
        // Append red edges at end of the same layer to bring them to the top (under nodes)
        otherEdges.forEach(el => linkLayer.node().appendChild(el));
        redEdges.forEach(el => linkLayer.node().appendChild(el));
        // Ensure node layer is above links
        node.raise();
      } catch (_) {}
    }
    const node = g.append('g').selectAll('g').data(filteredNodes).enter().append('g').call(d3.drag()
        .on('start', (event, d) => { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    const circles = node.append('circle')
      .attr('r', d => {
        if (selectionModeActive && selectedSet.size > 0) {
          const deg = nodeToDegreeWithinSelection.get(d.id) || 0;
          if (deg > 0) return (d.type === 'recipe' ? 7 : 5) + Math.min(6, 1 + Math.log2(1 + deg));
        }
        return d.type === 'recipe' ? 7 : 5;
      })
      .attr('fill', d => colorByType(d))
      .attr('stroke', '#111')
      .attr('stroke-width', 0.6)
      .attr('opacity', 1)
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        if (d.type === 'token' || d.type === 'tag') {
          const val = d.label;
          if (state.selectedTags.has(val)) state.selectedTags.delete(val); else state.selectedTags.add(val);
          updateSelectedChips();
          // Hint renderForceGraph to fit asap in fullscreen
          window.__pendingFit = true;
          // Hide any lingering tooltip
          (function(){ const t = document.getElementById('viz-tooltip'); if (t) t.style.display = 'none'; })();
          refresh();
          // If in fullscreen, re-fit soon to preserve zoom
          const container = document.getElementById('force-container');
          if (typeof fitToViewport === 'function' && document.fullscreenElement && document.fullscreenElement === container) {
            setTimeout(() => { fitToViewport(24); }, 40);
          }
        } else if ((d.type === 'recipe' || d.type === 'component') && d.url) {
          // If currently in fullscreen, remember to restore on return
          const containerEl = document.getElementById('force-container');
          const inFs = !!document.fullscreenElement && document.fullscreenElement === containerEl;
          try { if (inFs) sessionStorage.setItem('recherche_restore_fs', '1'); } catch (_) {}
          // Hide tooltip before navigating
          (function(){ const t = document.getElementById('viz-tooltip'); if (t) t.style.display = 'none'; })();
          window.location.href = d.url;
        }
      })
      .on('mouseover', function(event,d){ applyHoverHighlight(d); showTip(event, d); })
      .on('mousemove', function(event,d){ showTip(event, d); })
      .on('mouseout', function(){ resetHoverHighlight(); hideTip(); });

    const labels = node.append('text')
      .text(d => d.label)
      .attr('x', 10)
      .attr('y', 3)
      .attr('font-size', 10)
      .attr('fill', '#111')
      .attr('paint-order', 'stroke')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.9);

    // Ensure labels render above circles and don't block mouse events
    node.selectAll('text').style('pointer-events','none').raise();

    // Build adjacency map for hover highlighting (id -> Set(neighbor ids))
    const adjacency = new Map();
    function addAdj(a, b){
      const aid = (typeof a === 'object') ? a.id : a;
      const bid = (typeof b === 'object') ? b.id : b;
      if (!adjacency.has(aid)) adjacency.set(aid, new Set());
      if (!adjacency.has(bid)) adjacency.set(bid, new Set());
      adjacency.get(aid).add(bid);
      adjacency.get(bid).add(aid);
    }
    for (const l of filteredLinks) { addAdj(l.source, l.target); }

    // Helpers to preserve selection-based link coloring
    function linkIsRed(L){
      if (!(selectionModeActive && selectedSet.size > 0)) return false;
      const sa = idToNode.get(typeof L.source === 'object' ? L.source.id : L.source);
      const sb = idToNode.get(typeof L.target === 'object' ? L.target.id : L.target);
      const aSel = sa?.type === 'tag' && selectedSet.has(sa.label);
      const bSel = sb?.type === 'tag' && selectedSet.has(sb.label);
      return !!(aSel || bSel);
    }
    function defaultLinkStroke(L){
      // Preserve selection-based red when active
      if (linkIsRed(L)) return '#F53200';
      // Otherwise, restore the link's base color if available (e.g., intensity color)
      if (L && L.baseColor) return L.baseColor;
      // Fallback default
      return 'rgba(148,163,184,0.55)';
    }

    function computeDefaultRadius(n){
      if (selectionModeActive && selectedSet.size > 0) {
        const deg = nodeToDegreeWithinSelection.get(n.id) || 0;
        if (deg > 0) return (n.type === 'recipe' ? 7 : 5) + Math.min(6, 1 + Math.log2(1 + deg));
      }
      return n.type === 'recipe' ? 7 : 5;
    }

    function applyHoverHighlight(targetNode){
      try {
        const targetId = targetNode.id;
        const focus = new Set([targetId]);
        const neigh = adjacency.get(targetId);
        if (neigh) for (const nid of neigh) focus.add(nid);

        // Circles: enlarge focus, shrink others; opacities
        circles
          .transition().duration(120)
          .attr('r', n => focus.has(n.id)
            ? (computeDefaultRadius(n) + (n.id === targetId ? 2 : 1))
            : Math.max(3, computeDefaultRadius(n) - 1))
          .attr('opacity', n => focus.has(n.id) ? 1 : 0.25);

        // Labels: dim non-focus
        labels
          .transition().duration(120)
          .attr('opacity', n => focus.has(n.id) ? 1 : 0.25);

        // Links: highlight only edges directly incident to the hovered node (no n+1)
        // Keep original colors; only adjust opacity
        link
          .transition().duration(120)
          .attr('opacity', L => {
            const sid = (typeof L.source === 'object') ? L.source.id : L.source;
            const tid = (typeof L.target === 'object') ? L.target.id : L.target;
            const adjacentDirect = (sid === targetId || tid === targetId);
            return adjacentDirect ? 0.9 : 0.15;
          })
          .attr('stroke', L => defaultLinkStroke(L));
        // Bring adjacent red edges to top during hover in selection mode
        if (selectionModeActive && selectedSet.size > 0) {
          try {
            const reds = [];
            link.each(function(d){
              const sid = (typeof d.source === 'object') ? d.source.id : d.source;
              const tid = (typeof d.target === 'object') ? d.target.id : d.target;
              const adjacentDirect = (sid === targetId || tid === targetId);
              if (!adjacentDirect) return;
              const sa = idToNode.get(typeof d.source === 'object' ? d.source.id : d.source);
              const sb = idToNode.get(typeof d.target === 'object' ? d.target.id : d.target);
              const aSel = sa?.type === 'tag' && selectedSet.has(sa.label);
              const bSel = sb?.type === 'tag' && selectedSet.has(sb.label);
              if (aSel || bSel) reds.push(this);
            });
            const layer = linkLayer && linkLayer.node ? linkLayer.node() : g.node();
            reds.forEach(el => layer.appendChild(el));
            node.raise();
          } catch (_) {}
        }
      } catch (_) { /* noop */ }
    }

    function resetHoverHighlight(){
      circles
        .transition().duration(120)
        .attr('r', n => computeDefaultRadius(n))
        .attr('opacity', 1);
      labels
        .transition().duration(120)
        .attr('opacity', 1);
      link
        .transition().duration(120)
        .attr('opacity', 1)
        .attr('stroke', L => defaultLinkStroke(L));
    }

    let __tickCount = 0;
    simulation.on('tick', () => {
      link.attr('x1', d => d.source.x).attr('y1', d => d.source.y).attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
      // Early smooth fit after a couple ticks in fullscreen when requested
      const isFs = !!document.fullscreenElement && document.fullscreenElement === container;
      if (isFs && window.__pendingFit) {
        __tickCount += 1;
        if (__tickCount === 2 && typeof fitToViewport === 'function') {
          window.__pendingFit = false;
          fitToViewport(24);
        }
      }
    });

    // When simulation stabilizes, fit to viewport if in fullscreen
    const isNowFs = !!document.fullscreenElement && document.fullscreenElement === container;
    if (typeof fitToViewport === 'function' && isNowFs) {
      // Quick initial fit and then refine when forces end
      setTimeout(() => { fitToViewport(24); }, 40);
      simulation.on('end', () => { setTimeout(() => { fitToViewport(24); }, 0); });
    }

    // Resize handler (including fullscreen changes)
    function handleResize() {
      const size = getSize();
      width = size.w; height = size.h;
      svg.attr('viewBox', `0 0 ${width} ${height}`);
      simulation.force('center', d3.forceCenter(width/2, height/2));
      simulation.alpha(0.3).restart();
    }
    window.addEventListener('resize', handleResize, { signal: fgSignal });
    document.addEventListener('fullscreenchange', handleResize, { signal: fgSignal });

    // Helper: fit graph into current viewport
    function fitToViewport(pad = 24) {
      try {
        const bbox = g.node().getBBox();
        if (!bbox || !isFinite(bbox.width) || !isFinite(bbox.height) || bbox.width === 0 || bbox.height === 0) {
          svg.transition().duration(160).ease(d3.easeCubicOut).call(zoom.transform, d3.zoomIdentity);
          return;
        }
        const w = width - pad * 2;
        const h = height - pad * 2;
        const scale = Math.max(0.1, Math.min(5, 0.95 / Math.max(bbox.width / w, bbox.height / h)));
        const tx = (width / 2) - scale * (bbox.x + bbox.width / 2);
        const ty = (height / 2) - scale * (bbox.y + bbox.height / 2);
        const transform = d3.zoomIdentity.translate(tx, ty).scale(scale);
        svg.transition().duration(180).ease(d3.easeCubicOut).call(zoom.transform, transform);
      } catch (_) {
        // fallback
        svg.transition().duration(160).ease(d3.easeCubicOut).call(zoom.transform, d3.zoomIdentity);
      }
    }

    // On exiting fullscreen: reset zoom and restore size
    document.addEventListener('fullscreenchange', () => {
      const isFs = !!document.fullscreenElement && document.fullscreenElement === container;
      if (!isFs) {
        try {
          svg.call(zoom.transform, d3.zoomIdentity);
        } catch (_) {}
        // Clear any fullscreen-imposed inline sizing
        container.style.removeProperty('width');
        container.style.removeProperty('height');
        // Restore responsive aspect ratio outside fullscreen
        try { container.style.aspectRatio = '16 / 9'; } catch(_) {}
        // Wait a tick to let layout settle, then recompute size
        // On mobile, force container to reflow by toggling a CSS property
        const prevDisplay = container.style.display;
        container.style.display = 'block';
        setTimeout(() => {
          container.style.display = prevDisplay || '';
          handleResize();
          // Re-render to fully reset layout and sizing after exiting fullscreen
          try { if (typeof refresh === 'function') refresh(); } catch (_) {}
        }, 100);
      } else {
        // Entering fullscreen: fit graph to viewport
        // Remove aspect ratio constraint to use full screen space
        try { container.style.removeProperty('aspect-ratio'); } catch(_) {}
        // Decide overlay expansion based on number of selected tags
        try {
          if (typeof window.__fsOverlaySetOpen === 'function') {
            const n = (state.selectedTags && state.selectedTags.size) ? state.selectedTags.size : 0;
            // Expand if 0 or 1 tag, collapse if more than 1
            window.__fsOverlaySetOpen(n <= 1);
          }
        } catch(_) {}
        setTimeout(() => { fitToViewport(28); }, 80);
      }
    }, { signal: fgSignal });

    // Search highlight removed

    // Tooltip element
    if (!document.getElementById('viz-tooltip')) {
      const tip = document.createElement('div');
      tip.id = 'viz-tooltip';
      document.body.appendChild(tip);
    }
    // Tooltip helpers
    function showTip(ev, d){
      const el = document.getElementById('viz-tooltip');
      if(!el) return;
      el.textContent = `${d.label} · ${d.type}`;
      el.style.left = (ev.clientX + 16) + 'px';
      el.style.top = (ev.clientY - 16) + 'px';
      el.style.display = 'block';
    }
    function hideTip(){ const el = document.getElementById('viz-tooltip'); if(el) el.style.display='none'; }

    // Hide lingering tooltip when clicking anywhere outside the graph area
    document.addEventListener('pointerdown', (e)=>{
      const tip = document.getElementById('viz-tooltip');
      if (!tip) return;
      const withinGraph = e.target.closest && e.target.closest('#force-container');
      if (!withinGraph) tip.style.display = 'none';
    }, { passive: true, signal: fgSignal });

    // Render the hidden top ingredients as removable pills
    const hiddenWrap = document.getElementById('hidden-top-ingredients');
    if (hiddenWrap) {
      hiddenWrap.innerHTML = '';
      for (const k of hiddenTop) {
        const pill = document.createElement('button');
        pill.className = 'px-3 py-1 rounded-full border text-xs bg-white text-primary border-primary hover:bg-red-50';
        pill.textContent = k;
        pill.title = 'Cliquer pour réafficher dans le graphe';
        pill.addEventListener('click', () => {
          window.__hiddenTopBlacklist.add(k);
          refresh();
        });
        hiddenWrap.appendChild(pill);
      }
    }

    // Fullscreen controls + resize handling
    document.getElementById('btn-fullscreen').onclick = () => {
      const container = document.getElementById('force-container');
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    };
    // Reset view (zoom to identity and re-center)
    const resetBtn = document.getElementById('btn-reset-view');
    if (resetBtn) {
      resetBtn.addEventListener('click', ()=>{
        const isFs = !!document.fullscreenElement && document.fullscreenElement === container;
        if (isFs) {
          fitToViewport(28);
        } else {
          try { svg.transition().duration(250).call(zoom.transform, d3.zoomIdentity); } catch(_) {}
          simulation.force('center', d3.forceCenter((getSize().w)/2, (getSize().h)/2));
          simulation.alpha(0.3).restart();
        }
      });
    }

    // Create fullscreen overlay for tag input and selected tags (shown only in fullscreen)
    (function createFsOverlay(){
      const container = document.getElementById('force-container');
      if (!container) return;
      if (!document.getElementById('fs-overlay')) {
        const wrap = document.createElement('div');
        wrap.id = 'fs-overlay';
        wrap.className = 'absolute top-2 left-1/2 -translate-x-1/2 z-30 max-w-[96vw] w-[800px] pointer-events-auto transition-all duration-200 pl-16 md:pl-0';
        wrap.style.display = 'none';
        wrap.innerHTML = `
          <div class="relative rounded-xl border border-gray-300 bg-white/50 px-4 py-3 shadow">
            <span id="fs-tag-count" class="absolute top-2 left-1/2 -translate-x-1/2 bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow z-[9998] border-2 border-white opacity-0 transition-opacity duration-300 ease-out"></span>
            <button id="fs-overlay-toggle" class="absolute left-2 top-2 p-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 z-[9999]" title="Afficher/Masquer" style="pointer-events:auto;">
              <svg id="fs-overlay-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M5.47 14.53a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1-1.06 1.06L12 9.06l-5.47 5.47a.75.75 0 0 1-1.06 0Z" clip-rule="evenodd"/></svg>
            </button>
            <div id="fs-overlay-body" class="flex flex-col items-center gap-2 transition-all duration-200">
              <div class="relative z-10 w-full max-w-[520px]">
                <input id="fs-tag-input" type="text" placeholder="Ajouter un tag…" class="px-4 py-2 w-full rounded-full border border-gray-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-center">
                <div id="fs-tag-autocomplete" class="absolute z-10 left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 hidden max-h-60 overflow-auto"></div>
              </div>
              <div id="fs-selected-tags" class="relative z-20 flex flex-wrap justify-center gap-2 pt-1"></div>
            </div>
          </div>`;
        container.appendChild(wrap);

        const body = wrap.querySelector('#fs-overlay-body');
        const countBadge = wrap.querySelector('#fs-tag-count');
        const icon = wrap.querySelector('#fs-overlay-icon');
        const toggle = wrap.querySelector('#fs-overlay-toggle');
        let open = true;
        // Animated stretch/collapse without forcing height: animate padding and inner opacity/translate
        wrap.style.overflow = 'visible';
        wrap.style.transition = 'padding 220ms ease';
        function applyContainerOpenStyles(isOpen){
          if (isOpen) {
            wrap.style.paddingTop = '';
            wrap.style.paddingBottom = '';
          } else {
            wrap.style.paddingTop = '0px';
            wrap.style.paddingBottom = '0px';
          }
        }
        function updateCountBadge(){
          if (!countBadge) return;
          const n = (state.selectedTags && state.selectedTags.size) ? state.selectedTags.size : 0;
          if (!open && n > 0) {
            // Food icon + number overlay
            countBadge.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor" class="w-6 h-6 font-bold"><path d="M128 352.576V352a288 288 0 0 1 491.072-204.224a192 192 0 0 1 274.24 204.48a64 64 0 0 1 57.216 74.24C921.6 600.512 850.048 710.656 736 756.992V800a96 96 0 0 1-96 96H384a96 96 0 0 1-96-96v-43.008c-114.048-46.336-185.6-156.48-214.528-330.496A64 64 0 0 1 128 352.64zm64-.576h64a160 160 0 0 1 320 0h64a224 224 0 0 0-448 0m128 0h192a96 96 0 0 0-192 0m439.424 0h68.544A128.256 128.256 0 0 0 704 192c-15.36 0-29.952 2.688-43.52 7.616c11.328 18.176 20.672 37.76 27.84 58.304A64.128 64.128 0 0 1 759.424 352M672 768H352v32a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32zm-342.528-64h365.056c101.504-32.64 165.76-124.928 192.896-288H136.576c27.136 163.072 91.392 255.36 192.896 288"/></svg>
              <span class="absolute -bottom-1 -right-1 bg-white text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-green-600">${n}</span>
            `;
            countBadge.classList.remove('opacity-0');
            countBadge.classList.add('opacity-100');
          } else {
            countBadge.classList.remove('opacity-100');
            countBadge.classList.add('opacity-0');
            countBadge.innerHTML = '';
          }
        }
        function setOpen(v){
          open = v;
          if (open) {
            body.classList.remove('opacity-0','-translate-y-2','pointer-events-none','hidden');
            icon.innerHTML = '<path fill-rule="evenodd" d="M5.47 14.53a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1-1.06 1.06L12 9.06l-5.47 5.47a.75.75 0 0 1-1.06 0Z" clip-rule="evenodd" />';
            updateCountBadge();
            applyContainerOpenStyles(true);
          } else {
            body.classList.add('opacity-0','-translate-y-2','pointer-events-none');
            // after transition hide to avoid capturing clicks
            setTimeout(()=>{ if(!open) body.classList.add('hidden'); }, 180);
            icon.innerHTML = '<path fill-rule="evenodd" d="M18.53 9.47a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 0 1-1.06 0l-6-6A.75.75 0 0 1 6.47 9.47L12 15l5.53-5.53a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />';
            updateCountBadge();
            applyContainerOpenStyles(false);
          }
        }
        // Expose programmatic control for other modules
        window.__fsOverlaySetOpen = setOpen;
        // Initialize animation state
        applyContainerOpenStyles(true);
        setOpen(true);
        toggle.addEventListener('click', ()=> setOpen(!open));
        if (countBadge) {
          countBadge.style.cursor = 'pointer';
          countBadge.addEventListener('click', ()=> setOpen(true));
        }
        // No height recalculation needed

        // Render selected tags as removable pills
        function renderFsTags(){
          const host = wrap.querySelector('#fs-selected-tags');
          if (!host) return;
          host.innerHTML = '';
          // Add clear button at the beginning when there are selected tags
          if (state.selectedTags.size > 0) {
            const clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.title = 'Effacer les tags';
            clearBtn.ariaLabel = 'Effacer les tags';
            clearBtn.className = 'inline-flex items-center justify-center w-8 h-8 rounded-full border border-primary text-white bg-primary shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40 relative z-[9998]';
            clearBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4"><path d="M6 6l12 12M18 6l-12 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            clearBtn.addEventListener('click', ()=>{
              state.selectedTags.clear();
              if (typeof updateSelectedChips === 'function') updateSelectedChips();
              if (typeof refresh === 'function') refresh();
              if (typeof pushControlsToUrl === 'function') pushControlsToUrl();
              renderFsTags();
            });
            const spacer = document.createElement('span'); spacer.className = 'w-2';
            host.appendChild(clearBtn);
            host.appendChild(spacer);
          }
          for (const tg of state.selectedTags) {
            const pill = document.createElement('button');
            pill.className = 'px-3 py-1 rounded-full border text-xs bg-white text-primary border-primary hover:bg-red-50';
            pill.textContent = tg;
            pill.title = 'Cliquer pour retirer ce tag';
            pill.addEventListener('click', ()=>{
              state.selectedTags.delete(tg);
              if (typeof updateSelectedChips === 'function') updateSelectedChips();
              if (typeof refresh === 'function') refresh();
              if (typeof pushControlsToUrl === 'function') pushControlsToUrl();
              renderFsTags();
            });
            host.appendChild(pill);
          }
          updateCountBadge();
        }
        // Expose to global for sync from updateSelectedChips
        window.__renderFsTags = renderFsTags;

        // Tag input handler
        const fsInput = wrap.querySelector('#fs-tag-input');
        const fsAuto = wrap.querySelector('#fs-tag-autocomplete');
        fsInput.addEventListener('keydown', (e)=>{
          if (e.key === 'Enter') {
            const v = e.target.value.trim();
            if (v) {
              state.selectedTags.add(v);
              e.target.value='';
              if (typeof updateSelectedChips === 'function') updateSelectedChips();
              if (typeof refresh === 'function') refresh();
              if (typeof pushControlsToUrl === 'function') pushControlsToUrl();
              renderFsTags();
              if (fsAuto) fsAuto.classList.add('hidden');
            }
          }
        });
        fsInput.addEventListener('input', (e)=>{
          const q = e.target.value.trim().toLowerCase();
          const candidates = Array.from(ALL_TAGS.keys())
            .filter(k => !state.selectedTags.has(k) && String(k).toLowerCase().includes(q))
            .slice(0, 20);
          if (q && candidates.length && fsAuto) {
            fsAuto.innerHTML = '';
            for (const c of candidates) {
              const btn = document.createElement('button');
              btn.className = 'w-full text-left px-3 py-2 hover:bg-red-50';
              btn.textContent = c;
              btn.addEventListener('click', ()=>{
                state.selectedTags.add(c);
                fsInput.value = '';
                fsAuto.classList.add('hidden');
                if (typeof updateSelectedChips === 'function') updateSelectedChips();
                if (typeof refresh === 'function') refresh();
                if (typeof pushControlsToUrl === 'function') pushControlsToUrl();
                renderFsTags();
              });
              fsAuto.appendChild(btn);
            }
            fsAuto.classList.remove('hidden');
          } else if (fsAuto) {
            fsAuto.classList.add('hidden');
          }
        });
        document.addEventListener('click', (e)=>{
          if (fsAuto && !fsAuto.contains(e.target) && e.target !== fsInput) fsAuto.classList.add('hidden');
        });
        // initial render
        renderFsTags();
      }
    })();

    // Add exit fullscreen button inside container; also show desktop controls always
    function ensureFsButton(){
      const container = document.getElementById('force-container');
      let btn = document.getElementById('fs-exit-btn');
      if (!btn){
        btn = document.createElement('button');
        btn.id = 'fs-exit-btn';
        btn.innerHTML = '✕';
        btn.title = 'Quitter le plein écran';
        btn.style.position = 'absolute';
        btn.style.top = '8px';
        btn.style.left = '8px';
        btn.style.zIndex = '9998';
        btn.style.pointerEvents = 'auto';
        btn.style.width = '36px';
        btn.style.height = '36px';
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.borderRadius = '8px';
        btn.style.background = 'rgba(255,200,200,0.6)';
        btn.style.border = '2px solid white';
        btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', ()=>{ if(document.fullscreenElement) document.exitFullscreen(); });
        container.style.position = 'relative';
        container.appendChild(btn);
      }
      const inFs = !!document.fullscreenElement && document.fullscreenElement === container;
      const isMobile = window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
      const showControls = inFs || !isMobile; // always show controls on desktop
      btn.style.display = inFs ? 'block' : 'none';
      const triggerBtn = document.getElementById('btn-fullscreen');
      if (triggerBtn) triggerBtn.style.display = inFs ? 'none' : 'block';
      // Reposition and elevate the reset-view button under the exit button in fullscreen
      const resetBtn = document.getElementById('btn-reset-view');
      if (resetBtn) {
        if (showControls) {
          // Reparent into container to avoid being under overlay stacking context
          if (!window.__resetParent) window.__resetParent = resetBtn.parentElement;
          if (resetBtn.parentElement !== container) container.appendChild(resetBtn);
          resetBtn.style.position = 'absolute';
          resetBtn.style.top = '52px';
          resetBtn.style.left = '8px';
          resetBtn.style.zIndex = '9998';
          resetBtn.style.pointerEvents = 'auto';
          resetBtn.style.width = '36px';
          resetBtn.style.height = '36px';
          resetBtn.style.display = 'inline-flex';
          resetBtn.style.alignItems = 'center';
          resetBtn.style.justifyContent = 'center';
          resetBtn.style.borderRadius = '8px';
          resetBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)';
        } else {
          if (window.__resetParent && window.__resetParent.appendChild && resetBtn.parentElement !== window.__resetParent) {
            window.__resetParent.appendChild(resetBtn);
          }
          resetBtn.style.position = '';
          resetBtn.style.top = '';
          resetBtn.style.left = '';
          resetBtn.style.zIndex = '';
          resetBtn.style.pointerEvents = '';
          resetBtn.style.width = '';
          resetBtn.style.height = '';
          resetBtn.style.display = '';
          resetBtn.style.alignItems = '';
          resetBtn.style.justifyContent = '';
          resetBtn.style.borderRadius = '';
          resetBtn.style.boxShadow = '';
        }
      }

      // Create/position the mini visibility toggle and horizontal controls (fullscreen only)
      let miniToggle = document.getElementById('fs-mini-toggle');
      if (!miniToggle) {
        miniToggle = document.createElement('button');
        miniToggle.id = 'fs-mini-toggle';
        miniToggle.title = 'Afficher/Masquer les filtres de nœuds';
        miniToggle.style.position = 'absolute';
        miniToggle.style.top = '96px';
        miniToggle.style.left = '8px';
        miniToggle.style.zIndex = '9998';
        miniToggle.style.pointerEvents = 'auto';
        miniToggle.style.width = '36px';
        miniToggle.style.height = '36px';
        miniToggle.style.display = 'inline-flex';
        miniToggle.style.alignItems = 'center';
        miniToggle.style.justifyContent = 'center';
        miniToggle.style.borderRadius = '8px';
        miniToggle.style.background = 'rgba(255,255,255,0.9)';
        miniToggle.style.border = '2px solid white';
        miniToggle.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)';
        miniToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-700"><path d="M3 6.75A.75.75 0 0 1 3.75 6h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75Zm0 5.25a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75Z"/></svg>';
        container.appendChild(miniToggle);
      }
      let miniControls = document.getElementById('fs-mini-controls');
      if (!miniControls) {
        miniControls = document.createElement('div');
        miniControls.id = 'fs-mini-controls';
        miniControls.style.position = 'absolute';
        miniControls.style.top = '96px';
        miniControls.style.left = '52px';
        miniControls.style.zIndex = '9998';
        miniControls.style.display = 'none';
        miniControls.style.gap = '8px';
        miniControls.style.alignItems = 'flex-start';
        miniControls.style.textAlign = 'left';
        miniControls.style.opacity = '0';
        miniControls.style.transform = 'translateX(-16px)';
        miniControls.style.transition = 'opacity 220ms ease, transform 220ms ease';
        miniControls.style.pointerEvents = 'auto';
        miniControls.className = 'flex flex-col';
        miniControls.innerHTML = `
          <div class="flex items-center justify-start gap-2 w-full">
            <button id="fs-btn-tokens" type="button" title="Afficher les ingrédients" class="inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-white text-white shadow-sm transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1024 1024" fill="currentColor" class="w-4 h-4"><path d="M128 352.576V352a288 288 0 0 1 491.072-204.224a192 192 0 0 1 274.24 204.48a64 64 0 0 1 57.216 74.24C921.6 600.512 850.048 710.656 736 756.992V800a96 96 0 0 1-96 96H384a96 96 0 0 1-96-96v-43.008c-114.048-46.336-185.6-156.48-214.528-330.496A64 64 0 0 1 128 352.64zm64-.576h64a160 160 0 0 1 320 0h64a224 224 0 0 0-448 0m128 0h192a96 96 0 0 0-192 0m439.424 0h68.544A128.256 128.256 0 0 0 704 192c-15.36 0-29.952 2.688-43.52 7.616c11.328 18.176 20.672 37.76 27.84 58.304A64.128 64.128 0 0 1 759.424 352M672 768H352v32a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32zm-342.528-64h365.056c101.504-32.64 165.76-124.928 192.896-288"/></svg>
            </button>
            <button id="fs-btn-recipes" type="button" title="Afficher les recettes" class="inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-white text-white shadow-sm transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path d="M6.723 1.054a.5.5 0 0 1 .265.335C7.006 1.468 7.5 3.582 7.5 5c0 .95-.442 1.797-1.13 2.346c-.25.2-.37.418-.37.6v.486q0 .035.004.066c.034.248.157 1.169.272 2.124c.113.937.224 1.959.224 2.378a2 2 0 1 1-4 0c0-.42.111-1.44.224-2.378c.115-.955.238-1.876.272-2.124L3 8.432v-.486c0-.182-.12-.4-.37-.6A3 3 0 0 1 1.5 5c0-1.413.49-3.516.512-3.61A.505.505 0 0 1 2.505 1c.28 0 .507.227.507.507v2.998A.495.495 0 1 0 4 4.5v-3a.5.5 0 0 1 1 0v3.026a.495.495 0 0 0 .99-.021v-3c0-.279.226-.505.506-.505c.022 0 .12 0 .227.054M9 5.5A4.5 4.5 0 0 1 13.5 1a.5.5 0 0 1 .5.5v5.973l.019.177a262 262 0 0 1 .229 2.24c.123 1.256.252 2.664.252 3.11a2 2 0 1 1-4 0c0-.446.129-1.854.252-3.11c.063-.637.126-1.247.173-1.699l.02-.191H10a1 1 0 0 1-1-1z"/></svg>
            </button>
            <button id="fs-btn-components" type="button" title="Afficher les composants" class="inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-white text-white shadow-sm transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M10 9.255C7.606 7.958 5.08 5.715 3 2m8.616 2.419C9.58 3.084 7.097 3.642 6.069 5.666s-.211 4.747 1.824 6.083c1.842 1.209 5.874 2.459 9.107-1.004c-3.03-1.29-3.35-4.99-5.384-6.326"/><path d="M4 11c-.64.47-1 1.005-1 1.572C3 14.465 7.03 16 12 16s9-1.535 9-3.428c0-.567-.36-1.101-1-1.572"/><path d="M21 13c0 3.577-2.506 6.715-5.205 8.482c-.555.364-1.215.518-1.878.518h-3.834c-.663 0-1.323-.154-1.878-.518C5.506 19.715 3 16.577 3 13"/></g></svg>
            </button>
          </div>
          <div class="flex items-center justify-start gap-2 mt-2 w-full">
            <button id="fs-layout-toggle" type="button" class="px-3 py-1 rounded-full border-2 border-white text-white shadow-sm transition"></button>
            <button id="fs-terminal-toggle" type="button" class="px-3 py-1 rounded-full border-2 border-white text-white shadow-sm transition" title="Masquer les terminaux"></button>
          </div>
          <div class="flex items-center justify-start gap-2 mt-2 w-full">
            <input id="fs-missing-tolerance" type="range" min="0" max="5" class="accent-primary w-28">
            <span id="fs-tolerance-value" class="text-black text-base w-8 text-center"></span>
            <button id="fs-infinite-toggle" type="button" class="px-3 py-1 rounded-full border-2 border-white text-white shadow-sm transition"></button>
          </div>
          <div class="flex items-center justify-start gap-2 mt-2 w-full">
            <input id="fs-hide-top" type="range" min="0" max="20" class="accent-primary w-28">
            <span id="fs-hide-top-value" class="text-black text-base w-8 text-center"></span>
            <span class="text-black text-base">Masquer top fréquents</span>
          </div>
          <div class="flex items-center justify-start gap-2 mt-2 w-full">
            <input id="fs-max-recipes" type="range" min="10" max="150" class="accent-primary w-28">
            <span id="fs-max-recipes-value" class="text-black text-base w-8 text-center"></span>
            <span class="text-black text-base">Max recettes</span>
          </div>
          <div class="flex items-center justify-start gap-2 mt-2 w-full">
            <input id="fs-max-ingredients" type="range" min="10" max="150" class="accent-primary w-28">
            <span id="fs-max-ingredients-value" class="text-black text-base w-8 text-center"></span>
            <span class="text-black text-base">Max ingrédients</span>
          </div>
        `;
        container.appendChild(miniControls);
        // Hook mini badges to underlying checkboxes
        const inTok = document.getElementById('show-tokens');
        const inRec = document.getElementById('show-recipes');
        const inComp = document.getElementById('show-components');
        const fsTok = miniControls.querySelector('#fs-btn-tokens');
        const fsRec = miniControls.querySelector('#fs-btn-recipes');
        const fsComp = miniControls.querySelector('#fs-btn-components');
        const linkModeSel = document.getElementById('link-mode');
        function setLinkMode(val){
          if (!linkModeSel) return;
          linkModeSel.value = val;
          linkModeSel.dispatchEvent(new Event('change', { bubbles: true }));
          if (window.pushControlsToUrl) window.pushControlsToUrl();
          if (window.updateFsLinkButtons) window.updateFsLinkButtons();
        }
        if (fsTok) fsTok.addEventListener('click', ()=> setLinkMode('recipe-token'));
        if (fsRec) fsRec.addEventListener('click', ()=> setLinkMode('recipe-recipe'));
        if (fsComp) fsComp.addEventListener('click', ()=> setLinkMode('token-token'));

        // Press (zoom) animation for badges/buttons
        function addPressAnim(el){
          if (!el) return;
          el.style.transition = (el.style.transition ? el.style.transition + ', ' : '') + 'transform 120ms ease';
          const reset = ()=>{ el.style.transform = 'scale(1)'; };
          el.addEventListener('pointerdown', ()=>{ el.style.transform = 'scale(0.94)'; });
          el.addEventListener('pointerup', reset);
          el.addEventListener('pointerleave', reset);
          el.addEventListener('blur', reset);
        }
        addPressAnim(fsTok);
        addPressAnim(fsRec);
        addPressAnim(fsComp);

        // Layout toggle (radial <-> force) button wiring
        const layoutSel = document.getElementById('layout-mode');
        const fsLayoutBtn = miniControls.querySelector('#fs-layout-toggle');
        function updateFsLayoutButton(){
          if (!fsLayoutBtn || !layoutSel) return;
          const mode = layoutSel.value === 'radial' ? 'radial' : 'force';
          fsLayoutBtn.textContent = mode;
          fsLayoutBtn.style.background = mode === 'radial' ? '#14b8a6' : '#d946ef';
        }
        window.updateFsLayoutButton = updateFsLayoutButton;
        if (fsLayoutBtn && layoutSel) {
          fsLayoutBtn.addEventListener('click', ()=>{
            const next = (layoutSel.value === 'radial') ? 'force' : 'radial';
            layoutSel.value = next;
            layoutSel.dispatchEvent(new Event('change', { bubbles: true }));
            updateFsLayoutButton();
            if (window.pushControlsToUrl) window.pushControlsToUrl();
          });
          updateFsLayoutButton();
          addPressAnim(fsLayoutBtn);
        }

        // Terminal nodes toggle
        const fsTermBtn = miniControls.querySelector('#fs-terminal-toggle');
        function updateFsTerminalButton(){
          const on = !!window.__hideTerminalNodes;
          fsTermBtn.textContent = on ? '∴ on' : '∴ off';
          fsTermBtn.style.background = on ? '#16a34a' : '#9ca3af';
        }
        if (fsTermBtn) {
          fsTermBtn.addEventListener('click', ()=>{
            window.__hideTerminalNodes = !window.__hideTerminalNodes;
            updateFsTerminalButton();
            if (typeof refresh === 'function') refresh();
            if (window.pushControlsToUrl) window.pushControlsToUrl();
          });
          updateFsTerminalButton();
          addPressAnim(fsTermBtn);
        }

        // FS link-mode buttons coloring based on the selected link mode
        function updateFsLinkButtons(){
          const val = linkModeSel ? linkModeSel.value : '';
          function setGreen(btn){ if (!btn) return; btn.classList.remove('bg-red-600'); btn.classList.add('bg-green-600'); }
          function setRed(btn){ if (!btn) return; btn.classList.remove('bg-green-600'); btn.classList.add('bg-red-600'); }
          if (val === 'recipe-token') { setGreen(fsTok); setRed(fsRec); setRed(fsComp); }
          else if (val === 'recipe-recipe') { setGreen(fsRec); setRed(fsTok); setRed(fsComp); }
          else if (val === 'token-token') { setGreen(fsComp); setRed(fsTok); setRed(fsRec); }
          else { setRed(fsTok); setRed(fsRec); setRed(fsComp); }
        }
        window.updateFsLinkButtons = updateFsLinkButtons;
        updateFsLinkButtons();

        // Tolerance controls (mirror of main controls)
        const mainTolRange = document.getElementById('missing-tolerance');
        const mainTolValue = document.getElementById('tolerance-value');
        const mainInfToggle = document.getElementById('infinite-tolerance');
        const fsTolRange = miniControls.querySelector('#fs-missing-tolerance');
        const fsInfBtn = miniControls.querySelector('#fs-infinite-toggle');
        const fsTolValue = miniControls.querySelector('#fs-tolerance-value');
        function updateFsToleranceControls(){
          if (fsTolRange && mainTolRange) fsTolRange.value = String(mainTolRange.value);
          if (fsTolValue && mainTolRange) fsTolValue.textContent = String(mainTolRange.value);
          if (fsInfBtn && mainInfToggle) {
            const active = !!mainInfToggle.checked;
            fsInfBtn.textContent = active ? 'Tolérance ∞' : 'Tolérance finie';
            fsInfBtn.style.background = active ? '#16a34a' : '#9ca3af';
          }
        }
        window.updateFsToleranceControls = updateFsToleranceControls;
        if (fsTolRange && mainTolRange && mainTolValue) {
          fsTolRange.addEventListener('input', ()=>{
            mainTolRange.value = fsTolRange.value;
            mainTolValue.textContent = fsTolRange.value;
            if (fsTolValue) fsTolValue.textContent = fsTolRange.value;
            state.missingTolerance = Number(fsTolRange.value);
            if (typeof refresh === 'function') refresh();
            if (window.pushControlsToUrl) window.pushControlsToUrl();
          });
        }
        if (fsInfBtn && mainInfToggle) {
          fsInfBtn.addEventListener('click', ()=>{
            mainInfToggle.checked = !mainInfToggle.checked;
            mainInfToggle.dispatchEvent(new Event('change', { bubbles: true }));
            updateFsToleranceControls();
            if (window.pushControlsToUrl) window.pushControlsToUrl();
          });
          addPressAnim(fsInfBtn);
        }
        // Keep FS tolerance in sync when main controls change
        if (mainTolRange) mainTolRange.addEventListener('input', updateFsToleranceControls);
        if (mainInfToggle) mainInfToggle.addEventListener('change', updateFsToleranceControls);
        updateFsToleranceControls();

        // Hide-top-ingredients controls (mirror main controls)
        const mainHideTop = document.getElementById('hide-top-ingredients');
        const mainHideTopValue = document.getElementById('hide-top-ingredients-value');
        const fsHideTop = miniControls.querySelector('#fs-hide-top');
        const fsHideTopValue = miniControls.querySelector('#fs-hide-top-value');
        const fsMaxRec = miniControls.querySelector('#fs-max-recipes');
        const fsMaxRecValue = miniControls.querySelector('#fs-max-recipes-value');
        const fsMaxIng = miniControls.querySelector('#fs-max-ingredients');
        const fsMaxIngValue = miniControls.querySelector('#fs-max-ingredients-value');
        function updateFsHideTopControls(){
          if (fsHideTop && mainHideTop) fsHideTop.value = String(mainHideTop.value);
          if (fsHideTopValue && mainHideTop) fsHideTopValue.textContent = String(mainHideTop.value);
        }
        window.updateFsHideTopControls = updateFsHideTopControls;
        if (fsHideTop && mainHideTop && mainHideTopValue) {
          fsHideTop.addEventListener('input', ()=>{
            mainHideTop.value = fsHideTop.value;
            mainHideTopValue.textContent = fsHideTop.value;
            if (fsHideTopValue) fsHideTopValue.textContent = fsHideTop.value;
            if (typeof refresh === 'function') refresh();
            if (window.pushControlsToUrl) window.pushControlsToUrl();
          });
        }
        if (mainHideTop) mainHideTop.addEventListener('input', updateFsHideTopControls);
        updateFsHideTopControls();

        // Max recipes / ingredients controls (mirror main controls)
        const mainMaxRec = document.getElementById('max-recipes');
        const mainMaxRecValue = document.getElementById('max-recipes-value');
        const mainMaxIng = document.getElementById('max-ingredients');
        const mainMaxIngValue = document.getElementById('max-ingredients-value');

        function updateFsMaxControls(){
          if (fsMaxRec && mainMaxRec) fsMaxRec.value = String(mainMaxRec.value);
          if (fsMaxRecValue && mainMaxRec) fsMaxRecValue.textContent = String(mainMaxRec.value);
          if (fsMaxIng && mainMaxIng) fsMaxIng.value = String(mainMaxIng.value);
          if (fsMaxIngValue && mainMaxIng) fsMaxIngValue.textContent = String(mainMaxIng.value);
        }
        window.updateFsMaxControls = updateFsMaxControls;
        if (fsMaxRec && mainMaxRec && mainMaxRecValue) {
          fsMaxRec.addEventListener('input', ()=>{
            mainMaxRec.value = fsMaxRec.value;
            mainMaxRecValue.textContent = fsMaxRec.value;
            if (fsMaxRecValue) fsMaxRecValue.textContent = fsMaxRec.value;
            if (typeof refresh === 'function') refresh();
            if (window.pushControlsToUrl) window.pushControlsToUrl();
          });
        }
        if (fsMaxIng && mainMaxIng && mainMaxIngValue) {
          fsMaxIng.addEventListener('input', ()=>{
            mainMaxIng.value = fsMaxIng.value;
            mainMaxIngValue.textContent = fsMaxIng.value;
            if (fsMaxIngValue) fsMaxIngValue.textContent = fsMaxIng.value;
            if (typeof refresh === 'function') refresh();
            if (window.pushControlsToUrl) window.pushControlsToUrl();
          });
        }
        if (mainMaxRec) mainMaxRec.addEventListener('input', updateFsMaxControls);
        if (mainMaxIng) mainMaxIng.addEventListener('input', updateFsMaxControls);
        updateFsMaxControls();
      }
      // Toggle behavior for mini accordion
      if (miniToggle) {
        miniToggle.onclick = () => {
          if (!miniControls) return;
          const rows = Array.from(miniControls.children).filter(el => el && el.tagName === 'DIV');
          const isHidden = miniControls.style.display === 'none' || miniControls.style.display === '';
          const transMs = 220;
          const staggerMs = 80;
          if (isHidden) {
            miniControls.style.display = 'flex';
            // prepare rows initial state
            rows.forEach(row => {
              row.style.opacity = '0';
              row.style.transform = 'translateX(-16px)';
              row.style.transition = `opacity ${transMs}ms ease, transform ${transMs}ms ease`;
            });
            // animate container and rows in sequence
            requestAnimationFrame(()=>{
              miniControls.style.opacity = '1';
              miniControls.style.transform = 'translateX(0)';
              miniControls.style.pointerEvents = 'auto';
              rows.forEach((row, i) => {
                setTimeout(()=>{
                  row.style.opacity = '1';
                  row.style.transform = 'translateX(0)';
                }, i * staggerMs);
              });
            });
          } else {
            // animate rows out with stagger, then container
            rows.forEach((row, i) => {
              setTimeout(()=>{
                row.style.opacity = '0';
                row.style.transform = 'translateX(-16px)';
              }, i * staggerMs);
            });
            miniControls.style.pointerEvents = 'none';
            const total = transMs + (Math.max(0, rows.length - 1) * staggerMs) + 20;
            setTimeout(()=>{
              miniControls.style.opacity = '0';
              miniControls.style.transform = 'translateX(-16px)';
            }, total - transMs);
            setTimeout(()=>{ miniControls.style.display = 'none'; }, total);
          }
        };
        // press animation for toggle button too
        (function(){
          miniToggle.style.transition = (miniToggle.style.transition ? miniToggle.style.transition + ', ' : '') + 'transform 120ms ease';
          const reset = ()=>{ miniToggle.style.transform = 'scale(1)'; };
          miniToggle.addEventListener('pointerdown', ()=>{ miniToggle.style.transform = 'scale(0.94)'; });
          miniToggle.addEventListener('pointerup', reset);
          miniToggle.addEventListener('pointerleave', reset);
          miniToggle.addEventListener('blur', reset);
        })();
      }
      // Show/hide based on fullscreen state and update colors
      if (miniToggle) miniToggle.style.display = showControls ? 'inline-flex' : 'none';
      if (miniControls) miniControls.style.display = (showControls ? miniControls.style.display : 'none');
      if (showControls && typeof window.updateNodeBadges === 'function') window.updateNodeBadges();
      if (showControls && typeof window.updateFsLayoutButton === 'function') window.updateFsLayoutButton();
    }
    document.addEventListener('fullscreenchange', ensureFsButton, { signal: fgSignal });
    window.addEventListener('resize', ensureFsButton, { signal: fgSignal });
    ensureFsButton();
    // Show/hide overlay: only show in fullscreen (both desktop and mobile)
    function updateFsOverlayVisibility(){
      const wrap = document.getElementById('fs-overlay');
      const container = document.getElementById('force-container');
      const inFs = !!document.fullscreenElement && document.fullscreenElement === container;
      if (wrap) wrap.style.display = inFs ? 'block' : 'none';
    }
    document.addEventListener('fullscreenchange', updateFsOverlayVisibility, { signal: fgSignal });
    window.addEventListener('resize', updateFsOverlayVisibility, { signal: fgSignal });
    updateFsOverlayVisibility();
  }

  function updateAdvancedViz(items) {
    const panel = document.getElementById('advanced-viz-panel');
    if (panel.classList.contains('hidden')) return; // do nothing when hidden
    renderForceGraph(items);
  }

  // -----------------------------
  // Catégories (chips + counts)
  // -----------------------------
  function getFilteredWithoutCategoryFilter() {
    const prev = state.activeCategoryIds;
    state.activeCategoryIds = new Set();
    const result = ITEMS.filter(itemMatches);
    state.activeCategoryIds = prev;
    return result;
  }

  function renderCategoryChips() {
    const container = $('#adv-categories');
    if (!container || !HOME_CATEGORIES || !HOME_CATEGORIES.length) return;
    const baseFiltered = getFilteredWithoutCategoryFilter();
    const categoriesForUi = HOME_CATEGORIES.filter(c => c.mode !== 'other');
    const countByCat = new Map();
    for (const cat of categoriesForUi) countByCat.set(cat.id, 0);
    for (const it of baseFiltered) {
      for (const cid of (it.categoryIds || [])) {
        if (countByCat.has(cid)) countByCat.set(cid, countByCat.get(cid) + 1);
      }
    }
    const sorted = categoriesForUi.slice().sort((a, b) => (countByCat.get(b.id) || 0) - (countByCat.get(a.id) || 0));
    container.innerHTML = '';
    if (state.activeCategoryIds && state.activeCategoryIds.size > 0) {
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.title = 'Effacer les catégories';
      clearBtn.setAttribute('aria-label', 'Effacer les catégories');
      clearBtn.className = 'inline-flex items-center justify-center w-8 h-8 rounded-full border border-primary text-white bg-primary shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40';
      clearBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4"><path d="M6 6l12 12M18 6l-12 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      clearBtn.addEventListener('click', () => {
        state.activeCategoryIds.clear();
        renderCategoryChips();
        refresh();
        if (typeof window.pushControlsToUrl === 'function') window.pushControlsToUrl();
        if (window.syncMobileAccordionUI) { try { window.syncMobileAccordionUI(); } catch (_) {} }
      });
      container.appendChild(clearBtn);
      const spacer = document.createElement('span');
      spacer.className = 'w-2';
      container.appendChild(spacer);
    }
    for (const cat of sorted) {
      const btn = document.createElement('button');
      btn.type = 'button';
      const active = state.activeCategoryIds && state.activeCategoryIds.has(cat.id);
      btn.className = active
        ? 'px-3 py-1 rounded-full border border-primary bg-primary text-white text-sm transition'
        : 'px-3 py-1 rounded-full border border-red-200 bg-white text-red-900 hover:bg-red-50 text-sm transition';
      const labelSpan = document.createElement('span');
      labelSpan.textContent = cat.label;
      btn.appendChild(labelSpan);
      const cnt = countByCat.get(cat.id) || 0;
      if (cnt > 0) {
        const badge = document.createElement('span');
        badge.className = 'ml-2 inline-flex items-center justify-center text-xs rounded-full bg-white/90 text-red-900 border border-red-200 w-5 h-5';
        if (active) badge.className = 'ml-2 inline-flex items-center justify-center text-xs rounded-full bg-white/20 text-white border border-white w-5 h-5';
        badge.textContent = String(cnt);
        btn.appendChild(badge);
      }
      btn.addEventListener('click', () => {
        if (!state.activeCategoryIds) state.activeCategoryIds = new Set();
        if (state.activeCategoryIds.has(cat.id)) state.activeCategoryIds.delete(cat.id);
        else state.activeCategoryIds.add(cat.id);
        renderCategoryChips();
        refresh();
        if (typeof window.pushControlsToUrl === 'function') window.pushControlsToUrl();
        if (window.syncMobileAccordionUI) { try { window.syncMobileAccordionUI(); } catch (_) {} }
      });
      container.appendChild(btn);
    }
  }

  // -----------------------------
  // "Ajoutez un ingrédient" suggestions (mode "J'ai ces ingrédients")
  // -----------------------------
  function renderAddIngredientSuggestions() {
    const host = document.getElementById('add-ingredient-suggestions');
    const listEl = document.getElementById('add-ingredient-list');
    if (!host || !listEl) return;
    if (state.mode !== 'what_i_have') {
      host.classList.add('hidden');
      return;
    }
    const sel = new Set(Array.from(state.selectedTags).map(function(s) { return String(s).toLowerCase().trim(); }));
    const pool = ITEMS.filter(itemMatches);
    const impactByTag = new Map();
    for (const it of pool) {
      const ing = it.ingredientTags || [];
      for (const T of ing) {
        const t = String(T).toLowerCase().trim();
        if (sel.has(t)) continue;
        const rest = ing.filter(function(x) { return String(x).toLowerCase().trim() !== t; });
        const allRestInSel = rest.every(function(x) { return sel.has(String(x).toLowerCase().trim()); });
        if (allRestInSel) impactByTag.set(t, (impactByTag.get(t) || 0) + 1);
      }
    }
    const sorted = Array.from(impactByTag.entries()).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 15);
    if (sorted.length === 0) {
      host.classList.add('hidden');
      return;
    }
    host.classList.remove('hidden');
    listEl.innerHTML = '';
    for (const [tag, count] of sorted) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'px-3 py-1 rounded-full border border-primary bg-white text-primary hover:bg-red-50 text-sm transition';
      btn.textContent = tag + ' → ' + count + (count === 1 ? ' recette' : ' recettes');
      btn.addEventListener('click', function() {
        state.selectedTags.add(tag);
        updateSelectedChips();
        refresh();
        if (typeof window.pushControlsToUrl === 'function') window.pushControlsToUrl();
      });
      listEl.appendChild(btn);
    }
  }

  // -----------------------------
  // Rafraîchissement global
  // -----------------------------
  function refresh() {
    const filtered = getFiltered();
    renderSuggestions(filtered);
    renderResults(filtered);
    renderCategoryChips();
    renderAddIngredientSuggestions();
    updateCharts(filtered);
    updateAdvancedViz(filtered);
    renderRecommendations(filtered);
  }

  // -----------------------------
  // Listeners
  // -----------------------------
  function runInit() {
    var t0 = performance.now();
    console.log("[rc-vt] runInit START", t0.toFixed(1));
    renderSuggestions(getFiltered());
    console.log("[rc-vt] after renderSuggestions", (performance.now() - t0).toFixed(1), "ms");
    updateSelectedChips();
    console.log("[rc-vt] after updateSelectedChips", (performance.now() - t0).toFixed(1), "ms");
    refresh();
    console.log("[rc-vt] after refresh", (performance.now() - t0).toFixed(1), "ms");
    // If coming from a recipe on mobile and requested, scroll to results
    (function(){
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const params = new URLSearchParams(location.search);
      if (!isMobile) return;
      if (params.get('autoScroll') === '1' || params.get('reco') === '1') {
        const target = document.getElementById('result-count');
        if (!target) return;
        // Wait a frame to ensure layout is ready
        setTimeout(()=>{ try { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(_) {} }, 60);
      }
    })();

    // Hide navbar by default on search page (mobile + desktop)
    (function(){
      const nav = document.querySelector('body > nav');
      if (!nav) return;
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      if (isMobile) {
        // Mobile: start hidden via transition-friendly classes
        nav.classList.remove('nav-visible');
        nav.classList.add('nav-hidden');
      } else {
        // Desktop: start hidden; still togglable via the sidebar button (inline display override)
        nav.style.display = 'none';
      }
    })();

    // (#include-components control removed — components are always included; URL param ?components=0 still respected on load.)
    const range = $('#missing-tolerance');
    const tolLabel = $('#tolerance-value');
    range.addEventListener('input', (e)=>{ state.missingTolerance = Number(e.target.value); tolLabel.textContent = e.target.value; refresh(); });
    const infToggle = document.getElementById('infinite-tolerance');
    const tolGroup = document.getElementById('tolerance-group');
    function applyToleranceVisibility(){
      tolGroup.style.display = state.infiniteTolerance ? 'none' : '';
    }
    infToggle.addEventListener('change', (e)=>{
      state.infiniteTolerance = e.target.checked;
      applyToleranceVisibility();
      refresh();
    });
    applyToleranceVisibility();

    // Stylish UI for Infinite Tolerance toggle
    (function(){
      const input = document.getElementById('infinite-tolerance');
      const btn = document.getElementById('infinite-toggle-ui');
      if (!input || !btn) return;
      function syncUi(){
        const on = !!input.checked;
        btn.textContent = on ? 'Tolérance ∞' : 'Tolérance finie';
        btn.style.background = on ? '#16a34a' : '#ef4444';
        btn.style.transform = 'scale(1)';
      }
      // initial styles
      btn.style.transition = 'transform 160ms ease, background-color 220ms ease, opacity 200ms ease';
      syncUi();
      btn.addEventListener('click', ()=>{
        // zoom in-out effect
        btn.style.transform = 'scale(0.94)';
        setTimeout(()=>{ btn.style.transform = 'scale(1)'; }, 120);
        input.checked = !input.checked;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        syncUi();
        if (window.updateFsToleranceControls) window.updateFsToleranceControls();
        if (window.pushControlsToUrl) window.pushControlsToUrl();
      });
      // Keep UI synced if checkbox changes from elsewhere (e.g., PJAX/FS-mini)
      input.addEventListener('change', syncUi);
    })();

    // Tolerance help accordion and ? button
    (function(){
      const helpToggle = document.getElementById('tolerance-help-toggle');
      const accordion = document.getElementById('tolerance-help-accordion');
      if (!helpToggle || !accordion) return;
      function setOpen(open) {
        if (open) {
          accordion.classList.add('open');
          helpToggle.classList.remove('bg-gray-300', 'text-gray-600', 'hover:bg-gray-400');
          helpToggle.classList.add('bg-green-600', 'text-white', 'hover:bg-green-500');
        } else {
          accordion.classList.remove('open');
          helpToggle.classList.remove('bg-green-600', 'text-white', 'hover:bg-green-500');
          helpToggle.classList.add('bg-gray-300', 'text-gray-600', 'hover:bg-gray-400');
        }
      }
      setOpen(false);
      helpToggle.addEventListener('click', () => {
        const isOpen = accordion.classList.contains('open');
        setOpen(!isOpen);
      });
    })();

    // Title search
    const titleSearchEl = document.getElementById('title-search');
    const titleSearchClearEl = document.getElementById('title-search-clear');
    function updateTitleSearchClearVisibility() {
      const v = titleSearchEl ? titleSearchEl.value.trim() : '';
      if (titleSearchClearEl) titleSearchClearEl.classList.toggle('hidden', !v);
    }
    if (titleSearchEl) {
      let titleUrlTimer = null;
      titleSearchEl.addEventListener('input', () => {
        state.titleQuery = titleSearchEl.value.trim();
        updateTitleSearchClearVisibility();
        refresh();
        // Debounce URL/QR sync so each keystroke doesn't rebuild the QR canvas.
        if (titleUrlTimer) clearTimeout(titleUrlTimer);
        titleUrlTimer = setTimeout(() => {
          titleUrlTimer = null;
          if (typeof window.pushControlsToUrl === 'function') window.pushControlsToUrl();
        }, 250);
        if (window.syncMobileAccordionUI) { try { window.syncMobileAccordionUI(); } catch (_) {} }
      });
    }
    if (titleSearchClearEl) {
      titleSearchClearEl.addEventListener('click', () => {
        if (titleSearchEl) titleSearchEl.value = '';
        state.titleQuery = '';
        updateTitleSearchClearVisibility();
        refresh();
        if (typeof window.pushControlsToUrl === 'function') window.pushControlsToUrl();
        if (titleSearchEl) titleSearchEl.focus();
      });
    }
    updateTitleSearchClearVisibility();
    // Removed ingredient input/autocomplete handlers

    const tagInput = $('#tag-input');
    const tagAuto = $('#tag-autocomplete');
    tagInput.addEventListener('keydown', (e)=>{
      if (e.key === 'Enter') {
        const v = e.target.value.trim();
        if (v) { state.selectedTags.add(v); e.target.value=''; updateSelectedChips(); refresh(); }
      }
    });
    tagInput.addEventListener('input', (e)=>{
      const q = e.target.value.trim().toLowerCase();
      const tagPool = (state.mode === 'what_i_have')
        ? Array.from(ALL_TAGS.keys()).filter(function(k) { return INGREDIENT_TAG_IDS.has(String(k).toLowerCase().trim()); })
        : Array.from(ALL_TAGS.keys());
      const candidates = tagPool.filter(k => !state.selectedTags.has(k) && k.toLowerCase().includes(q)).slice(0, 20);
      if (q && candidates.length) {
        tagAuto.innerHTML = '';
        for (const c of candidates) {
          tagAuto.appendChild(autocompleteItem(c, ()=>{ state.selectedTags.add(c); tagInput.value=''; tagAuto.classList.add('hidden'); updateSelectedChips(); refresh(); }));
        }
        tagAuto.classList.remove('hidden');
      } else {
        tagAuto.classList.add('hidden');
      }
    });
    document.addEventListener('click', (e)=>{ if (!tagAuto.contains(e.target) && e.target !== tagInput) tagAuto.classList.add('hidden'); });

    function applyModeBasedUI() {
      const isWhatIHave = (state.mode === 'what_i_have');
      const wrapper = document.getElementById('tolerance-controls-for-tag-mode');
      const tagInputEl = document.getElementById('tag-input');
      if (wrapper) wrapper.classList.toggle('hidden', isWhatIHave);
      if (tagInputEl) tagInputEl.placeholder = isWhatIHave ? 'Ajouter un ingrédient possédé' : 'Ajouter un tag de filtre';
      if (isWhatIHave) {
        const accordion = document.getElementById('tolerance-help-accordion');
        const helpToggle = document.getElementById('tolerance-help-toggle');
        if (accordion) accordion.classList.remove('open');
        if (helpToggle) {
          helpToggle.classList.remove('bg-green-600', 'text-white', 'hover:bg-green-500');
          helpToggle.classList.add('bg-gray-300', 'text-gray-600', 'hover:bg-gray-400');
        }
      }
    }

    const searchModeEl = document.getElementById('search-mode');
    if (searchModeEl) searchModeEl.addEventListener('change', function() {
      state.mode = this.value;
      applyModeBasedUI();
      updateSelectedChips();
      refresh();
      if (typeof window.pushControlsToUrl === 'function') window.pushControlsToUrl();
      if (window.syncMobileAccordionUI) { try { window.syncMobileAccordionUI(); } catch (_) {} }
    });
    applyModeBasedUI();

    // Mobile-only accordion sections (name, categories, tags)
    (function() {
      var mobileAccordionOpen = { name: false, categories: false, tags: false };
      function isMobile() { return window.matchMedia && window.matchMedia('(max-width: 767px)').matches; }
      function nameActive() {
        var el = document.getElementById('title-search');
        return el && (el.value || '').trim().length > 0;
      }
      function categoriesActive() {
        return state.activeCategoryIds && state.activeCategoryIds.size > 0;
      }
      function tagsActive() {
        return (state.selectedTags && state.selectedTags.size > 0) || state.mode === 'what_i_have';
      }
      window.isMobileSectionEnabled = function(sectionId) {
        return !!mobileAccordionOpen[sectionId];
      };
      function setSectionOpen(sectionId, open) {
        var body = document.getElementById('mobile-accordion-body-' + sectionId);
        var trigger = document.getElementById('mobile-accordion-trigger-' + sectionId);
        if (!body || !trigger) return;
        mobileAccordionOpen[sectionId] = open;
        body.classList.toggle('mobile-accordion-body--closed', !open);
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (typeof refresh === 'function') refresh();
        syncMobileAccordionUI();
        if (typeof window.pushControlsToUrl === 'function') window.pushControlsToUrl();
      }
      function syncMobileAccordionUI() {
        var triggers = [
          { id: 'name', active: mobileAccordionOpen.name },
          { id: 'categories', active: mobileAccordionOpen.categories },
          { id: 'tags', active: mobileAccordionOpen.tags }
        ];
        triggers.forEach(function(t) {
          var trigger = document.getElementById('mobile-accordion-trigger-' + t.id);
          if (trigger) {
            if (t.active) trigger.classList.add('mobile-accordion-trigger--active');
            else trigger.classList.remove('mobile-accordion-trigger--active');
          }
          var body = document.getElementById('mobile-accordion-body-' + t.id);
          if (body) {
            var open = mobileAccordionOpen[t.id];
            body.classList.toggle('mobile-accordion-body--closed', !open);
            if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
          }
        });
        var tagsTagBtn = document.getElementById('mobile-tags-mode-tag');
        var tagsIngBtn = document.getElementById('mobile-tags-mode-ingredients');
        if (tagsTagBtn) {
          if (mobileAccordionOpen.tags && state.mode === 'tag') tagsTagBtn.classList.add('mobile-accordion-trigger--active');
          else tagsTagBtn.classList.remove('mobile-accordion-trigger--active');
        }
        if (tagsIngBtn) {
          if (mobileAccordionOpen.tags && state.mode === 'what_i_have') tagsIngBtn.classList.add('mobile-accordion-trigger--active');
          else tagsIngBtn.classList.remove('mobile-accordion-trigger--active');
        }
      }
      function initMobileAccordionState() {
        // On desktop, sections are always visible and filters are active by default.
        // The mobile-tags-mode buttons still act as a toggle: clicking the active button
        // collapses the section, which deactivates the corresponding filter on both viewports.
        if (!isMobile()) {
          mobileAccordionOpen.name = true;
          mobileAccordionOpen.categories = true;
          mobileAccordionOpen.tags = true;
        } else {
          mobileAccordionOpen.name = nameActive();
          mobileAccordionOpen.categories = categoriesActive();
          mobileAccordionOpen.tags = tagsActive();
        }
        syncMobileAccordionUI();
      }
      ['name','categories'].forEach(function(sectionId) {
        var trigger = document.getElementById('mobile-accordion-trigger-' + sectionId);
        if (!trigger) return;
        trigger.addEventListener('click', function(e) {
          var open = !mobileAccordionOpen[sectionId];
          setSectionOpen(sectionId, open);
        });
      });
      var tagsTagBtn = document.getElementById('mobile-tags-mode-tag');
      var tagsIngBtn = document.getElementById('mobile-tags-mode-ingredients');
      var searchModeSelect = document.getElementById('search-mode');
      function setTagsMode(mode) {
        state.mode = mode;
        if (searchModeSelect) searchModeSelect.value = mode;
        mobileAccordionOpen.tags = true;
        if (typeof applyModeBasedUI === 'function') applyModeBasedUI();
        if (typeof updateSelectedChips === 'function') updateSelectedChips();
        if (typeof refresh === 'function') refresh();
        if (typeof window.pushControlsToUrl === 'function') window.pushControlsToUrl();
        syncMobileAccordionUI();
      }
      function collapseTagsSection() {
        mobileAccordionOpen.tags = false;
        if (typeof refresh === 'function') refresh();
        syncMobileAccordionUI();
      }
      if (tagsTagBtn) tagsTagBtn.addEventListener('click', function() {
        if (mobileAccordionOpen.tags && state.mode === 'tag') collapseTagsSection();
        else setTagsMode('tag');
      });
      if (tagsIngBtn) tagsIngBtn.addEventListener('click', function() {
        if (mobileAccordionOpen.tags && state.mode === 'what_i_have') collapseTagsSection();
        else setTagsMode('what_i_have');
      });
      initMobileAccordionState();
      window.syncMobileAccordionUI = syncMobileAccordionUI;
      window.initMobileAccordionState = initMobileAccordionState;
      window.getAccordionOpenForUrl = function() {
        return { name: mobileAccordionOpen.name, categories: mobileAccordionOpen.categories, tags: mobileAccordionOpen.tags };
      };
      window.applyAccordionOpenFromUrl = function(openParam) {
        if (!openParam || typeof openParam !== 'string') return;
        var parts = openParam.split(',').map(function(p) { return p.trim().toLowerCase(); }).filter(Boolean);
        mobileAccordionOpen.name = parts.indexOf('name') !== -1;
        mobileAccordionOpen.categories = parts.indexOf('categories') !== -1;
        mobileAccordionOpen.tags = parts.indexOf('tags') !== -1;
        syncMobileAccordionUI();
      };
    })();

    $('#reset-tags').addEventListener('click', ()=>{ state.selectedTags.clear(); updateSelectedChips(); refresh(); });
    // reset-ingredients button was removed with hidden wrapper

    // Paramètres URL (?q= & tags=x,y & cat= & mode= & open=name,categories,tags & components=1 & viz=1 & edge=uniform|freq|idf & impact=0..100 & mr= & mi= & ht= & st/sr/sc=0|1)
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const tags = params.get('tags');
    const comp = params.get('components');
    const viz = params.get('viz');
    const inf = params.get('inf');
    const linkPref = params.get('links');
    const ew = params.get('edge');
    const modeParam = params.get('mode');
    const layoutParam = params.get('layout');
    const mt = params.get('mt');
    const hist = params.get('hist');
    const gsParam = params.get('gs');
    const ei = params.get('impact');
    const mr = params.get('mr');
    const mi = params.get('mi');
    const ht = params.get('ht');
    const st = params.get('st');
    const sr = params.get('sr');
    const sc = params.get('sc');
    if (q) {
      state.titleQuery = q;
      state.query = q;
      const ti = document.getElementById('title-search');
      if (ti) ti.value = q;
    }
    if (tags) {
      // Accept legacy comma- and pipe-separated forms; normalize each tag to
      // lowercase + trimmed so URL bookmarks survive case variation.
      tags.split(/[,|]/).forEach(t => {
        const v = String(t || '').trim().toLowerCase();
        if (v) state.selectedTags.add(v);
      });
    }
    const catParam = params.get('cat');
    if (catParam) { catParam.split(',').filter(Boolean).forEach(id=>state.activeCategoryIds.add(id.trim())); }
    if (comp === '0') { state.includeComponents = false; }
    if (modeParam && (modeParam === 'tag' || modeParam === 'what_i_have')) { state.mode = modeParam; document.getElementById('search-mode').value = modeParam; }
    if (layoutParam && ['force','radial','circle','rings','spiral'].includes(layoutParam)) { document.getElementById('layout-mode').value = layoutParam; }
    if (typeof window.applyAccordionOpenFromUrl === 'function') window.applyAccordionOpenFromUrl(params.get('open'));
    // Apply infinite tolerance from URL and sync UI + dependent controls
    (function(){
      const infEl = document.getElementById('infinite-tolerance');
      if (!infEl) return;
      if (inf === '1' || inf === '0') {
        infEl.checked = (inf === '1');
        // Trigger change to update state, hide/show tolerance slider, refresh, and sync FS mini controls + styled button
        try { infEl.dispatchEvent(new Event('change', { bubbles: true })); } catch(_) {}
      }
    })();
    if (viz === '0') {
      const ap = document.getElementById('advanced-viz-panel');
      const ab = document.getElementById('toggle-advanced-viz');
      if (ap) ap.classList.add('hidden');
      if (ab) ab.textContent = 'Afficher';
    }
    if (viz === '1') {
      const ap = document.getElementById('advanced-viz-panel');
      const ab = document.getElementById('toggle-advanced-viz');
      if (ap) ap.classList.remove('hidden');
      if (ab) ab.textContent = 'Masquer';
    }
    if (mt) { state.missingTolerance = Number(mt); const mtEl = document.getElementById('missing-tolerance'); const mtLbl = document.getElementById('tolerance-value'); if (mtEl) mtEl.value = mt; if (mtLbl) mtLbl.textContent = mt; }
    if (ew && ['uniform','freq','idf'].includes(ew)) document.getElementById('edge-weight-mode').value = ew;
    if (linkPref && ['auto','recipe-token','token-token'].includes(linkPref)) document.getElementById('link-mode').value = linkPref;
    if (ei) { document.getElementById('edge-impact').value = ei; document.getElementById('edge-impact-value').textContent = ei; }
    if (mr) { document.getElementById('max-recipes').value = mr; document.getElementById('max-recipes-value').textContent = mr; }
    if (mi) { document.getElementById('max-ingredients').value = mi; document.getElementById('max-ingredients-value').textContent = mi; }
    if (ht) { document.getElementById('hide-top-ingredients').value = ht; document.getElementById('hide-top-ingredients-value').textContent = ht; }
    if (st) document.getElementById('show-tokens').checked = st === '1';
    if (sr) document.getElementById('show-recipes').checked = sr === '1';
    if (sc) document.getElementById('show-components').checked = sc === '1';
    if (hist === '1') { const hp = document.getElementById('histograms-panel'); const hb = document.getElementById('toggle-histograms'); if (hp) hp.classList.remove('hidden'); if (hb) hb.textContent = 'Masquer'; }
    if (hist === '0') { const hp = document.getElementById('histograms-panel'); const hb = document.getElementById('toggle-histograms'); if (hp) hp.classList.add('hidden'); if (hb) hb.textContent = 'Afficher'; }
    // graph-search param removed

    updateSelectedChips();
    // Re-sync mobile accordion state now that URL params have populated state.selectedTags / state.mode.
    // Without this, arriving at /recherche/?tags=foo leaves mobileAccordionOpen.tags = false because
    // initMobileAccordionState() ran before the URL was parsed, which would bypass tag filtering on mobile.
    if (typeof window.initMobileAccordionState === 'function') window.initMobileAccordionState();
    refresh();
    applyToleranceVisibility();

    // Advanced viz toggles
    const toggleBtn = document.getElementById('toggle-advanced-viz');
    const panel = document.getElementById('advanced-viz-panel');
    toggleBtn.addEventListener('click', ()=>{
      const isHidden = panel.classList.contains('hidden');
      panel.classList.toggle('hidden', isHidden ? false : true);
      toggleBtn.textContent = isHidden ? 'Masquer' : 'Afficher';
      refresh();
    });
    // Histograms accordion (mobile collapsed by default)
    const toggleHist = document.getElementById('toggle-histograms');
    const histPanel = document.getElementById('histograms-panel');
    if (toggleHist && histPanel) {
      toggleHist.addEventListener('click', ()=>{
        const isHidden = histPanel.classList.contains('hidden');
        histPanel.classList.toggle('hidden', isHidden ? false : true);
        toggleHist.textContent = isHidden ? 'Masquer' : 'Afficher';
        pushControlsToUrl();
      });
    }
    const maxRec = document.getElementById('max-recipes');
    const maxIng = document.getElementById('max-ingredients');
    maxRec.addEventListener('input', (e)=>{ document.getElementById('max-recipes-value').textContent = e.target.value; refresh(); });
    maxIng.addEventListener('input', (e)=>{ document.getElementById('max-ingredients-value').textContent = e.target.value; refresh(); });
    // prune-rare removed
    const hideTopCtrl = document.getElementById('hide-top-ingredients');
    hideTopCtrl.addEventListener('input', (e)=>{ document.getElementById('hide-top-ingredients-value').textContent = e.target.value; refresh(); });
    const linkModeSel = document.getElementById('link-mode');
    linkModeSel.addEventListener('change', ()=>{
      const val = linkModeSel.value;
      const showRecEl = document.getElementById('show-recipes');
      const showTokEl = document.getElementById('show-tokens');
      const showCompEl = document.getElementById('show-components');
      if (val === 'token-token') {
        if (showRecEl) showRecEl.checked = false;
        if (showTokEl) showTokEl.checked = true;
        if (showCompEl) showCompEl.checked = false; // hide components in tag-token-only link mode
        // force edge weight to frequency for token-token
        const ewSel = document.getElementById('edge-weight-mode');
        if (ewSel) ewSel.value = 'freq';
      } else if (val === 'recipe-token') {
        if (showRecEl) showRecEl.checked = true;
        if (showTokEl) showTokEl.checked = true;
        if (showCompEl) showCompEl.checked = true; // show components otherwise
        // force edge weight to selection (par tags) for recipe-token
        const ewSel = document.getElementById('edge-weight-mode');
        if (ewSel) ewSel.value = 'select';
      }
      if (val === 'recipe-recipe') {
        if (showRecEl) showRecEl.checked = true;
        if (showTokEl) showTokEl.checked = false;
        if (showCompEl) showCompEl.checked = true; // show components otherwise
        const ewSel = document.getElementById('edge-weight-mode');
        if (ewSel) ewSel.value = 'freq';
      }
      if (typeof window.updateNodeBadges === 'function') window.updateNodeBadges();
      if (typeof pushControlsToUrl === 'function') pushControlsToUrl();
      refresh();
    });
    const layoutSel = document.getElementById('layout-mode');
    layoutSel.addEventListener('change', ()=>{ refresh(); });
    document.getElementById('edge-weight-mode').addEventListener('change', ()=> refresh());
    const edgeImpact = document.getElementById('edge-impact');
    edgeImpact.addEventListener('input', (e)=>{ document.getElementById('edge-impact-value').textContent = e.target.value; refresh(); });
    // Icon badges wiring for node visibility (keeps checkbox logic intact)
    (function(){
      const inTok = document.getElementById('show-tokens');
      const inRec = document.getElementById('show-recipes');
      const inComp = document.getElementById('show-components');
      const btnTok = document.getElementById('btn-show-tokens');
      const btnRec = document.getElementById('btn-show-recipes');
      const btnComp = document.getElementById('btn-show-components');
      function applyBadge(btn, checked){
        if (!btn) return;
        btn.classList.remove('bg-green-600','bg-red-600');
        btn.classList.add(checked ? 'bg-green-600' : 'bg-red-600');
        btn.setAttribute('aria-pressed', checked ? 'true' : 'false');
      }
      function updateNodeBadges(){
        // Main badges
        applyBadge(btnTok, !!inTok?.checked);
        applyBadge(btnRec, !!inRec?.checked);
        applyBadge(btnComp, !!inComp?.checked);
        // Fullscreen-mini badges (if present)
        const fsTok = document.getElementById('fs-btn-tokens');
        const fsRec = document.getElementById('fs-btn-recipes');
        const fsComp = document.getElementById('fs-btn-components');
        if (window.updateFsLinkButtons) window.updateFsLinkButtons();
      }
      window.updateNodeBadges = updateNodeBadges;
      if (btnTok && inTok) btnTok.addEventListener('click', ()=>{ inTok.checked = !inTok.checked; inTok.dispatchEvent(new Event('change', { bubbles: true })); updateNodeBadges(); });
      if (btnRec && inRec) btnRec.addEventListener('click', ()=>{ inRec.checked = !inRec.checked; inRec.dispatchEvent(new Event('change', { bubbles: true })); updateNodeBadges(); });
      if (btnComp && inComp) btnComp.addEventListener('click', ()=>{ inComp.checked = !inComp.checked; inComp.dispatchEvent(new Event('change', { bubbles: true })); updateNodeBadges(); });
      if (inTok) inTok.addEventListener('change', ()=>{ updateNodeBadges(); refresh(); });
      if (inRec) inRec.addEventListener('change', ()=>{ updateNodeBadges(); refresh(); });
      if (inComp) inComp.addEventListener('change', ()=>{ updateNodeBadges(); refresh(); });
      // initial
      updateNodeBadges();
    })();
    const btnUnhideAll = document.getElementById('btn-unhide-all');
    btnUnhideAll.addEventListener('click', ()=>{ window.__hiddenTopBlacklist = new Set(); refresh(); });

    // Sync controls to URL
    function setParam(name, value) {
      const u = new URL(window.location);
      if (value === null || value === undefined || value === '') u.searchParams.delete(name);
      else u.searchParams.set(name, String(value));
      window.history.replaceState({}, '', u);
    }
    function pushControlsToUrl() {
      setParam('viz', panel.classList.contains('hidden') ? '0' : '1');
      setParam('links', document.getElementById('link-mode').value);
      setParam('edge', document.getElementById('edge-weight-mode').value);
      setParam('impact', document.getElementById('edge-impact').value);
      setParam('mr', document.getElementById('max-recipes').value);
      setParam('mi', document.getElementById('max-ingredients').value);
      setParam('ht', document.getElementById('hide-top-ingredients').value);
      setParam('mt', document.getElementById('missing-tolerance').value);
      setParam('hist', histPanel && !histPanel.classList.contains('hidden') ? '1' : '0');
      setParam('st', document.getElementById('show-tokens').checked ? '1' : '0');
      setParam('sr', document.getElementById('show-recipes').checked ? '1' : '0');
      setParam('sc', document.getElementById('show-components').checked ? '1' : '0');
      setParam('components', state.includeComponents ? '' : '0');
      setParam('inf', document.getElementById('infinite-tolerance').checked ? '1' : '0');
      setParam('mode', document.getElementById('search-mode').value);
      setParam('layout', document.getElementById('layout-mode').value);
      // dynamic filters
      const tagVals = Array.from(state.selectedTags);
      setParam('tags', tagVals.length ? tagVals.join(',') : '');
      setParam('q', state.titleQuery || '');
      setParam('cat', (state.activeCategoryIds && state.activeCategoryIds.size) ? Array.from(state.activeCategoryIds).join(',') : '');
      var openAcc = typeof window.getAccordionOpenForUrl === 'function' && window.getAccordionOpenForUrl();
      if (openAcc) {
        var openList = [];
        if (openAcc.name) openList.push('name');
        if (openAcc.categories) openList.push('categories');
        if (openAcc.tags) openList.push('tags');
        setParam('open', openList.join(','));
      } else {
        setParam('open', '');
      }
      if (typeof window.updateQrCode === 'function') window.updateQrCode();
      // graph-search removed
    }
    // Expose for external callers (chips updates, graph clicks, FS overlay)
    window.pushControlsToUrl = pushControlsToUrl;
    // Debounced variant for high-frequency `input` events (slider drag, text typing).
    // Without this, pushControlsToUrl + updateQrCode runs on every keystroke / slider tick
    // and rebuilds the QR canvas dozens of times per second.
    let pushUrlTimer = null;
    function pushControlsToUrlDebounced() {
      if (pushUrlTimer) clearTimeout(pushUrlTimer);
      pushUrlTimer = setTimeout(() => { pushUrlTimer = null; pushControlsToUrl(); }, 250);
    }
    const urlSyncControls = ['link-mode','layout-mode','edge-weight-mode','edge-impact','max-recipes','max-ingredients','hide-top-ingredients','missing-tolerance','show-tokens','show-recipes','show-components','infinite-tolerance','search-mode'];
    urlSyncControls.forEach(id => {
      const el = document.getElementById(id);
      const ev = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(ev, ev === 'input' ? pushControlsToUrlDebounced : pushControlsToUrl);
    });
    toggleBtn.addEventListener('click', pushControlsToUrl);
    document.getElementById('reset-tags').addEventListener('click', pushControlsToUrl);
    // graph-search listener removed

    // No undo history (supprimé)
    // Ensure URL is filled on initial load even if advanced panel remains closed
    pushControlsToUrl();
    // Initial recommendations
    renderRecommendations(getFiltered());
    // Initial recommendations
    renderRecommendations(getFiltered());

    // Mobile-only: fade away back button on scroll down, show on scroll up
    (function(){
      const btn = document.getElementById('mobile-back-btn');
      if (!btn) return;
      let lastY = window.scrollY || 0;
      window.addEventListener('scroll', ()=>{
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        if (!isMobile) return;
        const y = window.scrollY || 0;
        const goingDown = y > lastY && y > 6;
        const atTop = y <= 0;
        if (goingDown) btn.classList.add('btn-hidden');
        if (atTop || y < lastY) btn.classList.remove('btn-hidden');
        lastY = y;
      }, { passive: true });
    })();

    // If we navigated back with a request to restore fullscreen, do it (requires user gesture in many browsers)
    (function(){
      try {
        const flag = sessionStorage.getItem('recherche_restore_fs');
        if (flag === '1') {
          sessionStorage.removeItem('recherche_restore_fs');
          const container = document.getElementById('force-container');
          if (!container || !container.requestFullscreen) return;
          // Try immediately (may be blocked), then fall back to first user interaction
          const attempt = () => {
            if (document.fullscreenElement) return;
            try { container.requestFullscreen().catch(()=>{}); } catch(_) {}
          };
          // Immediate attempt after a short delay for layout
          setTimeout(attempt, 120);
          // One-time gesture-based retry
          const onInteract = () => {
            if (!document.fullscreenElement) attempt();
            document.removeEventListener('pointerdown', onInteract);
            document.removeEventListener('keydown', onInteract);
          };
          document.addEventListener('pointerdown', onInteract, { once: true });
          document.addEventListener('keydown', onInteract, { once: true });
        }
      } catch (_) {}
    })();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runInit, { once: true });
  } else {
    runInit();
  }

})();
