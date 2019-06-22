import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-editdetails',
  templateUrl: './editdetails.page.html',
  styleUrls: ['./editdetails.page.scss'],
})
export class EditdetailsPage implements OnInit {

  myProfileDetails: any;
  profileForm: FormGroup;

  error_messages = {
    'myName': [
      { type: 'required', message: 'Your name is needed!.' }
    ],
    'myNHSno': [
      { type: 'required', message: 'Your NHS number is needed!.' },
      { type: 'pattern', message: 'Your NHS number must be numbers only.' },
      { type: 'minlength', message: 'Your NHS number must be 10 digits.' }
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

  constructor(private api: ApiService, private router: Router, public formBuilder: FormBuilder, private database:DatabaseService) { 

    this.profileForm = this.formBuilder.group({
      myName: new FormControl('',Validators.compose([
        Validators.required
      ])),
      myNHSno: new FormControl('',Validators.compose([
        Validators.pattern('^[a-z]'),
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
      myOtherMeds: new FormControl('')
    });
  }

  ngOnInit() {
  }

  mydetails() {
    console.log('Name: ', this.profileForm.value.myName);
    console.log('NHS no: ', this.profileForm.value.myNHSno);
    console.log('Doctor: ', this.profileForm.value.myDoctor);
    console.log('Doctors #: ', this.profileForm.value.myDoctorsNumber);
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
      this.profileForm.value.myOtherMeds
    ]

    this.database.insertData(myProfileDetailsBetter, "profileUpdate");
    console.log('Checker: ', myProfileDetailsBetter);
    this.api.getEHRstatusUpdate(this.profileForm.value.myNHSno)

    this.router.navigateByUrl('/tabs/tab3');

  } 

  goBack(){
    this.router.navigateByUrl('tabs/tab3');
  }

}
