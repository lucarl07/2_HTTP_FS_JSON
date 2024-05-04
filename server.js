import http from 'node:http';
import { readEmployeeData, writeEmployeeData } from './empController.js';
import { URLSearchParams } from 'node:url';
import fs from 'node:fs';

const PORT = 5333;

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // CORS:
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  // JSON RESPONSE:
  const writeJSONResponse = (statusCode, output = '', message = 'Operação finalizada com sucesso!') => {
    res.writeHead(statusCode, { "Content-Type": "application/json" }) 
    res.end(JSON.stringify(output))
    return console.log(message);
  }

  // ENDPOINTS:
  if (method === 'GET' && url === '/empregados') {
    console.log('GET /empregados 👨‍💼👩‍💼');

    readEmployeeData((err, data) => {
      if (err) {
        writeJSONResponse(500, { 
          message: "Erro ao buscar os dados." 
        }, 'Erro ao buscar os dados.')
      }

      writeJSONResponse(200, data)
    });

  } else if (method === 'GET' && url === '/empregados/count') {
    console.log('GET /empregados/count 🧍🧍🧍');

    readEmployeeData((err, data) => {
      if (err) {
        writeJSONResponse(500, { 
          message: "Erro ao buscar os dados." 
        }, 'Erro ao buscar os dados.')
      }

      const dataLength = data.length;

      writeJSONResponse(200, { 
        quantidade: dataLength 
      })
    });

  } else if (method === 'GET' && url.startsWith('/empregados/porCargo/')) {
    console.log('GET /empregados/porCargo/{work} 💼')
    
    const work = url.split('/')[3]
    console.log(`Work: ${work}`);

    readEmployeeData((err, data) => {
      if (err) {
        writeJSONResponse(500, { 
          message: "Erro ao buscar os dados." 
        }, 'Erro ao buscar os dados.')
      }

      const empByWork = data.filter((emp) => emp.cargo === work);

      if (empByWork.length === 0) {
        writeJSONResponse(404, { 
          message: 'Nenhum funcionário com este cargo foi encontrado.' 
        });
      }

      writeJSONResponse(200, empByWork)
    });

  } else if (method === 'GET' && url.startsWith('/empregados/porHabilidade/')) {
    console.log('GET /empregados/porHabilidade/{skill} 🧠')
    
    const skill = url.split('/')[3]
    console.log(`Skill: ${skill}`);

    readEmployeeData((err, data) => {
      if (err) {
        writeJSONResponse(500, { 
          message: "Erro ao buscar os dados." 
        }, 'Erro ao buscar os dados.')
      }

      const empBySkill = data.filter((emp) => {
        const hasSkill = emp.habilidades.find(empSk => empSk === skill)
        if (hasSkill) return emp;
      });

      writeJSONResponse(200, empBySkill)
    });

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

    readEmployeeData((err, data) => {
      if (err) {
        writeJSONResponse(500, { 
          message: "Erro ao buscar os dados." 
        }, 'Erro ao buscar os dados.')
      }

      const empOnRange = data.filter(
        (emp) => 
          emp.salario >= minPay &&
          emp.salario <= maxPay
      );

      if (empOnRange.length === 0) {
        return writeJSONResponse(404, { 
          message: 'Nenhum funcionário nesta faixa salarial foi encontrado.' 
        });
      }

      writeJSONResponse(200, empOnRange)
    });
    
  } else if (method === 'GET' && url.startsWith('/empregados/')) {
    console.log('GET /empregados/{id} 👨‍💼');

    const id = parseInt(url.split('/')[2])
    console.log(`ID: ${id}`)

    readEmployeeData((err, data) => {
      if (err) {
        writeJSONResponse(500, { 
          message: "Erro ao buscar os dados." 
        }, 'Erro ao buscar os dados.')
      }

      const empIndex = data.findIndex(emp => emp.id === id);

      if (empIndex === -1) {
        writeJSONResponse(404, { 
          message: "Funcionário não encontrado." 
        }, 'Funcionário não encontrado.')
      } else {
        writeJSONResponse(200, data[empIndex])
      }
    });

  } else if (method === 'POST' && url === '/empregados') {
    console.log('POST /empregados 👨‍💼📓')

    let body = '';

    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      const newEmp = JSON.parse(body)

      readEmployeeData((err, data) => {
        if (err) {
          writeJSONResponse(500, { 
            message: "Erro ao buscar os dados." 
          }, 'Erro ao buscar os dados.')
        }
        
        newEmp.id = data.length + 1;
        data.push(newEmp);

        writeEmployeeData(data, (err) => {
          if (err) {
            writeJSONResponse(500, { 
              message: "Erro ao buscar os dados." 
            }, 'Erro ao buscar os dados.')
          }

          writeJSONResponse(201, newEmp)
        });
      });
    });

  } else if (method === 'PUT' && url.startsWith('/empregados/')) {
    console.log('PUT /empregados/{id} 🗒️🖋️👨‍💼')
    
    const id = parseInt(url.split('/')[2])
    console.log(`ID: ${id}`)

    let body = '';

    req.on('data', (chunk) => body += chunk)
    req.on('end', () => {
      readEmployeeData((err, data) => {
        if (err) {
          writeJSONResponse(500, { 
            message: "Erro ao buscar os dados." 
          }, 'Erro ao buscar os dados.')
        }

        console.log(data)

        const index = data.findIndex((emp) => emp.id === id)
        
        if (index === -1) {
          return writeJSONResponse(404, { 
            message: "Funcionário não encontrado." 
          }, 'Funcionário não encontrado.')
        }

        const updtEmp = JSON.parse(body)

        data[index] = {
          ...data[index],
          ...updtEmp,
          id: id,
          cpf: data[index].cpf
        }

        writeEmployeeData(data, (err) => {
          if (err) {
            return writeJSONResponse(500, { 
              message: "Erro ao buscar os dados." 
            }, 'Erro ao buscar os dados.')
          }

          writeJSONResponse(201, data[index])
        });
      });
    });

  } else if (method === 'DELETE' && url.startsWith('/empregados/')) {
    console.log('DELETE /empregados/{id} 🏌️💫')

    const id = parseInt(url.split('/')[2])
    console.log(`ID: ${id}`)

    readEmployeeData((err, data) => {
      if (err) {
        writeJSONResponse(500, { 
          message: "Erro ao buscar os dados." 
        }, 'Erro ao buscar os dados.')
      }

      const index = data.findIndex(emp => emp.id === id)

      if (index === -1) {
        writeJSONResponse(404, { 
          message: "Funcionário não encontrado. Parece que ele nunca existiu mesmo... 🤷" 
        }, 'Funcionário não encontrado.')
      }

      data.splice(index, 1)

      writeEmployeeData(data, (err) => {
        if (err) {
          writeJSONResponse(500, { 
            message: "Erro ao buscar os dados." 
          }, 'Erro ao buscar os dados.')
        }

        writeJSONResponse(200, {
          message: `Funcionário ${index+1} removido com sucesso.`,
          link: "Acesse GET http://localhost:5333/empregados para ver as alterações feitas."
        });
      });
    });

    res.end();
  } else {
    writeJSONResponse(404, { 
      message: "Nenhuma rota foi encontrada... ou você só queria verificar a raiz dessa API. Se sim, bem-vindo!" 
    }, 'Nenhuma rota foi encontrada.');
  }
});

server.listen(PORT, () => {
  console.log(`Servidor no PORT: ${PORT} 🚀`)
})