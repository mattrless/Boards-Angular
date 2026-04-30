import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListActions } from './list-actions';

describe('ListActions', () => {
  let component: ListActions;
  let fixture: ComponentFixture<ListActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListActions],
    }).compileComponents();

    fixture = TestBed.createComponent(ListActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
