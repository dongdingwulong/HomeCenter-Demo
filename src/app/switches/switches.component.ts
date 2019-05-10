import { Component, OnInit } from '@angular/core';
import { HttpClientModule  } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { post } from 'selenium-webdriver/http';

@Component({
  selector: 'app-switches',
  templateUrl: './switches.component.html',
  styleUrls: ['./switches.component.css']
})
export class SwitchesComponent implements OnInit {
  btName: string;
  swStat: string;
  swID: any = { 'entity_id': 'switch.plug_158d0001bc116c' };

  constructor(private httpClient: HttpClient) {

  }

  SwitchStatRotate(oldState: string): string {
    if (oldState === 'on') {
      this.btName = 'off';
      return 'off';
    }
    this.btName = 'on';
    return 'on';
  }
  FireSwitch(): void {
    this.SwitchChange(this.swStat);
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
  GetSwtichState(): void {
    this.httpClient.get('http://192.168.2.123:8123/api/states?api_password=megachips')
    // this.httpClient.get('http://localhost:4200/states?api_password=megachips')
      .subscribe(data => {
        // console.log(this.JsonQuery(data, this.swID)[0].state);
        this.swStat = this.JsonQuery(data, this.swID)[0].state;
        // console.log(this.swStat);
        this.btName = this.swStat;
      });
  }
  SwitchChange(stat: string): string {
    this.httpClient.get('http://192.168.2.123:8123/api/states?api_password=megachips')
      .subscribe(data => {
        // console.log(this.JsonQuery(data, this.swID)[0].state);
        this.swStat = this.JsonQuery(data, this.swID)[0].state;
        // console.log(this.swStat);

        const postAddr = 'http://192.168.2.123:8123/api/services/switch/turn_'
        + this.SwitchStatRotate(this.swStat) + '?api_password=megachips';
        // console.log(`add:${postAddr}`);
        this.httpClient.post(postAddr, JSON.stringify(this.swID)).subscribe(rs => {
          console.log(`switch state changed`);
        });
      });
      return status;
  }
  fireSwitchOn(): void {
    const d = { 'entity_id': 'switch.plug_158d0001bc116c' };
      this.httpClient.post('http://192.168.2.123:8123/api/services/switch/turn_on?api_password=megachips',
      JSON.stringify(d)).subscribe(data => {
        console.log(`switch on`);
        this.GetSwtichState();
      });
  }
  fireSwitchOff(): void {
    const d = { 'entity_id': 'switch.plug_158d0001bc116c' };
      this.httpClient.post('http://192.168.2.123:8123/api/services/switch/turn_off?api_password=megachips',
      JSON.stringify(d)).subscribe(data => {
        console.log(`switch off`);
        this.GetSwtichState();
      });
  }
  ngOnInit() {
    this.GetSwtichState();
  }

}
