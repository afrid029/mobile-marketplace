import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData;

  constructor(private ngFireAuth: AngularFireAuth, 
    private router:Router,
    public afStore: AngularFirestore,) {
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })

  }

  setUserLocal(user) {
    localStorage.removeItem('user');
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserFromLocal() {
    return JSON.parse(localStorage.getItem('user'));
  }

  // Login in with email/password
  SignIn(email, password) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password)
  }

  // Register user with email/password
  RegisterUser(email, password) {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password)
  }
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }


  getUser(){
    return this.ngFireAuth.user;
  }

  setEmailVerified(value, uid, user) {
    this.setUserLocal(user);
    this.afStore.doc(`users/${uid}`).set({
      username: user.email,
      uid:user.uid,
      emailVerified: value
    }, { merge:true });
  }

  getUsers(){
    return new Promise<any>((resolve, reject) => {
      this.afStore.collection('./users').snapshotChanges()
      .subscribe(snapshots => {
        resolve(snapshots)
      })
    })
  }



}
