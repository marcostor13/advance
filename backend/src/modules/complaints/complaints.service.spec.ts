import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../mail/mail.service';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { Complaint } from './schemas/complaint.schema';

const mockComplaintModel = {
  create: jest.fn(),
  countDocuments: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

const mockMailService = {
  sendComplaintReceipt: jest.fn().mockResolvedValue(undefined),
  sendComplaintNotification: jest.fn().mockResolvedValue(undefined),
};

const dto: CreateComplaintDto = {
  fullName: 'Sandra Torres',
  documentType: 'DNI',
  documentNumber: '12345678',
  email: 'sandra@example.com',
  phone: '987654321',
  address: 'Av. El Derby 055',
  district: 'Santiago de Surco',
  province: 'Lima',
  department: 'Lima',
  itemType: 'servicio',
  itemDescription: 'Operación de factoring',
  claimType: 'reclamo',
  detail: 'El desembolso no se realizó en la fecha acordada.',
  request: 'Solicito el desembolso inmediato.',
};

function buildDoc(code: string) {
  const createdAt = new Date('2026-07-31T12:00:00Z');
  return {
    _id: { toString: () => 'mockId' },
    code,
    get: (key: string) => (key === 'createdAt' ? createdAt : undefined),
  };
}

describe('ComplaintsService', () => {
  let service: ComplaintsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplaintsService,
        { provide: getModelToken(Complaint.name), useValue: mockComplaintModel },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<ComplaintsService>(ComplaintsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('assigns a sequential code for the current year and returns the receipt', async () => {
      const year = new Date().getFullYear();
      mockComplaintModel.countDocuments.mockResolvedValue(4);
      mockComplaintModel.create.mockImplementation(
        ({ code }: { code: string }) => Promise.resolve(buildDoc(code)),
      );

      const result = await service.create(dto);

      expect(result.code).toBe(`LR-${year}-000005`);
      expect(result.id).toBe('mockId');
      expect(mockComplaintModel.create).toHaveBeenCalledWith({
        ...dto,
        code: `LR-${year}-000005`,
      });
    });

    it('retries with the next correlative when the code collides', async () => {
      const year = new Date().getFullYear();
      mockComplaintModel.countDocuments.mockResolvedValue(0);
      mockComplaintModel.create
        .mockRejectedValueOnce({ code: 11000 })
        .mockImplementation(({ code }: { code: string }) =>
          Promise.resolve(buildDoc(code)),
        );

      const result = await service.create(dto);

      expect(result.code).toBe(`LR-${year}-000002`);
      expect(mockComplaintModel.create).toHaveBeenCalledTimes(2);
    });

    it('sends the receipt to the consumer and the internal notification', async () => {
      mockComplaintModel.countDocuments.mockResolvedValue(0);
      mockComplaintModel.create.mockImplementation(
        ({ code }: { code: string }) => Promise.resolve(buildDoc(code)),
      );

      await service.create(dto);

      expect(mockMailService.sendComplaintReceipt).toHaveBeenCalledTimes(1);
      expect(mockMailService.sendComplaintNotification).toHaveBeenCalledTimes(1);
    });

    it('still registers the complaint when the mailer fails', async () => {
      mockComplaintModel.countDocuments.mockResolvedValue(0);
      mockComplaintModel.create.mockImplementation(
        ({ code }: { code: string }) => Promise.resolve(buildDoc(code)),
      );
      mockMailService.sendComplaintReceipt.mockRejectedValueOnce(
        new Error('SMTP down'),
      );

      await expect(service.create(dto)).resolves.toMatchObject({
        id: 'mockId',
      });
    });
  });

  describe('findAll', () => {
    it('filters by status when provided', async () => {
      const exec = jest.fn().mockResolvedValue([]);
      const sort = jest.fn().mockReturnValue({ exec });
      mockComplaintModel.find.mockReturnValue({ sort });

      await service.findAll('pendiente');

      expect(mockComplaintModel.find).toHaveBeenCalledWith({ status: 'pendiente' });
      expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    });
  });

  describe('findByCode', () => {
    it('normalizes the code before querying', async () => {
      const exec = jest.fn().mockResolvedValue({ code: 'LR-2026-000001' });
      mockComplaintModel.findOne.mockReturnValue({ exec });

      await service.findByCode(' lr-2026-000001 ');

      expect(mockComplaintModel.findOne).toHaveBeenCalledWith({
        code: 'LR-2026-000001',
      });
    });

    it('throws when the sheet does not exist', async () => {
      mockComplaintModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findByCode('LR-2026-999999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('stamps respondedAt when a response is recorded', async () => {
      mockComplaintModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'mockId' }),
      });

      await service.update('mockId', { status: 'atendido', response: 'Resuelto' });

      const [, patch] = mockComplaintModel.findByIdAndUpdate.mock.calls[0];
      expect(patch.$set.respondedAt).toBeInstanceOf(Date);
      expect(patch.$set.status).toBe('atendido');
    });

    it('throws when the sheet does not exist', async () => {
      mockComplaintModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update('missing', { status: 'atendido' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
