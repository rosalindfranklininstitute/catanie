import { TestBed, async } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { PrimeDashboardComponent } from "./prime-dashbaord.component";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";

describe("AppComponent", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientTestingModule,
                TableModule,
                DialogModule
            ],
            declarations: [
                PrimeDashboardComponent
            ],
        }).compileComponents();
    }));

    it("should create the app", async(() => {
        const fixture = TestBed.createComponent(PrimeDashboardComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
