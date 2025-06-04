import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { expect, jest } from '@jest/globals';
import { RegisterComponent } from './register.component';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterComponent IT', () => {

  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>
  let authService: AuthService;
  let router: Router;
  const registerFormDatas = {
    email: 'test1@gmail.com',
    firstName: 'test1',
    lastName: 'test1',
    password: 'test1test1'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        AuthService,
        { provide: Router, useValue: { navigate: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should call submit', () => {
    component.form.setValue(registerFormDatas);
    const spyAuthService = jest.spyOn(authService, 'register').mockReturnValue(of(void 0));
    const spyRouter = jest.spyOn(router, 'navigate');
    expect(component.form.valid).toBeTruthy();
    component.submit();
    expect(spyAuthService).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/login']);
  })

  it('should call submit with email already taken', () => {
    component.form.setValue({
      firstName: 'test2',
      lastName: 'test2',
      email: 'emailAlrdyTaken@gmail.com',
      password: 'test2test2'
    });
    const spyAuthService = jest.spyOn(authService, 'register').mockReturnValue(throwError(() => new Error('An error occurred')));
    component.submit();
    expect(spyAuthService).toHaveBeenCalled();
    expect(component.onError).toBeTruthy();
  })
});
