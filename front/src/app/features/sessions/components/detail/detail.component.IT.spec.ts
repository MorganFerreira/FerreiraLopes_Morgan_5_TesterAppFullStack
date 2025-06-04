import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, jest } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';
import { DetailComponent } from './detail.component';
import { SessionApiService } from "../../services/session-api.service";
import { of } from "rxjs";
import { TeacherService } from "../../../../services/teacher.service";

describe('DetailComponent IT', () => {

  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: SessionApiService;
  let matSnackBar: MatSnackBar;
  const mockSessionService = { sessionInformation: { id: 1 } }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        SessionApiService,
        TeacherService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    sessionApiService = TestBed.inject(SessionApiService);
    matSnackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should delete a session', () => {
    const spySessionApiService = jest.spyOn(sessionApiService, 'delete').mockReturnValue(of({}));
    const spyMatSnackBar = jest.spyOn(matSnackBar, 'open');
    component.delete();
    expect(spySessionApiService).toHaveBeenCalled();
    expect(spyMatSnackBar).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
  })
});
