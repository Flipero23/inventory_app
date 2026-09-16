import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { ProductForm } from './components/product-form/product-form';
import { ProductDetail } from './components/product-detail/product-detail';

export const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', component: ProductList },
    { path: 'products/new', component: ProductForm },
    { path: 'products/:id/edit', component: ProductForm },
    { path: 'products/:id', component: ProductDetail }
];
