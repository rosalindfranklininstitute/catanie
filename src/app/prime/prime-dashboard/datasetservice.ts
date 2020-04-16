import { Injectable } from "@angular/core";
import { HttpParams, HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { LazyLoadEvent } from "primeng/api";
/* 
export interface LazyLoadEvent {
    first?: number;
    rows?: number;
    sortField?: string;
    sortOrder?: number;
    multiSortMeta?: SortMeta[];
    filters?: {
        [s: string]: FilterMetadata;
    };
    globalFilter?: any;
} */

@Injectable()
export class DatasetService {
  constructor(private http: HttpClient) {}

  createWhereCondition(f: any): any {
    var where = {};
    var matchMode = f["matchMode"];
    if (matchMode === "contains") {
      where = { like: f["value"] };
    } else if (matchMode === "in") {
      where = { in: f["value"] };
    } else if (matchMode === "gt") {
      where = { gt: f["value"] };
    }
    return where;
  }

  getDatasets = (event: LazyLoadEvent): Observable<any[]> => {
    const url = "http://127.0.0.1:3000/api/v3/Datasets";
    var filter = { limit: event.rows, skip: event.first };
    // console.log("getDatasets, Lazyload event:", event)
    var limits = { skip: event.first, limit: event.rows };
    if (event.sortField) {
      filter["order"] =
        event.sortField + (event.sortOrder < 0 ? " DESC" : " ASC");
    }

    /*      
                Available match modes are "startsWith", "contains", "endsWith", "equals", "notEquals", "in", "lt", "lte", "gt" and "gte".
                filter types: 
                  startsWith,
                  contains (Name, SourceFolder)
                  lte,gte (integer) (Size)
                  lte,gte (Date) (Starttime)
                  in (Array of strings, single and multiselect) (Type, proposal,owner,status)
                 */
    if (event.filters && Object.keys(event.filters).length !== 0) {
      // console.log("event filters,this:", event.filters,this)
      filter["where"] = { and: [] };
      // important: use arrow function syntax, otherwise this is not defined
      Object.keys(event.filters).forEach((key, index) => {
        // console.log("key,this:", key,this)
        var where = {};
        where[key] = this.createWhereCondition(event.filters[key]);
        filter["where"]["and"].push(where);
      });
    }
    // console.log("Filter:", filter)
    // Dataset syntax
    // {"limit":3,"skip":11,"where":{"ownerGroup":"p16633"},"order":"size ASC"}
    const params = new HttpParams()
      .set("filter", JSON.stringify(filter))
      .append(
        "access_token",
        "paJLrsBp6j3N89ZRBUPmJqBoHuWYlBxHAmUfc8V4mb3CJHmYVEOK846ifGzVbxcF"
      );
    return this.http.get<any[]>(url, { params: params });
  };

  getCount = (filters: any): Observable<any[]> => {
    // console.log("getCount, filters:", filters)
    var where = {};
    if (filters) {
      // TOD add all filter match modes as above also to count call
      Object.keys(filters).forEach((key, index) => {
        where[key] = this.createWhereCondition(filters[key]);
      });
    }
    const url = "http://127.0.0.1:3000/api/v3/Datasets/count";
    const params = new HttpParams()
      .set("where", JSON.stringify(where))
      .append(
        "access_token",
        "paJLrsBp6j3N89ZRBUPmJqBoHuWYlBxHAmUfc8V4mb3CJHmYVEOK846ifGzVbxcF"
      );

    return this.http.get<any[]>(url, { params: params });
  };
}
