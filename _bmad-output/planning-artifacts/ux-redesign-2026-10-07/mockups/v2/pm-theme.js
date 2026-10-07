/* Тема: ?theme у хеші (для макетів) > localStorage > prefers-color-scheme. Підключати синхронно в <head>. */
(function () {
  var r = document.documentElement, t = null;
  try { var m = (location.hash || '').match(/theme=(dark|light)/); t = m ? m[1] : localStorage.getItem('pm-theme'); } catch (e) {}
  if (t !== 'dark' && t !== 'light') t = (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  r.setAttribute('data-bs-theme', t);
  document.addEventListener('DOMContentLoaded', function () {
    var btns = document.querySelectorAll('[data-pm-theme-toggle]');
    function sync() { var d = r.getAttribute('data-bs-theme') === 'dark'; btns.forEach(function (b) { b.setAttribute('aria-pressed', d); b.setAttribute('aria-label', d ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'); b.setAttribute('title', d ? 'Світла тема' : 'Темна тема'); }); }
    sync();
    btns.forEach(function (b) { b.addEventListener('click', function () { var n = r.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark'; r.setAttribute('data-bs-theme', n); try { localStorage.setItem('pm-theme', n); } catch (e) {} sync(); }); });
  });
})();
