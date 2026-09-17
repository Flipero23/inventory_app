import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {

  product = signal<Product | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    public productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading.set(true);

    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Производот не е пронајден.');
        this.isLoading.set(false);
      }
    });
  }
}