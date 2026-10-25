# Dirección visual

Portfolio gráfico y animado para presentar experiencia de ingeniería y productos personales. Conserva la identidad lima/carbón, la cuadrícula y la tipografía Onest existente.

## Decisiones

- Hero sobre una superficie lima, título de gran tamaño y una acción principal hacia proyectos.
- Una línea de lectura clara: identidad, especialidad, propuesta y contacto.
- Composición de cartel técnico: bordes rectos, alto contraste y secciones numeradas.
- Experiencia en filas cronológicas y proyectos con capturas enmarcadas.
- Cierre con una invitación directa a contactar.
- Capturas de proyectos contenidas para evitar recortar las interfaces.
- Tipografía, espaciado y colores definidos para ambos temas.
- Navegación simple: botón «Menú» fijo arriba a la derecha y panel lateral con enlaces grandes en cursiva. Sin nombre superior ni índice lateral junto al contenido. Se adapta a la identidad lima del portfolio.
- Hero de borde limpio, sin sombra desplazada.
- Cabecera sin nombre ni monograma, con un único botón de menú. El panel usa un diálogo modal nativo para gestionar foco y Escape; incluye controles de tema e idioma y respeta Safe Areas.
- Previews de proyectos con lienzo 16:10, marco compartido y acento propio. Capturas sin datos personales; portadas de arquitectura para proyectos sin captura de interfaz. El mismo renderizador sirve tarjetas estáticas, Firestore y galería animada.
- Los estilos públicos usan `body[data-page="portfolio"]`; el CMS mantiene sus controles.
- Las tarjetas locales y las generadas por Firestore comparten los mismos selectores.
- Se mantienen Safe Areas, reducción de movimiento y contenido editable.

## Referencias consultadas

- [Anthropic: frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design): dirección propia, jerarquía tipográfica, contención y revisión visual.
- [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): consulta de sistema de diseño para `software engineer portfolio editorial` y guías Astro de responsive y accesibilidad.

La primera consulta propuso una dirección Swiss/minimalista. La revisión posterior adopta una composición más gráfica, conservando lima y Onest.

- [GSAP Skills oficiales](https://github.com/greensock/gsap-skills): guías core, timeline, ScrollTrigger y rendimiento. GSAP se incorpora como dependencia de la web pública.

## Movimiento

- Entrada secuenciada de identidad, título, descripción y acciones.
- Emblema SVG decorativo con entrada y rotación vinculada al scroll.
- Revelado de secciones y tarjetas, incluidas las añadidas por Firestore.
- Indicador de progreso de lectura.
- Galería de productos con tarjetas superpuestas, perspectiva y relevos vinculados al scroll mediante una timeline con pinning. Se activa solo en escritorio con puntero preciso, altura suficiente y movimiento permitido.
- La galería refleja los proyectos destacados visibles que carga el CMS; sus enlaces llevan a las fichas completas.
- Scroll nativo sin secuestro de rueda; móvil y movimiento reducido usan una galería horizontal táctil sin pinning.
- `gsap.matchMedia()` desactiva las animaciones con movimiento reducido.
- Los contextos se revierten antes de las transiciones de Astro. La carga de fuentes, imágenes y contenido remoto actualiza ScrollTrigger.
- El contenido sigue visible sin JavaScript.

## Comprobaciones

Capturas y navegación revisadas con Brave/Chromium a 375, 390, 768, 1024, 1440 y 2560 px. Verificados tema, traducción, menú móvil y aislamiento visual del admin. Estas comprobaciones no sustituyen una prueba de las barras nativas de Safari en iPhone.
