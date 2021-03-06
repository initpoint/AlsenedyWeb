import {Injectable, OnInit, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {auth} from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import {ToastrService} from 'ngx-toastr';
import {CookieService} from 'ngx-cookie-service';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})

export class AuthService implements OnInit {
    public currentUser = null;
    public showLoader = false;

    constructor(public afs: AngularFirestore,
                public afAuth: AngularFireAuth, public router: Router,
                public toastrService: ToastrService, public jwtHelper: JwtHelperService) {

        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.getUserData(user.uid);
                this.showLoader = false;
            } else {
                this.currentUser = null;
                localStorage.clear();
                this.showLoader = false;
            }
        });
    }

    ngOnInit(): void {
    }

    getUserData(uid) {
        this.afs.doc(`users/${uid}`).get().subscribe(userDoc => {
            localStorage.setItem('user', JSON.stringify(userDoc.data()));
            this.currentUser = userDoc.data();
        });
    }

    SignIn(email, password) {
        this.showLoader = true;
        return this.afAuth.auth.signInWithEmailAndPassword(email, password).then(async (res) => {
            const token = await res.user.getIdToken();
            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify(this.jwtHelper.decodeToken(token)));
            this.getUserData(res.user.uid);
            this.router.navigate(['/customers']);
            this.toastrService.success('Authentication successful.');
        }).catch((error) => {
            this.showLoader = false;
            this.toastrService.error('Wrong Email or Password.');
        });
    }

    SignOut() {
        this.showLoader = true;
        this.router.navigate(['/auth/login']);
        return this.afAuth.auth.signOut();
    }

    ForgotPassword(passwordResetEmail) {
        this.showLoader = true;
        return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail).then(() => {
            this.toastrService.success('Password reset email sent, check your inbox.');
            this.showLoader = false;
        }).catch((error) => {
            this.showLoader = false;
            this.toastrService.error(error);
        });
    }
}
