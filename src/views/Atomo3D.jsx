import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./Atomo3D.css";

function Atomo3D({ elemento, volver }) {
  const contenedorRef = useRef(null);

  useEffect(() => {
    if (!contenedorRef.current || !elemento) return;

    const contenedor = contenedorRef.current;

    // =========================================
    // ESCENA
    // =========================================

    const escena = new THREE.Scene();

    escena.background = new THREE.Color(0xf4f7fb);


    // =========================================
    // CÁMARA
    // =========================================

    const camara = new THREE.PerspectiveCamera(
  45,
  contenedor.clientWidth / contenedor.clientHeight,
  0.1,
  1000
);

camara.position.set(0, 0, 12);

camara.lookAt(0, 0, 0);

    // =========================================
    // RENDERIZADOR
    // =========================================

    const renderizador = new THREE.WebGLRenderer({
      antialias: true,
    });

    renderizador.setPixelRatio(window.devicePixelRatio);

    renderizador.setSize(
      contenedor.clientWidth,
      contenedor.clientHeight
    );

    contenedor.appendChild(renderizador.domElement);


    // =========================================
    // ILUMINACIÓN
    // =========================================

    const luzAmbiente = new THREE.AmbientLight(
      0xffffff,
      2
    );

    escena.add(luzAmbiente);


    const luzPrincipal = new THREE.PointLight(
      0xffffff,
      3
    );

    luzPrincipal.position.set(5, 6, 8);

    escena.add(luzPrincipal);


    // =========================================
    // NÚCLEO
    // =========================================

    const grupoNucleo = new THREE.Group();

    escena.add(grupoNucleo);


    // =========================================
    // PROTONES
    // =========================================

    const protonGeometria = new THREE.SphereGeometry(
      0.32,
      24,
      24
    );

    const protonMaterial = new THREE.MeshStandardMaterial({
      color: 0xd94f4f,
      roughness: 0.35,
      metalness: 0.05,
    });


    // =========================================
    // NEUTRONES
    // =========================================

    const neutronGeometria = new THREE.SphereGeometry(
      0.32,
      24,
      24
    );

    const neutronMaterial = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.35,
      metalness: 0.05,
    });


    // =========================================
    // CONSTRUCCIÓN DEL NÚCLEO
    // =========================================

    const protones = elemento.protones || elemento.numero || 0;

    const neutrones =
      elemento.neutrones ||
      Math.round(
        (elemento.masaAtomica || elemento.numero || 0) -
        protones
      );


    // Protones

    for (let i = 0; i < protones; i++) {
      const proton = new THREE.Mesh(
        protonGeometria,
        protonMaterial
      );

      const angulo = i * 2.39996;

      const radio = 0.75 + (i % 3) * 0.25;

      proton.position.set(
        Math.cos(angulo) * radio,
        Math.sin(angulo * 1.3) * radio,
        Math.sin(angulo) * radio
      );

      grupoNucleo.add(proton);
    }


    // Neutrones

    for (let i = 0; i < neutrones; i++) {
      const neutron = new THREE.Mesh(
        neutronGeometria,
        neutronMaterial
      );

      const indice = i + protones;

      const angulo = indice * 2.39996;

      const radio = 0.65 + (i % 3) * 0.28;

      neutron.position.set(
        Math.cos(angulo) * radio,
        Math.sin(angulo * 1.4) * radio,
        Math.sin(angulo) * radio
      );

      grupoNucleo.add(neutron);
    }


    // =========================================
    // ELECTRONES
    // =========================================

    const grupoElectrones = new THREE.Group();

    escena.add(grupoElectrones);


    const electronGeometria = new THREE.SphereGeometry(
      0.12,
      16,
      16
    );

    const electronMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      emissive: 0x0f3b82,
      emissiveIntensity: 0.5,
    });


    const electrones =
      elemento.electrones ||
      elemento.numero ||
      0;


    // =========================================
    // DISTRIBUCIÓN POR CAPAS
    // =========================================

    const capacidades = [2, 8, 18, 32, 32, 18, 8];

    let electronesRestantes = electrones;

    let capa = 0;

    while (
      electronesRestantes > 0 &&
      capa < capacidades.length
    ) {
      const cantidad = Math.min(
        electronesRestantes,
        capacidades[capa]
      );

      const radio = 2.1 + capa * 0.75;

      const velocidad = 0.003 + capa * 0.0005;

      const grupoCapa = new THREE.Group();

      grupoElectrones.add(grupoCapa);

      for (let i = 0; i < cantidad; i++) {
        const electron = new THREE.Mesh(
          electronGeometria,
          electronMaterial
        );

        const angulo =
          (i / cantidad) * Math.PI * 2;

        electron.position.set(
          Math.cos(angulo) * radio,
          0,
          Math.sin(angulo) * radio
        );

        electron.userData.anguloInicial = angulo;
        electron.userData.radio = radio;
        electron.userData.velocidad = velocidad;

        grupoCapa.add(electron);
      }

      grupoCapa.rotation.x =
        capa * 0.35;

      grupoCapa.rotation.z =
        capa * 0.2;

      grupoCapa.userData.velocidad =
        velocidad;

      capa++;

      electronesRestantes -= cantidad;
    }


    // =========================================
    // ÓRBITAS VISUALES
    // =========================================

    const gruposOrbitas = [];

    const numeroCapas =
      Math.min(
        capacidades.length,
        Math.max(
          1,
          Math.ceil(
            electrones /
            2
          )
        )
      );


    for (let i = 0; i < numeroCapas; i++) {
      const radio = 2.1 + i * 0.75;

      const curva = new THREE.EllipseCurve(
        0,
        0,
        radio,
        radio,
        0,
        Math.PI * 2,
        false,
        0
      );

      const puntos =
        curva.getPoints(100);

      const geometria =
        new THREE.BufferGeometry().setFromPoints(
          puntos.map(
            (punto) =>
              new THREE.Vector3(
                punto.x,
                0,
                punto.y
              )
          )
        );

      const material =
        new THREE.LineBasicMaterial({
          color: 0x94a3b8,
          transparent: true,
          opacity: 0.45,
        });

      const orbita =
        new THREE.LineLoop(
          geometria,
          material
        );

      orbita.rotation.x =
        i * 0.35;

      orbita.rotation.z =
        i * 0.2;

      escena.add(orbita);

      gruposOrbitas.push(orbita);
    }


    // =========================================
    // CONTROLES MANUALES
    // =========================================

    let rotacionX = 0;
    let rotacionY = 0;

    let arrastrando = false;

    let posicionAnteriorX = 0;
    let posicionAnteriorY = 0;


    const iniciarMovimiento = (evento) => {
      arrastrando = true;

      posicionAnteriorX =
        evento.clientX;

      posicionAnteriorY =
        evento.clientY;
    };


    const terminarMovimiento = () => {
      arrastrando = false;
    };


    const mover = (evento) => {
      if (!arrastrando) return;

      const diferenciaX =
        evento.clientX -
        posicionAnteriorX;

      const diferenciaY =
        evento.clientY -
        posicionAnteriorY;

      rotacionY +=
        diferenciaX * 0.01;

      rotacionX +=
        diferenciaY * 0.01;

      rotacionX = Math.max(
        -1.2,
        Math.min(
          1.2,
          rotacionX
        )
      );

      posicionAnteriorX =
        evento.clientX;

      posicionAnteriorY =
        evento.clientY;
    };


    renderizador.domElement.addEventListener(
      "pointerdown",
      iniciarMovimiento
    );

    window.addEventListener(
      "pointerup",
      terminarMovimiento
    );

    window.addEventListener(
      "pointermove",
      mover
    );


    // =========================================
    // ANIMACIÓN
    // =========================================

    let animacion;


    const animar = () => {
      animacion =
        requestAnimationFrame(animar);


      // Movimiento de los electrones

      grupoElectrones.children.forEach(
        (grupoCapa) => {
          grupoCapa.rotation.y +=
            grupoCapa.userData.velocidad;
        }
      );


      // Movimiento suave del núcleo

      grupoNucleo.rotation.y +=
        0.0015;


      // Rotación general controlada

      escena.rotation.y =
        rotacionY;

      escena.rotation.x =
        rotacionX;


      renderizador.render(
        escena,
        camara
      );
    };


    animar();


    // =========================================
    // REDIMENSIONAMIENTO
    // =========================================

    const cambiarTamaño = () => {
      if (!contenedor) return;

      const ancho =
        contenedor.clientWidth;

      const alto =
        contenedor.clientHeight;

      camara.aspect =
        ancho / alto;

      camara.updateProjectionMatrix();

      renderizador.setSize(
        ancho,
        alto
      );
    };


    window.addEventListener(
      "resize",
      cambiarTamaño
    );


    // =========================================
    // LIMPIEZA
    // =========================================

    return () => {
      cancelAnimationFrame(
        animacion
      );

      window.removeEventListener(
        "resize",
        cambiarTamaño
      );

      renderizador.domElement.removeEventListener(
        "pointerdown",
        iniciarMovimiento
      );

      window.removeEventListener(
        "pointerup",
        terminarMovimiento
      );

      window.removeEventListener(
        "pointermove",
        mover
      );

      protonGeometria.dispose();
      protonMaterial.dispose();

      neutronGeometria.dispose();
      neutronMaterial.dispose();

      electronGeometria.dispose();
      electronMaterial.dispose();

      renderizador.dispose();

      if (
        contenedor.contains(
          renderizador.domElement
        )
      ) {
        contenedor.removeChild(
          renderizador.domElement
        );
      }
    };
  }, [elemento]);


  // =========================================
  // SIN ELEMENTO
  // =========================================

  if (!elemento) {
    return (
      <section className="vista-atomo3d">
        <div className="atomo3d-vacio">
          <h2>No hay elemento seleccionado</h2>

          <p>
            Selecciona un elemento de la tabla periódica
            para visualizar su modelo.
          </p>

          <button
            onClick={volver}
            className="boton-volver-atomo"
          >
            Volver a la tabla periódica
          </button>
        </div>
      </section>
    );
  }


  // =========================================
  // INTERFAZ
  // =========================================

  return (
    <section className="vista-atomo3d">

      <div className="encabezado-atomo3d">

        <div>
          <button
            onClick={volver}
            className="boton-volver-atomo"
          >
            ← Volver
          </button>

          <p className="etiqueta-atomo">
            MODELO VISUAL SIMPLIFICADO
          </p>

          <h2>
            Átomo de {elemento.nombre}
          </h2>

          <p>
            Visualización tridimensional del átomo de{" "}
            <strong>
              {elemento.simbolo}
            </strong>
            .
          </p>
        </div>


        <div className="resumen-atomo">

          <div>
            <span>Símbolo</span>
            <strong>
              {elemento.simbolo}
            </strong>
          </div>

          <div>
            <span>Protones</span>
            <strong>
              {elemento.protones}
            </strong>
          </div>

          <div>
            <span>Neutrones</span>
            <strong>
              {elemento.neutrones}
            </strong>
          </div>

          <div>
            <span>Electrones</span>
            <strong>
              {elemento.electrones}
            </strong>
          </div>

        </div>

      </div>


      <div
        ref={contenedorRef}
        className="contenedor-atomo3d"
      />


      <div className="leyenda-atomo3d">

        <div>
          <span className="punto-leyenda proton" />
          <span>Protón</span>
        </div>

        <div>
          <span className="punto-leyenda neutron" />
          <span>Neutrón</span>
        </div>

        <div>
          <span className="punto-leyenda electron" />
          <span>Electrón</span>
        </div>

        <p>
          Puedes arrastrar el modelo para observarlo
          desde diferentes ángulos.
        </p>

      </div>

    </section>
  );
}

export default Atomo3D;