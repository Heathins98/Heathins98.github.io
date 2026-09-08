(function () {
  var GITHUB_USER = 'Heathins98';
  var statusEl = document.getElementById('repo-status');
  var listEl = document.getElementById('repo-list');

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  }

  function renderRepo(repo) {
    var row = document.createElement('div');
    row.className = 'repo-row';

    var head = document.createElement('div');
    head.className = 'repo-row-head';

    var name = document.createElement('a');
    name.className = 'repo-name';
    name.href = repo.html_url;
    name.textContent = repo.name;
    head.appendChild(name);

    var lang = document.createElement('span');
    lang.className = 'repo-lang';
    lang.textContent = [repo.language, 'updated ' + formatDate(repo.pushed_at)].filter(Boolean).join(' · ');
    head.appendChild(lang);

    row.appendChild(head);

    if (repo.description) {
      var desc = document.createElement('p');
      desc.className = 'repo-desc';
      desc.textContent = repo.description;
      row.appendChild(desc);
    }

    return row;
  }

  fetch('https://api.github.com/users/' + GITHUB_USER + '/repos?sort=updated&per_page=100')
    .then(function (res) {
      if (!res.ok) throw new Error('GitHub API responded with ' + res.status);
      return res.json();
    })
    .then(function (repos) {
      var visible = repos.filter(function (r) { return !r.fork; });
      if (!visible.length) {
        statusEl.textContent = 'No public repositories found.';
        return;
      }
      statusEl.remove();
      visible.forEach(function (repo) { listEl.appendChild(renderRepo(repo)); });
    })
    .catch(function (err) {
      statusEl.textContent = 'Could not load repositories from GitHub right now (' + err.message + '). Try github.com/' + GITHUB_USER + ' directly.';
    });
})();
