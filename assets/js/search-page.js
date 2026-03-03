// Advanced search page UI wiring for recherche.html.
// Relies on DATA, HOME_CATEGORIES, INGREDIENT_TAG_IDS, state, render* helpers, etc.

// -----------------------------
// Listeners
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
  // init suggestions
  renderSuggestions(getFiltered());
  updateSelectedChips();
  refresh();
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

  $('#include-components').addEventListener('change', (e)=>{ state.includeComponents = e.target.checked; refresh(); });
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

  // Title search
  const titleSearchEl = document.getElementById('title-search');
  const titleSearchClearEl = document.getElementById('title-search-clear');
  function updateTitleSearchClearVisibility() {
    const v = titleSearchEl ? titleSearchEl.value.trim() : '';
    if (titleSearchClearEl) titleSearchClearEl.classList.toggle('hidden', !v);
  }
  if (titleSearchEl) {
    titleSearchEl.addEventListener('input', () => {
      state.titleQuery = titleSearchEl.value.trim();
      updateTitleSearchClearVisibility();
      refresh();
      if (typeof window.pushControlsToUrl === 'function') window.pushControlsToUrl();
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
      mobileAccordionOpen.name = nameActive();
      mobileAccordionOpen.categories = categoriesActive();
      mobileAccordionOpen.tags = tagsActive();
      syncMobileAccordionUI();
    }
    ['name','categories'].forEach(function(sectionId) {
      var trigger = document.getElementById('mobile-accordion-trigger-' + sectionId);
      if (!trigger) return;
      trigger.addEventListener('click', function() {
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

  // Paramètres URL and control sync (mt, viz, hist, etc.)
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
  if (tags) { tags.split(',').forEach(t=>state.selectedTags.add(t)); }
  const catParam = params.get('cat');
  if (catParam) { catParam.split(',').filter(Boolean).forEach(id=>state.activeCategoryIds.add(id.trim())); }
  if (comp === '1') { state.includeComponents = true; $('#include-components').checked = true; }
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
    setParam('components', document.getElementById('include-components').checked ? '1' : '0');
    setParam('inf', document.getElementById('infinite-tolerance').checked ? '1' : '0');
    setParam('mode', document.getElementById('search-mode').value);
    setParam('layout', document.getElementById('layout-mode').value);
    // dynamic filters
    const tagVals = Array.from(state.selectedTags);
    setParam('tags', tagVals.length ? tagVals.join(',') : '');
    setParam('q', state.titleQuery || '');
    setParam('cat', (state.activeCategoryIds && state.activeCategoryIds.size) ? Array.from(state.activeCategoryIds).join(',') : '');
    const openAcc = typeof window.getAccordionOpenForUrl === 'function' && window.getAccordionOpenForUrl();
    if (openAcc) {
      const openList = [];
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
  const urlSyncControls = ['link-mode','layout-mode','edge-weight-mode','edge-impact','max-recipes','max-ingredients','hide-top-ingredients','missing-tolerance','show-tokens','show-recipes','show-components','include-components','infinite-tolerance','search-mode'];
  urlSyncControls.forEach(id => {
    const el = document.getElementById(id);
    const ev = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(ev, pushControlsToUrl);
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
});

