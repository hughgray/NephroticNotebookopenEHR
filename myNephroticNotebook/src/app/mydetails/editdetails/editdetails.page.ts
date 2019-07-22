import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx'
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-editdetails',
  templateUrl: './editdetails.page.html',
  styleUrls: ['./editdetails.page.scss'],
})
export class EditdetailsPage implements OnInit {

  myProfileDetails: any;
  profileForm: FormGroup;
  templateID: any;
  consent: boolean = false;
  type: string;

  error_messages = {
    'myName': [
      { type: 'required', message: 'Your name is needed!.' }
    ],
    'myNHSno': [
      { type: 'required', message: 'Your NHS number is needed!.' },
      { type: 'pattern', message: 'Your NHS number must be 10 digits long!' }
    ],
    'myDoctor': [
      { type: 'required', message: 'Your doctor\'s name is needed!.' }
    ],
    'myDoctorsNumber': [
      { type: 'required', message: 'A number is needed!.' }
    ],
    'myDocID': [
      { type: 'required', message: 'Your clinician\'s ID is needed!' }
    ],
    'myBirthday': [
      { type: 'required', message: 'Please tell us your birthday :).' }
    ],
    'cdrProvider': [
      { type: 'required', message: 'Please choose a CDR provider or select None.' }
    ],
    'docID': [
      { type: 'required', message: 'This ID must be 7 digits long!' },
      { type: 'pattern', message: 'This ID must be 7 digits long!' }
    ]
  }

  constructor(private storage: Storage, public network: Network, public alertController: AlertController, private api: ApiService, private router: Router, public formBuilder: FormBuilder, private database:DatabaseService) { 

    this.profileForm = this.formBuilder.group({
      myName: new FormControl('',Validators.compose([
        Validators.required
      ])),
      myNHSno: new FormControl('',Validators.compose([
        Validators.pattern('[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.required
      ])),
      myDoctor: new FormControl('',Validators.compose([
        Validators.required
      ])),
      myDoctorsNumber: new FormControl('',Validators.compose([
        Validators.required
      ])),
      myBirthday: new FormControl('',Validators.compose([
        Validators.required
      ])),
      docID: new FormControl('',Validators.compose([
        Validators.pattern('[0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
        Validators.minLength(7),
        Validators.maxLength(7),
        Validators.required
      ])),
      docType: new FormControl('',Validators.compose([
        Validators.required
      ])),
      cdrProvider: new FormControl('',Validators.compose([
        Validators.required
      ])),
      myOtherMeds: new FormControl('')
    });
  }

  ngOnInit() {

    this.storage.set("Connection", 1);
    console.log("consent flag",this.consent);
    this.storage.set("EHR", 0);
    console.log("EHR flag: 0");
    this.presentAlertConfirm()

  }

  async noNetworkConnection() {
    const alert = await this.alertController.create({
      header: 'CONNECTION ERROR',
      message: 'You must be able to connect to the CDR in order to continue with onboarding. Please check your internet connection and CDR provider.',
    });
    await alert.present();
  }

  async noCdrChosen() {
    const alert = await this.alertController.create({
      header: 'Must choose a CDR',
      message: 'In order to store your data in your EHR you must select your CDR provider.',
    });
    await alert.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      message: 'Do you consent to the storage and usage of your data in your personal EHR to be used for medical and/or research purposes?',
      buttons: [
        {
          text: 'No',
          role: 'no',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Consent to EHR? No');
            this.presentAlertConfirmNo()
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Consent to EHR? Yes');
            this.consent = true
            console.log("consent flag",this.consent);
            this.storage.set("EHR", 1);
            console.log("EHR flag set to 1");
          }
        }
      ],
      backdropDismiss: false
    });

    await alert.present();
  }

  async presentAlertConfirmNo() {
    const alert = await this.alertController.create({
      message: 'Are you sure? Please note that if you do not consent you will not be able to alter this decision in future.',
      buttons: [
        {
          text: 'No',
          role: 'no',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm no consent? No');
            this.presentAlertConfirm()
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm no consent? Yes');
            this.consent = false
            console.log("consent flag",this.consent)
          }
        }
      ],
      backdropDismiss: false
    });

    await alert.present();
  }

  checkConnection(){

    console.log("Checking Connection flag....");
    if (this.consent == true && this.profileForm.value.cdrProvider == 'None'){
      this.noCdrChosen()
    }
    else if (this.consent == true){
      this.storage.set("CDR", this.profileForm.value.cdrProvider)
      .then(() => { 
        this.api.setCDRVariables()
        .then( () => {
          this.api.getTemplates()
          .then( () => {
            return this.continueCheck();
          })
        })
      })
    }
    else{
        this.addToDB()
    }
  }

  continueCheck(){

    this.storage.get("Connection")
      .then((val) => {
        console.log("val pulled from storage: ",val);
        if (val == 0){
          this.noNetworkConnection()
        }
        else{
          console.log("did that work?");
          this.ehrPlay()
        }
    });
  }



  mydetails() {
    console.log('Name: ', this.profileForm.value.myName);
    console.log('NHS no: ', this.profileForm.value.myNHSno);
    console.log('Doctor: ', this.profileForm.value.myDoctor);
    console.log('Doctors #: ', this.profileForm.value.myDoctorsNumber);
    console.log('ID: ', this.profileForm.value.docID);
    console.log('Type: ', this.profileForm.value.docType);
    console.log('CDR: ', this.profileForm.value.cdrProvider);
    console.log('Birthday: ', this.profileForm.value.myBirthday);
    console.log('Other_meds: ', this.profileForm.value.myOtherMeds)
  }


  addToDB() {

    var myProfileDetailsBetter = [
      this.profileForm.value.myName,
      this.profileForm.value.myNHSno,
      this.profileForm.value.myBirthday,
      this.profileForm.value.myDoctor,
      this.profileForm.value.myDoctorsNumber,
      this.profileForm.value.myOtherMeds,
      this.profileForm.value.docID,
      this.profileForm.value.docType,
      this.profileForm.value.cdrProvider
    ]

    console.log('Checker: ', myProfileDetailsBetter);
    this.database.insertData(myProfileDetailsBetter, "profileUpdate")
    .then(()=>{
      if (this.consent == true){
        this.api.addToDB()
        this.lastPlay()
      }
      else{
        this.lastPlay()
      }
    })

  } 

  ehrPlay(){

    this.api.getEHRstatus(this.profileForm.value.myNHSno)
    .then((data)=>{ 
      if (data == 'error'){
        this.noNetworkConnection
      }
      else {
        this.addToDB()
      }
    })
  } 

  goBack(){
    this.router.navigateByUrl('tabs/tab3');
  }

  lastPlay(){

    this.storage.get("CDR")
    .then((val) => {
      if (val != "Gosh"){
        this.api.deleteSession()
        .then(()=>{
          this.router.navigateByUrl('/tabs/tab3');
        })
      } else {
        this.router.navigateByUrl('/tabs/tab3');
      }
    })
  }

}
