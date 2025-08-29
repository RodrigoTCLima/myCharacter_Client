import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpgSystemListComponent } from './rpg-system-list.component';

describe('RpgSystemListComponent', () => {
  let component: RpgSystemListComponent;
  let fixture: ComponentFixture<RpgSystemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpgSystemListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RpgSystemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
