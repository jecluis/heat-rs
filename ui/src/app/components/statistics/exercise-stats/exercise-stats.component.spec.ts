import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ExerciseStatsComponent } from "./exercise-stats.component";

describe("ExerciseStatsComponent", () => {
  let component: ExerciseStatsComponent;
  let fixture: ComponentFixture<ExerciseStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExerciseStatsComponent],
    });
    fixture = TestBed.createComponent(ExerciseStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
