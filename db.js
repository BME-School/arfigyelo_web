import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  database: 'arfigyelo',
});

export function getDiscountProducts() {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) reject(err);

    const query = `SELECT *
        FROM products
        WHERE tesco_price <= best_price OR auchan_price <= best_price`;

    connection.query(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows); 
      });
    });
  });
};

export function getProductsByCategory(category) {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) reject(err);

    const query = `SELECT *
        FROM products
        WHERE category = "${category}"`;

    connection.query(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows); 
      });
    });
  });
};
