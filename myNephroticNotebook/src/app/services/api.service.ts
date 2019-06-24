import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { FetchReadingService } from '../services/fetch-reading.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  cdrRestBaseUrl = 'https://cdr.code4health.org/rest/v1'
  templateIdReading = 'MNNB - Nephrotic self-monitoring-v0'
  templateIdTreatment = 'MNNB - Treatment Plan'
  headerDict = {
    "Content-Type": "application/json",
    "Ehr-Session-disabled": "1917e50d-65d3-4c2c-94e3-0b5d303e0b72",
    "Authorization": "Basic YjI5ZWNhZGUtZWI2NS00NzQ4LThhNjEtMDE1NjQyMWMyNmFkOiQyYSQxMCQ2MTlraQ==" };

  requestOptions = {                                                                                                                                                                                 
    headers: new HttpHeaders(this.headerDict), 
  };
  ehrID: any;
  compUid: any;
  subjectNamespace = 'uk.nhs.nhs_number';
  newEHR = {
    "queryable": "true",
    "modifiable": "true"
  };
  jsonReading: any;
  myName: string;
  ehrId: string;

  constructor(public fetchReading:FetchReadingService, private storage: Storage, private http: HttpClient, public platform: Platform, private database:DatabaseService) { }

  public getTemplates(): Promise<any> {
    return new Promise(resolve => {

      let templateUrl = `${this.cdrRestBaseUrl}/template`
      
      this.http.get(templateUrl, this.requestOptions)
      .subscribe(data => {

        if (data == null) {
          console.log('Connection to CDR Bad 1!')
          this.storage.set("Connection", 0);
          resolve()
        }
        else {
          console.log("templateId in",JSON.stringify(data));
          this.storage.set("Connection", 1);
          console.log("Connection flag",1);
          resolve()
        }
      }, error => {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('Connection to CDR Bad 2!')
          console.error('An error occurred:', error.error.message);
          this.storage.set("Connection", 0);
          resolve()
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log('Connection to CDR Bad 3!')
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
            this.storage.set("Connection", 0);
            resolve()
        }
      });
    
    });
  }

    public getEHRstatus(subjectId): Promise<any> {
      return new Promise(resolve => {
  
        console.log('checking number:', subjectId)
  
        let EHRstatusUrl = `${this.cdrRestBaseUrl}/ehr/?subjectId=${subjectId}&subjectNamespace=${this.subjectNamespace}`
        
        this.http.get(EHRstatusUrl, this.requestOptions )
        .subscribe(data => {

          if (data == null) {
            console.log('creating ehr')
            this.createEHRid(subjectId)
          }
          else {
 
          console.log("ehrID exists in:",data);

          var json = JSON.stringify(data)
          var info = JSON.parse(json)

          this.ehrID = info.ehrId
          console.log('ehrID:',this.ehrID)
          this.addToDB()
          }
          

        },error => {
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`);
          }
        });
        resolve()
    
      });
    } 

    public createEHRid(subjectId): Promise<any> {
      return new Promise(resolve => {

        console.log('creating number:', subjectId)

        let createEHRUrl = `${this.cdrRestBaseUrl}/ehr?subjectId=${subjectId}&subjectNamespace=${this.subjectNamespace}`
        
        this.http.post(createEHRUrl, this.newEHR, this.requestOptions)
        .subscribe(data => {
          console.log(data);
          var json = JSON.stringify(data)
          var info = JSON.parse(json)

          this.ehrID = info.ehrId
          console.log('ehrID:',this.ehrID)
          this.addToDB()

        }, error => {
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`);
          }
        });

      });
    } 

    addToDB() {
      var ehrid = {
        "ehr_id": this.ehrID,
      }
      this.database.insertData(ehrid, "profileEHRid"); 
      console.log('EHR ID: ', this.ehrID);
    }

    public getEHRstatusUpdate(subjectId): Promise<any> {
      return new Promise(resolve => {

        let EHRstatusUrl = `${this.cdrRestBaseUrl}/ehr/?subjectId=${subjectId}&subjectNamespace=${this.subjectNamespace}`
        
        this.http.get(EHRstatusUrl, this.requestOptions)
        .subscribe(data => {

          if (data == null) {
            console.log('creating ehr')
            this.createEHRidUpdate(subjectId)
          }
          else {
 
          console.log("ehrID exists in:",data);

          var json = JSON.stringify(data)
          var info = JSON.parse(json)

          this.ehrID = info.ehrId
          console.log('ehrID:',this.ehrID)
          this.addToDBupdate()
          }

        }, error => {
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`);
          }
        });
        resolve()

      });
    }

    public createEHRidUpdate(subjectId): Promise<any> {
      return new Promise(resolve => {

        let createEHRUrl = `${this.cdrRestBaseUrl}/ehr?subjectId=${subjectId}&subjectNamespace=${this.subjectNamespace}`
        
        this.http.post(createEHRUrl, this.newEHR, this.requestOptions)
        .subscribe(data => {
          console.log(data);
          var json = JSON.stringify(data)
          var info = JSON.parse(json)

          this.ehrID = info.ehrId
          console.log('ehrID:',this.ehrID)
          this.addToDBupdate()

        }, error => {
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`);
          }
        });
        resolve()

      });
    } 

    addToDBupdate() {
      var ehrid = {
        "ehr_id": this.ehrID,
      }
      this.database.insertData(ehrid, "profileEHRidUpdate"); 
      console.log('EHR ID: ', this.ehrID);
    }


    public commitComposition(ehrId, committerName, dailyReading): Promise<any> {
      return new Promise(resolve => {
  
        let commitDailyComp = `${this.cdrRestBaseUrl}/composition?ehrId=${ehrId}&templateId=${this.templateIdReading}&committerName=${committerName}&format=FLAT`
        
        this.http.post(commitDailyComp, dailyReading, this.requestOptions)
        .subscribe(data => {

          if (data == null) {
            console.log('commit to db')
            this.storage.set("Connection", 0);
            console.log("Connection flag set to 0");
            resolve()
          }
          else {
          console.log("Daily Reading Added:", JSON.stringify(data));

          var json = JSON.stringify(data)
          var info = JSON.parse(json)

          this.compUid = info.compositionUid
          console.log('CompUid:',this.compUid)
          this.storage.set("Connection", 1);
          console.log("Connection flagset to 1 by commit comp");
          this.dropJSON()
          resolve()

          }

        }, error => {
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
            this.storage.set("Connection", 0);
            console.log("Connection flag set to 0");
            resolve()

          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was:`, JSON.stringify(error.error));
              this.storage.set("Connection", 0);
              console.log("Connection flag set to 0");
              resolve()
          }
        });

      });
    }

    public storeReading(dailyReading){

      var dailyReadingJString = JSON.stringify(dailyReading)
      console.log('Reading: ', dailyReadingJString);

      var dayReading = {
        "jsonReading": dailyReadingJString
      }
      this.database.insertData(dayReading, "jsonReadings"); 
      console.log('Reading: ', dayReading);

    }


    public sendStoredReadings():Promise<any>{
      return new Promise(resolve => {

      this.fetchReading.getJsonReadings()
      .then((data) => 
        {
           let existingData      = Object.keys(data).length;
           if(existingData !== 0) {
              this.jsonReading = data;
              console.log('dataStoredJSON', this.jsonReading)
              this.getStoredDetails()
           }
           resolve()
        });
      })
    }

    public dropJSON():Promise<any>{
      return new Promise(resolve => {

      this.database.dropJsonData()
      .then((data) => 
        {
          this.sendStoredReadings()
        });
        console.log('just dropped, now sending stored readings...')
        resolve()
      });
    }

    public getStoredDetails():Promise<any>{
      return new Promise(resolve => {

      this.fetchReading.myProfileDetails()
      .then((data) => 
        {
          let existingData      = Object.keys(data).length;
          if(existingData !== 0)
          {
              this.myName 	= String(data[0].name);
              this.ehrId = String(data[0].ehrid);
          }
          console.log('sending stored readings...')
          this.loop()
          resolve() 

          })  			
        });
      }
    
    async loop() {
      for (var i = 0; i < this.jsonReading.Body.length; i++) {
          await new Promise(resolve => {

            var readingDay = String(this.jsonReading[i].Body)
            console.log('readingDay', readingDay)
            console.log('number', this.jsonReading[i].Number)
            this.commitStoredComposition(this.ehrId, this.myName, readingDay, this.jsonReading[i].Number)
            resolve()

          })
        }
    }

    public commitStoredComposition(ehrId, committerName, dailyReading, number): Promise<any> {
      return new Promise(resolve => {
  
        let commitDailyComp = `${this.cdrRestBaseUrl}/composition?ehrId=${ehrId}&templateId=${this.templateIdReading}&committerName=${committerName}&format=FLAT`
        
        this.http.post(commitDailyComp, dailyReading, this.requestOptions)
        .subscribe(data => {

          if (data == null) {
            console.log('not working')
            resolve()
          }
          else {
          console.log("Daily Reading Added:", JSON.stringify(data));

          var json = JSON.stringify(data)
          var info = JSON.parse(json)

          var compUid = info.compositionUid
          console.log('CompUid:', compUid)
          this.storeReadingUid(compUid, number)
          .then(()=>{
            resolve()
          })

          }

        }, error => {
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
            resolve()
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was:`, JSON.stringify(error.error));
              resolve()
          }
        });

      });
    }

    public storeReadingUid(compUid, number){
      return new Promise(resolve => {

      console.log('CompUid: ', compUid);
      console.log('Number: ', number);

      var dayReadingFill = {
        "compUid": compUid,
        "jsonNo": number
      }

      this.database.insertData(dayReadingFill, "jsonReadingsUid"); 
      console.log('Reading: ', dayReadingFill);
      resolve()
    })

    }



}
