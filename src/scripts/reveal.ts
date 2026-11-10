/**
 * Scroll reveals. Elements with [data-reveal] fade and rise in when they enter the view;
 * [data-reveal="photo"] wipes up from the bottom; [data-reveal="draw"] draws its line art.
 * Siblings inside [data-reveal-group] are staggered. Content is visible by default: the
 * hidden start state only applies once <html> has the "reveal" class, which the inline head
 * script adds when motion is allowed, and a safety timeout there shows everything if this
 * script never runs.
 */
const root = document.documentElement;
if (root.classList.contains('reveal')) {
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => el.style.setProperty('--i', String(i)));
  });
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  root.classList.add('reveal-ready');
}
