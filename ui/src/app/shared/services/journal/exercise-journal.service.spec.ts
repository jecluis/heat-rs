import { TestBed } from "@angular/core/testing";

import { ExerciseJournalService } from "./exercise-journal.service";

describe("ExerciseJournalService", () => {
  let service: ExerciseJournalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseJournalService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
