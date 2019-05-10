import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  swStat: string;
  swID: any = { 'entity_id': 'switch.plug_158d0001bc116c' };

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
  windTable: any = {
    '0': '无风',
    '1': '软风',
    '2': '清风',
    '3': '微风',
    '4': '和风',
    '5': '清劲风',
    '6': '强风'
  };
  sensorTempID: any = { 'entity_id': 'sensor.temperature_158d000254294e' };
  sensorHuID: any = { 'entity_id': 'sensor.humidity_158d000254294e' };
  temp: any;
  description: any;
  icon: string;
  windSpeed: any;
  roomTemp: any;
  roomHumidity: any;
  firstTime: any = '1';
  oldIcon: any;

  constructor(private httpClient: HttpClient, private elementRef: ElementRef,
    private renderer: Renderer2) { }

  ngOnInit() {
    this.firstRun();
  }

  firstRun(): void {
    this.updateWeather();
    this.updateRoomInfo();

    setInterval(() => {
      this.updateWeather();
    }, 1000 * 10 * 60); // 10min for weather info.

    setInterval(() => {
      this.updateRoomInfo();
    }, 1000 * 60); // 1min for room info.
  }
  updateWeather(): void {
    // open weather url
    const url = 'http://api.openweathermap.org/data/2.5/weather?id=1799962&APPID=a1262498c9a51a9637e264ba38636aa9&lang=zh_cn&units=metric';

    // get weather info.
    this.httpClient.get(url).subscribe(info => {
      console.log(info);
      // parse info.
      this.processWeather(info);
      // update dom
      this.updateDom();
    });
  }
  updateRoomInfo(): void {
    // get room info.
    this.httpClient.get('http://192.168.2.123:8123/api/states?api_password=megachips')
      .subscribe(data => {
        this.roomTemp = this.JsonQuery(data, this.sensorTempID)[0].state + '℃';
        this.roomHumidity = this.JsonQuery(data, this.sensorHuID)[0].state + '%';
      });
  }

  updateDom(): void {
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
    this.oldIcon = this.icon;
  }

  processWeather(info: any): void {
    // check
    if (!info || typeof info === 'undefined' ) {
      return;
    }
    if ( info.cod !== 200) {
      return;
    }

    // get temperature
    this.temp = info.main.temp.toFixed() + '℃';

    // get description
    this.description = info.weather[0].description;

    // get icon
    this.icon = this.iconTable[info.weather[0].icon.toString()];

    // get wind speed
    const fixedSpeed = Number(info.wind.speed).toFixed(0).toString();
    this.windSpeed = this.windTable[fixedSpeed];

  }

  JsonQuery(arr: any, obj: any): any {
    const _arr: any = [];
    for (const _jsonObj of arr) {
        let _b = true;
        for (const prop in obj) {
            if (_jsonObj[prop] !== obj[prop]) {
                _b = false;
                break;
            }
        }
        if (_b) { _arr.push(_jsonObj); }
    }
    return _arr;
  }

  SwitchStatRotate(oldState: string): string {
    if (oldState === 'on') {
      return 'off';
    }
    return 'on';
  }
  FireSwitch(): void {
    this.SwitchChange(this.swStat);
    console.log('switch state change');
  }
  SwitchChange(stat: string): string {
    this.httpClient.get('http://192.168.2.123:8123/api/states?api_password=megachips')
      .subscribe(data => {
        this.swStat = this.JsonQuery(data, this.swID)[0].state;

        const postAddr = 'http://192.168.2.123:8123/api/services/switch/turn_'
        + this.SwitchStatRotate(this.swStat) + '?api_password=megachips';
        this.httpClient.post(postAddr, JSON.stringify(this.swID)).subscribe(rs => {
          console.log(`switch state changed`);
        });
      });
      return status;
  }
}
