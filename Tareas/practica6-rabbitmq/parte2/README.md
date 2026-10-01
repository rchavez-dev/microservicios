# Parte 2 - Práctica 6 RabbitMQ
## Dominio: Clínica San Xavier

Evento principal: `CitaAgendada`  
Exchange temático: `clinica.eventos`  
Routing key principal: `cita.agendada`

## Regla de routing keys
Formato: `dominio.evento`

Ejemplos:
- `cita.agendada`
- `cita.cancelada`
- `pago.registrado`
- `paciente.actualizado`
- `medico.actualizado`

## Servicios
- `productor-citas`: confirma una cita y luego publica `CitaAgendada`.
- `consumidor-notificaciones`: ACK manual, prefetch=1, reintentos, DLQ e idempotencia persistente.
- `infra`: topología y scripts de prueba.

## Ejercicio 3 - patrones
- `clinica.notificaciones` -> `cita.agendada` (específico)
- `clinica.citas` -> `cita.*` (una palabra)
- `clinica.auditoria` -> `#` (todo)

## Ejercicio 6 - idempotencia
El registro se guarda en `consumidor-notificaciones/procesados.json`.
Para demostrar primero el daño use `IDEMPOTENCIA=false`.
Para demostrar la corrección use `IDEMPOTENCIA=true`, reinicie el consumidor y vuelva a publicar el mismo `messageId`.
