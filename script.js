// Array para almacenar los registros temporalmente
const registros = [];

// Obtener los elementos del DOM
const registroForm = document.getElementById("registroForm");
const registrosTableBody = document.getElementById("registrosTable").querySelector("tbody");

// Función para agregar un registro al array y a la tabla
function agregarRegistro(event) {
    event.preventDefault(); // Evita que se recargue la página

    // Obtener datos del formulario
    const unidad = document.getElementById("unidad").value;
    const observaciones = document.getElementById("observaciones").value;
    const fecha = new Date().toLocaleString();

    // Crear un objeto de registro y agregarlo al array
    const nuevoRegistro = { unidad, observaciones, fecha };
    registros.push(nuevoRegistro);

    // Añadir el registro a la tabla
    mostrarRegistroEnTabla(nuevoRegistro);

    // Limpiar el formulario
    registroForm.reset();
}

// Función para mostrar un registro en la tabla
function mostrarRegistroEnTabla(registro) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${registro.unidad}</td>
        <td>${registro.observaciones}</td>
        <td>${registro.fecha}</td>
    `;
    registrosTableBody.appendChild(row);
}

// Evento para manejar el envío del formulario
registroForm.addEventListener("submit", agregarRegistro);