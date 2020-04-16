import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";

import {SliderModule} from "primeng/slider";

import { PrimeDashboardComponent} from "./prime-dashboard/prime-dashbaord.component";
import { VirtualScrollerModule } from "primeng/virtualscroller";
import { MultiSelectModule } from "primeng/multiselect";
import { NgxJsonViewerModule } from "ngx-json-viewer";

import { JobEffects } from "../state-management/effects/jobs.effects";
import { EffectsModule } from "@ngrx/effects";
import { CommonModule } from "@angular/common";
// import { JobsDetailComponent } from "./prime-detail/prime-detail.component";
import {
  MatCardModule,
  MatButtonToggleModule,
  MatIconModule
} from "@angular/material";
import { StoreModule } from "@ngrx/store";
import { jobsReducer } from "state-management/reducers/jobs.reducer";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedCatanieModule } from "shared/shared.module";




@NgModule({
  declarations: [ PrimeDashboardComponent],
  imports: [
    // BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    SliderModule,
    ReactiveFormsModule,
    TableModule,
    VirtualScrollerModule,
    MultiSelectModule,
    HttpClientModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    NgxJsonViewerModule,
    CommonModule,
    EffectsModule.forFeature([JobEffects]),
    FlexLayoutModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    SharedCatanieModule,
    StoreModule.forFeature("jobs", jobsReducer)
  ],
  exports: [ PrimeDashboardComponent]
})
export class PrimeModule {}
