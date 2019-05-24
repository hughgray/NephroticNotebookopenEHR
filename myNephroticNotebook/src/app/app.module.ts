import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePickerModule } from './date-picker-component';
import { FetchReadingService} from './services/fetch-reading.service';
import { DatePickerComponent } from './date-picker-component/date-picker-component';
import { SQLite,SQLiteObject} from '@ionic-native/sqlite/ngx';
import { DatabaseService } from './services/database.service';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { PreReadingPageModule } from './pre-reading/pre-reading.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';


@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    DatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    PreReadingPageModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FetchReadingService,
    DatePickerComponent,
    EmailComposer,
    Platform,
    File,
    SQLite,
    DatabaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
