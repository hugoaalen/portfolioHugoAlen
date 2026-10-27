# Dirección visual

Portfolio gráfico y animado para presentar experiencia de ingeniería y productos personales. Identidad azul acero/grafito, cuadrícula y tipografía Onest existente.

## Decisiones

- Hero sobre superficie neutra, título de gran tamaño y una acción principal azul hacia proyectos. Sin grandes masas de color de acento.
- Azul acero `#A7BCD9` para botones, indicadores y detalles; tinta `#17202B` sobre azul. En tema claro, texto de acento `#405E80` para mantener contraste; en oscuro, azul acero. Superficies grafito y texto blanco cálido en oscuro.
- Una línea de lectura clara: identidad, especialidad, propuesta y contacto.
- Composición de cartel técnico: bordes rectos, alto contraste y secciones numeradas.
- Experiencia en filas cronológicas y proyectos con capturas enmarcadas.
- Cierre con una invitación directa a contactar.
- Capturas de proyectos contenidas para evitar recortar las interfaces.
- Tipografía, espaciado y colores definidos para ambos temas.
- Regla superpuesta al borde derecho, sin columnas, padding lateral ni cambios al centrado del contenido. Rótulos pasados quedan pequeños y horizontales arriba; activa horizontal y grande; futuras giran -90 grados mientras recorren la regla y esperan horizontales abajo. GSAP interpola posición, escala y giro, con entrada y hover escalonados por letra; respeta movimiento reducido. Progreso numérico sin ceros iniciales ni porcentaje.
- Preferencias en dock discreto inferior izquierdo, con tema y bandera ES/EN. Selector de sección compacto independiente arriba a la derecha. Menú de temas se abre hacia arriba, respetando safe areas.
- Escala operable con pulsación, arrastre y teclado. En anchos reducidos o ventanas bajas, selector nativo de secciones; en móvil, progreso superior fino. Tema e idioma accesibles directamente, sin botón «Menú» ni diálogo antiguo.
- Hero de borde limpio, sin sombra desplazada.
- Cabecera sin nombre ni monograma. Controles compactos respetan Safe Areas; el selector nativo mantiene acceso a todas las secciones en pantallas estrechas.
- Previews de proyectos con lienzo 16:10, marco compartido y acento propio. Capturas sin datos personales; portadas de arquitectura para proyectos sin captura de interfaz. El mismo renderizador sirve tarjetas estáticas, Firestore y galería animada.
- Los estilos públicos usan `body[data-page="portfolio"]`; el CMS mantiene sus controles.
- Las tarjetas locales y las generadas por Firestore comparten los mismos selectores.
- Se mantienen Safe Areas, reducción de movimiento y contenido editable.

## Referencias consultadas

- [Anthropic: frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design): dirección propia, jerarquía tipográfica, contención y revisión visual.
- [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): consulta de sistema de diseño para `software engineer portfolio editorial` y guías Astro de responsive y accesibilidad.

La primera consulta propuso una dirección Swiss/minimalista. La revisión posterior adopta una composición más gráfica. La paleta actual sustituye el lima por azul acero, conservando Onest y las animaciones.

- [GSAP Skills oficiales](https://github.com/greensock/gsap-skills): guías core, timeline, ScrollTrigger y rendimiento. GSAP se incorpora como dependencia de la web pública.

## Movimiento

- Hovers GSAP solo con puntero fino y sin movimiento reducido: relleno ascendente, magnetismo y respuesta elástica en botones; perspectiva, parallax y luz en las previews; acentos y desplazamiento de títulos en experiencia, formación y contacto.
- Eventos delegados incluyen contenido nuevo del CMS sin volver a registrar listeners. Los efectos se revierten al cambiar de ruta o preferencia de movimiento. No se animan las tarjetas externas de la galería fijada: sus ventanas interiores evitan conflictos con ScrollTrigger.
- Entrada secuenciada de identidad, título, descripción y acciones.
- Emblema SVG decorativo con entrada y rotación vinculada al scroll.
- Revelado de secciones y tarjetas, incluidas las añadidas por Firestore.
- Indicador de lectura sincronizado con scroll y cambios de altura (CMS y galería con pinning), sin secuestrar desplazamiento. Animación de cursor desactivada con movimiento reducido.
- Galería de productos con tarjetas superpuestas, perspectiva y relevos vinculados al scroll mediante una timeline con pinning. Se activa solo en escritorio con puntero preciso, altura suficiente y movimiento permitido.
- La galería refleja los proyectos destacados visibles que carga el CMS; sus enlaces llevan a las fichas completas.
- Scroll nativo sin secuestro de rueda; móvil y movimiento reducido usan una galería horizontal táctil sin pinning.
- `gsap.matchMedia()` desactiva las animaciones con movimiento reducido.
- Los contextos se revierten antes de las transiciones de Astro. La carga de fuentes, imágenes y contenido remoto actualiza ScrollTrigger.
- El contenido sigue visible sin JavaScript.

## Comprobaciones

Capturas y navegación revisadas con Brave/Chromium a 375, 390, 768, 1024, 1440 y 2560 px. Verificados tema, traducción, menú móvil y aislamiento visual del admin. Estas comprobaciones no sustituyen una prueba de las barras nativas de Safari en iPhone.
