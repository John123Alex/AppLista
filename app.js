document.getElementById("fileInput").addEventListener("change", leerExcel);

let lista = JSON.parse(localStorage.getItem("asistencia")) || [];

function leerExcel(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const datos = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        lista = datos.slice(1).map(row => ({
            nombre: row[0],
            asistencia: [false, false, false, false, false, false, false] // Semana en false
        }));

        renderizarLista();
    };

    reader.readAsArrayBuffer(file);
};

function renderizarLista() {
    const tabla = document.querySelector("#tablaAsistencia tbody");
    tabla.innerHTML = "";  // Limpiamos la tabla antes de agregar nuevas filas

    lista.forEach((persona, index) => {
        const fila = document.createElement("tr");

        // Agregar nombre y checkboxes para los días
        fila.innerHTML = `
            <td>${persona.nombre}</td>
            ${persona.asistencia.slice(0, 5).map((asistio, i) => `
                <td>
                    <input type="checkbox" class="input-checkbox" ${asistio ? "checked" : ""} 
                    onchange="marcarAsistencia(${index}, ${i})">
                </td>`).join("")}
        `;

        // Agregar la columna de acciones al final de la fila
        const celdaAcciones = document.createElement("td");
        celdaAcciones.classList.add("acciones");
        celdaAcciones.innerHTML = `
            <button onclick="editarNombre(${index})">Editar</button>
            <button onclick="confirmarEliminar(${index})">Eliminar</button>
        `;
        fila.appendChild(celdaAcciones);

        // Agregar la fila a la tabla
        tabla.appendChild(fila);
    });
}


function agregarPersona() {
    const nombre = document.getElementById("nuevoNombre").value.trim();
    if (nombre) {
        lista.push({
            nombre: nombre,
            asistencia: [false, false, false, false, false]  // Inicializa con 5 días de asistencia en falso
        });
        alert(`Agregando ${nombre} a la lista`);
        renderizarLista();
        document.getElementById("nuevoNombre").value = "";  // Limpiar el campo de nombre
    } else {
        alert("Por favor, ingrese un nombre válido.");
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


renderizarLista();
