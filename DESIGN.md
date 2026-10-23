# Dirección visual

Portfolio editorial para presentar experiencia de ingeniería y productos personales. Conserva la identidad lima/carbón, la cuadrícula y la tipografía Onest existente.

## Decisiones

- Hero abierto, título en caja normal y una acción principal hacia proyectos.
- Una línea de lectura clara: identidad, especialidad, propuesta y contacto.
- Superficies y bordes discretos; el acento se reserva para acciones y selección.
- Capturas de proyectos contenidas para evitar recortar las interfaces.
- Tipografía, espaciado y colores definidos para ambos temas.
- Navegación acotada al ancho del contenido, con objetivos táctiles de al menos 44 px.
- Los estilos públicos usan `body[data-page="portfolio"]`; el CMS mantiene sus controles.
- Las tarjetas locales y las generadas por Firestore comparten los mismos selectores.
- Se mantienen Safe Areas, reducción de movimiento y contenido editable.

## Referencias consultadas

- [Anthropic: frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design): dirección propia, jerarquía tipográfica, contención y revisión visual.
- [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): consulta de sistema de diseño para `software engineer portfolio editorial` y guías Astro de responsive y accesibilidad.

La consulta propuso una dirección Swiss/minimalista. Se adaptó a la identidad existente: se conserva el lima y Onest en lugar de adoptar el azul y las fuentes sugeridas. No se incorporan dependencias ni scripts de estos repositorios a la aplicación.

## Comprobaciones

Capturas y navegación revisadas con Brave/Chromium a 375, 390, 768, 1024, 1440 y 2560 px. Verificados tema, traducción, menú móvil y aislamiento visual del admin. Estas comprobaciones no sustituyen una prueba de las barras nativas de Safari en iPhone.
