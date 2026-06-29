import type { FastifyRequest, FastifyReply } from 'fastify';
import { addCategorySchema, editCategorySchema, type AddCategoryDTO, type EditCategoryDTO } from '../domain/schemas/category.schema.js';
import { CategoryService } from '../services/CategoryService.js';

export class CategoryController {
    addCategory = async (request: FastifyRequest<{Body: AddCategoryDTO}>, reply: FastifyReply) => {
        const data = addCategorySchema.parse(request.body);
        const {newCategory} = await CategoryService.add(data); 

        return reply.status(201).send({
            message: "New category was successfully added",
            id: newCategory.id,
            name: newCategory.name,
            basePrompt: newCategory.basePrompt
        });
    }

    getAll = async (request: FastifyRequest, reply: FastifyReply) => {
        const {results} = await CategoryService.getAll();
        return reply.status(200).send(results);
    }

    getById = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;
        const {category} = await CategoryService.get(id);

        return reply.status(200).send({
            id: category.id,
            name: category.name,
            basePrompt: category.basePrompt,
        });
    }

    editCategory = async (request: FastifyRequest<{Params: {id: string}, Body: EditCategoryDTO}>, reply: FastifyReply) => {
        const { id } = request.params;
        const data = editCategorySchema.parse(request.body);
        const {updatedCategory} = await CategoryService.update(data, id);

        return reply.status(200).send({
            name: updatedCategory.name,
            basePrompt: updatedCategory.basePrompt
        });
    }

    deleteCategory = async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
        const id = request.params.id;
        await CategoryService.delete(id);

        return reply.status(200).send({
            message: "Category deleted successfully"
        });
    }
}
export const categoryController = new CategoryController()