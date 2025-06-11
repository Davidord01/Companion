/**
 * Componente Timeline
 * Muestra la cronología de eventos principales de The Last of Us 2
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineService, EventoTimeline } from '../../services/timeline.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="timeline-section">
      <div class="container">
        <!-- Encabezado de la sección -->
        <div class="section-header">
          <h2 class="section-title fade-in-up">Cronología de Eventos</h2>
          <p class="section-description fade-in-up">
            Revive los momentos más importantes de The Last of Us Temporada 2. 
            Desde la tranquila vida en Jackson hasta las decisiones que cambiarán todo para siempre.
          </p>
        </div>

        <!-- Filtros de timeline -->
        <div class="timeline-filters fade-in-up">
          <button 
            class="filter-btn"
            [class.active]="filtroActivo === 'todos'"
            (click)="filtrarEventos('todos')"
          >
            Todos los eventos
          </button>
          <button 
            class="filter-btn"
            [class.active]="filtroActivo === 'jackson'"
            (click)="filtrarEventos('jackson')"
          >
            Jackson
          </button>
          <button 
            class="filter-btn"
            [class.active]="filtroActivo === 'seattle'"
            (click)="filtrarEventos('seattle')"
          >
            Seattle
          </button>
          <button 
            class="filter-btn"
            [class.active]="filtroActivo === 'alta'"
            (click)="filtrarEventos('alta')"
          >
            Eventos clave
          </button>
        </div>

        <!-- Timeline principal -->
        <div class="timeline-container">
          <div class="timeline-line"></div>
          
          <div 
            class="timeline-item"
            *ngFor="let evento of eventosFiltrados; let i = index"
            [class.reverse]="i % 2 === 1"
            [style.animation]="'fadeInUp 0.6s ease-out forwards ' + (i * 0.2) + 's'"
          >
            <!-- Marcador del timeline -->
            <div class="timeline-marker" [attr.data-tipo]="evento.tipo">
              <div class="marker-icon">
                <span [innerHTML]="getIconoEvento(evento.tipo)"></span>
              </div>
            </div>

            <!-- Contenido del evento -->
            <div class="timeline-content">
              <div class="event-card">
                <!-- Imagen del evento -->
                <div class="event-image">
                  <img 
                    [src]="evento.imagen" 
                    [alt]="'Imagen del evento: ' + evento.titulo"
                    loading="lazy"
                  >
                  <div class="event-overlay">
                    <span class="event-date">{{ evento.fecha }}</span>
                    <span 
                      class="event-importance" 
                      [attr.data-importance]="evento.importancia"
                    >
                      {{ getImportanciaTexto(evento.importancia) }}
                    </span>
                  </div>
                </div>

                <!-- Información del evento -->
                <div class="event-info">
                  <h3 class="event-title">{{ evento.titulo }}</h3>
                  <p class="event-description">{{ evento.descripcion }}</p>
                  
                  <div class="event-details">
                    <div class="detail-item">
                      <span class="detail-icon">📍</span>
                      <span class="detail-text">{{ evento.localizacion }}</span>
                    </div>
                    
                    <div class="detail-item" *ngIf="evento.personajesInvolucrados.length > 0">
                      <span class="detail-icon">👥</span>
                      <span class="detail-text">
                        {{ evento.personajesInvolucrados.join(', ') }}
                      </span>
                    </div>
                  </div>

                  <!-- Etiqueta de tipo de evento -->
                  <div class="event-tags">
                    <span class="event-tag" [attr.data-tipo]="evento.tipo">
                      {{ getTipoTexto(evento.tipo) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje cuando no hay eventos -->
        <div class="no-events" *ngIf="eventosFiltrados.length === 0">
          <h3>No hay eventos para mostrar</h3>
          <p>Prueba con un filtro diferente para ver más eventos de la historia.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .timeline-section {
      padding: var(--espaciado-xl) 0;
      background: var(--color-fondo-oscuro);
      position: relative;
      overflow: hidden;
    }

    .timeline-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100px;
      background: linear-gradient(to bottom, var(--color-fondo-medio), transparent);
      opacity: 0.5;
    }

    .section-header {
      text-align: center;
      margin-bottom: var(--espaciado-lg);
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }

    .section-title {
      color: var(--color-texto-claro);
      margin-bottom: var(--espaciado-sm);
    }

    .section-description {
      color: rgba(245, 245, 245, 0.8);
      line-height: 1.7;
    }

    .timeline-filters {
      display: flex;
      justify-content: center;
      gap: var(--espaciado-sm);
      margin-bottom: var(--espaciado-xl);
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: var(--espaciado-xs) var(--espaciado-md);
      background: transparent;
      border: 2px solid var(--color-supervivencia);
      color: var(--color-supervivencia);
      border-radius: 25px;
      font-family: var(--fuente-titulo);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all var(--transicion-media);
      white-space: nowrap;
    }

    .filter-btn:hover,
    .filter-btn.active {
      background: var(--color-supervivencia);
      color: var(--color-texto-claro);
      transform: translateY(-2px);
      box-shadow: var(--sombra-media);
    }

    .timeline-container {
      position: relative;
      max-width: 1000px;
      margin: 0 auto;
      min-height: 500px; /* Altura mínima para asegurar que la línea sea visible */
    }

    .timeline-line {
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(to bottom, var(--color-acento), var(--color-supervivencia));
      transform: translateX(-50%);
      border-radius: 2px;
      min-height: 100%;
      height: 100%;
    }

    .timeline-item {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: var(--espaciado-xl);
      opacity: 1; /* Cambiado de 0 a 1 para asegurar visibilidad */
      transform: translateY(0); /* Cambiado para asegurar posición correcta */
    }

    .timeline-item.reverse {
      flex-direction: row-reverse;
    }

    .timeline-item.reverse .timeline-content {
      text-align: right;
    }

    .timeline-item.reverse .event-card {
      transform: perspective(1000px) rotateY(-5deg);
    }

    .timeline-marker {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
    }

    .marker-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: var(--color-texto-claro);
      border: 4px solid var(--color-acento);
      transition: all var(--transicion-media);
      position: relative;
    }

    .timeline-marker[data-tipo="jackson"] .marker-icon {
      background: linear-gradient(135deg, var(--color-supervivencia), #6b8e23);
    }

    .timeline-marker[data-tipo="seattle"] .marker-icon {
      background: linear-gradient(135deg, var(--color-peligro), #dc143c);
    }

    .timeline-marker[data-tipo="prologo"] .marker-icon {
      background: linear-gradient(135deg, var(--color-secundario), #a0522d);
    }

    .timeline-marker[data-tipo="epilogo"] .marker-icon {
      background: linear-gradient(135deg, var(--color-acento), #ff8c69);
    }

    .timeline-item:hover .marker-icon {
      transform: scale(1.2);
      box-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
    }

    .timeline-content {
      flex: 1;
      padding: 0 var(--espaciado-xl);
      max-width: 400px;
    }

    .event-card {
      background: var(--color-fondo-medio);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid transparent;
      transition: all var(--transicion-media);
      transform: perspective(1000px) rotateY(5deg);
      box-shadow: var(--sombra-media);
    }

    .event-card:hover {
      border-color: var(--color-acento);
      transform: perspective(1000px) rotateY(0deg) translateY(-5px);
      box-shadow: var(--sombra-fuerte);
    }

    .event-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .event-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transicion-lenta);
    }

    .event-card:hover .event-image img {
      transform: scale(1.1);
    }

    .event-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: var(--espaciado-sm);
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .event-date {
      background: var(--color-acento);
      color: var(--color-texto-claro);
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .event-importance {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .event-importance[data-importance="alta"] {
      background: rgba(178, 34, 34, 0.9);
      color: #FFB6C1;
    }

    .event-importance[data-importance="media"] {
      background: rgba(255, 107, 53, 0.9);
      color: var(--color-texto-claro);
    }

    .event-importance[data-importance="baja"] {
      background: rgba(74, 93, 35, 0.9);
      color: #90EE90;
    }

    .event-info {
      padding: var(--espaciado-md);
    }

    .event-title {
      color: var(--color-texto-claro);
      font-size: 1.3rem;
      margin-bottom: var(--espaciado-sm);
      font-family: var(--fuente-titulo);
    }

    .event-description {
      color: rgba(245, 245, 245, 0.8);
      line-height: 1.6;
      margin-bottom: var(--espaciado-sm);
    }

    .event-details {
      margin-bottom: var(--espaciado-sm);
    }

    .detail-item {
      display: flex;
      align-items: flex-start;
      gap: var(--espaciado-xs);
      margin-bottom: var(--espaciado-xs);
    }

    .detail-icon {
      font-size: 1rem;
      min-width: 20px;
    }

    .detail-text {
      color: rgba(245, 245, 245, 0.9);
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .event-tags {
      display: flex;
      justify-content: flex-start;
    }

    .timeline-item.reverse .event-tags {
      justify-content: flex-end;
    }

    .event-tag {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .event-tag[data-tipo="jackson"] {
      background: rgba(74, 93, 35, 0.2);
      color: var(--color-supervivencia);
      border: 1px solid var(--color-supervivencia);
    }

    .event-tag[data-tipo="seattle"] {
      background: rgba(178, 34, 34, 0.2);
      color: var(--color-peligro);
      border: 1px solid var(--color-peligro);
    }

    .event-tag[data-tipo="prologo"] {
      background: rgba(139, 69, 19, 0.2);
      color: var(--color-secundario);
      border: 1px solid var(--color-secundario);
    }

    .event-tag[data-tipo="epilogo"] {
      background: rgba(255, 107, 53, 0.2);
      color: var(--color-acento);
      border: 1px solid var(--color-acento);
    }

    .no-events {
      text-align: center;
      padding: var(--espaciado-xl);
      color: rgba(245, 245, 245, 0.6);
    }

    .no-events h3 {
      color: var(--color-acento);
      margin-bottom: var(--espaciado-sm);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .timeline-line {
        left: 30px;
      }

      .timeline-item,
      .timeline-item.reverse {
        flex-direction: row;
        text-align: left;
      }

      .timeline-marker {
        left: 30px;
      }

      .timeline-content {
        padding-left: 80px;
        padding-right: var(--espaciado-sm);
        max-width: none;
      }

      .event-card,
      .timeline-item.reverse .event-card {
        transform: none;
      }

      .timeline-filters {
        gap: var(--espaciado-xs);
      }

      .filter-btn {
        padding: var(--espaciado-xs) var(--espaciado-sm);
        font-size: 0.8rem;
      }
    }

    @media (max-width: 480px) {
      .timeline-filters {
        flex-direction: column;
        align-items: center;
      }

      .filter-btn {
        width: 200px;
      }

      .event-overlay {
        flex-direction: column;
        gap: var(--espaciado-xs);
        align-items: flex-start;
      }
    }
  `]
})
export class TimelineComponent implements OnInit {
  eventos: EventoTimeline[] = [];
  eventosFiltrados: EventoTimeline[] = [];
  filtroActivo: string = 'todos';

  constructor(private timelineService: TimelineService) {}

  ngOnInit() {
    this.cargarEventos();
  }

  /**
   * Carga la lista de eventos desde el servicio
   */
  private cargarEventos() {
    this.timelineService.obtenerEventos().subscribe(eventos => {
      this.eventos = eventos;
      this.eventosFiltrados = eventos;
    });
  }

  /**
   * Filtra eventos por tipo o importancia
   * @param filtro - Tipo de filtro a aplicar
   */
  filtrarEventos(filtro: string) {
    this.filtroActivo = filtro;
    
    if (filtro === 'todos') {
      this.eventosFiltrados = this.eventos;
    } else if (['jackson', 'seattle', 'prologo', 'epilogo'].includes(filtro)) {
      this.eventosFiltrados = this.eventos.filter(evento => evento.tipo === filtro);
    } else if (filtro === 'alta') {
      this.eventosFiltrados = this.eventos.filter(evento => evento.importancia === 'alta');
    }
  }

  /**
   * Obtiene el icono apropiado para cada tipo de evento
   * @param tipo - Tipo del evento
   * @returns Icono HTML del evento
   */
  getIconoEvento(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'jackson': '🏠',
      'seattle': '⚔️',
      'prologo': '🔬',
      'epilogo': '🌅'
    };
    return iconos[tipo] || '📅';
  }

  /**
   * Convierte el tipo de evento a texto legible
   * @param tipo - Tipo del evento
   * @returns Texto descriptivo del tipo
   */
  getTipoTexto(tipo: string): string {
    const tipos: { [key: string]: string } = {
      'jackson': 'Jackson',
      'seattle': 'Seattle',
      'prologo': 'Prólogo',
      'epilogo': 'Epílogo'
    };
    return tipos[tipo] || tipo;
  }

  /**
   * Convierte la importancia a texto legible
   * @param importancia - Nivel de importancia
   * @returns Texto descriptivo de la importancia
   */
  getImportanciaTexto(importancia: string): string {
    const importancias: { [key: string]: string } = {
      'alta': 'Evento Clave',
      'media': 'Importante',
      'baja': 'Secundario'
    };
    return importancias[importancia] || importancia;
  }
}