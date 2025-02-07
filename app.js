
let lista = JSON.parse(localStorage.getItem("asistencia")) || [];

function renderizarLista() {
    const tabla = document.querySelector("#tablaAsistencia tbody");
    tabla.innerHTML = "";

    lista.forEach((persona, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${persona.nombre}</td>
            ${persona.asistencia.slice(0, 5).map((asistio, i) => `
                <td>
                    <input type="checkbox" class="input-checkbox" ${asistio ? "checked" : ""} 
                    onchange="marcarAsistencia(${index}, ${i})">
                </td>`).join("")}
            <td class="acciones">
                <button onclick="editarNombre(${index})">Editar</button>
                <button onclick="confirmarEliminar(${index})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function agregarPersona() {
    const nombre = document.getElementById("nuevoNombre").value.trim();
    if (nombre) {
        lista.push({
            nombre: nombre,
            asistencia: [false, false, false, false, false]
        });
        alert(`Agregando ${nombre} a la lista`)
        renderizarLista();
        document.getElementById("nuevoNombre").value = "";
    }
}

function marcarAsistencia(index, diaIndex) {
    lista[index].asistencia[diaIndex] = !lista[index].asistencia[diaIndex];
}

function editarNombre(index) {
    const nuevoNombre = prompt("Ingrese el nuevo nombre:", lista[index].nombre);
    if (nuevoNombre && nuevoNombre.trim() !== "") {
        lista[index].nombre = nuevoNombre.trim();
        renderizarLista();
    }
}

function confirmarEliminar(index) {
    const nombrePersona = lista[index].nombre;
    if (confirm(`¿Está seguro de que desea eliminar a ${nombrePersona} de la lista?`)) {
        eliminarPersona(index);
    }
}

function eliminarPersona(index) {
    lista.splice(index, 1);
    renderizarLista();
}

function guardarAsistencia() {
    localStorage.setItem("asistencia", JSON.stringify(lista));
    alert("Los cambios se han guardado.");
}
function tomarPantallazo() {
    const tabla = document.getElementById("tablaAsistencia");
    html2canvas(tabla).then(function (canvas) {
        const enlace = document.createElement("a");
        enlace.download = "tabla_asistencia.png";
        enlace.href = canvas.toDataURL("image/png");
        enlace.click(); // Inicia la descarga de la imagen automáticamente
    });
}


renderizarLista();
