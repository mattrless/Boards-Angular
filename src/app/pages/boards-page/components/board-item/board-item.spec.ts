import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardItem } from './board-item';

describe('BoardItem', () => {
  let component: BoardItem;
  let fixture: ComponentFixture<BoardItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardItem],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
