import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from "@angular/router";
import { expect, jest } from '@jest/globals';
import { Observable, of, throwError } from "rxjs";
import { SessionService } from 'src/app/services/session.service';
import { SessionInformation } from "../../../../interfaces/sessionInformation.interface";
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent IT', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let sessionService: SessionService;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ],
      providers: [
        SessionService,
        AuthService,
        { provide: Router, useValue: { navigate: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should call submit', () => {
    component.form.setValue({ email: 'test1@gmail.com', password: 'test1test1' });
    const sessionInformation$: Observable<SessionInformation> = of({
      token: 'bearer token',
      type: 'jwt',
      id: 1,
      username: 'test1@gmail.com',
      firstName: 'test1',
      lastName: 'test1',
      admin: false,
    });
    const spyAuthService = jest.spyOn(authService, 'login').mockReturnValue(sessionInformation$);
    const spySessionService = jest.spyOn(sessionService, 'logIn').mockImplementation(() => { });
    const spyRouter = jest.spyOn(router, 'navigate');
    expect(component.form.valid).toBeTruthy();
    component.submit();
    expect(spyAuthService).toHaveBeenCalled();
    expect(spySessionService).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/sessions']);
  })

  it('should call submit with invalid email', () => {
    component.form.setValue({ email: 'invalidEmail@gmail.com', password: 'test1test1' });
    const spyAuthService = jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('An error occurred')));
    expect(component.form.valid).toBeTruthy();
    component.submit();
    expect(spyAuthService).toHaveBeenCalled();
    expect(component.onError).toBeTruthy();
  });
});
