import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LogWeightModalComponent } from "./log-weight-modal.component";

describe("LogWeightModalComponent", () => {
  let component: LogWeightModalComponent;
  let fixture: ComponentFixture<LogWeightModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogWeightModalComponent],
    });
    fixture = TestBed.createComponent(LogWeightModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
