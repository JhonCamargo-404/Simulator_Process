from flask import Flask, render_template, request, jsonify
from processing.serial import serial_processing
from processing.roundrobin import round_robin
from processing.batchProcessing import process_batches 

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route("/execute_serial", methods=["POST"])
def execute_serial():
    data = request.json
    processes = data["processes"]

    # Ejecutar el algoritmo de Procesamiento en Serie
    result = serial_processing(processes)
    return jsonify(result)


@app.route("/execute_round_robin", methods=["POST"])
def execute_round_robin_route():
    data = request.json
    processes = data["processes"]
    quantum = int(data["quantum"])

    # Ejecutar el algoritmo de Round Robin
    result, gantt_blocks = round_robin(processes, quantum)

    return jsonify({
        "results": result,        # Datos para la tabla
        "blocks": gantt_blocks    # Bloques para Gantt
    })


@app.route("/execute_batches", methods=["POST"])
def execute_batches():
    data = request.json  
    batches = data["batches"]  
    quantum = int(data["quantum"])  

    result, gantt_all_blocks = process_batches(batches, quantum)

    return jsonify({
        "results": result,
        "blocks": gantt_all_blocks
    })

if __name__ == "__main__":
    app.run(debug=True)
