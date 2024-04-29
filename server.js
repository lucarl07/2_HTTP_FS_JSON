import http from 'node:http'
import fs from 'node:fs'

const PORT = 5333;

const server = http.createServer((req, res) => {
  const {method, url} = req;

  fs.readFile('funcionarios.json', 'utf-8', (err, data) => {
    if (err) {
      res.writeHead(500, {"Content-Type": "application/json"})
      res.end(JSON.stringify({message: 'Erro ao buscar os dados.'}))
      return;
    }

    let jsonData = [];

    try {
      jsonData = JSON.parse(data)
    } catch (error) {
      console.error('Erro ao ler o arquivo jsonData -' + error)
    }

    if (method === 'GET' && url === '/empregados') {
      console.log('GET /empregados 👨‍💼👩‍💼')
      res.end();
    } else if (method === 'GET' && url === '/empregados/count') {
      console.log('GET /empregados/count 🧍🧍🧍')
      res.end();
    } else if (method === 'GET' && url === '/empregados/porCargo') {
      console.log('GET /empregados/porCargo 💼')
      res.end();
    } else if (method === 'GET' && url === '/empregados/porHabilidade') {
      console.log('GET /empregados/porHabilidade 🧠')
      res.end();
    } else if (method === 'GET' && url.startsWith('/empregados/porFaixaSalarial')) {
      console.log('GET /empregados/porFaixaSalarial 💵')
      res.end();
    } else if (method === 'GET' && url.startsWith('/empregados/')) {
      console.log('GET /empregados/... 👨‍💼')
      res.end();
    } else if (method === 'POST' && url === '/empregados') {
      console.log('POST /empregados 🧍')
      res.end();
    } else if (method === 'PUT' && url.startsWith('/empregados/')) {
      console.log('PUT /empregados/... 👨‍💼🔧')
      res.end();
    } else if (method === 'DELETE' && url.startsWith('/empregados')) {
      console.log('DELETE /empregados/... 🏌️🤸‍♂️')
      res.end();
    }
  });
})

server.listen(PORT, () => {
  console.log(`Servidor no PORT: ${PORT} 🚀`)
})