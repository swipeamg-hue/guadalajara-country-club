# Presentación Interactiva SPA — Guadalajara Country Club

Esta es una aplicación web interactiva de una sola página (Single Page Application - SPA) de diseño premium, adaptada para ofrecer las soluciones químicas profesionales de **Swipe** a las 5 áreas clave del prestigioso **Guadalajara Country Club** en Guadalajara, Jalisco, México.

---

## 💎 Características Premium

1. **Diseño Visual Sorprendente (Wow Factor)**:
   - Interfaz con modo oscuro inmersivo.
   - Efectos **Glassmorphism** de última generación (paneles translúcidos con desenfoque de fondo y bordes brillantes).
   - Paleta de colores armoniosa, vibrante y codificada de manera única para cada una de las 5 áreas de negocio.
   - Logotipos y gráficos vectoriales nativos (SVG) para una nitidez pixel-perfect en pantallas de ultra-alta definición (Retina/4K).
   
2. **Navegación de 5 Columnas Expansivas (Híbrida e Interactiva)**:
   - Inicialmente, la pantalla se divide equitativamente en 5 columnas verticales y dinámicas.
   - **Hover**: Al pasar el cursor, la columna se expande y enfoca sutilmente mientras las otras se contraen y difuminan ligeramente.
   - **Click para Pantalla Completa**: Al hacer clic, la columna realiza una transición fluida en curva `cubic-bezier` para ocupar el 100% de la pantalla, revelando un panel de control técnico completo sin perder el flujo dinámico.
   - **Botón de Escape**: Botón flotante para salir de la pantalla completa y volver cómodamente al menú general.

3. **Catálogo Integrado por Áreas**:
   - **Alberca & Acuáticos**: Productos de control biológico, sanitización por choque y abrillantadores.
   - **Spa & Wellness**: Aromaterapia botánica, desinfección dérmica y cuidado de tinas térmicas.
   - **Gimnasio & Fitness**: Sanitizantes anticorrosivos de pantallas/tapizados y destructor enzimático de olores.
   - **Gastronomía & Cocinas**: Desengrasantes de cochambre extremo y sanitizante de grado alimentario sin enjuague para Distintivo H.
   - **Mantenimiento General**: Solución biodegradable multiusos concentrada Swipe y embellecedores de acabados.

4. **Motores de Cálculo de Dosificación en Tiempo Real**:
   - Cada área cuenta con su propio simulador matemático:
     - *Alberca*: Calcula dosificación exacta de sanitizante/alguicida/clarificador en gramos o litros según los metros cúbicos.
     - *Spa*: Calcula consumo diario de esencias según el volumen del cuarto de vapor y la intensidad seleccionada.
     - *Gimnasio*: Muestra el volumen resultante de producto listo para usar y el ahorro económico estimado frente a limpiadores comerciales ordinarios.
     - *Gastronomía*: Despliega el protocolo paso a paso para desinfección según el distintivo de calidad (H).
     - *Mantenimiento*: Muestra la proporción exacta en mililitros de Swipe Concentrado y agua limpia según el tamaño del atomizador.

5. **Sistema de Cotización Personalizado ("Cotizador Guadalajara Country Club")**:
   - Los tomadores de decisiones pueden agregar productos químicos a una cotización de forma instantánea.
   - Una barra flotante en la parte inferior de la pantalla aparece con un contador dinámico.
   - Abre un modal con el desglose de productos y permite rellenar un formulario con los cargos reales del Club (Gerente de Mantenimiento, Director de Compras, etc.) para procesar la cotización.

---

## 🛠️ Estructura del Proyecto

El proyecto está diseñado bajo una filosofía de **cero dependencias (Vanilla Stack)**, garantizando tiempos de carga instantáneos de menos de 1 segundo y máxima flexibilidad de personalización:

```
Guadalajara-Country-Club/
├── index.html              # Estructura principal y plantillas de modales
├── css/
│   ├── main.css            # Estilos globales, variables de color y fuentes
│   ├── sections.css        # Acordeón de 5 columnas y catálogo
│   └── components.css      # Calculadoras, modales, cotizador flotante
├── js/
│   ├── products.js         # Base de datos JSON de productos y fichas técnicas
│   ├── calculators.js      # Algoritmos de cálculo de dosificación química
│   └── app.js              # Controlador principal, transiciones y carrito
├── assets/                 # Recursos gráficos
└── README.md               # Este documento
```

---

## 🚀 Instalación y Despliegue Local

1. **Abrir Localmente**:
   - No requiere de compilación o instalación de paquetes NPM pesados.
   - Simplemente haz doble clic en el archivo `index.html` en cualquier computadora y se ejecutará de forma perfecta.
   
2. **Despliegue a Producción (GitHub Pages)**:
   - Dado que es un proyecto puramente estático de alto rendimiento, puedes publicarlo de manera 100% gratuita utilizando **GitHub Pages**.
   - Sube los archivos a la rama principal (`main` o `master`) de tu repositorio de GitHub, entra a `Settings -> Pages`, selecciona la rama raíz y presiona **Save**. ¡Tu presentación estará disponible públicamente en segundos con HTTPS!
