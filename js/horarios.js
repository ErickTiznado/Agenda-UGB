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

const pastelColors = [
    "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF",
    "#A1CAF1", "#B0E0E6", "#F0EAD6", "#E3A857", "#F4C2C2",
    "#FEFEFA", "#F0E68C", "#DEA5A4", "#B39EB5", "#FF6961",
    "#77DD77", "#C23B22", "#FFD1DC", "#D9D9D9", "#CFCFC4"
];

let editingClassId = null;

function getRandomPastelColor() {
    const randomIndex = Math.floor(Math.random() * pastelColors.length);
    return pastelColors[randomIndex];
}

function setBlockBasedOnTime(hora_inicio, hora_fin) {
    const timeBlock = `${hora_inicio}-${hora_fin}`;
    document.getElementById('timeBlock').value = timeBlock.trim();
}

function checkForConflict(data) {
    const userClasses = document.querySelectorAll('.class-block');
    const timeBlock = `${data.hora_inicio}-${data.hora_fin}`;
    for(let c of userClasses) {
        console.log(`Comparing: ${c.getAttribute('data-day')} === ${data.dia} && ${c.getAttribute('data-time')} === ${timeBlock}`);
        if(c.getAttribute('data-day') === data.dia && c.getAttribute('data-time') === timeBlock) {
            console.log("Conflict found!");
            return true;
        }
    }
    console.log("No conflict found.");
    return false;
}

function handleConflict(data) {
    alert(`Ya tienes una clase programada para ${data.dia} de ${data.hora_inicio} a ${data.hora_fin}.`);
}

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


document.getElementById('addClassForm').addEventListener('submit', function(event) {
    console.log("Form submitted");
    event.preventDefault();

    const [hora_inicio, hora_fin] = document.getElementById('timeBlock').value.split('-');
    const data = {
        usuario_id: localStorage.getItem('userId'),
        nombre: document.getElementById('class-name').value,
        profesor: document.getElementById('profesor').value,
        sala: document.getElementById('sala').value,
        dia: document.getElementById('dia').value,
        color: document.getElementById('color').value,
        hora_inicio: hora_inicio + ":00",  // Añadimos ":00" al inicio
        hora_fin: hora_fin + ":00"  // Añadimos ":00" al final
    };

    // Check for conflicts before adding the class
    if (checkForConflict(data)) {
        handleConflict(data);
        return;
    }

    fetch('http://localhost:3000/agregarClase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Clase agregada exitosamente!');
            loadClasses();
        } else {
            alert('Error: ' + data.error);
        }
    });
});

function handleCellClick(clase, cell) {
    document.getElementById('class-name').value = clase.nombre;
    document.getElementById('profesor').value = clase.profesor;
    document.getElementById('sala').value = clase.sala;
    document.getElementById('dia').value = clase.dias;
    document.getElementById('color').value = cell.getAttribute('data-color');

    setBlockBasedOnTime(clase.hora_inicio, clase.hora_fin);

    editingClassId = clase.id;
    document.getElementById('guardar').style.display = 'none';
    document.getElementById('btnSiguiente').style.display = 'none';
    document.getElementById('modifyClassButton').style.display = 'inline-block';
    document.getElementById('deleteClassButton').style.display = 'inline-block';
}

function resetFormDisplay() {
    document.getElementById('addClassForm').reset();
    document.getElementById('guardar').style.display = 'inline-block';
    document.getElementById('btnSiguiente').style.display = 'inline-block';
    document.getElementById('modifyClassButton').style.display = 'none';
    document.getElementById('deleteClassButton').style.display = 'none';
    editingClassId = null;
}

document.getElementById('modifyClassButton').addEventListener('click', function() {
    const [hora_inicio, hora_fin] = document.getElementById('timeBlock').value.split('-');

    const data = {
        usuario_id: localStorage.getItem('userId'),
        nombre: document.getElementById('class-name').value,
        profesor: document.getElementById('profesor').value,
        sala: document.getElementById('sala').value,
        dia: document.getElementById('dia').value,
        hora_inicio: hora_inicio,
        hora_fin: hora_fin,
        color: document.getElementById('color').value
    };

    fetch(`http://localhost:3000/actualizarClase/${editingClassId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            resetFormDisplay();
            alert('Clase modificada exitosamente!');
            loadClasses();
        } else {
            alert('Error: ' + data.error);
        }
    });
});

document.getElementById("btnSiguiente").addEventListener("click", function() {
    const trabaja = document.getElementById("trabaja").checked;

    if (trabaja) {
        // Si el usuario trabaja, redirigir a la página de horario de trabajo
        window.location.href = "horarioTrabajo.html";
    } else {
        // Si el usuario no trabaja, redirigir a la página de limitaciones y eventos
        window.location.href = "ConfiguracionFinal.html";
    }
});


document.getElementById('deleteClassButton').addEventListener('click', function() {
    if (editingClassId) {
        fetch(`http://localhost:3000/eliminarClase/${editingClassId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                resetFormDisplay();
                alert('Clase eliminada exitosamente!');
                loadClasses();
            } else {
                alert('Error: ' + data.error);
            }
        });
    }
});

function loadClasses() {
   const usuario_id = localStorage.getItem('userId');

    fetch(`http://localhost:3000/getClasses?usuario_id=${usuario_id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Classes loaded from server:', data);  // Registro para ver las clases cargadas desde el servidor

        const scheduleTableBody = document.getElementById('scheduleTable').getElementsByTagName('tbody')[0];
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
window.onload = loadClasses;
