import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiButton } from './ai-button';

describe('AiButton', () => {
  let component: AiButton;
  let fixture: ComponentFixture<AiButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiButton],
    }).compileComponents();

    fixture = TestBed.createComponent(AiButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
