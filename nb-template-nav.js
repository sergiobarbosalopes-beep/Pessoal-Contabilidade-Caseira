(function () {
  "use strict";

  const templatePage = document.body?.dataset?.templatePage;
  if (!templatePage) return;

  const links = document.querySelectorAll(".navbar-links a");
  links.forEach((link) => link.classList.remove("active"));

  const activeLink = document.querySelector(`.navbar-links a[data-template-page="${templatePage}"]`);
  if (activeLink) activeLink.classList.add("active");
})();
