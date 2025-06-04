import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect} from '@jest/globals';
import {SessionService} from 'src/app/services/session.service';
import {ListComponent} from './list.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('ListComponent UT', () => {
  
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionService: SessionService;
  const mockSessionService = { sessionInformation: { id: 1, admin: true } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        HttpClientModule,
        MatCardModule,
        MatIconModule
      ],
      providers: [{provide: SessionService, useValue: mockSessionService}]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user information', () => {
    expect(component.user?.admin).toBe(true);
  });
});
