import {Component, OnInit, Output} from '@angular/core';
import {CustomerService} from '../../shared/services/firebase/customer.service';
import {PriceListService} from '../../shared/services/firebase/pricelist.service';
import {LogsService} from '../../shared/services/firebase/logs.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import CustomeStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';

@Component({
    selector: 'app-customer',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
    customerSource: DataSource;
    customerData: CustomeStore;
    lang = localStorage.getItem('lang') == 'ar';
    priceLists: any[];
    fieldView: boolean = true;
    currentUser = JSON.parse(localStorage.getItem('user'));
    constructor(private priceListService: PriceListService, private logs: LogsService, private customerService: CustomerService, private router: Router, private toastr: ToastrService) {
        this.priceListService.getPriceLists().subscribe(res => {
            this.priceLists = res;
        });
        this.customerData = new CustomeStore({
            key: 'uid',
            load: (opts) => {
                return new Promise((resolve, reject) => {
                    this.lang = localStorage.getItem('lang') == 'ar';
                    this.customerService.getCustomers().subscribe(res => {
                        resolve({data: res});
                    });
                });
            },
            update: (key, values) => {
                const logData = 'Updated customer [' + this.customerSource.items().find(user => user.uid === key).name + '] data [' + Object.keys(values) + '] to [' + Object.values(values) + ']';
                this.logs.createLog(logData);
                return this.customerService.updateCustomer(key, values);
            },
            remove: (key) => {
                const logData = 'customer [' + this.customerSource.items().find(user => user.uid === key).name + '] deleted';
                this.logs.createLog(logData);
                return this.customerService.deleteCustomer(key);
            },
            insert: (values) => {
                const logData = 'Created new customer [' + values.name + ']';
                this.logs.createLog(logData);
                return this.customerService.createCustomer(values);
            },

        });
        this.customerSource = new DataSource({
            store: this.customerData,
        });
    }


    onEditorPreparing(e) {
        if (e.parentType === 'dataRow' && e.dataField === 'password' && e.row.data.uid) {
            e.editorOptions.disabled = true;
            e.editorOptions.visible = false;
            e.cancel = true;
            this.fieldView = false;
        }

    }


    updateCustomerActivation(data) {
        this.customerService.updateCustomer(data.data.uid, {isActive: data.value}).then(res => {
            const logData = 'Updated customer [' + data.data.name + '] data [isActive] to [' + data.value + ']';
            this.logs.createLog(logData);
        });
    }


    updateCustomerTax(data) {
        this.customerService.updateCustomer(data.data.uid, {hasTax: data.value}).then(res => {
            const logData = 'Updated customer [' + data.data.name + '] data [hasTax] to [' + data.value + ']';
            this.logs.createLog(logData);
        });
    }

    updateCustomerCanSeeSoldStock(data) {
        this.customerService.updateCustomer(data.data.uid, {canSeeSoldStock: data.value}).then(res => {
            const logData = 'Updated customer [' + data.data.name + '] data [canSeeSoldStock] to [' + data.value + ']';
            this.logs.createLog(logData);
        });
    }

    ngOnInit() {
        this.currentUser.permissions.canUpdate = this.currentUser.permissions.update.includes(this.router.url);
        this.currentUser.permissions.canCreate = this.currentUser.permissions.create.includes(this.router.url);
        this.currentUser.permissions.canRemove = this.currentUser.permissions.delete.includes(this.router.url);
        this.currentUser.permissions.canExport = this.currentUser.permissions.export.includes(this.router.url);
        this.currentUser.permissions.canImport = this.currentUser.permissions.import.includes(this.router.url);
        this.currentUser.permissions.canView = this.currentUser.permissions.view.includes(this.router.url);
    }

}
