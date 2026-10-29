const jwt = require("jsonwebtoken");
const SECRETO = process.env.JWT_SECRET;

if (!SECRETO) {
  throw new Error("JWT_SECRET no esta definida.");
}

function emitirToken(usuario) {
  return jwt.sign(
    { sub: usuario.id, username: usuario.username, rol: usuario.rol, nombre: usuario.nombre },
    SECRETO,
    { expiresIn: "15m", issuer: "microservicio-tareas-p2" }
  );
}

function autenticar(req, res, next) {
  const cabecera = req.headers.authorization || "";
  const [tipo, token] = cabecera.split(" ");
  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ error: "falta el token de autenticacion" });
  }
  try {
    req.usuario = jwt.verify(token, SECRETO);
    next();
  } catch (e) {
    return res.status(401).json({ error: e.message });
  }
}

function exigirRol(...roles) {
  return (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ error: "no autenticado" });
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: "rol insuficiente para esta operacion" });
    }
    next();
  };
}

module.exports = { autenticar, exigirRol, emitirToken, SECRETO };
