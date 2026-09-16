import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule,
     ReactiveFormsModule,
      MatFormFieldModule, 
      MatInputModule, 
      MatButtonModule
    ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  form: FormGroup;
  isEditMode = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(1000)]],
      price: [null, [Validators.required, Validators.min(0)]],
      quantityInStock: [null, [Validators.required, Validators.min(0)]],
      category: ['', [Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.productId = Number(idParam);
      this.productService.getById(this.productId).subscribe({
        next: (product) => this.form.patchValue(product),
        error: () => this.errorMessage.set('Неуспешно вчитан производ.'),
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    let request;
    if (this.isEditMode() && this.productId) {
      request = this.productService.update(this.productId, this.form.value);
    } else {
      request = this.productService.create(this.form.value);
    }

    request.subscribe({
      next: () => {
        let message;
        if (this.isEditMode()) {
          message = 'Производот е успешно ажуриран.';
        } else {
          message = 'Производот е успешно креиран.';
        }
        this.snackBar.open(message, 'Затвори', { duration: 3000 });
        this.router.navigate(['/products']);
      },
      error: () => {
        this.isSaving.set(false);
        this.snackBar.open('Зачувувањето не успеа.', 'Затвори', { duration: 5000 });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}
