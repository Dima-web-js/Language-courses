import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPage } from './lesson-page';

describe('LessonPage', () => {
  let component: LessonPage;
  let fixture: ComponentFixture<LessonPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
