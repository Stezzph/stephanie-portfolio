const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });

document.querySelectorAll('section, .timeline article').forEach((el) => {
  el.classList.add('reveal');
  observer.observe(el);
});
