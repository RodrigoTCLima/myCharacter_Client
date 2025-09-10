import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpgSystemFormComponent } from './rpg-system-form.component';

describe('RpgSystemFormComponent', () => {
  let component: RpgSystemFormComponent;
  let fixture: ComponentFixture<RpgSystemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpgSystemFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RpgSystemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
