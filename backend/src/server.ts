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

app.listen(port, () => console.log(`Server run on http://localhost:${port}`));