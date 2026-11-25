"""Validaciones del portafolio estático. Ejecutar: python3 -m unittest discover -s tests -v"""
import pathlib
import re
import unittest

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "static" / "css" / "style.css").read_text(encoding="utf-8")
JS = (ROOT / "static" / "js" / "script.js").read_text(encoding="utf-8")

CARDS = re.findall(r'<article class="project-card[^"]*".*?</article>', HTML, re.S)
NUMBERS = [
    match.group(1) if (match := re.search(r'class="project-number">\s*(\d+)', card)) else ""
    for card in CARDS
]


class Base(unittest.TestCase):
    """Aserciones con mensaje corto: un fallo no vuelca el archivo entero."""

    def has(self, needle, haystack=HTML):
        self.assertTrue(needle in haystack, f"falta: {needle}")

    def has_not(self, needle, haystack=HTML):
        self.assertFalse(needle in haystack, f"no debería estar: {needle}")


class CatalogoTest(Base):
    def test_hay_22_proyectos(self):
        self.assertEqual(len(CARDS), 22, "se esperaban 22 tarjetas")

    def test_numeracion_correlativa(self):
        self.assertEqual(NUMBERS, [f"{i:02d}" for i in range(1, 23)])

    def test_extension_es_la_tarjeta_02(self):
        self.has("YT Temporal Comments", CARDS[1])
        self.has('data-featured="true"', CARDS[1])

    def test_extension_publicada_en_chrome_web_store(self):
        url = "https://chromewebstore.google.com/detail/bjklhbialpidkbpdbelenkpminijkibb"
        self.has(url, CARDS[1])
        self.has("Chrome Web Store · v1.0.0", CARDS[1])
        extension = HTML.split('id="extension"')[1].split("</section>")[0]
        self.assertIn(url, extension, "la sección debe enlazar a la ficha oficial")
        self.assertIn("Versión 1.0.0", extension)
        self.has_not("En preparación para la Chrome Web Store")
        self.has_not("0.4.1")

    def test_contador_coincide(self):
        self.has("22 proyectos para explorar")

    def test_enlaces_de_proyectos_nuevos(self):
        for url in (
            "https://martnmartnez14.github.io/tambo-app/",
            "https://martnmartnez14.github.io/catalogo-comercios/",
            "https://martnmartnez14.github.io/inac-carnes-infografia/",
        ):
            self.has(url)

    def test_no_quedan_datos_viejos(self):
        for viejo in ("outlook.com", "59898053913", "Soy Martín,", "estudiante de Nutrición.", "Canelones"):
            self.has_not(viejo)


class ContactoTest(Base):
    def test_correo_hotmail(self):
        self.assertGreaterEqual(HTML.count("mmartinez23bio@hotmail.com"), 3)
        self.has('href="mailto:mmartinez23bio@hotmail.com"')

    def test_whatsapp_correcto(self):
        self.has('href="https://wa.me/59892663680"')
        self.has("092 663 680")

    def test_formacion_profesional(self):
        self.has("nivel profesional")


class ApoyoTest(Base):
    def test_seccion_apoyar(self):
        self.has('id="apoyar"')

    def test_medios_de_apoyo(self):
        for dato in (
            "https://ko-fi.com/martinmartinezgarcia",
            "https://www.paypal.com/paypalme/blufferedtwitch",
            "referral=RC-DF-5848974-78640-68",
            "35502",
            "1006269736963",
        ):
            self.has(dato)

    def test_botones_copiar_validos(self):
        copias = re.findall(r'data-copy="([^"]*)"', HTML)
        self.assertGreaterEqual(len(copias), 4)
        self.assertTrue(all(c.strip() for c in copias), "hay un data-copy vacío")
        self.assertEqual(len(copias), len(re.findall(r'class="copy"', HTML)))


class EstiloTest(Base):
    def test_modo_dia_es_purpura_claro(self):
        bloque = CSS.split(':root[data-theme="light"]')[1].split("}")[0]
        self.has("--accent: #cbb6ff", bloque)
        self.has_not("#d7ff3f", bloque)

    def test_version_de_assets(self):
        self.has("style.css?v=11")
        self.has("script.js?v=6")

    def test_javascript_de_copiar(self):
        self.has("initCopy", JS)


class MovimientoTest(Base):
    def test_canvases_presentes(self):
        for ident in ("bg-field", "nav-terrain", "ripple-footer"):
            self.has(f'id="{ident}"')
            self.assertRegex(
                HTML,
                rf'<canvas[^>]*id="{ident}"[^>]*aria-hidden="true"',
                f"el canvas {ident} debe ser decorativo",
            )

    def test_script_de_movimiento(self):
        self.has('<script src="static/js/motion.js?v=1" defer>')
        self.assertTrue((ROOT / "static" / "js" / "motion.js").exists(), "falta motion.js")

    def test_motion_respeta_accesibilidad_y_rendimiento(self):
        motion = (ROOT / "static" / "js" / "motion.js").read_text(encoding="utf-8")
        for aguja in (
            "prefers-reduced-motion",
            "requestAnimationFrame",
            "visibilitychange",
            "devicePixelRatio",
            "IntersectionObserver",
        ):
            self.assertTrue(aguja in motion, f"falta en motion.js: {aguja}")
        for prohibido in ("innerHTML", "document.write", "eval("):
            self.assertTrue(prohibido not in motion, f"no usar {prohibido} en motion.js")

    def test_css_de_la_capa(self):
        self.has("#bg-field {", CSS)
        self.has(".nav-terrain {", CSS)
        self.has(".footer-ripples {", CSS)
        self.has("html {", CSS)

    def test_version_css_7(self):
        self.has("style.css?v=11")


class ExtensionVisualTest(Base):
    def test_captura_local_de_la_extension(self):
        self.assertRegex(
            HTML,
            r'<img src="static/img/yt-temporal-comments\.png" alt="[^"]+"'
            r' width="400" height="484"[^>]*>',
        )
        captura = ROOT / "static" / "img" / "yt-temporal-comments.png"
        self.assertTrue(captura.exists(), "falta la captura de la extensión")
        self.assertGreater(captura.stat().st_size, 20_000, "la captura parece vacía")


class LibroTest(Base):
    def test_seccion_de_libro_antes_de_los_proyectos(self):
        self.has('id="libro"')
        self.assertLess(HTML.index('id="libro"'), HTML.index('id="destacado"'))
        self.assertLess(HTML.index('id="libro"'), HTML.index('id="extension"'))

    def test_enlace_a_wrixy_con_url_seguro(self):
        self.has('href="https://wrixy.app/book/NoXSw7tI" rel="noopener"')
        self.has('href="https://martnmartnez14.github.io/libro-gnosticismo/" rel="noopener"')
        self.has("book-holo-cta")

    def test_boton_de_amazon_es_el_principal(self):
        """Amazon es el canal principal: botón propio, más grande que el de Wrixy."""
        self.has('href="https://www.amazon.es/dp/B0H4X4X14W" rel="noopener"')
        self.has('href="https://www.amazon.com.mx/dp/B0H4X4X14W" rel="noopener"')
        self.assertIn("B0H4X4X14W", HTML)
        self.has("book-amazon-cta")
        self.has("book-cta-sm")
        # Amazon aparece antes que Wrixy en los botones del libro
        self.assertLess(
            HTML.index("book-amazon-cta"),
            HTML.index('href="https://wrixy.app/book/NoXSw7tI"'),
        )
        # El botón de Amazon es más alto y con texto más grande que el chico
        def bloque(patron, nombre):
            encontrado = re.search(patron, CSS, re.S)
            self.assertIsNotNone(encontrado, f"falta la regla {nombre}")
            assert encontrado is not None
            return encontrado.group(1)

        bloque_amazon = bloque(r"\.book-amazon-cta \{(.*?)\}", ".book-amazon-cta")
        bloque_chico = bloque(r"\.book-cta-sm \{(.*?)\}", ".book-cta-sm")
        self.assertIn("min-height: 58px", bloque_amazon)
        self.assertIn("font-size: 1.05rem", bloque_amazon)
        self.assertIn("flex: 1 1 100%", bloque_amazon)
        self.assertIn("font-size: 0.82rem", bloque_chico)

    def test_portada_local_con_alt_y_dimensiones(self):
        self.assertRegex(
            HTML,
            r'<img src="static/img/gnosticismo-portada\.jpg" alt="[^"]*GNOSTICISMO[^"]*"'
            r' width="720" height="1152"[^>]*>',
        )
        portada = ROOT / "static" / "img" / "gnosticismo-portada.jpg"
        self.assertTrue(portada.exists(), "falta la portada del libro")
        self.assertGreater(portada.stat().st_size, 20_000, "la portada parece vacía")

    def test_marca_de_publicacion_en_curso(self):
        self.has("Publicado en Amazon")
        self.has("Próximamente")
        for plataforma in ("Apple Books (iTunes)", "Barnes &amp; Noble", "Kobo"):
            self.has(plataforma)
        self.has_not("En publicación")
        self.has_not("El enlace de Amazon todavía no está disponible")

    def test_no_inventa_enlace_de_amazon(self):
        self.assertIn("https://www.amazon.es/dp/B0H4X4X14W", HTML)
        self.assertIn("https://www.amazon.com.mx/dp/B0H4X4X14W", HTML)
        self.has_not("href=\"https://www.amazon.es/dp/ASIN\"")

    def test_estilos_del_libro(self):
        for aguja in (".book-feature {", ".book-cover {", ".book-badge {", "--book: #ffc46b"):
            self.has(aguja, CSS)


class LinkedInTest(Base):
    def test_linkedin_en_contacto_y_pie(self):
        self.assertGreaterEqual(HTML.count("https://www.linkedin.com/in/tipitincho/"), 2)

    def test_linkedin_cerca_del_contacto(self):
        contacto = HTML.split('id="contacto"')[1].split("</section>")[0]
        self.assertIn("linkedin.com/in/tipitincho", contacto)


if __name__ == "__main__":
    unittest.main()
