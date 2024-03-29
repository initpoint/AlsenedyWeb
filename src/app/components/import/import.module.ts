import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImportRoutingModule} from './import-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ImportComponent} from './import.component';

import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {TranslateModule} from '@ngx-translate/core';
import {DxFileUploaderModule,DxDataGridModule,DxLookupModule,DxPopupModule} from 'devextreme-angular';
@NgModule({
    declarations: [ImportComponent],

    imports: [
        DxPopupModule,
        DxLookupModule,
        DxDataGridModule,
        DxFileUploaderModule,
        CommonModule,
        ImportRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpModule,
        TranslateModule,

    ],
})
export class ImportModule {
}
