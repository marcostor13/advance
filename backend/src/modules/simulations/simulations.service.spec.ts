import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { Simulation } from './schemas/simulation.schema';

const mockSimulationModel = {
  create: jest.fn(),
  find: jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
  }),
};

describe('SimulationsService', () => {
  let service: SimulationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulationsService,
        { provide: getModelToken(Simulation.name), useValue: mockSimulationModel },
      ],
    }).compile();

    service = module.get<SimulationsService>(SimulationsService);
    mockSimulationModel.create.mockImplementation((data) => Promise.resolve(data));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create — annual rates by instrument and currency', () => {
    it('uses 8% annual rate for bono in USD', async () => {
      await service.create('u1', { instrument: 'bono', currency: 'USD', amount: 30_000, termMonths: 12, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      expect(call.annualRate).toBe(8);
    });

    it('uses 10% annual rate for bono in PEN', async () => {
      await service.create('u1', { instrument: 'bono', currency: 'PEN', amount: 100_000, termMonths: 12, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      expect(call.annualRate).toBe(10);
    });

    it('uses 8% annual rate for fondo in USD', async () => {
      await service.create('u1', { instrument: 'fondo', currency: 'USD', amount: 10_000, termMonths: 12, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      expect(call.annualRate).toBe(8);
    });

    it('uses 10% annual rate for fondo in PEN', async () => {
      await service.create('u1', { instrument: 'fondo', currency: 'PEN', amount: 30_000, termMonths: 12, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      expect(call.annualRate).toBe(10);
    });
  });

  describe('create — minimum amount validation', () => {
    it('rejects bono in USD below $30,000', async () => {
      await expect(
        service.create('u1', { instrument: 'bono', currency: 'USD', amount: 29_999, termMonths: 12, compound: false }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects bono in PEN below S/100,000', async () => {
      await expect(
        service.create('u1', { instrument: 'bono', currency: 'PEN', amount: 99_999, termMonths: 12, compound: false }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects fondo in USD below $10,000', async () => {
      await expect(
        service.create('u1', { instrument: 'fondo', currency: 'USD', amount: 9_999, termMonths: 12, compound: false }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects fondo in PEN below S/30,000', async () => {
      await expect(
        service.create('u1', { instrument: 'fondo', currency: 'PEN', amount: 29_999, termMonths: 12, compound: false }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('accepts amounts at exactly the minimum', async () => {
      await expect(
        service.create('u1', { instrument: 'fondo', currency: 'PEN', amount: 30_000, termMonths: 12, compound: false }),
      ).resolves.toBeDefined();
    });
  });

  describe('create — simple interest', () => {
    it('generates correct schedule length for 6 months', async () => {
      await service.create('u1', { instrument: 'bono', currency: 'USD', amount: 30_000, termMonths: 6, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      expect(call.schedule.length).toBe(6);
    });

    it('simple interest: month 1 balance is amount + one period interest', async () => {
      await service.create('u1', { instrument: 'bono', currency: 'USD', amount: 30_000, termMonths: 6, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      const monthlyRate = 8 / 100 / 12;
      expect(call.schedule[0].interest).toBeCloseTo(30_000 * monthlyRate, 2);
      expect(call.schedule[0].balance).toBeCloseTo(30_000 + 30_000 * monthlyRate, 2);
    });

    it('simple interest: every period has the same interest amount', async () => {
      await service.create('u1', { instrument: 'bono', currency: 'USD', amount: 30_000, termMonths: 6, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      const firstInterest = call.schedule[0].interest;
      for (const entry of call.schedule) {
        expect(entry.interest).toBeCloseTo(firstInterest, 4);
      }
    });

    it('simple interest: finalAmount equals amount + 12 periods of interest for 12 months', async () => {
      await service.create('u1', { instrument: 'bono', currency: 'PEN', amount: 100_000, termMonths: 12, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      const expected = 100_000 + 12 * (100_000 * (10 / 100 / 12));
      expect(call.finalAmount).toBeCloseTo(expected, 2);
    });

    it('simple interest: interestEarned equals finalAmount minus amount', async () => {
      await service.create('u1', { instrument: 'bono', currency: 'PEN', amount: 100_000, termMonths: 12, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      expect(call.interestEarned).toBeCloseTo(call.finalAmount - 100_000, 2);
    });
  });

  describe('create — compound interest', () => {
    it('compound interest: month 1 balance = amount * (1 + monthly_rate)^1', async () => {
      const amount = 30_000;
      await service.create('u1', { instrument: 'bono', currency: 'USD', amount, termMonths: 6, compound: true });
      const call = mockSimulationModel.create.mock.calls[0][0];
      const monthlyRate = 8 / 100 / 12;
      const expected = amount * Math.pow(1 + monthlyRate, 1);
      expect(call.schedule[0].balance).toBeCloseTo(expected, 2);
    });

    it('compound interest yields more than simple for 12 months', async () => {
      const amount = 100_000;
      await service.create('u1', { instrument: 'bono', currency: 'PEN', amount, termMonths: 12, compound: true });
      const compoundFinal = mockSimulationModel.create.mock.calls[0][0].finalAmount;

      jest.clearAllMocks();
      mockSimulationModel.create.mockImplementation((data) => Promise.resolve(data));

      await service.create('u1', { instrument: 'bono', currency: 'PEN', amount, termMonths: 12, compound: false });
      const simpleFinal = mockSimulationModel.create.mock.calls[0][0].finalAmount;

      expect(compoundFinal).toBeGreaterThan(simpleFinal);
    });

    it('compound: schedule has correct length', async () => {
      await service.create('u1', { instrument: 'fondo', currency: 'USD', amount: 10_000, termMonths: 24, compound: true });
      const call = mockSimulationModel.create.mock.calls[0][0];
      expect(call.schedule.length).toBe(24);
    });
  });

  describe('findByUser', () => {
    it('queries simulations by user and sorts descending', async () => {
      const result = await service.findByUser('user1');
      expect(mockSimulationModel.find).toHaveBeenCalledWith({ user: 'user1' });
      expect(result).toEqual([]);
    });
  });
});
