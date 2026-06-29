import type { AddCategoryDTO, EditCategoryDTO } from "../domain/schemas/category.schema.js";
import { ValidationError } from "../errors/errors.js";
import { CategoryRepository } from "../repositories/persistent/CategoryRepository.js";

export class CategoryService {
    static async add(data: AddCategoryDTO) {
        const newCategory = await CategoryRepository.create(data.name, data.basePrompt);
        return {newCategory};
    }
    
    static async getAll() {
        const results = await CategoryRepository.getAll();
        return {results};
    }

    static async get(id: string) {
        const category = await CategoryRepository.findById(id);
        if (!category) throw new ValidationError("Category not found");
        return {category};
    }

    static async update(data: EditCategoryDTO, id: string) {
        const updateData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));
        const updatedCategory = await CategoryRepository.update(updateData, id);
        if (!updatedCategory) throw new ValidationError("Category not found");
        return {updatedCategory};
    }

    static async delete(id: string) {
        const category = await CategoryRepository.delete(id);
        if (!category) throw new ValidationError("Category not found");
    }
}