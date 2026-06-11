import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminLoginComponent } from './admin-login.component';
import { AuthService } from '../../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

describe('AdminLoginComponent', () => {
  let fixture: ComponentFixture<AdminLoginComponent>;
  let component: AdminLoginComponent;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login', 'logout'], {
      isAuthenticated: signal(false),
      isAdmin: signal(false),
    });

    await TestBed.configureTestingModule({
      imports: [AdminLoginComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('marks form touched when invalid on submit', () => {
    component.submit();
    expect(component.form.touched).toBeTrue();
  });

  it('sets error on login failure', () => {
    component.form.setValue({ email: 'a@b.com', password: '123456' });
    authSpy.login.and.returnValue(throwError(() => ({ message: 'Credenciales inválidas' })));
    component.submit();
    expect(component.error()).toBe('Credenciales inválidas');
  });

  it('sets error when non-admin logs in', () => {
    component.form.setValue({ email: 'a@b.com', password: '123456' });
    authSpy.login.and.returnValue(of({ token: 'tok', user: {} as never }));
    // isAdmin stays false
    component.submit();
    expect(component.error()).toBe('Acceso denegado. Solo administradores.');
  });
});
