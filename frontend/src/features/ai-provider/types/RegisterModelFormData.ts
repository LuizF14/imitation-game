export type ModelType =
    | "Chat"
    | "Image";

export interface RegisterModelFormData {
    name: string;
    pathURL: string;
    type: ModelType;
}