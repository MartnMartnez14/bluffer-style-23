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
            theme === "dark" ? "#0d1424" : "#f7f8fc";

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
    });
}());
