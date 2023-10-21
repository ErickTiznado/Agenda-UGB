const predefinedTimeBlocks = [
    "07:00-08:30",
    "08:40-10:10",
    "10:20-11:50",
    "12:00-13:30",
    "13:40-15:10",
    "15:20-16:50",
    "17:00-18:30",
    "18:40-20:10",
    "20:20-21:50"
];

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
    cell.style.backgroundColor = color;
}

function loadSchedule() {
    const userId = localStorage.getItem('userId');
    
    // Limpia el contenido existente de la tabla
    const workScheduleTableBody = document.getElementById('workScheduleTable').getElementsByTagName('tbody')[0];
    workScheduleTableBody.innerHTML = ''; 

    // Preparar la tabla con los horarios predefinidos
    predefinedTimeBlocks.forEach(timeBlock => {
        const row = workScheduleTableBody.insertRow();
        const cellHorario = row.insertCell(0);
        cellHorario.textContent = timeBlock;
        for (let i = 0; i < 7; i++) {
            row.insertCell(i + 1);
        }
    });

    // Solicita las clases
    fetch(`http://localhost:3000/getClasses?usuario_id=${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(classes => {
            console.log('Classes loaded from server:', classes);

            classes.forEach(clase => {
                const timeBlock = `${clase.hora_inicio} - ${clase.hora_fin}`;
                const rowIndex = predefinedTimeBlocks.indexOf(timeBlock);
                if (rowIndex !== -1) {
                    const row = workScheduleTableBody.rows[rowIndex];
                    fillCellBasedOnDay(row, clase.dias, clase.nombre, clase.sala, clase.profesor, clase.color, clase.ID, clase.hora_inicio, clase.hora_fin);
                }
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

window.onload = loadSchedule;
