import type { FastifyRequest, FastifyReply } from 'fastify';
import type { GenContentCategory } from '../../generated/prisma/client.js';
import { Text } from '../domain/Text.js';
import { CategoryRepository } from '../repositories/persistent/CategoryRepository.js';
import { UnauthorizedError, ValidationError } from '../errors/errors.js';

export class CategoryController {
    addCategory = async (request: FastifyRequest<{Body: GenContentCategory}>, reply: FastifyReply) => {
        const data = request.body;

        const name = new Text(data.name, 40);
        const prompt = new Text(data.basePrompt, 1024);

        const newCategory = await CategoryRepository.create(name.value, prompt.value);

        return reply.status(201).send({
            message: "New category was successfully added"
        });
    }

    getAll = async (request: FastifyRequest, reply: FastifyReply) => {
        const results = await CategoryRepository.getAll();

        return reply.status(200).send(results);
    }

    getById = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;

        const category = await CategoryRepository.findById(id);
        
        if (!category) throw new ValidationError("Category not found");

        return reply.status(200).send({
            id: category.id,
            name: category.name,
            basePrompt: category.basePrompt,
        });
    }

    editCategory = async (request: FastifyRequest<{Params: {id: string}, Body: GenContentCategory}>, reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body;

        if (Object.keys(data).length === 0) {
            return reply.status(400).send({ message: "No data provided for update" });
        }

        const updateData: any = {};

        if (data.name) updateData.name = new Text(data.name, 40).value;
        if (data.basePrompt) updateData.basePrompt = new Text(data.basePrompt, 40).value;

        const updatedCategory = await CategoryRepository.update(updateData, id);

        if (!updatedCategory) {
            throw new ValidationError("Category not found");
        }

        return reply.status(200).send({
            name: updateData.name,
            basePrompt: updateData.basePrompt
        });
    }

    deleteCategory = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;
        
        const category = await CategoryRepository.delete(id);

        if (!category) {
            throw new ValidationError("Category not found");
        }

        return reply.status(200).send({
            message: "Category deleted successfully"
        });
    }
}
export const categoryController = new CategoryController()