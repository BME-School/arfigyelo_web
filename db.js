import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  database: 'arfigyelo',
});


export function getAllProducts(categories) {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) reject(err);
      var conditions = categories.map(element => `${element} IS NOT NULL`).join(' OR ');
      connection.query(`SELECT * FROM products WHERE ${conditions}`, (err, rows) => {
        if (err) reject(err);
        else resolve(rows); 
      });
    });
  });
};