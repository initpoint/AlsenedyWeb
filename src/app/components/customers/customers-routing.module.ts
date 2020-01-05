import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'show',
        component: CustomersComponent,
        data: {
          title: "Customers",
          breadcrumb: "Customers"
        }
      },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
