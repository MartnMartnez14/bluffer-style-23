/* Se ejecuta antes del CSS para aplicar el tema sin esperar al contenido. */
(function () {
    "use strict";

    var storageKey = "bluffer-style-23-theme";
    var systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    var preference = null;
    var button;

    try {
        var saved = window.localStorage.getItem(storageKey);
        if (saved === "light" || saved === "dark") preference = saved;
    } catch (error) {
        // El selector también funciona cuando el navegador bloquea el almacenamiento.
    }

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
        document.querySelector('meta[name="theme-color"]').content =
            theme === "dark" ? "#1d2020" : "#faf7f2";

        if (button) {
            button.setAttribute("aria-label", theme === "dark" ?
                "Activar modo claro" : "Activar modo nocturno");
            button.querySelector(".theme-icon").textContent = theme === "dark" ? "☀" : "☾";
        }
    }

    applyTheme(preference || (systemTheme.matches ? "dark" : "light"));

    function followSystem(event) {
        if (!preference) applyTheme(event.matches ? "dark" : "light");
    }

    if (systemTheme.addEventListener) systemTheme.addEventListener("change", followSystem);
    else systemTheme.addListener(followSystem);

    document.addEventListener("DOMContentLoaded", function () {
        button = document.querySelector(".theme-toggle");
        button.addEventListener("click", function () {
            preference = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
            applyTheme(preference);
            try {
                window.localStorage.setItem(storageKey, preference);
            } catch (error) {
                // Conservamos la elección en memoria durante esta visita.
            }
        });
        applyTheme(document.documentElement.dataset.theme);
        button.hidden = false;

        var tools = document.querySelector(".project-tools");
        var cards = Array.from(document.querySelectorAll(".project-card"));
        var search = document.getElementById("search");
        var count = document.getElementById("result-count");
        var empty = document.getElementById("empty-state");
        var filters = Array.from(document.querySelectorAll("[data-filter]"));
        var category = "Todos";
        function normalize(value) {
            return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
        }
        var searchable = cards.map(function (card) { return normalize(card.textContent); });
        function update() {
            var query = normalize(search.value);
            var visible = 0;
            cards.forEach(function (card, index) {
                var matches = (category === "Todos" || card.dataset.category === category) && searchable[index].includes(query);
                card.hidden = !matches;
                if (matches) visible++;
            });
            count.textContent = visible === 1 ? "1 proyecto para explorar" : visible + " proyectos para explorar";
            empty.hidden = visible !== 0;
        }
        filters.forEach(function (filter) {
            filter.addEventListener("click", function () {
                category = filter.dataset.filter;
                filters.forEach(function (item) { item.setAttribute("aria-pressed", String(item === filter)); });
                update();
            });
        });
        search.addEventListener("input", update);
        document.getElementById("reset").addEventListener("click", function () {
            search.value = "";
            category = "Todos";
            filters.forEach(function (item) { item.setAttribute("aria-pressed", String(item.dataset.filter === "Todos")); });
            update();
            search.focus();
        });
        tools.hidden = false;
    });
}());
