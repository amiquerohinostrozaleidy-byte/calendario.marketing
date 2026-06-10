// Array principal donde se almacenan las campañas
let campañas = JSON.parse(localStorage.getItem('campañas')) || [];

// Referencias a elementos del DOM
const form = document.getElementById('campaignForm');
const campaignList = document.getElementById('campaignList');

// Inicializar la app mostrando las campañas guardadas
document.addEventListener('DOMContentLoaded', renderizarCampañas);

// Evento para agregar nueva campaña
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const titulo = document.getElementById('campaignTitle').value;
    const fecha = document.getElementById('campaignDate').value;
    const plataforma = document.getElementById('campaignPlatform').value;
    const tipo = document.getElementById('campaignType').value;
    const descripcion = document.getElementById('campaignDesc').value;

    const nuevaCampaña = {
        id: Date.now().toString(), // ID único basado en milisegundos
        titulo,
        fecha,
        plataforma,
        tipo,
        descripcion
    };

    campañas.push(nuevaCampaña);
    guardarEnLocalStorage();
    renderizarCampañas();
    
    // Limpiar formulario
    form.reset();
});

// Función para pintar las tarjetas de campañas en el HTML
function renderizarCampañas() {
    campaignList.innerHTML = '';

    if (campañas.length === 0) {
        campaignList.innerHTML = `<p style="text-align:center; color:#718093; padding: 2rem 0;">No hay campañas programadas. ¡Agrega una nueva arriba! 🚀</p>`;
        return;
    }

    // Ordenar campañas cronológicamente
    campañas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    campañas.forEach(campaña => {
        const card = document.createElement('div');
        card.classList.add('campaign-card');

        // Formatear fecha para mostrarse más amigable (Día/Mes/Año)
        const [año, mes, dia] = campaña.fecha.split('-');
        const fechaFormateada = `${dia}/${mes}/${año}`;

        card.innerHTML = `
            <div class="card-info">
                <h3>${escapeHTML(campaña.titulo)}</h3>
                <p><strong>📅 Fecha:</strong> ${fechaFormateada} | <strong>Plataforma:</strong> <span class="badge-platform">${campaña.plataforma}</span> | <strong>Formato:</strong> <span class="badge-type">${campaña.tipo}</span></p>
                <p style="margin-top: 0.35rem;"><em>${escapeHTML(campaña.descripcion)}</em></p>
            </div>
            <button class="btn-delete" onclick="eliminarCampaña('${campaña.id}')">Eliminar</button>
        `;
        campaignList.appendChild(card);
    });
}

// Función para eliminar campaña
function eliminarCampaña(id) {
    campañas = campañas.filter(campaña => campaña.id !== id);
    guardarEnLocalStorage();
    renderizarCampañas();
}

// Función para filtrar campañas en tiempo real desde el buscador
function filtrarCampanas() {
    const termino = document.getElementById('searchInput').value.toLowerCase();
    const tarjetas = document.querySelectorAll('.campaign-card');

    tarjetas.forEach(tarjeta => {
        const titulo = tarjeta.querySelector('h3').textContent.toLowerCase();
        if (titulo.includes(termino)) {
            tarjeta.style.display = 'flex';
        } else {
            tarjeta.style.display = 'none';
        }
    });
}

// Guardar en el almacenamiento del navegador
function guardarEnLocalStorage() {
    localStorage.setItem('campañas', JSON.stringify(campañas));
}

// Función de seguridad básica para evitar inyección HTML
function escapeHTML(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}