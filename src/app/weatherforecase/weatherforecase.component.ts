import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-weatherforecase',
  templateUrl: './weatherforecase.component.html',
  styleUrls: ['./weatherforecase.component.css'],
  providers: [DatePipe]
})
export class WeatherforecaseComponent implements OnInit {
  iconTable: any = {
    '01d': 'wi-day-sunny',
    '02d': 'wi-day-cloudy',
    '03d': 'wi-cloudy',
    '04d': 'wi-cloudy-windy',
    '09d': 'wi-showers',
    '10d': 'wi-rain',
    '11d': 'wi-thunderstorm',
    '13d': 'wi-snow',
    '50d': 'wi-fog',
    '01n': 'wi-night-clear',
    '02n': 'wi-night-cloudy',
    '03n': 'wi-night-cloudy',
    '04n': 'wi-night-cloudy',
    '09n': 'wi-night-showers',
    '10n': 'wi-night-rain',
    '11n': 'wi-night-thunderstorm',
    '13n': 'wi-night-snow',
    '50n': 'wi-night-alt-cloudy-windy'
  };
  cityInfo: any;
  forecastList: any = [];
  firstTime: String = '1';
  oldIcon: any = [];
  date: String;
  max: String;
  min: String;
  iconClass: String[];
  infoList: any[] = [];

  constructor(private httpClient: HttpClient, private elementRef: ElementRef,
    private renderer: Renderer2, private datePipe: DatePipe) { }

  ngOnInit() {
    this.firstRun();
  }
  firstRun(): void {
    this.updateWeatherforecast();
    this.updateDom();

    setInterval(() => {
      this.updateWeatherforecast();
    }, 1000 * 10 * 60); // 10min for weatherforecast info.
  }
  updateWeatherforecast(): void {
    // open weather url
    const url = 'http://api.openweathermap.org/data/2.5/forecast?id=1799962&APPID=a1262498c9a51a9637e264ba38636aa9&lang=zh_cn&units=metric';

    // get weather info.
    this.httpClient.get(url).subscribe(info => {
      // parse info.
      this.processWeather(info);
      // update dom
      this.updateDom();
    });
  }

  processWeather(data: any): void {
    // check
    if (!data || typeof data === 'undefined' ) {
      console.log('weather info undefinded');
      return;
    }
    if ( data.cod !== '200') {
      console.log('weather info cod not 200');
      return;
    }

    // city info
    this.cityInfo = data.city.name + ', ' + data.city.country;

    // forecast
    let forecastData = {};
    let _Day: string = null;
    this.forecastList = [];
    this.infoList = [];
    for (let i = 0, count = data.list.length; i < count; i++) {

      const forecast = data.list[i];
      const dataList = {};
      // today
      const _today = new Date();
      const today = this.datePipe.transform(_today, 'yyyy-MM-dd');

      // day and hour
      const time: moment.Moment = moment(forecast.dt_txt, 'YYYY-MM-DD hh:mm:ss');
      const day =  time.format('ddd');
      const hour = parseInt(time.format('H'), 10);

      // skip yestday weather info.
      if (time.format('YYYY-MM-DD') < today) {
        continue;
      }
      // let forecastData = {};
      if (day !== _Day) {
        dataList['day'] = day;
        dataList['maxTemp'] = parseFloat(forecast.main.temp_max).toFixed();
        dataList['minTemp'] = parseFloat(forecast.main.temp_min).toFixed();
        dataList['time'] = forecast.dt_txt;
        dataList['icon'] = this.iconTable[forecast.weather[0].icon];
        forecastData = {
          'day': dataList['day'],
          'maxTemp': dataList['maxTemp'],
          'minTemp': dataList['minTemp'],
          'icon': dataList['icon']
        };
        this.forecastList.push(forecastData);
        _Day = day;
      } else {
        // max temp
        let _b = forecastData['maxTemp'];
        forecastData['maxTemp'] = parseFloat(forecast.main.temp_max)
          > parseFloat(_b) ? parseFloat(forecast.main.temp_max).toFixed() : _b;

        // min temp
        _b = forecastData['minTemp'];
        forecastData['minTemp'] = parseFloat(forecast.main.temp_min)
          < parseFloat(_b) ? parseFloat(forecast.main.temp_min).toFixed() : _b;

        // icon
        if (hour >= 8 && hour <= 11) {
          // console.log(hour);
          // console.log(forecast.weather[0].icon);
          // console.log(this.iconTable[forecast.weather[0].icon]);
          forecastData['icon'] = this.iconTable[forecast.weather[0].icon];
          // console.log(this.forecastList[i]);
        }

      }
    }
    console.log(this.forecastList);

  }

  updateDom(): void {
    const dayList: String[] = [];
    const iconList: String[] = [];
    const maxList: String[] = [];
    const minList: String[] = [];
    for (let i = 0, count = this.forecastList.length; i < count; i++) {
      this.infoList.push(
        {
          'day': this.forecastList[i]['day'],
          'icon' : this.forecastList[i]['icon'],
          'iconClass' : ['wi', this.forecastList[i]['icon']],
          'max' : this.forecastList[i]['maxTemp'],
          'min' : this.forecastList[i]['minTemp'],
        }
        );
      // iconList.push(this.forecastList[i]['icon']);
      // maxList.push(this.forecastList[i]['maxTemp']);
      // minList.push(this.forecastList[i]['minTemp']);
      // find parent node
      // const p = this.elementRef.nativeElement.querySelector('.forecast');
      // console.log(p);
      // this.date = this.forecastList[0]['day'];
      // this.max = this.forecastList[0]['maxTemp'];
      // this.min = this.forecastList[0]['minTemp'];
      // this.iconClass = ['wi', this.forecastList[0]['icon']];
      // create new node
      // const n = this.renderer.createElement('i');
      // this.renderer.addClass(this.viewIcon.nativeElement, 'wi');
      // console.log(this.viewIcon);
      // console.log(this.viewIcon.nativeElement);
      // this.renderer.addClass(n, this.forecastList[0].icon);

      // find refNode
      // const r = this.elementRef.nativeElement.querySelector('.temp');
      // insert new node before refNode
      // this.renderer.insertBefore(p, n, r);
      // this.renderer.appendChild(p, n);

    }
    // this.infoList = [dayList, iconList, maxList, minList];
    this.firstTime = '2';
    console.log(this.infoList);
/*
    if (this.firstTime === '1') {

      // find parent node
      const p = this.elementRef.nativeElement.querySelector('.outdoor');
      // create new node
      const n = this.renderer.createElement('i');
      this.renderer.addClass(n, 'wi');
      this.renderer.addClass(n, this.icon);

      // find refNode
      const r = this.elementRef.nativeElement.querySelector('.temp');
      // insert new node before refNode
      this.renderer.insertBefore(p, n, r);
      this.firstTime = '2';
    } else {
      // find old node
      const old = this.elementRef.nativeElement.querySelector('.wi');
      // change class
      this.renderer.removeClass(old, this.oldIcon);
      this.renderer.addClass(old, this.icon);
    }
    this.oldIcon = this.icon; */

  }
}
