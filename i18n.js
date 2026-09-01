/* Respicoon — i18n site statique. Le français est la source (dans le HTML) ;
   les 8 autres langues viennent de window.I18N (i18n-data.js). Choix mémorisé. */
(function () {
  var LANGS = ["fr", "en", "de", "it", "pt-PT", "es-ES", "sv", "nb", "fi"];
  var NAMES = { fr: "Français", en: "English", de: "Deutsch", it: "Italiano", "pt-PT": "Português", "es-ES": "Español", sv: "Svenska", nb: "Norsk", fi: "Suomi" };
  var T = window.I18N || {};
  var orig = null;

  function snapshot() {
    orig = [];
    document.querySelectorAll("[data-i18n],[data-i18n-html]").forEach(function (el) {
      var html = el.hasAttribute("data-i18n-html");
      orig.push({ el: el, html: html, val: html ? el.innerHTML : el.textContent });
    });
  }

  function detect() {
    try { var s = localStorage.getItem("respicoon_lang"); if (s && LANGS.indexOf(s) >= 0) return s; } catch (e) {}
    var n = (navigator.language || "fr").toLowerCase();
    if (n.indexOf("pt") === 0) return "pt-PT";
    if (n.indexOf("es") === 0) return "es-ES";
    var two = n.slice(0, 2);
    var map = { fr: "fr", en: "en", de: "de", it: "it", sv: "sv", nb: "nb", no: "nb", nn: "nb", fi: "fi" };
    return map[two] || "fr";
  }

  function apply(lang) {
    if (LANGS.indexOf(lang) < 0) lang = "fr";
    document.documentElement.setAttribute("lang", lang.slice(0, 2));
    if (!orig) snapshot();
    orig.forEach(function (o) {
      var el = o.el, k = el.getAttribute(o.html ? "data-i18n-html" : "data-i18n");
      if (lang === "fr") { if (o.html) el.innerHTML = o.val; else el.textContent = o.val; return; }
      var v = T[k] && T[k][lang];
      if (v == null) { if (o.html) el.innerHTML = o.val; else el.textContent = o.val; return; }
      if (o.html) el.innerHTML = v; else el.textContent = v;
    });
    var sel = document.getElementById("langSel");
    if (sel) sel.value = lang;
    try { localStorage.setItem("respicoon_lang", lang); } catch (e) {}
  }

  function buildSelector() {
    var sel = document.getElementById("langSel");
    if (!sel) return;
    sel.innerHTML = "";
    LANGS.forEach(function (l) {
      var o = document.createElement("option");
      o.value = l; o.textContent = NAMES[l];
      sel.appendChild(o);
    });
    sel.addEventListener("change", function () { apply(sel.value); });
  }

  function init() {
    snapshot();
    buildSelector();
    apply(detect());
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
