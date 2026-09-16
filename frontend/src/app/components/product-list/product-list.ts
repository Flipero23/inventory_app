import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products = signal<Product[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  displayedColumns: string[] = ['name', 'category', 'price', 'quantityInStock', 'actions'];

  searchControl = new FormControl('');

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.loadProducts());
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const search = this.searchControl.value ?? undefined;

    this.productService.getAll(search).subscribe({
      next: (response) => {
        this.products.set(response.content);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Неуспешно вчитани производи.');
        this.isLoading.set(false);
      },
    });
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        message: `Дали сте сигурни дека сакате да го избришете производот "${product.name}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.productService.delete(product.id!).subscribe({
        next: () => {
          this.snackBar.open('Производот е успешно избришан.', 'Затвори', { duration: 3000 });
          this.loadProducts();
        },
        error: () => {
          this.snackBar.open('Бришењето не успеа.', 'Затвори', { duration: 5000 });
        },
      });
    });
  }
}
