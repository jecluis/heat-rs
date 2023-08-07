import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LogExerciseModalComponent } from "./log-exercise-modal.component";

describe("LogExerciseModalComponent", () => {
  let component: LogExerciseModalComponent;
  let fixture: ComponentFixture<LogExerciseModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogExerciseModalComponent],
    });
    fixture = TestBed.createComponent(LogExerciseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
