/* Se ejecuta en <head> para aplicar el tema antes del CSS y evitar parpadeos. */
(function () {
    "use strict";

    var root = document.documentElement;
    var storageKey = "bluffer-style-23-theme";
    var colors = { dark: "#0b0c0a", light: "#f3f2e9" };
    var button = null;
    var theme = "dark";
    var saved = null;

    root.classList.add("js");

    try {
        saved = window.localStorage.getItem(storageKey);
    } catch (error) {
        // Sin almacenamiento disponible, la elección queda solo en memoria.
    }
    if (saved === "light" || saved === "dark") theme = saved;

    function applyTheme(next) {
        theme = next;
        root.setAttribute("data-theme", next);
        root.style.colorScheme = next;
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", colors[next]);
        if (button) {
            var toLight = next === "dark";
            button.setAttribute("aria-label", toLight ? "Activar modo claro" : "Activar modo oscuro");
            button.querySelector(".theme-icon").textContent = toLight ? "☀" : "☾";
        }
    }

    applyTheme(theme);

    document.addEventListener("DOMContentLoaded", function () {
        button = document.querySelector(".theme-toggle");
        if (button) {
            applyTheme(theme);
            button.hidden = false;
            button.addEventListener("click", function () {
                var next = theme === "dark" ? "light" : "dark";
                applyTheme(next);
                try {
                    window.localStorage.setItem(storageKey, next);
                } catch (error) {
                    // La elección se mantiene en memoria durante esta visita.
                }
            });
        }

        initProjects();
        initReveal();
        initNavbar();
    });

    function normalize(value) {
        return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }

    function initProjects() {
        var tools = document.querySelector(".project-tools");
        var cards = Array.from(document.querySelectorAll(".project-card"));
        var search = document.getElementById("search");
        var count = document.getElementById("result-count");
        var empty = document.getElementById("empty-state");
        var reset = document.getElementById("reset");
        var filters = Array.from(document.querySelectorAll("[data-filter]"));
        var category = "Todos";
        var searchable = cards.map(function (card) { return normalize(card.textContent); });

        if (!tools || !search || !count || !empty || !reset) return;

        function update() {
            var query = normalize(search.value);
            var visible = 0;
            cards.forEach(function (card, index) {
                var matches = (category === "Todos" || card.dataset.category === category) &&
                    searchable[index].indexOf(query) !== -1;
                card.hidden = !matches;
                if (matches) visible++;
            });
            count.textContent = visible === 1 ? "1 proyecto para explorar" : visible + " proyectos para explorar";
            empty.hidden = visible !== 0;
        }

        filters.forEach(function (filter) {
            filter.addEventListener("click", function () {
                category = filter.dataset.filter;
                filters.forEach(function (item) {
                    item.setAttribute("aria-pressed", String(item === filter));
                });
                update();
            });
        });

        search.addEventListener("input", update);

        reset.addEventListener("click", function () {
            search.value = "";
            category = "Todos";
            filters.forEach(function (item) {
                item.setAttribute("aria-pressed", String(item.dataset.filter === "Todos"));
            });
            update();
            search.focus();
        });

        update();
        tools.hidden = false;
    }

    function initReveal() {
        var items = Array.from(document.querySelectorAll(".reveal"));
        var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!("IntersectionObserver" in window) || reduce) {
            items.forEach(function (item) { item.classList.add("is-visible"); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

        items.forEach(function (item) { observer.observe(item); });
    }

    function initNavbar() {
        var navbar = document.getElementById("navbar");
        if (!navbar) return;

        function onScroll() {
            navbar.classList.toggle("is-scrolled", window.pageYOffset > 8);
        }

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }
}());
