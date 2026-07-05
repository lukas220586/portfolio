export interface Project {
  title: string
  desc: string
  tags: string[]
  links?: { label: string; url: string }[]
}

export interface ProjectCategory {
  id: string
  label: string
  projects: Project[]
}

export const projectCategories: ProjectCategory[] = [
  {
    id: 'firmware',
    label: 'Firmware & Embedded',
    projects: [
      {
        title: 'STM32 CAN Bus Bootloader',
        desc: 'Custom bootloader for STM32F4 with CAN bus firmware updates. Dual-bank architecture with flash sector erase/write, CRC32 verification, and automatic rollback on failed update. Host tool in Python with GUI.',
        tags: ['STM32F4', 'C', 'CAN 2.0B', 'CRC32', 'Python'],
        links: [{ label: 'GitHub', url: 'https://github.com/lukas220586' }],
      },
      {
        title: 'ESP32 Multi-Protocol IoT Gateway',
        desc: 'Bridges BLE, WiFi, MQTT, and Modbus RTU. FreeRTOS task architecture with watchdog supervision. OTA updates via HTTP + AES-GCM encrypted payloads. Home Assistant auto-discovery via MQTT.',
        tags: ['ESP32', 'FreeRTOS', 'MQTT', 'Modbus RTU', 'AES-GCM'],
        links: [{ label: 'GitHub', url: 'https://github.com/lukas220586' }],
      },
      {
        title: 'CAN Bus Analyzer (MCP2515)',
        desc: 'Real-time CAN bus monitoring with MCP2515 + STM32. Parses CAN 2.0A/B frames, supports DBC decoding, filters by ID/mask, logs to SD card with microsecond timestamps. Configurable bitrate up to 1 Mbps.',
        tags: ['MCP2515', 'STM32', 'CAN 2.0', 'DBC', 'SD Card'],
      },
    ],
  },
  {
    id: 'reverse-engineering',
    label: 'Reverse Engineering',
    projects: [
      {
        title: 'Firmware Extraction Toolkit',
        desc: 'Multi-interface firmware extraction suite supporting UART bootloader bypass, SPI flash desoldering/dump, JTAG/SWD via OpenOCD, and NAND/NOR recovery. Includes protocol bit-banging for unknown flash chips.',
        tags: ['UART', 'JTAG/SWD', 'SPI Flash', 'OpenOCD', 'Python'],
        links: [{ label: 'GitHub', url: 'https://github.com/lukas220586' }],
      },
      {
        title: 'UEFI NVRAM Analysis Suite',
        desc: 'Tools for enumerating, dumping, and patching UEFI runtime variables on x86_64. Analyzes NVRAM layout, identifies boot hook points, extracts Secure Boot keys, and dumps ACPI tables for firmware-level diagnostics.',
        tags: ['UEFI', 'EDK2', 'ACPI', 'NVRAM', 'x86_64'],
      },
      {
        title: 'Industrial PLC Protocol Reversing',
        desc: 'Reverse engineered proprietary serial protocol (RS-485, 19200 baud) on a discontinued PLC line. Reconstructed register map, command set, and CRC algorithm from bus captures. Built Python replacement driver.',
        tags: ['RS-485', 'Modbus', 'PLC', 'CRC', 'Python'],
      },
    ],
  },
  {
    id: 'hardware',
    label: 'Hardware & PCB Design',
    projects: [
      {
        title: 'Bench PSU 0-30V / 0-5A',
        desc: 'KiCad design: LM338 linear regulator + op-amp current limit. Dedicated aux winding for fan/display. Thermal simulation in LTspice. Two-layer PCB with top/bottom copper pour for heat dissipation. OVP/OCP protection.',
        tags: ['KiCad', 'LM338', 'LTspice', 'OVP/OCP', '2-layer PCB'],
      },
      {
        title: 'STM32F4 Dev Board',
        desc: 'Custom development board: STM32F411CEU6, USB-C (CC logic), CAN FD transceiver, 8MB SPI flash, 3x UART breakout, SWD header. All GPIOs brought to pin rows. Input protected with TVS diodes.',
        tags: ['STM32F4', 'USB-C PD', 'CAN FD', 'TVS Protection', 'KiCad'],
      },
      {
        title: 'Class AB Audio Amplifier 50W',
        desc: 'Discrete Class AB amplifier stage with differential input, Darlington output pair, and current limiter. PCB designed for star-ground topology. Pre-driver stage with NE5532 op-amp. Output protection relay with DC offset detection.',
        tags: ['Audio', 'Class AB', 'NE5532', 'Star Ground', 'Protection Relay'],
      },
    ],
  },
  {
    id: 'audio',
    label: 'Audio & Hi-Fi',
    projects: [
      {
        title: 'Hi-Fi Headphone Amplifier (OPA-based)',
        desc: 'Discrete headphone amp using OPA1612 + BUF634 buffer. ±12V rail from TI TPS7A4700 regulators. Volume pot = ALPS RK27. DC servo loop for zero offset. 300mW into 32Ω, THD+N < 0.0005%. PCB in KiCad with separate analog/PSU ground planes.',
        tags: ['OPA1612', 'BUF634', 'TPS7A4700', 'DC Servo', 'THD < 0.0005%'],
      },
      {
        title: 'Active Crossover (2-Way / 3-Way)',
        desc: 'Linkwitz-Riley 4th order active crossover at 2.2 kHz. Sallen-Key topology with OPA2134. Adjustable gain per band. Mute circuit with relay bypass on power-up. PCB design with ground plane isolation for digital-free analog path.',
        tags: ['Sallen-Key', 'OPA2134', 'Linkwitz-Riley', 'Active Crossover', 'Analog PCB'],
      },
      {
        title: 'Speaker Protection & Power Sequencer',
        desc: 'Microcontroller-based speaker protection module: DC offset detection ( ±2V trip), over-current sense, delayed turn-on (3s), immediate turn-off on fault. ATtiny85 + relay + shunt monitor. Optocoupler isolation from amplifier rails.',
        tags: ['ATtiny85', 'DC Detect', 'Relay', 'Optocoupler', 'Sequencer'],
      },
    ],
  },
  {
    id: 'mechanical',
    label: '3D Printing, CNC & Laser',
    projects: [
      {
        title: 'CNC Spindle Speed Controller (VFD Interface)',
        desc: 'ESP32-based spindle controller with 0-10V analog output via MCP4725 DAC. Modbus RTU interface to HY VFD. Web UI for RPM setting, spindle direction, fault readout. Emergency stop with hardware latch + MOSFET brake.',
        tags: ['ESP32', 'Modbus RTU', 'MCP4725', 'VFD', 'E-Stop'],
      },
      {
        title: 'Laser Cutter Air Assist Timer',
        desc: 'Solid-state relay controller with configurable post-run air assist timer (30-300s). ATtiny13 + MOSFET + potentiometer. Zero-cross switching to minimize EMI. Compact PCB designed for DIN rail mount. Saves compressor wear on CO2 lasers.',
        tags: ['ATtiny13', 'SSR', 'Zero-Cross', 'DIN Rail', 'CO2 Laser'],
      },
      {
        title: '3D Printer Chamber Heater Controller',
        desc: 'PID temperature controller for enclosed 3D printer chamber (target 45-60°C). PTC heater + NTC thermistor. Relay-driven with ramped startup to prevent inrush. Safety thermal fuse independent of MCU. Web UI via ESP01 for monitoring.',
        tags: ['ESP01', 'PID', 'NTC', 'PTC Heater', 'Thermal Fuse'],
      },
    ],
  },
  {
    id: 'industrial',
    label: 'Industrial Automation',
    projects: [
      {
        title: 'Modbus RTU Temperature Logger',
        desc: 'Multi-sensor temperature logging over RS-485 Modbus RTU. STM32 + MAX31865 PT100 ADC. 8-channel multiplexer. Logs to SD card with FAT32 + CSV format. Configurable polling rate (100ms-10s). Galvanic isolation on RS-485 side.',
        tags: ['STM32', 'MAX31865', 'RS-485', 'PT100', 'Galvanic Isolation'],
      },
      {
        title: 'Machinery Run-Time Counter',
        desc: 'Retrofit run-time counter for industrial machinery lacking hour meters. ATtiny85 senses 24V AC/DC presence via optocoupler. Stores hours in EEPROM. 7-segment LED display. DIN rail mountable. Power loss tolerant with 100k write cycle EEPROM.',
        tags: ['ATtiny85', 'Optocoupler', 'EEPROM', 'DIN Rail', '7-Segment'],
      },
    ],
  },
  {
    id: 'software',
    label: 'Software & Tooling',
    projects: [
      {
        title: 'Monitor System Windows 11',
        desc: 'Professional hardware monitoring app for Windows 11. Tracks CPU/GPU/RAM/disk/network + sensor temps and fan speeds. Real-time graphs with configurable polling. Uses LibreHardwareMonitor + Win32 API for sensor access.',
        tags: ['C#', 'WPF', 'LibreHardwareMonitor', 'Win32 API', 'Real-time'],
        links: [
          { label: 'GitHub', url: 'https://github.com/lukas220586/Monitor-System-Windows11' },
        ],
      },
      {
        title: 'Serial Protocol Analyzer + Decoder',
        desc: 'Cross-platform Python tool for real-time decoding of UART, I2C, and SPI captures. Plugin architecture for custom protocol decoders. Exports to CSV, VCD (for GTKWave), and Sigrok sessions. CLI + Tkinter GUI.',
        tags: ['Python', 'PySerial', 'Sigrok', 'Protocol Decode', 'Plugin Arch'],
      },
      {
        title: 'Embedded Debug & Flash Toolkit',
        desc: 'CLI utilities for embedded workflow: Intel HEX / binary manipulation, memory map generation, binary diff/patch, flash programmer helpers (STM32 ST-Link, ESP32 esptool wrapper), automated backup scripts with CRC verification.',
        tags: ['Python', 'CLI', 'Hex/Binary', 'ST-Link', 'esptool'],
        links: [{ label: 'GitHub', url: 'https://github.com/lukas220586' }],
      },
      {
        title: 'Pugliese Hardware v2 / v3',
        desc: 'Full-stack repair management system: invoicing, inventory tracking, financial reporting, eBay import, PDF export, backup/restore. v2: Electron/React/MUI5/Dexie (production ready). v3: WPF/.NET 9/EF Core/SQLite rewrite with dark theme, 12 pages, DI wiring.',
        tags: ['Electron', 'React', 'WPF', '.NET 9', 'SQLite'],
        links: [
          { label: 'GitHub', url: 'https://github.com/lukas220586/Pugliese-Hardware' },
        ],
      },
      {
        title: 'Pugliese Audio',
        desc: 'Client-server HiFi audio player. Node.js/Express backend with streaming, React web UI, React Native mobile app, Electron desktop client. 10-band equalizer with 200+ presets. Supports FLAC, DSD, WAV, ALAC, MP3 and 6 more formats.',
        tags: ['Node.js', 'React', 'React Native', 'Electron', 'HiFi Audio'],
        links: [
          { label: 'GitHub', url: 'https://github.com/lukas220586/Pugliese-Audio' },
        ],
      },
      {
        title: 'CFS — Compute Fabric System',
        desc: 'Universal compute runtime in Rust. Custom C-to-IR compiler with 5 passes, register-based VM, GPU compute via CUDA PTX (RTX 3060). Single binary ~4.5MB with CLI interface. Designed to unify CPU/GPU/NPU execution under one fabric.',
        tags: ['Rust', 'Compiler', 'CUDA PTX', 'VM', 'CLI'],
        links: [
          { label: 'GitHub', url: 'https://github.com/lukas220586/CFS' },
        ],
      },
    ],
  },
]
