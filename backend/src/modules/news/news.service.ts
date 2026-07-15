import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from './schemas/news.schema';

@Injectable()
export class NewsService implements OnModuleInit {
  constructor(
    @InjectModel(News.name) private readonly model: Model<NewsDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.model.estimatedDocumentCount();
    if (count > 0) return;
    await this.seed();
  }

  async findAll(): Promise<NewsDocument[]> {
    return this.model.find().sort({ publishedAt: -1 }).exec();
  }

  async findOne(id: string): Promise<NewsDocument> {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException('Noticia no encontrada');
    return doc;
  }

  private async seed(): Promise<void> {
    const now = new Date();
    const day = 24 * 60 * 60 * 1000;

    const seeds = [
      {
        title: 'Advance Capital cierra el primer semestre con un rendimiento promedio de 13.8%',
        excerpt:
          'Nuestros instrumentos estructurados superaron el benchmark del mercado local, consolidando la confianza de más de 400 inversionistas.',
        category: 'empresa',
        image: '/img/analysis-charts.webp',
        author: 'Equipo de Inversiones',
        featured: true,
        offset: -2,
        body:
          'El primer semestre de 2026 cerró con resultados sólidos para la cartera de Advance Capital. ' +
          'Los pagarés estructurados y el fondo de factoring corporativo entregaron un rendimiento promedio ponderado de 13.8% anual, ' +
          'por encima de los principales índices de renta fija local. Este desempeño refleja la disciplina en la selección de activos ' +
          'y la gestión activa de riesgo que caracteriza a nuestra mesa de inversión.',
      },
      {
        title: 'Nuevo instrumento: Pagaré Estructurado Serie C con tasa preferencial',
        excerpt:
          'Disponible para inversionistas calificados a partir de S/ 50,000, con plazos de 12 a 36 meses y tasa de hasta 15%.',
        category: 'producto',
        image: '/img/hero-capital.webp',
        author: 'Advance Capital',
        featured: false,
        offset: -6,
        body:
          'Lanzamos la Serie C de nuestros pagarés estructurados, diseñada para inversionistas que buscan maximizar el rendimiento ' +
          'de su capital con horizontes de mediano plazo. La nueva serie ofrece una tasa preferencial de hasta 15% anual, ' +
          'respaldada por una cartera diversificada de operaciones de factoring y leasing con empresas de primer nivel. ' +
          'Consulta con tu asesor para conocer las condiciones de suscripción.',
      },
      {
        title: 'Perspectivas del mercado peruano para el segundo semestre 2026',
        excerpt:
          'Análisis de nuestro comité de inversiones sobre tasas, tipo de cambio y oportunidades en renta fija estructurada.',
        category: 'mercado',
        image: '/img/office-modern.webp',
        author: 'Comité de Inversiones',
        featured: false,
        offset: -10,
        body:
          'El escenario macroeconómico peruano muestra señales de estabilización. Con una inflación controlada y un tipo de cambio ' +
          'menos volátil, el segundo semestre presenta oportunidades atractivas en instrumentos de renta fija estructurada. ' +
          'Nuestro comité mantiene una postura constructiva sobre el factoring corporativo, donde la demanda de liquidez de las ' +
          'empresas sigue siendo elevada, generando spreads atractivos para el inversionista.',
      },
      {
        title: 'Guía: cómo diversificar tu portafolio con instrumentos estructurados',
        excerpt:
          'Cinco principios para equilibrar rendimiento y riesgo combinando factoring, leasing y capital estructurado.',
        category: 'educacion',
        image: '/img/executive-laptop.webp',
        author: 'Educación Financiera Advance',
        featured: false,
        offset: -18,
        body:
          'La diversificación es la piedra angular de una estrategia de inversión sólida. En esta guía repasamos cinco principios ' +
          'para construir un portafolio equilibrado: distribuir el capital entre distintos instrumentos, escalonar los plazos de ' +
          'vencimiento, considerar la moneda de denominación, revisar periódicamente la asignación y mantener liquidez para nuevas ' +
          'oportunidades. Combinar factoring, leasing y capital estructurado permite optimizar el binomio rendimiento-riesgo.',
      },
      {
        title: 'Advance Group inaugura nueva sede corporativa en San Isidro',
        excerpt:
          'Un espacio pensado para la atención personalizada de nuestros inversionistas y el crecimiento del equipo.',
        category: 'empresa',
        image: '/img/building-lobby.webp',
        author: 'Advance Group',
        featured: false,
        offset: -25,
        body:
          'Con gran satisfacción anunciamos la apertura de nuestra nueva sede corporativa en el corazón financiero de San Isidro. ' +
          'Estas instalaciones reflejan nuestro compromiso con el crecimiento sostenido y la atención de excelencia. ' +
          'Nuestros inversionistas contarán con espacios dedicados para reuniones de asesoría y seguimiento personalizado de sus portafolios.',
      },
      {
        title: 'Factoring: el motor silencioso de la liquidez empresarial en el Perú',
        excerpt:
          'Por qué el factoring se ha convertido en una de las clases de activo más resilientes para el inversionista local.',
        category: 'mercado',
        image: '/img/meeting-room.webp',
        author: 'Comité de Inversiones',
        featured: false,
        offset: -32,
        body:
          'El factoring ha demostrado ser una clase de activo notablemente resiliente. Al financiar cuentas por cobrar de corto plazo ' +
          'de empresas sólidas, ofrece rendimientos atractivos con una exposición al riesgo acotada y una alta rotación de capital. ' +
          'En un contexto de tasas cambiantes, su naturaleza de corto plazo permite reinvertir con rapidez, capturando las mejores ' +
          'condiciones del mercado en cada ciclo.',
      },
    ];

    const docs = seeds.map((s) => ({
      title: s.title,
      excerpt: s.excerpt,
      body: s.body,
      category: s.category,
      image: s.image,
      author: s.author,
      featured: s.featured,
      publishedAt: new Date(now.getTime() + s.offset * day),
    }));

    await this.model.insertMany(docs);
  }
}
