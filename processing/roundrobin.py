def round_robin(processes, quantum, start_time=0):

    queue = []  # Cola de procesos listos para ejecutarse.
    time = start_time  # Reloj de la simulación.
    result = []  # Lista para almacenar estadísticas de cada proceso al finalizar.
    gantt_blocks = []  # Lista para construir el diagrama de Gantt.

    # Diccionario que almacena el tiempo de ráfaga restante para cada proceso.
    remaining_burst_time = {p["process"]: int(p["burst_time"]) for p in processes}

    # Ordenar los procesos por tiempo de llegada.
    processes.sort(key=lambda x: int(x["arrive_time"]))
    processes_copy = processes.copy()  # Copia de los procesos para manejar su llegada.

    # Mientras haya procesos por ejecutar o procesos en la cola.
    while processes_copy or queue:
        # Agregar a la cola los procesos que han llegado hasta el momento.
        while processes_copy and int(processes_copy[0]["arrive_time"]) <= time:
            queue.append(processes_copy.pop(0))

        if queue:
            # Extraer el primer proceso de la cola.
            current_process = queue.pop(0)
            process_id = current_process["process"]
            arrive_time = int(current_process["arrive_time"])
            burst_time = remaining_burst_time[process_id]

            # Determinar cuánto tiempo ejecutará el proceso en este turno.
            execution_time = min(quantum, burst_time)

            # Registrar la ejecución en el diagrama de Gantt.
            gantt_blocks.append({
                "process": process_id,
                "start_time": time,
                "end_time": time + execution_time,
                "lote_id": current_process.get("lote_id")  # Identificador del lote, si existe.
            })

            # Avanzar el tiempo de simulación.
            time += execution_time
            remaining_burst_time[process_id] -= execution_time  # Reducir el tiempo restante del proceso.

            # Agregar nuevos procesos que hayan llegado durante la ejecución.
            while processes_copy and int(processes_copy[0]["arrive_time"]) <= time:
                queue.append(processes_copy.pop(0))

            # Si el proceso aún tiene tiempo restante, se reinsertará en la cola.
            if remaining_burst_time[process_id] > 0:
                queue.append(current_process)
            else:
                # Calcular tiempos de finalización, turnaround y espera.
                completion_time = time
                turnaround_time = completion_time - arrive_time
                waiting_time = turnaround_time - int(current_process["burst_time"])

                # Guardar las estadísticas finales del proceso.
                result.append({
                    "process": process_id,
                    "arrive_time": arrive_time,
                    "burst_time": int(current_process["burst_time"]),
                    "completion_time": completion_time,
                    "turnaround_time": turnaround_time,
                    "waiting_time": waiting_time,
                    "lote_id": current_process.get("lote_id")  # Identificador del lote, si existe.
                })
        else:
            # Si no hay procesos listos, avanzar el tiempo hasta que llegue uno.
            time += 1

    return result, gantt_blocks  # Retornar estadísticas y diagrama de Gantt.
