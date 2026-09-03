#!/bin/bash
set -e

VOLUMEN="ejercicio3_datos_mongo"
FECHA=$(date +"%Y%m%d_%H%M%S")
ARCHIVO="backup_mongo_${FECHA}.tar.gz"

echo "Creando respaldo de ${VOLUMEN}..."

docker run --rm \
  -v "${VOLUMEN}":/origen:ro \
  -v "$(pwd)":/backup \
  alpine tar -czvf "/backup/${ARCHIVO}" -C /origen .

echo "Respaldo generado exitosamente: ${ARCHIVO}"
