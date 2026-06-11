import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ContactService } from './contact.service';
import { Contact } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';

const mockContactModel = {
  create: jest.fn(),
  find: jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({ exec: jest.fn() }),
  }),
};

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: getModelToken(Contact.name), useValue: mockContactModel },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a contact and return it', async () => {
      const dto: CreateContactDto = {
        name: 'Test User',
        email: 'test@example.com',
        company: 'ACME',
        message: 'This is a test message with enough length',
      };
      const created = { ...dto, _id: 'mockId', status: 'pending' };
      mockContactModel.create.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(mockContactModel.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return an array of contacts', async () => {
      const contacts = [{ name: 'A' }, { name: 'B' }];
      mockContactModel.find
        .mockReturnValue({
          sort: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(contacts) }),
        });

      const result = await service.findAll();
      expect(result).toEqual(contacts);
    });
  });
});
