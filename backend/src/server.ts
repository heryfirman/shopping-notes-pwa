import { PrismaClient } from '@prisma/client';
import express, {Request, Response} from "express";
import cors from "cors";
import bodyParser from 'body-parser';

const prisma = new PrismaClient();
const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

app.get('/notes', async (req: Request, res: Response) => {
    const notes = await prisma.notes.findMany();
    res.json(notes);
});

app.post('/note/create', async (req: Request, res: Response): Promise<void> => {
    const body = req.body.body;
    // const priority = +req.body.priority;
    // become to convert number from string default value
    // or convert into an integer method
    const priority = parseInt(req.body.priority); 

    if (!body || !priority) {
        res.status(400).send({
            error: "Request payload is not valid. Body and priority are required.!",
        });
    }

    const newNote = await prisma.notes.create({
        data: {
            body: body,
            priority: priority,
            completed: false,
        },
    });

    res.send(newNote);
});

app.patch('/note/edit/:id', async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const completed = req.body.completed;

    if (completed === undefined) {
        res.status(400)
            .send({ 
                error: "Request payload is not valid. Completed is required.!",
            })
    }

    const result = await prisma.notes.update({
        where: {
            id: +id,
        },
        data: {
            completed,
        },
    });

    res.send(result);
});


app.get('/category', async (req: Request, res: Response) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
});

app.get('/categories', async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            include: { units: { include: { unit: true } } }, // Include related units
        });
        res.json(categories);
    } catch (error) {
        res.status(500).send({ error: "Error fetching categories", details: error });
    }
})

app.get("/units", async (req: Request, res: Response) => {
    try {
      const units = await prisma.unit.findMany();
      res.json(units);
    } catch (error) {
      res.status(500).send({ error: "Error fetching units", details: error });
    }
});

app.post("/unit/create", async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
        res.status(400).send({ error: "Unit name is required!" });
        return;
    };

    try {
      const units = await prisma.unit.create({
        data: { name }
      });
      res.json(units);
    } catch (error) {
      res.status(500).send({ error: "Error fetching units", details: error });
    }
});
  
app.post('/category/create', async (req: Request, res: Response): Promise<void> => {
    const { name, units } = req.body;

    if (!name || !Array.isArray(units) || units.length === 0) {
        res.status(400).send({ error: "Category name and least one unit are is required! " })
        return;
    }

    try {
        const newCategory = await prisma.category.create({
            data: { 
                name,
                units: {
                    create: units.map((unitId: string) => ({
                        unit: { connect: { id: unitId } },
                    })),
                },
            },
            include: { units: { include: { unit: true } } },
        });
        res.status(201).send(newCategory);
    } catch (error) {
        res.status(500).send({ error: "An error occured while createing the category." })
    }
});

app.patch('/category/edit/:id', async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const { name, units } = req.body;

    if (!name || !Array.isArray(units) || units.length === 0) {
        res.status(400).send({ error: "Category name and least one unit are is required! " })
        return;
    }

    try {
        const result = await prisma.category.update({
            where: { id },
            data: { 
                name, 
                units: {
                    deleteMany: {}, // Remove previous units
                    create: units.map((unitId: string) => ({
                        unit: { connect: { id: unitId } },
                    })),
                },
            },
            include: { units: { include: { unit: true } } },
        });
    
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: "An error occured while edit the category." })
    }
});

app.get('/products', async (req: Request, res: Response) => {
    const products = await prisma.product.findMany();
    res.json(products);
});


app.post("/product/create", async (req: Request, res: Response): Promise<void> => {
    const { name, price, units, categoryId } = req.body;
  
    if (!name || !price || !Array.isArray(units) || units.length === 0 || !categoryId) {
      res.status(400).send({ error: "All fields are required!" });
      return;
    }
  
    try {
      const newProduct = await prisma.product.create({
        data: {
          name,
          price: parseFloat(price),
          categoryId,
          productUnits: {
            create: units.map((unitId: string) => ({
              unit: { connect: { id: unitId } },
            })),
          },
        },
        include: { productUnits: { include: { unit: true } } }, // Fetch related units
      });
  
      res.status(201).send(newProduct);
    } catch (error) {
      res.status(500).send({ error: "Error creating product", details: error });
    }
});
  

// app.post("/product/create", async (req: Request, res: Response): Promise<void> => {
//     const { name, price, unit, categoryId } = req.body;

//     if (!name || !price || !unit || !categoryId) {
//         res.status(400).send({
//             error: "Nama, harga, unit, dan ID kategori diperlukan!",
//         });
//         return;
//     }

//     try {
//         const newProduct = await prisma.product.create({
//             data: {
//                 name,
//                 price: parseFloat(price),
//                 unit,
//                 categoryId,
//             },
//         });

//         res.status(201).send(newProduct);
//     } catch (error) {
//         res.status(500).send({ error: "Terjadi kesalahan saat membuat produk.", details: error });
//     }
// });

app.patch('/product/edit/:id', async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const { name, price, units, categoryId } = req.body;

    if (!name || !price || !Array.isArray(units) || units.length === 0 || !categoryId) {
        res.status(400).send({ error: "product not avaiable!" })
        return;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
        res.status(400).json({ error: "Invalid product ID format!" });
        return;
    }

    try {
        const result = await prisma.product.update({
            where: { id },
            data: { 
                name, 
                price: parseFloat(price),
                productUnits: {
                    deleteMany: {}, // Remove previous units
                    create: units.map((unitId: string) => ({
                        unit: { connect: { id: unitId } },
                    })),
                },
            },
            include: { productUnits: { include: { unit: true } } },
        });
    
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: "An error occured while edit the product." })
    }
});

app.listen(port, () => console.log(`Server run on http://localhost:${port}`));