from flask import Flask, request, jsonify
from AgendaUGB import PlanificadorDescansosRefactorizado

app = Flask(__name__)

@app.route('/generar-horario', methods=['POST'])
def generar_horario():
    data = request.json
    planificador = PlanificadorDescansosRefactorizado()
    
    horario, reajustes = planificador.generar_horario_completo(
        data['horario_clases'],
        data['horario_trabajo'],
        data['horas_sueno'],
        data['horas_estudio'],
        data['tecnicas_estudio'],
        data['descanso_estudio'],
        data['descanso_comida'],
        data['prioridades']
    )
    
    return jsonify({"horario": horario, "reajustes": reajustes})

if __name__ == '__main__':
    app.run(debug=True)
