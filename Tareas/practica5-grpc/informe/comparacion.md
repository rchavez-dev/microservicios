| Medida                             | REST (P3)  | GraphQL (P4) | gRPC (P5) |
| :--------------------------------- | :--------- | :----------- | :-------- |
| Bytes de la respuesta              | 72         |     108      |   50      |
| Tiempo promedio observado (ms)     | 3.06       |      12.40   |   1.91    |
| Viajes de red del cliente          |  1         |      1       |   1       |
| Formato que viaja                  | texto      |  texto       |   binario |
| ¿Se puede leer sin el contrato?    |   sí       |      sí      |       no  |
| ¿El navegador lo consume directo?  |   sí       |       sí     |       no  |
| Público al que sirve mejor         | público    |  frontend    | interno   |