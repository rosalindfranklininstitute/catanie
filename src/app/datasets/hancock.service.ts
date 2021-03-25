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

  getPresignedURL(bucket: string, key: string, token: string): Observable<any>{
    const httpheader = new HttpHeaders().set("Authorization", "Bearer "+token).set("Content-Type", "application/json");
    const body : string = "{\"Bucket\": \""+ bucket + "\", " + "\"Key\": \"" +key + "\"}";
    //const httpClient : HttpClient = new HttpClient().post("http://locahost:5000/api/fetch_url", body, header);
    //const header : HttpHeaders =new HttpHeaders().set('Authorization', 'Bearer '+token);
    let options = {
      //'Content-Type': 'application/json',
      headers: httpheader
    };    
    return this.httpClient.post(this.baseURL+'fetch_url', body, options);
  }

  getToekn( ) : Observable<any>{
    //let body = {'username': this.username, 'password': this.passwd};
    //return this.httpClient.post('/api/token', JSON.stringify(body));
    return this.httpClient.post(this.baseURL+'token', {'username': 'catanie', 'password': 'flyingpig'});
  }

  async fetchData(pid: string, hostfolder: string) {
    const params = new HttpParams()
           .set('pid', pid)
           .set('hostfolder', hostfolder);
    return await this.httpClient.get(this.baseURL, {params}).toPromise();  
  }
}
