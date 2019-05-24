
import { Injectable, OnInit} from '@angular/core';
import { Http } from '@angular/http';
import {DatabaseService} from '../services/database.service';
import {Platform} from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class FetchReadingService implements OnInit{

  monthly_reading:object={};
  months_fetched=new Set();
  state_details:object={};
  reading_mapping:object={};
    //create the objects for styling preference and inline text
  readingcolor_l:object={0:"#ffffff",1:"#dce977",2:"#bad36d",3:"#a5c177",4:"#90b991",5:"#70af9a",6:"#599c8a"};
  reading_text:object={0:"No Reading",1:"Negative",2:"Trace",3:"30mg/dL",4:"100mg/dL",5:"300mg/dL",6:"2000mg/dL+"};
  symbol_l:object={0:'  .  ',1:'  -  ',2:"  T  ",3:"  +  ",4:" ++ ",5:"+++",6:"++++"};
  meds_l:object={0:'no',1:'yes'};
  fontsize_l:object={0:'20px',1:'20px',2:"20px",3:"15px",4:"15px",5:"15px",6:"15px"};
  treatmentcolor_l:object={"maintenance":"#ffffff","relapse":"rgba(217,0,0,0.5)","remission":"rgba(244,162,59,0.5)"};
  treatmentborder_l:object={"maintenance":"2px solid #ffffff","relapse":"2px solid #D9495C","remission":"2px solid #F4793B"};
  
  csvData:any[]=[];
  public plan_details : Array<any>     = [];
  public profile_details : Array<any>     = [];
  public current_plan_id : Array<any>     = [];
  public active_state_id : Array<any>     = [];
  public data_log : Array<any>     = [];
  public export_data_log : Array<any>     = [];

  
  constructor(private http:Http,private database:DatabaseService,public platform:Platform) { 
  }

  ngOnInit(){
  }

  public treatmentState() : Promise<any>
   {
      return new Promise(resolve => 
      {
         this.database.db.executeSql('SELECT * FROM treatment_state', [])
         .then((data : any) => 
         {			
            if(data.rows.length > 0) 
            {
              var k;
               for(k = 0; k < data.rows.length; k++) 
               {	    
                  this.state_details[data.rows.item(k).treatment_state_id]=
                  {
                    state: data.rows.item(k).state_name,
                    amt: data.rows.item(k).recc_dose,
                    pillno: data.rows.item(k).doses_per_interval,
                    interval: data.rows.item(k).interval_length
                  };
               }
            }

            resolve(this.state_details);
            console.log("Treatment state read: ",this.state_details);

         }) 
         .catch((error) => 
         {
            console.log("Error: " + JSON.stringify(error.err));
         });
      });
   }

   public activeTreatmentPlanID() : Promise<any>
   {
      return new Promise(resolve => 
      {
         this.database.db.executeSql('SELECT MAX(treatment_state_id) as activeStateId FROM treatment_state', [])
         .then((data : any) => 
         {	
            this.active_state_id 	= [];
            if(data.rows.length > 0) 
            {
              var k;
               for(k = 0; k < data.rows.length; k++) 
               {
                  this.active_state_id.push({activeStateId: data.rows.item(0).activeStateId});		
               }
            }
            resolve(this.active_state_id);
            console.log("Treatment state id read: ", this.active_state_id);
         }) 
         .catch((error) => 
         {
            console.log("Error: " + JSON.stringify(error.err));
         });
      });
   }

   public treatmentPlanID() : Promise<any>
   {
      return new Promise(resolve => 
      {
         this.database.db.executeSql('SELECT MAX(treatment_plan_id) as planId FROM treatment_plans', [])
         .then((data : any) => 
         {	
            this.current_plan_id 	= [];
            if(data.rows.length > 0) 
            {
              var k;
               for(k = 0; k < data.rows.length; k++) 
               {
                  this.current_plan_id.push({planId: data.rows.item(0).planId});		
               }
            }
            resolve(this.current_plan_id);
            console.log("Treatment plan id read: ", this.current_plan_id);
         }) 
         .catch((error) => 
         {
            console.log("Error: " + JSON.stringify(error.err));
         });
      });
   }

   public treatmentPlan(id) : Promise<any>
   {
      return new Promise(resolve => 
      {
        let sql:string="";
        sql = `SELECT * FROM treatment_state 
               WHERE treatment_plan_id= `+ id + ``;

         this.database.db.executeSql(sql, [])
         .then((data : any) => 
         {			
            this.plan_details 	= [];
            if(data.rows.length > 0) 
            {
              var k;
               for(k = 0; k < data.rows.length; k++) 
               {	    
                  this.plan_details.push({
                    state: data.rows.item(k).state_name,
                    amt: data.rows.item(k).recc_dose,
                    dur: data.rows.item(k).state_duration,
                    pillno: data.rows.item(k).doses_per_interval,
                    interval: data.rows.item(k).interval_length
                  });
               }
            }

            resolve(this.plan_details);
            console.log("Treatment plan read: ",this.plan_details);

         }) 
         .catch((error) => 
         {
            console.log("Error: " + JSON.stringify(error.err));
         });
      });
   }

   public myProfileDetails() : Promise<any>
   {
      return new Promise(resolve => 
      {
         this.database.db.executeSql('SELECT * FROM profile', [])
         .then((data : any) => 
         {			
            this.profile_details 	= [];
            if(data.rows.length > 0) 
            {
              var k;
               for(k = 0; k < data.rows.length; k++) 
               {	    
                  this.profile_details.push({
                    name: data.rows.item(k).patient_name,
                    doc: data.rows.item(k).doctor_name,
                    num: data.rows.item(k).doctor_contact,
                    birthday: data.rows.item(k).birthday,
                    othermeds: data.rows.item(k).other_meds
                  });
               }
            }

            resolve(this.profile_details);
            console.log("Profile read: ",this.profile_details);

         }) 
         .catch((error) => 
         {
            console.log("Error: " + JSON.stringify(error.err));
         });
      });
   }
   


  public readingMapping(): Promise<any>
   {
      return new Promise(resolve => 
      {
              this.database.db.executeSql('SELECT * FROM readings', [])
              .then((data : any) => 
              {			
                  this.reading_mapping={};
                  if(data.rows.length > 0) 
                  {

                    var k;
                    for(k = 0; k < data.rows.length; k++) 
                    {	    
                        this.reading_mapping[k+1]=data.rows.item(k).reading_level;
                    }
                  }

                  resolve(this.reading_mapping);
                  // console.log("data fetched is: ",this.readings_datafetch);

              }) 
              .catch((error) => 
              {
                  console.log("Error: " + JSON.stringify(error.err));
              });
          });
  
   }

  //retrieve the daily readings data from database
  public monthlyReading(startdate,enddate,currentmonth) : Promise<any>
   {
      return new Promise(resolve => 
      {

          this.database.db.executeSql(
            `SELECT * 
              FROM daily_readings 
              WHERE date_of_reading BETWEEN '`+ startdate +` 00:00:00' AND '`+ enddate +` 23:59:59'
              ORDER BY date_of_reading;
              `, [])
                        
            .then((data : any) => 
            {			
            if(data.rows.length > 0) 
            {
            var k;
            for(k = 0; k < data.rows.length; k++) 
            {	    
              
            let symbol:string=this.symbol_l[data.rows.item(k).reading_level_id];
              let readingstyle_l:{[index:string]:string}={'color':this.readingcolor_l[data.rows.item(k).reading_level_id],'font-size':'this.fontsize_l[element[1]]',
              'width':'30px','height':'10px','margin':'0px','padding':'0px'}; 
              
              this.monthly_reading[data.rows.item(k).date_of_reading.split(' ',2)[0]]=
              {
                reading: data.rows.item(k).reading_level_id,
                medication_taken: data.rows.item(k).medication_taken,
                comment: data.rows.item(k).user_comment,
                stateID: data.rows.item(k).treatment_state_id,
                readingstyle:readingstyle_l,
                symbol:symbol};
            }
            //keep track of the months fetched
            this.months_fetched.add(startdate.slice(0,-3));
            this.months_fetched.add(enddate.slice(0,-3));
            this.months_fetched.add(currentmonth);

            }
            console.log(this.monthly_reading);
            resolve(this.monthly_reading);

            }) 
            .catch((error) => 
            {
            console.log("Error: " + JSON.stringify(error.err));
            });
      })               
    }
 
    public dataLog() : Promise<any>
   {
      return new Promise(resolve => 
      {

          this.database.db.executeSql(
            `SELECT date_of_reading, reading_level_id, medication_taken, user_comment
              FROM daily_readings 
              ORDER BY date_of_reading DESC;
              `, [])
                        
            .then((data : any) => 
            {			
               this.data_log 	= [];
               if(data.rows.length > 0) 
               {
                 var k;
                  for(k = 0; k < data.rows.length; k++) 
                  {	
                     let symbol:string=this.symbol_l[data.rows.item(k).reading_level_id];
                     let date:string=data.rows.item(k).date_of_reading.split(' ',2)[0];
                     let taken:string=this.meds_l[data.rows.item(k).medication_taken];

                     this.data_log.push({
                       date,
                       reading: data.rows.item(k).reading_level_id,
                       meds: data.rows.item(k).medication_taken,
                       symbol: symbol, 
                       meds_taken: taken 
                     });
                  }
               }
               console.log("got from db", this.data_log);
               resolve(this.data_log);
            

            }) 
            .catch((error) => 
            {
            console.log("Error: " + JSON.stringify(error.err));
            });
      })               
    }

    public exportDataLog(startdate,enddate) : Promise<any>
   {
      return new Promise(resolve => 
      {
         console.log('date: :',startdate,enddate);
         startdate=startdate.split(' ',2)[0];
         enddate=enddate.split(' ',2)[0];
          this.database.db.executeSql(
            `SELECT date_of_reading, reading_level_id, medication_taken, user_comment, recc_dose, doses_per_interval, interval_length
              FROM daily_readings d, treatment_state s
              WHERE date_of_reading BETWEEN '`+ startdate +` 00:00:00' AND '`+ enddate +` 23:59:59' AND
              d.treatment_state_id=s.treatment_state_id
              ORDER BY date_of_reading DESC;
              `, [])
                        
            .then((data : any) => 
            {			
               this.export_data_log 	= [];
               if(data.rows.length > 0) 
               {
                 var k;
                  for(k = 0; k < data.rows.length; k++) 
                  {	  
                     let symbol:string=this.symbol_l[data.rows.item(k).reading_level_id];
                     let Date:string=data.rows.item(k).date_of_reading.split(' ',2)[0];
                     let Taken:string=this.meds_l[data.rows.item(k).medication_taken];

                     this.export_data_log.push({
                       Date,
                       Reading: symbol,
                       Dose: data.rows.item(k).recc_dose,
                       Times: data.rows.item(k).doses_per_interval,
                       Interval: data.rows.item(k).interval_length,
                       Taken,
                       Comment: data.rows.item(k).user_comment,
                     });
                  }
               }

            resolve(this.export_data_log);
            console.log(this.export_data_log);
            console.log("start", startdate);
            console.log("end", enddate);

            }) 
            .catch((error) => 
            {
            console.log("Error: " + JSON.stringify(error.err));
            });
      })               
    }

}



