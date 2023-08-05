import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StatsLayoutComponent } from "./stats-layout.component";

describe("StatsLayoutComponent", () => {
  let component: StatsLayoutComponent;
  let fixture: ComponentFixture<StatsLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatsLayoutComponent],
    });
    fixture = TestBed.createComponent(StatsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
