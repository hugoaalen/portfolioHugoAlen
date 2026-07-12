# Editar contenido del portfolio

El contenido principal del portfolio vive en `src/data`. La idea es que puedas actualizar textos, proyectos, experiencia y formación sin tocar componentes Astro ni clases CSS.

## Archivos

- `src/data/profile.json`: datos personales, hero, email y redes.
- `src/data/about.json`: párrafos de la sección "Sobre mí".
- `src/data/projects.json`: proyectos, imágenes, enlaces y tecnologías.
- `src/data/experience.json`: experiencia profesional.
- `src/data/education.json`: formación.

## Campos comunes

En listas como proyectos, experiencia, formación y about:

- `id`: identificador único. No lo repitas.
- `order`: orden de aparición. Usa saltos de 10 para poder insertar elementos entre medias.
- `visible`: `true` para mostrar, `false` para ocultar sin borrar.

Los textos traducibles usan siempre:

```json
{
  "es": "Texto en español",
  "en": "English text"
}
```

## Proyectos

Ejemplo mínimo:

```json
{
  "id": "mi-proyecto",
  "order": 60,
  "visible": true,
  "featured": false,
  "status": "published",
  "category": "app",
  "title": {
    "es": "Mi proyecto",
    "en": "My project"
  },
  "description": {
    "es": "Descripción breve.",
    "en": "Short description."
  },
  "github": "https://github.com/hugoaalen/mi-proyecto",
  "link": "https://mi-proyecto.vercel.app",
  "image": "/projects/mi-proyecto.png",
  "tags": ["REACT", "TYPESCRIPT", "VITE"]
}
```

Campos extra:

- `featured`: si es `true`, la tarjeta se muestra destacada en desktop.
- `status`: puede ser `published`, `draft` o `archived`. Solo `published` se renderiza.
- `category`: puede ser `app`, `website`, `game`, `tool` o `design`.
- `image`: ruta pública. La imagen debe estar en `public`, por ejemplo `public/projects/mi-proyecto.png` se referencia como `/projects/mi-proyecto.png`.

Tags disponibles:

```txt
NEXT, TAILWIND, HTML, CSS, VANILLAJS, BOOTSTRAP, REACT, SUPABASE, ASTRO, VITE, TYPESCRIPT, FIREBASE, PHP, ANGULAR, MYSQL
```

## Validación

El archivo `src/data/content.ts` valida el contenido al construir la web. Si algo está mal, `astro check` o `astro build` fallará con un mensaje que empieza por `[content]`.

Valida, entre otras cosas:

- IDs repetidos.
- Campos obligatorios vacíos.
- Traducciones `es` y `en`.
- Tags de proyecto inexistentes.
- URLs mal formadas.
- Imágenes que no empiezan por `/`.

## Flujo recomendado

1. Edita el JSON correspondiente.
2. Si añades imágenes, colócalas en `public/projects`.
3. Ejecuta:

```bash
pnpm run build
```

4. Si el build pasa, el portfolio está listo para desplegar.

## CMS con Firebase

La primera pantalla editable vive en `/admin/projects`.

- El acceso se hace con Google Auth.
- Solo `hugoaalen@gmail.com` debe poder escribir en Firestore.
- Los proyectos se guardan en la colección `projects`.
- El botón `Importar JSON` copia el contenido actual de `src/data/projects.json` a Firestore como semilla inicial.

Antes de usar el CMS hay que publicar las reglas de Firestore:

```bash
firebase deploy --only firestore:rules --project portfolio-hugo-alen
```

Si prefieres hacerlo desde la consola de Firebase, pega el contenido de `firestore.rules` en Firestore Database > Reglas y publícalo.
