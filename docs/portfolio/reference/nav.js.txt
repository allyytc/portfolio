(function () {
  const RESUME_URL = 'allychen-resume2028-pm.pdf';

  function getPageFile() {
    const parts = window.location.pathname.split('/');
    const file = parts[parts.length - 1];
    return file || 'index.html';
  }

  function buildNavPaths() {
    const file = getPageFile();
    const isHome = file === '' || file === 'index.html';
    const onProjects = file === 'projects.html';
    const onInvolvement = file === 'involvement.html';

    const home = (hash) => (isHome ? hash : `index.html${hash}`);
    const homeRoot = isHome ? '#hero' : 'index.html';
    const projects = (hash = '') => {
      if (onProjects) return hash || 'projects.html';
      return `projects.html${hash}`;
    };
    const involvement = (hash = '') => {
      if (onInvolvement) return hash || 'involvement.html';
      return `involvement.html${hash}`;
    };

    return { home, homeRoot, projects, involvement };
  }

  function renderSiteNav() {
    const nav = document.getElementById('nav');
    if (!nav || nav.dataset.navBuilt === 'true') return;

    const { home, homeRoot, projects, involvement } = buildNavPaths();

    nav.innerHTML = `
    <div class="nav-inner">
      <div class="nav-item has-dropdown">
        <a href="${home('#about')}" class="nav-link">About Me</a>
        <div class="nav-dropdown">
          <a href="${home('#experience')}">Experience</a>
          <a href="${home('#skills')}">Skills</a>
          <a href="${home('#contact')}">Contact Me</a>
        </div>
      </div>
      <a href="${RESUME_URL}" class="nav-link nav-link--resume" target="_blank" rel="noopener">Resume</a>
      <div class="nav-item has-dropdown">
        <a href="${projects('')}" class="nav-link">Projects</a>
        <div class="nav-dropdown">
          <a href="${projects('#in-progress')}">In Progress</a>
          <a href="${projects('#hackathons')}">Hackathon Projects</a>
          <a href="${projects('#past-projects')}">Past Projects</a>
          <a href="${projects('#design-work')}">Design Work</a>
        </div>
      </div>
      <a href="${homeRoot}" class="nav-home">AC</a>
      <div class="nav-item has-dropdown">
        <a href="${involvement('')}" class="nav-link">Involvement</a>
        <div class="nav-dropdown">
          <span class="nav-dropdown-label">Clubs &amp; Orgs</span>
          <a href="${involvement('#clubs-coe')}" class="nav-dropdown-link--sub">Engineering Student Council</a>
          <a href="${involvement('#clubs-startup')}" class="nav-dropdown-link--sub">Startup Hub</a>
          <a href="${involvement('#clubs-dfa')}" class="nav-dropdown-link--sub">Design for America</a>
          <a href="${involvement('#clubs-bh')}" class="nav-dropdown-link--sub">BeaverHacks</a>
          <a href="${involvement('#clubs-ai')}" class="nav-dropdown-link--sub">AI Club</a>
        </div>
      </div>
      <div class="nav-item has-dropdown">
        <a href="${involvement('#events')}" class="nav-link">Events</a>
        <div class="nav-dropdown">
          <a href="beaverhacks-2026.html">BeaverHacks</a>
          <a href="innovation-jam-2026.html">Innovation Jam</a>
          <a href="eweek.html">Engineers' Week</a>
        </div>
      </div>
    </div>
    <div class="nav-mobile-bar">
      <a href="${homeRoot}" class="nav-home nav-mobile-home" aria-label="Home">AC</a>
      <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="nav-mobile-links" id="mobileLinks">
      <a href="${RESUME_URL}" class="nav-mobile-resume" target="_blank" rel="noopener">Resume</a>
      <div class="nav-mobile-group">
        <div class="nav-mobile-group-head">
          <a href="${home('#about')}" class="nav-mobile-group-link">About Me</a>
          <button type="button" class="nav-mobile-group-toggle" aria-expanded="false" aria-label="Toggle About Me submenu"></button>
        </div>
        <div class="nav-mobile-submenu">
          <a href="${home('#experience')}">Experience</a>
          <a href="${home('#skills')}">Skills</a>
          <a href="${home('#contact')}">Contact Me</a>
        </div>
      </div>
      <div class="nav-mobile-group">
        <div class="nav-mobile-group-head">
          <a href="${projects('')}" class="nav-mobile-group-link">Projects</a>
          <button type="button" class="nav-mobile-group-toggle" aria-expanded="false" aria-label="Toggle Projects submenu"></button>
        </div>
        <div class="nav-mobile-submenu">
          <a href="${projects('#in-progress')}">In Progress</a>
          <a href="${projects('#hackathons')}">Hackathon Projects</a>
          <a href="${projects('#past-projects')}">Past Projects</a>
          <a href="${projects('#design-work')}">Design Work</a>
        </div>
      </div>
      <div class="nav-mobile-group">
        <div class="nav-mobile-group-head">
          <a href="${involvement('')}" class="nav-mobile-group-link">Involvement</a>
          <button type="button" class="nav-mobile-group-toggle" aria-expanded="false" aria-label="Toggle Involvement submenu"></button>
        </div>
        <div class="nav-mobile-submenu">
          <span class="nav-mobile-submenu-label">Clubs &amp; Orgs</span>
          <a href="${involvement('#clubs-coe')}">Engineering Student Council</a>
          <a href="${involvement('#clubs-startup')}">Startup Hub</a>
          <a href="${involvement('#clubs-dfa')}">Design for America</a>
          <a href="${involvement('#clubs-bh')}">BeaverHacks</a>
          <a href="${involvement('#clubs-ai')}">AI Club</a>
        </div>
      </div>
      <div class="nav-mobile-group">
        <div class="nav-mobile-group-head">
          <a href="${involvement('#events')}" class="nav-mobile-group-link">Events</a>
          <button type="button" class="nav-mobile-group-toggle" aria-expanded="false" aria-label="Toggle Events submenu"></button>
        </div>
        <div class="nav-mobile-submenu">
          <a href="beaverhacks-2026.html">BeaverHacks</a>
          <a href="innovation-jam-2026.html">Innovation Jam</a>
          <a href="eweek.html">Engineers' Week</a>
        </div>
      </div>
    </div>`;

    nav.dataset.navBuilt = 'true';
    initNavBehavior();
  }

  function initNavBehavior() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const mobileLinks = document.getElementById('mobileLinks');

    if (nav) {
      const onScroll = () => nav.classList.toggle('nav-scrolled', window.scrollY > 10);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    if (toggle && mobileLinks) {
      toggle.addEventListener('click', () => mobileLinks.classList.toggle('open'));
      mobileLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => mobileLinks.classList.remove('open'));
      });
      const mobileHome = nav.querySelector('.nav-mobile-home');
      if (mobileHome) {
        mobileHome.addEventListener('click', () => mobileLinks.classList.remove('open'));
      }
    }

    document.querySelectorAll('.nav-mobile-group-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const group = btn.closest('.nav-mobile-group');
        const isOpen = group.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen);
      });
    });
  }

  renderSiteNav();
})();
