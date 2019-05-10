import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherforecaseComponent } from './weatherforecase.component';

describe('WeatherforecaseComponent', () => {
  let component: WeatherforecaseComponent;
  let fixture: ComponentFixture<WeatherforecaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherforecaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherforecaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
