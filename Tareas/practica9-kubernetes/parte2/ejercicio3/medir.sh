#!/bin/bash

OK=0
ERROR=0

for i in {1..100}; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Host: votos.localhost" \
    http://localhost:8080/salud/live)

  if [ "$CODE" = "200" ]; then
    OK=$((OK+1))
  else
    ERROR=$((ERROR+1))
  fi

  echo "Peticion $i -> HTTP $CODE"
  sleep 0.2
done

echo "---------------------"
echo "Respuestas 200: $OK"
echo "Respuestas no-200: $ERROR"
