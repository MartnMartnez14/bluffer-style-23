# Bluffer Style 23

**[Abrir el portfolio público](https://martnmartnez14.github.io/bluffer-style-23/)**

Portfolio personal de **Martín Martínez García (Bluffer)**, desde Canelones, Uruguay. Proyectos de programación, bienestar, videojuegos y creatividad, con una identidad pastel suave y temas claro y oscuro. HTML, CSS y JavaScript, sin dependencias, fuentes externas ni compilación.

## Mini tutorial sin conocimientos técnicos

1. Abrí el enlace público desde tu computadora o celular.
2. Conocé **Checklist Gato**, el proyecto destacado, o recorré los 15 proyectos.
3. Elegí una categoría o escribí un nombre, tema o tecnología. Podés combinar ambos; la búsqueda ignora mayúsculas y tildes. Si no aparece nada, usá **Restablecer búsqueda y filtros**.
4. **Explorar** abre la aplicación o su página de juego; **Código** lleva al repositorio. Los programas locales y prototipos sin demo pública ofrecen su código.
5. Usá el botón de luna/sol para cambiar el tema. La primera visita sigue tu dispositivo y tu elección manual se guarda cuando el navegador lo permite.
6. En **Contacto** encontrás correo y WhatsApp. Ko-fi y Prex son apoyos voluntarios; el pie conserva el enlace de afiliado de Starlink.

Sin JavaScript, el contenido, los 15 proyectos y sus enlaces siguen disponibles. Se ocultan los controles que necesitan JavaScript.

## Catálogo y fuentes

Contenido tomado como punto de partida de [Bluffer 23 Universo en Sites](https://bluffer-23-universo.bluffer23polita.chatgpt.site/), conservando su orden y omitiendo la tarjeta de este mismo portfolio. Los 15 README y las 10 páginas enlazadas de aplicaciones/juegos respondieron HTTP 200 el **16 de octubre de 2026**. Se contrastaron las descripciones y tecnologías con esos README; esto no equivale a probar todas las funciones de cada proyecto.

| Proyecto | Presentación | Fuente | Aplicación |
| --- | --- | --- | --- |
| Checklist Gato | App online · Destacado | [README](https://github.com/MartnMartnez14/checklist#readme) | [Abrir](https://checklistgato.com/) |
| HuellasUY | App online | [README](https://github.com/MartnMartnez14/huellasuy#readme) | [Abrir](https://buerianiloba98.pythonanywhere.com/) |
| Viborita Classic | Disponible en itch.io | [README](https://github.com/MartnMartnez14/viboritaclassic#readme) | [Abrir](https://martnmartnez14.itch.io/snake-plus-spanish) |
| Go Offline | App online | [README](https://github.com/MartnMartnez14/go-offline#readme) | [Abrir](https://martnmartnez14.github.io/go-offline/) |
| Mesa Serena | App educativa | [README](https://github.com/MartnMartnez14/mesa-serena#readme) | [Abrir](https://martnmartnez14.github.io/mesa-serena/) |
| Entrenamiento Equino | Demo con datos ficticios | [README](https://github.com/MartnMartnez14/entrenamiento-equino#readme) | [Abrir](https://martnmartnez14.github.io/entrenamiento-equino/) |
| Librería Nexus | Demo local | [README](https://github.com/MartnMartnez14/999libreriadigital#readme) | Código y uso local |
| Mi Primera Huerta | App educativa | [README](https://github.com/MartnMartnez14/mi-primera-huerta#readme) | [Abrir](https://martnmartnez14.github.io/mi-primera-huerta/) |
| Pesos saludables | App educativa | [README](https://github.com/MartnMartnez14/peso-saludable#readme) | [Abrir](https://martnmartnez14.github.io/peso-saludable/) |
| Agüita | App online | [README](https://github.com/MartnMartnez14/aguita#readme) | [Abrir](https://martnmartnez14.github.io/aguita/) |
| MediLocal | Programa local | [README](https://github.com/MartnMartnez14/medilocal#readme) | Código y uso local |
| Seguridad Digital | Web educativa | [README](https://github.com/MartnMartnez14/cyberseguridad-mayores#readme) | [Abrir](https://martnmartnez14.github.io/cyberseguridad-mayores/) |
| Ashen Oath | Juego local | [README](https://github.com/MartnMartnez14/Ashen-Oath-Game#readme) | Código y uso local |
| Pokétipos offline | Proyecto offline | [README](https://github.com/MartnMartnez14/poketipos-offline-18#readme) | Código y uso local |
| Comentarios en YouTube | Prototipo local | [README](https://github.com/MartnMartnez14/extension-chrome-youtube-comentarios-colores#readme) | Código y uso local |

Los proyectos de salud ofrecen información educativa general; no realizan diagnósticos ni sustituyen atención profesional. La composición de notas del destacado es una ilustración en HTML/CSS, identificada como tal, sin capturas ni datos reales de usuarios.

## Abrir localmente

Podés abrir `index.html` directamente, sin instalar nada. Si ya tenés Python y preferís un servidor local:

```sh
python3 app.py
```

Abrí `http://127.0.0.1:8000` y detené el servidor con Ctrl+C. Python solo sirve la vista local; el sitio público es estático y no tiene backend. `requirements.txt` permanece vacío.

## Mantenimiento

- `index.html`: textos, metadatos, contactos y tarjetas estáticas. Cada tarjeta usa `data-category` con una de estas categorías: Herramientas, Bienestar, Juegos o Comunidad. Al cambiar el catálogo, actualizar también el contador inicial y este README.
- `static/css/style.css`: paletas en `:root` y `[data-theme="dark"]`, composiciones gráficas y adaptación a pantallas. Sin imágenes o fuentes externas. No hay animaciones continuas y se respeta `prefers-reduced-motion`.
- `static/js/script.js`: tema, búsqueda, filtros combinados, contador y estado vacío. El script se carga antes del CSS para aplicar el tema temprano; las tarjetas no se generan con JavaScript.

El tema conserva la clave `bluffer-style-23-theme` y los valores `light`/`dark`. Una preferencia válida tiene prioridad sobre `prefers-color-scheme`; sin elección manual se siguen los cambios del sistema. Si el almacenamiento falla, el selector sigue funcionando durante la visita. Borrar esa clave permite volver a la preferencia automática.

Al cambiar la paleta, actualizar también `theme-color` en HTML y JavaScript. Al publicar cambios de CSS/JS, incrementar `?v=` en sus enlaces. No se añaden cuentas, analítica, cookies de seguimiento ni sincronización del catálogo. Los enlaces externos llevan a servicios con sus propias condiciones.

Las anclas antiguas `#servicios` y `#proceso` apuntan a la presentación personal para conservar enlaces compartidos. Se mantienen `#inicio`, `#proyectos`, `#contacto` y `#contenido`.

## Verificación — 16 de octubre de 2026

- Navegador integrado de Codex: cinco anchos simulados, **320, 375, 768, 1024 y 1440 px**, en claro y oscuro; corregido el desbordamiento decorativo en móvil.
- Búsqueda real de `AGUITA` dentro de Bienestar: un resultado. Cambio a Juegos: estado vacío. Restablecer: 15 tarjetas y foco en la búsqueda. Cambio de tema y recarga: preferencia conservada.
- **212 elementos con texto comprobados por tema**, sin resultados inferiores a 4,5:1; mínimo medido **4,81:1 en claro y 5,27:1 en oscuro**. Es una comprobación de paleta, no una auditoría integral WCAG.
- Pruebas aisladas del script con Node ya disponible: filtros, tildes, mayúsculas, contador, estado vacío, restablecer/foco, preferencia guardada, sistema y almacenamiento bloqueado. HTML inspeccionado para confirmar que las tarjetas no dependen de JavaScript.
- Inspección de foco visible, enlace para saltar al contenido, botón de tema de 44 × 44 px y regla de movimiento reducido. Sin errores de consola observados durante las interacciones.
- Verificación estructural de enlaces internos, identificadores únicos, recursos locales, sintaxis JavaScript y diferencias sin errores de espacios.

No se probaron teléfonos físicos, lectores de pantalla, Safari, Firefox ni Edge. El caso sin JavaScript y el almacenamiento bloqueado se verificaron por inspección/pruebas aisladas, no mediante una sesión completa de navegador con esas restricciones. No se enviaron mensajes, formularios ni pagos para comprobar los contactos y apoyos.

## Publicación

GitHub Pages publica la rama `main` y la carpeta raíz, con rutas relativas compatibles con `/bluffer-style-23/`. La actualización conserva la URL pública actual y no modifica el sitio de Sites. GitHub Pages puede tardar unos minutos en reflejar un commit nuevo.
