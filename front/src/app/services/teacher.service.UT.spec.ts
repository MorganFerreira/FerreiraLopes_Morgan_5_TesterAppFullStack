import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { TeacherService } from './teacher.service';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { Teacher } from "../interfaces/teacher.interface";

describe('TeacherService UT', () => {

  let teacherService: TeacherService;
  let httpTestingController: HttpTestingController;
  const pathService = 'api/teacher';
  const mockIdTeacher: string = '1';
  const expectedTeachers: Teacher[] =
    [
      {
        id: 1,
        lastName: 'test1',
        firstName: 'test1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        lastName: 'test2',
        firstName: 'test2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    teacherService = TestBed.inject(TeacherService);
  });

  it('should be created', () => {
    expect(teacherService).toBeTruthy();
  });

  it('should get all teachers', () => {
    teacherService.all().subscribe(
      teachersReturned => expect(teachersReturned).toEqual(expectedTeachers)
    );
    const req = httpTestingController.expectOne(pathService);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedTeachers);
    httpTestingController.verify();
  });

  it('should get the details of a teacher by Id', () => {
    teacherService.detail(mockIdTeacher).subscribe(
      teachersReturned => expect(teachersReturned).toEqual(expectedTeachers[0])
    );
    const req = httpTestingController.expectOne(pathService + '/' + mockIdTeacher);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedTeachers[0]);
    httpTestingController.verify();
  });
});
