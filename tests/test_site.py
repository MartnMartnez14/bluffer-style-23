"""Validaciones del portafolio estático. Ejecutar: python3 -m unittest discover -s tests -v"""
import pathlib
import re
import unittest

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "static" / "css" / "style.css").read_text(encoding="utf-8")
JS = (ROOT / "static" / "js" / "script.js").read_text(encoding="utf-8")

CARDS = re.findall(r'<article class="project-card[^"]*".*?</article>', HTML, re.S)
NUMBERS = [re.search(r'class="project-number">\s*(\d+)', c).group(1) for c in CARDS]


class CatalogoTest(unittest.TestCase):
    def test_hay_22_proyectos(self):
        self.assertEqual(len(CARDS), 22)

    def test_numeracion_correlativa(self):
        self.assertEqual(NUMBERS, [f"{i:02d}" for i in range(1, 23)])

    def test_extension_es_la_tarjeta_02(self):
        self.assertIn("YT Temporal Comments", CARDS[1])
        self.assertIn("data-featured=\"true\"", CARDS[1])

    def test_contador_coincide(self):
        self.assertIn("22 proyectos para explorar", HTML)

    def test_enlaces_de_proyectos_nuevos(self):
        for url in (
            "https://martnmartnez14.github.io/tambo-app/",
            "https://martnmartnez14.github.io/catalogo-comercios/",
            "https://martnmartnez14.github.io/inac-carnes-infografia/",
        ):
            self.assertIn(url, HTML)

    def test_no_quedan_datos_viejos(self):
        for viejo in ("outlook.com", "59898053913", "Soy Martín,", "estudiante de Nutrición."):
            self.assertNotIn(viejo, HTML)


class ContactoTest(unittest.TestCase):
    def test_correo_hotmail(self):
        self.assertGreaterEqual(HTML.count("mmartinez23bio@hotmail.com"), 3)
        self.assertIn('href="mailto:mmartinez23bio@hotmail.com"', HTML)

    def test_whatsapp_correcto(self):
        self.assertIn('href="https://wa.me/59892663680"', HTML)
        self.assertIn("092 663 680", HTML)

    def test_formacion_profesional(self):
        self.assertIn("nivel profesional", HTML)


class ApoyoTest(unittest.TestCase):
    def test_seccion_apoyar(self):
        self.assertIn('id="apoyar"', HTML)

    def test_medios_de_apoyo(self):
        for dato in (
            "https://ko-fi.com/martinmartinezgarcia",
            "https://www.paypal.com/paypalme/blufferedtwitch",
            "referral=RC-DF-5848974-78640-68",
            "35502",
            "1006269736963",
        ):
            self.assertIn(dato, HTML)

    def test_botones_copiar_validos(self):
        copias = re.findall(r'data-copy="([^"]*)"', HTML)
        self.assertGreaterEqual(len(copias), 4)
        self.assertTrue(all(c.strip() for c in copias))
        self.assertEqual(len(copias), len(re.findall(r'class="copy"', HTML)))


class EstiloTest(unittest.TestCase):
    def test_modo_dia_es_purpura_claro(self):
        bloque = CSS.split(':root[data-theme="light"]')[1].split("}")[0]
        self.assertIn("--accent: #cbb6ff", bloque)
        self.assertNotIn("#d7ff3f", bloque)

    def test_version_de_assets(self):
        self.assertIn("style.css?v=6", HTML)
        self.assertIn("script.js?v=6", HTML)

    def test_javascript_de_copiar(self):
        self.assertIn("initCopy", JS)


if __name__ == "__main__":
    unittest.main()
