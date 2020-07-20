import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataAccessService } from 'src/app/services/data-access.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.page.html',
  styleUrls: ['./my-listings.page.scss'],
})
export class MyListingsPage implements OnInit {
  user;
  data;
  items : Array<any>;
  constructor(private router:Router, 
    private dataSvc:DataAccessService, 
    private authSvc:AuthenticationService,
    private fireStore: AngularFirestore,
    ) { 
      this.authSvc.getUser().subscribe(user => {
        this.user = user; 
        this.dataSvc.getListings(this.user.uid).subscribe(result=>{
          console.log(this.user.uid);
          console.log(result);
          this.items = result;
        })
      
       });
     
    }

  ngOnInit() {
  }

  addNewListing(){
    this.router.navigate(['add-listing']);
  }

}
