import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ToastrService} from 'ngx-toastr';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BillsService {
    constructor(public db: AngularFirestore, private toastr: ToastrService) {

    }

    getCustomerBills(uid) {
        return this.db.collection('bills', ref => ref.where('customerId', '==', uid)).snapshotChanges().pipe(
            map(x => x.map(y => {
                return {
                    id: y.payload.doc.id,
                    ...y.payload.doc.data()
                };
            }))
        );
    }

    addBill(data) {
        return this.db.collection('bills').add(data).then(() => {
            this.toastr.success('Bill Added');
        });
    }
}
