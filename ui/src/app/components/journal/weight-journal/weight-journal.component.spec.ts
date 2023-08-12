import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WeightJournalComponent } from "./weight-journal.component";

describe("WeightJournalComponent", () => {
  let component: WeightJournalComponent;
  let fixture: ComponentFixture<WeightJournalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeightJournalComponent],
    });
    fixture = TestBed.createComponent(WeightJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
