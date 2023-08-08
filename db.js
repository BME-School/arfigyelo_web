import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  database: 'arfigyelo',
});


export function getAllProducts() {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) reject(err);
      connection.query(`SELECT * FROM products WHERE img is not null`, (err, rows) => {
        if (err) reject(err);
        else resolve(rows); 
      });
    });
  });
};