const fs = require('fs');

fs.readFile('miArchivo.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
