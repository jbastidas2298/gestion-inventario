/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LeyendaComponent } from './leyenda.component';

describe('LeyendaComponent', () => {
  let component: LeyendaComponent;
  let fixture: ComponentFixture<LeyendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeyendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeyendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
