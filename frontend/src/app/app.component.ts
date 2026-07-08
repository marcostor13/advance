import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CursorComponent } from './shared/components/cursor/cursor.component';
import { ScrollProgressComponent } from './shared/components/scroll-progress/scroll-progress.component';
import { AiChatComponent } from './shared/components/ai-chat/ai-chat.component';
import { IntroComponent } from './shared/components/intro/intro.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    CursorComponent,
    ScrollProgressComponent,
    AiChatComponent,
    IntroComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
