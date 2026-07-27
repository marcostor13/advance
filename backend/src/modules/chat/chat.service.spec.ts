import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat-request.dto';

function req(...contents: string[]): ChatRequestDto {
  return {
    messages: contents.map((content, i) => ({
      role: i % 2 === 0 ? ('user' as const) : ('assistant' as const),
      content,
    })),
  };
}

describe('ChatService', () => {
  let service: ChatService;
  const config = { getOrThrow: () => 'test-key' } as unknown as ConfigService;

  beforeEach(() => {
    service = new ChatService(config);
    global.fetch = jest.fn();
  });

  describe('meeting link', () => {
    it('opens the calendar when the user asks to schedule', async () => {
      const result = await service.chat(req('Quiero agendar una reunión'));
      expect(result.openMeetingLink).toBe(true);
      expect(result.attachments?.[0].type).toBe('link');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it.each([
      'coordinar una reunión con su equipo',
      'me gustaría una reunión',
      'programar una cita',
    ])('opens the calendar for: %s', async (text) => {
      const result = await service.chat(req(text));
      expect(result.openMeetingLink).toBe(true);
    });

    it.each([
      'No quiero agendar todavía',
      'Aún no deseo una reunión',
      'Más adelante coordinamos una reunión',
    ])('does not open the calendar when the meeting is declined: %s', async (text) => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'Entendido.' } }] }),
      });
      const result = await service.chat(req(text));
      expect(result.openMeetingLink).toBeUndefined();
    });

    it('does not open the calendar for the factoring investment brochure', async () => {
      const result = await service.chat(req('Me interesa invertir, ¿qué rentabilidad ofrecen?'));
      expect(result.openMeetingLink).toBeUndefined();
      expect(result.attachments?.every((a) => a.type !== 'link')).toBe(true);
    });

    it('does not open the calendar on greetings or acknowledgements', async () => {
      await expect(service.chat(req('Hola'))).resolves.toEqual({
        reply: '¡Hola! ¿En qué puedo ayudarle?',
      });
      await expect(service.chat(req('Gracias'))).resolves.toEqual({
        reply: '¡Con gusto! ¿Necesita algo más?',
      });
    });

    it('does not open the calendar on a generic question answered by the model', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ choices: [{ message: { content: '<think>x</think>Claro que sí.' } }] }),
      });
      const result = await service.chat(req('¿Qué es el confirming?'));
      expect(result).toEqual({ reply: 'Claro que sí.' });
    });
  });
});
