// Función para mostrar los botones principales y ocultar secciones
function showMainButtons() {
    document.getElementById("mainButtons").classList.remove("hidden");
    document.querySelectorAll("section").forEach(section => {
        section.classList.add("hidden");
    });
}

// Oculta o muestra secciones específicas y oculta botones principales
document.getElementById("verificacionesBtn").addEventListener("click", function() {
    document.getElementById("mainButtons").classList.add("hidden");
    showSection("verificacionesSection");
});
document.getElementById("mantenimientosBtn").addEventListener("click", function() {
    document.getElementById("mainButtons").classList.add("hidden");
    showSection("mantenimientosSection");
});
document.getElementById("historialBtn").addEventListener("click", function() {
    document.getElementById("mainButtons").classList.add("hidden");
    showSection("historialSection");
});

function showSection(sectionId) {
    document.querySelectorAll("section").forEach(section => {
        section.classList.add("hidden");
    });
    document.getElementById(sectionId).classList.remove("hidden");
}

// Activar cámara y tomar foto en Verificaciones
document.getElementById("agregarFotoVerificacion").addEventListener("click", function() {
    activateCamera("video", "canvas", "capturarFoto");
});

// Activar cámara y tomar foto en Servicios y Mantenimientos
document.getElementById("agregarFotoMantenimiento").addEventListener("click", function() {
    activateCamera("videoMantenimiento", "canvasMantenimiento", "capturarFotoMantenimiento");
});

// Función reutilizable para activar cámara y capturar foto
function activateCamera(videoId, canvasId, captureButtonId) {
    const video = document.getElementById(videoId);
    const canvas = document.getElementById(canvasId);
    const captureButton = document.getElementById(captureButtonId);

    video.classList.remove("hidden");
    captureButton.classList.remove("hidden");

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            video.play();
        })
        .catch(err => console.error("Error al acceder a la cámara: ", err));

    captureButton.onclick = function() {
        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.srcObject.getTracks().forEach(track => track.stop()); // Detener la cámara
        video.classList.add("hidden");
        captureButton.classList.add("hidden");
        canvas.classList.remove("hidden");
    };
}

// Guardar registro de Verificación con foto y regresar al menú principal
document.getElementById("guardarVerificacion").addEventListener("click", function() {
    const unit = document.getElementById("unidadVerificaciones").value;
    const observations = document.getElementById("observacionesVerificaciones").value;
    const timestamp = new Date().toLocaleString();
    const photo = document.getElementById("canvas").toDataURL("image/png"); // Foto en base64

    const record = {
        type: "verificación",
        unit: unit,
        observations: observations,
        timestamp: timestamp,
        photo: photo
    };

    saveToLocalStorage(record);
    alert("Registro guardado con éxito.");

    // Regresar al menú principal automáticamente
    showMainButtons();
});

// Guardar registro de Mantenimiento con foto y regresar al menú principal
document.getElementById("guardarMantenimiento").addEventListener("click", function() {
    const unit = document.getElementById("unidadMantenimientos").value;
    const observations = document.getElementById("observacionesMantenimientos").value;
    const timestamp = new Date().toLocaleString();
    const photo = document.getElementById("canvasMantenimiento").toDataURL("image/png"); // Foto en base64

    const record = {
        type: "mantenimiento",
        unit: unit,
        observations: observations,
        timestamp: timestamp,
        photo: photo
    };

    saveToLocalStorage(record);
    alert("Registro guardado con éxito.");

    // Regresar al menú principal automáticamente
    showMainButtons();
});

// Guardar en Local Storage
function saveToLocalStorage(record) {
    const records = JSON.parse(localStorage.getItem("records") || "[]");
    records.push(record);
    localStorage.setItem("records", JSON.stringify(records));
}

// Mostrar registros y agregar funcionalidad para descargar imagen al hacer clic
document.getElementById("mostrarRegistros").addEventListener("click", function() {
    const unit = document.getElementById("unidadHistorial").value;
    const records = JSON.parse(localStorage.getItem("records") || "[]");
    const tableBody = document.querySelector("#historialTable tbody");

    tableBody.innerHTML = "";

    records.filter(record => record.unit === unit).forEach(record => {
        const row = document.createElement("tr");

        // Crear imagen con evento de clic para descargarla
        const img = document.createElement("img");
        img.src = record.photo;
        img.width = 50;
        img.style.cursor = "pointer";
        img.addEventListener("click", function() {
            downloadImage(record.photo, `${record.type}_${record.timestamp}.png`);
        });

        row.innerHTML = `<td>${record.type}</td><td></td><td>${record.observations}</td><td>${record.timestamp}</td>`;
        row.children[1].appendChild(img); // Añadir imagen en la celda correspondiente
        tableBody.appendChild(row);
    });

    document.getElementById("historialTable").classList.remove("hidden");
});

// Función para descargar imagen
function downloadImage(dataUrl, fileName) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
