import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilService } from 'src/app/services/util.service';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { tap, finalize } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DataAccessService } from 'src/app/services/data-access.service';
import { PhotoService } from '../../services/photo.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  uploadProgress = 0;
  user; 
  photo: SafeResourceUrl = "../../assets/image/user.png";
  profilePhoto: string;
  downloadUrl: string;
  uploading: boolean = false;
  items : Array<any>;

   // Upload Task 
   task: AngularFireUploadTask;
  
   // Progress in percentage
   percentage: Observable<number>;
 
   // Snapshot of uploading file
   snapshot: Observable<any>;
 
   // Uploaded File URL
   UploadedFileURL: Observable<string>;
 
 
   //File details  
   fileName:string;
   fileSize:number;
 
   //Status check 
   isUploading:boolean;
   isUploaded:boolean;
  constructor(
    private authSvc : AuthenticationService,
    private afs : AngularFirestore, 
    private router:Router,
    private dataSvc : DataAccessService,
    private util:UtilService,
    public camera: Camera,
    private sanitizer: DomSanitizer,
    public alertCtrl: AlertController,
    public actionCtrl:ActionSheetController,
    private storage: AngularFireStorage, 
    public photoService : PhotoService) {

      this.isUploading = false;
    this.isUploaded = false;

      this.authSvc.getUser().subscribe(user => {
        this.user = user; 
        this.getListing(this.user.uid).subscribe(result=>{
          this.items = result;
          console.log(result);
          
         
        })
      });  
     
   }

  ngOnInit() {  
    
  }
  getListing(uid){
    return this.afs.collection<any>(`users`,ref=>ref.where('uid','==',uid)).valueChanges();
  }
  
  Edit(){
    
      this.router.navigate(['editprofile']);   
  }
  SignOut(){
    this.authSvc.SignOut();
  } 

  async openActionsheet() {
    const action = await this.actionCtrl.create({
      buttons: [{
        text: 'Take a picture',
        role: 'destructive',
        cssClass: 'buttonCss',
        handler: () => {
          //this.photoService.addNewToGallery();
          this.takeProfilePic(this.camera.PictureSourceType.CAMERA);
          console.log('Take a picture clicked');
        }
      }, {
        text: 'Choose a picture',
        handler: () => {
          this.takeProfilePic(this.camera.PictureSourceType.PHOTOLIBRARY);
          console.log('Share clicked');
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'buttonCss_Cancel',

        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await action.present();
  }

  

  async takeProfilePic(sourceType) {
    
    const options: CameraOptions = {
      quality: 25,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      correctOrientation: true
    }


    this.camera.getPicture(options).then((imageData) => {
      
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = imageData;
      this.profilePhoto = base64Image;
      this.uploadFile(base64Image);
      console.log(this.photo);
    }, (err) => {
      // Handle error
      console.log(err)
    });


  }
 

  uploadFile(base64Image) {
    const file = this.getBlob(base64Image,"image/jpeg" );
    console.log('FILE', file)

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = 'ListItem';
   
    // The storage path
    const path = `images/${new Date().getTime()}_${this.fileName}.jpg`;

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file);
    console.log('After Upload')
    // Get file progress percentage
    this.percentage = this.task.percentageChanges();

   this.task.snapshotChanges().pipe(
      
      finalize(() => {
        console.log('upload')
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();
        
        this.UploadedFileURL.subscribe(resp=>{
          console.log(resp);
          this.downloadUrl = resp; 
          this.isUploading = false;
          this.isUploaded = true;
          // if (this.commonSvc.setProfilePicture(this.user['companyType'],this.user['companyId'], resp)){
            this.uploading = false;
            this.util.toast('Picture has been successfully uploaded.', 'success', 'bottom');
            this.onClickUpdate();
          // }
              
      
        },error=>{
          console.error(error);
        })
      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
          console.log(snap)
      })
    ).subscribe();
  }

  private getBlob(b64Data:string, contentType:string, sliceSize:number= 512) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }
    return   new Blob(byteArrays, {type: contentType});
  }


  onClickUpdate(){
    console.log(this.downloadUrl)
    console.log(this.user.uid)
    let time = new Date();
   
      if(this.downloadUrl){
        let listing ={
          photoUrl: this.downloadUrl,
          //date: time 
        }
        console.log(this.user.uid, listing);
        this.updateProf(this.user.uid, listing).then(()=>{
         this.util.toast('Profile Is Successfully Updated', 'success', 'bottom');
         this.router.navigate['profile'];
       })
       .catch(err => {
        console.log(err);
        this.util.errorToast('Error in adding listing. Please try again!');
      })
      }
   
  }  
  updateProf(uid,list){
  
return this.afs.doc<any>(`users/${uid}`).update(list);
    }

}
