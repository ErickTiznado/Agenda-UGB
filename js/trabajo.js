// Función para cargar los horarios
function loadSchedules() {
    console.log('loadSchedules iniciado');
    // Aquí deberías obtener tus datos de clases y bloques de trabajo desde tu base de datos o API
    const classes = [
        // Ejemplo de datos de clases
        {nombre: 'Matematicas', profesor: 'Steed', sala: 'Lab Cisco', día: 'Lunes', hora_inicio: '07:00:00', hora_fin: '08:30:00'},
        // ... otros datos de clases
    ];
    const workBlocks = [
        // Ejemplo de datos de bloques de trabajo
        {ID: 1, día: 'Lunes', inicio: '08:40:00', fin: '20:00:00', color: '#A1CAF1'},
        // ... otros datos de bloques de trabajo
    ];
    renderTable(classes, workBlocks);
}

// Función para renderizar la tabla
function renderTable(classes, workBlocks) {
    console.log('renderTable iniciado');
    const timeBlocks = generateTimeBlocks(classes, workBlocks);
    const table = document.getElementById('workScheduleTable');
    const tbody = table.querySelector('tbody'); // Seleccionamos el tbody
    timeBlocks.forEach((block, rowIndex) => {
        const row = tbody.insertRow(rowIndex); // Insertamos las filas en el tbody
        const timeCell = row.insertCell(0);
        timeCell.innerText = `${block.startTime} - ${block.endTime}`;
        for (let i = 1; i <= 7; i++) { // 7 días de la semana
            row.insertCell(i).setAttribute('data-time', `${block.startTime}-${block.endTime}`);
        }
    });

    classes.forEach(clase => {
        const cell = findCellForClass(clase, timeBlocks);
        if (cell) {
            cell.style.backgroundColor = '#A1CAF1';
            cell.innerHTML = `<strong>${clase.nombre}</strong><br>${clase.profesor}<br>${clase.sala}`;
        } else {
            console.log('Celda no encontrada para clase:', clase);
        }
    });

    workBlocks.forEach(block => {
        const cell = findCellForWorkBlock(block, timeBlocks);
        if (cell) {
            cell.style.backgroundColor = block.color;
        } else {
            console.log('Celda NO encontrada para bloque de trabajo:', block);
        }
    });
}

// Función para generar bloques de tiempo
// Función para generar bloques de tiempo
function generateTimeBlocks(classes, workBlocks) {
    console.log('generateTimeBlocks iniciado');
    let timeBlocks = [];
    // Aquí deberías generar tus bloques de tiempo basándote en tus clases y bloques de trabajo
    // Por ejemplo:
    classes.forEach(clase => {
        timeBlocks.push({startTime: clase.hora_inicio, endTime: clase.hora_fin});
    });
    workBlocks.forEach(block => {
        timeBlocks.push({startTime: block.inicio, endTime: block.fin});
    });
    // Ordenar y filtrar bloques de tiempo únicos
    timeBlocks = timeBlocks.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    // Eliminar bloques de tiempo solapados y fusionarlos en un solo bloque
    for (let i = 0; i < timeBlocks.length - 1; i++) {
        if (timeBlocks[i].endTime > timeBlocks[i + 1].startTime) {
            timeBlocks[i].endTime = timeBlocks[i + 1].endTime;
            timeBlocks.splice(i + 1, 1);
            i--; // Retroceder el índice para revisar nuevamente
        }
    }
    console.log('Bloques de tiempo generados:', timeBlocks);
    return timeBlocks;
}

// Función para encontrar la celda para una clase
function findCellForClass(clase, timeBlocks) {
    console.log('Buscando celda para clase:', clase);
    const dayColumn = getDayColumn(clase.día);
    for (let i = 0; i < timeBlocks.length; i++) {
        const block = timeBlocks[i];
        if (clase.hora_inicio >= block.startTime && clase.hora_inicio < block.endTime) {
            const row = i + 1; // +1 porque la primera fila es el encabezado
            const table = document.getElementById('workScheduleTable');
            if (table.rows[row] && table.rows[row].cells[dayColumn]) {
                console.log('Celda encontrada para clase:', clase);
                return table.rows[row].cells[dayColumn];
            }
        }
    }
    console.log('Celda NO encontrada para clase:', clase);
    return null;
}

// Función para encontrar la celda para un bloque de trabajo
function findCellForWorkBlock(workBlock, timeBlocks) {
    console.log('Buscando celda para bloque de trabajo:', workBlock);
    const dayColumn = getDayColumn(workBlock.día);
    for (let i = 0; i < timeBlocks.length; i++) {
        const block = timeBlocks[i];
        if (workBlock.inicio >= block.startTime && workBlock.inicio < block.endTime) {
            const row = i + 1; // +1 porque la primera fila es el encabezado
            const table = document.getElementById('workScheduleTable');
            if (table.rows[row] && table.rows[row].cells[dayColumn]) {
                console.log('Celda encontrada para bloque de trabajo:', workBlock);
                return table.rows[row].cells[dayColumn];
            }
        }
    }
    console.log('Celda NO encontrada para bloque de trabajo:', workBlock);
    return null;
}

// Función para obtener la columna del día
function getDayColumn(day) {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return days.indexOf(day) + 1; // +1 porque la primera columna es el horario
}

// Función para convertir tiempo a minutos
function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

// Función para convertir minutos a tiempo
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
}

// Puedes llamar a loadSchedules() para iniciar el proceso
loadSchedules();
