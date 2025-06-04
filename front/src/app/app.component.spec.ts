import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect} from '@jest/globals';
import {AppComponent} from './app.component';
import {Observable, of} from "rxjs";
import {Router} from "@angular/router";
import {SessionService} from "./services/session.service";
import {SessionApiService} from "./features/sessions/services/session-api.service";

describe('AppComponent Test Suites', () => {
  
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [AppComponent],
      providers: [SessionApiService]
    }).compileComponents();

    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout', () => {
    const spySessionService = jest.spyOn(sessionService, 'logOut');
    const spyRouter = jest.spyOn(router, 'navigate');
    component.logout();
    expect(spySessionService).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['']);
  });

  it('should return the value of $isLogged method from sessionService', () => {
    const isLoggedValue = true;
    const spySessionService = jest.spyOn(sessionService, '$isLogged').mockReturnValue(of(isLoggedValue));
    const result: Observable<boolean> = component.$isLogged();
    result.subscribe((value) => {
      expect(value).toEqual(isLoggedValue);
    });
    expect(spySessionService).toHaveBeenCalled();
  });
});
