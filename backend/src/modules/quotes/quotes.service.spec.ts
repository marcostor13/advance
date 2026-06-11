import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { QuotesService } from './quotes.service';
import { Quote } from './schemas/quote.schema';

const MOCK_RESULT = {
  _id: 'q1',
  user: 'user1',
  currency: 'PEN',
  amount: 100_000,
  termDays: 60,
  advancePct: 0.9,
  monthlyRate: 0.015,
  advanceAmount: 90_000,
  discount: 2_700,
  commission: 300,
  netDisbursement: 87_000,
  retention: 10_000,
  status: 'nueva',
};

const mockQuoteModel = {
  create: jest.fn().mockResolvedValue(MOCK_RESULT),
  find: jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([MOCK_RESULT]) }),
  }),
};

describe('QuotesService', () => {
  let service: QuotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotesService,
        { provide: getModelToken(Quote.name), useValue: mockQuoteModel },
      ],
    }).compile();

    service = module.get<QuotesService>(QuotesService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('calculates advance as 90% of amount', async () => {
      await service.create('user1', { currency: 'PEN', amount: 100_000, termDays: 60 });
      const call = mockQuoteModel.create.mock.calls[0][0];
      expect(call.advancePct).toBe(0.9);
      expect(call.advanceAmount).toBe(90_000);
    });

    it('applies correct monthly rate for 30 days (1.4%)', async () => {
      await service.create('user1', { currency: 'PEN', amount: 100_000, termDays: 30 });
      const call = mockQuoteModel.create.mock.calls[0][0];
      expect(call.monthlyRate).toBe(0.014);
    });

    it('applies correct monthly rate for 60 days (1.5%)', async () => {
      await service.create('user1', { currency: 'PEN', amount: 100_000, termDays: 60 });
      const call = mockQuoteModel.create.mock.calls[0][0];
      expect(call.monthlyRate).toBe(0.015);
    });

    it('applies correct monthly rate for 120 days (1.7%)', async () => {
      await service.create('user1', { currency: 'PEN', amount: 100_000, termDays: 120 });
      const call = mockQuoteModel.create.mock.calls[0][0];
      expect(call.monthlyRate).toBe(0.017);
    });

    it('calculates commission min 150 PEN for small amounts', async () => {
      await service.create('user1', { currency: 'PEN', amount: 10_000, termDays: 60 });
      const call = mockQuoteModel.create.mock.calls[0][0];
      expect(call.commission).toBe(150);
    });

    it('calculates commission min 50 USD', async () => {
      await service.create('user1', { currency: 'USD', amount: 5_000, termDays: 60 });
      const call = mockQuoteModel.create.mock.calls[0][0];
      expect(call.commission).toBe(50);
    });

    it('calculates commission as 0.3% when above minimum', async () => {
      await service.create('user1', { currency: 'PEN', amount: 1_000_000, termDays: 60 });
      const call = mockQuoteModel.create.mock.calls[0][0];
      expect(call.commission).toBe(3_000);
    });

    it('netDisbursement equals advanceAmount - discount - commission', async () => {
      await service.create('user1', { currency: 'PEN', amount: 100_000, termDays: 60 });
      const call = mockQuoteModel.create.mock.calls[0][0];
      expect(call.netDisbursement).toBeCloseTo(
        call.advanceAmount - call.discount - call.commission,
        2,
      );
    });

    it('retention equals amount minus advanceAmount', async () => {
      await service.create('user1', { currency: 'PEN', amount: 100_000, termDays: 60 });
      const call = mockQuoteModel.create.mock.calls[0][0];
      expect(call.retention).toBe(10_000);
    });

    it('returns created document', async () => {
      const result = await service.create('user1', { currency: 'PEN', amount: 100_000, termDays: 60 });
      expect(result).toEqual(MOCK_RESULT);
    });
  });

  describe('findByUser', () => {
    it('returns quotes for user sorted descending', async () => {
      const result = await service.findByUser('user1');
      expect(mockQuoteModel.find).toHaveBeenCalledWith({ user: 'user1' });
      expect(result).toEqual([MOCK_RESULT]);
    });
  });
});
