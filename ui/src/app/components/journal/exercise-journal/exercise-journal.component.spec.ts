import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ExerciseJournalComponent } from "./exercise-journal.component";

describe("ExerciseJournalComponent", () => {
  let component: ExerciseJournalComponent;
  let fixture: ComponentFixture<ExerciseJournalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExerciseJournalComponent],
    });
    fixture = TestBed.createComponent(ExerciseJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
