import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardGeneralSettings } from './board-general-settings';

describe('BoardGeneralSettings', () => {
  let component: BoardGeneralSettings;
  let fixture: ComponentFixture<BoardGeneralSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardGeneralSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardGeneralSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
