// ============================================================
// REGLAS PARA ESTRUCTURAS DE LEWIS
// Laboratorio Virtual de Química
// ============================================================

// Electrones de valencia de los elementos más utilizados
const ELECTRONES_VALENCIA = {
  H: 1,

  B: 3,
  C: 4,
  N: 5,
  O: 6,
  F: 7,

  P: 5,
  S: 6,
  Cl: 7,

  Br: 7,
  I: 7,

  Na: 1,
  Mg: 2,
  K: 1,
  Ca: 2,

  Al: 3,

  Fe: 2,
  Cu: 1,
  Zn: 2,
};

// ------------------------------------------------------------
// Obtener electrones de valencia
// ------------------------------------------------------------

export function obtenerElectronesValencia(simbolo) {
  return ELECTRONES_VALENCIA[simbolo] ?? 0;
}

// ------------------------------------------------------------
// Contar electrones de valencia de una molécula
// ------------------------------------------------------------

export function contarElectronesValencia(atomos) {
  return atomos.reduce((total, atomo) => {
    const electrones = obtenerElectronesValencia(atomo.simbolo);

    return total + electrones * (atomo.cantidad || 1);
  }, 0);
}

// ------------------------------------------------------------
// Contar átomos de cada elemento
// ------------------------------------------------------------

export function contarAtomos(atomos) {
  const resultado = {};

  atomos.forEach((atomo) => {
    resultado[atomo.simbolo] =
      (resultado[atomo.simbolo] || 0) + (atomo.cantidad || 1);
  });

  return resultado;
}

// ------------------------------------------------------------
// Reglas de Lewis para moléculas conocidas
// ------------------------------------------------------------

const REGLAS_LEWIS = {
  H2O: {
    formula: "H2O",
    atomoCentral: "O",

    enlaces: [
      {
        entre: ["O", "H"],
        orden: 1,
      },
      {
        entre: ["O", "H"],
        orden: 1,
      },
    ],

    paresLibres: {
      O: 2,
    },

    electronesValencia: 8,

    descripcion:
      "El oxígeno es el átomo central. Forma dos enlaces simples con los hidrógenos y conserva dos pares de electrones libres.",
  },

  CO2: {
    formula: "CO2",
    atomoCentral: "C",

    enlaces: [
      {
        entre: ["C", "O"],
        orden: 2,
      },
      {
        entre: ["C", "O"],
        orden: 2,
      },
    ],

    paresLibres: {
      O: 2,
    },

    electronesValencia: 16,

    descripcion:
      "El carbono es el átomo central y forma un doble enlace con cada oxígeno. Cada oxígeno conserva dos pares de electrones libres.",
  },

  CH4: {
    formula: "CH4",
    atomoCentral: "C",

    enlaces: [
      {
        entre: ["C", "H"],
        orden: 1,
      },
      {
        entre: ["C", "H"],
        orden: 1,
      },
      {
        entre: ["C", "H"],
        orden: 1,
      },
      {
        entre: ["C", "H"],
        orden: 1,
      },
    ],

    paresLibres: {},

    electronesValencia: 8,

    descripcion:
      "El carbono forma cuatro enlaces simples con los hidrógenos y no presenta pares de electrones libres.",
  },

  NH3: {
    formula: "NH3",
    atomoCentral: "N",

    enlaces: [
      {
        entre: ["N", "H"],
        orden: 1,
      },
      {
        entre: ["N", "H"],
        orden: 1,
      },
      {
        entre: ["N", "H"],
        orden: 1,
      },
    ],

    paresLibres: {
      N: 1,
    },

    electronesValencia: 8,

    descripcion:
      "El nitrógeno forma tres enlaces simples con los hidrógenos y conserva un par de electrones libres.",
  },

  O2: {
    formula: "O2",
    atomoCentral: null,

    enlaces: [
      {
        entre: ["O", "O"],
        orden: 2,
      },
    ],

    paresLibres: {
      O: 2,
    },

    electronesValencia: 12,

    descripcion:
      "Los dos átomos de oxígeno comparten dos pares de electrones formando un doble enlace. Cada oxígeno conserva dos pares libres.",
  },

  N2: {
    formula: "N2",
    atomoCentral: null,

    enlaces: [
      {
        entre: ["N", "N"],
        orden: 3,
      },
    ],

    paresLibres: {
      N: 1,
    },

    electronesValencia: 10,

    descripcion:
      "Los dos átomos de nitrógeno comparten tres pares de electrones formando un triple enlace. Cada nitrógeno conserva un par libre.",
  },

  H2: {
    formula: "H2",
    atomoCentral: null,

    enlaces: [
      {
        entre: ["H", "H"],
        orden: 1,
      },
    ],

    paresLibres: {},

    electronesValencia: 2,

    descripcion:
      "Los dos átomos de hidrógeno comparten un par de electrones formando un enlace simple.",
  },

  HCl: {
    formula: "HCl",
    atomoCentral: null,

    enlaces: [
      {
        entre: ["H", "Cl"],
        orden: 1,
      },
    ],

    paresLibres: {
      Cl: 3,
    },

    electronesValencia: 8,

    descripcion:
      "El hidrógeno y el cloro comparten un par de electrones. El cloro conserva tres pares de electrones libres.",
  },

  SO2: {
    formula: "SO2",
    atomoCentral: "S",

    enlaces: [
      {
        entre: ["S", "O"],
        orden: 2,
      },
      {
        entre: ["S", "O"],
        orden: 2,
      },
    ],

    paresLibres: {
      S: 1,
      O: 2,
    },

    electronesValencia: 18,

    descripcion:
      "El azufre es el átomo central. La representación utilizada emplea dos enlaces dobles con los oxígenos.",
  },

  SO3: {
    formula: "SO3",
    atomoCentral: "S",

    enlaces: [
      {
        entre: ["S", "O"],
        orden: 2,
      },
      {
        entre: ["S", "O"],
        orden: 2,
      },
      {
        entre: ["S", "O"],
        orden: 2,
      },
    ],

    paresLibres: {
      O: 2,
    },

    electronesValencia: 24,

    descripcion:
      "El azufre es el átomo central y se representa unido mediante enlaces dobles a los tres oxígenos.",
  },

  BF3: {
    formula: "BF3",
    atomoCentral: "B",

    enlaces: [
      {
        entre: ["B", "F"],
        orden: 1,
      },
      {
        entre: ["B", "F"],
        orden: 1,
      },
      {
        entre: ["B", "F"],
        orden: 1,
      },
    ],

    paresLibres: {
      F: 3,
    },

    electronesValencia: 24,

    descripcion:
      "El boro es el átomo central y forma tres enlaces simples con los átomos de flúor. Cada flúor conserva tres pares de electrones libres.",
  },

  CCl4: {
    formula: "CCl4",
    atomoCentral: "C",

    enlaces: [
      {
        entre: ["C", "Cl"],
        orden: 1,
      },
      {
        entre: ["C", "Cl"],
        orden: 1,
      },
      {
        entre: ["C", "Cl"],
        orden: 1,
      },
      {
        entre: ["C", "Cl"],
        orden: 1,
      },
    ],

    paresLibres: {
      Cl: 3,
    },

    electronesValencia: 32,

    descripcion:
      "El carbono forma cuatro enlaces simples con los átomos de cloro. Cada cloro conserva tres pares de electrones libres.",
  },
};

// ------------------------------------------------------------
// Normalizar fórmula
// ------------------------------------------------------------

function normalizarFormula(formula) {
  if (!formula) return "";

  return formula
    .replace(/₀/g, "0")
    .replace(/₁/g, "1")
    .replace(/₂/g, "2")
    .replace(/₃/g, "3")
    .replace(/₄/g, "4")
    .replace(/₅/g, "5")
    .replace(/₆/g, "6")
    .replace(/₇/g, "7")
    .replace(/₈/g, "8")
    .replace(/₉/g, "9");
}

// ------------------------------------------------------------
// Obtener fórmula a partir de los átomos
// ------------------------------------------------------------

export function obtenerFormulaLewis(atomos) {
  if (!atomos || atomos.length === 0) {
    return "";
  }

  const cantidades = contarAtomos(atomos);

  const prioridad = [
    "C",
    "H",
    "N",
    "O",
    "F",
    "P",
    "S",
    "Cl",
    "Br",
    "I",
    "B",
    "Na",
    "Mg",
    "Al",
    "K",
    "Ca",
    "Fe",
    "Cu",
    "Zn",
  ];

  const simbolos = Object.keys(cantidades).sort((a, b) => {
    const posicionA = prioridad.indexOf(a);
    const posicionB = prioridad.indexOf(b);

    if (posicionA === -1 && posicionB === -1) {
      return a.localeCompare(b);
    }

    if (posicionA === -1) return 1;
    if (posicionB === -1) return -1;

    return posicionA - posicionB;
  });

  return simbolos
    .map((simbolo) => {
      const cantidad = cantidades[simbolo];

      return cantidad === 1
        ? simbolo
        : `${simbolo}${cantidad}`;
    })
    .join("");
}

// ------------------------------------------------------------
// Buscar regla por composición
// ------------------------------------------------------------

export function obtenerReglaLewis(atomos) {
  if (!atomos || atomos.length === 0) {
    return null;
  }

  const formula = obtenerFormulaLewis(atomos);

  const reglaDirecta = REGLAS_LEWIS[formula];

  if (reglaDirecta) {
    return reglaDirecta;
  }

  // Comparación independiente del orden en que fueron agregados
  const cantidades = contarAtomos(atomos);

  const coincideComposicion = Object.values(REGLAS_LEWIS).find(
    (regla) => {
      const cantidadesRegla = obtenerCantidadesFormula(
        regla.formula
      );

      return compararCantidades(
        cantidades,
        cantidadesRegla
      );
    }
  );

  return coincideComposicion || null;
}

// ------------------------------------------------------------
// Convertir fórmula a cantidades
// ------------------------------------------------------------

function obtenerCantidadesFormula(formula) {
  const cantidades = {};

  const coincidencias = normalizarFormula(formula).matchAll(
    /([A-Z][a-z]?)(\d*)/g
  );

  for (const coincidencia of coincidencias) {
    const simbolo = coincidencia[1];
    const cantidad = coincidencia[2]
      ? Number(coincidencia[2])
      : 1;

    cantidades[simbolo] =
      (cantidades[simbolo] || 0) + cantidad;
  }

  return cantidades;
}

// ------------------------------------------------------------
// Comparar composición
// ------------------------------------------------------------

function compararCantidades(a, b) {
  const clavesA = Object.keys(a).sort();
  const clavesB = Object.keys(b).sort();

  if (clavesA.length !== clavesB.length) {
    return false;
  }

  return clavesA.every(
    (clave) => a[clave] === b[clave]
  );
}

// ------------------------------------------------------------
// Obtener información completa de Lewis
// ------------------------------------------------------------

export function analizarLewis(atomos) {
  if (!atomos || atomos.length === 0) {
    return {
      formula: "",
      reconocida: false,
      electronesValencia: 0,
      atomoCentral: null,
      enlaces: [],
      paresLibres: {},
      descripcion:
        "Agrega átomos para construir una molécula.",
    };
  }

  const formula = obtenerFormulaLewis(atomos);

  const regla = obtenerReglaLewis(atomos);

  if (!regla) {
    return {
      formula,
      reconocida: false,
      electronesValencia:
        contarElectronesValencia(atomos),
      atomoCentral: null,
      enlaces: [],
      paresLibres: {},
      descripcion:
        "Esta combinación todavía no tiene una estructura de Lewis registrada en el laboratorio.",
    };
  }

  return {
    ...regla,
    formula: regla.formula,
    reconocida: true,
  };
}

// ------------------------------------------------------------
// Obtener pares de electrones libres de un átomo
// ------------------------------------------------------------

export function obtenerParesLibres(
  simbolo,
  atomos
) {
  const analisis = analizarLewis(atomos);

  return analisis.paresLibres?.[simbolo] || 0;
}

// ------------------------------------------------------------
// Obtener electrones de valencia de toda la molécula
// ------------------------------------------------------------

export function obtenerTotalElectronesValencia(atomos) {
  const analisis = analizarLewis(atomos);

  if (analisis.reconocida) {
    return analisis.electronesValencia;
  }

  return contarElectronesValencia(atomos);
}

// ------------------------------------------------------------
// Exportación por defecto
// ------------------------------------------------------------

export default REGLAS_LEWIS;