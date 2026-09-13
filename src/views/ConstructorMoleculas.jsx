import { useMemo, useState } from "react";
import { elementos } from "../data/elements";
import Molecula3D from "./Molecula3D";
import REGLAS_MOLECULAS, {
  analizarMolecula,
} from "../chemistry/chemicalRules";
import { analizarLewis } from "../chemistry/lewisRules";
import "./ConstructorMoleculas.css";

/* =========================================================
   FUNCIONES AUXILIARES
   ========================================================= */

const CARACTERES_SUBINDICE = {
  0: "₀",
  1: "₁",
  2: "₂",
  3: "₃",
  4: "₄",
  5: "₅",
  6: "₆",
  7: "₇",
  8: "₈",
  9: "₉",
};

function obtenerSubindice(numero) {
  return String(numero)
    .split("")
    .map(
      (caracter) =>
        CARACTERES_SUBINDICE[caracter] || caracter
    )
    .join("");
}

/*
  Convierte una fórmula visual como:

  NH₃
  CO₂
  BF₃

  a una fórmula normal:

  NH3
  CO2
  BF3
*/
function convertirFormulaAASCII(formula) {
  if (!formula) {
    return "";
  }

  const mapaInverso = {
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
    .map(
      (caracter) =>
        mapaInverso[caracter] || caracter
    )
    .join("");
}

/*
  Obtiene las cantidades reales de cada elemento.

  Ejemplo:

  [
    { simbolo: "H", cantidad: 3 },
    { simbolo: "N", cantidad: 1 }
  ]

  devuelve:

  {
    H: 3,
    N: 1
  }
*/
function obtenerComposicion(atomos) {
  const composicion = {};

  if (!atomos || atomos.length === 0) {
    return composicion;
  }

  atomos.forEach((atomo) => {
    composicion[atomo.simbolo] =
      (composicion[atomo.simbolo] || 0) +
      atomo.cantidad;
  });

  return composicion;
}

/*
  Convierte una fórmula ASCII de las reglas:

  NH3
  CO2
  BF3

  en una composición comparable.
*/
function obtenerComposicionDeFormula(formula) {
  const composicion = {};

  if (!formula) {
    return composicion;
  }

  const partes = String(formula).match(
    /([A-Z][a-z]?)(\d*)/g
  );

  if (!partes) {
    return composicion;
  }

  partes.forEach((parte) => {
    const coincidencia = parte.match(
      /^([A-Z][a-z]?)(\d*)$/
    );

    if (!coincidencia) {
      return;
    }

    const simbolo = coincidencia[1];

    const cantidad = coincidencia[2]
      ? Number(coincidencia[2])
      : 1;

    composicion[simbolo] = cantidad;
  });

  return composicion;
}

/*
  Compara dos composiciones químicas.

  Importante:
  NO importa el orden en que el alumno agregó
  los elementos.
*/
function composicionesIguales(
  composicionA,
  composicionB
) {
  const elementosA = Object.keys(composicionA);
  const elementosB = Object.keys(composicionB);

  if (elementosA.length !== elementosB.length) {
    return false;
  }

  return elementosA.every(
    (simbolo) =>
      composicionA[simbolo] ===
      composicionB[simbolo]
  );
}

/*
  Busca la regla química correspondiente a la
  combinación actual.

  Ejemplo:

  N + H3

  encuentra:

  NH3
*/
function encontrarReglaPorComposicion(atomos) {
  const composicionActual =
    obtenerComposicion(atomos);

  const formulasDisponibles = Object.keys(
    REGLAS_MOLECULAS || {}
  );

  return (
    formulasDisponibles.find((formula) => {
      const composicionRegla =
        obtenerComposicionDeFormula(formula);

      return composicionesIguales(
        composicionActual,
        composicionRegla
      );
    }) || null
  );
}

/*
  Genera una fórmula visual a partir de los átomos.

  Para moléculas conocidas primero utiliza la
  fórmula definida por el motor químico.

  Para combinaciones no registradas usa un orden
  químico básico.
*/
function obtenerFormulaVisual(atomos) {
  if (!atomos || atomos.length === 0) {
    return "—";
  }

  const reglaEncontrada =
    encontrarReglaPorComposicion(atomos);

  if (reglaEncontrada) {
    return reglaEncontrada.replace(
      /([A-Z][a-z]?)(\d+)/g,
      (_, simbolo, cantidad) =>
        `${simbolo}${obtenerSubindice(
          Number(cantidad)
        )}`
    );
  }

  /*
    Orden utilizado solamente cuando todavía no
    existe una regla específica.
  */
  const prioridad = [
    "C",
    "N",
    "H",
    "O",
    "F",
    "P",
    "S",
    "Cl",
    "Br",
    "I",
  ];

  const ordenados = [...atomos].sort((a, b) => {
    const posicionA = prioridad.indexOf(
      a.simbolo
    );

    const posicionB = prioridad.indexOf(
      b.simbolo
    );

    const ordenA =
      posicionA === -1 ? 100 : posicionA;

    const ordenB =
      posicionB === -1 ? 100 : posicionB;

    if (ordenA !== ordenB) {
      return ordenA - ordenB;
    }

    return a.simbolo.localeCompare(
      b.simbolo
    );
  });

  return ordenados
    .map(
      (atomo) =>
        `${atomo.simbolo}${
          atomo.cantidad > 1
            ? obtenerSubindice(
                atomo.cantidad
              )
            : ""
        }`
    )
    .join("");
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

function ConstructorMoleculas({
  elementoInicial,
  volver,
}) {
  const [atomos, setAtomos] = useState(
    elementoInicial
      ? [
          {
            numero: elementoInicial.numero,
            simbolo: elementoInicial.simbolo,
            nombre: elementoInicial.nombre,
            cantidad: 1,
          },
        ]
      : []
  );

  const [busqueda, setBusqueda] = useState("");

  /* =======================================================
     FÓRMULA
     ======================================================= */

  const formula = useMemo(() => {
    return obtenerFormulaVisual(atomos);
  }, [atomos]);

  /* =======================================================
     ANÁLISIS QUÍMICO
     ======================================================= */

  const analisis = useMemo(() => {
    if (!atomos || atomos.length === 0) {
      return analizarMolecula(atomos);
    }

    /*
      Primero buscamos la molécula por composición.

      Esto permite:

      H3 + N → NH3
      N + H3 → NH3
      H + N + H + H → NH3

      Todos producen la misma molécula.
    */
    const formulaRegla =
      encontrarReglaPorComposicion(atomos);

    if (formulaRegla) {
      const regla =
        REGLAS_MOLECULAS[
          formulaRegla
        ];

      return {
        ...regla,
        formula: formula,
      };
    }

    /*
      Si no existe una regla específica,
      utilizamos el analizador general.
    */
    const resultado =
      analizarMolecula(atomos);

    return {
      ...resultado,
      formula: formula,
    };
  }, [atomos, formula]);

  /* =======================================================
     ANÁLISIS DE LEWIS
     ======================================================= */

  const analisisLewis = useMemo(() => {
    return analizarLewis(atomos);
  }, [atomos]);

  /* =======================================================
     ELEMENTOS FILTRADOS
     ======================================================= */

  const elementosFiltrados = useMemo(() => {
    const texto = busqueda
      .trim()
      .toLowerCase();

    if (!texto) {
      return elementos.slice(0, 20);
    }

    return elementos
      .filter(
        (elemento) =>
          elemento.nombre
            .toLowerCase()
            .includes(texto) ||
          elemento.simbolo
            .toLowerCase()
            .includes(texto) ||
          String(elemento.numero).includes(
            texto
          )
      )
      .slice(0, 20);
  }, [busqueda]);

  /* =======================================================
     AGREGAR ELEMENTO
     ======================================================= */

  const agregarElemento = (elemento) => {
    setAtomos((actuales) => {
      const existente = actuales.find(
        (atomo) =>
          atomo.numero === elemento.numero
      );

      if (existente) {
        return actuales.map((atomo) =>
          atomo.numero === elemento.numero
            ? {
                ...atomo,
                cantidad:
                  atomo.cantidad + 1,
              }
            : atomo
        );
      }

      return [
        ...actuales,
        {
          numero: elemento.numero,
          simbolo: elemento.simbolo,
          nombre: elemento.nombre,
          cantidad: 1,
        },
      ];
    });
  };

  /* =======================================================
     CAMBIAR CANTIDAD
     ======================================================= */

  const cambiarCantidad = (
    numero,
    cambio
  ) => {
    setAtomos((actuales) =>
      actuales
        .map((atomo) =>
          atomo.numero === numero
            ? {
                ...atomo,
                cantidad:
                  atomo.cantidad + cambio,
              }
            : atomo
        )
        .filter(
          (atomo) => atomo.cantidad > 0
        )
    );
  };

  /* =======================================================
     ELIMINAR ELEMENTO
     ======================================================= */

  const eliminarElemento = (numero) => {
    setAtomos((actuales) =>
      actuales.filter(
        (atomo) => atomo.numero !== numero
      )
    );
  };

  /* =======================================================
     LIMPIAR
     ======================================================= */

  const limpiarMolecula = () => {
    setAtomos([]);
  };

  /* =======================================================
     TOTAL DE ÁTOMOS
     ======================================================= */

  const totalAtomos = useMemo(() => {
    return atomos.reduce(
      (total, atomo) =>
        total + atomo.cantidad,
      0
    );
  }, [atomos]);

  /* =======================================================
     INTERFAZ
     ======================================================= */

  return (
    <section className="vista-constructor-moleculas">

      {/* =================================================
          CABECERA
          ================================================= */}

      <div className="encabezado-constructor">

        <div>
          <p className="etiqueta-modulo">
            LABORATORIO VIRTUAL
          </p>

          <h1>
            Constructor de Moléculas
          </h1>

          <p>
            Selecciona elementos y construye
            una molécula paso a paso.
          </p>
        </div>

        <button
          className="boton-volver-constructor"
          onClick={volver}
        >
          ← Volver
        </button>

      </div>

      {/* =================================================
          CONTENIDO PRINCIPAL
          ================================================= */}

      <div className="constructor-contenido">

        {/* =================================================
            PANEL DE ELEMENTOS
            ================================================= */}

        <aside className="panel-elementos">

          <div className="titulo-panel">

            <h2>
              Elementos
            </h2>

            <span>
              {elementos.length}
            </span>

          </div>

          <input
            type="text"
            className="buscador-elementos"
            placeholder="Buscar elemento..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
          />

          <div className="lista-elementos">

            {elementosFiltrados.map(
              (elemento) => (
                <button
                  key={elemento.numero}
                  className="elemento-opcion"
                  onClick={() =>
                    agregarElemento(
                      elemento
                    )
                  }
                >

                  <span className="simbolo-elemento">
                    {elemento.simbolo}
                  </span>

                  <span className="nombre-elemento">
                    {elemento.nombre}
                  </span>

                  <span className="numero-elemento">
                    {elemento.numero}
                  </span>

                </button>
              )
            )}

          </div>

          {elementosFiltrados.length ===
            0 && (
            <p className="sin-resultados">
              No se encontró ningún elemento.
            </p>
          )}

        </aside>

        {/* =================================================
            ÁREA DE CONSTRUCCIÓN
            ================================================= */}

        <main className="area-construccion">

          <div className="cabecera-area">

            <div>

              <h2>
                Área de construcción
              </h2>

              <p>
                Agrega elementos desde el
                panel izquierdo.
              </p>

            </div>

            {atomos.length > 0 && (
              <button
                className="boton-limpiar"
                onClick={
                  limpiarMolecula
                }
              >
                Limpiar
              </button>
            )}

          </div>

          {/* =================================================
              VISTA 3D
              ================================================= */}

          <div className="representacion-molecula">

            <Molecula3D
              atomos={atomos}
              analisis={analisis}
            />

          </div>

          {/* =================================================
              ELEMENTOS UTILIZADOS
              ================================================= */}

          <div className="lista-construccion">

            <h3>
              Elementos utilizados
            </h3>

            {atomos.length === 0 ? (
              <p className="sin-elementos">
                Todavía no has agregado
                elementos.
              </p>
            ) : (
              <div className="elementos-utilizados">

                {atomos.map((atomo) => (

                  <div
                    className="elemento-utilizado"
                    key={atomo.numero}
                  >

                    <div className="identidad-elemento">

                      <span className="simbolo-utilizado">
                        {atomo.simbolo}
                      </span>

                      <div>

                        <strong>
                          {atomo.nombre}
                        </strong>

                        <small>
                          Número atómico:{" "}
                          {atomo.numero}
                        </small>

                      </div>

                    </div>

                    <div className="controles-cantidad">

                      <button
                        onClick={() =>
                          cambiarCantidad(
                            atomo.numero,
                            -1
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {atomo.cantidad}
                      </span>

                      <button
                        onClick={() =>
                          cambiarCantidad(
                            atomo.numero,
                            1
                          )
                        }
                      >
                        +
                      </button>

                      <button
                        className="boton-eliminar"
                        onClick={() =>
                          eliminarElemento(
                            atomo.numero
                          )
                        }
                      >
                        ×
                      </button>

                    </div>

                  </div>

                ))}

              </div>
            )}

          </div>

        </main>

        {/* =================================================
            INFORMACIÓN DE LA MOLÉCULA
            ================================================= */}

        <aside className="panel-informacion-molecula">

          <h2>
            Información
          </h2>

          {/* =================================================
              FÓRMULA
              ================================================= */}

          <div className="formula-principal">

            <span>
              Fórmula
            </span>

            <strong>
              {analisis.formula ||
                formula}
            </strong>

          </div>

          {/* =================================================
              ESTRUCTURA DE LEWIS
              ================================================= */}

          <div className="panel-lewis">

            <div className="encabezado-lewis">
              <div>
                <span className="etiqueta-lewis">
                  ESTRUCTURA DE LEWIS
                </span>

                <h3>
                  Electrones de valencia
                </h3>
              </div>

              <span
                className={
                  analisisLewis.reconocida
                    ? "estado-lewis reconocido"
                    : "estado-lewis"
                }
              >
                {analisisLewis.reconocida
                  ? "Reconocida"
                  : "En desarrollo"}
              </span>
            </div>

            {atomos.length === 0 ? (
              <p className="mensaje-lewis">
                Agrega elementos para calcular la estructura de Lewis.
              </p>
            ) : (
              <>
                <div className="resumen-lewis">

                  <div className="dato-lewis">
                    <span>
                      Electrones de valencia
                    </span>

                    <strong>
                      {analisisLewis.electronesValencia}
                    </strong>
                  </div>

                  <div className="dato-lewis">
                    <span>
                      Átomo central
                    </span>

                    <strong>
                      {analisisLewis.atomoCentral || "—"}
                    </strong>
                  </div>

                </div>

                {analisisLewis.reconocida ? (
                  <>
                    <div className="bloque-lewis">

                      <h4>
                        Enlaces
                      </h4>

                      <div className="lista-enlaces-lewis">
                        {analisisLewis.enlaces.map(
                          (enlace, indice) => (
                            <div
                              className="enlace-lewis"
                              key={`${enlace.entre.join("-")}-${indice}`}
                            >
                              <span>
                                {enlace.entre[0]} — {enlace.entre[1]}
                              </span>

                              <strong>
                                {enlace.orden === 1
                                  ? "Simple"
                                  : enlace.orden === 2
                                  ? "Doble"
                                  : "Triple"}
                              </strong>
                            </div>
                          )
                        )}
                      </div>

                    </div>

                    <div className="bloque-lewis">

                      <h4>
                        Pares libres
                      </h4>

                      {Object.keys(
                        analisisLewis.paresLibres || {}
                      ).length === 0 ? (
                        <p className="sin-pares-lewis">
                          No hay pares libres registrados.
                        </p>
                      ) : (
                        <div className="lista-pares-lewis">
                          {Object.entries(
                            analisisLewis.paresLibres
                          ).map(
                            ([simbolo, pares]) => (
                              <div
                                className="par-libre-lewis"
                                key={simbolo}
                              >
                                <span>
                                  {simbolo}
                                </span>

                                <strong>
                                  {pares}{" "}
                                  {pares === 1
                                    ? "par"
                                    : "pares"}
                                </strong>
                              </div>
                            )
                          )}
                        </div>
                      )}

                    </div>
                  </>
                ) : (
                  <p className="mensaje-lewis">
                    Esta combinación todavía no tiene una estructura
                    de Lewis registrada.
                  </p>
                )}
              </>
            )}

          </div>

          {/* =================================================
              DATOS QUÍMICOS
              ================================================= */}

          <div className="datos-molecula">

            <div className="dato-molecula">

              <span>
                Nombre
              </span>

              <strong>
                {analisis.nombre ||
                  "—"}
              </strong>

            </div>

            <div className="dato-molecula">

              <span>
                Tipo de sustancia
              </span>

              <strong>
                {analisis.tipo ||
                  "—"}
              </strong>

            </div>

            <div className="dato-molecula">

              <span>
                Tipo de enlace
              </span>

              <strong>
                {analisis.tipoEnlace ||
                  "—"}
              </strong>

            </div>

            <div className="dato-molecula">

              <span>
                Geometría
              </span>

              <strong>
                {analisis.geometria ||
                  "—"}
              </strong>

            </div>

            <div className="dato-molecula">

              <span>
                Ángulo
              </span>

              <strong>
                {analisis.angulo ||
                  "—"}
              </strong>

            </div>

            <div className="dato-molecula">

              <span>
                Elementos diferentes
              </span>

              <strong>
                {atomos.length}
              </strong>

            </div>

            <div className="dato-molecula">

              <span>
                Total de átomos
              </span>

              <strong>
                {totalAtomos}
              </strong>

            </div>

            {analisis.atomoCentral && (
              <div className="dato-molecula">

                <span>
                  Átomo central
                </span>

                <strong>
                  {analisis.atomoCentral}
                </strong>

              </div>
            )}

          </div>

          {/* =================================================
              ANÁLISIS QUÍMICO
              ================================================= */}

          <div className="mensaje-quimico">

            <h3>
              Análisis químico
            </h3>

            <p>
              {analisis.descripcion ||
                "Agrega elementos para analizar la combinación química."}
            </p>

          </div>

          {/* =================================================
              VISTA 3D
              ================================================= */}

          <div className="mensaje-quimico">

            <h3>
              Vista molecular 3D
            </h3>

            <p>
              Arrastra la molécula para
              rotarla y utiliza la rueda
              del mouse para acercar o
              alejar la vista.
            </p>

          </div>

        </aside>

      </div>

    </section>
  );
}

export default ConstructorMoleculas;