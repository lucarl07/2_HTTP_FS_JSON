import http from 'node:http';
import fs from 'node:fs';
import { URLSearchParams } from 'node:url';

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

    const writeResponseJSON = (sttCode, output = '') => {
      res.writeHead(sttCode, { "Content-Type": "application/json" }) 

      if (sttCode === 500) {
        res.end(JSON.stringify({ message: 'Erro ao buscar os dados.' }))
        return console.log('Erro ao buscar os dados.');
      }

      res.end(JSON.stringify(output))
      return console.log('Operação finalizada com sucesso!');
    }

    if (method === 'GET' && url === '/empregados') {
      console.log('GET /empregados 👨‍💼👩‍💼');

      fs.readFile('funcionarios.json', 'utf-8', (err, data) => {
        if (err) writeResponseJSON(500)

        const jsonData = JSON.parse(data)

        writeResponseJSON(200, jsonData)
      });

    } else if (method === 'GET' && url === '/empregados/count') {
      console.log('GET /empregados/count 🧍🧍🧍');

      fs.readFile('funcionarios.json', 'utf-8', (err, data) => {
        if (err) writeResponseJSON(500)

        const jsonData = JSON.parse(data)
        const dataLength = jsonData.length;

        writeResponseJSON(200, { quantidade: dataLength })
      })

    } else if (method === 'GET' && url.startsWith('/empregados/porCargo/')) {
      console.log('GET /empregados/porCargo/{work} 💼')
      
      const work = url.split('/')[3]
      console.log(`Work: ${work}`);

      fs.readFile('funcionarios.json', 'utf-8', (err, data) => {
        if (err) writeResponseJSON(500)

        const jsonData = JSON.parse(data)
        const empByWork = jsonData.filter((emp) => emp.cargo === work);

        if (empByWork.length === 0) {
          writeResponseJSON(404, { 
            message: 'Nenhum funcionário com este cargo foi encontrado.' 
          });
        }

        writeResponseJSON(200, empByWork)
      })

    } else if (method === 'GET' && url.startsWith('/empregados/porHabilidade/')) {
      console.log('GET /empregados/porHabilidade/{skill} 🧠')
      
      const skill = url.split('/')[3]
      console.log(`Skill: ${skill}`);

      fs.readFile('funcionarios.json', 'utf-8', (err, data) => {
        if (err) if (err) writeResponseJSON(500)

        const jsonData = JSON.parse(data)
        const empBySkill = jsonData.filter((emp) => {
          const hasSkill = emp.habilidades.find(empSk => empSk === skill)
          if (hasSkill) return emp;
        });

        if (empBySkill.length === 0) {
          writeResponseJSON(404, { 
            message: 'Nenhum funcionário com esta habilidade foi encontrado.' 
          })
          return;
        }

        writeResponseJSON(200, empBySkill)
      })

    } else if (method === 'GET' && url.startsWith('/empregados/porFaixaSalarial')) {
      /** Requisições:
       * body -> JSON -> POST
       * Route PARAM -> porHabilidade/ValorEnviado -> PUT, DELETE, PATH, GET
       * Query PARAM -> porFaixaSalarial?min={10}&max={20} -> 
       */
      console.log('GET /empregados/porFaixaSalarial?min={min}&max={max} 💵')
      
      const queryParams = new URLSearchParams(url.split('?')[1])
      const minPay = queryParams.get('min'), maxPay = queryParams.get('max')
      console.log(`Minimal pay: ${minPay} \nMaximum pay: ${maxPay}`)

      fs.readFile('funcionarios.json', 'utf-8', (err, data) => {
        if (err) writeResponseJSON(500)

        const jsonData = JSON.parse(data);
        const empOnRange = jsonData.filter(
          (emp) => 
            emp.salario >= minPay &&
            emp.salario <= maxPay
        );

        if (empOnRange.length === 0) {
          writeResponseJSON(404, { 
            message: 'Nenhum funcionário nesta faixa salarial foi encontrado.' 
          })
          return;
        }

        writeResponseJSON(200, empOnRange)
      });

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
          (err, data) => {
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
      
      const id = parseInt(url.split('/')[2])
      console.log(`ID: ${id}`)

      let body = '';

      req.on('data', (chunk) => body += chunk)
      req.on('end', () => {
        fs.readFile('funcionarios.json', 'utf-8', (err, data) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ message: 'Erro ao buscar os dados.' }))
            return console.log('Erro ao buscar os dados.');
          }

          const jsonData = JSON.parse(data);
          const index = jsonData.findIndex(emp => emp.id === id)

          if (index === -1) {
            res.writeHead(404, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ message: 'Funcionário não encontrado.' }))
          }

          const updtEmp = JSON.parse(body)
          jsonData[index] = {
            ...jsonData[index], 
            ...updtEmp, 
            id: id,
            cpf: jsonData[index].cpf
          }

          fs.writeFile('funcionarios.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "application/json" })
              res.end(JSON.stringify({ message: 'Erro ao buscar os dados.' }))
              return console.log('Erro ao buscar os dados.');
            }

            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify(jsonData[index]))
          })
        })
      })

    } else if (method === 'DELETE' && url.startsWith('/empregados/')) {
      console.log('DELETE /empregados/{id} 🏌️💫')
      res.end();
    }
  });
})

server.listen(PORT, () => {
  console.log(`Servidor no PORT: ${PORT} 🚀`)
})