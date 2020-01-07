import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'show',
        component: ProductsComponent,
        data: {
          title: "Products",
          breadcrumb: "Products"
        }
      },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }