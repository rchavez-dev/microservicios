# Checklist de evidencias - Parte 2

## Ejercicio 1
- [ ] Exchange `clinica.eventos` tipo topic
- [ ] Bindings visibles
- [ ] Evento `CitaAgendada`
- [ ] `persistent: true`
- [ ] `messageId` estable
- [ ] Publicación después de confirmar la cita

## Ejercicio 2
- [ ] Consumidor apagado
- [ ] 5 citas aceptadas por la API
- [ ] Cola acumulando
- [ ] Consumidor encendido
- [ ] Cola en cero
- [ ] Medición de tiempos con consumidor encendido/apagado

## Ejercicio 3
- [ ] `clinica.notificaciones` -> `cita.agendada`
- [ ] `clinica.citas` -> `cita.*`
- [ ] `clinica.auditoria` -> `#`
- [ ] 5 routing keys publicadas
- [ ] Tabla de predicción vs resultado: 1 / 2 / 5 mensajes

## Ejercicio 4
- [ ] `NO_ACK=false`
- [ ] `prefetch(1)`
- [ ] Con `TIEMPO_PROCESO_MS=10000`: Unacked -> Ready al caer consumidor
- [ ] Mensajes sobreviven reinicio de broker
- [ ] Contraprueba con `NO_ACK=true`
- [ ] Contraprueba con `npm run durabilidad`: cola transitoria + mensaje no persistente

## Ejercicio 5
- [ ] Cola principal + retry + DLQ
- [ ] TTL 5000
- [ ] Reintentos por `x-death`
- [ ] Mensaje inválido llega a `clinica.muertos`
- [ ] Contenido recuperado desde RabbitMQ

## Ejercicio 6
- [ ] `IDEMPOTENCIA=false`: daño por evento duplicado demostrado
- [ ] `IDEMPOTENCIA=true`: duplicado ignorado
- [ ] `procesados.json` persiste al reinicio
- [ ] Duplicado ignorado después de reiniciar consumidor
