export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  quantityInStock: number;
  category?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Page<T> {
    content: T[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}