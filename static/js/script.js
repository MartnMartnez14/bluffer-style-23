/* Se ejecuta en <head> para aplicar el tema antes del CSS y evitar parpadeos. */
(function () {
    "use strict";

    var root = document.documentElement;
    var storageKey = "bluffer-style-23-theme";
    var colors = { dark: "#08090b", light: "#f4f2ee" };
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
        initCopy();
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

        // Salto por ancla: los elementos que quedaron arriba del viewport nunca
        // intersectan, así que se revelan al detectar que ya pasaron.
        function revealPassed() {
            items.forEach(function (item) {
                if (item.classList.contains("is-visible")) return;
                if (item.getBoundingClientRect().bottom < window.innerHeight * 0.4) {
                    item.classList.add("is-visible");
                    observer.unobserve(item);
                }
            });
        }

        window.addEventListener("scroll", revealPassed, { passive: true });
        revealPassed();
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

    function initCopy() {
        var buttons = Array.from(document.querySelectorAll("[data-copy]"));
        var status = document.getElementById("copy-status");
        if (!buttons.length) return;

        function announce(message) {
            if (status) status.textContent = message;
        }

        function legacyCopy(text) {
            var area = document.createElement("textarea");
            area.value = text;
            area.setAttribute("readonly", "");
            area.style.position = "fixed";
            area.style.top = "-1000px";
            document.body.appendChild(area);
            area.select();
            var ok = false;
            try {
                ok = document.execCommand("copy");
            } catch (error) {
                ok = false;
            }
            document.body.removeChild(area);
            return ok;
        }

        function mark(button, label) {
            var original = button.dataset.label || button.textContent;
            button.dataset.label = original;
            button.dataset.copied = "true";
            button.textContent = label;
            window.setTimeout(function () {
                button.dataset.copied = "false";
                button.textContent = original;
            }, 2000);
        }

        buttons.forEach(function (button) {
            var value = (button.dataset.copy || "").trim();
            if (!value) return;
            button.addEventListener("click", function () {
                function done() {
                    mark(button, "Copiado ✓");
                    announce("Copiado: " + value);
                }

                function fallback() {
                    if (legacyCopy(value)) {
                        done();
                    } else {
                        announce("No se pudo copiar. Seleccioná el dato y copialo a mano.");
                    }
                }

                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(value).then(done, fallback);
                } else {
                    fallback();
                }
            });
        });
    }
}());
