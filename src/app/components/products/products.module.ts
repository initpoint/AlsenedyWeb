import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProductsRoutingModule} from './products-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductsService} from '../../shared/services/firebase/products.service';
import {ProductsComponent} from './products/products.component';
import {EditProductResolver} from '../../shared/services/firebase/edit-product.resolver';

import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {Ng5SliderModule} from 'ng5-slider';
import {ToastrModule} from 'ngx-toastr';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import { DxTreeListModule, DxFileUploaderModule,DxPopupModule ,DxTemplateModule, DxDataGridModule,DxTextBoxModule} from 'devextreme-angular';
import {TranslateModule} from '@ngx-translate/core';
@NgModule({
    declarations: [ProductsComponent],

    imports: [
        DxTextBoxModule,
        DxDataGridModule,
        DxPopupModule,
        DxTemplateModule,
        DxFileUploaderModule,
        CommonModule,
        DxTreeListModule,
        ProductsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpModule,
        Ng5SliderModule,
        Ng2SearchPipeModule,
        TranslateModule,
        ToastrModule.forRoot(),

    ],

    providers: [ProductsService, EditProductResolver]
})
export class ProductsModule {
}
