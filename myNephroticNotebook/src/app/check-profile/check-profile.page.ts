import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-check-profile',
  templateUrl: './check-profile.page.html',
  styleUrls: ['./check-profile.page.scss'],
})
export class CheckProfilePage implements OnInit {

  constructor(private router: Router, private database: DatabaseService, public platform: Platform) { }

  ngOnInit() {
    setTimeout(() =>
      this.platform.ready().then(() => {
        console.log("check profile");
        this.database.callDatabase().then((data: any) => {
          //check if profile already exists
          this.database.profileExists().then((onboard) => {
            if (onboard == true) {
              //onboarding has already completed. Go to home page instead.
              console.log("return profile exists")
              this.router.navigateByUrl('tabs/tab2');
            } else {
              //onboarding has already completed. Go to home page instead.
              console.log("route to onboarding");
              this.router.navigateByUrl('h');
            }

          });
        });
      }), 4000);
  }

}
