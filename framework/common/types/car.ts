import { Category } from "./category";

export interface Car {
    brand: Category | null;
    model: Category | null;
    year: Category | null;
    engine: Category | null;
}