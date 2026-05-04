import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMembersDataTable } from './card-members-data-table';

describe('CardMembersDataTable', () => {
  let component: CardMembersDataTable;
  let fixture: ComponentFixture<CardMembersDataTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMembersDataTable],
    }).compileComponents();

    fixture = TestBed.createComponent(CardMembersDataTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
