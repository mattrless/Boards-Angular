import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateListItem } from './create-list-item';

describe('CreateListItem', () => {
  let component: CreateListItem;
  let fixture: ComponentFixture<CreateListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateListItem],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateListItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
