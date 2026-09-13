import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./Molecula3D.css";

/*
 * ============================================================
 * CONFIGURACIÓN VISUAL DE LOS ÁTOMOS
 * ============================================================
 */

const CONFIG_ATOMOS = {
  H: {
    color: 0xffffff,
    radio: 0.48,
  },

  C: {
    color: 0x333333,
    radio: 0.72,
  },

  N: {
    color: 0x3155d9,
    radio: 0.68,
  },

  O: {
    color: 0xe53935,
    radio: 0.65,
  },

  F: {
    color: 0x66bb6a,
    radio: 0.62,
  },

  Cl: {
    color: 0x43a047,
    radio: 0.68,
  },

  Br: {
    color: 0x8d4a32,
    radio: 0.72,
  },

  I: {
    color: 0x7e57c2,
    radio: 0.78,
  },

  S: {
    color: 0xf4c430,
    radio: 0.75,
  },

  P: {
    color: 0xff9800,
    radio: 0.74,
  },

  Na: {
    color: 0x9e9e9e,
    radio: 0.72,
  },

  Mg: {
    color: 0x78909c,
    radio: 0.72,
  },

  Ca: {
    color: 0x9e9e9e,
    radio: 0.78,
  },

  Fe: {
    color: 0x8d6e63,
    radio: 0.76,
  },

  Cu: {
    color: 0xb87333,
    radio: 0.76,
  },

  Zn: {
    color: 0x90a4ae,
    radio: 0.74,
  },
};

const CONFIG_DEFECTO = {
  color: 0x607d8b,
  radio: 0.68,
};

function obtenerConfiguracion(simbolo) {
  return CONFIG_ATOMOS[simbolo] || CONFIG_DEFECTO;
}


/*
 * ============================================================
 * CREAR ÁTOMO
 * ============================================================
 */

function crearEsferaAtomica(simbolo) {
  const configuracion = obtenerConfiguracion(simbolo);

  const geometria = new THREE.SphereGeometry(
    configuracion.radio,
    32,
    32
  );

  const material = new THREE.MeshStandardMaterial({
    color: configuracion.color,
    roughness: 0.35,
    metalness: 0.05,
  });

  const esfera = new THREE.Mesh(
    geometria,
    material
  );

  return esfera;
}


/*
 * ============================================================
 * CREAR UN CILINDRO DE ENLACE
 * ============================================================
 */

function crearCilindroEnlace(
  posicionA,
  posicionB,
  desplazamiento = 0
) {
  const inicio = posicionA.clone();
  const final = posicionB.clone();

  /*
   * Dirección del enlace
   */
  const direccion = new THREE.Vector3()
    .subVectors(final, inicio)
    .normalize();

  /*
   * Elegimos una referencia para calcular un vector
   * perpendicular al enlace.
   *
   * La cámara observa principalmente desde el eje Z.
   * Por eso usamos Z como referencia cuando es posible.
   * Esto hace que los enlaces dobles y triples sean
   * visibles en pantalla.
   */
  let referencia = new THREE.Vector3(
    0,
    0,
    1
  );

  /*
   * Si el enlace está alineado con Z, utilizamos Y
   * como referencia para evitar un vector nulo.
   */
  if (
    Math.abs(
      direccion.dot(referencia)
    ) > 0.9
  ) {
    referencia.set(
      0,
      1,
      0
    );
  }

  /*
   * Vector perpendicular al enlace.
   */
  const perpendicular =
    new THREE.Vector3()
      .crossVectors(
        direccion,
        referencia
      )
      .normalize();

  /*
   * Desplazamos los cilindros en paralelo,
   * manteniendo su dirección original.
   */
  const desplazamientoVector =
    perpendicular
      .clone()
      .multiplyScalar(
        desplazamiento
      );

  inicio.add(
    desplazamientoVector
  );

  final.add(
    desplazamientoVector
  );

  /*
   * Dirección final del cilindro.
   */
  const direccionFinal =
    new THREE.Vector3()
      .subVectors(
        final,
        inicio
      );

  const longitud =
    direccionFinal.length();

  /*
   * Geometría del enlace.
   */
  const geometria =
    new THREE.CylinderGeometry(
      0.075,
      0.075,
      longitud,
      20
    );

  const material =
    new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.45,
      metalness: 0.05,
    });

  const enlace =
    new THREE.Mesh(
      geometria,
      material
    );

  /*
   * Colocamos el cilindro en el punto medio.
   */
  const puntoMedio =
    new THREE.Vector3()
      .addVectors(
        inicio,
        final
      )
      .multiplyScalar(0.5);

  enlace.position.copy(
    puntoMedio
  );

  /*
   * Orientamos el cilindro entre los dos átomos.
   */
  enlace.quaternion.setFromUnitVectors(
    new THREE.Vector3(
      0,
      1,
      0
    ),
    direccionFinal.normalize()
  );

  return enlace;
}

/*
 * ============================================================
 * CREAR ENLACE SEGÚN SU ORDEN
 *
 * 1 = simple
 * 2 = doble
 * 3 = triple
 * ============================================================
 */

function crearEnlace(
  posicionA,
  posicionB,
  orden = 1
) {
  const grupo = new THREE.Group();

  /*
   * ENLACE SIMPLE
   */

  if (orden === 1) {
    grupo.add(
      crearCilindroEnlace(
        posicionA,
        posicionB,
        0
      )
    );

    return grupo;
  }

  /*
   * ENLACE DOBLE
   */

  if (orden === 2) {
    // Separación amplia para que ambos cilindros sean
    // claramente visibles incluso después de rotar la molécula.
    grupo.add(
      crearCilindroEnlace(
        posicionA,
        posicionB,
        0.28
      )
    );

    grupo.add(
      crearCilindroEnlace(
        posicionA,
        posicionB,
        -0.28
      )
    );

    return grupo;
  }

  /*
   * ENLACE TRIPLE
   */

  if (orden === 3) {
    // Tres cilindros separados alrededor del eje del enlace.
    grupo.add(
      crearCilindroEnlace(
        posicionA,
        posicionB,
        0.32
      )
    );

    grupo.add(
      crearCilindroEnlace(
        posicionA,
        posicionB,
        0
      )
    );

    grupo.add(
      crearCilindroEnlace(
        posicionA,
        posicionB,
        -0.32
      )
    );

    return grupo;
  }

  /*
   * POR SEGURIDAD
   */

  grupo.add(
    crearCilindroEnlace(
      posicionA,
      posicionB,
      0
    )
  );

  return grupo;
}


/*
 * ============================================================
 * CONVERTIR ATOMOS A UNA LISTA INDIVIDUAL
 * ============================================================
 */

function obtenerSimbolos(atomos) {
  return atomos.flatMap((atomo) =>
    Array.from(
      {
        length: atomo.cantidad,
      },
      () => atomo.simbolo
    )
  );
}


/*
 * ============================================================
 * OBTENER POSICIONES MOLECULARES
 * ============================================================
 */

function obtenerPosiciones(atomos, analisis) {
  const simbolos = obtenerSimbolos(atomos);

  /*
   * El motor químico es ahora la fuente de la geometría.
   * Normalizamos la fórmula para aceptar tanto CO₂ como CO2.
   */
  const formula = normalizarFormulaVisual(
    analisis?.formula
  );

  const geometria = String(
    analisis?.geometria || ""
  ).toLowerCase();

  /*
   * ==========================================================
   * H2O - ANGULAR
   *
   * Ángulo H-O-H: 104.5°
   * ==========================================================
   */
  if (
    formula === "H2O" &&
    geometria.includes("angular")
  ) {
    const radio = 1.45;
    const medioAngulo = THREE.MathUtils.degToRad(
      104.5 / 2
    );

    return [
      {
        simbolo: "O",
        posicion: new THREE.Vector3(
          0,
          0,
          0
        ),
      },
      {
        simbolo: "H",
        posicion: new THREE.Vector3(
          -Math.sin(medioAngulo) * radio,
          Math.cos(medioAngulo) * radio,
          0
        ),
      },
      {
        simbolo: "H",
        posicion: new THREE.Vector3(
          Math.sin(medioAngulo) * radio,
          Math.cos(medioAngulo) * radio,
          0
        ),
      },
    ];
  }

  /*
   * ==========================================================
   * CO2 - LINEAL
   *
   * Ángulo O-C-O: 180°
   * ==========================================================
   */
  if (
    formula === "CO2" &&
    geometria.includes("lineal")
  ) {
    return [
      {
        simbolo: "C",
        posicion: new THREE.Vector3(
          0,
          0,
          0
        ),
      },
      {
        simbolo: "O",
        posicion: new THREE.Vector3(
          -1.7,
          0,
          0
        ),
      },
      {
        simbolo: "O",
        posicion: new THREE.Vector3(
          1.7,
          0,
          0
        ),
      },
    ];
  }

  /*
   * ==========================================================
   * CH4 - TETRAÉDRICA
   *
   * Ángulo H-C-H: 109.5°
   * ==========================================================
   */
  if (
    formula === "CH4" &&
    geometria.includes("tetra")
  ) {
    const radio = 1.55;
    const a = radio / Math.sqrt(3);

    return [
      {
        simbolo: "C",
        posicion: new THREE.Vector3(
          0,
          0,
          0
        ),
      },
      {
        simbolo: "H",
        posicion: new THREE.Vector3(
          a,
          a,
          a
        ),
      },
      {
        simbolo: "H",
        posicion: new THREE.Vector3(
          -a,
          -a,
          a
        ),
      },
      {
        simbolo: "H",
        posicion: new THREE.Vector3(
          -a,
          a,
          -a
        ),
      },
      {
        simbolo: "H",
        posicion: new THREE.Vector3(
          a,
          -a,
          -a
        ),
      },
    ];
  }

  /*
   * ==========================================================
   * NH3 - PIRAMIDAL TRIGONAL
   *
   * Ángulo H-N-H: 107°
   * ==========================================================
   */
  if (
    formula === "NH3" &&
    geometria.includes("piramidal")
  ) {
    const radio = 1.5;
    const angulo = THREE.MathUtils.degToRad(
      107
    );

    const cosPolar = Math.sqrt(
      (Math.cos(angulo) + 0.5) / 1.5
    );

    const sinPolar = Math.sqrt(
      1 - cosPolar * cosPolar
    );

    return [
      {
        simbolo: "N",
        posicion: new THREE.Vector3(
          0,
          0,
          0
        ),
      },
      {
        simbolo: "H",
        posicion: new THREE.Vector3(
          sinPolar * radio,
          cosPolar * radio,
          0
        ),
      },
      {
        simbolo: "H",
        posicion: new THREE.Vector3(
          -0.5 * sinPolar * radio,
          cosPolar * radio,
          (Math.sqrt(3) / 2) * sinPolar * radio
        ),
      },
      {
        simbolo: "H",
        posicion: new THREE.Vector3(
          -0.5 * sinPolar * radio,
          cosPolar * radio,
          -(Math.sqrt(3) / 2) * sinPolar * radio
        ),
      },
    ];
  }

  /*
   * ==========================================================
   * BF3 - TRIGONAL PLANA
   *
   * Ángulo F-B-F: 120°
   * ==========================================================
   */
  if (
    formula === "BF3" &&
    geometria.includes("trigonal plana")
  ) {
    const radio = 1.65;

    return [
      {
        simbolo: "B",
        posicion: new THREE.Vector3(
          0,
          0,
          0
        ),
      },
      {
        simbolo: "F",
        posicion: new THREE.Vector3(
          radio,
          0,
          0
        ),
      },
      {
        simbolo: "F",
        posicion: new THREE.Vector3(
          -radio * 0.5,
          radio * Math.sqrt(3) / 2,
          0
        ),
      },
      {
        simbolo: "F",
        posicion: new THREE.Vector3(
          -radio * 0.5,
          -radio * Math.sqrt(3) / 2,
          0
        ),
      },
    ];
  }

  /*
   * ==========================================================
   * SO2 - ANGULAR
   *
   * Ángulo O-S-O: aproximadamente 119°
   * ==========================================================
   */
  if (
    formula === "SO2" &&
    geometria.includes("angular")
  ) {
    const radio = 1.55;
    const medioAngulo = THREE.MathUtils.degToRad(
      119 / 2
    );

    return [
      {
        simbolo: "S",
        posicion: new THREE.Vector3(
          0,
          0,
          0
        ),
      },
      {
        simbolo: "O",
        posicion: new THREE.Vector3(
          -Math.sin(medioAngulo) * radio,
          Math.cos(medioAngulo) * radio,
          0
        ),
      },
      {
        simbolo: "O",
        posicion: new THREE.Vector3(
          Math.sin(medioAngulo) * radio,
          Math.cos(medioAngulo) * radio,
          0
        ),
      },
    ];
  }

  /*
   * ==========================================================
   * SO3 - TRIGONAL PLANA
   *
   * Ángulo O-S-O: 120°
   * ==========================================================
   */
  if (
    formula === "SO3" &&
    geometria.includes("trigonal plana")
  ) {
    const radio = 1.65;

    return [
      {
        simbolo: "S",
        posicion: new THREE.Vector3(
          0,
          0,
          0
        ),
      },
      {
        simbolo: "O",
        posicion: new THREE.Vector3(
          radio,
          0,
          0
        ),
      },
      {
        simbolo: "O",
        posicion: new THREE.Vector3(
          -radio * 0.5,
          radio * Math.sqrt(3) / 2,
          0
        ),
      },
      {
        simbolo: "O",
        posicion: new THREE.Vector3(
          -radio * 0.5,
          -radio * Math.sqrt(3) / 2,
          0
        ),
      },
    ];
  }

  /*
   * ==========================================================
   * CCl4 - TETRAÉDRICA
   * ==========================================================
   */
  if (
    formula === "CCl4" &&
    geometria.includes("tetra")
  ) {
    const radio = 1.6;
    const a = radio / Math.sqrt(3);

    return [
      {
        simbolo: "C",
        posicion: new THREE.Vector3(
          0,
          0,
          0
        ),
      },
      {
        simbolo: "Cl",
        posicion: new THREE.Vector3(
          a,
          a,
          a
        ),
      },
      {
        simbolo: "Cl",
        posicion: new THREE.Vector3(
          -a,
          -a,
          a
        ),
      },
      {
        simbolo: "Cl",
        posicion: new THREE.Vector3(
          -a,
          a,
          -a
        ),
      },
      {
        simbolo: "Cl",
        posicion: new THREE.Vector3(
          a,
          -a,
          -a
        ),
      },
    ];
  }

  /*
   * ==========================================================
   * MOLÉCULA DIATÓMICA
   * ==========================================================
   */
  if (
    simbolos.length === 2
  ) {
    return [
      {
        simbolo: simbolos[0],
        posicion: new THREE.Vector3(
          -0.9,
          0,
          0
        ),
      },
      {
        simbolo: simbolos[1],
        posicion: new THREE.Vector3(
          0.9,
          0,
          0
        ),
      },
    ];
  }

  /*
   * ==========================================================
   * DISPOSICIÓN GENÉRICA
   * ==========================================================
   *
   * Se utiliza cuando todavía no existe una geometría específica
   * para la combinación seleccionada.
   */
  const posiciones = [];

  const radio = Math.max(
    1.5,
    simbolos.length * 0.55
  );

  simbolos.forEach((simbolo, indice) => {
    const angulo =
      (indice / simbolos.length) *
      Math.PI *
      2;

    posiciones.push({
      simbolo,
      posicion: new THREE.Vector3(
        Math.cos(angulo) * radio,
        Math.sin(angulo) * radio,
        indice % 2 === 0
          ? 0.5
          : -0.5
      ),
    });
  });

  return posiciones;
}

/*
 * ============================================================
 * ENCONTRAR ÁTOMOS POR SÍMBOLO
 * ============================================================
 */

function buscarIndicesPorSimbolo(
  posiciones,
  simbolo
) {
  return posiciones
    .map((elemento, indice) =>
      elemento.simbolo === simbolo
        ? indice
        : -1
    )
    .filter((indice) => indice !== -1);
}


/*
 * ============================================================
 * NORMALIZAR FÓRMULA PARA LAS REGLAS VISUALES
 *
 * El motor químico puede devolver subíndices Unicode
 * (por ejemplo CO₂) o texto normal (CO2). Las reglas
 * visuales trabajan internamente con texto ASCII.
 * ============================================================
 */

function normalizarFormulaVisual(formula) {
  if (!formula) {
    return "";
  }

  const subindices = {
    "₀": "0",
    "₁": "1",
    "₂": "2",
    "₃": "3",
    "₄": "4",
    "₅": "5",
    "₆": "6",
    "₇": "7",
    "₈": "8",
    "₉": "9",
  };

  return String(formula)
    .split("")
    .map((caracter) => subindices[caracter] || caracter)
    .join("");
}


/*
 * ============================================================
 * CREAR ENLACES CONOCIDOS
 *
 * Esta función utiliza el análisis químico para determinar
 * si corresponde un enlace simple, doble o triple.
 * ============================================================
 */

function crearEnlacesDesdeAnalisis(
  grupo,
  posiciones,
  analisis
) {
  if (!analisis) {
    return;
  }

  const formula = normalizarFormulaVisual(
    analisis.formula
  );

  /*
   * ----------------------------------------------------------
   * H2O
   * O-H simples
   * ----------------------------------------------------------
   */

  if (formula === "H2O") {
    const oxigeno = buscarIndicesPorSimbolo(
      posiciones,
      "O"
    )[0];

    const hidrogenos = buscarIndicesPorSimbolo(
      posiciones,
      "H"
    );

    hidrogenos.forEach((indiceH) => {
      grupo.add(
        crearEnlace(
          posiciones[oxigeno].posicion,
          posiciones[indiceH].posicion,
          1
        )
      );
    });

    return;
  }


  /*
   * ----------------------------------------------------------
   * CO2
   * C=O
   * ----------------------------------------------------------
   */

  if (formula === "CO2") {
    const carbono = buscarIndicesPorSimbolo(
      posiciones,
      "C"
    )[0];

    const oxigenos = buscarIndicesPorSimbolo(
      posiciones,
      "O"
    );

    oxigenos.forEach((indiceO) => {
      grupo.add(
        crearEnlace(
          posiciones[carbono].posicion,
          posiciones[indiceO].posicion,
          2
        )
      );
    });

    return;
  }


  /*
   * ----------------------------------------------------------
   * CH4
   * C-H simples
   * ----------------------------------------------------------
   */

  if (formula === "CH4") {
    const carbono = buscarIndicesPorSimbolo(
      posiciones,
      "C"
    )[0];

    const hidrogenos = buscarIndicesPorSimbolo(
      posiciones,
      "H"
    );

    hidrogenos.forEach((indiceH) => {
      grupo.add(
        crearEnlace(
          posiciones[carbono].posicion,
          posiciones[indiceH].posicion,
          1
        )
      );
    });

    return;
  }


  /*
   * ----------------------------------------------------------
   * NH3
   * N-H simples
   * ----------------------------------------------------------
   */

  if (formula === "NH3") {
    const nitrogeno = buscarIndicesPorSimbolo(
      posiciones,
      "N"
    )[0];

    const hidrogenos = buscarIndicesPorSimbolo(
      posiciones,
      "H"
    );

    hidrogenos.forEach((indiceH) => {
      grupo.add(
        crearEnlace(
          posiciones[nitrogeno].posicion,
          posiciones[indiceH].posicion,
          1
        )
      );
    });

    return;
  }


  /*
   * ----------------------------------------------------------
   * O2
   * O=O
   * ----------------------------------------------------------
   */

  if (formula === "O2") {
    grupo.add(
      crearEnlace(
        posiciones[0].posicion,
        posiciones[1].posicion,
        2
      )
    );

    return;
  }


  /*
   * ----------------------------------------------------------
   * N2
   * N≡N
   * ----------------------------------------------------------
   */

  if (formula === "N2") {
    grupo.add(
      crearEnlace(
        posiciones[0].posicion,
        posiciones[1].posicion,
        3
      )
    );

    return;
  }


  /*
   * ----------------------------------------------------------
   * H2
   * H-H
   * ----------------------------------------------------------
   */

  if (formula === "H2") {
    grupo.add(
      crearEnlace(
        posiciones[0].posicion,
        posiciones[1].posicion,
        1
      )
    );

    return;
  }


  /*
   * ----------------------------------------------------------
   * HCl
   * H-Cl
   * ----------------------------------------------------------
   */

  if (formula === "HCl") {
    const hidrogeno = buscarIndicesPorSimbolo(
      posiciones,
      "H"
    )[0];

    const cloro = buscarIndicesPorSimbolo(
      posiciones,
      "Cl"
    )[0];

    if (
      hidrogeno !== undefined &&
      cloro !== undefined
    ) {
      grupo.add(
        crearEnlace(
          posiciones[hidrogeno].posicion,
          posiciones[cloro].posicion,
          1
        )
      );
    }

    return;
  }


  /*
   * ----------------------------------------------------------
   * SO2
   * S=O
   * ----------------------------------------------------------
   */

  if (formula === "SO2") {
    const azufre = buscarIndicesPorSimbolo(
      posiciones,
      "S"
    )[0];

    const oxigenos = buscarIndicesPorSimbolo(
      posiciones,
      "O"
    );

    oxigenos.forEach((indiceO) => {
      grupo.add(
        crearEnlace(
          posiciones[azufre].posicion,
          posiciones[indiceO].posicion,
          2
        )
      );
    });

    return;
  }


  /*
   * ----------------------------------------------------------
   * SO3
   * S=O
   * ----------------------------------------------------------
   */

  if (formula === "SO3") {
    const azufre = buscarIndicesPorSimbolo(
      posiciones,
      "S"
    )[0];

    const oxigenos = buscarIndicesPorSimbolo(
      posiciones,
      "O"
    );

    oxigenos.forEach((indiceO) => {
      grupo.add(
        crearEnlace(
          posiciones[azufre].posicion,
          posiciones[indiceO].posicion,
          2
        )
      );
    });

    return;
  }


  /*
   * ----------------------------------------------------------
   * BF3
   * B-F simples
   * ----------------------------------------------------------
   */

  if (formula === "BF3") {
    const boro = buscarIndicesPorSimbolo(
      posiciones,
      "B"
    )[0];

    const fluoruros = buscarIndicesPorSimbolo(
      posiciones,
      "F"
    );

    fluoruros.forEach((indiceF) => {
      grupo.add(
        crearEnlace(
          posiciones[boro].posicion,
          posiciones[indiceF].posicion,
          1
        )
      );
    });

    return;
  }


  /*
   * ----------------------------------------------------------
   * CCl4
   * ----------------------------------------------------------
   */

  if (formula === "CCl4") {
    const carbono = buscarIndicesPorSimbolo(
      posiciones,
      "C"
    )[0];

    const cloros = buscarIndicesPorSimbolo(
      posiciones,
      "Cl"
    );

    cloros.forEach((indiceCl) => {
      grupo.add(
        crearEnlace(
          posiciones[carbono].posicion,
          posiciones[indiceCl].posicion,
          1
        )
      );
    });

    return;
  }


  /*
   * ----------------------------------------------------------
   * Si todavía no existe una regla visual específica,
   * usamos una conexión genérica.
   * ----------------------------------------------------------
   */

  crearEnlacesGenericos(
    grupo,
    posiciones
  );
}


/*
 * ============================================================
 * ENLACES GENÉRICOS
 * ============================================================
 */

function crearEnlacesGenericos(
  grupo,
  posiciones
) {
  if (posiciones.length < 2) {
    return;
  }

  /*
   * Si hay un átomo central evidente,
   * conectamos los demás con él.
   */

  const simbolos = posiciones.map(
    (item) => item.simbolo
  );

  let indiceCentral = 0;


  if (simbolos.includes("C")) {
    const carbonos = buscarIndicesPorSimbolo(
      posiciones,
      "C"
    );

    if (carbonos.length === 1) {
      indiceCentral = carbonos[0];
    }
  }


  if (simbolos.includes("N")) {
    const nitrogenos = buscarIndicesPorSimbolo(
      posiciones,
      "N"
    );

    if (
      nitrogenos.length === 1 &&
      !simbolos.includes("C")
    ) {
      indiceCentral = nitrogenos[0];
    }
  }


  if (simbolos.includes("O")) {
    const oxigenos = buscarIndicesPorSimbolo(
      posiciones,
      "O"
    );

    if (
      oxigenos.length === 1 &&
      !simbolos.includes("C") &&
      !simbolos.includes("N")
    ) {
      indiceCentral = oxigenos[0];
    }
  }


  const centro =
    posiciones[indiceCentral].posicion;


  posiciones.forEach(
    (elemento, indice) => {
      if (indice === indiceCentral) {
        return;
      }

      grupo.add(
        crearEnlace(
          centro,
          elemento.posicion,
          1
        )
      );
    }
  );
}


/*
 * ============================================================
 * CREAR MODELO MOLECULAR
 * ============================================================
 */

function crearModeloMolecular(
  scene,
  atomos,
  analisis
) {
  const grupo = new THREE.Group();

  if (
    !atomos ||
    atomos.length === 0
  ) {
    scene.add(grupo);
    return grupo;
  }

  const posiciones =
    obtenerPosiciones(atomos, analisis);


  /*
   * ==========================================================
   * CREAR ÁTOMOS
   * ==========================================================
   */

  posiciones.forEach(
    (elemento) => {
      const esfera =
        crearEsferaAtomica(
          elemento.simbolo
        );

      esfera.position.copy(
        elemento.posicion
      );

      grupo.add(esfera);
    }
  );


  /*
   * ==========================================================
   * CREAR ENLACES
   * ==========================================================
   */

  if (posiciones.length > 1) {
    crearEnlacesDesdeAnalisis(
      grupo,
      posiciones,
      analisis
    );
  }


  scene.add(grupo);

  return grupo;
}


/*
 * ============================================================
 * COMPONENTE
 * ============================================================
 */

function Molecula3D({
  atomos,
  analisis,
}) {
  const contenedorRef =
    useRef(null);

  const escenaRef =
    useRef(null);

  const camaraRef =
    useRef(null);

  const grupoMoleculaRef =
    useRef(null);

  const arrastrandoRef =
    useRef(false);

  const posicionMouseRef =
    useRef({
      x: 0,
      y: 0,
    });


  /*
   * ==========================================================
   * ESCENA THREE.JS
   * ==========================================================
   */

  useEffect(() => {
    if (!contenedorRef.current) {
      return;
    }

    const contenedor =
      contenedorRef.current;


    /*
     * ========================================================
     * ESCENA
     * ========================================================
     */

    const escena =
      new THREE.Scene();

    escena.background =
      new THREE.Color(
        0xf8fafc
      );

    escenaRef.current =
      escena;


    /*
     * ========================================================
     * CÁMARA
     * ========================================================
     */

    const camara =
      new THREE.PerspectiveCamera(
        45,
        contenedor.clientWidth /
          contenedor.clientHeight,
        0.1,
        100
      );

    camara.position.set(
      0,
      0,
      9
    );

    camara.lookAt(
      0,
      0,
      0
    );

    camaraRef.current =
      camara;


    /*
     * ========================================================
     * RENDERER
     * ========================================================
     */

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

    renderer.setSize(
      contenedor.clientWidth,
      contenedor.clientHeight
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    contenedor.appendChild(
      renderer.domElement
    );


    /*
     * ========================================================
     * ILUMINACIÓN
     * ========================================================
     */

    const luzAmbiente =
      new THREE.AmbientLight(
        0xffffff,
        2
      );

    escena.add(
      luzAmbiente
    );


    const luzPrincipal =
      new THREE.DirectionalLight(
        0xffffff,
        3
      );

    luzPrincipal.position.set(
      5,
      7,
      8
    );

    escena.add(
      luzPrincipal
    );


    const luzSecundaria =
      new THREE.DirectionalLight(
        0xffffff,
        1.5
      );

    luzSecundaria.position.set(
      -5,
      -3,
      4
    );

    escena.add(
      luzSecundaria
    );


    /*
     * ========================================================
     * MODELO MOLECULAR
     * ========================================================
     */

    const grupo =
      crearModeloMolecular(
        escena,
        atomos,
        analisis
      );

    grupoMoleculaRef.current =
      grupo;


    /*
     * ========================================================
     * ROTACIÓN CON MOUSE
     * ========================================================
     */

    const iniciarArrastre =
      (evento) => {
        arrastrandoRef.current =
          true;

        posicionMouseRef.current = {
          x: evento.clientX,
          y: evento.clientY,
        };
      };


    const terminarArrastre =
      () => {
        arrastrandoRef.current =
          false;
      };


    const moverMouse =
      (evento) => {
        if (
          !arrastrandoRef.current ||
          !grupoMoleculaRef.current
        ) {
          return;
        }

        const deltaX =
          evento.clientX -
          posicionMouseRef.current.x;

        const deltaY =
          evento.clientY -
          posicionMouseRef.current.y;


        grupoMoleculaRef.current.rotation.y +=
          deltaX * 0.01;

        grupoMoleculaRef.current.rotation.x +=
          deltaY * 0.01;


        posicionMouseRef.current = {
          x: evento.clientX,
          y: evento.clientY,
        };
      };


    /*
     * ========================================================
     * ZOOM
     * ========================================================
     */

    const controlarZoom =
      (evento) => {
        evento.preventDefault();

        camara.position.z +=
          evento.deltaY * 0.01;

        camara.position.z =
          THREE.MathUtils.clamp(
            camara.position.z,
            4,
            18
          );
      };


    /*
     * ========================================================
     * EVENTOS
     * ========================================================
     */

    renderer.domElement.addEventListener(
      "pointerdown",
      iniciarArrastre
    );

    window.addEventListener(
      "pointerup",
      terminarArrastre
    );

    window.addEventListener(
      "pointermove",
      moverMouse
    );

    renderer.domElement.addEventListener(
      "wheel",
      controlarZoom,
      {
        passive: false,
      }
    );


    /*
     * ========================================================
     * RESIZE
     * ========================================================
     */

    const actualizarTamano =
      () => {
        if (
          !contenedorRef.current
        ) {
          return;
        }

        const ancho =
          contenedorRef.current.clientWidth;

        const alto =
          contenedorRef.current.clientHeight;

        camara.aspect =
          ancho / alto;

        camara.updateProjectionMatrix();

        renderer.setSize(
          ancho,
          alto
        );
      };


    window.addEventListener(
      "resize",
      actualizarTamano
    );


    /*
     * ========================================================
     * ANIMACIÓN
     * ========================================================
     */

    let animationFrame;

    const animar = () => {
      animationFrame =
        requestAnimationFrame(
          animar
        );

      renderer.render(
        escena,
        camara
      );
    };

    animar();


    /*
     * ========================================================
     * LIMPIEZA
     * ========================================================
     */

    return () => {
      cancelAnimationFrame(
        animationFrame
      );


      window.removeEventListener(
        "resize",
        actualizarTamano
      );

      window.removeEventListener(
        "pointerup",
        terminarArrastre
      );

      window.removeEventListener(
        "pointermove",
        moverMouse
      );


      renderer.domElement.removeEventListener(
        "pointerdown",
        iniciarArrastre
      );

      renderer.domElement.removeEventListener(
        "wheel",
        controlarZoom
      );


      if (
        grupoMoleculaRef.current
      ) {
        grupoMoleculaRef.current.traverse(
          (objeto) => {
            if (
              objeto.geometry
            ) {
              objeto.geometry.dispose();
            }

            if (
              objeto.material
            ) {
              objeto.material.dispose();
            }
          }
        );
      }


      renderer.dispose();


      if (
        renderer.domElement.parentNode ===
        contenedor
      ) {
        contenedor.removeChild(
          renderer.domElement
        );
      }
    };

  }, [atomos, analisis]);


  /*
   * ==========================================================
   * ESTADO VACÍO
   * ==========================================================
   */

  if (
    !atomos ||
    atomos.length === 0
  ) {
    return (
      <div className="molecula3d-vacia">

        <div>

          <span>⚛</span>

          <h3>
            Vista molecular 3D
          </h3>

          <p>
            Agrega elementos para visualizar
            la molécula en tres dimensiones.
          </p>

        </div>

      </div>
    );
  }


  /*
   * ==========================================================
   * VISTA
   * ==========================================================
   */

  return (
    <div className="molecula3d-contenedor">

      <div
        ref={contenedorRef}
        className="molecula3d-escena"
      />

      <div className="molecula3d-ayuda">
        Arrastra para rotar · Rueda para acercar
        o alejar
      </div>

    </div>
  );
}

export default Molecula3D;