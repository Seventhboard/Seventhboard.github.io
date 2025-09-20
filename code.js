/* ===== ANIMACIÓN DEL TÍTULO ===== */
const tituloSelector = document.querySelector(".main_title");
const tituloTexto = tituloSelector.textContent;
tituloSelector.textContent = '';
let indiceTitulo = 0;
function mostrarLetra() {
    if (indiceTitulo < tituloTexto.length) {
        tituloSelector.textContent += tituloTexto.charAt(indiceTitulo);
        indiceTitulo++;
    }
}
const intervalo = setInterval(mostrarLetra, 100);
/* ===== GENERACIÓN DE ESTRELLAS ===== */
function crearEstrella() {
    const contenedorEstrellas = document.getElementById('div_stars');
    const estrella = document.createElement('div');
    estrella.classList.add('estrella');
    const posicionX = Math.random() * window.innerWidth;
    const posicionY = Math.random() * window.innerHeight;
    estrella.style.left = `${posicionX}px`;
    estrella.style.top = `${posicionY}px`;
    estrella.style.animation = `mover 6s linear infinite, parpadear 3s ease-in-out infinite`;
    contenedorEstrellas.appendChild(estrella);
}
// Crear 150 estrellas para el efecto de fondo
for (let i = 0; i < 150; i++) {
    crearEstrella();
}
/* ===== EFECTOS DE TRANSICIÓN ===== */
const efectoTransicion = document.querySelector('.div_transition');
document.addEventListener('click', () => {
    // Activa la animación de transición
    efectoTransicion.classList.add('transition_effect');
    // Desactiva la animación después de 250ms
    setTimeout(() => {
        efectoTransicion.classList.remove('transition_effect');
    }, 250);
});
/* ===== ESTELA DEL CURSOR ===== */
const contenedorEstela = document.querySelector(".div_estela");
let posicionAnteriorX, posicionAnteriorY;
const tiempoDesvanecimiento = 10; // Velocidad de desvanecimiento en milisegundos
const maximoPasos = 7; // Cantidad máxima de puntos intermedios
document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;
    // Calcular puntos intermedios para suavizar la estela
    if (posicionAnteriorX !== undefined && posicionAnteriorY !== undefined) {
        const distancia = Math.hypot(x - posicionAnteriorX, y - posicionAnteriorY);
        const pasos = Math.min(Math.ceil(distancia / 0.7), maximoPasos);
        const pasoX = (x - posicionAnteriorX) / pasos;
        const pasoY = (y - posicionAnteriorY) / pasos;
        let posicionActualX = posicionAnteriorX;
        let posicionActualY = posicionAnteriorY;
        for (let i = 0; i < pasos; i++) {
            const puntoIntermedio = document.createElement("div");
            puntoIntermedio.className = "estela-item";
            puntoIntermedio.style.left = `${posicionActualX}px`;
            puntoIntermedio.style.top = `${posicionActualY}px`;
            contenedorEstela.appendChild(puntoIntermedio);
            setTimeout(() => {
                puntoIntermedio.style.opacity = 0;
                setTimeout(() => {
                    puntoIntermedio.remove();
                }, tiempoDesvanecimiento);
            }, i * tiempoDesvanecimiento);
            posicionActualX += pasoX;
            posicionActualY += pasoY;
        }
    }
    // Crear punto principal de la estela
    const puntoEstela = document.createElement("div");
    puntoEstela.className = "estela-item";
    puntoEstela.style.left = `${x}px`;
    puntoEstela.style.top = `${y}px`;
    contenedorEstela.appendChild(puntoEstela);
    setTimeout(() => {
        puntoEstela.style.opacity = 0;
        setTimeout(() => {
            puntoEstela.remove();
        }, tiempoDesvanecimiento);
    }, 0);
    // Actualizar coordenadas anteriores
    posicionAnteriorX = x;
    posicionAnteriorY = y;
});
