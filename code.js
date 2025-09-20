const titulo_selector = document.querySelector(".main_title")
let titulo = titulo_selector.textContent
titulo.textContent = '';
titulo_selector.textContent = '';

//index para la animacion del titulo//
let index = 0;

function mostrarLetra() {
  if (index < titulo.length) {
    titulo_selector.textContent += titulo.charAt(index);
    index++;
  }
}
const intervalo = setInterval(mostrarLetra, 100);

//Hasta aqui bien la animacion de las letras//


//Hasta aqui todo bien con las lineas//


//Ahora con las estrellas//
function crearEstrella() {
  const estrella_selector = document.getElementById('div_stars');
  const estrella = document.createElement('div');
  estrella.classList.add('estrella');

  const randomPosX = Math.random() * window.innerWidth;
  const randomPosY = Math.random() * window.innerHeight;

  estrella.style.left = `${randomPosX}px`;
  estrella.style.top = `${randomPosY}px`;
  estrella.style.animation = `mover 6s linear infinite, parpadear 3s ease-in-out infinite`;

  estrella_selector.appendChild(estrella);
}

for (let i = 0; i < 150; i++) {
  crearEstrella();
}

// Captura el elemento de efecto de transición
const transitionEffect = document.querySelector('.div_transition');

// Agrega un evento de clic al documento
document.addEventListener('click', () => {
    // Activa la animación al agregar una clase
    transitionEffect.classList.add('transition_effect');

    // Espera un tiempo para detener la animación
    setTimeout(() => {
        // Detiene la animación al quitar la clase
        transitionEffect.classList.remove('transition_effect');
    }, 250); // Cambia este valor para ajustar la duración de la animación
});



// JavaScript en codigo.js
const estela_selector = document.querySelector(".div_estela");

let prevX, prevY;
let fadingTime = 10; // Ajusta la velocidad de desvanecimiento (en milisegundos)
let maxSteps = 7; // Ajusta la cantidad máxima de puntos intermedios

document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // Calcular puntos intermedios para suavizar y acortar la estela
    if (prevX !== undefined && prevY !== undefined) {
        const distance = Math.hypot(x - prevX, y - prevY);
        const steps = Math.min(Math.ceil(distance / 0.7), maxSteps); // Limita la cantidad de puntos intermedios
        const stepX = (x - prevX) / steps;
        const stepY = (y - prevY) / steps;

        let currentX = prevX;
        let currentY = prevY;

        for (let i = 0; i < steps; i++) {
            const intermediateEstela = document.createElement("div");
            intermediateEstela.className = "estela-item";
            intermediateEstela.style.left = `${currentX}px`;
            intermediateEstela.style.top = `${currentY}px`;
            estela_selector.appendChild(intermediateEstela);

            setTimeout(() => {
                intermediateEstela.style.opacity = 0;
                setTimeout(() => {
                    intermediateEstela.remove();
                }, fadingTime);
            }, i * fadingTime);

            currentX += stepX;
            currentY += stepY;
        }
    }

    const estela = document.createElement("div");
    estela.className = "estela-item";
    estela.style.left = `${x}px`;
    estela.style.top = `${y}px`;

    estela_selector.appendChild(estela);

    setTimeout(() => {
        estela.style.opacity = 0;
        setTimeout(() => {
            estela.remove();
        }, fadingTime);
    }, 0);

    // Actualizar las coordenadas anteriores
    prevX = x;
    prevY = y;
});











