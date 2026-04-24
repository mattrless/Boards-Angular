import { ComponentFixture, TestBed } from '@angular/core/testing';

import BoardsPage from './boards-page';

describe('BoardsPage', () => {
  let component: BoardsPage;
  let fixture: ComponentFixture<BoardsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
