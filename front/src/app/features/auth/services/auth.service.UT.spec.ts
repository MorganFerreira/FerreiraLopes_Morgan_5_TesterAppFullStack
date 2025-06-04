import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { AuthService } from './auth.service';
import { RegisterRequest } from "../interfaces/registerRequest.interface";
import { LoginRequest } from "../interfaces/loginRequest.interface";
import { SessionInformation } from "../../../interfaces/sessionInformation.interface";

describe('AuthService UT', () => {

  let authService: AuthService;
  let httpTestingController: HttpTestingController;
  const pathService = 'api/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should register', () => {
    const mockRegisterRequest: RegisterRequest = {
      email: 'test1@gmail.com',
      firstName: 'test1',
      lastName: 'test1',
      password: 'test1test1'
    }
    authService.register(mockRegisterRequest).subscribe({ next: () => { } });
    const req = httpTestingController.expectOne(pathService + '/register');
    expect(req.request.method).toEqual('POST');
    req.flush({});
    httpTestingController.verify();
  });

  it('should login', () => {
    const mockLoginRequest: LoginRequest = {
      email: 'test2@gmail.com',
      password: 'test2test2'
    }
    const expectedSessionInfo: SessionInformation = {
      token: 'Bearer token',
      type: 'jwt',
      id: 1,
      username: 'test2@gmail.com',
      firstName: 'test2',
      lastName: 'test2',
      admin: false,
    };
    authService.login(mockLoginRequest).subscribe(
      sessionInfoReturned => expect(sessionInfoReturned).toEqual(expectedSessionInfo)
    );
    const req = httpTestingController.expectOne(pathService + '/login');
    expect(req.request.method).toEqual('POST');
    req.flush(expectedSessionInfo);
    httpTestingController.verify();
  });
});
