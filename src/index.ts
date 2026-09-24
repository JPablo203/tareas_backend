import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Listar todos los enanos
app.get('/enanos', async (_req: Request, res: Response) => {
  try {
    const enanos = await prisma.enano.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(enanos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los enanos' });
  }
});

// Crear un enano (recibe edad)
app.post('/enanos', async (req: Request, res: Response) => {
  try {
    const { titulo, precio, descripcion, imagen, edad } = req.body;

    const nuevoEnano = await prisma.enano.create({
      data: {
        titulo,
        precio: Number(precio) || 0,
        descripcion: descripcion || '',
        imagen: imagen || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        edad: Number(edad) || 0,
      },
    });

    res.status(201).json(nuevoEnano);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el enano' });
  }
});

// Eliminar un enano por ID
app.delete('/enanos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.enano.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar el enano' });
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Backend escuchando en http://0.0.0.0:${PORT}`);
});