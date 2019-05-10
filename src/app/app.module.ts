import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SwitchesComponent } from './switches/switches.component';
import { HttpClientModule } from '@angular/common/http';
import { ClockComponent } from './clock/clock.component';
import { WeatherComponent } from './weather/weather.component';
import { WeatherIconsModule } from 'ngx-icons';
import { WeatherforecaseComponent } from './weatherforecase/weatherforecase.component';
import { FamilyComponent } from './family/family.component';


@NgModule({
  declarations: [
    AppComponent,
    SwitchesComponent,
    ClockComponent,
    WeatherComponent,
    WeatherforecaseComponent,
    FamilyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    WeatherIconsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
