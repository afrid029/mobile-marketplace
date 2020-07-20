import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take, mergeAll, zipAll } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  constructor(private afs:AngularFirestore) { }
  add(listing){
    console.log("OKKKKKK");
      return this.afs.collection<any>(`users/all/listings`).add(listing);
   }  
  in;
  addListing(userId, listing) {
    this.add(listing);
     return this.afs.collection<any>(`users/${userId}/listings`).add(listing);
     
  }
value;
  getListings(userId){
    if(userId === "home"){
      console.log(userId);
      this.value =  this.afs.collection<any>(`users/all/listings`,ref=>ref.orderBy('date','desc')).valueChanges();
    }else{ 
      
      this.value =  this.afs.collection<any>(`users/${userId}/listings`).valueChanges();
    }
    return this.value;
    
   
  }
  getProfile(uid){
    
    return this.afs.collection(`users/${uid}/profile`).valueChanges();
  }
 
   
}
