


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


