import { useState } from "react";
import TablaPeriodica from "./views/TablaPeriodica";
import Atomo3D from "./views/Atomo3D";
import "./App.css";

function App() {
  const [vista, setVista] = useState("inicio");

  const [elementoSeleccionado, setElementoSeleccionado] = useState(null);

  const cambiarVista = (nuevaVista) => {
    setVista(nuevaVista);
  };

  const abrirAtomo3D = (elemento) => {
    setElementoSeleccionado(elemento);
    setVista("atomo3d");
  };

  const volverDesdeAtomo = () => {
    setVista("tabla");
  };

  return (
    <div className="aplicacion">

      <header className="encabezado-principal">

        <div className="marca">
          <div className="marca-icono">⚗</div>

          <div>
            <h1>Laboratorio Virtual de Química</h1>
            <p>Explora, experimenta y construye</p>
          </div>
        </div>

        <nav className="navegacion">

          <button
            className={vista === "inicio" ? "nav-activo" : ""}
            onClick={() => cambiarVista("inicio")}
          >
            Inicio
          </button>

          <button
            className={
              vista === "tabla" || vista === "atomo3d"
                ? "nav-activo"
                : ""
            }
            onClick={() => cambiarVista("tabla")}
          >
            Tabla Periódica
          </button>

          <button
            className={vista === "laboratorio" ? "nav-activo" : ""}
            onClick={() => cambiarVista("laboratorio")}
          >
            Laboratorio
          </button>

          <button
            className={vista === "moleculas" ? "nav-activo" : ""}
            onClick={() => cambiarVista("moleculas")}
          >
            Moléculas
          </button>

          <button
            className={vista === "reacciones" ? "nav-activo" : ""}
            onClick={() => cambiarVista("reacciones")}
          >
            Reacciones
          </button>

          <button
            className={vista === "aprender" ? "nav-activo" : ""}
            onClick={() => cambiarVista("aprender")}
          >
            Aprender
          </button>

          <button
            className={vista === "retos" ? "nav-activo" : ""}
            onClick={() => cambiarVista("retos")}
          >
            Retos
          </button>

        </nav>

      </header>


      <main className="contenido-principal">

        {/* =========================================
            INICIO
            ========================================= */}

        {vista === "inicio" && (
          <section className="vista-inicio">

            <div className="inicio-contenido">

              <span className="etiqueta-inicio">
                LABORATORIO VIRTUAL
              </span>

              <h2>
                Aprende química
                <br />
                experimentando
              </h2>

              <p>
                Explora los elementos químicos, observa modelos
                atómicos en 3D, construye moléculas y experimenta
                con reacciones químicas.
              </p>

              <div className="botones-inicio">

                <button
                  className="boton-principal"
                  onClick={() => cambiarVista("tabla")}
                >
                  Explorar tabla periódica
                </button>

                <button
                  className="boton-secundario"
                  onClick={() => cambiarVista("laboratorio")}
                >
                  Entrar al laboratorio
                </button>

              </div>

            </div>


            <div className="inicio-tarjetas">

              <div className="tarjeta-inicio">
                <span>⚛</span>

                <h3>Elementos</h3>

                <p>
                  Explora los 118 elementos de la tabla periódica.
                </p>
              </div>


              <div className="tarjeta-inicio">
                <span>◈</span>

                <h3>Moléculas</h3>

                <p>
                  Construye estructuras moleculares y observa
                  sus enlaces.
                </p>
              </div>


              <div className="tarjeta-inicio">
                <span>⚗</span>

                <h3>Experimentos</h3>

                <p>
                  Realiza experimentos químicos de manera virtual.
                </p>
              </div>

            </div>

          </section>
        )}


        {/* =========================================
            TABLA PERIÓDICA
            ========================================= */}

        {vista === "tabla" && (
          <TablaPeriodica
            abrirAtomo3D={abrirAtomo3D}
          />
        )}


        {/* =========================================
            ÁTOMO 3D
            ========================================= */}

        {vista === "atomo3d" && (
          <Atomo3D
            elemento={elementoSeleccionado}
            volver={volverDesdeAtomo}
          />
        )}


        {/* =========================================
            LABORATORIO
            ========================================= */}

        {vista === "laboratorio" && (
          <section className="vista-provisional">
            <h2>Laboratorio</h2>

            <p>
              Aquí construiremos el laboratorio 3D.
            </p>
          </section>
        )}


        {/* =========================================
            MOLÉCULAS
            ========================================= */}

        {vista === "moleculas" && (
          <section className="vista-provisional">
            <h2>Constructor de Moléculas</h2>

            <p>
              Aquí construiremos el sistema para crear moléculas.
            </p>
          </section>
        )}


        {/* =========================================
            REACCIONES
            ========================================= */}

        {vista === "reacciones" && (
          <section className="vista-provisional">
            <h2>Reacciones Químicas</h2>

            <p>
              Aquí simularemos las reacciones químicas.
            </p>
          </section>
        )}


        {/* =========================================
            APRENDER
            ========================================= */}

        {vista === "aprender" && (
          <section className="vista-provisional">
            <h2>Aprender Química</h2>

            <p>
              Aquí estarán las lecciones y contenidos educativos.
            </p>
          </section>
        )}


        {/* =========================================
            RETOS
            ========================================= */}

        {vista === "retos" && (
          <section className="vista-provisional">
            <h2>Retos</h2>

            <p>
              Aquí construiremos los desafíos de química.
            </p>
          </section>
        )}

      </main>


      <footer className="pie-principal">

        <span>Laboratorio Virtual de Química</span>

        <span>•</span>

        <span>118 elementos químicos</span>

      </footer>

    </div>
  );
}

export default App;