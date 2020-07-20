import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataAccessService } from 'src/app/services/data-access.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user;
  items : Array<any>;
  constructor(private router:Router, 
    private dataSvc:DataAccessService, 
    private authSvc:AuthenticationService,
    private afs: AngularFirestore,
    ) { 
      this.authSvc.getUser().subscribe(user => {
        let date = new Date();
        console.log("Date",date)
        this.user = user; 
        this.dataSvc.getListings("home").subscribe(result=>{
          console.log(result);
          this.items = result;
        })
      
       });
     
    }
    search;
    onInput(event){
      console.log(event.srcElement.value);
      this.search = event.srcElement.value;
      if(!this.search){
        this.dataSvc.getListings("home").subscribe(result=>{
          console.log(result);
          this.items = result;
        })
      }else {
        this.getListings(this.search).subscribe(result=>{
          console.log(result);
          this.items = result;
        })
      }
      
    }
    onCancel(event){
      this.dataSvc.getListings("home").subscribe(result=>{
        console.log(result);
        this.items = result;
      })
    }
    getListings(key){
      return this.afs.collection<any>(`users/all/listings`,ref=> ref.orderBy("title").startAt(key)).valueChanges();
    }
  ngOnInit() {
  }

}