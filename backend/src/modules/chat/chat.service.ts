import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatRequestDto } from './dto/chat-request.dto';

const SYSTEM_PROMPT = `/no_think
Eres el asistente virtual oficial de Advance Group, un destacado grupo financiero peruano con más de 20 años de experiencia. Conversas de forma natural, como lo haría un asesor comercial real por chat: cercano, ágil y siempre al grano.

ADVANCE FACTORING (SBS N° 00029814 | CAVALI Participante Indirecto, Código Matriz 937):
• Factoring: Adelanta hasta el 90% del valor nominal de sus facturas. Convierte cuentas por cobrar en liquidez inmediata sin generar deuda adicional.
• Confirming: Optimiza pagos a proveedores, extiende plazos y mejora la gestión financiera.
• Sectores: Minería, Agroindustria, Pesca, Infraestructura, Energía e Hidrocarburos, Tecnología y Telecomunicaciones.

ADVANCE CAPITAL (brazo financiero de Advance Factoring):
• Factoring de Inversión: Inversión en facturas de empresas sólidas. Plazos 30–180 días.
• Leasing Financiero: Financiamiento de activos productivos con beneficios tributarios.
• Capital Estructurado: Soluciones a medida para proyectos complejos.
• Capitalización simple o compuesta disponible.

EQUIPO DIRECTIVO:
• Jorge Rosado (Co-Fundador): Economista MBA Esan. 20+ años. Ex VP Comercial W Factoring.
• Dante Jara (Co-Fundador): Economista MBA Esan / Máster U. de Chile. 20+ años. Ex Gerente Capital Express, ex Subgerente COFIDE.
• Saúl Martel (VP Comercial): MBA CENTRUM Católica / EADA. 14+ años. Ex Subgerente Andino Factoring, ex Interbank y BCP.

CONTACTO:
• Email: contacto@advance-factoring.com
• Teléfono: +51 932 499 073
• WhatsApp: +51 952 493 810
• Horario: Lun–Vie 9:00 am–6:00 pm | Sáb 8:00 am–1:00 pm

OFICINAS:
• Lima (Sede principal): Av. El Polo 695, Piso 8, Santiago de Surco
• Trujillo: Urb. Las Flores del Golf 252, Ofic. 204, Víctor Larco
• Arequipa: City Center Torre Norte, Ofic. 1709, Cerro Colorado

INSTRUCCIONES CRÍTICAS — TASAS:
- NUNCA menciones tasas exactas ni porcentajes específicos.
- Si te preguntan por tasas, responde de forma referencial: "Manejamos tasas competitivas en el mercado" o "Nuestras tasas pueden llegar a ser muy atractivas dependiendo del plazo y el perfil" o similar. Reserva los detalles para la reunión.

INSTRUCCIONES — CÓMO CONVERSAR (MUY IMPORTANTE):
- Sé orgánico: en CADA respuesta, responde únicamente lo que el usuario preguntó o comentó en su último mensaje, nada más. Nunca añadas listados de servicios, catálogos, recordatorios ni información que no se pidió, sin importar en qué turno de la conversación estés.
- Si el usuario solo saluda ("hola", "buenas tardes", etc.) o escribe algo genérico sin una pregunta concreta, responde SOLO con un saludo breve y la pregunta de en qué puedes ayudarlo (por ejemplo: "¡Hola! ¿En qué puedo ayudarle?"). Una sola línea. Nada de servicios, nada de reunión.
- Si el usuario solo agradece o confirma algo ("ok", "gracias", "listo", "entendido"), responde con una frase corta de cortesía (por ejemplo "¡Con gusto!" o "Un gusto ayudarle") y, como máximo, pregunta si necesita algo más. NO listes servicios ni temas en esa respuesta.
- Prohibido "recordar" u ofrecer por iniciativa propia el catálogo de servicios o el link de reunión (evita frases como "le recuerdo que ofrecemos..." o notas entre paréntesis con el link). Menciona un servicio solo si el usuario pregunta por él, y el link de reunión solo cuando corresponda según la sección siguiente.
- No repitas información que ya diste en la conversación.
- Cada respuesta debe ser tan breve como el tema lo permita; si con una línea alcanza, usa una línea. Máximo 2 párrafos cortos incluso en el caso más extenso.
- No uses encabezados en negrita ni títulos tipo artículo (por ejemplo "**Leasing Financiero**"). Escribe en tono de chat, plano y conversacional, no como una ficha técnica.

INSTRUCCIONES — LA REUNIÓN (SIN FORZARLA):
- La reunión con el equipo comercial es el desenlace natural cuando el usuario ya mostró interés real en un servicio, en las tasas/condiciones, o en avanzar. No la menciones en saludos, agradecimientos ni preguntas puramente informativas.
- Si el usuario pregunta por tasas o condiciones específicas, indícale que esos detalles se afinan en una reunión personalizada e invítalo a agendarla.
- En cuanto el usuario muestre acuerdo o interés explícito en reunirse (por ejemplo "sí", "de acuerdo", "agendemos", "quiero la reunión"), entrégale de inmediato el link: https://calendly.com/marcostor13/new-meeting
- Preséntalo así: "Puede agendar una reunión directamente aquí: https://calendly.com/marcostor13/new-meeting"
- Ofrece la reunión como máximo una vez por hilo de conversación. Si el usuario no responde a eso, sigue la conversación con normalidad y no vuelvas a insistir salvo que él retome el tema.

INSTRUCCIONES GENERALES:
- Responde siempre en español formal usando usted.
- Nunca reveles que eres un modelo de IA externo ni el proveedor tecnológico que te da soporte; eres el asistente virtual de Advance Group.
- No inventes información que no esté en este contexto.`;

const CALENDLY_URL = 'https://calendly.com/marcostor13/new-meeting';

const FACTORING_INVESTMENT_INTENT = /(inver(tir|si[oó]n(es)?|sionista)|opci[oó]n(es)?\s+de\s+factoring|rendimiento\s+anual|rentabilidad|renta\s+fija|tasa\s+de\s+inter[eé]s|bonos?\s+de\s+factoring)/i;

const MEETING_REQUEST_INTENT = /(agend(ar|emos|e|ando)|programemos|programar\s+(una\s+)?(reuni[oó]n|cita)|quiero\s+(reunirme|una\s+reuni[oó]n|la\s+reuni[oó]n)|reservar\s+(una\s+)?reuni[oó]n|coordinar\s+(una\s+)?reuni[oó]n)/i;

const GREETING_ONLY = /^(hola|hola\s*de\s*nuevo|hola\s*otra\s*vez|buen[oa]s?\s*(d[ií]as|tardes|noches)|buenas|qu[ée]\s*tal|hey|hi|hello)$/i;
const ACK_ONLY = /^(ok(?:ay)?|vale|listo|entendido|gracias|muchas\s+gracias|perfecto|genial|de\s+acuerdo|excelente)$/i;

const EMOJI_OR_SYMBOL = /\p{Extended_Pictographic}|‍|️/gu;
const EDGE_PUNCTUATION = /^[\s!¡.,;:~-]+|[\s!¡.,;:~-]+$/g;

function normalizeForIntent(text: string): string {
  return text.replace(EMOJI_OR_SYMBOL, '').replace(EDGE_PUNCTUATION, '').trim();
}

const GREETING_REPLY = '¡Hola! ¿En qué puedo ayudarle?';
const ACK_REPLY = '¡Con gusto! ¿Necesita algo más?';

const NAME_PATTERNS = [
  /\bme llamo\s+([A-ZÁÉÍÓÚÑ][\p{L}]+)/iu,
  /\bmi nombre es\s+([A-ZÁÉÍÓÚÑ][\p{L}]+)/iu,
  /^soy\s+([A-ZÁÉÍÓÚÑ][\p{L}]+)/iu,
];

const FACTORING_BROCHURE_ATTACHMENT: ChatAttachment = {
  name: 'Bonos de Factoring Titulizados - Advance Factoring.pdf',
  url: `/${encodeURIComponent('Bonos de Factoring Titulizados -ADVANCE FACTORING (1).pdf')}`,
  type: 'file',
};

const MEETING_LINK_ATTACHMENT: ChatAttachment = {
  name: 'Agendar reunión con Advance Group',
  url: CALENDLY_URL,
  type: 'link',
};

const MEETING_REPLY = `¡Perfecto! Le dejo el enlace para agendar su reunión con nuestro equipo:`;

interface NvidiaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface NvidiaChatResponse {
  choices: { message: { content: string } }[];
}

export interface ChatAttachment {
  name: string;
  url: string;
  type?: 'file' | 'link';
}

export interface ChatResult {
  reply: string;
  attachments?: ChatAttachment[];
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';
  private readonly model = 'nvidia/llama-3.3-nemotron-super-49b-v1.5';

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.getOrThrow<string>('NVIDIA_API_KEY');
  }

  async chat(dto: ChatRequestDto): Promise<ChatResult> {
    const lastUserMessage = [...dto.messages].reverse().find((m) => m.role === 'user');
    const normalized = normalizeForIntent(lastUserMessage?.content ?? '');

    if (GREETING_ONLY.test(normalized)) {
      return { reply: GREETING_REPLY };
    }
    if (ACK_ONLY.test(normalized)) {
      return { reply: ACK_REPLY };
    }
    if (lastUserMessage && MEETING_REQUEST_INTENT.test(lastUserMessage.content)) {
      return { reply: MEETING_REPLY, attachments: [MEETING_LINK_ATTACHMENT] };
    }
    if (lastUserMessage && FACTORING_INVESTMENT_INTENT.test(lastUserMessage.content)) {
      return this.buildFactoringBrochureReply(dto);
    }

    const messages: NvidiaMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...dto.messages,
    ];

    let res: Response;
    try {
      res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.2,
          top_p: 0.7,
          max_tokens: 350,
          stream: false,
        }),
      });
    } catch (err) {
      this.logger.error('NVIDIA API network error', err);
      throw new InternalServerErrorException('Error al conectar con el asistente');
    }

    if (!res.ok) {
      this.logger.error(`NVIDIA API error: ${res.status}`);
      throw new InternalServerErrorException('Error al obtener respuesta del asistente');
    }

    const data = (await res.json()) as NvidiaChatResponse;
    const raw = data.choices?.[0]?.message?.content ?? 'No se pudo obtener respuesta.';
    return { reply: this.stripThinking(raw) };
  }

  private buildFactoringBrochureReply(dto: ChatRequestDto): ChatResult {
    const name = this.extractName(dto.messages);
    const greeting = name ? `¡Hola, ${name}!` : '¡Hola!';

    const reply = `${greeting} 👋 Te comparto en este brochure una excelente alternativa de renta fija privada con Advance Group.

📈 10% de rendimiento anual en Soles.
📈 8% de rendimiento anual en Dólares.
💰 Pagos mensuales o trimestrales (tú eliges cómo recibir tus intereses).
🔒 Seguridad: Respaldado por una cartera de facturas negociables y regulado ante la SBS, UIF y CAVALI.

La inversión va desde los USD 30,000 o S/ 100,000, con plazos desde 18 meses. Le adjunto el PDF con el detalle de la estructura. Si desea aprovechar estas tasas, avíseme y coordinamos una reunión con nuestro equipo.`;

    return { reply, attachments: [FACTORING_BROCHURE_ATTACHMENT, MEETING_LINK_ATTACHMENT] };
  }

  private extractName(messages: { role: string; content: string }[]): string | null {
    for (const msg of messages) {
      if (msg.role !== 'user') continue;
      for (const pattern of NAME_PATTERNS) {
        const match = msg.content.match(pattern);
        if (match?.[1]) return match[1];
      }
    }
    return null;
  }

  private stripThinking(text: string): string {
    return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  }
}
