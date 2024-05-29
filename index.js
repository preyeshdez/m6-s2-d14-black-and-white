import express from 'express';
import jimp from 'jimp';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`)
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.post("/imagen-cargada", async (req, res) => {
    res.setHeader('Content-Type', 'image/jpg');

    const { imagenURL } = req.body;

    try {
        let imagen = await jimp.read(imagenURL);

        let nombreImagen = uuidv4().slice(0, 6);

        await imagen.resize(250, jimp.AUTO).grayscale().quality(100).writeAsync(path.join(__dirname, `/public/content/${nombreImagen}.jpg`));
        const imagenData = fs.readFileSync(path.join(__dirname, `/public/content/${nombreImagen}.jpg`));
        res.send(imagenData);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar la imagen');
    }
});

app.get("*", (req, res) => {
    res.send("Esta pagina no existe")
})
