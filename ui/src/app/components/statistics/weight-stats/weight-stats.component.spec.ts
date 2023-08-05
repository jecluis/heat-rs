import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WeightStatsComponent } from "./weight-stats.component";

describe("WeightStatsComponent", () => {
  let component: WeightStatsComponent;
  let fixture: ComponentFixture<WeightStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeightStatsComponent],
    });
    fixture = TestBed.createComponent(WeightStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
