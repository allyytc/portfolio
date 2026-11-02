/* ============================================================
   Projects page interactions:
   - Expand/collapse project cards
   - Thumbnail strips -> full-screen modal gallery
   - Design Work masonry -> lightbox
   ============================================================ */

// --- Accordion: expand/collapse project cards ---------------
document.querySelectorAll('.proj-card-header').forEach(header => {
  header.addEventListener('click', () => {
    const card = header.closest('.proj-card');
    const wrap = card.querySelector('.proj-card-detail-wrap');
    const isOpen = card.classList.contains('open');

    if (isOpen) {
      wrap.style.maxHeight = '0px';
      card.classList.remove('open');
      header.setAttribute('aria-expanded', 'false');
    } else {
      card.classList.add('open');
      header.setAttribute('aria-expanded', 'true');
      wrap.style.maxHeight = wrap.scrollHeight + 'px';
    }
  });
});

// Keep open panels sized correctly if the viewport changes
// (e.g. text reflow on resize).
window.addEventListener('resize', () => {
  document.querySelectorAll('.proj-card.open .proj-card-detail-wrap').forEach(wrap => {
    wrap.style.maxHeight = wrap.scrollHeight + 'px';
  });
  document.querySelectorAll('.design-subsection.open .design-subsection-panel').forEach(panel => {
    panel.style.maxHeight = panel.scrollHeight + 'px';
  });
});

// --- Design Work subsections: Graphics / Stickers ----------------
document.querySelectorAll('.design-subsection-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const subsection = toggle.closest('.design-subsection');
    const panel = subsection.querySelector('.design-subsection-panel');
    const isOpen = subsection.classList.contains('open');

    if (isOpen) {
      panel.style.maxHeight = '0px';
      subsection.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      subsection.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
      requestAnimationFrame(() => {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        setTimeout(() => { panel.style.maxHeight = panel.scrollHeight + 'px'; }, 220);
      });
    }
  });
});

function refreshDesignPanel(subsection) {
  if (!subsection || !subsection.classList.contains('open')) return;
  const panel = subsection.querySelector('.design-subsection-panel');
  if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
}

// --- Sticker carousels (Design Work > Stickers) ----------------
const stickerCarouselData = {
  'sticker-carousel-ew': [
    { src: 'eweek-stickers/E-week_Gear_Beaver.png', label: 'Gear Beaver' },
    { src: 'eweek-stickers/E-week_OSU.png', label: 'OSU' },
    { src: 'eweek-stickers/E-week_Post_Stamp.png', label: 'Post Stamp' },
    { src: 'eweek-stickers/E-week_Sleeping_Beaver.png', label: 'Sleeping Beaver' },
    { src: 'eweek-stickers/E-week_Wrench.png', label: 'Wrench' },
  ],
  'sticker-carousel-ij': [
    { src: 'ij-stickers/lightbulb-crop.png', label: 'Lightbulb', rot: '2deg' },
    { src: 'ij-stickers/airplane-crop.png', label: 'Airplane', rot: '-3deg' },
    { src: 'ij-stickers/rocket-crop.png', label: 'Rocket', rot: '-2deg' },
    { src: 'ij-stickers/star-crop.png', label: 'Star', rot: '3deg' },
  ],
  'sticker-carousel-bh': [
    { src: 'bh-stickers/sticker-1-crop.png', label: 'Attendee Design', rot: '-3deg' },
    { src: 'bh-stickers/sticker-9-crop.png', label: 'Attendee Design', rot: '2deg' },
    { src: 'bh-stickers/sticker-10-crop.png', label: 'Attendee Design', rot: '-2deg' },
    { src: 'bh-stickers/sticker-11-crop.png', label: 'Volunteer Design', rot: '3deg' },
    { src: 'bh-stickers/sticker-12-crop.png', label: 'Team Design', rot: '-1deg' },
    { src: 'bh-stickers/sticker-13-crop.png', label: 'Team Design', rot: '2deg' },
  ],
};

Object.entries(stickerCarouselData).forEach(([id, items]) => {
  const block = document.getElementById(id);
  if (!block) return;

  const img = block.querySelector('.sticker-carousel-img');
  const countEl = block.querySelector('.sticker-carousel-count');
  const prevBtn = block.querySelector('.sticker-carousel-btn--prev');
  const nextBtn = block.querySelector('.sticker-carousel-btn--next');
  let idx = 0;

  const render = (animate) => {
    const item = items[idx];
    const apply = () => {
      img.src = item.src;
      img.alt = block.querySelector('.sticker-carousel-event').textContent + ' sticker ' + (idx + 1);
      countEl.textContent = (idx + 1) + ' / ' + items.length;
      img.style.transform = item.rot ? 'rotate(' + item.rot + ')' : 'none';
      img.style.opacity = '1';
      refreshDesignPanel(block.closest('.design-subsection'));
    };

    if (!animate) {
      apply();
      return;
    }

    img.style.opacity = '0';
    img.style.transform = 'rotate(0deg) scale(0.92)';
    setTimeout(apply, 180);
  };

  prevBtn.addEventListener('click', () => {
    idx = (idx - 1 + items.length) % items.length;
    render(true);
  });
  nextBtn.addEventListener('click', () => {
    idx = (idx + 1) % items.length;
    render(true);
  });

  render(false);
});

// --- Full-screen modal gallery -------------------------------
const modal = document.getElementById('galleryModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

/*
  Each entry below is a gallery for a thumbnail strip. Replace the
  placeholder `caption` text and add `src` (image path) or, for
  videos, an embeddable URL (e.g. a YouTube embed link) to swap in
  real media. Items without a `src` render as a labeled placeholder
  box so the layout can be previewed before assets are ready.
*/
const galleryData = {

  // --- Projects In Progress -----------------------------------
  'impact-studio-homepage': [
    { type: 'image', src: 'impact-wireframe/mock%203.png', caption: 'Homepage redesign - hero, approach, and lifecycle process' },
  ],
  'impact-studio-about': [
    { type: 'image', src: 'impact-wireframe/mock%201.png', caption: 'About Us page - mission and team directory' },
  ],
  'cddc-home': [
    { type: 'image', src: 'cddc-wireframes/home.png', caption: 'Homepage wireframe' },
  ],
  'cddc-get-help': [
    { type: 'image', src: 'cddc-wireframes/get-help.png', caption: 'Get Help page wireframe' },
  ],
  'cddc-contact': [
    { type: 'image', src: 'cddc-wireframes/contact.png', caption: 'Contact Us page wireframe' },
  ],
  'cddc-about': [
    { type: 'image', src: 'cddc-wireframes/about.png', caption: 'About Us page wireframe' },
  ],
  'cddc-donate': [
    { type: 'image', src: 'cddc-wireframes/donate.png', caption: 'Donate page wireframe' },
  ],
  'impact-studio-live': [
    { type: 'image', src: 'impact-live/home-desktop.webp', caption: 'Full-page screenshot of the live Impact Studio homepage on a desktop browser' },
    { type: 'image', src: 'impact-live/about-desktop.webp', caption: 'Full-page screenshot of the live Impact Studio About page on a desktop browser' },
    { type: 'image', src: 'impact-live/portfolio-desktop.webp', caption: 'Full-page screenshot of the live Impact Studio portfolio page on a desktop browser' },
    { type: 'image', src: 'impact-live/home-mobile.webp', caption: 'Full-page screenshot of the live Impact Studio homepage at a mobile width' },
  ],

  // --- Hackathon Wins -------------------------------------------
  'er-overwatch-demo': [
    { type: 'video', src: 'https://www.youtube.com/embed/7biBbQWCngY', caption: 'ER Overwatch demo - QuackHacks 2026' },
  ],
  'er-overwatch-interface': [
    { type: 'image', src: 'ero-gal/image-02.webp', caption: 'System workflow diagram' },
    { type: 'image', src: 'ero-gal/nursedash.webp', caption: 'Nurse dashboard - live patient queue and alerts' },
    { type: 'image', src: 'ero-gal/fall-alert.webp', caption: 'Fall detection alert - critical emergency modal' },
    { type: 'image', src: 'ero-gal/patient.webp', caption: 'Patient wait portal - queue position and ER status' },
    { type: 'image', src: 'ero-gal/qr.webp', caption: 'Patient check-in flow' },
  ],
  'er-overwatch-gallery': [
    { type: 'image', src: 'ero-gal/awards/IMG_2647.WEBP', caption: 'Team on stage at QuackHacks 3' },
    { type: 'image', src: 'ero-gal/awards/IMG_2654.WEBP', caption: 'QuackHacks 3 - judging' },
  ],
  'combocraft-demo': [
    { type: 'video', src: 'https://www.youtube.com/embed/xNuD9hViZFQ', caption: 'ComboCraft demo - QuackHacks 2025' },
  ],
  'combocraft-interface': [
    { type: 'image', src: 'combo-game/gallery%20(6).jpg', caption: 'Main menu - Enter the Inferno' },
    { type: 'image', src: 'combo-game/gallery%20(5).jpg', caption: 'How to Play - gesture tutorial and battle tips' },
    { type: 'image', src: 'combo-game/gallery%20(1).jpg', caption: 'Boss fight - MediaPipe hand tracking and spell casting' },
    { type: 'image', src: 'combo-game/gallery%20(4).jpg', caption: 'Defeat Bosses - enemy selection screen' },
    { type: 'image', src: 'combo-game/gallery.jpg', caption: 'Victory screen - combo stats and final boss HP' },
  ],
  'korbit-demo': [
    { type: 'video', src: 'https://www.youtube.com/embed/Ta64tj6uJc4', caption: 'KO.rbit demo - DubHacks 2026' },
  ],
  'korbit-interface': [
    { type: 'image', src: 'korbit-gal/title.webp', caption: 'KO.rbit title screen on a starfield, with the prompt to begin a run' },
    { type: 'image', src: 'korbit-gal/cockpit.webp', caption: 'KO.rbit 3D cockpit lobby, with a pilot at the console and a radar of nearby ships' },
    { type: 'image', src: 'korbit-gal/duel.webp', caption: 'KO.rbit saber duel in a rocky arena, with health and stamina on the battle HUD' },
    { type: 'image', src: 'korbit-gal/mars-arena.webp', caption: 'KO.rbit Mars arena at Jezero Crater, with a landed ship and two pilots on the terrain' },
    { type: 'image', src: 'korbit-gal/solar-view.webp', caption: 'KO.rbit solar view of a banded planet, with the navigation menu open' },
  ],
  'lantern-demo': [
    { type: 'video', src: 'https://www.youtube.com/embed/UiwDwaL6978', caption: 'Lantern demo - HackMIT 2026' },
  ],
  'combocraft-gallery': [
    { type: 'image', src: 'combocraft-event/DSC01945.JPG', caption: '1st Place Overall - QuackHacks 2025' },
    { type: 'video', src: 'combocraft-event/MAH01763.MP4', caption: 'ComboCraft at QuackHacks 2025 - event footage' },
    { type: 'image', src: 'combocraft-event/DSC01841.JPG', caption: 'Final judging stage - presentation and live demo' },
    { type: 'image', src: 'combocraft-event/DSC01844.JPG', caption: 'Final judging stage - presentation and live demo' },
    { type: 'image', src: 'combocraft-event/DSC01845.JPG', caption: 'Final judging stage - presentation and live demo' },
    { type: 'image', src: 'combocraft-event/DSC01846.JPG', caption: 'Final judging stage - presentation and live demo' },
    { type: 'image', src: 'combocraft-event/IMG_2987.JPG', caption: 'Judging stage - Pipeworks judges' },
    { type: 'image', src: 'combocraft-event/IMG_2988.JPG', caption: 'Judging stage - Pipeworks judges' },
    { type: 'image', src: 'combocraft-event/IMG_2986.JPG', caption: 'Judging stage - Pipeworks judges' },
    { type: 'image', src: 'combocraft-event/IMG_2989.JPG', caption: 'Project fair - staff stopped by to play' },
    { type: 'image', src: 'combocraft-event/IMG_2990.JPG', caption: 'Project fair - staff stopped by to play' },
  ],

  // --- Past Projects ---------------------------------------------
  'afterlife-metro': [
    { type: 'image', src: 'afterlife-metro/split-screen.webp', caption: 'Split-screen in the Afterlife Metro browser game (Godot 4.5 web build). The Human\u2019s view is on the left and the Ghost\u2019s view is on the right. The Ghost sees puzzle objects the Human can\u2019t. Game art by Nour Alzahraa Alqattan.' },
    { type: 'image', src: 'afterlife-metro/puzzle-room.webp', caption: 'Exploring a puzzle room in Afterlife Metro, a Godot 4.5 browser game. Game art by Nour Alzahraa Alqattan.' },
    { type: 'image', src: 'afterlife-metro/home.webp', caption: 'Afterlife Metro home screen in the Godot 4.5 web build. Game art by Nour Alzahraa Alqattan.' },
    { type: 'image', src: 'afterlife-metro/intro-memory.webp', caption: 'Intro in the Afterlife Metro browser game (Godot 4.5 web build). A timer and Pause control sit above a memory-fragment passage about Hugh slipping or being pushed, then waking on an empty bench. The pixel-art scene shows a bench and a ghost figure. Game art by Nour Alzahraa Alqattan.' },
    { type: 'image', src: 'afterlife-metro/story-dialogue.webp', caption: 'Story dialogue in the Afterlife Metro browser game (Godot 4.5 web build). A timer and Pause control sit above text of Violet speaking to Hugh in a dark tunnel. Game art by Nour Alzahraa Alqattan.' },
    { type: 'image', src: 'afterlife-metro/instructions.webp', caption: 'Afterlife Metro instructions page, at the overview. It describes a 2D pixel-art co-op adventure where you play as a human or a ghost. Ghost moves with the arrow keys, and Player moves with WASD. Game art by Nour Alzahraa Alqattan.' },
    { type: 'image', src: 'afterlife-metro/instructions-scrolled.webp', caption: 'Afterlife Metro instructions page, scrolled to the gameplay tips and Starting the Game. The tips mention the timer and the leaderboard, and the page says to click Start Game on the homepage. A Back to Home button is at the bottom. Game art by Nour Alzahraa Alqattan.' },
    { type: 'image', src: 'afterlife-metro/leaderboard.webp', caption: 'Afterlife Metro leaderboard from the Express server. The listed names are test entries: testing, hello world, and losing.' },
    { type: 'image', src: 'afterlife-metro/pause-menu.webp', caption: 'Pause menu in the Afterlife Metro browser game (Godot 4.5 web build), over a pixel-art scene. The menu is titled Paused and has Resume and Quit buttons. Game art by Nour Alzahraa Alqattan.' },
  ],

};

// Build a slide element for the modal gallery
function buildSlide(item) {
  const slide = document.createElement('div');
  slide.className = 'modal-slide';

  if (item.type === 'video') {
    if (item.src) {
      const isLocalVideo = /\.(mp4|webm|mov)(\?|$)/i.test(item.src);
      const media = isLocalVideo
        ? `<video src="${item.src}" controls playsinline preload="metadata" muted></video>`
        : `<iframe src="${item.src}" title="${item.caption}" loading="lazy" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
      slide.innerHTML = `
        <div class="modal-video-wrap">
          ${media}
        </div>
        <figcaption>${item.caption}</figcaption>`;
    } else {
      slide.innerHTML = `
        <div class="modal-placeholder"><span>${item.caption}</span></div>
        <figcaption>${item.caption}</figcaption>`;
    }
  } else if (item.type === 'pdf' && item.src) {
    slide.innerHTML = `
      <div class="modal-pdf-wrap">
        <iframe src="${item.src}" title="${item.caption}" loading="lazy"></iframe>
      </div>
      <figcaption>${item.caption}</figcaption>`;
  } else if (item.src) {
    slide.innerHTML = `
      <figure>
        <img src="${item.src}" alt="${item.caption}">
        <figcaption>${item.caption}</figcaption>
      </figure>`;
  } else {
    slide.innerHTML = `
      <div class="modal-placeholder"><span>${item.caption}</span></div>
      <figcaption>${item.caption}</figcaption>`;
  }

  return slide;
}

function markDesignSlideOrientation(slide) {
  const img = slide.querySelector('img');
  if (!img) return;
  const apply = () => {
    if (img.naturalWidth > img.naturalHeight) {
      slide.classList.add('modal-slide--landscape');
    }
  };
  if (img.complete && img.naturalWidth) apply();
  else img.addEventListener('load', apply, { once: true });
}

function openGallery(galleryId, startIndex) {
  const items = galleryData[galleryId];
  if (!items || !items.length) return;

  modalContent.innerHTML = '';
  items.forEach((item, i) => {
    const slide = buildSlide(item);
    slide.id = `${galleryId}-slide-${i}`;
    modalContent.appendChild(slide);

    if (galleryId === 'design-work') {
      markDesignSlideOrientation(slide);
    }

    if (item.type === 'video' && item.src && /\.(mp4|webm|mov)(\?|$)/i.test(item.src)) {
      const video = slide.querySelector('video');
      if (video) {
        video.muted = true;
        video.volume = 0;
        video.addEventListener('volumechange', () => {
          video.muted = true;
          video.volume = 0;
        });
      }
    }
  });

  modal.classList.remove('modal-overlay--video', 'modal-overlay--gallery', 'modal-overlay--design');
  if (items.length === 1 && items[0].type === 'video') {
    modal.classList.add('modal-overlay--video');
  } else if (galleryId === 'design-work') {
    modal.classList.add('modal-overlay--gallery', 'modal-overlay--design');
  } else if (items.every(item => item.src && (item.type === 'image' || item.type === 'video' || item.type === 'pdf'))) {
    modal.classList.add('modal-overlay--gallery');
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const target = document.getElementById(`${galleryId}-slide-${startIndex}`);
  if (target) {
    requestAnimationFrame(() => {
      const top = target.getBoundingClientRect().top - modal.getBoundingClientRect().top + modal.scrollTop - 88;
      modal.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
    });
  }
}

function closeModal() {
  modal.classList.remove('open', 'modal-overlay--video', 'modal-overlay--gallery', 'modal-overlay--design');
  document.body.style.overflow = '';
  modalContent.innerHTML = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

// Wire up thumbnail strips
document.querySelectorAll('.thumb[data-gallery], .thumb-btn[data-gallery]').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const galleryId = thumb.dataset.gallery;
    const index = parseInt(thumb.dataset.index, 10) || 0;
    openGallery(galleryId, index);
  });
});

// --- Design Work gallery -> lightbox -------------------------
const designItems = document.querySelectorAll('.design-gallery-item');
if (designItems.length) {
  galleryData['design-work'] = Array.from(designItems).map(item => {
    const type = item.dataset.type || 'image';
    const img = item.querySelector('img');
    const title = item.querySelector('.design-gallery-title');
    const cat = item.querySelector('.design-gallery-cat');
    const caption = [title, cat].filter(Boolean).map(el => el.textContent.trim()).join(' - ');
    const src = type === 'pdf'
      ? item.dataset.src
      : (img ? img.getAttribute('src') : '');
    return { type, src, caption };
  });

  designItems.forEach((item, i) => {
    item.addEventListener('click', () => openGallery('design-work', i));
  });
}

// --- Deep-link hash routing (e.g. projects.html#design-graphics) ---
function openProjCard(card) {
  if (!card || card.classList.contains('open')) return;
  const header = card.querySelector('.proj-card-header');
  const wrap = card.querySelector('.proj-card-detail-wrap');
  if (!header || !wrap) return;
  card.classList.add('open');
  header.setAttribute('aria-expanded', 'true');
  wrap.style.maxHeight = wrap.scrollHeight + 'px';
}

function openDesignSubsection(subsection) {
  if (!subsection || subsection.classList.contains('open')) return;
  const toggle = subsection.querySelector('.design-subsection-toggle');
  const panel = subsection.querySelector('.design-subsection-panel');
  if (!toggle || !panel) return;
  subsection.classList.add('open');
  toggle.setAttribute('aria-expanded', 'true');
  panel.style.maxHeight = panel.scrollHeight + 'px';
}

function initProjectsFromHash() {
  const hash = window.location.hash;
  if (!hash) return;
  const id = hash.slice(1);
  const target = document.getElementById(id);
  if (!target) return;

  if (target.classList.contains('design-subsection')) {
    openDesignSubsection(target);
  } else if (target.classList.contains('proj-card')) {
    openProjCard(target);
  }

  setTimeout(function () {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 120);
}

window.addEventListener('load', initProjectsFromHash);
window.addEventListener('hashchange', initProjectsFromHash);
