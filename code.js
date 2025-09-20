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
    // Desactiva la animación después de 250ms y muestra la hoja de personaje
    setTimeout(() => {
        efectoTransicion.classList.remove('transition_effect');
        mostrarHojaPersonaje();
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

/* ===== CLASES CRUD PARA EL SISTEMA DE ROL ===== */

// Clase base para habilidades, vestigios y estigmas
class HabilidadBase {
    constructor(nombre, descripcion, tipoDano, gasto, danoAdicional = 0) {
        this.id = Date.now() + Math.random(); // ID único
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.tipoDano = tipoDano; // 'fisico', 'magico', 'mixto', 'impacto'
        this.gasto = gasto; // { energia: number, resonancia: number }
        this.danoAdicional = danoAdicional; // 1-10
    }

    // Método para obtener información del gasto
    getGastoInfo() {
        const gastos = [];
        if (this.gasto.energia > 0) gastos.push(`${this.gasto.energia} Energía`);
        if (this.gasto.resonancia > 0) gastos.push(`${this.gasto.resonancia} Resonancia`);
        return gastos.join(', ');
    }

    // Método para obtener información completa
    getInfoCompleta() {
        return {
            id: this.id,
            nombre: this.nombre,
            descripcion: this.descripcion,
            tipoDano: this.tipoDano,
            gasto: this.gasto,
            danoAdicional: this.danoAdicional,
            gastoInfo: this.getGastoInfo()
        };
    }
}

// Clase para Vestigios
class Vestigio extends HabilidadBase {
    constructor(nombre, descripcion, tipoDano, gasto, danoAdicional = 0) {
        super(nombre, descripcion, tipoDano, gasto, danoAdicional);
        this.tipo = 'vestigio';
    }
}

// Clase para Estigmas
class Estigma extends HabilidadBase {
    constructor(nombre, descripcion, tipoDano, gasto, danoAdicional = 0) {
        super(nombre, descripcion, tipoDano, gasto, danoAdicional);
        this.tipo = 'estigma';
    }
}

// Clase para Habilidades
class Habilidad extends HabilidadBase {
    constructor(nombre, descripcion, tipoDano, gasto, danoAdicional = 0) {
        super(nombre, descripcion, tipoDano, gasto, danoAdicional);
        this.tipo = 'habilidad';
    }
}

// Clase para Rastros (habilidades pasivas)
class Rastro extends HabilidadBase {
    constructor(nombre, descripcion, tipoDano = 'pasivo', gasto = { energia: 0, resonancia: 0 }, danoAdicional = 0) {
        super(nombre, descripcion, tipoDano, gasto, danoAdicional);
        this.tipo = 'rastro';
    }
}

// Clase CRUD para gestionar las habilidades
class HabilidadCRUD {
    constructor() {
        this.vestigios = [];
        this.estigmas = [];
        this.habilidades = [];
        this.rastros = [];
    }

    // Métodos para Vestigios
    crearVestigio(nombre, descripcion, tipoDano, gasto, danoAdicional = 0) {
        const vestigio = new Vestigio(nombre, descripcion, tipoDano, gasto, danoAdicional);
        this.vestigios.push(vestigio);
        return vestigio;
    }

    obtenerVestigio(id) {
        return this.vestigios.find(v => v.id === id);
    }

    actualizarVestigio(id, datos) {
        const index = this.vestigios.findIndex(v => v.id === id);
        if (index !== -1) {
            this.vestigios[index] = { ...this.vestigios[index], ...datos };
            return this.vestigios[index];
        }
        return null;
    }

    eliminarVestigio(id) {
        const index = this.vestigios.findIndex(v => v.id === id);
        if (index !== -1) {
            return this.vestigios.splice(index, 1)[0];
        }
        return null;
    }

    // Métodos para Estigmas
    crearEstigma(nombre, descripcion, tipoDano, gasto, danoAdicional = 0) {
        const estigma = new Estigma(nombre, descripcion, tipoDano, gasto, danoAdicional);
        this.estigmas.push(estigma);
        return estigma;
    }

    obtenerEstigma(id) {
        return this.estigmas.find(e => e.id === id);
    }

    actualizarEstigma(id, datos) {
        const index = this.estigmas.findIndex(e => e.id === id);
        if (index !== -1) {
            this.estigmas[index] = { ...this.estigmas[index], ...datos };
            return this.estigmas[index];
        }
        return null;
    }

    eliminarEstigma(id) {
        const index = this.estigmas.findIndex(e => e.id === id);
        if (index !== -1) {
            return this.estigmas.splice(index, 1)[0];
        }
        return null;
    }

    // Métodos para Habilidades
    crearHabilidad(nombre, descripcion, tipoDano, gasto, danoAdicional = 0) {
        const habilidad = new Habilidad(nombre, descripcion, tipoDano, gasto, danoAdicional);
        this.habilidades.push(habilidad);
        return habilidad;
    }

    obtenerHabilidad(id) {
        return this.habilidades.find(h => h.id === id);
    }

    actualizarHabilidad(id, datos) {
        const index = this.habilidades.findIndex(h => h.id === id);
        if (index !== -1) {
            this.habilidades[index] = { ...this.habilidades[index], ...datos };
            return this.habilidades[index];
        }
        return null;
    }

    eliminarHabilidad(id) {
        const index = this.habilidades.findIndex(h => h.id === id);
        if (index !== -1) {
            return this.habilidades.splice(index, 1)[0];
        }
        return null;
    }

    // Métodos para Rastros
    crearRastro(nombre, descripcion, tipoDano = 'pasivo', gasto = { energia: 0, resonancia: 0 }, danoAdicional = 0) {
        const rastro = new Rastro(nombre, descripcion, tipoDano, gasto, danoAdicional);
        this.rastros.push(rastro);
        return rastro;
    }

    obtenerRastro(id) {
        return this.rastros.find(r => r.id === id);
    }

    actualizarRastro(id, datos) {
        const index = this.rastros.findIndex(r => r.id === id);
        if (index !== -1) {
            this.rastros[index] = { ...this.rastros[index], ...datos };
            return this.rastros[index];
        }
        return null;
    }

    eliminarRastro(id) {
        const index = this.rastros.findIndex(r => r.id === id);
        if (index !== -1) {
            return this.rastros.splice(index, 1)[0];
        }
        return null;
    }

    // Método para obtener todos los vestigios y estigmas para el selector
    obtenerTodosPoderes() {
        return [...this.vestigios, ...this.estigmas];
    }

    // Método para guardar en localStorage
    guardarEnLocalStorage() {
        const datos = {
            vestigios: this.vestigios,
            estigmas: this.estigmas,
            habilidades: this.habilidades,
            rastros: this.rastros
        };
        localStorage.setItem('vc_system_habilidades', JSON.stringify(datos));
    }

    // Método para cargar desde localStorage
    cargarDesdeLocalStorage() {
        const datos = localStorage.getItem('vc_system_habilidades');
        if (datos) {
            const parsed = JSON.parse(datos);
            this.vestigios = parsed.vestigios || [];
            this.estigmas = parsed.estigmas || [];
            this.habilidades = parsed.habilidades || [];
            this.rastros = parsed.rastros || [];
        }
    }
}

// Instancia global del CRUD
const habilidadCRUD = new HabilidadCRUD();

/* ===== LÓGICA DE LA HOJA DE PERSONAJE ===== */

// Variables globales para la hoja de personaje
let modalActual = null;
let editandoItem = null;

// Función para mostrar/ocultar la hoja de personaje
function mostrarHojaPersonaje() {
    const mainSection = document.getElementById('main_section');
    const characterSheet = document.getElementById('character_sheet');
    
    mainSection.style.display = 'none';
    characterSheet.style.display = 'block';
    
    // Cargar datos guardados
    cargarDatosPersonaje();
    actualizarListas();
}

function ocultarHojaPersonaje() {
    const mainSection = document.getElementById('main_section');
    const characterSheet = document.getElementById('character_sheet');
    
    characterSheet.style.display = 'none';
    mainSection.style.display = 'block';
}

// Función para crear y mostrar modal
function mostrarModal(titulo, tipo, itemId = null) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modal_' + tipo;
    
    const esEdicion = itemId !== null;
    const item = itemId ? obtenerItemPorId(tipo, itemId) : null;
    
    modal.innerHTML = `
        <div class="modal_content">
            <div class="modal_header">
                <h3 class="modal_title">${esEdicion ? 'Editar' : 'Agregar'} ${titulo}</h3>
                <button class="close_modal">&times;</button>
            </div>
            <form class="modal_form" id="form_${tipo}">
                <div class="form_row">
                    <div class="form_group">
                        <label for="nombre_${tipo}">Nombre:</label>
                        <input type="text" id="nombre_${tipo}" required value="${item ? item.nombre : ''}">
                    </div>
                    <div class="form_group">
                        <label for="tipo_dano_${tipo}">Tipo de Daño:</label>
                        <select id="tipo_dano_${tipo}" required>
                            <option value="fisico" ${item && item.tipoDano === 'fisico' ? 'selected' : ''}>Físico</option>
                            <option value="magico" ${item && item.tipoDano === 'magico' ? 'selected' : ''}>Mágico</option>
                            <option value="mixto" ${item && item.tipoDano === 'mixto' ? 'selected' : ''}>Mixto</option>
                            <option value="impacto" ${item && item.tipoDano === 'impacto' ? 'selected' : ''}>Impacto</option>
                            <option value="pasivo" ${item && item.tipoDano === 'pasivo' ? 'selected' : ''}>Pasivo</option>
                        </select>
                    </div>
                </div>
                <div class="form_group">
                    <label for="descripcion_${tipo}">Descripción:</label>
                    <textarea id="descripcion_${tipo}" rows="3" required>${item ? item.descripcion : ''}</textarea>
                </div>
                <div class="form_row">
                    <div class="form_group">
                        <label for="energia_${tipo}">Gasto de Energía:</label>
                        <input type="number" id="energia_${tipo}" min="0" value="${item ? item.gasto.energia : 0}">
                    </div>
                    <div class="form_group">
                        <label for="resonancia_${tipo}">Gasto de Resonancia:</label>
                        <input type="number" id="resonancia_${tipo}" min="0" value="${item ? item.gasto.resonancia : 0}">
                    </div>
                </div>
                <div class="form_group">
                    <label for="dano_adicional_${tipo}">Daño Adicional (1-10):</label>
                    <input type="number" id="dano_adicional_${tipo}" min="0" max="10" value="${item ? item.danoAdicional : 0}">
                </div>
                <div class="modal_actions">
                    <button type="button" class="cancel_button">Cancelar</button>
                    <button type="submit" class="save_button">${esEdicion ? 'Actualizar' : 'Guardar'}</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    modalActual = modal;
    editandoItem = itemId;
    
    // Event listeners para el modal
    modal.querySelector('.close_modal').addEventListener('click', cerrarModal);
    modal.querySelector('.cancel_button').addEventListener('click', cerrarModal);
    modal.querySelector('.modal').addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });
    
    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        guardarItem(tipo, esEdicion);
    });
}

// Función para cerrar modal
function cerrarModal() {
    if (modalActual) {
        modalActual.remove();
        modalActual = null;
        editandoItem = null;
    }
}

// Función para obtener item por ID
function obtenerItemPorId(tipo, id) {
    switch (tipo) {
        case 'vestigio':
            return habilidadCRUD.obtenerVestigio(id);
        case 'estigma':
            return habilidadCRUD.obtenerEstigma(id);
        case 'habilidad':
            return habilidadCRUD.obtenerHabilidad(id);
        case 'rastro':
            return habilidadCRUD.obtenerRastro(id);
        default:
            return null;
    }
}

// Función para guardar item
function guardarItem(tipo, esEdicion) {
    const form = document.getElementById(`form_${tipo}`);
    const nombre = form.querySelector(`#nombre_${tipo}`).value;
    const descripcion = form.querySelector(`#descripcion_${tipo}`).value;
    const tipoDano = form.querySelector(`#tipo_dano_${tipo}`).value;
    const energia = parseInt(form.querySelector(`#energia_${tipo}`).value) || 0;
    const resonancia = parseInt(form.querySelector(`#resonancia_${tipo}`).value) || 0;
    const danoAdicional = parseInt(form.querySelector(`#dano_adicional_${tipo}`).value) || 0;
    
    const gasto = { energia, resonancia };
    
    if (esEdicion) {
        // Actualizar item existente
        switch (tipo) {
            case 'vestigio':
                habilidadCRUD.actualizarVestigio(editandoItem, { nombre, descripcion, tipoDano, gasto, danoAdicional });
                break;
            case 'estigma':
                habilidadCRUD.actualizarEstigma(editandoItem, { nombre, descripcion, tipoDano, gasto, danoAdicional });
                break;
            case 'habilidad':
                habilidadCRUD.actualizarHabilidad(editandoItem, { nombre, descripcion, tipoDano, gasto, danoAdicional });
                break;
            case 'rastro':
                habilidadCRUD.actualizarRastro(editandoItem, { nombre, descripcion, tipoDano, gasto, danoAdicional });
                break;
        }
    } else {
        // Crear nuevo item
        switch (tipo) {
            case 'vestigio':
                habilidadCRUD.crearVestigio(nombre, descripcion, tipoDano, gasto, danoAdicional);
                break;
            case 'estigma':
                habilidadCRUD.crearEstigma(nombre, descripcion, tipoDano, gasto, danoAdicional);
                break;
            case 'habilidad':
                habilidadCRUD.crearHabilidad(nombre, descripcion, tipoDano, gasto, danoAdicional);
                break;
            case 'rastro':
                habilidadCRUD.crearRastro(nombre, descripcion, tipoDano, gasto, danoAdicional);
                break;
        }
    }
    
    habilidadCRUD.guardarEnLocalStorage();
    actualizarListas();
    cerrarModal();
}

// Función para eliminar item
function eliminarItem(tipo, id) {
    if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
        switch (tipo) {
            case 'vestigio':
                habilidadCRUD.eliminarVestigio(id);
                break;
            case 'estigma':
                habilidadCRUD.eliminarEstigma(id);
                break;
            case 'habilidad':
                habilidadCRUD.eliminarHabilidad(id);
                break;
            case 'rastro':
                habilidadCRUD.eliminarRastro(id);
                break;
        }
        habilidadCRUD.guardarEnLocalStorage();
        actualizarListas();
    }
}

// Función para crear elemento de lista
function crearElementoLista(item, tipo) {
    const elemento = document.createElement('div');
    elemento.className = 'ability_item';
    elemento.innerHTML = `
        <div class="ability_info">
            <div class="ability_name">${item.nombre}</div>
            <div class="ability_description">${item.descripcion}</div>
            <div class="ability_stats">
                Tipo: ${item.tipoDano} | Gasto: ${item.getGastoInfo()} | Daño: +${item.danoAdicional}
            </div>
        </div>
        <div class="ability_actions">
            <button class="edit_button" onclick="mostrarModal('${tipo}', '${tipo}', ${item.id})">Editar</button>
            <button class="delete_button" onclick="eliminarItem('${tipo}', ${item.id})">Eliminar</button>
        </div>
    `;
    return elemento;
}

// Función para actualizar todas las listas
function actualizarListas() {
    // Actualizar selector de estigma/vestigio
    const selector = document.getElementById('estigma_vestigio');
    selector.innerHTML = '<option value="">Seleccionar poder principal</option>';
    
    const todosPoderes = habilidadCRUD.obtenerTodosPoderes();
    todosPoderes.forEach(poder => {
        const option = document.createElement('option');
        option.value = poder.id;
        option.textContent = `${poder.nombre} (${poder.tipo})`;
        selector.appendChild(option);
    });
    
    // Actualizar lista de rastros
    const rastrosList = document.getElementById('rastros_list');
    rastrosList.innerHTML = '';
    habilidadCRUD.rastros.forEach(rastro => {
        rastrosList.appendChild(crearElementoLista(rastro, 'rastro'));
    });
    
    // Actualizar lista de habilidades
    const habilidadesList = document.getElementById('habilidades_list');
    habilidadesList.innerHTML = '';
    habilidadCRUD.habilidades.forEach(habilidad => {
        habilidadesList.appendChild(crearElementoLista(habilidad, 'habilidad'));
    });
}

// Función para calcular atributos derivados
function calcularAtributosDerivados() {
    const fuerza = parseInt(document.getElementById('fuerza').value) || 0;
    const destreza = parseInt(document.getElementById('destreza').value) || 0;
    const vitalidad = parseInt(document.getElementById('vitalidad').value) || 0;
    const eco = parseInt(document.getElementById('eco').value) || 0;
    
    // Atributos específicos
    document.getElementById('impacto').value = fuerza + destreza;
    document.getElementById('control_masas').value = fuerza + vitalidad;
    
    // Capacidades de daño
    document.getElementById('ataque').value = fuerza;
    document.getElementById('poder').value = eco;
    document.getElementById('imbuir').value = eco + fuerza;
    
    // Capacidades defensivas
    document.getElementById('defensa').value = vitalidad;
    document.getElementById('cancelacion').value = eco;
    document.getElementById('aura').value = eco + vitalidad;
    
    // Recursos vitales
    document.getElementById('vida_base').value = vitalidad * 2;
    document.getElementById('energia_base').value = vitalidad * 5;
    document.getElementById('resonancia_base').value = eco * 5;
    
    // Actualizar valores actuales si no están establecidos
    const vidaActual = document.getElementById('vida_actual');
    const energiaActual = document.getElementById('energia_actual');
    const resonanciaActual = document.getElementById('resonancia_actual');
    
    if (!vidaActual.value || vidaActual.value === '0') {
        vidaActual.value = vitalidad * 2;
    }
    if (!energiaActual.value || energiaActual.value === '0') {
        energiaActual.value = vitalidad * 5;
    }
    if (!resonanciaActual.value || resonanciaActual.value === '0') {
        resonanciaActual.value = eco * 5;
    }
}

// Función para validar atributos principales
function validarAtributoPrincipal(input) {
    const valor = parseInt(input.value);
    if (valor < 1) {
        input.value = 1;
    } else if (valor > 100) {
        input.value = 100;
    }
    calcularAtributosDerivados();
}

// Función para cargar datos del personaje desde localStorage
function cargarDatosPersonaje() {
    const datos = localStorage.getItem('vc_system_personaje');
    if (datos) {
        const personaje = JSON.parse(datos);
        Object.keys(personaje).forEach(key => {
            const elemento = document.getElementById(key);
            if (elemento) {
                elemento.value = personaje[key];
            }
        });
    }
    // Calcular atributos derivados después de cargar
    calcularAtributosDerivados();
}

// Función para guardar datos del personaje
function guardarDatosPersonaje() {
    const campos = [
        'apodo', 'trasfondo', 'aspecto_exclusivo', 'rasgos', 'nivel', 'validez', 'constelacion',
        'fuerza', 'destreza', 'vitalidad', 'eco', 'comprension', 'clarividencia',
        'vida_actual', 'energia_actual', 'resonancia_actual', 'maratones', 'heridas'
    ];
    const datos = {};
    
    campos.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) {
            datos[campo] = elemento.value;
        }
    });
    
    // Guardar listas dinámicas
    const listas = ['cronicas_list', 'vinculos_list', 'conexiones_list'];
    listas.forEach(lista => {
        const elementos = document.querySelectorAll(`#${lista} .ability_item`);
        datos[lista] = Array.from(elementos).map(el => ({
            nombre: el.querySelector('.ability_name').textContent,
            descripcion: el.querySelector('.ability_description').textContent
        }));
    });
    
    localStorage.setItem('vc_system_personaje', JSON.stringify(datos));
}

// Función para agregar elemento simple (crónicas, vínculos, conexiones)
function agregarElementoSimple(tipo) {
    const nombre = prompt(`Ingresa el nombre del ${tipo}:`);
    if (nombre && nombre.trim()) {
        const descripcion = prompt(`Ingresa la descripción del ${tipo}:`);
        
        const elemento = document.createElement('div');
        elemento.className = 'ability_item';
        elemento.innerHTML = `
            <div class="ability_info">
                <div class="ability_name">${nombre}</div>
                <div class="ability_description">${descripcion || 'Sin descripción'}</div>
            </div>
            <div class="ability_actions">
                <button class="delete_button" onclick="this.parentElement.parentElement.remove(); guardarDatosPersonaje();">Eliminar</button>
            </div>
        `;
        
        document.getElementById(`${tipo}_list`).appendChild(elemento);
        guardarDatosPersonaje();
    }
}

// Función para aplicar daño
function aplicarDano() {
    const danoInput = document.getElementById('dano_input');
    const vidaActual = document.getElementById('vida_actual');
    const danoLog = document.getElementById('dano_log');
    
    const dano = parseInt(danoInput.value) || 0;
    if (dano <= 0) return;
    
    const vidaAnterior = parseInt(vidaActual.value) || 0;
    const nuevaVida = Math.max(0, vidaAnterior - dano);
    
    vidaActual.value = nuevaVida;
    danoInput.value = '';
    
    // Agregar entrada al log
    const logEntry = document.createElement('div');
    logEntry.className = 'log_entry damage_entry';
    logEntry.textContent = `-${dano} daño (Vida: ${vidaAnterior} → ${nuevaVida})`;
    danoLog.appendChild(logEntry);
    danoLog.scrollTop = danoLog.scrollHeight;
    
    guardarDatosPersonaje();
}

// Función para aplicar curación
function aplicarCuracion() {
    const curacionInput = document.getElementById('curacion_input');
    const vidaActual = document.getElementById('vida_actual');
    const vidaBase = document.getElementById('vida_base');
    const curacionLog = document.getElementById('curacion_log');
    
    const curacion = parseInt(curacionInput.value) || 0;
    if (curacion <= 0) return;
    
    const vidaAnterior = parseInt(vidaActual.value) || 0;
    const vidaMaxima = parseInt(vidaBase.value) || 0;
    const nuevaVida = Math.min(vidaMaxima, vidaAnterior + curacion);
    
    vidaActual.value = nuevaVida;
    curacionInput.value = '';
    
    // Agregar entrada al log
    const logEntry = document.createElement('div');
    logEntry.className = 'log_entry heal_entry';
    logEntry.textContent = `+${curacion} curación (Vida: ${vidaAnterior} → ${nuevaVida})`;
    curacionLog.appendChild(logEntry);
    curacionLog.scrollTop = curacionLog.scrollHeight;
    
    guardarDatosPersonaje();
}

// Función para manejar maratones
function manejarMaratones() {
    const maratonesInput = document.getElementById('maratones');
    const energiaActual = document.getElementById('energia_actual');
    const energiaBase = document.getElementById('energia_base');
    
    const maratones = parseInt(maratonesInput.value) || 0;
    const energiaMaxima = parseInt(energiaBase.value) || 0;
    const energiaPerdida = maratones * 15;
    const nuevaEnergia = Math.max(0, energiaMaxima - energiaPerdida);
    
    energiaActual.value = nuevaEnergia;
    guardarDatosPersonaje();
}

/* ===== INICIALIZACIÓN Y EVENT LISTENERS ===== */

// Función para inicializar la aplicación
function inicializarAplicacion() {
    // Cargar datos guardados
    habilidadCRUD.cargarDesdeLocalStorage();
    
    // Event listeners para la hoja de personaje
    document.addEventListener('DOMContentLoaded', () => {
        // Botón de volver
        const backButton = document.getElementById('back_button');
        if (backButton) {
            backButton.addEventListener('click', ocultarHojaPersonaje);
        }
        
        // Botones para agregar estigma/vestigio
        const addEstigmaVestigio = document.getElementById('add_estigma_vestigio');
        if (addEstigmaVestigio) {
            addEstigmaVestigio.addEventListener('click', () => {
                const tipo = confirm('¿Crear un Vestigio? (Cancelar para crear un Estigma)') ? 'vestigio' : 'estigma';
                mostrarModal(tipo, tipo);
            });
        }
        
        // Botones para agregar rastros
        const addRastro = document.getElementById('add_rastro');
        if (addRastro) {
            addRastro.addEventListener('click', () => mostrarModal('Rastro', 'rastro'));
        }
        
        // Botones para agregar habilidades
        const addHabilidad = document.getElementById('add_habilidad');
        if (addHabilidad) {
            addHabilidad.addEventListener('click', () => mostrarModal('Habilidad', 'habilidad'));
        }
        
        // Botones para agregar elementos simples
        const addCronica = document.getElementById('add_cronica');
        if (addCronica) {
            addCronica.addEventListener('click', () => agregarElementoSimple('cronica'));
        }
        
        const addVinculo = document.getElementById('add_vinculo');
        if (addVinculo) {
            addVinculo.addEventListener('click', () => agregarElementoSimple('vinculo'));
        }
        
        const addConexion = document.getElementById('add_conexion');
        if (addConexion) {
            addConexion.addEventListener('click', () => agregarElementoSimple('conexion'));
        }
        
        // Auto-guardar cuando cambien los campos básicos
        const camposBasicos = [
            'apodo', 'trasfondo', 'aspecto_exclusivo', 'rasgos', 'nivel', 'validez', 'constelacion',
            'fuerza', 'destreza', 'vitalidad', 'eco', 'comprension', 'clarividencia',
            'vida_actual', 'energia_actual', 'resonancia_actual', 'heridas'
        ];
        camposBasicos.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (elemento) {
                elemento.addEventListener('input', guardarDatosPersonaje);
                elemento.addEventListener('change', guardarDatosPersonaje);
            }
        });
        
        // Event listeners especiales para atributos principales
        const atributosPrincipales = ['fuerza', 'destreza', 'vitalidad', 'eco'];
        atributosPrincipales.forEach(atributo => {
            const elemento = document.getElementById(atributo);
            if (elemento) {
                elemento.addEventListener('input', (e) => {
                    validarAtributoPrincipal(e.target);
                    guardarDatosPersonaje();
                });
                elemento.addEventListener('change', (e) => {
                    validarAtributoPrincipal(e.target);
                    guardarDatosPersonaje();
                });
            }
        });
        
        // Event listeners para atributos especiales
        const atributosEspeciales = ['comprension', 'clarividencia'];
        atributosEspeciales.forEach(atributo => {
            const elemento = document.getElementById(atributo);
            if (elemento) {
                elemento.addEventListener('input', (e) => {
                    const valor = parseInt(e.target.value);
                    if (valor < 1) e.target.value = 1;
                    if (valor > 100) e.target.value = 100;
                    guardarDatosPersonaje();
                });
                elemento.addEventListener('change', (e) => {
                    const valor = parseInt(e.target.value);
                    if (valor < 1) e.target.value = 1;
                    if (valor > 100) e.target.value = 100;
                    guardarDatosPersonaje();
                });
            }
        });
        
        // Event listeners para daño y curación
        const aplicarDanoBtn = document.getElementById('aplicar_dano');
        if (aplicarDanoBtn) {
            aplicarDanoBtn.addEventListener('click', aplicarDano);
        }
        
        const aplicarCuracionBtn = document.getElementById('aplicar_curacion');
        if (aplicarCuracionBtn) {
            aplicarCuracionBtn.addEventListener('click', aplicarCuracion);
        }
        
        // Event listener para maratones
        const maratonesInput = document.getElementById('maratones');
        if (maratonesInput) {
            maratonesInput.addEventListener('change', manejarMaratones);
        }
        
        // Event listeners para Enter en campos de daño y curación
        const danoInput = document.getElementById('dano_input');
        if (danoInput) {
            danoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    aplicarDano();
                }
            });
        }
        
        const curacionInput = document.getElementById('curacion_input');
        if (curacionInput) {
            curacionInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    aplicarCuracion();
                }
            });
        }
        
        // Crear algunos ejemplos por defecto si no hay datos
        if (habilidadCRUD.vestigios.length === 0 && habilidadCRUD.estigmas.length === 0) {
            crearEjemplosPorDefecto();
        }
    });
}

// Función para crear ejemplos por defecto
function crearEjemplosPorDefecto() {
    // Crear algunos vestigios de ejemplo
    habilidadCRUD.crearVestigio(
        'Llamas Eternas',
        'Invoca llamas que nunca se extinguen, causando daño continuo al enemigo.',
        'magico',
        { energia: 0, resonancia: 3 },
        2
    );
    
    habilidadCRUD.crearVestigio(
        'Golpe Devastador',
        'Un ataque físico que puede partir rocas y derribar muros.',
        'fisico',
        { energia: 4, resonancia: 0 },
        5
    );
    
    // Crear algunos estigmas de ejemplo
    habilidadCRUD.crearEstigma(
        'Marca de la Tormenta',
        'Marca al enemigo con energía eléctrica, causando daño por turnos.',
        'mixto',
        { energia: 2, resonancia: 2 },
        3
    );
    
    // Crear algunas habilidades de ejemplo
    habilidadCRUD.crearHabilidad(
        'Escudo Mental',
        'Protege la mente de ataques psíquicos y manipulaciones.',
        'magico',
        { energia: 0, resonancia: 2 },
        0
    );
    
    habilidadCRUD.crearHabilidad(
        'Salto Acrobático',
        'Permite realizar saltos imposibles y movimientos acrobáticos.',
        'fisico',
        { energia: 1, resonancia: 0 },
        0
    );
    
    // Crear algunos rastros de ejemplo
    habilidadCRUD.crearRastro(
        'Sentidos Agudizados',
        'Los sentidos del personaje están siempre alerta, detectando peligros ocultos.',
        'pasivo',
        { energia: 0, resonancia: 0 },
        0
    );
    
    habilidadCRUD.crearRastro(
        'Regeneración Natural',
        'El cuerpo se cura lentamente de heridas menores sin intervención.',
        'pasivo',
        { energia: 0, resonancia: 0 },
        0
    );
    
    // Guardar los ejemplos
    habilidadCRUD.guardarEnLocalStorage();
}

// Inicializar la aplicación cuando se carga la página
inicializarAplicacion();
