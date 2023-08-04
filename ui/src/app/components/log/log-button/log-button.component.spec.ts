import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LogButtonComponent } from "./log-button.component";

describe("LogButtonComponent", () => {
  let component: LogButtonComponent;
  let fixture: ComponentFixture<LogButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogButtonComponent],
    });
    fixture = TestBed.createComponent(LogButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
