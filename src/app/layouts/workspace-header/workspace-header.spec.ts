import { ComponentFixture, TestBed } from '@angular/core/testing';

import WorkspaceHeader from './workspace-header';

describe('WorkspaceHeader', () => {
  let component: WorkspaceHeader;
  let fixture: ComponentFixture<WorkspaceHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
