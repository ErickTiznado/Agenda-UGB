from datetime import datetime, timedelta
from collections import defaultdict

class PlanificadorDescansosRefactorizado:
    def __init__(self, intervalo=30):
        self.intervalo = intervalo
        self.horas_del_dia = self.generar_horas_del_dia()

    def generar_horas_del_dia(self):
        intervalo_minutos = self.intervalo
        hora_actual = datetime.strptime("00:00", "%H:%M")
        horas = []
        while hora_actual < datetime.strptime("24:00", "%H:%M"):
            horas.append(hora_actual.strftime("%H:%M"))
            hora_actual += timedelta(minutes=intervalo_minutos)
        return horas

    def sumar_horas(self, hora, minutos):
        hora_actual = datetime.strptime(hora, "%H:%M")
        hora_nueva = hora_actual + timedelta(minutes=minutos)
        return hora_nueva.strftime("%H:%M")

    def agregar_bloque(self, inicio, duracion, tipo, bloques_ocupados, descanso=0):
        fin = self.sumar_horas(inicio, duracion)
        bloques_ocupados.append((inicio, fin, tipo))
        siguiente_inicio = self.sumar_horas(fin, descanso)
        return siguiente_inicio

    def asignar_comida(self, bloques_ocupados, descanso_comida):
        self.agregar_bloque("13:00", 60, "Comida", bloques_ocupados, descanso_comida)

    def asignar_sueno(self, horas_sueno, bloques_ocupados):
        self.agregar_bloque("23:00", horas_sueno * 60, "Sueño", bloques_ocupados)

    def asignar_estudio(self, horas_estudio, tecnicas_estudio, bloques_ocupados, descanso_estudio):
        for materia, preferencia in tecnicas_estudio.items():
            horas_asignadas = 0
            while horas_asignadas < horas_estudio:
                preferencia = self.agregar_bloque(preferencia, 60, f'Estudio de {materia}', bloques_ocupados, descanso_estudio)
                horas_asignadas += 1

    def generar_horario_completo(self, horario_clases, horario_trabajo, horas_sueno, horas_estudio, tecnicas_estudio, descanso_estudio, descanso_comida, prioridades):
        dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        horario = defaultdict(list)
        reajustes = defaultdict(list)

        for dia in dias:
            bloques_ocupados = horario_clases.get(dia, []) + horario_trabajo.get(dia, [])
            bloques_ocupados.sort(key=lambda x: x[0])

            for actividad in prioridades:
                if actividad == "Clases" or actividad == "Trabajo":
                    continue

                if actividad == "Estudio":
                    self.asignar_estudio(horas_estudio, tecnicas_estudio, bloques_ocupados, descanso_estudio)
                elif actividad == "Comida":
                    self.asignar_comida(bloques_ocupados, descanso_comida)
                elif actividad == "Sueño":
                    self.asignar_sueno(horas_sueno, bloques_ocupados)

            horario[dia] = sorted(bloques_ocupados, key=lambda x: x[0])

        return horario, reajustes