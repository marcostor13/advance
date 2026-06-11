import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
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

  describe('create — annual rates', () => {
    it('uses 12% annual rate for factoring', async () => {
      await service.create('u1', { instrument: 'factoring', currency: 'PEN', amount: 100_000, termMonths: 12, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      expect(call.annualRate).toBe(0.12);
    });

    it('uses 10% annual rate for leasing', async () => {
      await service.create('u1', { instrument: 'leasing', currency: 'PEN', amount: 100_000, termMonths: 12, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      expect(call.annualRate).toBe(0.10);
    });

    it('uses 14% annual rate for capital_estructurado', async () => {
      await service.create('u1', { instrument: 'capital_estructurado', currency: 'PEN', amount: 100_000, termMonths: 12, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      expect(call.annualRate).toBe(0.14);
    });
  });

  describe('create — simple interest', () => {
    it('generates correct schedule length for 6 months', async () => {
      await service.create('u1', { instrument: 'factoring', currency: 'PEN', amount: 100_000, termMonths: 6, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      expect(call.schedule.length).toBe(6);
    });

    it('simple interest: month 1 balance is amount + one period interest', async () => {
      await service.create('u1', { instrument: 'factoring', currency: 'PEN', amount: 100_000, termMonths: 6, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      const monthlyRate = 0.12 / 12; // 0.01
      expect(call.schedule[0].interest).toBeCloseTo(100_000 * monthlyRate, 2);
      expect(call.schedule[0].balance).toBeCloseTo(100_000 + 100_000 * monthlyRate, 2);
    });

    it('simple interest: every period has the same interest amount', async () => {
      await service.create('u1', { instrument: 'factoring', currency: 'PEN', amount: 100_000, termMonths: 6, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      const firstInterest = call.schedule[0].interest;
      for (const entry of call.schedule) {
        expect(entry.interest).toBeCloseTo(firstInterest, 4);
      }
    });

    it('simple interest: finalAmount equals amount + 12 periods of interest for 12 months', async () => {
      await service.create('u1', { instrument: 'factoring', currency: 'PEN', amount: 100_000, termMonths: 12, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      const expected = 100_000 + 12 * (100_000 * 0.12 / 12);
      expect(call.finalAmount).toBeCloseTo(expected, 2);
    });

    it('simple interest: interestEarned equals finalAmount minus amount', async () => {
      await service.create('u1', { instrument: 'factoring', currency: 'PEN', amount: 100_000, termMonths: 12, compound: false });
      const call = mockSimulationModel.create.mock.calls[0][0];
      expect(call.interestEarned).toBeCloseTo(call.finalAmount - 100_000, 2);
    });
  });

  describe('create — compound interest', () => {
    it('compound interest: month 1 balance = amount * (1 + monthly_rate)^1', async () => {
      const amount = 100_000;
      await service.create('u1', { instrument: 'factoring', currency: 'PEN', amount, termMonths: 6, compound: true });
      const call = mockSimulationModel.create.mock.calls[0][0];
      const monthlyRate = 0.12 / 12;
      const expected = amount * Math.pow(1 + monthlyRate, 1);
      expect(call.schedule[0].balance).toBeCloseTo(expected, 2);
    });

    it('compound interest yields more than simple for 12 months', async () => {
      const amount = 100_000;
      await service.create('u1', { instrument: 'factoring', currency: 'PEN', amount, termMonths: 12, compound: true });
      const compoundFinal = mockSimulationModel.create.mock.calls[0][0].finalAmount;

      jest.clearAllMocks();
      mockSimulationModel.create.mockImplementation((data) => Promise.resolve(data));

      await service.create('u1', { instrument: 'factoring', currency: 'PEN', amount, termMonths: 12, compound: false });
      const simpleFinal = mockSimulationModel.create.mock.calls[0][0].finalAmount;

      expect(compoundFinal).toBeGreaterThan(simpleFinal);
    });

    it('compound: schedule has correct length', async () => {
      await service.create('u1', { instrument: 'leasing', currency: 'USD', amount: 50_000, termMonths: 24, compound: true });
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
