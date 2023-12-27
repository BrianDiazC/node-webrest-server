import { Request, Response } from 'express'
import { json } from 'stream/consumers';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodo } from '../../domain/dtos';




export class TodosController {

    //* DI
    constructor() { }

    public getTodos = async (req: Request, res: Response) => {

        const todos = await prisma.todo.findMany();

        res.json(todos)
    }


    public getTodoById = async (req: Request, res: Response) => {

        const id = +req.params.id; // el + me lo convierte a numero
        if (isNaN(id)) return res.status(400).json({ error: 'ID argument is not a number' });

        try {

            const todo = await prisma.todo.findFirst({
                where: {
                    id: id
                }
            });
            (todo)
                ? res.json(todo)
                : res.status(404).json({ error: `TODO with id ${id} not found` })

        } catch (error) {
            console.log(error)
        }
    }

    public createTodo = async (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ error })

        const todo = await prisma.todo.create({
            data: createTodoDto!
        })

        res.json(todo);
    };


    public updateTodo = async (req: Request, res: Response) => {

        const id = +req.params.id; // el + me lo convierte a numero
        const [error, updateTodoDto] = UpdateTodo.create({ id, ...req.body });
        if (error) return res.status(400).json({ error })

        const todo = await prisma.todo.findFirst({
            where: {
                id: id
            }
        });
        if (!todo) return res.status(404).json({ error: `Todo with id ${id} not found` });



        const updatedTodo = await prisma.todo.update({
            where: {
                id: id
            },
            data: updateTodoDto!.values
        });

        console.log(updatedTodo);
        res.json(updatedTodo)

    }

    public deleteTodo = async (req: Request, res: Response) => {

        const id = +req.params.id; // el + me lo convierte a numero
        if (isNaN(id)) return res.status(400).json({ error: 'ID argument is not a number' });

        const todo = await prisma.todo.findFirst({
            where: {
                id: id
            }
        });
        if (!todo) return res.status(404).json({ error: `Todo with id ${id} not found` });

        const deletedTodo = await prisma.todo.delete({
            where: {
                id
            }
        });

        (deletedTodo)
            ? res.json(deletedTodo)
            : res.status(400).json({ error: `Todo with id ${id} not found` })

    }

}