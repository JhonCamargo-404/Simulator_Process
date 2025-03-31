def serial_processing(processes):

    # Ordenar los procesos por tiempo de llegada (First Come, First Served - FCFS)
    processes.sort(key=lambda x: int(x["arrive_time"]))
    completion_time = 0  # Tiempo total en el que finaliza cada proceso.
    result = []  # Lista para almacenar estadísticas de cada proceso.

    for p in processes:
        process_id = p["process"]
        arrive_time = int(p["arrive_time"])
        burst_time = int(p["burst_time"])

        # Calcular el tiempo de inicio del proceso
        start_time = max(completion_time, arrive_time)

        # Calcular el tiempo de finalización
        completion_time = start_time + burst_time

        # Calcular tiempos relevantes
        turnaround_time = completion_time - arrive_time  # TAT = CT - AT
        waiting_time = turnaround_time - burst_time  # WT = TAT - BT

        # Almacenar resultados del proceso
        result.append({
            "process": process_id,
            "arrive_time": arrive_time,
            "burst_time": burst_time,
            "completion_time": completion_time,
            "turnaround_time": turnaround_time,
            "waiting_time": waiting_time
        })

    return result  # Retornar la lista de resultados con los tiempos calculados.
