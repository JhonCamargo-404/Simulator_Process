from processing.roundrobin import round_robin

def process_batches(batches, quantum):
    global_time = 0  
    result = []  
    gantt_all_blocks = []  

    # Ordenar lotes por tiempo de llegada
    batches.sort(key=lambda x: int(x["arrival_time"]))

    for batch in batches:
        lote_id = batch["lote_id"]  
        arrival_time = int(batch["arrival_time"])  
        processes = batch["processes"]  

        if global_time < arrival_time:
            global_time = arrival_time  

        # Asignar tiempos de llegada y lote_id
        for p in processes:
            p["arrive_time"] = arrival_time  
            p["lote_id"] = lote_id  

        # Ejecutar Round Robin en el lote
        lote_result, lote_blocks = round_robin(processes, quantum, start_time=global_time)

        # Asegurar estructura de datos plana
        if isinstance(lote_result[0], list):
            lote_result = [proc for sublist in lote_result for proc in sublist]

        # Actualizar tiempo global
        global_time = max(p["completion_time"] for p in lote_result)

        # Asignar lote_id a los resultados
        for proc in lote_result:
            proc["lote_id"] = lote_id  
            result.append(proc)  

        for block in lote_blocks:
            block["lote_id"] = lote_id  

        gantt_all_blocks.extend(lote_blocks)  

    return result, gantt_all_blocks
