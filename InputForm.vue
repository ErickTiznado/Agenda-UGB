<template>
  <div class="container mt-4">
    <!-- Horario de Clases -->
    <h2>Horario de Clases</h2>
    <div v-for="(clase, index) in clases" :key="index" class="mb-3">
        <div class="row">
            <div class="col">
                <input v-model="clase.dia" type="text" placeholder="Día (ej. Lunes)" class="form-control">
            </div>
            <div class="col">
                <input v-model="clase.inicio" type="time" class="form-control">
            </div>
            <div class="col">
                <input v-model="clase.fin" type="time" class="form-control">
            </div>
        </div>
    </div>
    <button @click="agregarClase" class="btn btn-primary mb-4">Agregar Clase</button>

    <!-- Aquí puedes continuar con la entrada de datos para Horario de Trabajo, Horas de Sueño, etc. -->

    <button @click="generarHorario" class="btn btn-success">Generar Horario de Estudio</button>
  </div>
</template>

<script>
export default {
    data() {
        return {
            clases: [],
            trabajo: [],
            horasSueno: { inicio: '', fin: '' },
            horasEstudio: {},
            tecnicaEstudio: ''
        };
    },
    methods: {
        agregarClase() {
            this.clases.push({ dia: '', inicio: '', fin: '' });
        },
        generarHorario() {
            // Aquí se enviarán los datos al servidor (PHP) para procesarlos con el algoritmo y luego recibir el horario.
            // Puedes usar Axios o la API Fetch para hacer la solicitud HTTP.
        }
    }
};
</script>

<style scoped>
/* Aquí puedes agregar estilos específicos para este componente si es necesario */
</style>
