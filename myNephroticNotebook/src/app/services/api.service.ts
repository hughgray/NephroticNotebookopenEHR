import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

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
    "Authorization": "Basic YjI5ZWNhZGUtZWI2NS00NzQ4LThhNjEtMDE1NjQyMWMyNmFkOiQyYSQxMCQ2MTlraQ=="
  }
  requestOptions = {                                                                                                                                                                                 
    headers: new HttpHeaders(this.headerDict), 
  }
  ehrID: any;
  compUid: any;
  subjectNamespace = 'uk.nhs.nhs_number';
  newEHR = {
    "queryable": "true",
    "modifiable": "true"
  }

  constructor( private http: HttpClient, public platform: Platform, private database:DatabaseService) { }

  public getTemplates(): Promise<any> {
    return new Promise(resolve => {

      let templateUrl = `${this.cdrRestBaseUrl}/template`
      
      this.http.get(templateUrl, this.requestOptions)
      .subscribe(data => {
        resolve(true);
        console.log(data);
      }, error => {
        console.log(error);
      });
    
      console.log("Come on:", this.requestOptions)

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
            this.storeReading(dailyReading)
          }
          else {
          console.log("Daily Reading Added:", JSON.stringify(data));

          var json = JSON.stringify(data)
          var info = JSON.parse(json)

          this.compUid = info.compositionUid
          console.log('CompUid:',this.compUid)

          }

        }, error => {
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
            this.storeReading(dailyReading)
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was:`, JSON.stringify(error.error));
              this.storeReading(dailyReading)
          }
        });

      });
    }

    storeReading(dailyReading){

      var dailyReadingString = JSON.stringify(dailyReading)

      var dayReading = {
        "jsonReading": dailyReadingString,
      }
      this.database.insertData(dayReading, "jsonReadings"); 
      console.log('Reading: ', dayReading);

    }


}
