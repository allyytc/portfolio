// Scroll-in fade animations
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.08 }
);

document.querySelectorAll(
  '.exp-item, .project-item, .stat, .skills-group, .edu-item, .about-layout, .proj-card, .design-masonry-item'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
