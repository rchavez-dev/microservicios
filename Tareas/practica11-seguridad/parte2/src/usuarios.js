const bcrypt = require("bcrypt");

const usuarios = [
  { id: "u-1", username: "admin", passwordHash: "$2b$10$XWPJWRbae7/SGElJF7Da6.TtIpTHIaIEM88THQu31PVsWq619U0Gu", rol: "admin", nombre: "Administrador Sistema" },
  { id: "u-2", username: "operador", passwordHash: "$2b$10$iDrHgoECQX4LRHJgXGd.IuuvSgMbAdWvwg/4c//q39IRZe0nNxcS6", rol: "operador", nombre: "Operador de Tareas" },
  { id: "u-3", username: "lector", passwordHash: "$2b$10$qdYlOQ6rzLD8ZNtNYukluubuzQYIe0Se3Fi2wsMPklzorGomKM.hi", rol: "consulta", nombre: "Usuario Consulta" }
];

async function validarCredenciales(username, password) {
  const usuario = usuarios.find(u => u.username === username);
  if (!usuario) return null;
  const coincide = await bcrypt.compare(password, usuario.passwordHash);
  if (!coincide) return null;
  return { id: usuario.id, username: usuario.username, rol: usuario.rol, nombre: usuario.nombre };
}

module.exports = { validarCredenciales };
