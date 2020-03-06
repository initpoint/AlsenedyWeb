import {Component, OnInit, ViewChild} from '@angular/core';
import {ItemsService} from 'src/app/shared/services/firebase/items.service';
import {DxDataGridComponent} from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import * as XLSX from 'xlsx';
import {ImportService} from 'src/app/shared/services/firebase/import.service';

@Component({
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit {
    @ViewChild('items', {static: true}) dataGrid: DxDataGridComponent;
    source: any;
    lang;
    materialSelectedRows = {};
    rankingSelectedRows = {};
    currentRow: any;
    popupVisible: boolean;
    imageUploaderpopup: boolean;
    value: any[] = [];
    columnObjects: any[] = [];
    columnToShow: any[] = [];
    rowCounter: number = 0;
    dataFromFile: any[] = [];

    constructor(public itemsService: ItemsService, public importService: ImportService) {
        this.itemsService.lastItem = null;
        this.source = new CustomStore({
            key: 'code',
            totalCount: () => new Promise(resolve => {
                this.itemsService.getItemsTotalCount().subscribe(metaDoc => {
                    resolve(metaDoc.data()['count']);
                });
            }),
            load: (opts) => {
                if (opts.filter) {
                    return new Promise((resolve) => {
                        this.itemsService.searchByCode(opts.filter[2].filterValue).subscribe(item => {
                            resolve(item);
                        });
                    });
                } else {
                    return new Promise((resolve) => {
                        this.itemsService.getItemsForPagination().subscribe(items => {
                            resolve(items);
                        });
                    });
                }
            },
            insert: (data) => {
                return this.itemsService.addItem(data);
            },
            update: (key, values) => {
                console.log(key, values);
                return this.itemsService.updateItem(key, values);
            }
        });
    }

    ngOnInit() {
        this.lang = localStorage.getItem('lang') === 'ar';
        setTimeout(() => {
            if (this.dataGrid && localStorage.getItem('barCodeId')) {
                this.dataGrid.instance.searchByText(localStorage.getItem('barCodeId'));
                localStorage.removeItem('barCodeId');
            }
        }, 200);
    }

    deleteImage(pic) {
        let path = pic.split('/').reverse()[0].split('?')[0].replace('%2F', '/');
        if (confirm('Are your sure you want to delete this Image') == true) {
            this.itemsService.removeImage(this.currentRow, path, pic).then(res => {
                document.getElementById(path.split('/')[1]).remove();
            });
        }
    }

    uploadImages() {
        let i = 0;
        if (!document.getElementsByClassName('list-group')[0]) {
            document.getElementsByClassName('widget-container')[0].closest('.dx-template-wrapper').insertAdjacentHTML('afterbegin', '<ul class="list-group"></ul>');
            document.getElementsByClassName('list-group')[0].insertAdjacentHTML('afterbegin', '<li class="list-group-item avatars list-group-item-action"></li>');
        }
        this.value.forEach(file => {
            file.newName = Math.floor(Math.random() * 10000000) + '-' + i + '.' + file.name.split('.').reverse()[0];
            this.itemsService.uploadImage(file, this.currentRow).then(downloadURL => {
                this.currentRow.pics.push(downloadURL);
            });
            i++;
        });
        this.value = [];
    }

    materialRowSelected(event, key, items, collapsedItems, component) {
        this.materialSelectedRows[key[1]] = event.value;
        component.expandRow(key);
        if (items) {
            items.forEach(item => {
                if (event.value) {
                    component.selectRows(item.code, true);
                } else {
                    component.deselectRows(item.code);
                }
            });
        }
        if (collapsedItems) {
            collapsedItems.forEach(item => {
                if (event.value) {
                    component.selectRows(item.code, true);
                } else {
                    component.deselectRows(item.code);
                }
            });
        }
    }

    rankingRowSelected(event, ranking) {
        this.rankingSelectedRows[ranking.key[0]] = event.value;
        ranking.component.expandRow(ranking.key);
        if (ranking.data.items) {
            ranking.data.items.forEach(item => {
                this.materialRowSelected(event, [ranking.key[0], item.key], item.items, item.collapsedItems, ranking.component);
            });
        }
        if (ranking.data.collapsedItems) {
            ranking.data.collapsedItems.forEach(item => {
                this.materialRowSelected(event, [ranking.key[0], item.key], item.items, item.collapsedItems, ranking.component);
            });
        }
    }

    getMaterialSelectValue(material) {
        return this.materialSelectedRows[material.key[1]];
    }

    getRankingSelectValue(ranking) {
        return this.rankingSelectedRows[ranking.key[0]];
    }

    pics(data) {
        this.currentRow = data.data;
        this.currentRow.pics = this.currentRow.pics || [];
        this.imageUploaderpopup = true;
        if (document.getElementsByClassName('newPhotos').length != 0) {
            for (let i = 0; i < document.getElementsByClassName('newPhotos').length; i++) {
                document.getElementsByClassName('newPhotos')[i].remove();
            }
            document.getElementsByClassName('dx-fileuploader-files-container')[0].remove();
        }
    }

    importCombination(evt: any) {
        this.popupVisible = true;
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) {
            throw new Error('Cannot use multiple files');
        }
        // this.show = true;
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];
            /* save data */
            const data = XLSX.utils.sheet_to_json(ws, {header: 'A', defval: ''});
            this.dataFromFile = data.slice(1);
            this.columnToShow = [];
            this.columnObjects = [];
            let i = 0;
            Object.values(data[0]).forEach(column => {
                let key = Object.keys(data[0])[i];
                if (column != '') {
                    this.columnObjects.push({
                        columnName: column + ' (' + key + ')',
                        value: column,
                        valueField: key,
                    });
                }
                i++;
            });
            this.importService.combinationsStructure.forEach(column => {
                let field = this.columnObjects.find(row => row.value === column.text);

                if (field) {
                    this.columnToShow.push({
                        text: column.text,
                        columnName: column.text + ' (' + field.valueField + ')',
                        isFound: true,
                        value: field.value,
                        valueField: field.valueField,
                        field: column.field
                    });
                } else {
                    this.columnToShow.push({
                        text: column.text,
                        isFound: false,
                        value: null,
                        valueField: null,
                        field: column.field
                    });
                }

            });
            this.rowCounter = data.length - 1;
        };
        reader.readAsBinaryString(target.files[0]);
    }

    saveData() {
        const formatedData = [];
        this.dataFromFile.forEach(item => {
            Object.keys(item).forEach(key => {
                const oldColumn = this.columnToShow.find(column => column.valueField == key);
                if (oldColumn) {
                    // replace old keys (A,B,C,....) with the fields names
                    item[oldColumn.field] = item[key];
                }
                // Delete old key
                delete item[key];
            });
            formatedData.push(item);
        });
        this.importService.importCombinations(formatedData);
        this.cancelData();

    }


    rowFound(row, value) {
        (<any>this).defaultSetCellValue(row, value);

    }

    btnClicked() {
        this.popupVisible = true;
    }

    downloadTemplate(data) {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet([data.map(item => item.text)], {skipHeader: true});
        XLSX.utils.book_append_sheet(wb, ws, 'combination');
        XLSX.writeFile(wb, 'Combinations.xlsx');
    }

    cancelData() {
        this.columnToShow = [];
        this.columnObjects = [];
        this.rowCounter = 0;
        this.popupVisible = false;
    }
}
