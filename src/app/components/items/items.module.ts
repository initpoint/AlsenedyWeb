import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemsRoutingModule} from './items-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ItemsService} from '../../shared/services/firebase/items.service';
import {ItemsComponent} from './items.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {ToastrModule} from 'ngx-toastr';
import {
    DxTreeListModule,
    DxFileUploaderModule,
    DxPopupModule,
    DxButtonModule,
    DxRadioGroupModule,
    DxTemplateModule,
    DxDataGridModule,
    DxTextBoxModule,
    DxCheckBoxModule
} from 'devextreme-angular';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    declarations: [ItemsComponent],

    imports: [
        DxTextBoxModule,
        DxDataGridModule,
        DxButtonModule,
        DxPopupModule,
        DxTemplateModule, DxRadioGroupModule,
        DxFileUploaderModule,
        DxCheckBoxModule,
        DxTreeListModule,
        CommonModule,
        ItemsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        HttpClientModule,
        HttpModule,
        TranslateModule,
        ToastrModule.forRoot(), SharedModule,

    ],

    providers: [ItemsService]
})
export class ItemsModule {
}
