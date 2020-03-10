import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogsComponent } from './logs.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: LogsComponent,
        data: {
          title: "Users",
          breadcrumb: "Users"
        }
      },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogsRoutingModule { }