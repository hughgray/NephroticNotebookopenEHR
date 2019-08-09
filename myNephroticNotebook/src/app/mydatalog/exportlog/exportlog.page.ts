import { Component, OnInit } from '@angular/core';
import { FetchReadingService } from '../../services/fetch-reading.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Http } from '@angular/http';
import * as papa from 'papaparse';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { AlertController, Platform} from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { ApiService } from '../../services/api.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-exportlog',
  templateUrl: './exportlog.page.html',
  styleUrls: ['./exportlog.page.scss'],
})
export class ExportlogPage implements OnInit {

  public export_data_log	  : any 	= null;
  public jsonData	  : any 	= null;
  isThereData: boolean = false;
  dataLogForm: FormGroup;
  public csv: any 	= null;
  public csvJSON: any 	= null;
  dirName = 'mydatalog';
  fileName = 'MyNephroticNotebook.csv';
  dirNameJson = 'myjsondatalog';
  fileNameJson = 'MyNephroticNotebookCDR.csv';
  nativeFilePath: any 	= null;
  nativeFilePathJson: any 	= null;
  dirPath: any 	= null;
  dirPathJson: any 	= null;
  nativePath: any 	= null;
  possiblePath: any 	= null;
  possiblePathJson: any = null;
  startdate: any 	= null;
  enddate: any 	= null;
  oldStart = null;
  oldEnd =  null;
  prevExport: any;
  public prevDatessss	  : any 	= null; 

  error_messages = {
    'dateFrom': [
      { type: 'required', message: 'This date is needed!' }
    ],
    'dateTo': [
      { type: 'required', message: 'This date is needed too!' }
    ]
  }

  prevDates = {
    'date': [
      {start: this.oldStart,
      end: this.oldEnd }
    ]
  }

  constructor(private storage: Storage, private api: ApiService, private platform: Platform, public file: File, public fileNavigator: File, public alertController: AlertController, private emailComposer: EmailComposer, private http: Http, private router: Router, public formBuilder: FormBuilder, public fetchReading:FetchReadingService) {

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

    this.loadItems()
    this.presentAlertConfirm()
  }

  loadItems(){
   
    this.storage.get("PrevExport")
    .then((val)=>{
      if (val !== null) {
        this.oldStart = val['start']
        this.oldEnd = val['end']
        console.log('last start', this.oldStart)
        console.log('last end', this.oldEnd)
        this.prevDatessss.push({
          start: this.oldStart,
          end: this.oldEnd
        });
        console.log('both', JSON.stringify(this.prevDatessss))
        console.log('start:', this.prevDatessss.start)
      }
    })
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
      ],
      backdropDismiss: false
    });

    await alert.present();
  }

  submit() {

    console.log('From: ', this.dataLogForm.value.dateFrom);
    console.log('To: ', this.dataLogForm.value.dateTo);
    this.startdate=this.dataLogForm.value.dateFrom.split('T',2)[0];
    this.enddate=this.dataLogForm.value.dateTo.split('T',2)[0];
    let exportDates = { "start": this.startdate, "end": this.enddate }; 
    this.storage.set("PrevExport", exportDates)
    this.checkConsent()

  } 

  checkConsent(){

    this.storage.get("EHR")
      .then((val) => {
        console.log("val pulled from storage: ",val);
        if (val == 0){
          console.log('No consent- just local storage')
          this.getDataLog(this.dataLogForm.value.dateFrom,this.dataLogForm.value.dateTo)
        }
        else{
          console.log('ehrID exists so they consent')
          this.api.setCDRVariables()
          .then(()=>{
            this.api.getTemplates()
          .then(() => {
            this.checkConnection()
          })
          })
        }
    });
  }

  public getDataLog(dateFrom, dateTo) : void
   {  	
    this.storage.set('export',1)
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
      this.possiblePathJson = this.nativeFilePathJson;
      console.log("native path android", this.possiblePath)
      console.log("native path json android", this.possiblePath)
    } 
    else {
      this.possiblePath = this.nativeFilePath.slice(7);
      this.possiblePathJson = this.nativeFilePathJson.slice(7);
      console.log("native path:", this.possiblePath)
      console.log("native path json:", this.possiblePath)
    }
    this.composeEmail()

   }

   composeEmail(){
     
     let email = {
       attachments: [this.possiblePath, this.possiblePathJson],
       subject: 'My Nephrotic Notebook Data Log',
       body: 'My Data Log \nFrom: ' + this.startdate + '\nTo: ' + this.enddate,
     }
     this.emailComposer.open(email);
   }
 

   goBack(){
    this.router.navigateByUrl('tabs/tab3');
   }

  checkConnection(){

    this.storage.get("Connection")
      .then((val) => {
        console.log("val pulled from storage: ",val);
        if (val == 0){
          this.noNetworkConnection()
        }
        else{
          console.log("Connection is g! Did that work?");
          this.getEhrId()
        }
    });
  }

  async noNetworkConnection() {

    const alert = await this.alertController.create({
      header: 'CONNECTION ERROR',
      message: 'You must be able to connect to the CDR to get your online data log. Do you wish to proceed with just local data?',
      buttons: [{
        text: 'No',
        handler: () => {
          console.log('Just local csv so...');
          this.getDataLog(this.dataLogForm.value.dateFrom,this.dataLogForm.value.dateTo)
        }
      }, {
        text: 'Yes',
        handler: () => {
          console.log('Try again....');
        }
      }]
    })
    await alert.present();
  }

   public getEhrId()
   {  	
      console.log("getting ehrID...");
      this.fetchReading.myProfileDetails()
      .then((data) => 
      {
         let existingData      = Object.keys(data).length;
         if(existingData !== 0)
         {
            var ehrId = String(data[0].ehrid);
         }
         this.getExportDataCDR(ehrId,this.startdate,this.enddate)	    			  			
      });
   } 


   getExportDataCDR(ehrID, dateFrom, dateTo){

    this.api.getData(ehrID, dateFrom, dateTo)
    .then((data) => 
      {
        console.log("data on export page:",data)
        this.jsonData 	= data;
        this.convertJSONToCSV()	    			  			
      });
  }

  convertJSONToCSV(){

    console.log("gowan: ",JSON.stringify(this.jsonData))
    var resultsData = this.jsonData.resultSet;
    console.log("just results set?:",resultsData)

    this.csvJSON = papa.unparse({
      fields: ["date", "reading", "doseAmount", "doseAmountUnit", 
               "medicationAdministered", "doseAdminStepValue", "regime", "comment"],
      data: resultsData
    });
    console.log("JSON csv", this.csvJSON);

    let csvTest = papa.parse(this.csvJSON)
    console.log("CSV JSON!!!!", csvTest);
    console.log("CSV JSON!!!!", JSON.stringify(csvTest));


    let resultJson = this.file.createDir(this.file.dataDirectory, this.dirNameJson, true);
    resultJson.then( data => 
      {
      this.dirPathJson = data.toURL();
      console.log('JSON Directory exists at:', this.dirPathJson)

      let path = this.file.writeFile(this.dirPathJson, this.fileNameJson, this.csvJSON, {replace: true});
      path.then( dataFile => 
        {
          this.nativeFilePathJson = dataFile.toURL();
          console.log('JSON File exists at:', this.nativeFilePathJson) 
          this.deleteSession()

        })
        .catch(error => {
          console.log('JSON File doesn\'t exist:', error);
          console.log('Going local only....');
          this.deleteSession()
        })

    })
    .catch(error => {
      console.log('JSON Directory doesn\'t exist:', error);
      console.log('Going local only....');
      this.deleteSession()
    })
  }

  deleteSession(){

    this.storage.get("CDR")
      .then((val) => {
        if (val != "Gosh"){
          this.api.deleteSession()
          .then(()=>{
            this.getDataLog(this.dataLogForm.value.dateFrom,this.dataLogForm.value.dateTo)
          })
        } else {
          this.getDataLog(this.dataLogForm.value.dateFrom,this.dataLogForm.value.dateTo)
        }
      })
  }
}
