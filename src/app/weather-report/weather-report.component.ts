import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather-report',
  templateUrl: './weather-report.component.html',
  styleUrls: ['./weather-report.component.css']
})
export class WeatherReportComponent implements OnInit, OnDestroy {

  public lat!: number;
  public lon!: number;
  public weather!: any;
  public icon: any;
  public subscription!: Subscription;
  public locationDeinedEnableCity: boolean = false;
  public loading!: boolean;
  public map!: google.maps.Map<Element>;
  public mapClickListener!: google.maps.MapsEventListener;
  public zone: any;

  constructor(private weatherService: WeatherService) { }

  // Walk around for mapClick event.
  // So users can click on the place on the map to review it's location
  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) => {
      this.lat = e.latLng.lat();
      this.lon = e.latLng.lng();
      this.subscription = this.weatherService.getWeatherDataByCoords(this.lat, this.lon).subscribe(data => {
        this.weather = data;
      })
      console.log(e.latLng.lat(), e.latLng.lng());
    });
  }

  public getCity(city: string): void {
    this.subscription = this.weatherService.getWeatherDataByCityName(city).subscribe((data: any) => {
      this.weather = data;
      this.lat = data.coord.lat;
      this.lon = data.coord.lon;
      this.icon = this.weatherService.getIcon(data);
      console.log(data);
    })
  }

  // Promt user to Allow App to access their location
  public getLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition((success) => {
        this.lat = success.coords.latitude;
        this.lon = success.coords.longitude;
        this.weatherService.getWeatherDataByCoords(this.lat, this.lon).subscribe(data => {
          this.weather = data;
          this.icon = this.weatherService.getIcon(this.weather);
        })
      }, (error) => {
        if (error.code == error.PERMISSION_DENIED) {
          this.locationDeinedEnableCity = true;
        }
      })
    }
  }
  
  ngOnInit(): void {
    this.getLocation();
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.mapClickListener) {
      this.mapClickListener.remove();
    }
  }

}
