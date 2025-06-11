/**
 * Componente de navegación principal
 * Maneja la navegación suave entre secciones y efectos de scroll
 */

import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="nav-container">
        <!-- Logo/Marca -->
        <div class="nav-brand">
          <a href="#inicio" (click)="scrollToSection('inicio', $event)">
            <span class="brand-icon">🧟</span>
            <span class="brand-text">TLOU 2 COMPANION</span>
          </a>
        </div>

        <!-- Menú de navegación -->
        <div class="nav-menu" [class.active]="isMenuOpen">
          <ul class="nav-links">
            <li><a href="#inicio" (click)="scrollToSection('inicio', $event)">Inicio</a></li>
            <li><a href="#personajes" (click)="scrollToSection('personajes', $event)">Personajes</a></li>
            <li><a href="#timeline" (click)="scrollToSection('timeline', $event)">Historia</a></li>
            <li><a href="#galeria" (click)="scrollToSection('galeria', $event)">Galería</a></li>
          </ul>
        </div>

        <!-- Botón del menú móvil -->
        <button 
          class="nav-toggle"
          [class.active]="isMenuOpen"
          (click)="toggleMenu()"
          aria-label="Alternar menú de navegación"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: var(--espaciado-sm) 0;
      background: rgba(26, 26, 26, 0.95);
      backdrop-filter: blur(10px);
      transition: all var(--transicion-media);
      border-bottom: 1px solid transparent;
    }

    .navbar.scrolled {
      background: rgba(26, 26, 26, 0.98);
      border-bottom-color: var(--color-acento);
      box-shadow: var(--sombra-media);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--espaciado-sm);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-brand a {
      display: flex;
      align-items: center;
      color: var(--color-texto-claro);
      text-decoration: none;
      font-family: var(--fuente-titulo);
      font-weight: 900;
      font-size: 1.5rem;
      transition: all var(--transicion-rapida);
    }

    .nav-brand a:hover {
      color: var(--color-acento);
      transform: scale(1.05);
    }

    .brand-icon {
      font-size: 2rem;
      margin-right: var(--espaciado-xs);
      animation: pulso 3s ease-in-out infinite;
    }

    .brand-text {
      letter-spacing: 2px;
    }

    .nav-menu {
      display: flex;
      align-items: center;
    }

    .nav-links {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: var(--espaciado-md);
    }

    .nav-links a {
      color: var(--color-texto-claro);
      text-decoration: none;
      font-weight: 500;
      font-size: 1rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: var(--espaciado-xs) var(--espaciado-sm);
      border-radius: 4px;
      transition: all var(--transicion-rapida);
      position: relative;
    }

    .nav-links a::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: var(--color-acento);
      transition: all var(--transicion-rapida);
      transform: translateX(-50%);
    }

    .nav-links a:hover {
      color: var(--color-acento);
      background: rgba(255, 107, 53, 0.1);
    }

    .nav-links a:hover::before {
      width: 100%;
    }

    .nav-toggle {
      display: none;
      flex-direction: column;
      justify-content: center;
      width: 30px;
      height: 30px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      gap: 4px;
    }

    .hamburger-line {
      width: 100%;
      height: 3px;
      background: var(--color-texto-claro);
      border-radius: 2px;
      transition: all var(--transicion-rapida);
      transform-origin: center;
    }

    .nav-toggle.active .hamburger-line:nth-child(1) {
      transform: rotate(45deg) translateY(7px);
      background: var(--color-acento);
    }

    .nav-toggle.active .hamburger-line:nth-child(2) {
      opacity: 0;
    }

    .nav-toggle.active .hamburger-line:nth-child(3) {
      transform: rotate(-45deg) translateY(-7px);
      background: var(--color-acento);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .nav-toggle {
        display: flex;
      }

      .nav-menu {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: rgba(26, 26, 26, 0.98);
        backdrop-filter: blur(10px);
        padding: var(--espaciado-md);
        transform: translateY(-100vh);
        transition: transform var(--transicion-media);
        border-bottom: 1px solid var(--color-acento);
      }

      .nav-menu.active {
        transform: translateY(0);
      }

      .nav-links {
        flex-direction: column;
        gap: var(--espaciado-sm);
        text-align: center;
      }

      .nav-links a {
        display: block;
        padding: var(--espaciado-sm);
        border: 1px solid transparent;
        border-radius: 8px;
      }

      .nav-links a:hover {
        border-color: var(--color-acento);
        background: rgba(255, 107, 53, 0.1);
      }
    }

    @media (max-width: 480px) {
      .brand-text {
        display: none;
      }

      .navbar {
        padding: var(--espaciado-xs) 0;
      }
    }
  `]
})
export class NavegacionComponent implements OnInit {
  isScrolled = false;
  isMenuOpen = false;

  ngOnInit() {
    // Inicializar estado de scroll
    this.checkScrollPosition();
  }

  /**
   * Escucha eventos de scroll para cambiar la apariencia de la navbar
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScrollPosition();
  }

  /**
   * Escucha clics fuera del menú para cerrarlo en móviles
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.nav-menu') && !target.closest('.nav-toggle')) {
      this.isMenuOpen = false;
    }
  }

  /**
   * Verifica la posición del scroll para aplicar estilos
   */
  private checkScrollPosition() {
    this.isScrolled = window.scrollY > 50;
  }

  /**
   * Alterna la visibilidad del menú móvil
   */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Maneja la navegación suave a secciones específicas
   * @param sectionId - ID de la sección objetivo
   * @param event - Evento del click
   */
  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();
    
    // Cerrar menú móvil si está abierto
    this.isMenuOpen = false;

    // Mapeo de IDs de sección a selectores
    const sectionMap: { [key: string]: string } = {
      'inicio': '.hero-section',
      'personajes': '.personajes-section',
      'timeline': '.timeline-section',
      'galeria': '.galeria-section'
    };

    const targetSelector = sectionMap[sectionId];
    if (targetSelector) {
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        const navbarHeight = 80; // Altura aproximada de la navbar
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  }
}