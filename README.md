# Bluffer Style 23

**[Abrir el sitio público](https://martnmartnez14.github.io/bluffer-style-23/)**

Portfolio de **Martín Martínez García**: soluciones digitales simples, proyectos de programación, nutrición y tecnología. HTML, CSS y JavaScript vanilla, sin dependencias, fuentes externas ni proceso de compilación.

> Esta modernización está entregada localmente. El enlace público puede seguir mostrando la versión anterior hasta que se publiquen estos commits.

## Mini tutorial sin conocimientos técnicos

1. Abrí el sitio desde una computadora o un celular.
2. Usá el menú para recorrer Servicios, Proyectos, Cómo trabajamos y Contacto.
3. En Proyectos, **Ver proyecto** abre la aplicación y **Código** abre su repositorio. MediLocal es una aplicación local y ofrece acceso al código.
4. El botón de sol/luna cambia el tema. La primera visita sigue el tema del dispositivo y la elección manual se recuerda en el navegador.
5. Podés contactar por correo o WhatsApp. Los apoyos de Ko-fi y Prex son voluntarios; Starlink conserva su enlace de afiliado.

## Proyectos destacados y fuentes

Las descripciones y tecnologías se contrastaron con los README públicos de GitHub durante la planificación del 7 de octubre de 2026. Bluffer 23 Universo se consultó como referencia complementaria; ante diferencias se priorizó el repositorio actual.

| Proyecto | Código y fuente | Aplicación |
| --- | --- | --- |
| Peso Saludable | [README](https://github.com/MartnMartnez14/peso-saludable#readme) | [Abrir](https://martnmartnez14.github.io/peso-saludable/) |
| HuellasUY | [README](https://github.com/MartnMartnez14/huellasuy#readme) | [Abrir](https://buerianiloba98.pythonanywhere.com/) |
| MediLocal | [README](https://github.com/MartnMartnez14/medilocal#readme) | Aplicación local en Python y SQLite |
| Seguridad Digital | [README](https://github.com/MartnMartnez14/cyberseguridad-mayores#readme) | [Abrir](https://martnmartnez14.github.io/cyberseguridad-mayores/) |
| Agüita | [README](https://github.com/MartnMartnez14/aguita#readme) | [Abrir](https://martnmartnez14.github.io/aguita/) |
| Mesa Serena | [README](https://github.com/MartnMartnez14/mesa-serena#readme) | [Abrir](https://martnmartnez14.github.io/mesa-serena/) |

[Bluffer 23 Universo](https://bluffer-23-universo.bluffer23polita.chatgpt.site/).
Los proyectos de salud son educativos; no realizan diagnósticos ni sustituyen atención profesional.

## Abrir la versión local

Podés abrir `index.html` directamente. Para comprobar la página en un origen HTTP estable con Python ya disponible:

```sh
python3 app.py
```

Abrí `http://127.0.0.1:8000`. Detené el servidor con Ctrl+C. `app.py` es solo una herramienta local; GitHub Pages no necesita Python ni backend. `requirements.txt` está vacío: no hace falta instalar paquetes.

## Mantenimiento

- `index.html`: textos, navegación, tarjetas, contactos y metadatos. Las tarjetas son HTML estático y funcionan sin JavaScript. Al agregar una, comprobar su README, tecnologías y URL real; no inventar una demo.
- `static/css/style.css`: variables del tema claro en `:root` y nocturno en `[data-theme="dark"]`, estilos compartidos y tamaños responsive. Los acentos de proyecto son decorativos.
- `static/js/script.js`: inicialización del tema y selector. Se carga antes del CSS para reducir el destello del tema incorrecto.

El tema usa `bluffer-style-23-theme` en `localStorage`, con valores `light` o `dark`. Preferencias ausentes o inválidas siguen `prefers-color-scheme`; cambios del sistema se aplican hasta una elección manual. Si el almacenamiento está bloqueado, la elección funciona durante la visita pero no se puede garantizar persistencia. Para volver al tema automático, borrar esa clave desde las herramientas del navegador o los datos del sitio.

Si cambia la paleta de fondo, actualizar también los valores de `theme-color` en el script y su valor inicial en HTML. Tras editar CSS o JS, incrementar sus parámetros `?v=` para evitar versiones antiguas en caché.

La navegación móvil queda visible y se desplaza con la página para no tapar contenido. Solo la barra utiliza desenfoque opcional con fondo opaco de respaldo. No hay animaciones continuas; se respeta `prefers-reduced-motion`.

La publicación sigue siendo estática: rama configurada en GitHub Pages y carpeta raíz. Conservar rutas relativas bajo `/bluffer-style-23/`. Esta entrega no modifica la configuración ni publica cambios.

## Verificación local — 7 de octubre de 2026

- **70 comprobaciones con Playwright ya disponible y Chrome instalado**: ambos temas a 320, 375, 768, 1024 y 1440 px, seis tarjetas, ausencia de desbordamiento y recortes, navegación interna y destinos sin quedar detrás de la barra.
- Primera visita según sistema, cambio manual, recarga, otra pestaña y nueva sesión con almacenamiento conservado; seguimiento del sistema y prioridad manual.
- Preferencia inválida, almacenamiento bloqueado, contenido sin JavaScript y selector oculto cuando no está operativo.
- Enlace para saltar al contenido por teclado, control de 44 × 44 px, movimiento reducido y fondo opaco sin desenfoque.
- **41 comprobaciones de contraste** de colores de texto sobre superficies y extremos de gradientes de botones: mínimo medido **5,54:1**. Esto verifica la paleta, no constituye una auditoría integral de conformidad WCAG.
- Capturas revisadas en claro y nocturno, escritorio y móvil; sintaxis JavaScript válida, HTML con etiquetas equilibradas e identificadores únicos, recursos relativos existentes y `git diff --check` sin errores. No se detectaron errores JavaScript de página durante las pruebas.
- GitHub, los seis repositorios, las cinco aplicaciones públicas, Starlink y la redirección de WhatsApp respondieron **HTTP 200**. Es una comprobación de disponibilidad, no una garantía de todas las funciones de esos servicios.
- **Ko-fi devolvió HTTP 403** a la consulta automatizada. Se conserva el enlace original; su disponibilidad visual no quedó verificada.
- Correo validado como enlace `mailto:`; no se comprobó entrega. WhatsApp conserva el número nacional y elimina el cero local: `https://wa.me/59898053913`. No se verificó la titularidad ni se enviaron mensajes, pagos o formularios.

Las pruebas de navegador se ejecutaron en Chrome de escritorio con tamaños móviles simulados. Firefox, Edge y teléfonos físicos no se probaron directamente. El diseño utiliza características estándar con fallbacks; la publicación y sus posibles cachés quedan fuera de esta entrega local.
