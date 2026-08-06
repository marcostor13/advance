import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
  computed,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

/** Límites del ChatRequestDto del backend, con margen para el turno en curso. */
const MAX_HISTORY = 28;
const MAX_CONTENT = 2000;

function describeChatError(err: unknown): string {
  const status = err instanceof HttpErrorResponse ? err.status : -1;
  switch (status) {
    case 0:
      return 'No se pudo contactar al servidor (red o CORS). Inténtelo nuevamente.';
    case 400:
      return 'La conversación es demasiado larga. Recargue la página para empezar de nuevo.';
    case 503:
      return 'El asistente no está disponible en este momento. Inténtelo más tarde.';
    default:
      return `Error al conectar con el asistente (${status}). Inténtelo nuevamente.`;
  }
}

interface ChatAttachment {
  name: string;
  url: string;
  type?: 'file' | 'link';
}

interface ChatResponse {
  reply: string;
  attachments?: ChatAttachment[];
  openMeetingLink?: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  ts: Date;
  attachments?: ChatAttachment[];
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatComponent implements AfterViewChecked {
  private readonly api = inject(ApiService);

  @ViewChild('msgList') private msgList?: ElementRef<HTMLElement>;

  readonly isOpen = signal(false);
  readonly messages = signal<ChatMessage[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  inputText = '';

  private needsScroll = false;

  readonly hasNewMessage = computed(() => !this.isOpen() && this.messages().length > 1);

  private readonly welcome: ChatMessage = {
    role: 'assistant',
    content: 'Bienvenido a Advance Group. Soy su asistente virtual y estoy aquí para responder sus consultas sobre nuestros servicios financieros de factoring, leasing e inversión. ¿En qué puedo ayudarle?',
    ts: new Date(),
  };

  toggle(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen() && this.messages().length === 0) {
      this.messages.set([this.welcome]);
    }
  }

  close(): void {
    this.isOpen.set(false);
  }

  async send(): Promise<void> {
    const text = this.inputText.trim();
    if (!text || this.loading()) return;

    this.messages.update((m) => [...m, { role: 'user', content: text, ts: new Date() }]);
    this.inputText = '';
    this.loading.set(true);
    this.error.set('');
    this.needsScroll = true;

    try {
      // El backend valida ArrayMaxSize(30)/MaxLength(2000): recortar antes de enviar.
      const history = this.messages()
        .slice(-MAX_HISTORY)
        .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CONTENT) }));
      const { reply, attachments, openMeetingLink } = await firstValueFrom(
        this.api.post<ChatResponse>('/chat', { messages: history }),
      );
      this.messages.update((m) => [
        ...m,
        { role: 'assistant', content: reply, ts: new Date(), attachments },
      ]);

      // Solo se abre el calendario si el usuario pidió agendar; si no, queda como enlace en el chat.
      const meetingLink = attachments?.find((a) => a.type === 'link');
      if (openMeetingLink && meetingLink) {
        window.open(meetingLink.url, '_blank', 'noopener');
      }
    } catch (err) {
      this.error.set(describeChatError(err));
    } finally {
      this.loading.set(false);
      this.needsScroll = true;
    }
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }

  ngAfterViewChecked(): void {
    if (this.needsScroll && this.msgList) {
      const el = this.msgList.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.needsScroll = false;
    }
  }

  fmt(d: Date): string {
    return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }
}
