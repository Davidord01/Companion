/**
 * Componente Ventana Premium
 * Contenido exclusivo para usuarios autenticados
 */

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService, Usuario } from '../../services/auth.service';

interface ContenidoPremium {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'video' | 'imagen' | 'audio' | 'documento';
  url: string;
  fechaLanzamiento: Date;
  exclusivo: boolean;
}

@Component({
  selector: 'app-ventana-premium',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="premium-overlay" [class.visible]="mostrarVentana" (click)="cerrarVentana($event)">
      <div class="premium-container">
        <!-- Encabezado Premium -->
        <div class="premium-header">
          <div class="premium-badge">
            <span class="badge-icon">👑</span>
            <span class="badge-text">CONTENIDO PREMIUM</span>
          </div>
          <button class="btn-cerrar-premium" (click)="cerrarVentana()">
            ×
          </button>
        </div>

        <!-- Bienvenida personalizada -->
        <div class="welcome-section" *ngIf="usuario">
          <h2 class="welcome-title">
            ¡Bienvenido, {{ usuario.nombre }}!
          </h2>
          <p class="welcome-subtitle">
            Accede a contenido exclusivo de The Last of Us que solo los supervivientes registrados pueden ver.
          </p>
        </div>

        <!-- Navegación de contenido premium -->
        <div class="premium-nav">
          <button 
            class="nav-tab"
            [class.active]="seccionActiva === 'exclusivos'"
            (click)="cambiarSeccion('exclusivos')"
          >
            🎬 Videos Exclusivos
          </button>
          <button 
            class="nav-tab"
            [class.active]="seccionActiva === 'behind'"
            (click)="cambiarSeccion('behind')"
          >
            🎭 Behind the Scenes
          </button>
          <button 
            class="nav-tab"
            [class.active]="seccionActiva === 'conceptos'"
            (click)="cambiarSeccion('conceptos')"
          >
            🎨 Arte Conceptual
          </button>
          <button 
            class="nav-tab"
            [class.active]="seccionActiva === 'soundtrack'"
            (click)="cambiarSeccion('soundtrack')"
          >
            🎵 Soundtrack Exclusivo
          </button>
        </div>

        <!-- Contenido por secciones -->
        <div class="premium-content">
          
          <!-- Videos Exclusivos -->
          <div class="content-section" *ngIf="seccionActiva === 'exclusivos'">
            <h3 class="section-title">Videos Exclusivos</h3>
            <div class="content-grid">
              <div class="premium-item" *ngFor="let item of videosExclusivos">
                <div class="item-thumbnail">
                  <img [src]="item.url" [alt]="item.titulo">
                  <div class="play-overlay">
                    <span class="play-btn">▶️</span>
                  </div>
                  <div class="exclusive-badge">EXCLUSIVO</div>
                </div>
                <div class="item-info">
                  <h4>{{ item.titulo }}</h4>
                  <p>{{ item.descripcion }}</p>
                  <span class="release-date">{{ item.fechaLanzamiento | date:'dd/MM/yyyy' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Behind the Scenes -->
          <div class="content-section" *ngIf="seccionActiva === 'behind'">
            <h3 class="section-title">Behind the Scenes</h3>
            <div class="behind-content">
              <div class="behind-item">
                <img src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg" alt="Making of">
                <div class="behind-info">
                  <h4>El Proceso de Creación</h4>
                  <p>Descubre cómo se crearon las escenas más emotivas de la serie, desde la conceptualización hasta la grabación final.</p>
                  <button class="btn-premium">Ver Documental</button>
                </div>
              </div>
              <div class="behind-item">
                <img src="https://images.pexels.com/photos/7991580/pexels-photo-7991580.jpeg" alt="Actores">
                <div class="behind-info">
                  <h4>Entrevistas con el Reparto</h4>
                  <p>Conversaciones íntimas con los actores sobre sus personajes y las emociones que experimentaron durante el rodaje.</p>
                  <button class="btn-premium">Ver Entrevistas</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Arte Conceptual -->
          <div class="content-section" *ngIf="seccionActiva === 'conceptos'">
            <h3 class="section-title">Arte Conceptual Exclusivo</h3>
            <div class="art-gallery">
              <div class="art-item" *ngFor="let arte of arteConceptual">
                <img [src]="arte.url" [alt]="arte.titulo">
                <div class="art-overlay">
                  <h4>{{ arte.titulo }}</h4>
                  <p>{{ arte.descripcion }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Soundtrack Exclusivo -->
          <div class="content-section" *ngIf="seccionActiva === 'soundtrack'">
            <h3 class="section-title">Soundtrack Exclusivo</h3>
            <div class="music-player">
              <div class="track-list">
                <div class="track-item" *ngFor="let track of soundtrackExclusivo; let i = index">
                  <div class="track-info">
                    <span class="track-number">{{ i + 1 }}</span>
                    <div class="track-details">
                      <h4>{{ track.titulo }}</h4>
                      <p>{{ track.descripcion }}</p>
                    </div>
                  </div>
                  <button class="play-track-btn" (click)="reproducirTrack(track)">
                    <span *ngIf="trackActual?.id !== track.id">▶️</span>
                    <span *ngIf="trackActual?.id === track.id">⏸️</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estadísticas del usuario -->
        <div class="user-stats">
          <h4>Tu Progreso como Superviviente</h4>
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-icon">📅</span>
              <div class="stat-info">
                <span class="stat-value">{{ diasRegistrado }}</span>
                <span class="stat-label">Días como superviviente</span>
              </div>
            </div>
            <div class="stat-card">
              <span class="stat-icon">🎬</span>
              <div class="stat-info">
                <span class="stat-value">{{ contenidoVisto }}</span>
                <span class="stat-label">Contenido exclusivo visto</span>
              </div>
            </div>
            <div class="stat-card">
              <span class="stat-icon">🏆</span>
              <div class="stat-info">
                <span class="stat-value">{{ nivelSuperviviencia }}</span>
                <span class="stat-label">Nivel de supervivencia</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje especial -->
        <div class="special-message">
          <div class="message-icon">🧟‍♂️</div>
          <h4>Mensaje Especial</h4>
          <p>
            Como superviviente registrado, tienes acceso a este contenido que no está disponible para visitantes casuales. 
            ¡Disfruta de esta experiencia única en el mundo post-apocalíptico!
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .premium-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(10px);
      z-index: 5000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all var(--transicion-media);
      padding: var(--espaciado-sm);
    }

    .premium-overlay.visible {
      opacity: 1;
      visibility: visible;
    }

    .premium-container {
      background: linear-gradient(135deg, var(--color-fondo-medio), var(--color-fondo-oscuro));
      border-radius: 20px;
      width: 100%;
      max-width: 900px;
      max-height: 90vh;
      overflow-y: auto;
      border: 3px solid var(--color-acento);
      box-shadow: 0 0 50px rgba(255, 107, 53, 0.3);
      animation: premiumSlideIn 0.5s ease-out;
      position: relative;
    }

    .premium-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--espaciado-md);
      border-bottom: 2px solid var(--color-acento);
      background: linear-gradient(90deg, var(--color-acento), #ff8c69);
    }

    .premium-badge {
      display: flex;
      align-items: center;
      gap: var(--espaciado-xs);
      color: var(--color-texto-claro);
      font-family: var(--fuente-titulo);
      font-weight: 900;
    }

    .badge-icon {
      font-size: 1.5rem;
      animation: pulso 2s ease-in-out infinite;
    }

    .badge-text {
      font-size: 1.2rem;
      letter-spacing: 2px;
    }

    .btn-cerrar-premium {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid var(--color-texto-claro);
      border-radius: 50%;
      color: var(--color-texto-claro);
      font-size: 1.5rem;
      cursor: pointer;
      transition: all var(--transicion-rapida);
    }

    .btn-cerrar-premium:hover {
      background: var(--color-peligro);
      transform: scale(1.1);
    }

    .welcome-section {
      text-align: center;
      padding: var(--espaciado-lg) var(--espaciado-md);
      background: rgba(255, 107, 53, 0.1);
    }

    .welcome-title {
      color: var(--color-acento);
      font-size: 2rem;
      margin-bottom: var(--espaciado-sm);
      font-family: var(--fuente-titulo);
    }

    .welcome-subtitle {
      color: rgba(245, 245, 245, 0.9);
      font-size: 1.1rem;
      line-height: 1.6;
    }

    .premium-nav {
      display: flex;
      justify-content: center;
      gap: var(--espaciado-xs);
      padding: var(--espaciado-md);
      flex-wrap: wrap;
    }

    .nav-tab {
      padding: var(--espaciado-xs) var(--espaciado-sm);
      background: transparent;
      border: 2px solid var(--color-supervivencia);
      color: var(--color-supervivencia);
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transicion-media);
      white-space: nowrap;
    }

    .nav-tab:hover,
    .nav-tab.active {
      background: var(--color-supervivencia);
      color: var(--color-texto-claro);
      transform: translateY(-2px);
    }

    .premium-content {
      padding: var(--espaciado-md);
      min-height: 300px;
    }

    .section-title {
      color: var(--color-acento);
      font-family: var(--fuente-titulo);
      font-size: 1.5rem;
      margin-bottom: var(--espaciado-md);
      text-align: center;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--espaciado-md);
    }

    .premium-item {
      background: var(--color-fondo-oscuro);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--color-acento);
      transition: all var(--transicion-media);
    }

    .premium-item:hover {
      transform: translateY(-5px);
      box-shadow: var(--sombra-fuerte);
    }

    .item-thumbnail {
      position: relative;
      height: 150px;
      overflow: hidden;
    }

    .item-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .play-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity var(--transicion-media);
    }

    .premium-item:hover .play-overlay {
      opacity: 1;
    }

    .play-btn {
      font-size: 2rem;
      color: var(--color-acento);
    }

    .exclusive-badge {
      position: absolute;
      top: var(--espaciado-xs);
      right: var(--espaciado-xs);
      background: var(--color-acento);
      color: var(--color-texto-claro);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .item-info {
      padding: var(--espaciado-sm);
    }

    .item-info h4 {
      color: var(--color-texto-claro);
      margin-bottom: var(--espaciado-xs);
    }

    .item-info p {
      color: rgba(245, 245, 245, 0.8);
      font-size: 0.9rem;
      margin-bottom: var(--espaciado-xs);
    }

    .release-date {
      color: var(--color-acento);
      font-size: 0.8rem;
      font-weight: 600;
    }

    .behind-content {
      display: flex;
      flex-direction: column;
      gap: var(--espaciado-md);
    }

    .behind-item {
      display: flex;
      gap: var(--espaciado-md);
      background: var(--color-fondo-oscuro);
      border-radius: 12px;
      padding: var(--espaciado-md);
      border: 1px solid var(--color-supervivencia);
    }

    .behind-item img {
      width: 150px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
    }

    .behind-info {
      flex: 1;
    }

    .behind-info h4 {
      color: var(--color-texto-claro);
      margin-bottom: var(--espaciado-xs);
    }

    .behind-info p {
      color: rgba(245, 245, 245, 0.8);
      margin-bottom: var(--espaciado-sm);
    }

    .btn-premium {
      background: var(--color-supervivencia);
      color: var(--color-texto-claro);
      border: none;
      padding: var(--espaciado-xs) var(--espaciado-sm);
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transicion-rapida);
    }

    .btn-premium:hover {
      background: #6b8e23;
      transform: translateY(-2px);
    }

    .art-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--espaciado-sm);
    }

    .art-item {
      position: relative;
      height: 200px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
    }

    .art-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transicion-lenta);
    }

    .art-item:hover img {
      transform: scale(1.1);
    }

    .art-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
      padding: var(--espaciado-sm);
      color: var(--color-texto-claro);
      transform: translateY(100%);
      transition: transform var(--transicion-media);
    }

    .art-item:hover .art-overlay {
      transform: translateY(0);
    }

    .music-player {
      background: var(--color-fondo-oscuro);
      border-radius: 12px;
      padding: var(--espaciado-md);
      border: 1px solid var(--color-acento);
    }

    .track-list {
      display: flex;
      flex-direction: column;
      gap: var(--espaciado-sm);
    }

    .track-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--espaciado-sm);
      background: rgba(255, 107, 53, 0.1);
      border-radius: 8px;
      transition: all var(--transicion-rapida);
    }

    .track-item:hover {
      background: rgba(255, 107, 53, 0.2);
    }

    .track-info {
      display: flex;
      align-items: center;
      gap: var(--espaciado-sm);
      flex: 1;
    }

    .track-number {
      color: var(--color-acento);
      font-weight: 700;
      font-family: var(--fuente-titulo);
      min-width: 30px;
    }

    .track-details h4 {
      color: var(--color-texto-claro);
      margin-bottom: 2px;
    }

    .track-details p {
      color: rgba(245, 245, 245, 0.7);
      font-size: 0.9rem;
      margin: 0;
    }

    .play-track-btn {
      background: var(--color-acento);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transicion-rapida);
    }

    .play-track-btn:hover {
      background: #ff8c69;
      transform: scale(1.1);
    }

    .user-stats {
      margin: var(--espaciado-lg) var(--espaciado-md) var(--espaciado-md);
      padding: var(--espaciado-md);
      background: rgba(74, 93, 35, 0.1);
      border-radius: 12px;
      border: 1px solid var(--color-supervivencia);
    }

    .user-stats h4 {
      color: var(--color-supervivencia);
      text-align: center;
      margin-bottom: var(--espaciado-md);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--espaciado-sm);
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: var(--espaciado-sm);
      padding: var(--espaciado-sm);
      background: var(--color-fondo-oscuro);
      border-radius: 8px;
    }

    .stat-icon {
      font-size: 1.5rem;
    }

    .stat-value {
      display: block;
      color: var(--color-supervivencia);
      font-weight: 700;
      font-size: 1.2rem;
    }

    .stat-label {
      display: block;
      color: rgba(245, 245, 245, 0.7);
      font-size: 0.8rem;
    }

    .special-message {
      margin: var(--espaciado-md);
      padding: var(--espaciado-lg);
      background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(74, 93, 35, 0.1));
      border-radius: 12px;
      border: 2px solid var(--color-acento);
      text-align: center;
    }

    .message-icon {
      font-size: 3rem;
      margin-bottom: var(--espaciado-sm);
    }

    .special-message h4 {
      color: var(--color-acento);
      margin-bottom: var(--espaciado-sm);
    }

    .special-message p {
      color: rgba(245, 245, 245, 0.9);
      line-height: 1.6;
    }

    @keyframes premiumSlideIn {
      from {
        transform: scale(0.8) translateY(-50px);
        opacity: 0;
      }
      to {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .premium-container {
        max-width: 95vw;
        max-height: 95vh;
      }

      .premium-nav {
        flex-direction: column;
        align-items: center;
      }

      .nav-tab {
        width: 200px;
      }

      .behind-item {
        flex-direction: column;
        text-align: center;
      }

      .behind-item img {
        width: 100%;
        height: 150px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class VentanaPremiumComponent implements OnInit, OnDestroy, OnChanges {
  @Input() mostrarManualmente = false;
  @Output() cerrarVentana = new EventEmitter<void>();

  mostrarVentana = false;
  usuario: Usuario | null = null;
  seccionActiva = 'exclusivos';
  
  // Datos del usuario
  diasRegistrado = 0;
  contenidoVisto = 0;
  nivelSuperviviencia = 'Novato';
  
  // Contenido premium
  videosExclusivos: ContenidoPremium[] = [];
  arteConceptual: ContenidoPremium[] = [];
  soundtrackExclusivo: ContenidoPremium[] = [];
  trackActual: ContenidoPremium | null = null;
  
  private subscription?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.subscription = this.authService.autenticado$.subscribe(autenticado => {
      if (autenticado) {
        this.usuario = this.authService.usuarioActual;
        this.calcularEstadisticas();
        this.cargarContenidoPremium();
        
        // Solo mostrar automáticamente al registrarse, no al hacer login
        if (!this.mostrarManualmente) {
          setTimeout(() => {
            this.mostrarVentana = true;
            document.body.style.overflow = 'hidden';
          }, 1000);
        }
      } else {
        this.mostrarVentana = false;
        document.body.style.overflow = 'auto';
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mostrarManualmente'] && this.mostrarManualmente && this.authService.estaAutenticado) {
      this.mostrarVentana = true;
      document.body.style.overflow = 'hidden';
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    document.body.style.overflow = 'auto';
  }

  /**
   * Calcula las estadísticas del usuario
   */
  private calcularEstadisticas() {
    if (this.usuario) {
      const fechaRegistro = new Date(this.usuario.fechaRegistro);
      const ahora = new Date();
      this.diasRegistrado = Math.floor((ahora.getTime() - fechaRegistro.getTime()) / (1000 * 60 * 60 * 24));
      
      // Simular contenido visto y nivel
      this.contenidoVisto = Math.floor(Math.random() * 15) + 1;
      
      if (this.diasRegistrado < 7) {
        this.nivelSuperviviencia = 'Novato';
      } else if (this.diasRegistrado < 30) {
        this.nivelSuperviviencia = 'Superviviente';
      } else {
        this.nivelSuperviviencia = 'Veterano';
      }
    }
  }

  /**
   * Carga el contenido premium exclusivo
   */
  private cargarContenidoPremium() {
    this.videosExclusivos = [
      {
        id: 'video1',
        titulo: 'Escenas Eliminadas: El Pasado de Joel',
        descripcion: 'Secuencias nunca antes vistas que revelan más sobre el pasado de Joel Miller.',
        tipo: 'video',
        url: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
        fechaLanzamiento: new Date('2024-01-15'),
        exclusivo: true
      },
      {
        id: 'video2',
        titulo: 'Trailer Alternativo: La Venganza de Ellie',
        descripcion: 'Una versión alternativa del trailer oficial con escenas adicionales.',
        tipo: 'video',
        url: 'https://images.pexels.com/photos/7991580/pexels-photo-7991580.jpeg',
        fechaLanzamiento: new Date('2024-02-01'),
        exclusivo: true
      },
      {
        id: 'video3',
        titulo: 'Documental: La Creación de los Infectados',
        descripcion: 'Proceso completo de diseño y creación de los diferentes tipos de infectados.',
        tipo: 'video',
        url: 'https://images.pexels.com/photos/7991581/pexels-photo-7991581.jpeg',
        fechaLanzamiento: new Date('2024-02-15'),
        exclusivo: true
      }
    ];

    this.arteConceptual = [
      {
        id: 'art1',
        titulo: 'Jackson en Invierno - Concept Art',
        descripcion: 'Arte conceptual original de la comunidad de Jackson durante el invierno.',
        tipo: 'imagen',
        url: 'https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg',
        fechaLanzamiento: new Date('2024-01-01'),
        exclusivo: true
      },
      {
        id: 'art2',
        titulo: 'Diseños de Personajes - Abby Anderson',
        descripcion: 'Evolución del diseño del personaje de Abby desde los primeros bocetos.',
        tipo: 'imagen',
        url: 'https://images.pexels.com/photos/7991582/pexels-photo-7991582.jpeg',
        fechaLanzamiento: new Date('2024-01-10'),
        exclusivo: true
      },
      {
        id: 'art3',
        titulo: 'Seattle Post-Apocalíptico',
        descripcion: 'Visión artística de Seattle reclamada por la naturaleza.',
        tipo: 'imagen',
        url: 'https://images.pexels.com/photos/7991583/pexels-photo-7991583.jpeg',
        fechaLanzamiento: new Date('2024-01-20'),
        exclusivo: true
      }
    ];

    this.soundtrackExclusivo = [
      {
        id: 'track1',
        titulo: 'Ellie\'s Lament (Extended Version)',
        descripcion: 'Versión extendida de la emotiva pieza musical de Ellie.',
        tipo: 'audio',
        url: '#',
        fechaLanzamiento: new Date('2024-01-05'),
        exclusivo: true
      },
      {
        id: 'track2',
        titulo: 'The Last Dance (Unreleased)',
        descripcion: 'Tema musical inédito compuesto para una escena eliminada.',
        tipo: 'audio',
        url: '#',
        fechaLanzamiento: new Date('2024-01-12'),
        exclusivo: true
      },
      {
        id: 'track3',
        titulo: 'Infected Whispers (Ambient)',
        descripcion: 'Sonidos ambientales utilizados en las secuencias de terror.',
        tipo: 'audio',
        url: '#',
        fechaLanzamiento: new Date('2024-01-25'),
        exclusivo: true
      }
    ];
  }

  /**
   * Cambia la sección activa del contenido premium
   */
  cambiarSeccion(seccion: string) {
    this.seccionActiva = seccion;
  }

  /**
   * Reproduce un track de audio
   */
  reproducirTrack(track: ContenidoPremium) {
    if (this.trackActual?.id === track.id) {
      this.trackActual = null;
    } else {
      this.trackActual = track;
    }
  }

  /**
   * Cierra la ventana premium
   */
  cerrarVentanaPremium(event?: Event) {
    if (event && event.target !== event.currentTarget) {
      return;
    }
    
    this.mostrarVentana = false;
    document.body.style.overflow = 'auto';
    this.cerrarVentana.emit();
  }
}