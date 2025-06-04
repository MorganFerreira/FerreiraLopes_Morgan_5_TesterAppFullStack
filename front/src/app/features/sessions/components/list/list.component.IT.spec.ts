import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect} from '@jest/globals';
import {SessionService} from 'src/app/services/session.service';
import {of} from "rxjs";
import {ListComponent} from './list.component';
import {Session} from '../../interfaces/session.interface';
import {SessionApiService} from '../../services/session-api.service';
import {SessionInformation} from 'src/app/interfaces/sessionInformation.interface';
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

class mockSessionApiService {
  all() {
    return of([
      {id: 1, name: 'Session test1', date: new Date(), description: 'Session test1'},
      {id: 2, name: 'Session test2', date: new Date(), description: 'Session test2'},
    ] as Session[]);
  }
}

describe('ListComponent IT', () => {
  
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let router: Router;
  const sessionInfos: SessionInformation = {
    username: '',
    firstName: '',
    lastName: '',
    id: 0,
    admin: true,
    token: '',
    type: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatIconModule,
        RouterTestingModule
      ],
      providers: [
        { provide: SessionService },
        { provide: SessionApiService, useClass: mockSessionApiService }
      ]
    }).compileComponents();

    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    sessionService.sessionInformation = sessionInfos;
    fixture.detectChanges();
  });

  it('should display sessions and buttons Create and Edit for Admin User', () => {
    sessionService.sessionInformation!.admin = true;
    fixture.detectChanges();
    // On veux 2 éléments item correspondant aux 2 sessions
    const sessionElements = fixture.nativeElement.querySelectorAll('.item');
    expect(sessionElements.length).toBe(2);
    // On veux le bouton create
    const createButton = fixture.nativeElement.querySelector('button[routerLink="create"]');
    expect(createButton).toBeTruthy();
    // On veux le bouton update
    const editButton = fixture.nativeElement.querySelector('[ng-reflect-router-link="update,1"]');
    expect(editButton).toBeTruthy();
  });

  it('should display sessions and not buttons Create and Edit for non Admin User', () => {
    sessionService.sessionInformation!.admin = false;
    fixture.detectChanges();
    // On ne veux pas le bouton create
    const createButton = fixture.nativeElement.querySelector('button[routerLink="create"]');
    expect(createButton).toBeFalsy();
    // On ne veux pas le bouton update
    const editButton = fixture.nativeElement.querySelector('[ng-reflect-router-link="update,1"]');
    expect(editButton).toBeFalsy();
  });
});
