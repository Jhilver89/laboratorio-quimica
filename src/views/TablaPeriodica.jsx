import { useState } from "react";
import { elementos } from "../data/elements";
import "./TablaPeriodica.css";

const periodos = [
  [
    "H",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "He",
  ],

  [
    "Li",
    "Be",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "B",
    "C",
    "N",
    "O",
    "F",
    "Ne",
  ],

  [
    "Na",
    "Mg",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Al",
    "Si",
    "P",
    "S",
    "Cl",
    "Ar",
  ],

  [
    "K",
    "Ca",
    "Sc",
    "Ti",
    "V",
    "Cr",
    "Mn",
    "Fe",
    "Co",
    "Ni",
    "Cu",
    "Zn",
    "Ga",
    "Ge",
    "As",
    "Se",
    "Br",
    "Kr",
  ],

  [
    "Rb",
    "Sr",
    "Y",
    "Zr",
    "Nb",
    "Mo",
    "Tc",
    "Ru",
    "Rh",
    "Pd",
    "Ag",
    "Cd",
    "In",
    "Sn",
    "Sb",
    "Te",
    "I",
    "Xe",
  ],

  [
    "Cs",
    "Ba",
    "*",
    "Hf",
    "Ta",
    "W",
    "Re",
    "Os",
    "Ir",
    "Pt",
    "Au",
    "Hg",
    "Tl",
    "Pb",
    "Bi",
    "Po",
    "At",
    "Rn",
  ],

  [
    "Fr",
    "Ra",
    "**",
    "Rf",
    "Db",
    "Sg",
    "Bh",
    "Hs",
    "Mt",
    "Ds",
    "Rg",
    "Cn",
    "Nh",
    "Fl",
    "Mc",
    "Lv",
    "Ts",
    "Og",
  ],
];

const lantánidos = [
  "La",
  "Ce",
  "Pr",
  "Nd",
  "Pm",
  "Sm",
  "Eu",
  "Gd",
  "Tb",
  "Dy",
  "Ho",
  "Er",
  "Tm",
  "Yb",
  "Lu",
];

const actínidos = [
  "Ac",
  "Th",
  "Pa",
  "U",
  "Np",
  "Pu",
  "Am",
  "Cm",
  "Bk",
  "Cf",
  "Es",
  "Fm",
  "Md",
  "No",
  "Lr",
];

function obtenerElemento(simbolo) {
  return elementos.find(
    (elemento) => elemento.simbolo === simbolo
  );
}

function TablaPeriodica({ abrirAtomo3D }) {
  const [
    elementoSeleccionado,
    setElementoSeleccionado,
  ] = useState(null);

  const [busqueda, setBusqueda] = useState("");

  const seleccionarElemento = (simbolo) => {
    if (
      !simbolo ||
      simbolo === "*" ||
      simbolo === "**"
    ) {
      return;
    }

    const elemento = obtenerElemento(simbolo);

    if (elemento) {
      setElementoSeleccionado(elemento);
    }
  };

  const buscarElemento = () => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return;
    }

    const encontrado = elementos.find(
      (elemento) =>
        elemento.simbolo.toLowerCase() === texto ||
        elemento.nombre.toLowerCase() === texto ||
        String(elemento.numero) === texto
    );

    if (encontrado) {
      setElementoSeleccionado(encontrado);
    }
  };

  return (
    <section className="vista-tabla-periodica">

      {/* =====================================
          CABECERA
          ===================================== */}

      <div className="tabla-titulo">

        <div>
          <h1>
            Tabla Periódica de los Elementos
          </h1>

          <p>
            Explora los 118 elementos químicos y
            consulta sus principales propiedades.
          </p>
        </div>

        <div className="buscador-elementos">

          <input
            type="text"
            placeholder="Buscar por nombre, símbolo o número..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                buscarElemento();
              }
            }}
          />

          <button onClick={buscarElemento}>
            Buscar
          </button>

        </div>

      </div>


      {/* =====================================
          TABLA PERIÓDICA
          ===================================== */}

      <div className="tabla-contenedor">

        <div className="tabla-periodica-grande">

          {periodos.map(
            (periodo, indicePeriodo) => (

              <div
                className="periodo-grande"
                key={indicePeriodo}
              >

                {periodo.map(
                  (simbolo, indice) => {

                    /*
                     * ESPACIOS VACÍOS
                     */

                    if (!simbolo) {
                      return (
                        <div
                          className="espacio-elemento"
                          key={`${indicePeriodo}-${indice}`}
                        />
                      );
                    }


                    /*
                     * LANTÁNIDOS / ACTÍNIDOS
                     */

                    if (
                      simbolo === "*" ||
                      simbolo === "**"
                    ) {

                      const serie =
                        simbolo === "*"
                          ? lantánidos
                          : actínidos;

                      return (
                        <button
                          className="casilla-serie"
                          key={`${indicePeriodo}-${indice}`}
                          onClick={() => {

                            const primerElemento =
                              obtenerElemento(
                                serie[0]
                              );

                            if (primerElemento) {
                              setElementoSeleccionado(
                                primerElemento
                              );
                            }

                          }}
                        >

                          {simbolo === "*"
                            ? "57–71"
                            : "89–103"}

                        </button>
                      );
                    }


                    /*
                     * ELEMENTO
                     */

                    const elemento =
                      obtenerElemento(simbolo);

                    return (
                      <button
                        className={`
                          casilla-elemento-grande
                          ${
                            elementoSeleccionado?.simbolo ===
                            simbolo
                              ? "elemento-seleccionado"
                              : ""
                          }
                        `}
                        key={simbolo}
                        onClick={() =>
                          seleccionarElemento(
                            simbolo
                          )
                        }
                      >

                        <span className="numero-elemento">
                          {elemento?.numero}
                        </span>

                        <strong>
                          {simbolo}
                        </strong>

                        <span className="nombre-elemento">
                          {elemento?.nombre}
                        </span>

                      </button>
                    );

                  }
                )}

              </div>

            )
          )}


          {/* =====================================
              SERIES SEPARADAS
              ===================================== */}

          <div className="series-separadas">

            {/* LANTÁNIDOS */}

            <div className="serie-fila">

              <span className="serie-etiqueta">
                Lantánidos
              </span>

              {lantánidos.map(
                (simbolo) => {

                  const elemento =
                    obtenerElemento(simbolo);

                  return (
                    <button
                      className={`
                        casilla-elemento-grande
                        ${
                          elementoSeleccionado?.simbolo ===
                          simbolo
                            ? "elemento-seleccionado"
                            : ""
                        }
                      `}
                      key={simbolo}
                      onClick={() =>
                        seleccionarElemento(
                          simbolo
                        )
                      }
                    >

                      <span className="numero-elemento">
                        {elemento?.numero}
                      </span>

                      <strong>
                        {simbolo}
                      </strong>

                      <span className="nombre-elemento">
                        {elemento?.nombre}
                      </span>

                    </button>
                  );
                }
              )}

            </div>


            {/* ACTÍNIDOS */}

            <div className="serie-fila">

              <span className="serie-etiqueta">
                Actínidos
              </span>

              {actínidos.map(
                (simbolo) => {

                  const elemento =
                    obtenerElemento(simbolo);

                  return (
                    <button
                      className={`
                        casilla-elemento-grande
                        ${
                          elementoSeleccionado?.simbolo ===
                          simbolo
                            ? "elemento-seleccionado"
                            : ""
                        }
                      `}
                      key={simbolo}
                      onClick={() =>
                        seleccionarElemento(
                          simbolo
                        )
                      }
                    >

                      <span className="numero-elemento">
                        {elemento?.numero}
                      </span>

                      <strong>
                        {simbolo}
                      </strong>

                      <span className="nombre-elemento">
                        {elemento?.nombre}
                      </span>

                    </button>
                  );
                }
              )}

            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          INFORMACIÓN DEL ELEMENTO
          ===================================== */}

      <div className="informacion-elemento">

        {elementoSeleccionado ? (

          <>

            {/* RESUMEN */}

            <div className="elemento-resumen">

              <div className="elemento-grande-simbolo">
                {elementoSeleccionado.simbolo}
              </div>

              <div>

                <span className="elemento-numero">
                  Número atómico{" "}
                  {elementoSeleccionado.numero}
                </span>

                <h2>
                  {elementoSeleccionado.nombre}
                </h2>

                <p className="categoria-elemento">
                  {elementoSeleccionado.categoria}
                </p>

              </div>

            </div>


            {/* DATOS QUÍMICOS */}

            <div className="datos-quimicos">

              <div className="dato-quimico">
                <span>
                  Masa atómica
                </span>

                <strong>
                  {elementoSeleccionado.masaAtomica}
                </strong>
              </div>


              <div className="dato-quimico">
                <span>
                  Grupo
                </span>

                <strong>
                  {elementoSeleccionado.grupo}
                </strong>
              </div>


              <div className="dato-quimico">
                <span>
                  Período
                </span>

                <strong>
                  {elementoSeleccionado.periodo}
                </strong>
              </div>


              <div className="dato-quimico">
                <span>
                  Bloque
                </span>

                <strong>
                  {elementoSeleccionado.bloque}
                </strong>
              </div>


              <div className="dato-quimico">
                <span>
                  Estado
                </span>

                <strong>
                  {elementoSeleccionado.estado}
                </strong>
              </div>


              <div className="dato-quimico">
                <span>
                  Electronegatividad
                </span>

                <strong>
                  {
                    elementoSeleccionado
                      .electronegatividad ??
                    "—"
                  }
                </strong>
              </div>


              <div className="dato-quimico">
                <span>
                  Protones
                </span>

                <strong>
                  {elementoSeleccionado.protones}
                </strong>
              </div>


              <div className="dato-quimico">
                <span>
                  Electrones
                </span>

                <strong>
                  {elementoSeleccionado.electrones}
                </strong>
              </div>


              <div className="dato-quimico">
                <span>
                  Neutrones aprox.
                </span>

                <strong>
                  {elementoSeleccionado.neutrones}
                </strong>
              </div>


              <div className="dato-quimico">
                <span>
                  Valencias
                </span>

                <strong>
                  {elementoSeleccionado.valencias}
                </strong>
              </div>

            </div>


            {/* CONFIGURACIÓN ELECTRÓNICA */}

            <div className="configuracion-electronica">

              <span>
                Configuración electrónica
              </span>

              <strong>
                {
                  elementoSeleccionado
                    .configuracionElectronica
                }
              </strong>

            </div>


            {/* ACCIONES */}

            <div className="acciones-elemento">

              <button
                onClick={() =>
                  abrirAtomo3D(elementoSeleccionado)
                }
              >
                Ver átomo 3D
              </button>

              <button>
                Construir molécula
              </button>

              <button>
                Usar en laboratorio
              </button>

            </div>

          </>

        ) : (

          <div className="sin-elemento">

            <h2>
              Selecciona un elemento
            </h2>

            <p>
              Haz clic sobre cualquiera de los
              118 elementos para comenzar a
              explorarlo.
            </p>

          </div>

        )}

      </div>

    </section>
  );
}

export default TablaPeriodica;