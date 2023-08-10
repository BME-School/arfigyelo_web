import express from "express";
import { getAllProducts } from "./db.js"
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

app.get('/getproducts/:myArray', (req, res) => {
  const categories = req.params.myArray.split(','); 
 getAllProducts(categories)
    .then((products) => {
      res.json(products);})
    .catch((err) => {
      res.status(500).json({ error: 'Szerver hiba' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});