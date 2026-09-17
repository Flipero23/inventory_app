import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Page } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) {}

  getAll(
    search?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    page = 0,
    size = 10,
  ): Observable<Page<Product>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (search) params = params.set('search', search);
    if (category) params = params.set('category', category);
    if (minPrice != null) params = params.set('minPrice', minPrice);
    if (maxPrice != null) params = params.set('maxPrice', maxPrice);

    return this.http.get<Page<Product>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`);
  }

  uploadImage(id: number, file: File): Observable<Product> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Product>(`${this.baseUrl}/${id}/image`, formData);
  }

  getImageUrl(filename?: string): string | null {
    return filename ? `http://localhost:8080/uploads/${filename}` : null;
  }

  deleteImage(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.baseUrl}/${id}/image`);
  }
}
