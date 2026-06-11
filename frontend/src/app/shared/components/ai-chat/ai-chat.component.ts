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
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  ts: Date;
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
      const history = this.messages().map((m) => ({ role: m.role, content: m.content }));
      const { reply } = await firstValueFrom(
        this.api.post<{ reply: string }>('/chat', { messages: history }),
      );
      this.messages.update((m) => [...m, { role: 'assistant', content: reply, ts: new Date() }]);
    } catch {
      this.error.set('Error al conectar con el asistente. Inténtelo nuevamente.');
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
