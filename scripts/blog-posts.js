(function () {
  var listEl = document.getElementById("blog-posts");

  function el(tag, props) {
    var node = document.createElement(tag);
    Object.keys(props || {}).forEach(function (key) {
      if (key === "text") node.textContent = props[key];
      else node.setAttribute(key, props[key]);
    });
    return node;
  }

  function formatDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  fetch("data/posts.json")
    .then(function (r) { if (!r.ok) throw new Error("posts"); return r.json(); })
    .then(function (data) {
      listEl.innerHTML = "";
      data.posts.forEach(function (post) {
        var li = el("li", { class: "blog-post" });
        if (post.image) {
          li.appendChild(el("img", { src: post.image, alt: "", loading: "lazy" }));
        }
        var body = el("div", { class: "blog-post-body" });
        body.appendChild(el("span", { class: "blog-post-date", text: formatDate(post.pubDate) }));
        body.appendChild(el("a", { class: "blog-post-title", href: post.link, target: "_blank", rel: "noopener", text: post.title }));
        body.appendChild(el("p", { text: post.excerpt }));
        li.appendChild(body);
        listEl.appendChild(li);
      });
    })
    .catch(function () {
      listEl.innerHTML = "";
      listEl.appendChild(el("li", { class: "gh-error", text: "Posts unavailable right now — see theboredcoder.com directly." }));
    });
})();
