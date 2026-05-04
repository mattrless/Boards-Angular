import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveCardMemberButton } from './remove-card-member-button';

describe('RemoveCardMemberButton', () => {
  let component: RemoveCardMemberButton;
  let fixture: ComponentFixture<RemoveCardMemberButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveCardMemberButton],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveCardMemberButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
