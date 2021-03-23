import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HancockService {
  baseURL: string = "http://127.0.0.1:5000/api/";
  username : string ="catanie";
  passwd : string ="flyingpig";

  constructor(private httpClient: HttpClient) { }

  getPresignedURL(pid: string, hostfolder: string): Observable<string>{
    
    const params = new HttpParams()
           .set('pid', pid)
           .set('hostfolder', hostfolder);
    //window.alert(params.toString());
    return this.httpClient.get<string>(this.baseURL+'getURL', {params});
  }

  getToekn( ){
    
    const params = new HttpParams()
           .set('username', this.username)
           .set('password', this.passwd);
    //window.alert(params.toString());
    let body = {'username': this.username, 'password': this.passwd};
    alert(JSON.stringify(body));
    return this.httpClient.post('/api/token', JSON.stringify(body));
    //return this.httpClient.post('/api/token', {'username': 'catanie', 'password': 'flyingpig'});
  }

  async fetchData(pid: string, hostfolder: string) {
    const params = new HttpParams()
           .set('pid', pid)
           .set('hostfolder', hostfolder);
    return await this.httpClient.get(this.baseURL, {params}).toPromise();  
  }
}
