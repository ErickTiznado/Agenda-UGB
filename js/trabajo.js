function fillCellBasedOnDay(row, dia, nombre, sala, profesor, color, id, hora_inicio, hora_fin) {
    let cellContent = `Materia: ${nombre}<br>Docente: ${profesor} (Aula: ${sala})`;
    let diaIndex;
    switch(dia) {
        case 'Lunes': diaIndex = 1; break;
        case 'Martes': diaIndex = 2; break;
        case 'Miércoles': diaIndex = 3; break;
        case 'Jueves': diaIndex = 4; break;
        case 'Viernes': diaIndex = 5; break;
        case 'Sabado': diaIndex = 6; break;
        case 'Domingo': diaIndex = 7; break;
    }

    const cell = row.cells[diaIndex];
    cell.innerHTML = cellContent;
    cell.classList.add('class-block');
    cell.setAttribute('data-day', dia);
    cell.setAttribute('data-time', `${hora_inicio}-${hora_fin}`);
    cell.style.backgroundColor = color;
    cell.setAttribute('data-color', color);
    cell.addEventListener('click', () => {
        handleCellClick({ nombre, profesor, sala, dias: dia, hora_inicio, hora_fin, color, id }, cell);
    });
}


function loadWorkBlocks() {
    const usuario_id = localStorage.getItem('userId');

    fetch(`http://localhost:3000/getWorkBlocks?usuario_id=${usuario_id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
    })
    .then(data => {
        const workTableBody = document.getElementById('workScheduleTable').getElementsByTagName('tbody')[0];
        workTableBody.innerHTML = '';  // Limpiamos el contenido existente

        data.forEach(block => {
            const row = workTableBody.insertRow();
            const cellDia = row.insertCell(0);
            cellDia.textContent = block.dia;

            const cellInicio = row.insertCell(1);
            cellInicio.textContent = block.inicio;

            const cellFin = row.insertCell(2);
            cellFin.textContent = block.fin;

            const cellColor = row.insertCell(3);
            cellColor.style.backgroundColor = block.color;
        });
    })
    .catch(error => {
        console.error('Hubo un problema con la petición Fetch:', error);
    });
}

function loadWorkSchedule() {
    const usuario_id = localStorage.getItem('userId');
 
     fetch(`http://localhost:3000/getClasses?usuario_id=${usuario_id}`)
     .then(response => {
         if (!response.ok) {
             throw new Error('Network response was not ok');
         }
         return response.json(); 
     })
     .then(data => {
         const scheduleTableBody = document.getElementById('workScheduleTable').getElementsByTagName('tbody')[0];
         scheduleTableBody.innerHTML = '';  // Limpiamos el contenido existente
 
         const timeBlockMap = {};
 
         // Agrupar clases por bloque de tiempo
         data.forEach(clase => {
             const horarioFormateado = `${clase.hora_inicio} - ${clase.hora_fin}`;
             if (!timeBlockMap[horarioFormateado]) {
                 timeBlockMap[horarioFormateado] = [];
             }
             timeBlockMap[horarioFormateado].push(clase);
         });
 
         Object.entries(timeBlockMap).forEach(([timeBlock, clases]) => {
             const row = scheduleTableBody.insertRow();
             const cellHorario = row.insertCell(0);
             cellHorario.textContent = timeBlock;
 
             for (let i = 0; i < 7; i++) {
                 row.insertCell(i + 1);
             }
 
             clases.forEach(clase => {
                 fillCellBasedOnDay(row, clase.dias, clase.nombre, clase.sala, clase.profesor, clase.color, clase.ID, clase.hora_inicio, clase.hora_fin);
             });
         });
     })
     .catch(error => {
         console.error('Hubo un problema con la petición Fetch:', error);
     });
 }

document.getElementById('addWorkBlockForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Capturar la información del formulario
    const dia = document.getElementById('dia').value;
    const inicio = document.getElementById('inicio').value;
    const fin = document.getElementById('fin').value;
    const color = document.getElementById('color').value;
    const usuario_id = localStorage.getItem('userId');

    // Objeto con la información del bloque de trabajo
    const workBlockData = {
        usuario_id,
        dia,
        inicio,
        fin,
        color
    };

    // Enviar la información al servidor
    fetch('http://localhost:3000/agregarBloqueTrabajo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workBlockData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Bloque de trabajo agregado exitosamente!');
            loadSchedule();  // Actualizar la vista
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Hubo un problema con la petición Fetch:', error);
    });
});


window.onload = loadWorkSchedule;
window.onload = loadWorkBlocks;
