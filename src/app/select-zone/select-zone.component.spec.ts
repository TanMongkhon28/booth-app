import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectZoneComponent } from './select-zone.component';

describe('SelectZoneComponent', () => {
  let component: SelectZoneComponent;
  let fixture: ComponentFixture<SelectZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectZoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
