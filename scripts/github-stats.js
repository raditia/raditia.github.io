(function () {
  var USERNAME = "raditia";
  var statsEl = document.getElementById("gh-stats");
  var reposEl = document.getElementById("gh-repos");

  function el(tag, props) {
    var node = document.createElement(tag);
    Object.keys(props || {}).forEach(function (key) {
      if (key === "text") node.textContent = props[key];
      else node.setAttribute(key, props[key]);
    });
    return node;
  }

  function renderStats(user) {
    statsEl.innerHTML = "";
    [
      ["Public repos", user.public_repos],
      ["Followers", user.followers],
      ["Following", user.following],
    ].forEach(function (pair) {
      var stat = el("div", { class: "gh-stat" });
      var strong = el("strong", { text: pair[1] });
      var label = el("span", { text: pair[0] });
      stat.appendChild(strong);
      stat.appendChild(label);
      statsEl.appendChild(stat);
    });
  }

  function renderRepos(repos) {
    reposEl.innerHTML = "";
    repos
      .filter(function (r) { return !r.fork; })
      .sort(function (a, b) { return b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at); })
      .slice(0, 6)
      .forEach(function (repo) {
        var li = el("li", { class: "gh-repo" });
        var link = el("a", { href: repo.html_url, target: "_blank", rel: "noopener", text: repo.name });
        var desc = el("p", { text: repo.description || "" });
        var meta = el("div", { class: "gh-repo-meta" });
        meta.appendChild(el("span", { text: "★ " + repo.stargazers_count }));
        if (repo.language) meta.appendChild(el("span", { text: repo.language }));
        li.appendChild(link);
        li.appendChild(desc);
        li.appendChild(meta);
        reposEl.appendChild(li);
      });
  }

  function showError() {
    statsEl.innerHTML = "";
    statsEl.appendChild(el("span", { class: "gh-error", text: "GitHub stats unavailable right now — see github.com/" + USERNAME + " directly." }));
  }

  Promise.all([
    fetch("https://api.github.com/users/" + USERNAME).then(function (r) { if (!r.ok) throw new Error("user"); return r.json(); }),
    fetch("https://api.github.com/users/" + USERNAME + "/repos?per_page=100").then(function (r) { if (!r.ok) throw new Error("repos"); return r.json(); }),
  ])
    .then(function (results) {
      renderStats(results[0]);
      renderRepos(results[1]);
    })
    .catch(showError);
})();
