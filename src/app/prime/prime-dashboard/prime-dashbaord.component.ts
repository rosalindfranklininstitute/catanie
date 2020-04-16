import { Component, OnInit, Input } from "@angular/core";
import { DatasetService } from "./datasetservice";
import { LazyLoadEvent, SelectItem } from "primeng/api";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";

import { Store, select } from "@ngrx/store";
import { Job } from "shared/sdk";

import { Subscription } from "rxjs";
import {
  getJobs,
  getJobsCount,
  getJobsPerPage,
  getPage,
  getFilters,
} from "state-management/selectors/jobs.selectors";
import { DatePipe } from "@angular/common";
import {
  TableColumn,
  PageChangeEvent,
  SortChangeEvent,
} from "shared/modules/table/table.component";
import { JobViewMode } from "state-management/models";
import {
  changePageAction,
  setJobViewModeAction,
  fetchJobsAction,
  sortByColumnAction,
} from "state-management/actions/jobs.actions";
import {
  getCurrentUser,
  getProfile,
} from "state-management/selectors/user.selectors";
import * as rison from "rison";

@Component({
  selector: "app-prime-dashboard",
  providers: [DatasetService],
  templateUrl: "./prime-dashboard.component.html",
  animations: [
    trigger("rowExpansionTrigger", [
      state(
        "void",
        style({
          transform: "translateX(-10%)",
          opacity: 0,
        })
      ),
      state(
        "active",
        style({
          transform: "translateX(0)",
          opacity: 1,
        })
      ),
      transition("* <=> *", animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")),
    ]),
  ],
})
export class PrimeDashboardComponent implements OnInit {
  datasource: any[];

  datasets: any[];
  virtualData: any[];

  totalRecords: number;

  cols: any[];
  _selectedColumns: any[];
  exportColumns: any[];

  dstypes: SelectItem[];

  loading: boolean;

  sizeFilter: number;

  sizeTimeout: any;

  selectedData: any[];

  jobsCount$ = this.store.pipe(select(getJobsCount));
  jobsPerPage$ = this.store.pipe(select(getJobsPerPage));
  currentPage$ = this.store.pipe(select(getPage));

  constructor(
    private datasetService: DatasetService,
    private store: Store<Job>
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "emailJobInitiator", header: "initiator", width: "10%" },
      { field: "type", header: "type", width: "10%" },
      { field: "creationTime", header: "createdAt", width: "10%" },
      { field: "jobStatusMessage", header: "statusMessage", width: "10%" },
    ];
    this.dstypes = [
      { label: "Base", value: "base" },
      { label: "Raw", value: "raw" },
      { label: "Derived", value: "derived" },
    ];

    this._selectedColumns = this.cols;
    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
    this.loading = true;

    this.store.dispatch(fetchJobsAction());
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    // restore original order
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  loadDataOnScroll(event: LazyLoadEvent) {


    // console.log("loadDataOnSCroll:", event)
    this.loading = true;
    this.datasetService.getDatasets(event).subscribe((result) => {
      this.virtualData = result;
      this.loading = false;
      // console.log("Result getdataset:",result);
      this.datasetService.getCount(event.filters).subscribe((result) => {
        // console.log("Result getcount:",result)
        this.totalRecords = result["count"];
      });
    });
  }

  getCellData(row: any, col: any): any {
    // console.log("celldata:",row,col)
    const nestedProperties: string[] = col.field.split(".");
    let value: any = row;
    for (const prop of nestedProperties) {
      value = value[prop];
    }
    // console.log("value:",value)
    return value;
  }

  onSizeChange(event, dt) {
    if (this.sizeTimeout) {
      clearTimeout(this.sizeTimeout);
    }

    this.sizeTimeout = setTimeout(() => {
      dt.filter(event.value, "size", "gt");
    }, 250);
  }

  // for performance improvement
  trackByFunction = (index, item) => {
    // console.log("trackByFunction:",index,item)
    return item.pid; // O index
  };
}
