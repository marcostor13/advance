import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

const MOCK_USER_DOC = {
  _id: { toString: () => 'user1' },
  email: 'test@example.com',
  password: 'hashedpw',
  role: 'client',
  name: 'Test User',
  phone: '999999999',
  toObject: () => ({
    _id: { toString: () => 'user1' },
    email: 'test@example.com',
    password: 'hashedpw',
    role: 'client',
    name: 'Test User',
    phone: '999999999',
  }),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceSpy: jest.Mocked<UsersService>;
  let jwtServiceSpy: jest.Mocked<JwtService>;

  beforeEach(async () => {
    usersServiceSpy = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    jwtServiceSpy = {
      sign: jest.fn().mockReturnValue('mock.jwt.token'),
    } as unknown as jest.Mocked<JwtService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: JwtService, useValue: jwtServiceSpy },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('throws ConflictException if email already registered', async () => {
      usersServiceSpy.findByEmail.mockResolvedValue(MOCK_USER_DOC as never);
      await expect(
        service.register({ name: 'A', email: 'test@example.com', phone: '999', password: 'pass' }),
      ).rejects.toThrow(ConflictException);
    });

    it('creates user with hashed password and returns token + user', async () => {
      usersServiceSpy.findByEmail.mockResolvedValue(null as never);
      usersServiceSpy.create.mockResolvedValue(MOCK_USER_DOC as never);

      const result = await service.register({
        name: 'Test User',
        email: 'test@example.com',
        phone: '999999999',
        password: 'plaintext',
      });

      expect(usersServiceSpy.create).toHaveBeenCalledTimes(1);
      const created = usersServiceSpy.create.mock.calls[0][0];
      expect(created.password).not.toBe('plaintext');
      expect(result.token).toBe('mock.jwt.token');
      expect(result.user).not.toHaveProperty('password');
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException when user not found', async () => {
      usersServiceSpy.findByEmail.mockResolvedValue(null as never);
      await expect(
        service.login({ email: 'no@example.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException on wrong password', async () => {
      usersServiceSpy.findByEmail.mockResolvedValue(MOCK_USER_DOC as never);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns token and sanitized user on valid credentials', async () => {
      usersServiceSpy.findByEmail.mockResolvedValue(MOCK_USER_DOC as never);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login({ email: 'test@example.com', password: 'correct' });

      expect(result.token).toBe('mock.jwt.token');
      expect(result.user).not.toHaveProperty('password');
    });
  });

  describe('me', () => {
    it('throws UnauthorizedException when user not found', async () => {
      usersServiceSpy.findById.mockResolvedValue(null as never);
      await expect(service.me('nonexistent')).rejects.toThrow(UnauthorizedException);
    });

    it('returns sanitized user without password', async () => {
      usersServiceSpy.findById.mockResolvedValue(MOCK_USER_DOC as never);
      const result = await service.me('user1');
      expect(result).not.toHaveProperty('password');
      expect(result['email']).toBe('test@example.com');
    });
  });
});
