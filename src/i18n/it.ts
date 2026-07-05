import type { Translations } from './en'

const it: Translations = {
  nav: {
    home: 'Home',
    about: 'Chi Sono',
    experience: 'Esperienza',
    skills: 'Competenze',
    projects: 'Progetti',
    contact: 'Contatti',
  },
  hero: {
    badge: 'Disponibile per consulenza e progetti',
    name: 'Luca Pugliese',
    role: 'Ingegnere Embedded & Hardware Senior',
    cta: 'Vedi i progetti',
    contact: 'Contattami',
  },
  about: {
    title: 'Chi Sono',
    p1: 'Ingegnere embedded/hardware senior con esperienza approfondita in sviluppo firmware, progettazione PCB, reverse engineering e fabbricazione digitale. Lavoro a ogni livello dello stack: dal bare-metal C su STM32 alle toolchain Python, dai layout KiCad al CAD meccanico Fusion 360.',
    p2: 'I miei progetti spaziano dall\'automazione industriale (Modbus RTU, CAN bus, controllo VFD), all\'elettronica audio (amplificatori Classe AB, crossover attivi), reverse engineering (UEFI, estrazione firmware, analisi protocolli) e fabbricazione digitale (CNC, taglio laser, stampa 3D). Ogni livello — dal silicio al software — è nel mio campo.',
    quote: 'Se non riesci a risolverlo con un oscilloscopio e un debugger, non stai guardando abbastanza attentamente.',
  },
  experience: {
    title: 'Esperienza',
    desc: 'Due decenni di ingegneria hardware e software in sistemi embedded, progettazione PCB, reverse engineering e fabbricazione digitale.',
    items: [
      {
        role: 'Ingegnere Embedded/Hardware Senior',
        company: 'Consulente Indipendente',
        period: '2023 — Presente',
        tag: 'Full Stack HW/SW',
        description: 'Consulenza embedded full-stack: architettura firmware, progettazione PCB, reverse engineering e integrazione meccanica. Clienti spaziano dall\'automazione industriale all\'elettronica audio.',
        highlights: ['Firmware STM32/ESP32', 'PCB KiCad (2-4 strati)', 'Reverse engineering', 'CNC/Laser/3DP'],
      },
      {
        role: 'Ingegnere Sistemi Embedded',
        company: 'Progetti Automazione Industriale',
        period: '2021 — 2023',
        tag: 'Automazione',
        description: 'Progettazione di BSP Linux embedded, driver di dispositivo e stack di comunicazione per controllori industriali ARM. Implementazione di CAN bus, Modbus RTU e protocolli RS-485 personalizzati.',
        highlights: ['BSP Linux embedded', 'CAN bus / Modbus', 'Driver ARM', 'Circuiti di sicurezza'],
      },
      {
        role: 'Ingegnere Elettronico & Maker',
        company: 'Vari Progetti R&D',
        period: '2015 — Presente',
        tag: 'Design & Fab',
        description: 'R&D autodiretto in elettronica audio (amplificatori Classe AB/D, crossover attivi, DSP), fabbricazione digitale (conversione CNC, mod controller laser, ottimizzazione stampa 3D) e retrofit di macchinari industriali.',
        highlights: ['Amplificatori audio', 'Conversione CNC & VFD', 'Mod laser/3DP', 'Retrofit macchinari'],
      },
    ],
  },
  projects: {
    title: 'Progetti',
    desc: 'Una selezione di progetti che spaziano da firmware, reverse engineering, progettazione PCB, elettronica audio, fabbricazione digitale e automazione industriale.',
  },
  skills: {
    title: 'Competenze Tecniche',
    desc: 'Capacità di ingegneria full-stack: dal silicio al software, dallo schematico al pezzo lavorato.',
  },
  contact: {
    title: 'Contattami',
    desc: 'Aperto a consulenze, lavori su contratto o collaborazioni su sistemi embedded, progettazione hardware, reverse engineering e progetti correlati.',
    name: 'Il tuo nome',
    email: 'La tua email',
    subject: 'Oggetto',
    message: 'Il tuo messaggio',
    send: 'Invia Messaggio',
    connect: 'Collegati con me',
    connected: 'Disponibile per lavoro',
    connectedDesc: 'Attualmente accetto progetti di consulenza e contratto in sistemi embedded, progettazione PCB, sviluppo firmware e reverse engineering.',
  },
  footer: {
    description: 'Ingegnere embedded/hardware senior. Firmware, PCB, reverse engineering, CNC, laser, audio. Costruisco a ogni livello dal silicio al meccanico.',
    recentTitle: 'Articoli Recenti',
    menu: 'Menu',
    connect: 'Collegamenti',
    articles: [
      { title: 'Progettazione Bootloader per STM32', date: '15 Giu, 2025' },
      { title: 'Reverse Engineering di Protocolli CAN Bus', date: '28 Mag, 2025' },
      { title: 'Costruire un PCB Personalizzato in KiCad', date: '10 Mag, 2025' },
    ],
  },
  lang: {
    switch: 'ENG',
  },
}

export default it
