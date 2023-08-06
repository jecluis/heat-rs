import { TestBed } from "@angular/core/testing";

import { WeightJournalService } from "./weight-journal.service";

describe("WeightJournalService", () => {
  let service: WeightJournalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeightJournalService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
