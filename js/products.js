/**
 * Base de datos de productos químicos especializados por área
 * para el Guadalajara Country Club.
 */
const PRODUCTS_DATA = {  alberca: {
    title: "Alberca & Acuáticos",
    accentColor: "var(--color-alberca)",
    slogan: "Higiene rigurosa, desinfección total y prevención en las superficies, andadores y áreas comunes colindantes a las albercas.",
    products: [
      {
        id: "shock_cloro",
        name: "Cloro Shock Premium (Superficies & Andadores)",
        tagline: "Sanitizante y blanqueador perimetral de alta penetración",
        description: "Sanitizante y blanqueador granulado de cloro de alta concentración formulado para la desinfección y limpieza profunda de andadores, orillas de alberca, azulejos y áreas húmedas comunes. Elimina eficazmente las manchas difíciles de humedad, moho, algas y hongos en superficies de piedra, concreto o loseta.",
        benefits: [
          "Blanqueamiento profundo y restauración instantánea de andadores y juntas de azulejos.",
          "Acción fungicida de amplio espectro que elimina el moho negro y la humedad persistente en vestidores.",
          "Ideal para la desinfección profunda de regaderas exteriores y escalones húmedos de alto tránsito."
        ],
        usage: "Limpieza profunda periódica y choque desinfectante en superficies, pasillos y áreas húmedas colindantes a la alberca.",
        dosage: "Disolver 100g en 10 litros de agua para lavado general, o aplicar directamente sobre manchas difíciles y tallar.",
        dilution: "Dilución en agua para aplicación con cepillo, mopa o hidrolavadora.",
        phImpact: "Estable en superficies duras.",
        safety: "Utilizar guantes de protección y lentes de seguridad. Evitar que caiga directamente al agua de la alberca en estado concentrado.",
        badge: "Blanqueador & Fungicida"
      },
      {
        id: "alguicida_max",
        name: "Swipol (Desinfectante Perimetral)",
        tagline: "Alguicida, fungicida y viricida perimetral de amplio espectro",
        description: "Swipol es la herramienta definitiva para la desinfección total de las áreas comunes colindantes a la alberca, como baños de pies, vestidores, regaderas y camastros. Su fórmula a base de cuaternarios de amonio de quinta generación elimina bacterias, virus y hongos previniendo pie de atleta e infecciones cruzadas, sin causar irritación en los socios.",
        benefits: [
          "Seguridad absoluta para socios descalzos: compuesto incoloro e inoloro de grado quirúrgico (cero irritación cutánea).",
          "Prevención activa de pie de atleta e infecciones en regaderas, vestidores y andadores húmedos.",
          "Alta adherencia y persistencia en azulejos, tapetes sanitarios y camastros de plástico o metal.",
          "Alta tolerancia a la humedad constante y aguas duras, garantizando su eficacia continua."
        ],
        usage: "Desinfección diaria de regaderas, vestidores, baños de pies, camastros y andadores perimetrales del área acuática.",
        dosage: "Dosificación recomendada en dilución para desinfección de rutina.",
        dilution: "Uso perimetral diluido. No requiere enjuague en superficies de bajo contacto.",
        phImpact: "Neutro y estable en superficies.",
        safety: "No irritante para la piel en dilución. Totalmente incoloro e inoloro.",
        badge: "Desinfección Perimetral"
      },
      {
        id: "clarificador_gold",
        name: "Swipe Tile-Clean (Sarro de Azulejos)",
        tagline: "Desincrustante de sales minerales en andadores, escaleras y azulejos",
        description: "Limpiador ácido especializado biodegradable diseñado para remover de raíz el sarro, calcificaciones y sales minerales que se depositan en las líneas de flotación, azulejos, escaleras de acero inoxidable, trampolines y barandales húmedos de la alberca.",
        benefits: [
          "Remueve instantáneamente las incrustaciones blancas de calcio en la línea de agua y azulejos.",
          "Limpia, pule y abrillanta escaleras de acero inoxidable y barandales húmedos expuestos al cloro.",
          "Fórmula 100% biodegradable, no daña el sellador ni las juntas de los azulejos."
        ],
        usage: "Remoción de sarro, calcificaciones y óxido ligero en azulejos, escaleras, barandales y regaderas del área de albercas.",
        dosage: "Listo para usar o dilución de hasta 1:3 en agua según la severidad del sarro acumulado.",
        dilution: "Aplicar directamente con fibra blanca o suave, dejar actuar de 2 a 5 minutos, tallar suavemente y enjuagar con agua.",
        phImpact: "Ácido controlado activo.",
        safety: "Usar guantes de hule durante la aplicación. Evitar el contacto directo prolongado con metales blandos.",
        badge: "Desincrustante de Azulejos"
      },
      {
        id: "ph_balance",
        name: "Swipe Deck-Wash (Champú de Andadores)",
        tagline: "Eliminador de protectores solares, aceites y grasas corporales",
        description: "Limpiador desengrasante premium de espuma controlada diseñado específicamente para disolver protectores solares, aceites bronceadores, sudor y grasas corporales acumuladas en camastros, pisos antiderrapantes, andadores de piedra y áreas de vestidores colindantes a las albercas.",
        benefits: [
          "Elimina de raíz la película grasosa y resbaladiza de bronceador en pisos y camastros.",
          "Restaura la tracción antiderrapante natural de los andadores de piedra o cerámica.",
          "No es corrosivo, es 100% biodegradable y deja un aroma fresco y limpio de alta duración."
        ],
        usage: "Lavado diario y desengrase de pisos perimetrales, camastros, trampolines y áreas comunes de alberca.",
        dosage: "Mantenimiento diario (1:20) | Uso pesado (1:5) para acumulaciones extremas de bronceador.",
        dilution: "Diluir en agua. Aplicar con cepillo o mopa, frotar y enjuagar con abundante agua.",
        phImpact: "Neutro (pH 7), seguro para todo tipo de acabados perimetrales.",
        safety: "Seguro al tacto, biodegradable y libre de cáusticos.",
        badge: "Restaurador de Tracción"
      }
    ]
  },
  spa: {
    title: "Spa & Wellness",
    accentColor: "var(--color-spa)",
    slogan: "Santuarios de relajación absoluta con los más altos estándares de higiene y aromas cautivadores.",
    products: [
      {
        id: "sure_thing_spa",
        name: "Swipe Sure Thing",
        tagline: "Aromatizante, desodorizante y desinfectante de ambientes",
        description: "Swipe Sure Thing es el aromatizante y desodorizante biodegradable premium de acción neutralizadora absoluta diseñado para los espacios más exclusivos del Spa. No enmascara los olores, los elimina de raíz neutralizando compuestos orgánicos. Perfecto para crear una firma aromática (menta, floral, vainilla o canela) y una sensación de absoluta pureza higiénica que complementa la atmósfera sensorial de relajación del Spa.",
        benefits: [
          "Neutralización Orgánica de Raíz: Elimina olores de humedad, sudor y vapores en lugar de solo enmascararlos.",
          "Sinergia Total con Swipol: Único aromatizante compatible con Swipol para limpiar, desinfectar y aromatizar en un solo paso.",
          "Aromaterapia Premium y Exclusiva: Disponible en aromas menta, floral, vainilla y canela para personalizar la experiencia sensorial.",
          "Rendimiento de Alta Concentración: Rinde desde gotas puras de dosificación directa hasta atomizaciones ambientales de amplio espectro."
        ],
        usage: "Aromatización, desinfección y desodorización en áreas comunes, salas de masaje, vestidores, recepción del Spa y cabinas.",
        dosage: "Gotas puras en áreas focalizadas | Aspersión (30-60 gotas por 500 ml de agua) para atomización ambiental.",
        dilution: "Directo (gotas) o dilución en atomizador con agua. Puede combinarse directamente con la solución desinfectante Swipol.",
        phImpact: "Ligeramente alcalino (aromatizante activo).",
        safety: "Producto inflamable. Mantener cerrado y alejado de fuentes de calor o vapores de saunas calientes.",
        badge: "Neutralizador Aromatizante",
        image: "images/sure_thing.png"
      },
      {
        id: "swipe_concentrado_spa",
        name: "Swipe Limpiador Líquido Concentrado",
        tagline: "Limpiador y desengrasante neutro biodegradable para spas",
        description: "Swipe Limpiador Concentrado es la solución ecológica definitiva para mantener la higiene y pureza estética en las áreas de relajación y bienestar del club. Destaca por su biodegradabilidad superior al 99% y su pH neutro (en su versión especial), lo que lo hace completamente seguro para desinfectar camillas de masaje, camastros y superficies de madera, piedra o vinilo sin dañarlas.",
        benefits: [
          "100% Biodegradable (>99%): Máximo respeto ecológico en sistemas de drenaje y plantas de tratamiento del Spa.",
          "Seguridad Total sin Cáusticos: No reseca las manos del personal ni daña los materiales de camillas y mobiliario.",
          "Versión pH Neutro (pH 7): Ideal para la limpieza de maderas finas de saunas y recubrimientos de mármol del Spa.",
          "Gran Economía de Uso: Fórmula ultra concentrada que rinde hasta 100 litros de limpiador útil en diluciones suaves."
        ],
        usage: "Limpieza y preparación higiénica de salas de masaje, camastros, vestidores, saunas y áreas comunes.",
        dosage: "Mantenimiento diario (1:100) para vidrios y cromos | Lavado normal (1:12) para vestidores y pisos de Spa.",
        dilution: "Dilución variable según la carga de suciedad. Rociar o trapear y retirar con paño limpio.",
        phImpact: "pH Neutro disponible para proteger acabados premium del Spa.",
        safety: "No tóxico, no inflamable, sin cáusticos libres. Seguro para la piel y metales.",
        badge: "Limpiador Biodegradable",
        image: "images/swipe_concentrado.png"
      },
      {
        id: "swipe_brite_spa",
        name: "Swipe Brite",
        tagline: "Limpiador desincrustante ácido y biodegradable para inodoros",
        description: "Es un limpiador líquido de tipo ácido y biodegradable, diseñado específicamente para desincrustar, desinfectar y desodorizar los inodoros. Elimina eficazmente las manchas y el sarro formados por los residuos calcáreos del agua depositados en la porcelana.",
        benefits: [
          "Eliminación de olores: Inhibe el desarrollo de bacterias provenientes del agua y las materias fecales, impidiendo los olores desagradables.",
          "Seguro para cualquier color de porcelana y totalmente inofensivo para las tuberías y fosas sépticas.",
          "Doble acción: Limpieza profunda y desincrustación o mantenimiento diario.",
          "100% biodegradable: Respetuoso con el medio ambiente y los sistemas biológicos."
        ],
        usage: "Desincrustación, desinfección y desodorización en sanitarios y vestidores del club.",
        dosage: "Concentrado para sarro incrustado.",
        dilution: "Uso Concentrado (Restauración Profunda): directo sin diluir.",
        phImpact: "Ácido activo.",
        safety: "Debido a su naturaleza ácida y nivel de corrosividad, NUNCA debe mezclarse con cloro o cualquier otro producto. Si su uso es continuo por parte del personal de limpieza, se recomienda estrictamente el uso de guantes.",
        badge: "Desensarrante, desinfectante y desodorizante",
        image: "images/swipe_brite.png"
      },
      {
        id: "blue_genie_spa",
        name: "Swipe Blue Genie",
        tagline: "Desinfectante y desodorizante enzimático para sanitarios",
        description: "Es un limpiador enzimático y biodegradable perfecto para los inodoros de la Casa Club y áreas de vestidores. Actúa en el tanque y la taza inhibiendo el crecimiento bacteriano, eliminando olores y evitando depósitos de sarro de forma automática en cada descarga.",
        benefits: [
          "Doble acción automática: Limpieza enzimática constante en el tanque y la taza en cada descarga.",
          "Control bacteriano y desodorización de larga duración para sanitarios de alto tráfico.",
          "Evita depósitos de sarro sin dañar ni manchar la porcelana o cerámica de los inodoros.",
          "100% biodegradable y seguro para sistemas de tuberías y fosas sépticas."
        ],
        usage: "Mantenimiento automático, desinfección y desodorización de inodoros en vestidores y Casa Club.",
        dosage: "Dosificación automática mediante descarga de agua del tanque. Rinde de 2 a 3 meses.",
        dilution: "Dispositivo de liberación lenta: 1 unidad de 250g rinde aproximadamente 900 descargas.",
        phImpact: "Ligeramente alcalino (pH balanceado y protector).",
        safety: "Seguro al tacto en su dispositivo dosificador. Biodegradable y no corrosivo.",
        badge: "Desinfectante Enzimático",
        image: "images/blue_genie.png"
      },
      {
        id: "swipol_spa",
        name: "Swipol",
        tagline: "Sanitizante y desinfectante perimetral de grado quirúrgico",
        description: "Swipol es el desinfectante de grado quirúrgico y alimenticio definitivo para las áreas de relajación y bienestar del club. Su formulación a base de cuaternarios de amonio de quinta generación está diseñada para eliminar bacterias, virus y hongos en saunas, baños de vapor, salas de masaje, jacuzzis y vestidores, garantizando una bioseguridad absoluta sin alterar la atmósfera sensorial de relajación.",
        benefits: [
          "Seguridad Total (Cero Irritación): Compuesto dermatológicamente seguro y libre de vapores irritantes, ideal para desinfectar camillas de masaje, toallas y saunas.",
          "Atmósfera Sensorial Inalterada: 100% incoloro e inoloro. Desinfecta a fondo sin dejar molestos olores químicos que alteren la aromaterapia.",
          "Especial para Zonas de Alta Humedad: Elimina de raíz hongos causantes de pie de atleta, moho y bacterias en saunas, jacuzzis y baños de vapor.",
          "Acción Germicida Residual: Crea una barrera desinfectante invisible de alta persistencia en camillas, barandales, pisos y tumbonas de descanso."
        ],
        usage: "Desinfección diaria de camillas de masaje, saunas, baños de vapor, jacuzzis, vestidores y áreas comunes de descanso.",
        dosage: "Normal (1:200) para superficies de contacto y desodorización | Grado quirúrgico (1:100) para desinfección profunda.",
        dilution: "Diluir en agua. Rociar en camillas, pisos, paredes de saunas y baños de vapor, dejar actuar y limpiar.",
        phImpact: "Completamente neutro (pH 7), seguro para maderas finas, piedra natural, mármol y telas del Spa.",
        safety: "Seguro para la piel en dilución recomendada. No inflamable, incoloro e inoloro.",
        badge: "Desinfectante de Spa & Vapor",
        image: "images/swipol.png"
      }
    ]
  },
  gimnasio: {
    title: "Gimnasio & Fitness",
    accentColor: "var(--color-gimnasio)",
    slogan: "Máxima higiene deportiva que protege la salud de los socios y preserva las instalaciones del club.",
    products: [
      {
        id: "swipe_concentrado_gym",
        name: "Swipe Limpiador Líquido Concentrado",
        tagline: "Limpiador desengrasante biodegradable de equipos deportivos",
        description: "Swipe Limpiador Concentrado es la solución definitiva para mantener el equipamiento y las áreas de acondicionamiento físico en condiciones óptimas. Formulado con tensoactivos de alta potencia, remueve grasa corporal, sudor, polvo y aceites bronceadores acumulados en mancuernas, caminadoras y tapizados, sin resecar ni cuartear los vinilos ni plásticos.",
        benefits: [
          "Eliminación de Sudor y Grasa Corporal: Remueve con rapidez el sudor y grasas acumuladas en empuñaduras y asientos.",
          "Protección para Tapizados Premium: Cero cáusticos libres, ideal para limpiar vinilo, cuero sintético y plásticos sin cuartearlos.",
          "Biodegradabilidad Superior al 99%: Limpiador ecológico libre de fosfatos que protege el medio ambiente y los drenajes.",
          "Rendimiento Extremo: Diluciones variables que rinden hasta 100 litros de limpiador estético y de mantenimiento diario."
        ],
        usage: "Lavado y desengrase de caminadoras, bancos de pesas, pisos deportivos, mats de ejercicio y vestidores del gimnasio.",
        dosage: "Estético diario (1:100) para limpieza rápida | Lavado normal (1:12) para desengrase periódico de estructuras.",
        dilution: "Diluir en agua. Aplicar con atomizador, tallar suavemente y retirar el excedente con paño de microfibra.",
        phImpact: "Neutro, seguro para acabados plásticos y metálicos.",
        safety: "Seguro al tacto, no corrosivo y dermatológicamente amigable con el personal.",
        badge: "Desengrasante Deportivo",
        image: "images/swipe_concentrado.png"
      },
      {
        id: "swipol_gym",
        name: "Swipol",
        tagline: "Sanitizante y desinfectante de equipos y superficies deportivas",
        description: "Swipol es el sanitizante y desinfectante de grado quirúrgico definitivo para el Gimnasio y Fitness del club. Su avanzada fórmula a base de cuaternarios de amonio de quinta generación está diseñada para eliminar bacterias, virus y hongos en caminadoras, mancuernas, tapetes de yoga y vestidores. Ofrece una protección higiénica insuperable frente a la sudoración y contacto constante de los socios, sin dañar los materiales de los equipos.",
        benefits: [
          "Desinfección de Superficies de Contacto: Ideal para la sanitización inmediata de empuñaduras, pantallas táctiles, tapizados de vinilo y mancuernas.",
          "Prevención de Infecciones Cruzadas: Combate eficazmente virus y hongos que proliferan por el sudor y contacto físico frecuente entre socios en el gimnasio.",
          "Dermatológicamente Seguro: Compuesto libre de cloro y vapores tóxicos, 100% incoloro e inoloro. No irrita la piel ni los ojos de los socios al entrenar.",
          "Protección para Equipamiento Premium: Fórmula de pH neutro (pH 7) no corrosiva que no reseca el vinilo de los asientos ni daña el plástico o metal de los aparatos."
        ],
        usage: "Sanitización de caminadoras, elípticas, pesas, tapetes de yoga, vestidores, regaderas y pisos deportivos.",
        dosage: "Normal (1:200) para sanitización rápida y continua de equipos | Grado quirúrgico (1:100) para desinfección profunda diaria de vestidores y regaderas.",
        dilution: "Diluir en agua. Rociar directamente sobre la superficie del equipo, dejar actuar y retirar con paño de microfibra limpio.",
        phImpact: "Completamente neutro (pH 7), seguro para metales, plásticos, pantallas y tapizados de cuero/vinilo.",
        safety: "Seguro para la piel, incoloro, inoloro y no inflamable.",
        badge: "Sanitizante de Equipamiento",
        image: "images/swipol.png"
      }
    ]
  },
  gastronomia: {
    title: "Gastronomía & Cocinas",
    accentColor: "var(--color-gastronomia)",
    slogan: "Cocinas de clase mundial impecables. Seguridad alimentaria total y vajillas resplandecientes.",
    products: [
      {
        id: "swipe_concentrado_gastronomia",
        name: "Swipe Limpiador Líquido Concentrado",
        tagline: "Desengrasante de grado alimenticio NSF A1 para cocinas industriales",
        description: "Swipe Limpiador Concentrado es el desengrasante industrial de grado alimenticio definitivo para las cocinas y áreas gastronómicas del club. Certificado por NSF (Categoría A1) y SAGARPA, remueve con eficacia las grasas pesadas, el cochambre y los residuos de aceites de cocina acumulados en campanas, salamandras, parrillas y superficies de acero inoxidable, manteniendo las cocinas en los más altos estándares de higiene e inocuidad alimentaria.",
        benefits: [
          "Certificación Grado Alimenticio NSF A1 y SAGARPA: Seguro para usar directamente en superficies de contacto con alimentos en áreas de preparación y comedores.",
          "Desengrase Industrial Potente: Su dilución pesada (1:4) remueve de raíz las grasas carbonizadas de campanas, freidoras, parrillas y salamandras.",
          "Versatilidad Total en la Cocina: Mantenimiento diario de mesas y comedores (1:100) | Pisos y área de lavado (1:12) | Desengrase de campanas y fritura (1:4).",
          "Sin Cáusticos ni Corrosivos: No daña el acero inoxidable, granito ni utensilios. Seguro para la piel del personal de cocina con uso continuo.",
          "Versión Low Foam para Restregadoras: Disponible para uso en equipos automáticos de limpieza de pisos de la cocina industrial."
        ],
        usage: "Desengrase de campanas extractoras, parrillas, freidoras, salamandras, pisos de cocina, comedores y superficies de acero inoxidable.",
        dosage: "Diaria (1:100) para comedores and mesas | Operativa (1:12) para pisos y área de lavado | Pesada (1:4) para campanas, freidoras y parrillas.",
        dilution: "Diluir en agua según la carga de suciedad. 1 litro rinde hasta 100 litros de solución útil. Aplicar, tallar y enjuagar.",
        phImpact: "pH Neutro (pH 7.0) disponible para proteger plantas tratadoras de aguas residuales de la cocina.",
        safety: "Grado alimenticio certificado. No tóxico, no inflamable, sin cáusticos libres. Seguro para la piel y metales.",
        badge: "Grado Alimenticio NSF A1",
        image: "images/swipe_concentrado.png"
      },
      {
        id: "swipol_gastronomia",
        name: "Swipol",
        tagline: "Sanitizante y desinfectante de grado alimenticio para cocinas",
        description: "Swipol es el desinfectante definitivo de grado alimenticio y quirúrgico para las áreas gastronómicas y cocinas del club. Su formulación a base de cuaternarios de amonio de quinta generación elimina al 99.999% bacterias (como Salmonella, E. coli, S. aureus), virus y hongos en mesas de preparación, tablas de picar, cámaras de refrigeración y loza, garantizando la total inocuidad sin dejar olores ni sabores.",
        benefits: [
          "Inocuidad Alimentaria Total: Registrado y certificado para su uso directo en superficies de contacto con alimentos sin riesgo de contaminación.",
          "Sin Olor ni Sabor Residual: 100% incoloro e inoloro. No altera las propiedades organolépticas de los alimentos ni la experiencia culinaria de los socios.",
          "Amplio Espectro Bactericida: Elimina de manera inmediata bacterias patógenas que causan infecciones alimentarias en cocinas industriales.",
          "Seguro para Equipos Premium: Fórmula no corrosiva y de pH neutro (pH 7) idónea para acero inoxidable, granito, madera y utensilios."
        ],
        usage: "Desinfección de mesas de trabajo, tablas de picar, cuchillos, loza, rebanadoras, cámaras frías y utensilios de cocina.",
        dosage: "Sanitización de rutina (1:200) para superficies de alimentos | Desinfección profunda (1:100) para drenajes, campanas y pisos de cocina.",
        dilution: "Diluir en agua. Aplicar por aspersión, inmersión o trapeado, dejar actuar por 2 a 5 minutos. No requiere enjuague en superficies sanitizadas a 1:200.",
        phImpact: "Neutro y estable (pH 7.0).",
        safety: "Seguro para áreas de alimentos, libre de cloro, incoloro e inoloro.",
        badge: "Sanitizante Grado Alimenticio",
        image: "images/swipol.png"
      },
      {
        id: "veggiefruit_wash",
        name: "Veggiefruit Wash",
        tagline: "Jabón líquido desinfectante de frutas y verduras",
        description: "Veggiefruit Wash es un jabón líquido biodegradable y de grado alimenticio altamente concentrado, diseñado específicamente para lavar y desinfectar todo tipo de frutas, verduras y hierbas (como cilantro, lechugas, jitomates, papas, etc.) en las cocinas y áreas de alimentos del club.",
        benefits: [
          "Rendimiento y Dosificación (Dilución 1:100): Es un producto altamente concentrado; se requiere mezclar únicamente 10 ml de concentrado por cada litro de agua. Gracias a esta formulación, 1 litro de producto rinde hasta 100 litros de solución limpiadora, brindando una economía sorprendente. Para lograr una desinfección efectiva, se recomienda un tiempo de contacto de 1 minuto.",
          "Uso en el Club (Cocinas y Área de Alimentos): Es un jabón líquido biodegradable y de grado alimenticio, diseñado específicamente para lavar y desinfectar todo tipo de frutas, verduras y hierbas (como cilantro, lechugas, jitomates, papas, etc.). Para procesar los alimentos, las hierbas pueden lavarse por inmersión agitándolas enérgicamente tras enjuagarles la tierra, mientras que las verduras de hoja grande se pueden tallar hoja por hoja con un cepillo de cerdas suaves.",
          "Ventaja Operativa (Cero Alteración y Cuidado del Personal): A nivel culinario, una de sus mayores virtudes es que es completamente libre de aroma, por lo que no altera el sabor ni el olor natural de los ingredientes. A nivel operativo, su pH neutro (6 a 8) garantiza que no maltrata ni irrita las manos del personal en el uso diario, y tiene la gran ventaja de no dejar residuos acumulados en las tarjas de acero inoxidable."
        ],
        usage: "Lavado y desinfección profunda de frutas, verduras y hierbas finas en cocinas y áreas de banquetes.",
        dosage: "10 ml de producto por cada litro de agua (dilución 1:100). Tiempo de contacto recomendado de 1 minuto.",
        dilution: "Inmersión para hierbas finas (agitar tras enjuagar tierra) o tallado hoja por hoja con cepillo suave para verduras.",
        phImpact: "pH Neutro (6.0 a 8.0) estable y amigable.",
        safety: "Grado alimenticio y biodegradable. Dermatológicamente seguro para el operador, no deja acumulaciones en tarjas.",
        badge: "Frutas y Verduras 1:100",
        image: "images/veggiefruit_wash.png"
      },
      {
        id: "crystal",
        name: "Crystal",
        tagline: "Detergente líquido manual lavaloza de alto rendimiento",
        description: "Detergente líquido lavaloza altamente concentrado y biodegradable. Formulado específicamente para el lavado manual de cristalería, vajillas y loza fina en cocinas y eventos de alta exigencia del club. Su tecnología de escurrimiento avanzado previene el molesto efecto de gota, logrando un brillo impecable.",
        benefits: [
          "Rendimiento extraordinario: 1 litro rinde hasta 100 litros de solución útil de lavado.",
          "Cero efecto de gota: Acabado impecable y brillante en cristalería y vajillas finas sin manchar.",
          "pH Neutro y Grado Alimenticio: Certificado para la eliminación eficaz de bacterias y hongos sin maltratar las manos del personal.",
          "Acción desengrasante superior: Remueve grasa pesada e incrustaciones difíciles en sartenes y loza."
        ],
        usage: "Lavado manual de loza fina, cristalería, vajillas, sartenes y cubiertos en eventos y cocinas del club.",
        dosage: "Normal: 10 ml/L para limpieza diaria. | Grasa Pesada: 15 ml/L para sartenes y residuos difíciles.",
        dilution: "Dilución en agua: 1 litro rinde hasta 100 litros de solución útil (1:100).",
        phImpact: "pH Neutro (7.0) - Totalmente inofensivo para la piel y superficies delicadas.",
        safety: "Grado alimenticio certificado. Dermatológicamente seguro, biodegradable y libre de fosfatos.",
        badge: "Cero Efecto Gota / Rinde 1:100",
        image: "images/crystal.png"
      },
      {
        id: "grease",
        name: "Grease",
        tagline: "Quitacochambre definitivo en gel de máxima adherencia",
        description: "Limpiador quitacochambre súper activo formulado en gel de alta viscosidad para la remoción definitiva de grasa carbonizada en hornos, planchas, parrillas y freidoras. Su formato en gel permite una adherencia superior en superficies verticales, prolongando el tiempo de acción sin escurrimientos ni desperdicios.",
        benefits: [
          "Formato en gel autoadherente: Elimina los escurrimientos y el desperdicio de producto.",
          "Acción profunda y simultánea: Remueve al mismo tiempo capas superiores y profundas de grasa carbonizada extrema.",
          "Especializado para cocinas y banquetes: Ideal para hornos, planchas y parrillas de hierro o acero inoxidable.",
          "Rápida acción: Resultados contundentes y remoción fácil en un lapso de 5 a 30 minutos."
        ],
        usage: "Quitacochambre definitivo para hornos, planchas, freidoras y parrillas de hierro/acero inoxidable.",
        dosage: "Listo para usar. Se aplica directo con brocha sobre la superficie fría.",
        dilution: "Aplicación Directa (Gel Concentrado). No se diluye.",
        phImpact: "Altamente alcalino para romper y saponificar grasas carbonizadas.",
        safety: "Obligatorio el uso de guantes de hule. NO aplicar sobre superficies calientes ni sobre aluminio.",
        badge: "Gel Adherente Quitacochambre",
        image: "images/grease.png"
      },
      {
        id: "crystal_dwm",
        name: "Crystal DWM",
        tagline: "Detergente concentrado de espuma controlada para lavalozas industriales",
        description: "Detergente líquido de espuma controlada de alta concentración, diseñado especialmente para máquinas lavalozas industriales de alta demanda. Asegura una limpieza impecable y un brillo reluciente en cristalería, vajillas y cubiertos en restaurantes y áreas de banquetes del club.",
        benefits: [
          "Ultra concentrado y económico: Requiere solo de 8 ml a 12 ml por ciclo en equipos modernos.",
          "Espuma controlada: Diseñado especialmente para optimizar la acción mecánica de lavado dentro de la máquina.",
          "Doble ventaja operativa: Limpia impecablemente la loza y al mismo tiempo desincrusta el interior de la máquina (elimina calcificaciones).",
          "Eficiencia térmica: Actúa perfectamente a menos de 50 °C, evitando el uso forzoso de calderas y reduciendo el consumo energético."
        ],
        usage: "Detergente de lavado automático para máquinas lavaloza en banquetes y restaurantes.",
        dosage: "Dosificación automática o manual de 8 ml a 12 ml de producto por cada ciclo de lavado.",
        dilution: "Inyección automatizada directa al ciclo de lavado de la máquina.",
        phImpact: "Alcalino desincrustante controlado, estable frente a aguas duras.",
        safety: "Evitar contacto directo con la piel y ojos. Diseñado exclusivamente para uso automático mecánico en lavalozas.",
        badge: "Doble Acción & Ahorro Energético",
        image: "images/crystal_dwm.png"
      },
      {
        id: "hand_soap_gastronomia",
        name: "Swipe Hand Soap",
        tagline: "Jabón líquido germicida antibacterial e inoloro para cocinas y áreas de alimentos",
        description: "Swipe Hand Soap es el jabón líquido germicida y antibacterial de alto desempeño, formulado específicamente para la higiene rigurosa del personal en las áreas de preparación de alimentos y cocinas del club. Al ser 100% libre de fragancias y colorantes (incoloro e inoloro), asegura una desinfección total de manos sin riesgo de contaminación cruzada ni alteración de los aromas y sabores de los platillos.",
        benefits: [
          "Inocuidad Alimentaria Total: 100% libre de fragancias y colorantes artificiales para evitar cualquier tipo de transferencia de olores a los alimentos preparados.",
          "Poderoso Efecto Germicida: Elimina de manera inmediata bacterias y hongos patógenos comunes en cocinas como Salmonella, E. coli y S. aureus.",
          "Protección e Hidratación de la Piel: pH balanceado (5.0 a 6.0) idóneo para la piel humana que evita la irritación y resequedad por el lavado continuo exigido al personal de cocina del club.",
          "Rendimiento y Asepsia Rigurosa: Apto para despachadores automáticos, asegurando una dosificación exacta y control de insumos inigualable."
        ],
        usage: "Lavado e higiene profunda de manos de chefs, cocineros, auxiliares, meseros y personal del área de alimentos.",
        dosage: "Uso concentrado directo sin diluir mediante despachadores de jabón SWIPE (1.5 ml por descarga).",
        dilution: "Aplicar directo una dosis en las manos, frotar firmemente palmas, dedos, uñas y antebrazos durante 40-60 segundos, y enjuagar con abundante agua.",
        phImpact: "pH balanceado de 5.0 a 6.0 en armonía con la piel humana.",
        safety: "Dermatológicamente probado y seguro para áreas de alimentos. Evitar contacto con los ojos. Uso externo.",
        badge: "Inodoro y Grado Alimenticio",
        image: "images/hand_soap.png"
      },
      {
        id: "freezer_cleaner",
        name: "Freezer Cleaner",
        tagline: "Limpiador desengrasante para congeladores y cámaras frías",
        description: "Limpiador especializado de alto rendimiento diseñado para operar en temperaturas de congelación extremas de hasta -55 °C. Permite realizar la limpieza profunda y el desengrase de cámaras de congelación y cuartos fríos sin apagar los equipos, garantizando que nunca se rompa la cadena de frío.",
        benefits: [
          "Limpieza en frío extremo: Evita el apagado de equipos y el deshielo, ahorrando energía y tiempo.",
          "Preservación de la cadena de frío: Protege la integridad y sanidad de los alimentos almacenados.",
          "Fórmula de rápida acción: Desengrasar y limpia a fondo depósitos difíciles y suciedad congelada.",
          "Seguridad operativa: No inflamable, biodegradable y totalmente inofensivo para metales."
        ],
        usage: "Limpieza profunda de cámaras de congelación extrema, cuartos fríos de almacenamiento y refrigeradores comerciales.",
        dosage: "Uso concentrado para frío extremo (-55 °C) | Solución 1:1 para frío regular (-20 °C) | Solución 1:5 para refrigeradores (-6 °C).",
        dilution: "Uso Concentrado (-55 °C): Aplicación directa. | Solución 1:1 (-20 °C): 1 parte de producto por 1 de agua. | Solución 1:5 (-6 °C): 1 parte de producto por 5 de agua.",
        phImpact: "Alcalinidad balanceada, formulado para no dañar serpentines ni superficies metálicas.",
        safety: "Seguro de aplicar en frío. Utilizar el equipo de protección adecuado para áreas congeladas. Evitar contacto con los ojos.",
        badge: "Frío Extremo hasta -55 °C",
        image: "images/freezer_cleaner.png"
      }
    ]
  },
  mantenimiento: {
    title: "Mantenimiento General",
    accentColor: "var(--color-mantenimiento)",
    slogan: "Cuidado impecable y preservación duradera para cada rincón de las exclusivas instalaciones del club.",
    products: [
      {
        id: "swipe_concentrate",
        name: "Swipe Limpiador Líquido Concentrado",
        tagline: "Desengrasante y limpiador industrial multiusos concentrado",
        description: "Swipe Limpiador Concentrado es la solución industrial definitiva para el mantenimiento general de las instalaciones del club. Su fórmula súper concentrada con una biodegradabilidad superior al 99% remueve con facilidad grasas pesadas, aceites y hollín en talleres, vialidades y motores. Su versatilidad permite diluciones a la medida, adaptándose a restregadoras automáticas (versión Low Foam) y protegiendo las plantas de tratamiento de agua del club (versión pH Neutro).",
        benefits: [
          "Versatilidad Industrial Total: Solución Liviana (1:100) para vidrios y cromos, Normal (1:12) para andadores y vehículos, y Pesada (1:4) para motores y talleres.",
          "Especial para Equipamiento Automático: Disponible en versión Low Foam (baja espuma) diseñada específicamente para máquinas restregadoras de pisos del club.",
          "Protección Ambiental: 100% biodegradable (>99%), libre de fosfatos. Disponible en versión pH Neutro (pH 7) para cuidar las plantas tratadoras.",
          "Seguro y no Corrosivo: Fórmula sin cáusticos libres que no daña la piel del personal de limpieza ni corroe metales, plásticos o acabados del club."
        ],
        usage: "Lavado de motores, desengrase de pisos de talleres, andadores de piedra, mantenimiento estético general de áreas comunes del club.",
        dosage: "Mantenimiento diario (1:100) | Limpieza operativa (1:12) | Desengrase pesado (1:4).",
        dilution: "Diluir en agua. Aplicar por rociado, hidrolavadora, mopa o restregadora, tallar y enjuagar.",
        phImpact: "pH Neutro (pH 7.0) disponible para salvaguardar las plantas de tratamiento de aguas residuales.",
        safety: "No tóxico, no inflamable, sin cáusticos libres. Seguro para la piel y metales.",
        badge: "Desengrasante Multiusos",
        image: "images/swipe_concentrado.png"
      },
      {
        id: "swipol_mantenimiento",
        name: "Swipol",
        tagline: "Desinfectante y germicida multiusos de grado quirúrgico para el club",
        description: "Swipol es el desinfectante y germicida de grado quirúrgico y alimenticio definitivo para la bioseguridad profunda de las instalaciones generales del club. Su formulación a base de cuaternarios de amonio de quinta generación elimina al 99.999% bacterias, virus y hongos en lobbys, pasillos, oficinas de administración, salones de eventos, baños generales y áreas de atención al socio, garantizando una higiene integral y discreta en cada rincón del club.",
        benefits: [
          "Bioseguridad Total Multiusos: Elimina eficazmente bacterias, virus y hongos en todas las superficies comunes como pisos, paredes, bancas, manijas y mostradores de recepción.",
          "Discreción Absoluta: Fórmula de grado quirúrgico 100% incolora e inodora. No deja olor químico en salones, lobbys ni oficinas, preservando la experiencia premium del socio.",
          "Alta Tolerancia Operativa: Estabilidad química y eficacia constante frente a aguas duras, variaciones de temperatura y superficies de alto tráfico.",
          "Seguridad para Personal y Socios: Compuesto de cuaternario de amonio de quinta generación, dermatológicamente seguro y sin vapores irritantes para el personal de limpieza.",
          "Prevención de Infecciones Cruzadas: Protección activa en baños generales, áreas de recepción, pasillos de tránsito y zonas de atención médica del club."
        ],
        usage: "Desinfección de lobbys, pasillos, oficinas de administración, baños generales, salones de eventos y áreas comunes de atención al socio.",
        dosage: "Limpieza de rutina (1:200) para superficies de alto tráfico | Desinfección profunda (1:100) para baños y áreas de contacto frecuente.",
        dilution: "Diluir en agua. Rociar o trapear sobre la superficie, dejar actuar de 2 a 5 minutos. No requiere enjuague en diluciones de mantenimiento.",
        phImpact: "Completamente neutro (pH 7.0), no deja residuos ni altera los acabados de pisos ni superficies.",
        safety: "No irritante para la piel en dilución recomendada. Totalmente incoloro e inodoro.",
        badge: "Desinfectante Multiusos",
        image: "images/swipol.png"
      },

      {
        id: "rust_off",
        name: "Swipe Rust Off",
        tagline: "Desincrustante ácido industrial con inhibidores de corrosión",
        description: "Poderoso desincrustante industrial de tipo ácido, totalmente biodegradable, formulado con inhibidores de corrosión activos. Elimina de manera efectiva carbonatos de calcio y magnesio (sarro) adheridos a calderas, tuberías y maquinaria pesada, además de remover óxido, concreto y grasas incrustadas.",
        benefits: [
          "Inhibidores de corrosión: Protege las piezas metálicas activamente durante el proceso de desincrustación.",
          "Acción antioxidante: Contiene agentes que evitan que las piezas tratadas vuelvan a oxidarse rápidamente.",
          "Fórmula 100% biodegradable: Seguro para tuberías y sistemas del club una vez neutralizado y enjuagado.",
          "Remoción de sarro y concreto: Elimina incrustaciones gruesas de calcio, magnesio y restos de obra civil."
        ],
        usage: "Eliminación de sarro en calderas/tuberías, remoción de óxido en metales y sarro/grasa animal extrema en cocinas.",
        dosage: "Mantenimiento Normal (1:10) | Uso Pesado (Concentrado o dilución fuerte) según nivel de incrustación.",
        dilution: "Mantenimiento Normal (1:10): 1 parte de producto por 10 partes de agua. Uso Pesado: aplicar directo. Rociar, dejar actuar 10-15 minutos y después enjuagar (apoyarse con una fibra verde SWIPE si es necesario).",
        phImpact: "Ácido activo desincrustante (requiere enjuague completo).",
        safety: "NUNCA mezclar con cloro ni con ningún otro producto. Obligatorio utilizar guantes de hule, goggles de protección y trabajar en áreas ventiladas.",
        badge: "Desincrustante & Antioxidante",
        image: "images/rust_off.png"
      },
      {
        id: "alubrite",
        name: "Swipe Alubrite",
        tagline: "Abrillantador y limpiador desincrustante de base ácida para aluminio y acero",
        description: "Abrillantador y desincrustante altamente eficiente de base ácida diseñado para restaurar el brillo original en superficies de aluminio y acero inoxidable. Penetra la suciedad y elimina los óxidos blancos protectores sin dañar la pintura ni calcomanías.",
        benefits: [
          "Restauración total: Elimina óxidos blancos y opacidad devolviendo el brillo original de fábrica.",
          "Fórmula espumosa: Crea una capa de espuma fina y densa que se adhiere y penetra en el metal.",
          "Protección de acabados: No daña la pintura ni las calcomanías decorativas de los vehículos.",
          "Rápida acción: Remueve suciedad adherida actuando en un periodo de 3 a 5 minutos."
        ],
        usage: "Limpieza y abrillantado de cancelería, puertas de aluminio, escaleras de albercas y rines de rines de carros de golf.",
        dosage: "Dilución activa de 1:10 a 1:20 según la severidad de la incrustación.",
        dilution: "Se diluye 1 parte de producto por 10 a 20 partes de agua. Aplicar de abajo hacia arriba, dejar actuar entre 3 y 5 minutos, y enjuagar inmediatamente con abundante agua para evitar marcas.",
        phImpact: "Ácido fluorhídrico altamente activo.",
        safety: "QUÍMICO TÓXICO Y ALTAMENTE CORROSIVO (Contiene Ácido Fluorhídrico). Obligatorio el uso de goggles, guantes de neopreno y mandil especial para ácidos. No usar sobre aluminio anodizado ni metales no ferrosos distintos al aluminio. NUNCA mezclar con cloro.",
        badge: "Abrillantador & Restaurador",
        image: "images/alubrite.png"
      },
      {
        id: "steelbrite",
        name: "Swipe Steelbrite",
        tagline: "Abrillantador y desincrustante de grado alimentario para acero inoxidable",
        description: "Poderosa fórmula de grado alimenticio diseñada específicamente para eliminar incrustaciones de sales minerales (sarro) y grasas pesadas en todas las superficies de acero inoxidable del club. Está formulado con inhibidores de corrosión que protegen las valiosas piezas metálicas de la acción de los ácidos.",
        benefits: [
          "Grado Alimenticio: Perfecto para campanas, mesas de trabajo, ollas y equipos de cocina industrial.",
          "Inhibidores de corrosión: Protege las valiosas piezas metálicas de la acción ácida durante la desincrustación.",
          "Restauración total: Diseñado para eliminar de manera efectiva sarro y grasas pesadas acumuladas.",
          "Brillo espejo seguro: Devuelve el acabado brillante de fábrica aplicando exclusivamente con fibra blanca suave."
        ],
        usage: "Limpieza y desincrustación de sarro/grasa en campanas, mesas de trabajo, ollas, herramientas y cuartos fríos.",
        dosage: "Se utiliza diluido en una proporción de 1:5 a 1:10 partes de agua, dependiendo de qué tan severas sean las incrustaciones.",
        dilution: "Dilución 1:5 a 1:10 en agua. Aplicar obligatoriamente con una fibra blanca (suave), evitando estrictamente fibras verdes o negras que puedan rayar el acero.",
        phImpact: "Ácido protector controlado.",
        safety: "NUNCA mezclar con cloro bajo ninguna circunstancia. El personal debe utilizar guantes de hule y lentes de seguridad durante su manejo en áreas bien ventiladas.",
        badge: "Grado Alimenticio & Protector",
        image: "images/steelbrite.png"
      },
      {
        id: "sure_thing",
        name: "Swipe Sure Thing",
        tagline: "Desodorante, aromatizante y desinfectante ambiental biodegradable",
        description: "Líquido altamente concentrado que funciona como desodorante y desinfectante de ambiente biodegradable de acción neutralizadora absoluta. Elimina olores de raíz de origen orgánico (tabaco, humedad, comida) en vez de solo enmascararlos.",
        benefits: [
          "Neutralización real: Contiene degradadores de materia orgánica y agentes germicidas activos.",
          "Sinergia Swipol: Único aromatizante compatible con Swipol que limpia, desinfecta y aromatiza en un solo paso.",
          "Variedad premium: Disponible en aromas menta, floral, canela y vainilla para salones de Casa Club.",
          "Gran rendimiento: Concentración extrema que rinde desde gotas puras hasta aspersión de amplias áreas."
        ],
        usage: "Aromatización, desinfección y desodorización en recepciones, oficinas, baños, comedores y salones.",
        dosage: "Uso Directo (Gotas puras) | Aspersión (30 a 60 gotas en medio litro de agua) según la necesidad.",
        dilution: "Directo: aplicar gotas en ceniceros/botes, o regular inserto. Aspersión: 30-60 gotas por 500 ml de agua en atomizador. Combinable con desinfectante Swipol.",
        phImpact: "Ligeramente alcalino (aromatizante activo).",
        safety: "Producto flamable. Almacenar adecuadamente alejado de fuentes de calor. Mantener envase bien cerrado.",
        badge: "Neutralizador Aromatizante",
        image: "images/sure_thing.png"
      },
      {
        id: "biodegreaser",
        name: "Swipe Biodegreaser",
        tagline: "Cultivo biológico premium para drenajes y trampas de grasa",
        description: "Mezcla natural, no tóxica y no corrosiva de microorganismos activos diseñada específicamente para desintegrar almidones, carbohidratos, grasas y aceites. Funciona como el tratamiento preventivo ideal para trampas de grasa y drenajes del club.",
        benefits: [
          "Fórmula biológica activa: Microorganismos que digieren grasas y aceites orgánicos de forma natural.",
          "Control de malos olores: Su uso diario continuo neutraliza de raíz los aromas desagradables del drenaje.",
          "Cero daño a tuberías: Composición biológica no corrosiva ni ácida que protege la infraestructura.",
          "Automatización sencilla: Compatible con el dosificador automático BIODEGREASER para inyección precisa."
        ],
        usage: "Tratamiento biológico preventivo y correctivo en trampas de grasa, tuberías, drenajes y fosas del club.",
        dosage: "Dosificación diaria de 200 ml por cada 500 litros de capacidad de la trampa o drenaje.",
        dilution: "Uso directo concentrado. Aplicar de noche o en un horario en donde la línea de drenaje o la trampa de grasa no se encuentre en uso.",
        phImpact: "Cercano a neutro (biodegradación bacteriana activa).",
        safety: "Cultivo biológico vivo. NUNCA mezclar con desinfectantes, cloro, ni productos ácidos o alcalinos, para evitar la inactivación celular.",
        badge: "Cultivo Biológico Activo",
        image: "images/biodegreaser.png"
      },
      {
        id: "hand_soap",
        name: "Swipe Hand Soap",
        tagline: "Jabón líquido germicida antimicrobial de grado alimenticio",
        description: "Jabón líquido germicida de alto desempeño formulado con pH balanceado y grado alimentario. Elimina de manera inmediata una amplia gama de bacterias, hongos y levaduras, asegurando la máxima asepsia en las manos del personal.",
        benefits: [
          "Grado Alimenticio: Indispensable para cocineros y personal de preparación de alimentos.",
          "Espectro antimicrobial: Elimina activamente bacterias y hongos como S. aureus, E. coli y Salmonella.",
          "pH Balanceado (5 a 6): En armonía con la química de la piel para evitar resequedad por lavado frecuente.",
          "Aromas e inocuidad: Disponible en aroma almendras/frutas, y versión sin fragancia ni color."
        ],
        usage: "Higiene y desinfección rigurosa de manos en cocinas, comedores, baños generales, consultorio médico y guardería.",
        dosage: "Uso concentrado directo sin diluir mediante despachadores de jabón SWIPE.",
        dilution: "Aplicar directo una dosis en las manos frotándolas firmemente durante 1 minuto, enjuagar posteriormente con abundante agua.",
        phImpact: "pH balanceado de 5.0 a 6.0 idóneo para la piel humana.",
        safety: "Uso externo exclusivamente. Evitar contacto con los ojos. Enjuagar bien después de frotar.",
        badge: "Antimicrobial & pH Balanceado",
        image: "images/hand_soap.png"
      }
    ]
  },
  ahorro: {
    title: "Ahorro & Ecología",
    accentColor: "var(--color-ahorro)",
    slogan: "Sustentabilidad financiera y ambiental para el Guadalajara Country Club con inyección de alta concentración.",
    products: [
      {
        id: "audit_service",
        name: "Valor Agregado",
        tagline: "Análisis y plan de optimización de presupuesto en sitio",
        description: "Estudio técnico personalizado para el Guadalajara Country Club. Analizamos tus procesos de limpieza actuales para proponer el sistema de diluciones Swipe adecuado, reduciendo costos drásticamente.",
        benefits: [
          "Disminución en costos de operación elevando la calidad de productos.",
          "Capacitación presencial al personal y entrega de guías de uso visuales.",
          "Manuales técnicos, físicos o digitales para procesos de limpieza."
        ],
        usage: "Estudio inicial de operaciones en sitio sin costo ni compromiso.",
        dosage: "Reunión técnica de diagnóstico de 2 horas en el Club.",
        dilution: "Personalizado por nuestro Ingeniero de Ventas Swipe.",
        phImpact: "No aplica.",
        safety: "Protocolo de visitas bajo estrictas normas de seguridad del club.",
        badge: "Servicio Sin Costo"
      }
    ]
  },
  demo: {
    title: "Demos & Pruebas en Sitio",
    accentColor: "var(--color-demo)",
    slogan: "Comprueba el rendimiento y resultados espectaculares de Swipe directamente en tus instalaciones.",
    products: [
      {
        id: "demo_cocina",
        name: "Demo: Desengrase Extremo",
        tagline: "Remoción de cochambre carbonizado en vivo",
        description: "Llevamos nuestro Super Degreaser Plus a tu cocina y lo probamos en tu campana, plancha o freidora más sucia. Observa cómo disuelve el cochambre más denso sin esfuerzo.",
        benefits: [
          "Demostración inmediata de la reducción de horas-hombre de tallado.",
          "Prueba de no corrosión en tu acero inoxidable de grado alimenticio.",
          "Entrega de muestra física para que tu personal continúe la prueba."
        ],
        usage: "Cocina caliente del restaurante principal o snack del club.",
        dosage: "Cuadrante de prueba de 50x50 cm aplicado en sitio.",
        dilution: "Dilución activa 1:3 a 1:5 según el nivel de cochambre.",
        phImpact: "Altamente alcalino, manejado por nuestro Ingeniero técnico.",
        safety: "Aplicación segura con equipo de protección industrial Swipe.",
        badge: "Prueba Sin Costo"
      }
    ]
  }
};
