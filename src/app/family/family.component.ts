import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css'],
  providers: [DatePipe]
})
export class FamilyComponent implements OnInit {

  isGuHome: boolean;
  isLuHome: boolean;
  sensorStat = false;
  delay = 1000;
  next = true;
  test: any;

  guID: any = { 'entity_id': 'device_tracker.mix2sxiaomishouji' };
  luID: any = { 'entity_id': 'device_tracker.iphone' };
  sensorID: any = { 'entity_id': 'binary_sensor.door_window_sensor_158d0001bb3b0b' };
  deskID: any = { 'entity_id': 'sensor.temperature_158d000254294e' };
  lightLeftID: any = { 'entity_id': 'switch.wall_switch_left_158d0002164afd' };
  lightRightID: any = { 'entity_id': 'switch.wall_switch_right_158d0002164afd' };

  constructor(private httpClient: HttpClient, private elementRef: ElementRef,
    private renderer: Renderer2, private datePipe: DatePipe) { }

  ngOnInit() {
    // this.firstRun();
    // setTimeout(() => {
    //   this.checkTime();
    // }, 1000 * 10);
    // this.scheduleUpdate(this.delay);
  }

  firstRun() {
    setInterval(() => {
      this.checkStat();
    }, 1000 * 60); // 1min for family info.
    setInterval(() => {
      this.checkTime();
    }, 1000 * 60);
  }

  checkTime() {
    const _now = new Date();
    const now = parseInt(this.datePipe.transform(_now, 'HH'), 10);
    console.log('now: ' + now);
    if (now <= 12) {
      return;
    }
    const newRound = !this.next;
    this.next = true;
    console.log('newRound: ' + newRound);
    if ( newRound ) {
      this.scheduleUpdate(this.delay);
    }
  }

  scheduleUpdate(delay: any) {
    console.log('listening...');
    setTimeout(() => {
      this.checkSensor();
    }, delay);
  }
  checkSensor() {
    this.httpClient.get('http://192.168.2.205:8123/api/states?api_password=megachips')
      .subscribe(data => {
        // check sensor
        const oldStat = this.sensorStat;
        this.sensorStat = this.JsonQuery(data, this.sensorID)[0].state === 'off' ? false : true;
        if ( oldStat !== this.sensorStat ) {
          console.log('stat changed!');
          this.next = false;
          this.openAll();
        }
      });
    if ( this.next ) {
      this.scheduleUpdate(this.delay);
    }
  }
  openAll() {
    const postAddr = 'http://192.168.2.205:8123/api/services/switch/turn_on'
    + '?api_password=megachips';
    // console.log(`add:${postAddr}`);
    this.httpClient.post(postAddr, JSON.stringify(this.lightLeftID)).subscribe(rs => {
      console.log(`light Left on`);
    });
    this.httpClient.post(postAddr, JSON.stringify(this.lightRightID)).subscribe(rs => {
      console.log(`light Right on`);
    });
  }
  checkStat() {
    this.httpClient.get('http://192.168.2.205:8123/api/states?api_password=megachips')
      .subscribe(data => {
        // check gu
        this.isGuHome = this.JsonQuery(data, this.guID)[0].state === 'home' ? true : false;
        // check lu
        this.isLuHome = this.JsonQuery(data, this.luID)[0].state === 'home' ? true : false;
        // console.log(this.isGuHome);
      });
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
}
