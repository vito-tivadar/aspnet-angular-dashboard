import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, LoginWith2faRequest } from '../../models/auth.models';

describe('LoginComponent', () => {
  it('should send rememberMe in login request', () => {
    let lastRequest: LoginRequest | null = null;
    const authServiceMock = {
      login: (request: LoginRequest) => {
        lastRequest = request;
        return of({ token: '', expiration: '', requiresTwoFactor: false });
      },
    };
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.email.set('test@example.com');
    component.password.set('password');
    component.rememberMe.set(true);

    component.onSubmit();

    expect(lastRequest).toEqual({
      email: 'test@example.com',
      password: 'password',
      rememberMe: true,
    });
  });

  it('should show 2FA step when requiresTwoFactor is true', () => {
    const authServiceMock = {
      login: () => of({ token: '', expiration: '', requiresTwoFactor: true }),
    };
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.email.set('test@example.com');
    component.password.set('password');

    component.onSubmit();

    expect(component.requiresTwoFactor()).toBe(true);
  });

  it('should submit 2FA code via loginWith2fa', () => {
    let last2faRequest: LoginWith2faRequest | null = null;
    const authServiceMock = {
      login: () => of({ token: '', expiration: '', requiresTwoFactor: true }),
      loginWith2fa: (request: LoginWith2faRequest) => {
        last2faRequest = request;
        return of({ token: 'jwt', expiration: '', requiresTwoFactor: false });
      },
    };
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    component.onSubmit();
    component.twoFactorCode.set('123456');
    component.rememberMachine.set(true);
    component.onSubmit2fa();

    expect(last2faRequest).toEqual({
      twoFactorCode: '123456',
      rememberMachine: true,
    });
  });
});
