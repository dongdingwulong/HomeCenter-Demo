import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {

  date: Date;
  week: any;

  updateTime(): void {
    setInterval(() => {
      this.date = new Date();
      const weekArray = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
      this.week = ' ' + weekArray[this.date.getDay()];
      // console.log(this.date.getDay());
    }, 1000);
  }
  constructor() {
  }

  ngOnInit() {
    this.updateTime();
  }

}
