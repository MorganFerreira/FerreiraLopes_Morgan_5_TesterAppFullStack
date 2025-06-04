import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { MeComponent } from './me.component';
import { jest } from "@jest/globals";
import { of } from "rxjs";
import { User } from 'src/app/interfaces/user.interface';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

describe('MeComponent IT', () => {

  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;
  let matSnackBar: MatSnackBar;
  let sessionService: SessionService;
  let router: Router;
  const mockSessionService = { sessionInformation: { id: 1 }, logOut: jest.fn() }
  const mockUser: User = { id: 1 } as User;
  class MockSnackBar { open() { } }
  class MockRouter { navigate() { } }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        UserService,
        { provide: Router, useClass: MockRouter },
        { provide: SessionService, useValue: mockSessionService },
        { provide: MatSnackBar, useClass: MockSnackBar },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    sessionService = TestBed.inject(SessionService);
    matSnackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should init the component', () => {
    const spyUserServiceGetById = jest.spyOn(userService, 'getById').mockReturnValue(of(mockUser));
    component.ngOnInit();
    expect(spyUserServiceGetById).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser);
  });

  it('should delete a user', () => {
    const spyUserServiceDelete = jest.spyOn(userService, 'delete').mockReturnValue(of({}));
    const spyMatSnackBar = jest.spyOn(matSnackBar, 'open');
    const spySessionServiceLogout = jest.spyOn(sessionService, 'logOut');
    const spyRouter = jest.spyOn(router, 'navigate');
    component.delete();
    expect(spyUserServiceDelete).toHaveBeenCalled();
    expect(spyMatSnackBar).toHaveBeenCalledWith('Your account has been deleted !', 'Close', { duration: 3000 });
    expect(spySessionServiceLogout).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/']);
  })
});
