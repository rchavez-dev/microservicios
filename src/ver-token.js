// Decodifica SIN verificar la firma: solo separa y traduce base64url.
const token = process.argv[2];
const [cab, carga, firma] = token.split(".");

const leer = (p) => JSON.parse(Buffer.from(p, "base64url").toString("utf8"));

console.log("Encabezado:", leer(cab));
console.log("Carga     :", leer(carga));
console.log("Firma     :", firma, "(" + firma.length + " caracteres)");
