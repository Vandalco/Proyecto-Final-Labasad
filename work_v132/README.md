# Studio Vandal Co. — Prototipo web final

## Objetivo

Prototipo web funcional para **Studio Vandal Co.**, con una estructura de estudio editorial: navegación mínima, textos de gran escala, manifiesto de marca, recorrido visual, portfolio horizontal, reel y contacto.

## Archivos

- `index.html`: estructura semántica del sitio.
- `styles.css`: identidad visual, responsive design, layout editorial, animaciones y estados interactivos.
- `script.js`: menú mobile, navegación activa, filtros de portfolio, modo Index, scroll suavizado, scroll horizontal en Work, cursor personalizado, animaciones de aparición y validación del formulario.
- `assets/`: imágenes y video del proyecto.
- `presentacion-avances.md`: resumen de avances para exponer.
- `entrega-final.md`: resumen final de entrega.

## Secciones

- `Home`: entrada visual del estudio.
- `Studio`: manifiesto, enfoque y descripción del sistema gráfico.
- `Scroll Story`: recorrido visual con piezas Vandal al hacer scroll.
- `Work`: portfolio principal con slides horizontales, filtros por categoría y modo Index.
- `Reel`: video de recorrido/prototipo.
- `Contact`: formulario con validación básica.

## Criterios implementados

- HTML básico con estructura semántica.
- CSS principal aplicado con línea gráfica de Studio Vandal Co.
- JavaScript con interacciones reales.
- Recorrido visual con piezas Vandal apareciendo al hacer scroll.
- Cursor con línea que sigue el movimiento del mouse en escritorio.
- Scroll horizontal en Work controlado por scroll vertical.
- Filtros de portfolio por categoría.
- Modo Index para listar los proyectos.
- Responsive design para escritorio y celular.
- Accesibilidad básica: `skip-link`, estados `aria`, foco visible, soporte para `prefers-reduced-motion`.
- Validación básica del formulario de contacto.

## Cómo abrirlo

Abrir `index.html` en el navegador. No requiere instalación ni dependencias externas.

## Ultimo ajuste solicitado

La seccion Work usa un efecto de portfolio tipo reel vertical: la pantalla queda fija, los proyectos se desplazan verticalmente con blur/parallax y el scroll general ya no esta interceptado por una animacion lenta de rueda.
