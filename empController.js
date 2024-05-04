import fs from 'node:fs';

// The following function will be used for reading JSON data: 

const readEmployeeData = (callback) => {
  fs.readFile("funcionarios.json", "utf8", (err, data) => {
    if (err) callback(err);

    try {
      const employee = JSON.parse(data)
      callback(null, employee);
    } catch (error) {
      callback(error)
    }
  });
}

export default readEmployeeData;