import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HancockService {
  #baseURL: string = "http://127.0.0.1:5000/api/";
  baseURL: string = "/api/";
  username : string ="catanie";
  passwd : string ="flyingpig";

  constructor(private httpClient: HttpClient) { }

  getPresignedURL(bucket: string, key: string, location : string, token: string): Observable<any> {
    const httpheader = new HttpHeaders().set("Authorization", "Bearer "+token).set("Content-Type", "application/json");

    //For fetch_url
    //const body : string = "{\"bucket\": \""+ bucket + "\"," + "\"key\": \"" +key + "\"," +"\"s3_account_name\":\"" +location +"\"}";

    //For fetch_url_from_source
    const body : string = "{\"creationLocation\":\"" +location +"\",\"sourceFolderHost\": \""+ bucket + "\"," + "\"sourceFolder\":\"" +key + "\"}";


    let options = {
      headers: httpheader
    };    
    return this.httpClient.post(this.baseURL+'fetch_url_from_source', body, options);
  }

  async getToekn( ) {
    let body = {"username": this.username, "password": this.passwd};

    return await this.httpClient.post(this.baseURL +'token', body).toPromise();
  }

  async fetchData(pid: string, hostfolder: string) {
    const params = new HttpParams()
           .set('pid', pid)
           .set('hostfolder', hostfolder);
    return await this.httpClient.get(this.baseURL, {params}).toPromise();  
  }
}
