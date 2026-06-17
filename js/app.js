/**
 * Lógica de interacción principal y flujos de usuario (SPA)
 * para la presentación de químicos de Guadalajara Country Club.
 */

// Estado global de la aplicación
const AppState = {
  activeArea: null,
  quoteCart: [], // Array de objetos { id, name, area, qty }
  isClickLocked: false, // Bloqueo permanente al hacer clic para evitar pérdidas por mouseleave accidental
};

// Variable para controlar el retraso (debounce) en las transiciones de hover y evitar el "hover storm"
let hoverTimeout = null;

document.addEventListener("DOMContentLoaded", () => {
  initColumnTransitions();
  initProductDrawer();
  initQuoteSystem();
  renderCatalogProducts();
  initSpaProductSwitcher();
  initGymProductSwitcher();
  initGastronomiaProductSwitcher();
  initMantenimientoProductSwitcher();
});

/**
 * 1. TRANSICIONES DE COLUMNAS (SPA)
 */
function initColumnTransitions() {
  const columns = document.querySelectorAll(".area-column");
  const container = document.querySelector(".columns-container");

  columns.forEach((column) => {
    // Evento de hover para computadoras (menú de inicio vertical)
    column.addEventListener("mouseenter", function () {
      // CRÍTICO: Si ya estamos en vista expandida o de pestañas superiores, ignorar por completo
      // el mouseenter directo en el cuerpo de las columnas. Las transiciones en modo horizontal
      // solo deben ser provocadas por los triggers estáticos (.tab-trigger) a z-index 150.
      if (container.classList.contains("has-hover-active") || container.classList.contains("has-active-column")) {
        return;
      }

      const areaId = this.getAttribute("data-area");
      
      // Limpiar cualquier transición pendiente anterior
      if (hoverTimeout) clearTimeout(hoverTimeout);

      // Debounce de 50ms en la primera apertura vertical para asegurar estabilidad
      hoverTimeout = setTimeout(() => {
        activateColumnHover(this, areaId, container);
      }, 50);
    });

    // Evento de click para bloquear vista y soporte táctil
    column.addEventListener("click", function (e) {
      if (e.target.closest("button") || e.target.closest(".close-section-btn") || e.target.closest(".product-actions")) return;

      // Limpiar cualquier transición por hover pendiente al hacer clic
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }

      const areaId = this.getAttribute("data-area");
      activateColumnClick(this, areaId, container);
    });
  });

  // Triggers estáticos para las pestañas superiores (evita el "hover storm" o "flickering" al deslizar por el menú horizontal)
  const tabTriggers = document.querySelectorAll(".tab-trigger");
  tabTriggers.forEach((trigger) => {
    const areaId = trigger.getAttribute("data-area");
    const targetCol = document.getElementById(`col-${areaId}`);

    trigger.addEventListener("mouseenter", function () {
      if (targetCol) {
        targetCol.classList.add("tab-hovered");
        
        // Limpiar cualquier transición por hover pendiente
        if (hoverTimeout) clearTimeout(hoverTimeout);

        // Debounce estratégico de 80ms para evitar parpadeos y cambios rápidos accidentales al deslizar el cursor a través de las pestañas
        hoverTimeout = setTimeout(() => {
          activateColumnHover(targetCol, areaId, container);
        }, 80);
      }
    });

    trigger.addEventListener("mouseleave", function () {
      if (targetCol) {
        targetCol.classList.remove("tab-hovered");
      }
      
      // Limpiar timeout si el cursor sale de la pestaña antes de cumplirse el debounce
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
    });

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      
      // Limpiar cualquier transición por hover pendiente al hacer clic
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }

      if (targetCol) {
        activateColumnClick(targetCol, areaId, container);
      }
    });
  });

  // Evento de salida del contenedor general (restablece al menú si no está bloqueado por clic)
  container.addEventListener("mouseleave", function () {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    if (!AppState.isClickLocked) {
      deactivateHoverTransitions(container);
    }
  });

  // Botones de cierre de sección
  const closeBtns = document.querySelectorAll(".close-section-btn");
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation(); // Detener propagación
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      deactivateAllColumns(container);
    });
  });
}

function activateColumnHover(columnElem, areaId, containerElem) {
  // Si ya es la columna hover-active actual, no hacer nada
  if (columnElem.classList.contains("hover-active")) return;

  AppState.activeArea = areaId;
  
  // Agregar clases para activar layouts y ocultar encabezado general
  document.body.classList.add("section-active");
  containerElem.classList.add("has-hover-active");
  
  // Limpiar hover activo y clase active de las demás para evitar superposiciones
  const allCols = containerElem.querySelectorAll(".area-column");
  allCols.forEach(c => {
    c.classList.remove("hover-active");
    if (c !== columnElem) {
      c.classList.remove("active");
    }
  });
  
  columnElem.classList.add("hover-active");
  
  // Si está bloqueado por clic, transferir la clase active a la columna actual
  if (AppState.isClickLocked) {
    columnElem.classList.add("active");
    containerElem.classList.add("has-active-column");
  }

  // Renderizar la calculadora correspondiente
  if (CALCULATORS[areaId]) {
    CALCULATORS[areaId].render(`calc-container-${areaId}`);
  }
}

function activateColumnClick(columnElem, areaId, containerElem) {
  AppState.isClickLocked = true;
  
  // Sincronizar el estado active con el estado hover para compatibilidad en estilos y touch
  containerElem.classList.add("has-active-column");
  
  const allCols = containerElem.querySelectorAll(".area-column");
  allCols.forEach(c => c.classList.remove("active"));
  columnElem.classList.add("active");
  
  activateColumnHover(columnElem, areaId, containerElem);
}

function deactivateHoverTransitions(containerElem) {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }

  containerElem.classList.remove("has-hover-active");
  const allCols = containerElem.querySelectorAll(".area-column");
  allCols.forEach(c => {
    c.classList.remove("hover-active");
    c.classList.remove("tab-hovered");
  });

  if (!AppState.isClickLocked) {
    document.body.classList.remove("section-active");
    AppState.activeArea = null;
  }
}

function deactivateAllColumns(containerElem) {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }

  AppState.isClickLocked = false;
  AppState.activeArea = null;
  
  containerElem.classList.remove("has-hover-active");
  containerElem.classList.remove("has-active-column");
  
  const allCols = containerElem.querySelectorAll(".area-column");
  allCols.forEach(c => {
    c.classList.remove("hover-active");
    c.classList.remove("active");
    c.classList.remove("tab-hovered");
  });
  
  document.body.classList.remove("section-active");
}

/**
 * 2. RENDERIZADO DEL CATÁLOGO DE PRODUCTOS
 */
function renderCatalogProducts() {
  // Recorrer cada área en la base de datos
  Object.keys(PRODUCTS_DATA).forEach((areaId) => {
    const areaData = PRODUCTS_DATA[areaId];
    const catalogGrid = document.getElementById(`catalog-grid-${areaId}`);
    if (!catalogGrid) return;

    let cardsHtml = "";
    areaData.products.forEach((product) => {
      // Determinar icono SVG adecuado
      let iconSvg = getProductIconSvg(product.id);

      cardsHtml += `
        <div class="product-card" style="color: ${areaData.accentColor}" data-product-id="${product.id}">
          <div class="product-icon-container">
            ${iconSvg}
          </div>
          <div class="product-details">
            <span class="product-badge">${product.badge}</span>
            <h4 class="product-name">${product.name}</h4>
            <span class="product-tagline">${product.tagline}</span>
            <p class="product-description">${product.description.substring(0, 120)}...</p>
            <div class="product-actions">
              <button class="btn-details" onclick="showProductDetails('${product.id}', '${areaId}')">
                <svg style="width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
                Ficha Técnica
              </button>
            </div>
          </div>
        </div>
      `;
    });

    catalogGrid.innerHTML = cardsHtml;
  });
}

function getProductIconSvg(productId) {
  // Iconos SVG personalizados según el producto
  const icons = {
    shock_cloro: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    alguicida_max: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke-linecap="round"/><path d="M12 6c-2.5 0-4 1.5-4 4 0 4 3 5 3 7.5S9.5 20 7 20" stroke-linecap="round"/></svg>`,
    clarificador_gold: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    ph_balance: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76zM16 8l3 3M9.5 14.5l-1.5 1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    eucalyptus_vapor: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" stroke-linecap="round"/></svg>`,
    organic_sanitizer: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    linen_relax: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    jacuzzi_clear: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke-linecap="round"/><path d="M8 12h8" stroke-linecap="round"/></svg>`,
    gym_spray: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.5-2.5 3.5-2.5 5.5h20c0-2-1-4-2.5-5.5" stroke-linecap="round"/><path d="M12 2v14M8 5l4-3 4 3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    odor_kill: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke-linecap="round"/><path d="M12 8v4l3 3" stroke-linecap="round"/></svg>`,
    floor_active: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zM9 9h6v6H9V9z" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    dermo_wash: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    grease_remover: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1.5-3-1 1-1.5 1.62-1.5 3a2.5 2.5 0 0 0 .5 2.5zM12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    dish_auto: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    fruit_wash: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" stroke-linecap="round"/><path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    surface_food: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    swipe_concentrate: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    eco_doser: `<svg class="product-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M12 8v8M8 12h8"/></svg>`,
    audit_service: `<svg class="product-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20V10M18 20V4M6 20v-4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    demo_alberca: `<svg class="product-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" stroke-linecap="round"/></svg>`,
    demo_cocina: `<svg class="product-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1.5-3-1 1-1.5 1.62-1.5 3a2.5 2.5 0 0 0 .5 2.5zM12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    swipol_mantenimiento: `<svg class="product-icon-svg" viewBox="0 0 24 24"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke-linecap="round"/><path d="M12 6c-2.5 0-4 1.5-4 4 0 4 3 5 3 7.5S9.5 20 7 20" stroke-linecap="round"/></svg>`
  };
  
  return icons[productId] || icons.swipe_concentrate;
}

/**
 * 3. CAJÓN DE DETALLES (DRAWER DE PRODUCTO)
 */
function initProductDrawer() {
  const overlay = document.getElementById("drawer-overlay");
  const closeBtn = document.getElementById("drawer-close");

  const closeDrawer = () => {
    overlay.classList.remove("open");
  };

  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeDrawer();
  });
}

window.showProductDetails = function (productId, areaId) {
  AppState.isClickLocked = true; // Bloquear colapso durante visualización de ficha técnica
  const product = PRODUCTS_DATA[areaId].products.find((p) => p.id === productId);
  if (!product) return;

  const overlay = document.getElementById("drawer-overlay");
  const content = document.getElementById("drawer-content-body");

  // Inyectar el color de acento de la sección al drawer
  const accentColor = PRODUCTS_DATA[areaId].accentColor;
  const drawerEl = document.querySelector(".product-drawer");
  drawerEl.style.borderColor = accentColor;
  drawerEl.style.color = accentColor;

  // Construir HTML del cajón
  let benefitsHtml = product.benefits.map((b) => `<li class="drawer-list-item">${b}</li>`).join("");

  content.innerHTML = `
    <div class="drawer-header-info">
      <span class="product-badge" style="color: ${accentColor}; border-color: ${accentColor}">${product.badge}</span>
      <h2 class="product-name" style="font-size: 2.2rem; color: #fff; margin-top:0.5rem; font-family: var(--font-title); font-weight:800;">${product.name}</h2>
      <p class="product-tagline" style="color: ${accentColor}; font-weight:600; font-size:1rem; margin-top:0.2rem;">${product.tagline}</p>
    </div>
    
    <div class="drawer-content">
      <div class="drawer-section">
        <h4 class="drawer-sec-title" style="color: ${accentColor}">Descripción</h4>
        <p class="drawer-sec-content">${product.description}</p>
      </div>

      <div class="drawer-section">
        <h4 class="drawer-sec-title" style="color: ${accentColor}">Beneficios Clave</h4>
        <ul class="drawer-list" style="color: var(--color-glass-text)">
          ${benefitsHtml}
        </ul>
      </div>

      <div class="drawer-section" style="background: rgba(255,255,255,0.02); padding: 1.2rem; border-radius:12px; border: 1px solid rgba(255,255,255,0.04)">
        <h4 class="drawer-sec-title" style="color: ${accentColor}; margin-bottom: 0.5rem">Guía de Dosificación</h4>
        <div style="font-size: 0.85rem; line-height:1.5;">
          <p style="margin-bottom:0.4rem;"><strong>Aplicación:</strong> ${product.usage}</p>
          <p style="margin-bottom:0.4rem;"><strong>Dosificación:</strong> ${product.dosage}</p>
          <p><strong>Dilución / Método:</strong> ${product.dilution}</p>
        </div>
      </div>

      <div class="safety-alert-box">
        <span class="safety-icon">⚠️</span>
        <div class="safety-text">
          <strong>Seguridad y Manejo:</strong> ${product.safety}
        </div>
      </div>
    </div>
  `;

  // Abrir Drawer
  overlay.classList.add("open");
};

/**
 * 4. SISTEMA DE COTIZACIÓN (CARRITO Y FORMULARIO)
 */
function initQuoteSystem() {
  const floatingBar = document.getElementById("quotes-floating-bar-container");
  const openModalBtn = document.getElementById("btn-open-quotes");
  const modalOverlay = document.getElementById("quotes-modal-overlay");
  const closeModalBtn = document.getElementById("quotes-close-modal");
  const quoteForm = document.getElementById("quotes-form-submit");

  if (!floatingBar || !modalOverlay || !closeModalBtn || !quoteForm) return;

  // Abrir Modal
  floatingBar.addEventListener("click", (e) => {
    // Si se hace click en el botón o en la barra en general
    openQuotesModal();
  });

  // Cerrar Modal
  const closeQuotesModal = () => {
    modalOverlay.classList.remove("open");
  };

  closeModalBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeQuotesModal();
  });
  
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeQuotesModal();
  });

  // Envío de Formulario
  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitQuoteRequest();
  });
}

window.addToQuoteCart = function (productId, areaId) {
  AppState.isClickLocked = true; // Bloquear colapso al añadir productos
  const product = PRODUCTS_DATA[areaId].products.find((p) => p.id === productId);
  if (!product) return;

  // Buscar si ya existe en el carrito
  const existingItem = AppState.quoteCart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    AppState.quoteCart.push({
      id: productId,
      name: product.name,
      area: areaId,
      areaTitle: PRODUCTS_DATA[areaId].title,
      qty: 1,
    });
  }

  updateQuoteUI();
  
  // Pequeño efecto visual en la tarjeta
  const card = document.querySelector(`.product-card[data-product-id="${productId}"]`);
  if (card) {
    card.style.transform = "scale(0.98)";
    setTimeout(() => {
      card.style.transform = "";
    }, 150);
  }
};

function updateQuoteUI() {
  const floatingBar = document.getElementById("quotes-floating-bar-container");
  const badgeCount = document.getElementById("quotes-badge-count");
  if (!floatingBar || !badgeCount) return;
  
  const totalItems = AppState.quoteCart.reduce((sum, item) => sum + item.qty, 0);

  if (totalItems > 0) {
    badgeCount.innerText = totalItems;
    floatingBar.classList.add("visible");
  } else {
    floatingBar.classList.remove("visible");
    const modalOverlay = document.getElementById("quotes-modal-overlay");
    if (modalOverlay) modalOverlay.classList.remove("open");
  }
}

function openQuotesModal() {
  AppState.isClickLocked = true; // Bloquear colapso al abrir el cotizador principal
  const modalOverlay = document.getElementById("quotes-modal-overlay");
  const itemsContainer = document.getElementById("quotes-items-container");
  if (!modalOverlay || !itemsContainer) return;
  
  // Limpiar vista de éxito previo si lo hubiera y restaurar formulario
  const formPanel = document.querySelector(".quotes-form-panel");
  const successPanel = document.getElementById("quotes-success-panel");
  if (formPanel) formPanel.style.display = "flex";
  if (successPanel) successPanel.style.display = "none";
  
  renderQuoteItems();
  modalOverlay.classList.add("open");
}

function renderQuoteItems() {
  const itemsContainer = document.getElementById("quotes-items-container");
  if (!itemsContainer) return;
  
  if (AppState.quoteCart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="empty-quote-msg">
        <svg style="width: 48px; height: 48px; stroke: var(--color-text-muted); stroke-width: 1.5; fill:none;" viewBox="0 0 24 24">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>No has seleccionado ningún producto aún.</span>
      </div>
    `;
    return;
  }

  let html = "";
  AppState.quoteCart.forEach((item) => {
    const areaColor = PRODUCTS_DATA[item.area].accentColor;
    html += `
      <div class="quote-item-row" style="border-left: 3px solid ${areaColor}">
        <div class="quote-item-info">
          <span class="quote-item-name">${item.name}</span>
          <span class="quote-item-area" style="color: ${areaColor}">${item.areaTitle}</span>
        </div>
        <div class="quote-item-controls">
          <button class="quote-qty-btn" onclick="adjustQuoteQty('${item.id}', -1)">-</button>
          <span class="quote-qty-val">${item.qty}</span>
          <button class="quote-qty-btn" onclick="adjustQuoteQty('${item.id}', 1)">+</button>
          <button class="quote-remove-btn" onclick="removeQuoteItem('${item.id}')">
            <svg style="width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width:2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  });

  itemsContainer.innerHTML = html;
}

window.adjustQuoteQty = function (productId, delta) {
  const item = AppState.quoteCart.find((i) => i.id === productId);
  if (!item) return;

  item.qty += delta;
  
  if (item.qty <= 0) {
    removeQuoteItem(productId);
  } else {
    updateQuoteUI();
    renderQuoteItems();
  }
};

window.removeQuoteItem = function (productId) {
  AppState.quoteCart = AppState.quoteCart.filter((item) => item.id !== productId);
  updateQuoteUI();
  renderQuoteItems();
};

function submitQuoteRequest() {
  const formPanel = document.querySelector(".quotes-form-panel");
  const successPanel = document.getElementById("quotes-success-panel");
  if (!formPanel || !successPanel) return;
  
  // Obtener valores de campos
  const name = document.getElementById("client-name") ? document.getElementById("client-name").value : "";
  const dept = document.getElementById("client-dept") ? document.getElementById("client-dept").value : "";
  const email = document.getElementById("client-email") ? document.getElementById("client-email").value : "";
  
  // Simulador de envío premium de cotización
  formPanel.style.display = "none";
  successPanel.style.display = "flex";
  
  // Vaciar carrito
  AppState.quoteCart = [];
  setTimeout(() => {
    updateQuoteUI();
  }, 3000);
}

/**
 * 5. CONTROLADOR INTERACTIVO DE SPA & WELLNESS
 */
function initSpaProductSwitcher() {
  const tabs = document.querySelectorAll(".spa-product-tab");
  const selector = document.getElementById("spa-products-selector");
  if (!tabs.length || !selector) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.stopPropagation(); // Evitar cerrar o activar columnas del acordeón
      
      const productId = this.getAttribute("data-product-id");
      if (!productId) return;

      // Cambiar clase active en las pestañas
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Buscar el producto en PRODUCTS_DATA
      const product = PRODUCTS_DATA.spa.products.find((p) => p.id === productId);
      if (!product) return;

      // Actualizar el panel derecho
      updateSpaDisplay(product);
    });
  });

  // Inicializar dinámicamente con el primer producto activo
  const activeTab = selector.querySelector(".spa-product-tab.active");
  if (activeTab) {
    const initialId = activeTab.getAttribute("data-product-id");
    const initialProduct = PRODUCTS_DATA.spa.products.find((p) => p.id === initialId);
    if (initialProduct) updateSpaDisplay(initialProduct);
  }
}

function updateSpaDisplay(product) {
  const spotlightCard = document.getElementById("spa-spotlight-card");
  const imgEl = document.getElementById("spa-spotlight-img");
  const svgContainer = document.getElementById("spa-spotlight-svg-container");
  const quoteBtn = document.getElementById("spa-add-to-quote-btn");
  const featuresColumn = document.getElementById("spa-features-column");

  if (!spotlightCard || !featuresColumn) return;

  // Añadir un pequeño efecto de fade-out temporal para la transición
  featuresColumn.style.opacity = "0";
  featuresColumn.style.transform = "translateY(10px)";
  featuresColumn.style.transition = "all 0.3s ease";
  
  spotlightCard.style.opacity = "0.5";
  spotlightCard.style.transform = "scale(0.98)";

  setTimeout(() => {
    // 1. Actualizar imagen o SVG en el spotlight
    if (product.image) {
      imgEl.src = product.image;
      imgEl.style.display = "block";
      svgContainer.style.display = "none";
    } else {
      imgEl.style.display = "none";
      // Obtener el SVG correspondiente de getProductIconSvg
      const iconSvg = getProductIconSvg(product.id);
      svgContainer.innerHTML = iconSvg;
      // Hacer que el SVG sea grande y estilizado en el spotlight
      const svgInner = svgContainer.querySelector("svg");
      if (svgInner) {
        svgInner.style.width = "120px";
        svgInner.style.height = "120px";
        svgInner.style.strokeWidth = "1.2";
      }
      svgContainer.style.display = "block";
    }

    // 2. Actualizar botón de cotización
    if (quoteBtn) {
      quoteBtn.setAttribute("onclick", `addToQuoteCart('${product.id}', 'spa')`);
    }

    // 3. Generar las características técnicas dinámicas
    let featuresHtml = "";
    
    // Mapeo inteligente de características según el producto
    if (product.id === "sure_thing_spa") {
      featuresHtml = `
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Rendimiento y Dosificación en el Spa</h4>
            <p><strong>Fórmula Ultra Concentrada:</strong> Unas pocas gotas puras aplicadas directamente bastan para desodorizar espacios pequeños. Para atomización ambiental en cabinas o salas de masaje, diluir de 30 a 60 gotas en medio litro de agua en atomizador.</p>
          </div>
        </div>
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Atmósfera Sensorial de Lujo</h4>
            <p><strong>Aromaterapia Premium:</strong> Disponible en aromas exclusivos (menta, floral, vainilla y canela), ideal para diseñar la firma aromática distintiva del Spa en cabinas, saunas, vestidores y áreas de recepción.</p>
          </div>
        </div>
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Neutralización Real de Olores</h4>
            <p><strong>Destrucción de Olores de Raíz:</strong> No disfraza el mal olor con perfumes fuertes. Su fórmula biodegradable descompone activamente las moléculas orgánicas causantes de la humedad, sudor o encierro, asegurando una pureza ambiental real.</p>
          </div>
        </div>
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Sinergia con Swipol y Seguridad</h4>
            <p><strong>Aromatización y Desinfección en 1 Paso:</strong> Es el único aromatizante químicamente compatible con el desinfectante quirúrgico **Swipol**, permitiendo preparar cabinas desinfectadas y deliciosamente ambientadas de forma simultánea. Mantener alejado de fuentes de calor directo.</p>
          </div>
        </div>
      `;
    } else if (product.id === "swipe_concentrado_spa") {
      featuresHtml = `
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8a9 9 0 0 1-9 10z"/><path d="M9 22v-6"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Biodegradabilidad >99% y Respeto Ecológico</h4>
            <p>Fórmula ultra concentrada con biodegradabilidad superior al 99%, libre de fosfatos. Completamente segura para los sistemas de drenaje y plantas tratadoras del Spa, garantizando el máximo cuidado ambiental en cada limpieza.</p>
          </div>
        </div>
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 11l2 2 4-4"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>pH Neutro: Seguro en Maderas, Mármol y Camillas</h4>
            <p>Su versión de pH Neutro (pH 7) es ideal para limpiar sin dañar las maderas finas de saunas, recubrimientos de mármol, camillas de masaje, tapizados de vinilo y acabados premium del Spa, preservando su apariencia e integridad.</p>
          </div>
        </div>
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Diluciones Adaptadas al Spa</h4>
            <p>Estética diaria (1:100) para espejos, cromos y superficies brillantes de la recepción del Spa. Lavado de pisos y vestidores (1:12) para higiene profunda sin dejar residuos que alteren los aromas de la aromaterapia.</p>
          </div>
        </div>
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Sin Cáusticos: Seguro para Socios y Personal</h4>
            <p>Fórmula sin cáusticos libres que no reseca ni irrita las manos del personal de limpieza, no es inflamable y no corroe metales ni superficies delicadas. Cero incompatibilidades con la atmósfera sensorial del Spa.</p>
          </div>
        </div>
      `;
    } else if (product.id === "swipe_brite_spa") {
      featuresHtml = `
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Uso en el Club (Sanitarios y Vestidores)</h4>
            <p>Limpiador líquido de tipo ácido y biodegradable, diseñado específicamente para desincrustar, desinfectar y desodorizar los inodoros. Elimina eficazmente las manchas y el sarro formados por los residuos calcáreos del agua depositados en la porcelana.</p>
          </div>
        </div>
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Rendimiento y Dosificación</h4>
            <p><strong>Uso Concentrado (Restauración Profunda):</strong> Se aplica de forma directa, sin diluir, cuando existe un problema serio de sarro incrustado en los inodoros.</p>
          </div>
        </div>
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Ventaja Operativa (Eliminación de Olores)</h4>
            <p>Inhibe el desarrollo de bacterias provenientes del agua y las materias fecales, impidiendo la formación de los olores desagradables generados por estos microorganismos. Es seguro para cualquier color de porcelana y totalmente inofensivo para las tuberías y fosas sépticas.</p>
          </div>
        </div>
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Precauciones Críticas</h4>
            <p style="color: #ff5a5a; font-weight: 600;">Debido a su naturaleza ácida y nivel de corrosividad, NUNCA debe mezclarse con cloro o cualquier otro producto. Si su uso es continuo por parte del personal de limpieza, se recomienda estrictamente el uso de guantes.</p>
          </div>
        </div>
      `;
    } else if (product.id === "blue_genie_spa") {
      featuresHtml = `
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Uso en el Club (Mantenimiento Automático)</h4>
            <p>Es un limpiador enzimático y biodegradable perfecto para los inodoros de la Casa Club y áreas de vestidores. Actúa de forma continua tanto en el tanque como en la taza, inhibiendo eficazmente el crecimiento bacteriano, desinfectando y desodorizando el sanitario, al tiempo que evita depósitos de sarro.</p>
          </div>
        </div>
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Rendimiento Prolongado (Descargas)</h4>
            <p>Su envase inteligente dosifica automáticamente la cantidad exacta necesaria de producto en cada descarga. Una sola unidad concentrada de 250 gramos mantiene el inodoro en óptimas condiciones por un periodo de <strong>2 a 3 meses</strong>, rindiendo aproximadamente **900 descargas**.</p>
          </div>
        </div>
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Ventaja Operativa Visual</h4>
            <p>Facilita drásticamente la labor del personal de limpieza mediante su indicador visual activo, que tiñe el agua de un color azul claro. El producto solo requiere reemplazo cuando el agua de la descarga vuelve a ser transparente, garantizando no manchar la porcelana.</p>
          </div>
        </div>
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8a9 9 0 0 1-9 10z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 22v-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Fórmula Biodegradable y Ecología</h4>
            <p>Compuesto enzimático 100% biodegradable de liberación controlada. Es completamente inocuo para tuberías de drenaje, cañerías y sistemas de fosas sépticas, protegiendo las plantas tratadoras del club.</p>
          </div>
        </div>
      `;
    } else {
      featuresHtml = `
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" stroke-linecap="round"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Descripción del Producto</h4>
            <p>${product.description}</p>
          </div>
        </div>
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Beneficios Clave</h4>
            <ul style="font-size: 0.85rem; line-height: 1.5; color: var(--color-glass-text); padding-left: 1.2rem; margin: 0.3rem 0 0 0;">
              ${product.benefits.map(b => `<li style="margin-bottom: 0.3rem;">${b}</li>`).join("")}
            </ul>
          </div>
        </div>
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Rendimiento y Dosificación</h4>
            <p><strong>Dosificación:</strong> ${product.dosage}<br><strong>Dilución / Método:</strong> ${product.dilution}</p>
          </div>
        </div>
        <div class="spa-feature-card">
          <div class="spa-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="spa-feature-text">
            <h4>Seguridad e Impacto Ambiental</h4>
            <p><strong>Manejo Seguro:</strong> ${product.safety}<br><strong>Impacto en pH:</strong> ${product.phImpact || 'Neutro.'}</p>
          </div>
        </div>
      `;
    }

    featuresColumn.innerHTML = featuresHtml;

    // Restaurar opacidades con animaciones suaves
    featuresColumn.style.opacity = "1";
    featuresColumn.style.transform = "translateY(0)";
    
    spotlightCard.style.opacity = "1";
    spotlightCard.style.transform = "scale(1)";
  }, 150);
}

/**
 * 6. CONTROLADOR INTERACTIVO DE GIMNASIO & FITNESS
 */
function initGymProductSwitcher() {
  const tabs = document.querySelectorAll(".gym-product-tab");
  const selector = document.getElementById("gym-products-selector");
  if (!tabs.length || !selector) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.stopPropagation(); // Evitar cerrar o activar columnas del acordeón
      
      const productId = this.getAttribute("data-product-id");
      if (!productId) return;

      // Cambiar clase active en las pestañas
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Buscar el producto en PRODUCTS_DATA
      const product = PRODUCTS_DATA.gimnasio.products.find((p) => p.id === productId);
      if (!product) return;

      // Actualizar el panel derecho
      updateGymDisplay(product);
    });
  });

  // Inicializar dinámicamente con el primer producto activo
  const activeTab = selector.querySelector(".gym-product-tab.active");
  if (activeTab) {
    const initialId = activeTab.getAttribute("data-product-id");
    const initialProduct = PRODUCTS_DATA.gimnasio.products.find((p) => p.id === initialId);
    if (initialProduct) updateGymDisplay(initialProduct);
  }
}

function updateGymDisplay(product) {
  const spotlightCard = document.getElementById("gym-spotlight-card");
  const imgEl = document.getElementById("gym-spotlight-img");
  const svgContainer = document.getElementById("gym-spotlight-svg-container");
  const featuresColumn = document.getElementById("gym-features-column");

  if (!spotlightCard || !featuresColumn) return;

  // Añadir un pequeño efecto de fade-out temporal para la transición
  featuresColumn.style.opacity = "0";
  featuresColumn.style.transform = "translateY(10px)";
  featuresColumn.style.transition = "all 0.3s ease";
  
  spotlightCard.style.opacity = "0.5";
  spotlightCard.style.transform = "scale(0.98)";

  setTimeout(() => {
    // 1. Actualizar imagen o SVG en el spotlight
    if (product.image) {
      imgEl.src = product.image;
      imgEl.style.display = "block";
      svgContainer.style.display = "none";
    } else {
      imgEl.style.display = "none";
      // Obtener el SVG correspondiente de getProductIconSvg
      const iconSvg = getProductIconSvg(product.id);
      svgContainer.innerHTML = iconSvg;
      // Hacer que el SVG sea grande y estilizado en el spotlight
      const svgInner = svgContainer.querySelector("svg");
      if (svgInner) {
        svgInner.style.width = "120px";
        svgInner.style.height = "120px";
        svgInner.style.strokeWidth = "1.2";
      }
      svgContainer.style.display = "block";
    }

    // 2. Generar las características técnicas dinámicas
    let featuresHtml = "";
    
    // Mapeo de características según el producto de Gimnasio
    if (product.id === "swipe_concentrado_gym") {
      featuresHtml = `
        <div class="gym-feature-card">
          <div class="gym-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v3M10 9V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v7"/><path d="M4 15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3z"/></svg>
          </div>
          <div class="gym-feature-text">
            <h4>Eliminación de Sudor y Grasa Corporal</h4>
            <p>Formulado con tensoactivos de alta potencia, remueve con rapidez el sudor, aceites bronceadores y grasas corporales acumuladas en empuñaduras, asientos, mancuernas y caminadoras, dejando los equipos en condiciones sanitarias impecables.</p>
          </div>
        </div>
        <div class="gym-feature-card">
          <div class="gym-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 11l2 2 4-4"/></svg>
          </div>
          <div class="gym-feature-text">
            <h4>Protección de Tapizados y Equipos Premium</h4>
            <p>Cero cáusticos libres: no reseca, no cuartea ni daña el vinilo de asientos, el cuero sintético de equipos ni los plásticos de caminadoras y elípticas. Preserva el aspecto premium del equipamiento de fitness del club.</p>
          </div>
        </div>
        <div class="gym-feature-card">
          <div class="gym-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="gym-feature-text">
            <h4>Diluciones para el Gimnasio</h4>
            <p>Estética diaria (1:100) para limpieza rápida de equipos entre usuarios. Lavado normal (1:12) para desengrase periódico de estructuras metálicas, pisos deportivos y mats de ejercicio. Rinde hasta 100 litros de solución útil.</p>
          </div>
        </div>
        <div class="gym-feature-card">
          <div class="gym-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8a9 9 0 0 1-9 10z"/><path d="M9 22v-6"/></svg>
          </div>
          <div class="gym-feature-text">
            <h4>Biodegradable >99% y Seguro para Drenajes</h4>
            <p>Fórmula ecológica libre de fosfatos, biodegradable en más del 99%. No es tóxico, no es inflamable y no corroe metales. Completamente seguro para el personal de limpieza, socios que entrenan y el medio ambiente.</p>
          </div>
        </div>
      `;
    } else if (product.id === "swipol_gym") {
      featuresHtml = `
        <div class="gym-feature-card">
          <div class="gym-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gym-feature-text">
            <h4>Seguridad e Inocuidad (Cero Irritación)</h4>
            <p>Seguridad absoluta para los socios del club: formulado con cuaternarios de amonio de quinta generación que garantizan cero irritación cutánea. Al ser completamente incoloro e inoloro, mantiene intacta la pureza visual y sensorial del área.</p>
          </div>
        </div>
        <div class="gym-feature-card">
          <div class="gym-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22 4 12 14.01 9 11.01" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gym-feature-text">
            <h4>Desinfección de Grado Quirúrgico</h4>
            <p>Alguicida, fungicida y viricida de amplio espectro, ideal para la desinfección perimetral total. Previene e inhibe eficazmente el crecimiento de hongos y bacterias en vestidores, baños de vapor, regaderas, tapizados de equipos y tapetes sanitarios.</p>
          </div>
        </div>
        <div class="gym-feature-card">
          <div class="gym-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gym-feature-text">
            <h4>Rendimiento Estabilizado</h4>
            <p>Máxima estabilidad química y tolerancia total frente a aguas duras. Mantiene su eficiencia desinfectante en una amplia gama de temperaturas, lo que lo hace idóneo para áreas húmedas de alta exigencia operacional.</p>
          </div>
        </div>
        <div class="gym-feature-card">
          <div class="gym-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gym-feature-text">
            <h4>Manejo Seguro y pH Neutro</h4>
            <p>Es seguro al tacto y no corrosivo para el equipamiento premium de ejercicio (estructuras de metal, tapizados, pantallas de caminadoras). Fórmula de pH neutro, estable y amigable con el personal de limpieza y el entorno.</p>
          </div>
        </div>
      `;
    }

    featuresColumn.innerHTML = featuresHtml;

    // Restaurar opacidades con animaciones suaves
    featuresColumn.style.opacity = "1";
    featuresColumn.style.transform = "translateY(0)";
    
    spotlightCard.style.opacity = "1";
    spotlightCard.style.transform = "scale(1)";
  }, 150);
}

/**
 * 7. CONTROLADOR INTERACTIVO DE GASTRONOMÍA & COCINAS
 */
function initGastronomiaProductSwitcher() {
  const tabs = document.querySelectorAll(".gastronomia-product-tab");
  const selector = document.getElementById("gastronomia-products-selector");
  if (!tabs.length || !selector) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.stopPropagation(); // Evitar cerrar o activar columnas del acordeón
      
      const productId = this.getAttribute("data-product-id");
      if (!productId) return;

      // Cambiar clase active en las pestañas
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Buscar el producto en PRODUCTS_DATA
      const product = PRODUCTS_DATA.gastronomia.products.find((p) => p.id === productId);
      if (!product) return;

      // Actualizar el panel derecho
      updateGastronomiaDisplay(product);
    });
  });

  // Inicializar dinámicamente con el primer producto activo
  const activeTab = selector.querySelector(".gastronomia-product-tab.active");
  if (activeTab) {
    const initialId = activeTab.getAttribute("data-product-id");
    const initialProduct = PRODUCTS_DATA.gastronomia.products.find((p) => p.id === initialId);
    if (initialProduct) updateGastronomiaDisplay(initialProduct);
  }
}

function updateGastronomiaDisplay(product) {
  const spotlightCard = document.getElementById("gastronomia-spotlight-card");
  const imgEl = document.getElementById("gastronomia-spotlight-img");
  const svgContainer = document.getElementById("gastronomia-spotlight-svg-container");
  const featuresColumn = document.getElementById("gastronomia-features-column");

  if (!spotlightCard || !featuresColumn) return;

  // Añadir un pequeño efecto de fade-out temporal para la transición
  featuresColumn.style.opacity = "0";
  featuresColumn.style.transform = "translateY(10px)";
  featuresColumn.style.transition = "all 0.3s ease";
  
  spotlightCard.style.opacity = "0.5";
  spotlightCard.style.transform = "scale(0.98)";

  setTimeout(() => {
    // 1. Actualizar imagen o SVG en el spotlight
    if (product.image) {
      imgEl.src = product.image;
      imgEl.style.display = "block";
      svgContainer.style.display = "none";
    } else {
      imgEl.style.display = "none";
      // Obtener el SVG correspondiente de getProductIconSvg
      const iconSvg = getProductIconSvg(product.id);
      svgContainer.innerHTML = iconSvg;
      // Hacer que el SVG sea grande y estilizado en el spotlight
      const svgInner = svgContainer.querySelector("svg");
      if (svgInner) {
        svgInner.style.width = "120px";
        svgInner.style.height = "120px";
        svgInner.style.strokeWidth = "1.2";
      }
      svgContainer.style.display = "block";
    }

    // 2. Generar las características técnicas dinámicas
    let featuresHtml = "";
    
    // Mapeo de características según el producto de Gastronomía
    if (product.id === "swipe_concentrado_gastronomia") {
      featuresHtml = `
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Certificación Grado Alimenticio NSF A1 y SAGARPA</h4>
            <p>Avalado oficialmente por el registro NSF (Categoría A1) y SAGARPA como desengrasante de grado alimenticio. Completamente seguro para usarse en áreas de preparación de alimentos, mesas de trabajo, superficies de contacto directo y comedores del club.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1.5-3-1 1-1.5 1.62-1.5 3a2.5 2.5 0 0 0 .5 2.5z" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke-linecap="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Desengrase de Campanas, Parrillas y Freidoras</h4>
            <p>Su dilución pesada (1:4) elimina de raíz las grasas pesadas y cochambre carbonizado acumulado en campanas extractoras, parrillas de hierro, freidoras y superficies de acero inoxidable de las cocinas industriales del club.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Diluciones para Cocinas y Comedores</h4>
            <p>Mantenimiento diario de comedores y mesas (1:100). Limpieza operativa de pisos de cocina y área de lavado (1:12). Desengrase profundo de campanas, salamandras y áreas de fritura (1:4). 1 litro rinde hasta 100 litros de solución útil.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Seguridad Total en Zonas de Alimentos</h4>
            <p>Sin cáusticos libres, no tóxico, no inflamable y no corrosivo. No daña ni despinta el acero inoxidable, granito ni equipos de cocina. Disponible en versión Low Foam para restregadoras automáticas de pisos en la cocina.</p>
          </div>
        </div>
      `;
    } else if (product.id === "swipol_gastronomia") {
      featuresHtml = `
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Seguridad e Inocuidad (Cero Irritación)</h4>
            <p>Seguridad absoluta para los socios del club: formulado con cuaternarios de amonio de quinta generación que garantizan cero irritación cutánea. Al ser completamente incoloro e inoloro, mantiene intacta la pureza visual y sensorial del área.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22 4 12 14.01 9 11.01" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Desinfección de Grado Quirúrgico</h4>
            <p>Alguicida, fungicida y viricida de amplio espectro, ideal para la desinfección perimetral total. Previene e inhibe eficazmente el crecimiento de hongos y bacterias en vestidores, baños de vapor, regaderas, tapizados de equipos y tapetes sanitarios.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Rendimiento Estabilizado</h4>
            <p>Máxima estabilidad química y tolerancia total frente a aguas duras. Mantiene su eficiencia desinfectante en una amplia gama de temperaturas, lo que lo hace idóneo para áreas húmedas de alta exigencia operacional.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Manejo Seguro y pH Neutro</h4>
            <p>Es seguro al tacto y no corrosivo para el equipamiento premium y superficies de acero inoxidable (estructuras de metal, cubiertas, campanas). Fórmula de pH neutro, estable y amigable con el personal de limpieza y el entorno.</p>
          </div>
        </div>
      `;
    } else if (product.id === "veggiefruit_wash") {
      featuresHtml = `
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Rendimiento y Dosificación (Dilución 1:100)</h4>
            <p>Es un producto altamente concentrado; se requiere mezclar únicamente 10 ml de concentrado por cada litro de agua. Gracias a esta formulación, 1 litro de producto rinde hasta 100 litros de solución limpiadora, brindando una economía sorprendente. Para lograr una desinfección efectiva, se recomienda un tiempo de contacto de 1 minuto.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Uso en el Club (Cocinas y Área de Alimentos)</h4>
            <p>Es un jabón líquido biodegradable y de grado alimenticio, diseñado específicamente para lavar y desinfectar todo tipo de frutas, verduras y hierbas (como cilantro, lechugas, jitomates, papas, etc.). Para procesar los alimentos, las hierbas pueden lavarse por inmersión agitándolas enérgicamente tras enjuagarles la tierra, mientras que las verduras de hoja grande se pueden tallar hoja por hoja con un cepillo de cerdas suaves.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22 4 12 14.01 9 11.01" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Ventaja Operativa (Cero Alteración y Cuidado del Personal)</h4>
            <p>A nivel culinario, una de sus mayores virtudes es que es completamente libre de aroma, por lo que no altera el sabor ni el olor natural de los ingredientes. A nivel operativo, su pH neutro (6 a 8) garantiza que no maltrata ni irrita las manos del personal en el uso diario, y tiene la gran ventaja de no dejar residuos acumulados en las tarjas de acero inoxidable.</p>
          </div>
        </div>
      `;
    } else if (product.id === "freezer_cleaner") {
      featuresHtml = `
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12h-4M4 12H8M12 4v4M12 20v-4M18.36 5.64l-2.82 2.83M8.46 15.54l-2.82 2.83M18.36 18.36l-2.82-2.82M8.46 8.46l-2.82-2.82" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Uso Concentrado (-55 °C)</h4>
            <p>Aplicación directa. En el Club: Limpieza profunda de cámaras de congelación extrema. Permite desengrasar sin apagar equipos, evitando romper la cadena de frío.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Solución 1:1 (-20 °C)</h4>
            <p>1 parte de producto por 1 de agua. En el Club: Ideal para el mantenimiento regular de cuartos fríos de almacenamiento general y bodegas de cárnicos.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8" stroke-linecap="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Solución 1:5 (-6 °C)</h4>
            <p>1 parte de producto por 5 de agua. En el Club: Higiene continua de refrigeradores comerciales y vitrinas en snack bars, garantizando limpieza sin interrumpir el servicio.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Ventaja Operativa e Inocuidad</h4>
            <p>Fórmula de evaporación controlada que evita la cristalización de la solución sobre evaporadores. Remueve grasas duras y suciedad sin dejar vapores tóxicos.</p>
          </div>
        </div>
      `;
    } else if (product.id === "crystal") {
      featuresHtml = `
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Crystal: Rendimiento y Diluciones</h4>
            <p>1 litro rinde hasta 100L. Normal: 10 ml/L para limpieza diaria. Grasa Pesada: 15 ml/L para sartenes y residuos difíciles.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Uso en el Club (Eventos y Cocinas)</h4>
            <p>Elimina el efecto de gota en cristalería y loza fina, asegurando un acabado impecable de alta transparencia en áreas de alta exigencia.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Seguridad y Grado Alimenticio</h4>
            <p>Su pH neutro y certificación garantizan la eliminación de bacterias y hongos sin maltratar ni resecar las manos del personal de limpieza.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Fórmula Biodegradable</h4>
            <p>Compuesto 100% biodegradable de enjuague rápido y escurrimiento acelerado que reduce las horas-hombre invertidas en el secado manual de la vajilla.</p>
          </div>
        </div>
      `;
    } else if (product.id === "grease") {
      featuresHtml = `
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v3M10 9V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Grease: Aplicación en Gel (Directo)</h4>
            <p>Se aplica directo con brocha. Su formato en gel garantiza adherencia máxima, prolongando el tiempo de acción sin escurrimientos ni desperdicio.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1.5-3-1 1-1.5 1.62-1.5 3a2.5 2.5 0 0 0 .5 2.5z" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Uso en Cocinas y Banquetes</h4>
            <p>Quitacochambre definitivo para hornos, planchas y parrillas de hierro/acero inoxidable. Remueve simultáneamente capas superiores y profundas de grasa carbonizada.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Protocolo y Seguridad</h4>
            <p style="color: #ff5a5a; font-weight: 600;">Actúa de 5 a 30 min. Nota de seguridad: Obligatorio el uso de guantes de hule. No aplicar sobre superficies calientes ni sobre aluminio.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Enjuague Sin Residuos</h4>
            <p>Su fórmula soluble en agua emulsiona el cochambre quemado de modo que se remueve con un simple trapo húmedo, sin dejar residuos alcalinos en los equipos de cocción.</p>
          </div>
        </div>
      `;
    } else if (product.id === "crystal_dwm") {
      featuresHtml = `
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Crystal DWM: Rendimiento y Dosificación</h4>
            <p>Altamente concentrado. Permite utilizar únicamente de 8 ml a 12 ml de producto por cada ciclo de lavado en equipos modernos de alta eficiencia.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="4" y1="10" x2="20" y2="10"/><circle cx="8" cy="7" r="1"/><circle cx="12" cy="7" r="1"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Uso en Lavado Automático</h4>
            <p>Detergente de espuma controlada diseñado para máquinas lavaloza. Garantiza limpieza impecable de cristalería, vajillas y cubiertos en banquetes y restaurantes.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Ventaja Operativa y Mantenimiento</h4>
            <p>Limpia la loza y desincrusta el interior de la máquina (elimina calcificaciones). Actúa perfectamente a &lt;50 °C, evitando el uso forzoso de calderas y reduciendo el consumo energético.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Protección Térmica y de Boquillas</h4>
            <p>Evita el taponamiento de las boquillas de aspersión al inhibir la precipitación de calcio en el agua dura de lavado, protegiendo las bombas recirculadoras.</p>
          </div>
        </div>
      `;
    } else if (product.id === "hand_soap_gastronomia") {
      featuresHtml = `
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Inocuidad Alimentaria Total</h4>
            <p>Fórmula 100% libre de fragancias y colorantes. Al ser incoloro e inoloro, garantiza cero riesgo de contaminación cruzada o transferencia de aromas a los alimentos preparados para los socios del club.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22 4 12 14.01 9 11.01" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Poderoso Efecto Germicida</h4>
            <p>Elimina al instante bacterias patógenas típicas en ambientes de alimentos como Salmonella, E. coli y S. aureus, asegurando el cumplimiento de los más altos estándares de bioseguridad en cocinas.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Protección e Hidratación de la Piel</h4>
            <p>Fórmula con pH balanceado (5.0 a 6.0) idóneo para la piel humana. Previene la resequedad, descamación e irritación de las manos del personal expuesto al lavado continuo en cocinas.</p>
          </div>
        </div>
        <div class="gastronomia-feature-card">
          <div class="gastronomia-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="gastronomia-feature-text">
            <h4>Higiene Rigurosa y Rendimiento</h4>
            <p>Listo para despachadores automáticos o de bomba. Requiere solo una dosis (1.5 ml) frotando firmemente palmas, dedos, uñas y antebrazos durante 40-60 segundos antes de enjuagar.</p>
          </div>
        </div>
      `;
    }

    featuresColumn.innerHTML = featuresHtml;

    // Restaurar opacidades con animaciones suaves
    featuresColumn.style.opacity = "1";
    featuresColumn.style.transform = "translateY(0)";
    
    spotlightCard.style.opacity = "1";
    spotlightCard.style.transform = "scale(1)";
  }, 150);
}

/**
 * 8. CONTROLADOR INTERACTIVO DE MANTENIMIENTO GENERAL
 */
function initMantenimientoProductSwitcher() {
  const tabs = document.querySelectorAll(".mantenimiento-product-tab");
  const selector = document.getElementById("mantenimiento-products-selector");
  if (!tabs.length || !selector) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.stopPropagation(); // Evitar cerrar o activar columnas del acordeón
      
      const productId = this.getAttribute("data-product-id");
      if (!productId) return;

      // Cambiar clase active en las pestañas
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Buscar el producto en PRODUCTS_DATA
      const product = PRODUCTS_DATA.mantenimiento.products.find((p) => p.id === productId);
      if (!product) return;

      // Actualizar el panel derecho
      updateMantenimientoDisplay(product);
    });
  });

  // Inicializar dinámicamente con el primer producto activo
  const activeTab = selector.querySelector(".mantenimiento-product-tab.active");
  if (activeTab) {
    const initialId = activeTab.getAttribute("data-product-id");
    const initialProduct = PRODUCTS_DATA.mantenimiento.products.find((p) => p.id === initialId);
    if (initialProduct) updateMantenimientoDisplay(initialProduct);
  }
}

function updateMantenimientoDisplay(product) {
  const spotlightCard = document.getElementById("mantenimiento-spotlight-card");
  const imgEl = document.getElementById("mantenimiento-spotlight-img");
  const svgContainer = document.getElementById("mantenimiento-spotlight-svg-container");
  const quoteBtn = document.getElementById("mantenimiento-add-to-quote-btn");
  const featuresColumn = document.getElementById("mantenimiento-features-column");

  if (!spotlightCard || !featuresColumn) return;

  // Añadir un pequeño efecto de fade-out temporal para la transición
  featuresColumn.style.opacity = "0";
  featuresColumn.style.transform = "translateY(10px)";
  featuresColumn.style.transition = "all 0.3s ease";
  
  spotlightCard.style.opacity = "0.5";
  spotlightCard.style.transform = "scale(0.98)";

  setTimeout(() => {
    // 1. Actualizar imagen o SVG en el spotlight
    if (product.image) {
      imgEl.src = product.image;
      imgEl.style.display = "block";
      svgContainer.style.display = "none";
    } else {
      imgEl.style.display = "none";
      // Obtener el SVG correspondiente de getProductIconSvg
      const iconSvg = getProductIconSvg(product.id);
      svgContainer.innerHTML = iconSvg;
      // Hacer que el SVG sea grande y estilizado en el spotlight
      const svgInner = svgContainer.querySelector("svg");
      if (svgInner) {
        svgInner.style.width = "120px";
        svgInner.style.height = "120px";
        svgInner.style.strokeWidth = "1.2";
      }
      svgContainer.style.display = "block";
    }

    // 2. Actualizar botón de cotización
    if (quoteBtn) {
      quoteBtn.setAttribute("onclick", `addToQuoteCart('${product.id}', 'mantenimiento')`);
    }

    // 3. Generar las características técnicas dinámicas
    let featuresHtml = "";
    
    // Mapeo inteligente de características según el producto
    if (product.id === "swipe_concentrate") {
      featuresHtml = `
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Desengrase de Alta Potencia</h4>
            <p>Remueve con máxima rapidez grasas pesadas, aceites, hollín, polvo y cochambre en vialidades, motores, maquinaria pesada y talleres de mantenimiento del club.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Rendimiento y Dosificación</h4>
            <p>Versatilidad total: Solución Liviana (1:100) para vidrios y Casa Club; Solución Normal (1:12) para vialidades y mantenimiento general de pasillos; Solución Pesada (1:4) para motores y talleres.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Seguridad y Cuidado Ambiental</h4>
            <p>Fórmula biodegradable en más del 99%, libre de fosfatos. No es tóxica, no es inflamable y no daña ni despinta las superficies del complejo.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Versatilidad y pH Neutro</h4>
            <p>Versión Low Foam disponible para restregadoras automáticas de pisos y versión pH Neutro (pH 7) para proteger el funcionamiento de las plantas tratadoras del club.</p>
          </div>
        </div>
      `;
    } else if (product.id === "swipol_mantenimiento") {
      featuresHtml = `
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Bioseguridad Total Multiusos</h4>
            <p>Formulado con cuaternarios de amonio de quinta generación que garantizan cero irritación cutánea. Elimina al 99.999% bacterias, virus y hongos en lobbys, pasillos, salones de eventos, mostradores y áreas de atención al socio del club.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22 4 12 14.01 9 11.01" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Discreción Absoluta (Incoloro e Inodoro)</h4>
            <p>Su fórmula 100% incolora e inodora garantiza que la desinfección profunda de oficinas de administración, salones y áreas de recepción se realice sin dejar olores químicos que alteren la experiencia premium de los socios.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Rendimiento y Dosificación</h4>
            <p>Limpieza de rutina (1:200) para superficies de alto tráfico como pasillos y lobbys. Desinfección profunda (1:100) para baños generales y zonas de atención médica del club. No requiere enjuague en diluciones de mantenimiento.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Manejo Seguro y pH Neutro</h4>
            <p>Completamente neutro (pH 7.0), no deja residuos ni altera los acabados de pisos finos, muebles y superficies premium del club. Dermatológicamente seguro y sin vapores irritantes para el personal de limpieza.</p>
          </div>
        </div>
      `;
    } else if (product.id === "rust_off") {
      featuresHtml = `
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Rendimiento y Dosificación</h4>
            <p><strong>Mantenimiento Normal (1:10):</strong> Se diluye 1 parte de producto por 10 partes de agua, lo que le otorga una gran economía a nivel industrial.<br><strong>Uso Pesado:</strong> Para incrustaciones de óxido muy gruesas, se puede aplicar en una dilución más fuerte o incluso concentrado. Su aplicación correcta consiste en rociar, dejar actuar de 10 a 15 minutos y después enjuagar (apoyándose con una fibra verde SWIPE si es necesario).</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Uso en el Club (Infraestructura y Tuberías)</h4>
            <p>Es un poderoso desincrustante industrial de tipo ácido, totalmente biodegradable. Está diseñado para eliminar de manera efectiva los carbonatos de calcio y magnesio (sarro) adheridos a calderas, tuberías y maquinaria pesada del club. Además, remueve concreto sobre diversas superficies y grasa animal o vegetal incrustada en equipos de cocina industrial.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Ventaja Operativa (Protección de Activos)</h4>
            <p>A diferencia de los ácidos tradicionales que corroen los metales, su fórmula incluye agentes inhibidores de corrosión que protegen las piezas metálicas mientras están siendo desincrustadas. Contiene agentes antioxidantes que ayudan a evitar que las piezas tratadas vuelvan a oxidarse rápidamente.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Protocolo de Seguridad Estricto</h4>
            <p style="color: #ff5a5a; font-weight: 600;">Químico de nivel industrial y de naturaleza ácida: NUNCA mezclarse con cloro ni con ningún otro producto. Requisito indispensable que el personal de mantenimiento utilice guantes de hule y goggles de protección al manipularlo, en áreas ventiladas.</p>
          </div>
        </div>
      `;
    } else if (product.id === "alubrite") {
      featuresHtml = `
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Rendimiento y Aplicación</h4>
            <p><strong>Dilución 1:10 a 1:20:</strong> Se diluye 1 parte de producto por 10 a 20 partes de agua, dependiendo de qué tan severas sean las incrustaciones en el metal. La técnica correcta exige aplicarlo de abajo hacia arriba, dejarlo actuar entre 3 y 5 minutos, y enjuagar inmediatamente con abundante agua para que el producto no se seque y deje marcas de escurrimiento.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 .6.4 1 1 1h2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="21" r="2"/><circle cx="17" cy="21" r="2"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Uso en el Club (Estructuras, Ventanales y Vehículos)</h4>
            <p>Limpiador y abrillantador altamente eficiente diseñado para superficies de aluminio y acero inoxidable. Es la herramienta perfecta para el mantenimiento de cancelerías, puertas de aluminio, escaleras de albercas y para dejar relucientes los rines de los automóviles o carritos de golf de las flotas del club.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Ventaja Operativa (Restauración del Brillo)</h4>
            <p>Su fórmula crea una capa de espuma fina y densa que penetra el metal para eliminar esos molestos "óxidos blancos" que opacan el aluminio con el tiempo, así como la suciedad adherida, devolviéndole su brillo original de fábrica. Un gran plus es que no daña la pintura ni las calcomanías de los vehículos o flotillas.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Precauciones Críticas de Seguridad</h4>
            <p style="color: #ff5a5a; font-weight: 600;">Químico industrial TÓXICO y ALTAMENTE CORROSIVO (contiene Ácido Fluorhídrico). Obligatorio el uso de goggles, guantes de neopreno y mandil especial para ácidos. Se recomienda NO utilizar en aluminio anodizado ni en otros metales que no sean aluminio. NUNCA mezclar con cloro.</p>
          </div>
        </div>
      `;
    } else if (product.id === "steelbrite") {
      featuresHtml = `
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Rendimiento y Dosificación</h4>
            <p><strong>Dilución 1:5 a 1:10:</strong> Se utiliza diluido en una proporción de 1 parte de producto por 5 a 10 partes de agua, dependiendo de qué tan severas sean las incrustaciones de sarro o grasas sobre el acero.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Uso en el Club (Cocinas y Áreas de Alimentos)</h4>
            <p>Poderosa fórmula de grado alimenticio diseñada específicamente para eliminar incrustaciones de sales minerales (sarro) y grasas pesadas en todas las superficies de acero inoxidable del club. Ideal para mesas de trabajo, campanas, ollas de cocimiento, herramientas de cocina, cuartos fríos y equipos en general en el procesamiento de alimentos.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Técnica Segura y Protección de Equipos</h4>
            <p><strong>Técnica de Aplicación:</strong> Para lograr el acabado brillante sin dañar el mobiliario, debe aplicarse con una fibra blanca (suave), evitando estrictamente fibras verdes o negras que rayen permanentemente el acero.<br><strong>Protección del Equipo:</strong> Formulado con inhibidores de corrosión activos que protegen las valiosas piezas metálicas de la acción ácida durante la desincrustación.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Precauciones y Manejo</h4>
            <p style="color: #ff5a5a; font-weight: 600;">NUNCA mezclar con cloro bajo ninguna circunstancia. El personal debe utilizar obligatoriamente guantes de hule y lentes de seguridad durante su manejo en áreas bien ventiladas.</p>
          </div>
        </div>
      `;
    } else if (product.id === "sure_thing") {
      featuresHtml = `
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Rendimiento y Dosificación</h4>
            <p><strong>Concentración Extrema:</strong> Líquido altamente concentrado con rendimiento sobresaliente.<br><strong>Uso Directo:</strong> Unas cuantas gotas puras en ceniceros/botes de basura, o simplemente destapar y regular inserto para desodorizar espacios pequeños.<br><strong>Aspersión (Rendimiento Máximo):</strong> Diluir de 30 a 60 gotas en medio litro de agua en atomizador para áreas grandes o malos olores impregnados.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Uso en el Club (Recepción, Oficinas y Salones)</h4>
            <p>Desodorante y desinfectante de ambiente biodegradable que actúa neutralizando los aromas de raíz. Disponible en aromas premium (menta, floral, canela y vainilla), es perfecto para mantener una atmósfera fresca en áreas sociales, salas de juntas, baños y oficinas de la Casa Club.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Ventaja Operativa (Neutralización Real)</h4>
            <p>No solo enmascara el olor con perfume; contiene agentes germicidas y degradadores de materia orgánica que eliminan del medio ambiente los olores desagradables de raíz (como humo de tabaco o vapores de cocinas).</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Sinergia Swipol y Seguridad</h4>
            <p><strong>Dato Estratégico de Sinergia:</strong> Compatible y combinable con el desinfectante **Swipol** sin que este último pierda sus propiedades germicidas. Esto permite limpiar, desinfectar y aromatizar en un solo paso.<br><strong style="color: #ff5a5a;">Nota de Seguridad:</strong> A pesar de su baja toxicidad, este producto es FLAMABLE, por lo que debe almacenarse adecuadamente alejado de fuentes de calor.</p>
          </div>
        </div>
      `;
    } else if (product.id === "biodegreaser") {
      featuresHtml = `
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Rendimiento y Dosificación</h4>
            <p><strong>Dosificación Diaria:</strong> Se dosifican 200 ml diarios para tratar líneas de drenaje y trampas de grasa con una capacidad de hasta 500 litros.<br><strong>Dosificación Automática:</strong> Para facilitar esta labor y asegurar la dosificación exacta en el club, se recomienda utilizar el dosificador automático BIODEGREASER.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Usos y Aplicación (Cocinas y Restaurantes)</h4>
            <p>Es una mezcla de microorganismos, natural, no tóxica y no corrosiva. Diseñado específicamente para desintegar almidones, carbohidratos, grasas y aceites. Tratamiento preventivo ideal para trampas de grasa de cocinas y restaurantes del club, ya que degrada los desechos orgánicos y reduce significativamente los malos olores.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Regla Operativa</h4>
            <p>Para que los microorganismos actúen correctamente, el producto debe aplicarse de noche o en un horario en donde la línea de drenaje o la trampa de grasa no se encuentre en uso, permitiendo tiempo de reposo para el cultivo biológico.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Nota Técnica Crítica</h4>
            <p style="color: #ff5a5a; font-weight: 600;">Debido a que es un cultivo biológico vivo, NO debe mezclarse con desinfectantes ni con productos alcalinos o ácidos, ya que neutralizarían la acción de los microorganismos benéficos.</p>
          </div>
        </div>
      `;
    } else if (product.id === "hand_soap") {
      featuresHtml = `
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Rendimiento y Aplicación</h4>
            <p><strong>Uso Concentrado:</strong> Diseñado para usarse directo en estado concentrado para una desinfección efectiva. Se aplica en las manos frotando firmemente por un minuto y luego se enjuaga.<br><strong>Optimización de Insumos:</strong> Para evitar desperdicios y maximizar el rendimiento, se recomienda el uso de los despachadores automáticos o manuales de jabón para manos de SWIPE.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Uso en el Club (Comedores, Baños y Áreas Médicas)</h4>
            <p>Jabón líquido germicida y de grado alimenticio formulado para eliminar una amplia gama de bacterias, hongos y levaduras (como <em>S. aureus, E. coli, Salmonella</em>). Es indispensable para la higiene rigurosa en cocinas del club (personal que prepara alimentos), baños generales, consultorios médicos o guarderías, previniendo infecciones cruzadas.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Ventaja Operativa (Cuidado de la Piel)</h4>
            <p>Cuenta con un pH balanceado (de 5 a 6) que está en perfecta armonía con la química natural de la piel, asegurando que no irrite ni reseque las manos, incluso con el lavado altamente frecuente exigido al personal operativo y médico del club.</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Versatilidad y Normativas Alimentarias</h4>
            <p>Además de los aromas premium a almendras o frutas idóneos para baños generales, está disponible en una versión sin fragancia y sin color especialmente diseñada para cocinas y áreas de preparación de alimentos, cumpliendo estrictamente con las normativas sanitarias y de inocuidad alimentaria.</p>
          </div>
        </div>
      `;
    } else {
      // Fallback dinámico premium para otros productos de Mantenimiento (Glass-Glow, Champú Cera Cart, Floor-Shine)
      featuresHtml = `
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" stroke-linecap="round"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Descripción del Producto</h4>
            <p>${product.description}</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Beneficios Clave</h4>
            <ul style="font-size: 0.85rem; line-height: 1.5; color: var(--color-glass-text); padding-left: 1.2rem; margin: 0.3rem 0 0 0;">
              ${product.benefits.map(b => `<li style="margin-bottom: 0.3rem;">${b}</li>`).join("")}
            </ul>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Rendimiento y Dosificación</h4>
            <p><strong>Dosificación:</strong> ${product.dosage}<br><strong>Dilución / Método:</strong> ${product.dilution}</p>
          </div>
        </div>
        <div class="mantenimiento-feature-card">
          <div class="mantenimiento-feature-icon-container">
            <svg class="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="mantenimiento-feature-text">
            <h4>Seguridad e Impacto Ambiental</h4>
            <p><strong>Manejo Seguro:</strong> ${product.safety}<br><strong>Impacto en pH:</strong> ${product.phImpact || 'Neutro.'}</p>
          </div>
        </div>
      `;
    }

    featuresColumn.innerHTML = featuresHtml;

    // Restaurar opacidades con animaciones suaves
    featuresColumn.style.opacity = "1";
    featuresColumn.style.transform = "translateY(0)";
    
    spotlightCard.style.opacity = "1";
    spotlightCard.style.transform = "scale(1)";
  }, 150);
}

