const REGLAS_MOLECULAS = {
  H2O: {
    nombre: "Agua",
    tipo: "Molecular",
    tipoEnlace: "Covalente polar",
    geometria: "Angular",
    angulo: "104.5°",
    descripcion:
      "Molécula formada por dos átomos de hidrógeno y un átomo de oxígeno.",
    atomoCentral: "O",
    enlaces: [
      {
        entre: ["O", "H"],
        orden: 1,
        tipo: "Covalente simple",
      },
      {
        entre: ["O", "H"],
        orden: 1,
        tipo: "Covalente simple",
      },
    ],
  },

  CO2: {
    nombre: "Dióxido de carbono",
    tipo: "Molecular",
    tipoEnlace: "Covalente",
    geometria: "Lineal",
    angulo: "180°",
    descripcion:
      "Molécula formada por un átomo de carbono y dos átomos de oxígeno.",
    atomoCentral: "C",
    enlaces: [
      {
        entre: ["C", "O"],
        orden: 2,
        tipo: "Covalente doble",
      },
      {
        entre: ["C", "O"],
        orden: 2,
        tipo: "Covalente doble",
      },
    ],
  },

  CH4: {
    nombre: "Metano",
    tipo: "Molecular",
    tipoEnlace: "Covalente",
    geometria: "Tetraédrica",
    angulo: "109.5°",
    descripcion:
      "Molécula formada por un átomo de carbono y cuatro átomos de hidrógeno.",
    atomoCentral: "C",
    enlaces: [
      {
        entre: ["C", "H"],
        orden: 1,
        tipo: "Covalente simple",
      },
      {
        entre: ["C", "H"],
        orden: 1,
        tipo: "Covalente simple",
      },
      {
        entre: ["C", "H"],
        orden: 1,
        tipo: "Covalente simple",
      },
      {
        entre: ["C", "H"],
        orden: 1,
        tipo: "Covalente simple",
      },
    ],
  },

  NH3: {
    nombre: "Amoníaco",
    tipo: "Molecular",
    tipoEnlace: "Covalente polar",
    geometria: "Piramidal trigonal",
    angulo: "107°",
    descripcion:
      "Molécula formada por un átomo de nitrógeno y tres átomos de hidrógeno.",
    atomoCentral: "N",
    enlaces: [
      {
        entre: ["N", "H"],
        orden: 1,
        tipo: "Covalente simple",
      },
      {
        entre: ["N", "H"],
        orden: 1,
        tipo: "Covalente simple",
      },
      {
        entre: ["N", "H"],
        orden: 1,
        tipo: "Covalente simple",
      },
    ],
  },

  O2: {
    nombre: "Oxígeno molecular",
    tipo: "Molecular",
    tipoEnlace: "Covalente no polar",
    geometria: "Lineal",
    angulo: "180°",
    descripcion:
      "Molécula diatómica formada por dos átomos de oxígeno.",
    atomoCentral: null,
    enlaces: [
      {
        entre: ["O", "O"],
        orden: 2,
        tipo: "Covalente doble",
      },
    ],
  },

  N2: {
    nombre: "Nitrógeno molecular",
    tipo: "Molecular",
    tipoEnlace: "Covalente no polar",
    geometria: "Lineal",
    angulo: "180°",
    descripcion:
      "Molécula diatómica formada por dos átomos de nitrógeno.",
    atomoCentral: null,
    enlaces: [
      {
        entre: ["N", "N"],
        orden: 3,
        tipo: "Covalente triple",
      },
    ],
  },

  H2: {
    nombre: "Hidrógeno molecular",
    tipo: "Molecular",
    tipoEnlace: "Covalente no polar",
    geometria: "Lineal",
    angulo: "180°",
    descripcion:
      "Molécula diatómica formada por dos átomos de hidrógeno.",
    atomoCentral: null,
    enlaces: [
      {
        entre: ["H", "H"],
        orden: 1,
        tipo: "Covalente simple",
      },
    ],
  },

  HCl: {
    nombre: "Cloruro de hidrógeno",
    tipo: "Molecular",
    tipoEnlace: "Covalente polar",
    geometria: "Lineal",
    angulo: "180°",
    descripcion:
      "Molécula diatómica formada por hidrógeno y cloro.",
    atomoCentral: null,
    enlaces: [
      {
        entre: ["H", "Cl"],
        orden: 1,
        tipo: "Covalente simple",
      },
    ],
  },

  SO2: {
    nombre: "Dióxido de azufre",
    tipo: "Molecular",
    tipoEnlace: "Covalente polar",
    geometria: "Angular",
    angulo: "≈119°",
    descripcion:
      "Molécula formada por un átomo de azufre y dos átomos de oxígeno.",
    atomoCentral: "S",
    enlaces: [
      {
        entre: ["S", "O"],
        orden: 2,
        tipo: "Covalente",
      },
      {
        entre: ["S", "O"],
        orden: 2,
        tipo: "Covalente",
      },
    ],
  },

  SO3: {
    nombre: "Trióxido de azufre",
    tipo: "Molecular",
    tipoEnlace: "Covalente",
    geometria: "Trigonal plana",
    angulo: "120°",
    descripcion:
      "Molécula formada por un átomo de azufre y tres átomos de oxígeno.",
    atomoCentral: "S",
    enlaces: [
      {
        entre: ["S", "O"],
        orden: 2,
        tipo: "Covalente",
      },
      {
        entre: ["S", "O"],
        orden: 2,
        tipo: "Covalente",
      },
      {
        entre: ["S", "O"],
        orden: 2,
        tipo: "Covalente",
      },
    ],
  },

  BF3: {
    nombre: "Trifluoruro de boro",
    tipo: "Molecular",
    tipoEnlace: "Covalente",
    geometria: "Trigonal plana",
    angulo: "120°",
    descripcion:
      "Molécula formada por un átomo de boro y tres átomos de flúor.",
    atomoCentral: "B",
    enlaces: [
      {
        entre: ["B", "F"],
        orden: 1,
        tipo: "Covalente simple",
      },
      {
        entre: ["B", "F"],
        orden: 1,
        tipo: "Covalente simple",
      },
      {
        entre: ["B", "F"],
        orden: 1,
        tipo: "Covalente simple",
      },
    ],
  },

  CCl4: {
    nombre: "Tetracloruro de carbono",
    tipo: "Molecular",
    tipoEnlace: "Covalente",
    geometria: "Tetraédrica",
    angulo: "109.5°",
    descripcion:
      "Molécula formada por un átomo de carbono y cuatro átomos de cloro.",
    atomoCentral: "C",
    enlaces: [
      {
        entre: ["C", "Cl"],
        orden: 1,
        tipo: "Covalente simple",
      },
      {
        entre: ["C", "Cl"],
        orden: 1,
        tipo: "Covalente simple",
      },
      {
        entre: ["C", "Cl"],
        orden: 1,
        tipo: "Covalente simple",
      },
      {
        entre: ["C", "Cl"],
        orden: 1,
        tipo: "Covalente simple",
      },
    ],
  },
};


/*
 * =====================================================
 * OBTENER FÓRMULA CANÓNICA
 * =====================================================
 */

export function obtenerFormula(atomos) {
  if (!atomos || atomos.length === 0) {
    return "";
  }

  return atomos
    .filter((atomo) => atomo.cantidad > 0)
    .map(
      (atomo) =>
        `${atomo.simbolo}${atomo.cantidad > 1 ? atomo.cantidad : ""}`
    )
    .join("");
}


/*
 * =====================================================
 * OBTENER FÓRMULA NORMALIZADA
 *
 * Permite reconocer:
 *
 * H + H + O
 * O + H + H
 * H + O + H
 *
 * como H2O.
 * =====================================================
 */

export function obtenerFormulaNormalizada(atomos) {
  if (!atomos || atomos.length === 0) {
    return "";
  }

  const partes = atomos
    .filter((atomo) => atomo.cantidad > 0)
    .map((atomo) => ({
      simbolo: atomo.simbolo,
      cantidad: atomo.cantidad,
    }));

  const ordenPreferente = [
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
  ];

  partes.sort((a, b) => {
    const posicionA =
      ordenPreferente.indexOf(a.simbolo);

    const posicionB =
      ordenPreferente.indexOf(b.simbolo);

    if (
      posicionA !== -1 &&
      posicionB !== -1
    ) {
      return posicionA - posicionB;
    }

    if (
      posicionA !== -1 &&
      posicionB === -1
    ) {
      return -1;
    }

    if (
      posicionA === -1 &&
      posicionB !== -1
    ) {
      return 1;
    }

    return a.simbolo.localeCompare(
      b.simbolo
    );
  });

  return partes
    .map(
      (parte) =>
        `${parte.simbolo}${
          parte.cantidad > 1
            ? parte.cantidad
            : ""
        }`
    )
    .join("");
}


/*
 * =====================================================
 * BUSCAR REGLA DE LA MOLÉCULA
 * =====================================================
 */

export function obtenerReglaMolecular(atomos) {
  const formula =
    obtenerFormulaNormalizada(atomos);

  return REGLAS_MOLECULAS[formula] || null;
}


/*
 * =====================================================
 * ANALIZAR MOLÉCULA
 * =====================================================
 */

export function analizarMolecula(atomos) {
  if (!atomos || atomos.length === 0) {
    return {
      reconocida: false,
      formula: "",
      nombre: "Sin molécula",
      tipo: "—",
      tipoEnlace: "—",
      geometria: "—",
      angulo: "—",
      descripcion:
        "Agrega elementos para comenzar a construir una molécula.",
      atomoCentral: null,
      enlaces: [],
    };
  }

  const formula =
    obtenerFormulaNormalizada(atomos);

  const regla =
    REGLAS_MOLECULAS[formula];

  if (!regla) {
    return {
      reconocida: false,
      formula,
      nombre: "Combinación no registrada",
      tipo: "Por determinar",
      tipoEnlace: "Por determinar",
      geometria: "Por determinar",
      angulo: "—",
      descripcion:
        "Esta combinación todavía no tiene una regla química definida en el motor.",
      atomoCentral: null,
      enlaces: [],
    };
  }

  return {
    reconocida: true,
    formula,
    ...regla,
  };
}


/*
 * =====================================================
 * EXPORTAR TODAS LAS REGLAS
 * =====================================================
 */

export default REGLAS_MOLECULAS;