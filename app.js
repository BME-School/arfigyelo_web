import express from "express";
import { getDiscountProducts, getProductsByCategory } from "./db.js"
import { fileURLToPath } from 'url';
import { dirname } from "path"
import path from "path";

const app = express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static("public"));

app.get("/", (req, res) => {
  const indexPath = path.join(__dirname, 'views', 'index.html');
  res.sendFile(indexPath)
});

app.get('/products', (req, res) => {
  const category = req.query.category;

  if(category) {
    // Kategória termékeinek lékérése
    getProductsByCategory(category)
      .then((products) => {
        res.json(products);})
      .catch((err) => {
        res.status(500).json({ error: 'Szerver hiba' });
    });
  } 
  
  else {
    // Akciós termékek lekérése
    getDiscountProducts()
      .then((products) => {
        res.json(products);})
      .catch((err) => {
        res.status(500).json({ error: 'Szerver hiba' });
    });
  }
  
});



  
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});