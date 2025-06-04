import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {expect, jest} from '@jest/globals';
import {SessionService} from 'src/app/services/session.service';
import {SessionApiService} from '../../services/session-api.service';
import {FormComponent} from './form.component';
import {of} from "rxjs";
import {ActivatedRoute, convertToParamMap, Router} from "@angular/router";
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

class MockSnackBar { open() { return { onAction: () => of({}) }; } }
class MockRouter {
  get url(): string { return ''; }
  navigate(): Promise<boolean> { return new Promise<boolean>((resolve, _) => resolve(true)); }
}

describe('FormComponent IT', () => {
  
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionApiService: SessionApiService;
  let sessionService: SessionService;
  let matSnackBar: MatSnackBar;
  let router: Router;
  const mockSessionService = { sessionInformation: { id: 1 } }
  const mockSession = {
      name: 'test1',
      description: 'test1',
      date: new Date(),
      teacher_id: 1,
      users: [],
      createdAt: new Date()
    }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: SessionService, useValue: mockSessionService },
        { provide: MatSnackBar, useClass: MockSnackBar },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap( { id: '1'} ) } } },
        SessionApiService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    sessionApiService = TestBed.inject(SessionApiService);
    matSnackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should call submit', () => {
    component.onUpdate = false;
    const spySessionApiService = jest.spyOn(sessionApiService, 'create').mockReturnValue(of(mockSession));
    const spyMatSnackBar = jest.spyOn(matSnackBar, 'open');
    const spyRouter = jest.spyOn(router, 'navigate');
    component.sessionForm?.setValue({
      name: mockSession.name,
      date: mockSession.date,
      teacher_id: 1,
      description: mockSession.description
    })
    expect(component.sessionForm?.valid).toBeTruthy();
    component.submit();
    expect(spySessionApiService).toHaveBeenCalled();
    expect(spyMatSnackBar).toHaveBeenCalledWith('Session created !', 'Close', {duration: 3000});
    expect(spyRouter).toHaveBeenCalledWith(['sessions']);
  });
});
