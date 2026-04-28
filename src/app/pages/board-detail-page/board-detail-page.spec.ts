import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardDetailPage } from './board-detail-page';

describe('BoardDetailPage', () => {
  let component: BoardDetailPage;
  let fixture: ComponentFixture<BoardDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
