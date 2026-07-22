import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ChatService, ChatResult } from './chat.service';
import { ChatRequestDto } from './dto/chat-request.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  chat(@Body() dto: ChatRequestDto): Promise<ChatResult> {
    return this.chatService.chat(dto);
  }
}
