import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})


export class ProductList implements OnInit {

  products = signal<Product[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productService.getAll().subscribe({
      next: (response) => {
        this.products.set(response.content);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Неуспешно прочитани производи.');
        this.isLoading.set(false);
      }
    });
  }
}