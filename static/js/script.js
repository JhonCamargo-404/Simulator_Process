document.addEventListener("DOMContentLoaded", function() {
    const addRowBtn = document.getElementById("addRowBtn");
    const deleteRowBtn = document.getElementById("deleteRowBtn");
    const executeBtn = document.getElementById("executeBtn");
    const processTable = document.getElementById("processTable").querySelector("tbody");
    const tiempoCompartidoBtn = document.getElementById("tiempoCompartidoBtn");


    if (addRowBtn) {
        addRowBtn.addEventListener("click", function() {
            agregarFila();
        });
    }
    if (deleteRowBtn) {
        deleteRowBtn.addEventListener("click", function() {
            eliminarUltimaFila();
        });
    }
    if (executeBtn) {
        executeBtn.addEventListener("click", function () {
            const quantumInput = document.getElementById("quantumInput");
            const quantum = parseInt(quantumInput.value);

            // Verificar si el quantum es válido
            if (isNaN(quantum) || quantum <= 0) {
                alert("Por favor, ingrese un quantum válido.");
                return;
            }

            // Obtener los datos de la tabla
            const rows = document.querySelectorAll("#processTable tbody tr");
            const processes = [];

            rows.forEach(row => {
                const cells = row.querySelectorAll("input");
                if (cells.length > 0) {
                    processes.push({
                        process: cells[0].value,
                        arrive_time: cells[1].value,
                        burst_time: cells[2].value
                    });
                }
            });

            // Enviar los datos al backend para ejecutar Round Robin
            fetch("/execute_round_robin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ processes, quantum })
            })
                .then(response => response.json())
                .then(data => {
                    // Actualizar la tabla con los resultados
                    const tbody = document.querySelector("#processTable tbody");
                    tbody.innerHTML = ""; // Limpiar la tabla

                    data.forEach(process => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${process.process}</td>
                            <td>${process.arrive_time}</td>
                            <td>${process.burst_time}</td>
                            <td>${process.completion_time}</td>
                            <td>${process.turnaround_time}</td>
                            <td>${(process.turnaround_time / process.burst_time).toFixed(2)}</td>
                            <td>${process.waiting_time}</td>
                        `;
                        tbody.appendChild(row);
                    });
                })
                .catch(error => console.error("Error:", error));
        });
    }
    if (tiempoCompartidoBtn) {
        tiempoCompartidoBtn.addEventListener("click", function () {
            activarTiempoCompartido();
        });
    }

    function agregarFila() {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><input type="text" value="P${processTable.rows.length + 1}"></td>
            <td><input type="number" min="0" class="at-input"></td>
            <td><input type="number" min="1"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        `;

        // Agregar evento para reordenar la tabla cuando se deje de escribir en el AT
        const atInput = newRow.querySelector(".at-input");
        atInput.addEventListener("blur", function() {
            reordenarTabla();
        });

        processTable.appendChild(newRow);
    }

    function eliminarUltimaFila() {
        const rows = processTable.querySelectorAll("tr");
        if (rows.length > 0) {
            rows[rows.length - 1].remove();
        }
    }

    function reordenarTabla() {
        const rows = Array.from(processTable.querySelectorAll("tr"));
        rows.sort((a, b) => {
            const atA = parseInt(a.querySelector(".at-input").value) || 0;
            const atB = parseInt(b.querySelector(".at-input").value) || 0;
            return atA - atB;
        });

        // Reinsertar las filas ordenadas en la tabla
        rows.forEach(row => processTable.appendChild(row));
    }

    function ejecutarAlgoritmo() {
        let procesos = [];
        let rows = processTable.querySelectorAll("tr");

        rows.forEach(row => {
            let inputs = row.querySelectorAll("input");
            if (inputs.length > 0) {
                let proceso = {
                    nombre: inputs[0].value,
                    at: parseInt(inputs[1].value) || 0,
                    bt: parseInt(inputs[2].value) || 0
                };
                procesos.push(proceso);
            }
        });

        if (procesos.length === 0) {
            alert("No hay procesos para ejecutar.");
            return;
        }
        procesos.sort((a, b) => a.at - b.at);

        let tiempoActual = 0;

        procesos.forEach((proceso, index) => {
            if (tiempoActual < proceso.at) {
                tiempoActual = proceso.at;
            }
            proceso.ct = tiempoActual + proceso.bt;
            proceso.tat = proceso.ct - proceso.at;
            proceso.ntat = proceso.tat / proceso.bt; 
            proceso.wt = proceso.tat - proceso.bt;
            tiempoActual = proceso.ct;
        });

        rows.forEach((row, index) => {
            if (index < procesos.length) {
                let cells = row.querySelectorAll("td");
                cells[3].textContent = procesos[index].ct;
                cells[4].textContent = procesos[index].tat;
                cells[5].textContent = procesos[index].ntat;
                cells[6].textContent = procesos[index].wt;
            }
        });

        alert("Cálculo completado.");
    }

    const executeSerieBtn = document.getElementById("executeSerieBtn");
    const executeRoundRobinBtn = document.getElementById("executeRoundRobinBtn");
    const quantumContainer = document.getElementById("quantumContainer");


    window.addEventListener("DOMContentLoaded", function () {

        executeSerieBtn.style.display = "block";
        executeRoundRobinBtn.style.display = "none";

        quantumContainer.style.display = "none";
    });

    document.getElementById("serieBtn").addEventListener("click", function () {
        // Mostrar/Ocultar contenedores
        document.getElementById("mainContainer").style.display = "block";
        document.getElementById("batchContainer").style.display = "none";
        document.getElementById("quantumContainer").style.display = "none";
        document.getElementById("timeline").innerHTML = ""; 
        // Mostrar botón de Serie, ocultar Round Robin
        executeSerieBtn.style.display = "block";
        executeRoundRobinBtn.style.display = "none";
    
        // Limpiar tabla
        document.querySelector("#processTable tbody").innerHTML = "";
    });
    document.getElementById("tiempoCompartidoBtn").addEventListener("click", function () {
        // Mostrar/Ocultar contenedores
        document.getElementById("mainContainer").style.display = "block";
        document.getElementById("batchContainer").style.display = "none";
        document.getElementById("quantumContainer").style.display = "block";
        document.getElementById("timeline").innerHTML = ""; 
        // Mostrar botón de Round Robin, ocultar Serie
        executeRoundRobinBtn.style.display = "block";
        executeSerieBtn.style.display = "none";
    
        // Limpiar tabla y quantum
        document.querySelector("#processTable tbody").innerHTML = "";
        document.getElementById("quantumInput").value = "";
    });
    document.getElementById("lotesBtn").addEventListener("click", function () {
        // Mostrar/Ocultar contenedores
        document.getElementById("mainContainer").style.display = "none";
        document.getElementById("batchContainer").style.display = "block";
        document.getElementById("quantumContainer").style.display = "block";
        document.getElementById("timeline").innerHTML = ""; 
        // Limpiar tabla y quantum
        document.querySelector("#batchTable tbody").innerHTML = "";
        document.getElementById("quantumInput").value = "";
    
        // Reiniciar loteID
        loteID = 1;
    });

    executeSerieBtn.addEventListener("click", function () {
        const rows = document.querySelectorAll("#processTable tbody tr");
        const processes = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll("input");
            if (cells.length > 0) {
                processes.push({
                    process: cells[0].value,
                    arrive_time: cells[1].value,
                    burst_time: cells[2].value
                });
            }
        });

        // Enviar los datos al backend para Procesamiento en Serie
        fetch("/execute_serial", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ processes })
        })
            .then(response => response.json())
            .then(data => {
                // Actualizar la tabla con los resultados
                const tbody = document.querySelector("#processTable tbody");
                tbody.innerHTML = ""; // Limpiar la tabla

                data.forEach(process => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${process.process}</td>
                        <td>${process.arrive_time}</td>
                        <td>${process.burst_time}</td>
                        <td>${process.completion_time}</td>
                        <td>${process.turnaround_time}</td>
                        <td>${(process.turnaround_time / process.burst_time).toFixed(2)}</td>
                        <td>${process.waiting_time}</td>
                    `;
                    tbody.appendChild(row);
                });
                procesarParaGantt(data, "serie");

            })
            .catch(error => console.error("Error:", error));
    });

    executeRoundRobinBtn.addEventListener("click", function () {
        const quantumInput = document.getElementById("quantumInput");
        const quantum = parseInt(quantumInput.value);
    
        // Verificar si el quantum es válido
        if (isNaN(quantum) || quantum <= 0) {
            alert("Por favor, ingrese un quantum válido.");
            return;
        }
    
        const rows = document.querySelectorAll("#processTable tbody tr");
        const processes = [];
    
        rows.forEach(row => {
            const cells = row.querySelectorAll("input");
            if (cells.length > 0) {
                processes.push({
                    process: cells[0].value,
                    arrive_time: cells[1].value,
                    burst_time: cells[2].value
                });
            }
        });
    
        // Enviar los datos al backend para Round Robin
        fetch("/execute_round_robin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ processes, quantum })
        })
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector("#processTable tbody");
                tbody.innerHTML = "";
    
                // ✅ Usa data.results para llenar la tabla
                data.results.forEach(process => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${process.process}</td>
                        <td>${process.arrive_time}</td>
                        <td>${process.burst_time}</td>
                        <td>${process.completion_time}</td>
                        <td>${process.turnaround_time}</td>
                        <td>${(process.turnaround_time / process.burst_time).toFixed(2)}</td>
                        <td>${process.waiting_time}</td>
                    `;
                    tbody.appendChild(row);
                });
    
                procesarParaGantt(data.blocks, "bloques", quantum);
            })
            .catch(error => console.error("Error:", error));
    });
    

let loteID = 1;
const batchTable = document.getElementById("batchTable")?.querySelector("tbody");
const modal = document.getElementById("batchModal");
const modalTable = document.getElementById("modalProcessTable")?.querySelector("tbody");
const batchArrivalInput = document.getElementById("batchArrivalInput");

document.getElementById("createBatchBtn")?.addEventListener("click", function () {
    modal.style.display = "block";
    modalTable.innerHTML = "";
    batchArrivalInput.value = "";
});

document.getElementById("closeModal")?.addEventListener("click", function () {
    modal.style.display = "none";
});

document.getElementById("addProcessToModalBtn")?.addEventListener("click", function () {
    const row = document.createElement("tr");
    const processName = `P${modalTable.rows.length + 1}`;
    row.innerHTML = `
        <td><input type="text" value="${processName}" /></td>
        <td><input type="number" min="1" /></td>
        <td><button class="deleteProcessBtn">Eliminar</button></td>
    `;
    row.querySelector(".deleteProcessBtn").addEventListener("click", function () {
        row.remove();
    });
    modalTable.appendChild(row);
});

document.getElementById("confirmBatchBtn")?.addEventListener("click", function () {
    const at = parseInt(batchArrivalInput.value);
    if (isNaN(at) || at < 0) {
        alert("Ingrese un Arrival Time válido.");
        return;
    }

    const rows = modalTable.querySelectorAll("tr");
    if (rows.length === 0) {
        alert("Debe agregar al menos un proceso.");
        return;
    }

    rows.forEach(row => {
        const inputs = row.querySelectorAll("input");
        const processName = inputs[0].value;
        const bt = parseInt(inputs[1].value);
        if (isNaN(bt) || bt <= 0) return;

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${loteID}</td>
            <td>${processName}</td>
            <td>${at}</td>
            <td>${bt}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        `;
        batchTable.appendChild(newRow);
    });

    loteID++;
    modal.style.display = "none";
});

document.getElementById("deleteBatchBtn")?.addEventListener("click", function () {
    const rows = batchTable.querySelectorAll("tr");
    if (rows.length === 0) return;

    const lastLote = loteID - 1;
    let removed = false;

    [...rows].reverse().forEach(row => {
        if (row.children[0].textContent == lastLote) {
            row.remove();
            removed = true;
        }
    });

    if (removed) loteID--;
});

document.getElementById("executeBatchBtn")?.addEventListener("click", function () {
    const rows = document.querySelectorAll("#batchTable tbody tr");
    const quantumInput = document.getElementById("quantumInput");
    const quantum = parseInt(quantumInput.value);

    if (isNaN(quantum) || quantum <= 0) {
        alert("Quantum inválido.");
        return;
    }

    if (rows.length === 0) {
        alert("No hay procesos para ejecutar.");
        return;
    }

    const batches = {};
    rows.forEach(row => {
        const cells = row.children;
        const lote_id = cells[0].textContent;
        const process = cells[1].textContent;
        const arrive_time = parseInt(cells[2].textContent);
        const burst_time = parseInt(cells[3].textContent);

        if (!batches[lote_id]) {
            batches[lote_id] = {
                lote_id: parseInt(lote_id),
                arrival_time: arrive_time,
                processes: []
            };
        }

        batches[lote_id].processes.push({
            process,
            burst_time
        });
    });

    const payload = {
        quantum,
        batches: Object.values(batches)
    };

    fetch("/execute_batches", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(data => {
            // Limpiar tabla
            const tbody = document.querySelector("#batchTable tbody");
            tbody.innerHTML = "";
        
            // Pintar resultados de data.results
            data.results.forEach(p => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${p.lote_id}</td>
                    <td>${p.process}</td>
                    <td>${p.arrive_time}</td>
                    <td>${p.burst_time}</td>
                    <td>${p.completion_time}</td>
                    <td>${p.turnaround_time}</td>
                    <td>${(p.turnaround_time / p.burst_time).toFixed(2)}</td>
                    <td>${p.waiting_time}</td>
                `;
                tbody.appendChild(row);
            });
        
            // Dibujar Gantt con los bloques
            procesarParaGantt(data.blocks, "bloques", quantum);
        })
        
        .catch(err => {
            console.error("Error al procesar lotes:", err);
            alert("Error al ejecutar los lotes.");
        });
});

function mostrarGantt(bloques, quantum = 1) {
    const timeline = document.getElementById("timeline");
    timeline.innerHTML = "";

    const escala = 1;
    const altoBloque = 36;
    const espacioRotulo = 20;

    // Contenedor principal
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.height = `${altoBloque + espacioRotulo + 10}px`;
    container.style.margin = "20px 0";
    container.style.overflowX = "auto";
    container.style.overflowY = "hidden";
    container.style.whiteSpace = "nowrap";
    container.style.border = "1px dashed #ccc";
    timeline.appendChild(container);

    // Obtener el tiempo máximo
    const maxTime = Math.max(...bloques.map(b => b.end_time));

    // Dibujar bloques
    bloques.forEach(b => {
        const block = document.createElement("div");

        // ✅ Mostrar proceso con lote: P1 (L1)
        const label = b.lote_id ? `${b.process} (L${b.lote_id})` : b.process;
        block.textContent = label;

        block.style.position = "absolute";
        block.style.left = `${b.start_time * escala}px`;
        block.style.width = `${(b.end_time - b.start_time) * escala}px`;
        block.style.height = `${altoBloque}px`;
        block.style.backgroundColor = getColorForProcess(b.process);
        block.style.color = "#fff";
        block.style.textAlign = "center";
        block.style.lineHeight = `${altoBloque}px`;
        block.style.borderRadius = "10px";
        block.style.fontWeight = "bold";
        block.style.fontSize = "14px";
        block.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
        container.appendChild(block);

        // Etiqueta de tiempo de inicio
        const startLabel = document.createElement("div");
        startLabel.textContent = b.start_time;
        startLabel.style.position = "absolute";
        startLabel.style.top = `${altoBloque + 2}px`;
        startLabel.style.left = `${b.start_time * escala}px`;
        startLabel.style.fontSize = "12px";
        startLabel.style.transform = "translateX(-50%)";
        container.appendChild(startLabel);
    });

    // Etiqueta del tiempo final
    const last = bloques[bloques.length - 1];
    const endLabel = document.createElement("div");
    endLabel.textContent = last.end_time;
    endLabel.style.position = "absolute";
    endLabel.style.top = `${altoBloque + 2}px`;
    endLabel.style.left = `${last.end_time * escala}px`;
    endLabel.style.fontSize = "12px";
    endLabel.style.transform = "translateX(-50%)";
    container.appendChild(endLabel);
}

function procesarParaGantt(respuesta, tipo, quantum = 1) {
    const bloques = [];

    if (tipo === "roundrobin" || tipo === "bloques") {
        // Ya viene listo desde el backend con bloques
        return mostrarGantt(respuesta, quantum);
    }

    if (tipo === "serie") {
        let tiempoActual = 0;

        respuesta.forEach(p => {
            const at = parseInt(p.arrive_time);
            const bt = parseInt(p.burst_time);
            const ct = parseInt(p.completion_time);

            if (tiempoActual < at) {
                tiempoActual = at;
            }

            bloques.push({
                process: p.process,
                start_time: tiempoActual,
                end_time: ct
            });

            tiempoActual = ct;
        });

        return mostrarGantt(bloques, quantum);
    }

    if (tipo === "lote") {
        let tiempoActual = 0;

        respuesta.forEach(p => {
            const at = parseInt(p.arrive_time);
            const bt = parseInt(p.burst_time);
            const ct = parseInt(p.completion_time);
            const lote = p.lote_id;

            if (tiempoActual < at) {
                tiempoActual = at;
            }

            bloques.push({
                process: p.process,
                start_time: tiempoActual,
                end_time: ct,
                lote_id: lote   // ✅ se añade lote_id para identificar el fondo
            });

            tiempoActual = ct;
        });

        return mostrarGantt(bloques, quantum);
    }
}

function getColorForProcess(name) {
    const colors = [
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12',
        '#9b59b6', '#1abc9c', '#d35400', '#7f8c8d'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash += name.charCodeAt(i);
    }
    return colors[hash % colors.length];
}

});
