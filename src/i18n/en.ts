const en = {
  nav: {
    home: 'Home',
    about: 'About',
    experience: 'Experience',
    skills: 'Skills',
    projects: 'Projects',
    contact: 'Contact',
  },
  hero: {
    badge: 'Open for consulting & contract work',
    name: 'Luca Pugliese',
    role: 'Senior Embedded & Hardware Engineer',
    cta: 'View My Work',
    contact: 'Get In Touch',
  },
  about: {
    title: 'About Me',
    p1: "Senior embedded/hardware engineer with deep experience across firmware development, PCB design, reverse engineering, and digital fabrication. I work at every layer of the stack: from bare-metal C on STM32 to Python toolchains, from KiCad layouts to Fusion 360 mechanical CAD.",
    p2: "My projects span industrial automation (Modbus RTU, CAN bus, VFD control), audio electronics (Class AB amplifiers, active crossovers), reverse engineering (UEFI, firmware extraction, protocol analysis), and digital fabrication (CNC, laser cutting, 3D printing). Every layer — silicon to software — is fair game.",
    quote: 'If you can\'t fix it with a scope and a debugger, you\'re not looking hard enough.',
  },
  experience: {
    title: 'Experience',
    desc: 'Two decades of hardware and software engineering across embedded systems, PCB design, reverse engineering, and digital fabrication.',
    items: [
      {
        role: 'Senior Embedded / Hardware Engineer',
        company: 'Independent Consultant',
        period: '2023 — Present',
        tag: 'Full Stack HW/SW',
        description: 'Full-stack embedded consulting: firmware architecture, PCB design, reverse engineering, and mechanical integration. Clients range from industrial automation to audio electronics.',
        highlights: ['STM32/ESP32 firmware', 'KiCad PCB (2-4 layer)', 'Reverse engineering', 'CNC/Laser/3DP design'],
      },
      {
        role: 'Embedded Systems Engineer',
        company: 'Industrial Automation Projects',
        period: '2021 — 2023',
        tag: 'Automation',
        description: 'Designed embedded Linux BSPs, device drivers, and communication stacks for ARM-based industrial controllers. Implemented CAN bus, Modbus RTU, and custom RS-485 protocols.',
        highlights: ['Embedded Linux BSP', 'CAN bus / Modbus', 'ARM device drivers', 'Safety circuits'],
      },
      {
        role: 'Electronics Engineer & Maker',
        company: 'Various R&D Projects',
        period: '2015 — Present',
        tag: 'Design & Fab',
        description: 'Self-directed R&D in audio electronics (Class AB/D amplifiers, active crossovers, DSP), digital fabrication (CNC conversion, laser controller mods, 3D printer optimization), and industrial machinery retrofits.',
        highlights: ['Audio amplifier design', 'CNC conversion & VFD', 'Laser/3DP mods', 'Machine retrofits'],
      },
    ],
  },
  projects: {
    title: 'Projects',
    desc: 'A selection of projects spanning firmware, reverse engineering, PCB design, audio electronics, digital fabrication, and industrial automation.',
  },
  skills: {
    title: 'Technical Expertise',
    desc: 'Full-stack engineering capabilities: from silicon to software, from schematic to machined part.',
  },
  contact: {
    title: 'Get In Touch',
    desc: 'Open for consulting, contract work, or collaboration on embedded systems, hardware design, reverse engineering, and related projects.',
    name: 'Your Name',
    email: 'Your Email',
    subject: 'Subject',
    message: 'Your Message',
    send: 'Send Message',
    connect: 'Connect With Me',
    connected: 'Available for work',
    connectedDesc: 'Currently accepting consulting and contract projects in embedded systems, PCB design, firmware development, and reverse engineering.',
  },
  footer: {
    description: 'Senior embedded/hardware engineer. Firmware, PCB, reverse engineering, CNC, laser, audio. Building at every layer from silicon to mechanical.',
    recentTitle: 'Recent Articles',
    menu: 'Menu',
    connect: 'Connect',
    articles: [
      { title: 'Bootloader Design for STM32', date: '15 Jun, 2025' },
      { title: 'Reverse Engineering CAN Bus Protocols', date: '28 May, 2025' },
      { title: 'Building a Custom PCB in KiCad', date: '10 May, 2025' },
    ],
  },
  lang: {
    switch: 'ITA',
  },
}

export default en
export type Translations = typeof en
