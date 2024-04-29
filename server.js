import http from 'node:http'
import fs from 'node:fs'

const PORT = 5333;

const server = http.createServer((req, res) => {
  const { method, url } = req;

  fs.readFile('funcionarios.json', 'utf-8', (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ message: 'Erro ao buscar os dados.' }))
      return;
    }

    let jsonData = [];

    try {
      jsonData = JSON.parse(data)
    } catch (error) {
      console.error('Erro ao ler o arquivo jsonData =>' + error)
    }

    if (method === 'GET' && url === '/empregados') {
      console.log('GET /empregados 👨‍💼👩‍💼');

      fs.readFile('funcionarios.json', 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ message: 'Erro ao buscar os dados.' }))
          return console.log('Erro ao buscar os dados.');
        }

        const jsonData = JSON.parse(data)
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(jsonData));
      })

      console.log('Operação finalizada com sucesso!');
    } else if (method === 'GET' && url === '/empregados/count') {
      console.log('GET /empregados/count 🧍🧍🧍');

      fs.readFile('funcionarios.json', 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(500, {"Content-Type": "application/json"})
          res.end(JSON.stringify({ message: 'Erro ao buscar os dados.' }))
          return console.log('Erro ao buscar os dados.');
        }

        const jsonData = JSON.parse(data)
        const dataLength = jsonData.length;

        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify({ quantidade: dataLength }))
        return console.log('Operação finalizada com sucesso!');
      })

    } else if (method === 'GET' && url.startsWith('/empregados/porCargo/')) {
      console.log('GET /empregados/porCargo/{position} 💼')
      res.end();
    } else if (method === 'GET' && url.startsWith('/empregados/porHabilidade/')) {
      console.log('GET /empregados/porHabilidade/{skill} 🧠')
      res.end();
    } else if (method === 'GET' && url.startsWith('/empregados/porFaixaSalarial')) {
      console.log('GET /empregados/porFaixaSalarial?min={min}&max={max} 💵')
      res.end();
    } else if (method === 'GET' && url.startsWith('/empregados/')) {
      console.log('GET /empregados/{id} 👨‍💼');

      const id = parseInt(url.split('/')[2])
      console.log(`ID: ${id}`)

      fs.readFile('funcionarios.json', 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(500, {"Content-Type": "application/json"})
          res.end(JSON.stringify({ message: 'Erro ao buscar os dados.' }))
          return console.log('Erro ao buscar os dados.');
        }

        const jsonData = JSON.parse(data)
        const empIndex = jsonData.findIndex(emp => emp.id === id);

        if (empIndex === -1) {
          res.writeHead(404, {"Content-Type": "application/json"})
          res.end(JSON.stringify({ message: 'Funcionário não encontrado.' }))
          return console.log('Funcionário não encontrado.');
        } else {
          res.writeHead(200, {"Content-Type": "application/json"})
          res.end(JSON.stringify(jsonData[empIndex]));
          return console.log('Operação finalizada com sucesso!');
        }
      })

    } else if (method === 'POST' && url === '/empregados') {
      console.log('POST /empregados 👨‍💼📓')

      let body = '';

      req.on('data', (chunk) => {
        body += chunk
      })
      req.on('end', () => {
        const newEmp = JSON.parse(body)
        newEmp.id = jsonData.length + 1;
        jsonData.push(newEmp)

        fs.writeFile('funcionarios.json', JSON.stringify(jsonData, null, 2),
          (err) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "application/json" })
              res.end(JSON.stringify({ message: 'Erro ao buscar os dados.' }))
              return console.log('Erro ao buscar os dados.');
            } else {
              res.writeHead(201, { "Content-Type": "application/json" })
              res.end(JSON.stringify(newEmp));
              return console.log('Operação finalizada com sucesso!');
            }
          }
        );
      });

    } else if (method === 'PUT' && url.startsWith('/empregados/')) {
      console.log('PUT /empregados/{id} 🗒️🖋️👨‍💼')
      res.end();
    } else if (method === 'DELETE' && url.startsWith('/empregados/')) {
      console.log('DELETE /empregados/{id} 🏌️🤸‍♂️')
      res.end();
    }
  });
})

server.listen(PORT, () => {
  console.log(`Servidor no PORT: ${PORT} 🚀`)
})