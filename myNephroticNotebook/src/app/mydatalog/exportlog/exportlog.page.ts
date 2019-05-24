import { Component, OnInit, ɵConsole } from '@angular/core';
import { FetchReadingService } from '../../services/fetch-reading.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Http } from '@angular/http';
import * as papa from 'papaparse';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { AlertController, Platform} from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-exportlog',
  templateUrl: './exportlog.page.html',
  styleUrls: ['./exportlog.page.scss'],
})
export class ExportlogPage implements OnInit {

  public export_data_log	  : any 	= null;
  isThereData: boolean = false;
  dataLogForm: FormGroup;
  public csv	  : any 	= null;
  dirName = 'mydatalog';
  fileName = 'MyNephroticNotebook.csv';
  nativeFilePath: any 	= null;
  dirPath: any 	= null;
  nativePath: any 	= null;
  possiblePath:any 	= null;
  startdate:any 	= null;
  enddate:any 	= null;

  error_messages = {
    'dateFrom': [
      { type: 'required', message: 'This date is needed!' }
    ],
    'dateTo': [
      { type: 'required', message: 'This date is needed too!' }
    ]
  }

  constructor(private platform: Platform, public file: File, public fileNavigator: File, public alertController: AlertController, private emailComposer: EmailComposer, private http: Http, private router: Router, public formBuilder: FormBuilder, public fetchReading:FetchReadingService) {

    this.dataLogForm = this.formBuilder.group({
      dateFrom: new FormControl('',Validators.compose([
        Validators.required
      ])),
      dateTo: new FormControl('',Validators.compose([
        Validators.required
      ]))
    });
  }

  ngOnInit(){
    this.presentAlertConfirm()
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      message: 'Please confirm that you are either sharing your own data here, or, you have the full consent of the patient to share this data.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
            this.router.navigateByUrl('tabs/tab3');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  submit() {

    console.log('From: ', this.dataLogForm.value.dateFrom);
    console.log('To: ', this.dataLogForm.value.dateTo);
    this.getDataLog(this.dataLogForm.value.dateFrom,this.dataLogForm.value.dateTo)
    this.startdate=this.dataLogForm.value.dateFrom.split('T',2)[0];
    this.enddate=this.dataLogForm.value.dateTo.split('T',2)[0];

  } 

  public getDataLog(dateFrom, dateTo) : void
   {  	
      console.log("getDatalog reached");
      this.fetchReading
      .exportDataLog(dateFrom, dateTo)
      .then((data) => 
      {
         let existingData      = Object.keys(data).length;
         if(existingData !== 0)
         {
            this.export_data_log 	= data;
            this.isThereData 	= true;
         }
         this.convertToCSV()	    			  			
      });
   } 

   convertToCSV(){

    this.csv = papa.unparse(this.export_data_log);
    console.log("csv", this.csv);

    let result = this.file.createDir(this.file.dataDirectory, this.dirName, true);
    result.then( data => 
      {
      this.dirPath = data.toURL();
      console.log('Directory exists at:', this.dirPath)

      let path = this.file.writeFile(this.dirPath, this.fileName, this.csv, {replace: true});
      path.then( dataFile => 
        {
          this.nativeFilePath = dataFile.toURL();
          console.log('File exists at:', this.nativeFilePath)
          this.checkPlatform()

        })
        .catch(error => {
          console.log('File doesn\'t exist:', error);
        })

    })
    .catch(error => {
      console.log('Directory doesn\'t exist:', error);
    })

    

  }

  checkPlatform(){

    if (this.platform.is('android')) {
      this.possiblePath = this.nativeFilePath;
      console.log("native path android", this.possiblePath)
    } 
    else {
      this.possiblePath = this.nativeFilePath.slice(7);
      console.log("native path:", this.possiblePath)
    }
    this.composeEmail()

   }

   composeEmail(){
     
     let email = {
       attachments: [this.possiblePath],
       subject: 'My Nephrotic Notebook Data Log',
       body: 'My Data Log \nFrom: ' + this.startdate + '\nTo: ' + this.enddate,
     }
     
     this.emailComposer.open(email);

   }
 

   goBack(){
    this.router.navigateByUrl('tabs/tab3');
   }

}
