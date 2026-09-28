# Feliz Cumpleaños 💗

Una web-experiencia de cumpleaños animada: portada → corazón que se "enciende" al mantenerlo presionado → recuerdos en polaroids deslizables → carta con efecto de máquina de escribir → cierre con confeti y una tarjeta descargable.

Hecha con **React + TypeScript + Vite + Tailwind CSS v4 + Framer Motion**.

## Personalizar (con el editor visual — recomendado)

1. Corre `npm run dev`.
2. Abre **http://localhost:5183/editor** en el navegador (o toca "Editar contenido" al pie de la portada).
3. Cambia nombre, fecha, mensajes, fotos (sube todas las que quieras, reordénalas con las flechas, bórralas), la carta y, si quieres, música de fondo.
4. Toca **Guardar cambios**. Se escribe directo en `src/content.data.json` y en `public/photos/` / `public/audio/` — no hace falta tocar código.
5. Ve a **http://localhost:5183/** (o toca "Ver vista previa") para ver el resultado.

El editor **solo funciona en desarrollo local** (`npm run dev`). No aparece ni funciona en el sitio publicado — la persona que reciba el link solo ve la experiencia final, nunca el editor.

## Personalizar a mano (alternativa)

Todo el contenido también se puede editar directamente en [`src/content.data.json`](src/content.data.json):

- `recipientName`, `coverTitle`, `coverSubtitle`, `eventDate`
- `chargeMessages`: frases que rotan mientras se llena el corazón
- `photos`: array de `{ src, caption }` — agrega tantas como quieras. Coloca los archivos en `public/photos/`. Mientras no exista la foto real, se muestra un placeholder de color con el texto "Reemplaza esta imagen", así que nunca se ve una imagen rota.
- `letterTitle`, `letterParagraphs`, `letterSignature`: el texto de la carta
- `finalTitle`, `finalMessage`, `finalPhoto`: la tarjeta de cierre
- `musicSrc`: ruta a un mp3 en `public/audio/` (por ejemplo `/audio/cancion.mp3`). Déjalo vacío (`""`) para no mostrar el botón de música.

## Comandos

```bash
npm install       # instalar dependencias (ya está hecho)
npm run dev        # servidor de desarrollo
npm run build       # build de producción (carpeta dist/)
npm run preview     # previsualizar el build
```

## Publicar y compartir por QR

1. Sube el proyecto a [Vercel](https://vercel.com) o [Netlify](https://netlify.com) (arrastra la carpeta `dist/` generada por `npm run build`, o conecta el repo).
2. Genera un QR de la URL publicada (por ejemplo en [qr-code-generator.com](https://www.qr-code-generator.com) o con la librería `qrcode` de npm) y listo — igual que el video de referencia, pero con una experiencia propia.

## Estructura

```
src/
  content.data.json    # todo el contenido personalizable (editable a mano o vía /editor)
  content.ts            # tipos + carga de content.data.json
  EditorApp.tsx           # editor visual (solo en desarrollo, /editor)
  App.tsx                  # máquina de estados entre escenas
  components/
    CoverScene.tsx      # portada
    HeartCharger.tsx     # corazón que se llena al mantener presionado
    PolaroidStack.tsx     # carrusel de fotos deslizable
    LoveLetter.tsx         # carta con efecto typewriter
    FinalToast.tsx          # cierre + confeti + descarga de imagen
    FloatingHearts.tsx       # corazones flotantes de fondo
    MusicToggle.tsx           # botón de mute/unmute
    PhotoImg.tsx                # imagen con fallback a placeholder
  hooks/
    useAudio.ts          # control de música de fondo
```

## Diferencias frente a la plantilla genérica de referencia

- Mecánica de "mantener presionado" con física real (llenado + decaimiento), no solo una barra que avanza.
- Fotos como un carrusel de polaroids arrastrable (drag), no capturas de pantalla.
- El botón final "Guardar este momento" genera de verdad una tarjeta PNG descargable.
- Todo el contenido está centralizado en un único archivo, así que puedes reutilizar la web para cualquier persona o fecha sin tocar código.
- Sin marca de agua ni dependencia de un servicio de terceros: el código es tuyo.
# Feliz-Cumplea-os
