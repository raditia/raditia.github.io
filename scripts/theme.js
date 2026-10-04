(function () {
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var stored = localStorage.getItem("theme");
  if (stored) root.setAttribute("data-theme", stored);

  function currentTheme() {
    return root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }

  function updateLabel() {
    toggle.textContent = currentTheme() === "dark" ? "Light" : "Dark";
  }

  toggle.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateLabel();
  });

  updateLabel();
})();
