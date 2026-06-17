/**
 * Lógica matemática de las calculadoras y simuladores interactivos
 * para cada una de las 5 áreas del Club de Golf Las Lomas.
 */

const CALCULATORS = {
  // 1. ALBERCA - Calculadora de Dosificación de Químicos
  alberca: {
    render: (containerId) => {
      const html = `
        <div class="calculator-card" style="border-color: var(--color-alberca)">
          <div class="calc-title-group" style="color: var(--color-alberca)">
            <svg class="calc-icon" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3 class="calc-title">Dosificación de Químicos</h3>
          </div>
          <div class="calc-form">
            <div class="calc-input-group">
              <label class="calc-label">Volumen de Alberca</label>
              <div class="calc-input-container">
                <input type="number" id="alb-vol" class="calc-input" value="50" min="1" max="5000">
                <span class="calc-unit">m³ (Lts × 1000)</span>
              </div>
            </div>
            <div class="calc-input-group">
              <label class="calc-label">Producto Químico</label>
              <select id="alb-prod" class="calc-input calc-select">
                <option value="shock">Cloro Shock Premium (Sanitizante)</option>
                <option value="alguicida">Alguicida Concentrado (Anti-Algas)</option>
                <option value="clarificador">Clarificador Floculante (Brillo)</option>
              </select>
            </div>
            <div class="calc-input-group">
              <label class="calc-label">Estado del Agua</label>
              <select id="alb-state" class="calc-input calc-select">
                <option value="maint">Mantenimiento (Rutina Semanal)</option>
                <option value="corrective">Correctivo (Agua Turbia / Algas)</option>
              </select>
            </div>
            <div class="calc-result-box" style="border-color: rgba(0, 242, 254, 0.15)">
              <span class="calc-result-value" id="alb-res" style="color: var(--color-alberca)">750 g</span>
              <span class="calc-result-label">Cantidad Recomendada</span>
            </div>
          </div>
        </div>
      `;
      document.getElementById(containerId).innerHTML = html;

      // Event Listeners
      const update = () => {
        const vol = parseFloat(document.getElementById("alb-vol").value) || 0;
        const prod = document.getElementById("alb-prod").value;
        const state = document.getElementById("alb-state").value;
        let amount = 0;
        let unit = "g";

        if (prod === "shock") {
          // Shock: Mantenimiento = 15g/m3, Choque = 30g/m3
          amount = state === "maint" ? vol * 15 : vol * 30;
          unit = "g";
        } else if (prod === "alguicida") {
          // Alguicida: Maint = 10ml/m3, Corrective = 30ml/m3
          amount = state === "maint" ? vol * 10 : vol * 30;
          unit = "ml";
        } else if (prod === "clarificador") {
          // Clarificador: Maint = 5ml/m3, Corrective = 15ml/m3
          amount = state === "maint" ? vol * 5 : vol * 15;
          unit = "ml";
        }

        // Formatear salida
        let output = "";
        if (unit === "g") {
          if (amount >= 1000) {
            output = `${(amount / 1000).toFixed(2)} kg`;
          } else {
            output = `${Math.round(amount)} g`;
          }
        } else {
          if (amount >= 1000) {
            output = `${(amount / 1000).toFixed(2)} L`;
          } else {
            output = `${Math.round(amount)} ml`;
          }
        }

        document.getElementById("alb-res").innerText = output;
      };

      document.getElementById("alb-vol").addEventListener("input", update);
      document.getElementById("alb-prod").addEventListener("change", update);
      document.getElementById("alb-state").addEventListener("change", update);
      update();
    }
  },

  // 2. SPA - Simulador de Aromaterapia de Vapor
  spa: {
    render: (containerId) => {
      const html = `
        <div class="calculator-card" style="border-color: var(--color-spa)">
          <div class="calc-title-group" style="color: var(--color-spa)">
            <svg class="calc-icon" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3 class="calc-title">Aromaterapia & Vapor</h3>
          </div>
          <div class="calc-form">
            <div class="calc-input-group">
              <label class="calc-label">Volumen del Cuarto de Vapor</label>
              <div class="calc-input-container">
                <input type="number" id="spa-vol" class="calc-input" value="15" min="1" max="200">
                <span class="calc-unit">m³ (L × A × H)</span>
              </div>
            </div>
            <div class="calc-input-group">
              <label class="calc-label">Intensidad Aromática</label>
              <select id="spa-intensity" class="calc-input calc-select">
                <option value="soft">Intensidad Suave (Relajante)</option>
                <option value="medium" selected>Intensidad Media (Balanceada)</option>
                <option value="high">Intensidad Alta (Vías Respiratorias)</option>
              </select>
            </div>
            <div class="calc-input-group">
              <label class="calc-label">Horas de Operación Diaria</label>
              <input type="range" id="spa-hours" min="1" max="24" value="12" style="accent-color: var(--color-spa); cursor:pointer;">
              <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--color-text-muted); margin-top:0.2rem;">
                <span>1 hora</span>
                <span id="spa-hours-val" style="color: var(--color-spa); font-weight:700">12 horas</span>
                <span>24 horas</span>
              </div>
            </div>
            <div class="calc-result-box" style="border-color: rgba(5, 230, 180, 0.15)">
              <span class="calc-result-value" id="spa-res" style="color: var(--color-spa)">180 ml</span>
              <span class="calc-result-label">Consumo diario de Esencia (Eucalipto)</span>
            </div>
          </div>
        </div>
      `;
      document.getElementById(containerId).innerHTML = html;

      const update = () => {
        const vol = parseFloat(document.getElementById("spa-vol").value) || 0;
        const intensity = document.getElementById("spa-intensity").value;
        const hours = parseInt(document.getElementById("spa-hours").value);
        
        document.getElementById("spa-hours-val").innerText = `${hours} horas`;

        // Coeficientes por m3 por hora
        let coef = 0.5; // soft
        if (intensity === "medium") coef = 1.0;
        if (intensity === "high") coef = 1.8;

        const totalMl = vol * coef * hours;
        let output = "";
        if (totalMl >= 1000) {
          output = `${(totalMl / 1000).toFixed(2)} L`;
        } else {
          output = `${Math.round(totalMl)} ml`;
        }

        document.getElementById("spa-res").innerText = output;
      };

      document.getElementById("spa-vol").addEventListener("input", update);
      document.getElementById("spa-intensity").addEventListener("change", update);
      document.getElementById("spa-hours").addEventListener("input", update);
      update();
    }
  },

  // 3. GIMNASIO - Ahorro por Dilución Concentrada
  gimnasio: {
    render: (containerId) => {
      const html = `
        <div class="calculator-card" style="border-color: var(--color-gimnasio)">
          <div class="calc-title-group" style="color: var(--color-gimnasio)">
            <svg class="calc-icon" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3 class="calc-title">Ahorro por Concentrado</h3>
          </div>
          <div class="calc-form">
            <div class="calc-input-group">
              <label class="calc-label">Cantidad de Producto Concentrado</label>
              <select id="gym-concentrate" class="calc-input calc-select">
                <option value="1">Garrafa de 1 Litro</option>
                <option value="4" selected>Galón de 4 Litros</option>
                <option value="20">Porrón de 20 Litros</option>
              </select>
            </div>
            <div class="calc-input-group">
              <label class="calc-label">Línea de Limpieza Deportiva</label>
              <select id="gym-type" class="calc-input calc-select">
                <option value="spray">Swipe Gym Spray (Desinfectante Equipos - Dil. 1:20)</option>
                <option value="floor">Floor-Active Sanitizer (Limpiador Pisos - Dil. 1:200)</option>
              </select>
            </div>
            <div class="calc-result-box" style="border-color: rgba(255, 77, 45, 0.15); display: grid; grid-template-columns: 50% 50%; gap: 1rem; align-items: center;">
              <div>
                <span class="calc-result-value" id="gym-res-qty" style="color: var(--color-gimnasio)">80 L</span>
                <span class="calc-result-label" style="font-size:0.65rem">Producto Listo para Usar</span>
              </div>
              <div style="border-left: 1px solid rgba(255,255,255,0.08)">
                <span class="calc-result-value" id="gym-res-save" style="color: #10b981">$2,400</span>
                <span class="calc-result-label" style="font-size:0.65rem">Ahorro Económico Est.</span>
              </div>
            </div>
          </div>
        </div>
      `;
      document.getElementById(containerId).innerHTML = html;

      const update = () => {
        const liters = parseFloat(document.getElementById("gym-concentrate").value);
        const type = document.getElementById("gym-type").value;
        
        let dilutedLiters = 0;
        let savings = 0;

        if (type === "spray") {
          // Dilución 1:20 (1L de concentrado hace 20L de producto listo para usar)
          dilutedLiters = liters * 20;
          // Ahorro estimado: un sanitizante comercial de gimnasio de marca cuesta unos $65 MXN el litro.
          // Rociador Swipe diluido cuesta aprox $6.50 pesos el litro.
          // Ahorro es de $58.50 por litro diluido!
          savings = dilutedLiters * 58.50;
        } else {
          // Dilución 1:200 (1L concentrado hace 200L / aprox 20 cubetas de trapeado)
          dilutedLiters = liters * 200;
          // Un limpiador de pisos normal cuesta $25 pesos el litro.
          // Solución Swipe rinde de forma increíble, costo por litro diluido es de aprox $0.80 centavos.
          // Ahorro es de $24.20 por litro!
          savings = dilutedLiters * 24.20;
        }

        document.getElementById("gym-res-qty").innerText = `${dilutedLiters} Litros`;
        document.getElementById("gym-res-save").innerText = `$${Math.round(savings).toLocaleString("es-MX")} MXN`;
      };

      document.getElementById("gym-concentrate").addEventListener("change", update);
      document.getElementById("gym-type").addEventListener("change", update);
      update();
    }
  },

  // 4. GASTRONOMÍA - Protocolos de Higiene del Restaurante
  gastronomia: {
    render: (containerId) => {
      const html = `
        <div class="calculator-card" style="border-color: var(--color-gastronomia)">
          <div class="calc-title-group" style="color: var(--color-gastronomia)">
            <svg class="calc-icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3 class="calc-title">Protocolo de Higiene H</h3>
          </div>
          <div class="calc-form">
            <div class="calc-input-group">
              <label class="calc-label">Seleccionar Área de Cocina</label>
              <select id="gas-area" class="calc-input calc-select">
                <option value="grease">Campanas, Parrillas y Hornos (Cochambre)</option>
                <option value="dish">Lavavajillas y Cristalería Automatizada</option>
                <option value="fruits">Desinfección de Ensaladas y Frutas</option>
                <option value="surfaces">Mesas de Trabajo, Rebanadoras y Tablas</option>
              </select>
            </div>
            
            <div id="gas-protocol-box" class="calc-result-box" style="border-color: rgba(255, 200, 55, 0.15); text-align: left; align-items: flex-start; padding: 1.2rem; font-size: 0.8rem; gap: 0.8rem;">
              <!-- Se inyecta dinámicamente -->
            </div>
          </div>
        </div>
      `;
      document.getElementById(containerId).innerHTML = html;

      const protocols = {
        grease: {
          product: "Super Degreaser Plus",
          dilution: "1:3 (Extremo) a 1:10 (Diario)",
          steps: [
            "Apagar equipos y raspar depósitos gruesos de cochambre.",
            "Rociar uniformemente con espumador Swipe.",
            "Dejar reposar entre 5 y 10 minutos (sin dejar secar).",
            "Tallar ligeramente con fibra abrasiva y enjuagar con agua caliente."
          ]
        },
        dish: {
          product: "Auto-Dish Liquid Premium",
          dilution: "2 a 4 ml por litro de agua (Automatizado)",
          steps: [
            "Escamochar vajilla eliminando residuos de comida grandes.",
            "Colocar en canastillas sin encimar platos.",
            "El sistema dosifica electrónicamente al ciclo de lavado.",
            "Retirar del rack al secarse. No requiere secado manual con trapo."
          ]
        },
        fruits: {
          product: "Fruit & Veggie Sanitizer",
          dilution: "1:500 (10 ml en 5 litros de agua)",
          steps: [
            "Lavar los vegetales con agua corriente para quitar tierra.",
            "Sumergir completamente en la solución desinfectante.",
            "Dejar actuar por 2 minutos exactos.",
            "Escurrir bien. No requiere enjuagarse con agua potable."
          ]
        },
        surfaces: {
          product: "Swipe Surface Sanitizer RTU",
          dilution: "Listo para usar (Sin diluir)",
          steps: [
            "Limpiar y lavar la superficie previamente con detergente.",
            "Rociar Swipe Surface de forma directa.",
            "Pasar un paño seco o dejar secar por evaporación.",
            "El área queda desinfectada y lista para uso inmediato."
          ]
        }
      };

      const update = () => {
        const area = document.getElementById("gas-area").value;
        const data = protocols[area];
        
        let stepsHtml = data.steps.map((step, idx) => `
          <div style="display:flex; gap:0.5rem; line-height:1.4; margin-bottom:0.3rem;">
            <span style="color:var(--color-gastronomia); font-weight:bold;">${idx + 1}.</span>
            <span style="color:var(--color-glass-text);">${step}</span>
          </div>
        `).join("");

        document.getElementById("gas-protocol-box").innerHTML = `
          <div style="width:100%; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:0.5rem; margin-bottom:0.5rem; display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:var(--color-text-white); font-family:var(--font-title); font-size:0.9rem;">${data.product}</strong>
            <span style="background:rgba(255,200,55,0.1); color:var(--color-gastronomia); padding:0.1rem 0.5rem; border-radius:4px; font-weight:bold; font-size:0.7rem;">Dil. ${data.dilution}</span>
          </div>
          <div style="width:100%;">
            <span style="font-size:0.65rem; color:var(--color-text-muted); text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:0.5rem;">Instrucciones del Protocolo</span>
            ${stepsHtml}
          </div>
        `;
      };

      document.getElementById("gas-area").addEventListener("change", update);
      update();
    }
  },

  // 5. MANTENIMIENTO - Diluciones del Multiusos Swipe
  mantenimiento: {
    render: (containerId) => {
      const html = `
        <div class="calculator-card" style="border-color: var(--color-mantenimiento)">
          <div class="calc-title-group" style="color: var(--color-mantenimiento)">
            <svg class="calc-icon" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3 class="calc-title">Dosificación Multiusos</h3>
          </div>
          <div class="calc-form">
            <div class="calc-input-group">
              <label class="calc-label">Capacidad del Atomizador / Recipiente</label>
              <div class="calc-input-container">
                <input type="number" id="maint-vol" class="calc-input" value="500" min="50" max="100000">
                <span class="calc-unit">mililitros (ml)</span>
              </div>
            </div>
            <div class="calc-input-group">
              <label class="calc-label">Tipo de Limpieza (Dilución Swipe)</label>
              <select id="maint-dil" class="calc-input calc-select">
                <option value="light">Liviana (1:100) - Cristales, Espejos, Pantallas</option>
                <option value="normal" selected>Normal (1:10) - Paredes, Vinilos, Muebles</option>
                <option value="heavy">Pesada (1:4) - Motores, Grasas, Golf Carts Lodos</option>
              </select>
            </div>
            
            <div class="calc-result-box" style="border-color: rgba(138, 63, 252, 0.15); display: grid; grid-template-columns: 50% 50%; gap: 1rem; align-items: center;">
              <div>
                <span class="calc-result-value" id="maint-res-swipe" style="color: var(--color-mantenimiento)">45 ml</span>
                <span class="calc-result-label" style="font-size:0.65rem">Swipe Concentrado</span>
              </div>
              <div style="border-left: 1px solid rgba(255,255,255,0.08)">
                <span class="calc-result-value" id="maint-res-water" style="color: var(--color-glass-text)">455 ml</span>
                <span class="calc-result-label" style="font-size:0.65rem">Agua limpia</span>
              </div>
            </div>
          </div>
        </div>
      `;
      document.getElementById(containerId).innerHTML = html;

      const update = () => {
        const vol = parseFloat(document.getElementById("maint-vol").value) || 0;
        const dil = document.getElementById("maint-dil").value;
        
        let ratio = 10; // normal (1:10 means 1 part Swipe, 10 parts water, total 11 parts)
        if (dil === "light") ratio = 100;
        if (dil === "heavy") ratio = 4;

        const totalParts = ratio + 1;
        const swipeMl = vol / totalParts;
        const waterMl = vol - swipeMl;

        let swipeOutput = "";
        let waterOutput = "";

        if (swipeMl >= 1000) {
          swipeOutput = `${(swipeMl / 1000).toFixed(2)} L`;
        } else {
          swipeOutput = `${Math.round(swipeMl)} ml`;
        }

        if (waterMl >= 1000) {
          waterOutput = `${(waterMl / 1000).toFixed(2)} L`;
        } else {
          waterOutput = `${Math.round(waterMl)} ml`;
        }

        document.getElementById("maint-res-swipe").innerText = swipeOutput;
        document.getElementById("maint-res-water").innerText = waterOutput;
      };

      document.getElementById("maint-vol").addEventListener("input", update);
      document.getElementById("maint-dil").addEventListener("change", update);
      update();
    }
  },

  // 6. AHORRO & ECOLOGÍA - Calculadora de Ahorro y Sustentabilidad
  ahorro: {
    render: (containerId) => {
      const html = `
        <div class="calculator-card" style="border-color: var(--color-ahorro)">
          <div class="calc-title-group" style="color: var(--color-ahorro)">
            <svg class="calc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3 class="calc-title">Simulador de Ahorro Anual</h3>
          </div>
          <div class="calc-form">
            <div class="calc-input-group">
              <label class="calc-label">Gasto Mensual Actual en Químicos</label>
              <div class="calc-input-container">
                <input type="number" id="eco-spend" class="calc-input" value="45000" min="5000" max="1000000">
                <span class="calc-unit">MXN / mes</span>
              </div>
            </div>
            <div class="calc-input-group">
              <label class="calc-label">Eficiencia Estimada Swipe</label>
              <select id="eco-efficiency" class="calc-input calc-select">
                <option value="35">Optimización Conservadora (35% Ahorro)</option>
                <option value="40" selected>Optimización Recomendada (40% Ahorro)</option>
                <option value="45">Optimización Máxima (45% Ahorro)</option>
              </select>
            </div>
            
            <div class="calc-result-box" style="border-color: rgba(168, 255, 120, 0.15); display: grid; grid-template-columns: 50% 50%; gap: 1rem; align-items: center;">
              <div>
                <span class="calc-result-value" id="eco-res-monthly" style="color: var(--color-ahorro)">$18,000</span>
                <span class="calc-result-label" style="font-size:0.65rem">Ahorro Mensual</span>
              </div>
              <div style="border-left: 1px solid rgba(255,255,255,0.08)">
                <span class="calc-result-value" id="eco-res-annual" style="color: #10b981">$216,000</span>
                <span class="calc-result-label" style="font-size:0.65rem">Ahorro Anual Est.</span>
              </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.02); padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04); font-size: 0.75rem; text-align: center;">
              🌱 <strong>Impacto Ecológico Anual:</strong> <span id="eco-res-bottles" style="color: var(--color-ahorro); font-weight: bold;">1,800</span> envases plásticos de 1L menos en el medio ambiente gracias a las diluciones Swipe.
            </div>
          </div>
        </div>
      `;
      document.getElementById(containerId).innerHTML = html;

      const update = () => {
        const spend = parseFloat(document.getElementById("eco-spend").value) || 0;
        const eff = parseFloat(document.getElementById("eco-efficiency").value);
        
        const monthlySave = spend * (eff / 100);
        const annualSave = monthlySave * 12;
        
        const bottlesSaved = Math.round((spend / 300) * 12);

        document.getElementById("eco-res-monthly").innerText = `$${Math.round(monthlySave).toLocaleString("es-MX")} MXN`;
        document.getElementById("eco-res-annual").innerText = `$${Math.round(annualSave).toLocaleString("es-MX")} MXN`;
        document.getElementById("eco-res-bottles").innerText = bottlesSaved.toLocaleString("es-MX");
      };

      document.getElementById("eco-spend").addEventListener("input", update);
      document.getElementById("eco-efficiency").addEventListener("change", update);
      update();
    }
  },

  // 7. DEMO - Formulario de Programación de Demostraciones en Vivo
  demo: {
    render: (containerId) => {
      const html = `
        <div class="calculator-card" style="border-color: var(--color-demo)" id="demo-card-container">
          <div class="calc-title-group" style="color: var(--color-demo)">
            <svg class="calc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <h3 class="calc-title">Agendar Prueba en Sitio</h3>
          </div>
          <form class="calc-form" id="demo-booking-form">
            <div class="calc-input-group">
              <label class="calc-label">Área del Club a Probar</label>
              <select id="demo-area" class="calc-input calc-select" required>
                <option value="Alberca & Acuáticos">Alberca: Desinfección Total</option>
                <option value="Spa & Wellness">Spa: Higiene Sensorial y Aromas</option>
                <option value="Gimnasio & Fitness">Gimnasio: Sanitización de Equipos</option>
                <option value="Gastronomía & Cocinas">Gastronomía: Desengrase de Cochambre</option>
                <option value="Mantenimiento General">Mantenimiento: Pisos y Multiusos</option>
              </select>
            </div>
            <div class="calc-input-group">
              <label class="calc-label">Fecha Propuesta</label>
              <input type="date" id="demo-date" class="calc-input" required>
            </div>
            <div class="calc-input-group">
              <label class="calc-label">Horario Preferido</label>
              <select id="demo-time" class="calc-input calc-select" required>
                <option value="09:00 AM">Mañana (09:00 AM)</option>
                <option value="12:00 PM" selected>Mediodía (12:00 PM)</option>
                <option value="04:00 PM">Tarde (04:00 PM)</option>
              </select>
            </div>
            
            <button type="submit" class="quotes-btn-submit" style="background: linear-gradient(135deg, var(--color-demo) 0%, #61003f 100%); color: #fff; box-shadow: 0 10px 20px var(--color-demo-glow); border: none; padding: 0.8rem; font-family: var(--font-title); font-weight:800; font-size:0.85rem; border-radius:8px; cursor:pointer; text-transform:uppercase; margin-top:0.5rem;">
              Solicitar Demostración
            </button>
          </form>
        </div>
      `;
      document.getElementById(containerId).innerHTML = html;

      // Establecer fecha mínima como mañana
      const today = new Date();
      today.setDate(today.getDate() + 1);
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1;
      let dd = today.getDate();
      if (mm < 10) mm = '0' + mm;
      if (dd < 10) dd = '0' + dd;
      document.getElementById("demo-date").value = `${yyyy}-${mm}-${dd}`;
      document.getElementById("demo-date").min = `${yyyy}-${mm}-${dd}`;

      // Manejador de reserva
      document.getElementById("demo-booking-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const areaSelected = document.getElementById("demo-area").value;
        const dateVal = document.getElementById("demo-date").value;
        const timeVal = document.getElementById("demo-time").value;

        // Formatear fecha
        const dateParts = dateVal.split("-");
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        // Redirección a WhatsApp
        const textMessage = `¡Hola! Me gustaría agendar una demostración de productos Swipe en el Club de Golf Las Lomas para el área de *${areaSelected}*.\n\n📅 *Fecha propuesta:* ${formattedDate}\n⏰ *Horario:* ${timeVal}`;
        const whatsappUrl = `https://wa.me/523321918862?text=${encodeURIComponent(textMessage)}`;
        window.open(whatsappUrl, '_blank');

        document.getElementById("demo-card-container").innerHTML = `
          <div class="quotes-success-msg" style="padding: 1.5rem 0;">
            <div class="success-icon-container" style="width:60px; height:60px; font-size:1.8rem; border-color: rgba(248, 87, 166, 0.4); color: var(--color-demo); box-shadow: 0 0 15px var(--color-demo-glow); margin: 0 auto;">✓</div>
            <h4 style="font-family: var(--font-title); font-size: 1.2rem; color: #fff; margin-top: 0.5rem; text-align:center;">¡Demo Solicitada!</h4>
            <p style="font-size: 0.8rem; line-height: 1.5; color: var(--color-text-muted); text-align: center; margin-top:0.5rem;">
              Te hemos redirigido a WhatsApp para coordinar tu demostración en el área de <strong>${areaSelected}</strong> el día <strong>${formattedDate}</strong> a las <strong>${timeVal}</strong>.
            </p>
            <p style="font-size: 0.75rem; color: var(--color-demo); font-weight:600; margin-top:0.5rem; text-align:center;">
              Si no se abrió la ventana de WhatsApp, puedes hacer click en el enlace para enviar el mensaje.
            </p>
            <button class="btn-details" onclick="CALCULATORS.demo.render('${containerId}')" style="margin: 1rem auto 0 auto; border-color: rgba(255,255,255,0.1); font-size: 0.75rem; padding: 0.5rem 1rem;">Agendar Otra Prueba</button>
          </div>
        `;
      });
    }
  }
};
