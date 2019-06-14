import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.page.html',
  styleUrls: ['./onboard.page.scss'],
})
export class OnboardPage implements OnInit {

  myProfileDetails: any;
  profileForm: FormGroup;
  others: "Wait";
 
  error_messages = {
    'myName': [
      { type: 'required', message: 'Your name is needed!.' }
    ],
    'myDoctor': [
      { type: 'required', message: 'Your doctor\'s name is needed!.' }
    ],
    'myDoctorsNumber': [
      { type: 'required', message: 'A number is needed!.' }
    ],
    'myBirthday': [
      { type: 'required', message: 'Please tell us your birthday :).' }
    ]
  }

  constructor(private http: HttpClient, private router: Router, public formBuilder: FormBuilder, private database:DatabaseService,public platform:Platform) { 
    
    this.profileForm = this.formBuilder.group({
      myName: new FormControl('',Validators.compose([
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
      ]))
    });
 
  }


  ngOnInit() {
 
  }

  launchForm(){
    console.log('here we go')
    const headerDict = {
      "Content-Type": "application/json",
      "Ehr-Session-disabled": "1917e50d-65d3-4c2c-94e3-0b5d303e0b72",
      "Authorization": "Basic YjI5ZWNhZGUtZWI2NS00NzQ4LThhNjEtMDE1NjQyMWMyNmFkOiQyYSQxMCQ2MTlraQ=="
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    
    this.http.get('https://cdr.code4health.org/rest/v1/template', requestOptions)
    .subscribe(data => {
      console.log(data);
     }, error => {
      console.log(error);
    });
  
    console.log("Come on:", requestOptions)
  
  }

  mydetails() {
    console.log('Name: ', this.profileForm.value.myName);
    console.log('Doctor: ', this.profileForm.value.myDoctor);
    console.log('Doctors #: ', this.profileForm.value.myDoctorsNumber);
    console.log('Birthday: ', this.profileForm.value.myBirthday);
    console.log('Other_meds: ', this.others)
  }

  addToDB() {

    var myProfileDetailsBetter = [this.profileForm.value.myName,
      this.profileForm.value.myBirthday,
      this.profileForm.value.myDoctor,
      this.profileForm.value.myDoctorsNumber,
    ]

    this.database.insertData(myProfileDetailsBetter, "profile");
    console.log('Checker: ', myProfileDetailsBetter);

    var myDoc = {
      "doctor_name": this.profileForm.value.myDoctor,
    }
    this.database.insertData(myDoc, "profileDoc");

    this.router.navigateByUrl('/onboardtreatmentplan');

  } 
}
