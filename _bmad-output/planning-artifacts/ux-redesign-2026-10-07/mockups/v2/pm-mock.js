/* Службовий перемикач станів для макетів. У продукті його немає. */
(function () {
  var css = 'body[data-auth="guest"] [data-auth-only="user"],body[data-auth="guest"] [data-auth-only="user-ns"],body[data-auth="guest"] [data-auth-only="subscribed"],' +
    'body[data-auth="user"] [data-auth-only="guest"],body[data-auth="user"] [data-auth-only="subscribed"],' +
    'body[data-auth="subscribed"] [data-auth-only="guest"],body[data-auth="subscribed"] [data-auth-only="user-ns"]{display:none!important}' +
    '[data-thermo-only]{display:none}' + ['none','zero','progress','done','stale'].map(function (s) { return 'body[data-thermo="' + s + '"] [data-thermo-only="' + s + '"]{display:block}'; }).join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var b = document.body;
  function apply(k, v) { b.setAttribute('data-' + k, v); document.querySelectorAll('.mock-bar [data-set^="' + k + ':"]').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-set') === k + ':' + v); }); }
  (location.hash || '').replace('#', '').split('&').forEach(function (p) { var kv = p.split('='); if (kv[0] && kv[1]) b.setAttribute('data-' + kv[0], kv[1]); });
  ['auth', 'thermo'].forEach(function (k) { if (b.getAttribute('data-' + k)) apply(k, b.getAttribute('data-' + k)); });
  document.querySelectorAll('.mock-bar [data-set]').forEach(function (x) { x.addEventListener('click', function () { var kv = x.getAttribute('data-set').split(':'); apply(kv[0], kv[1]); }); });
})();
