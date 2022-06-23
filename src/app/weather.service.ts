import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private _url: string = environment._url;
  private _iconUrl = environment._iconUrl;
  private _apiKey: string = environment._weatherApiKey;

  constructor(private http: HttpClient) { }

  public getWeatherDataByCoords(lat: number, lon: number): Observable<object> {
    const params = new HttpParams()
      .set('lat', lat)
      .set('lon', lon)
      .set('units', 'imperial')
      .set('appid', this._apiKey);
    return this.http.get(this._url, { params });
  }

  public getWeatherDataByCityName(city: string): Observable<object> {
    const params = new HttpParams()
      .set('q', city)
      .set('units', 'imperial')
      .set('appid', this._apiKey);
    return this.http.get(this._url, { params });
  }

  public getIcon(icon: any): string {
    return `${this._iconUrl + icon.weather[0].icon}@2x.png`
  }
}
