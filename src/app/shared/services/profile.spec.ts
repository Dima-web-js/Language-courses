import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment.dev';
import { ProfileModel } from '../interfaces/profile.model';
import { Profile } from './profile.service';

describe('Profile service', () => {
  let service: Profile;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Profile],
    });

    service = TestBed.inject(Profile);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProfile should call correct URL', () => {
    const mockProfile: ProfileModel = {
      name: 'Name',
      email: 'a@b.com',
      role: 'student',
    };

    service.getProfile().subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/profile`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProfile);
  });
});
