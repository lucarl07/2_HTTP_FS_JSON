import fs from 'node:fs';

// The following function will be used for reading JSON data: 

export const readEmployeeData = (callback) => {
  fs.readFile("funcionarios.json", "utf8", (err, data) => {
    if (err) callback(err);

    try {
      const employees = JSON.parse(data)
      callback(null, employees);
    } catch (error) {
      callback(error)
    }
  });
}

// The following function will be used for writing JSON data (possibly assynchronously): 

export const writeEmployeeData = (value, callback) => {
  fs.writeFile('funcionarios.json', JSON.stringify(value, null, 2),
    (err) => {
      if (err) {
        callback(err)
      } else {
        callback(null);
      }
    }
  );
}
