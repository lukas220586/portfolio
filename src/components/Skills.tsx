import { useScrollReveal } from '../hooks/useScrollReveal'
import { useLanguage } from '../context/LanguageContext'
import { useEffect, useState } from 'react'

const skillGroups = [
  { label: 'Languages', items: ['C', 'C++', 'Python', 'C#', 'Assembly (ARM/x86)'], color: '#7c3aed', level: 95 },
  { label: 'μC / SoC', items: ['STM32', 'ESP32', 'Arduino', 'RPi', 'AVR', 'ATtiny'], color: '#3b82f6', level: 95 },
  { label: 'Protocols & Bus', items: ['CAN 2.0B / FD', 'I2C', 'SPI', 'UART', 'RS-485', 'Modbus RTU', 'USB'], color: '#06b6d4', level: 90 },
  { label: 'Debug & Test', items: ['Oscilloscope', 'Logic Analyzer', 'JTAG/SWD', 'Saleae', 'VNA', 'Spectrum Analyzer'], color: '#ec4899', level: 92 },
  { label: 'Firmware & Low-level', items: ['FreeRTOS', 'UEFI/EDK2', 'ACPI', 'Bootloaders', 'BSP', 'Linker Scripts'], color: '#10b981', level: 90 },
  { label: 'Analog & Power', items: ['Op-Amp Design', 'DC-DC Converters', 'LDO', 'LTspice', 'Thermal Analysis', 'Audio (Class AB/D)'], color: '#f59e0b', level: 85 },
  { label: 'PCB & EDA', items: ['KiCad', 'Altium Designer', 'LTspice', '2/4-layer PCB', 'Impedance Control'], color: '#ef4444', level: 88 },
  { label: 'CAD & Fab', items: ['Fusion 360', 'Photoshop', 'CorelDRAW', 'Laser Cutting', 'CNC', '3D Printing'], color: '#8b5cf6', level: 82 },
  { label: 'Industrial', items: ['PLC Integration', 'VFD Control', 'DIN Rail', 'Relay Logic', 'Safety Circuits', 'SCADA'], color: '#14b8a6', level: 80 },
  { label: 'Software & Tooling', items: ['Linux', 'Git', 'Docker', 'CI/CD', 'Win32 API', '.NET/WPF', 'React'], color: '#6366f1', level: 85 },
]

function SkillCard({ g, i }: { g: typeof skillGroups[0]; i: number }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ delay: i * 60 })
  const [barW, setBarW] = useState(0)

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => setBarW(g.level), 100)
    return () => clearTimeout(timer)
  }, [visible, g.level])

  return (
    <div ref={ref} className={`animate-fade-up${visible ? ' is-visible' : ''}`}>
      <div className="skill-card glass-cyber" style={{ borderColor: visible ? `${g.color}22` : undefined }}>
        <div className="skill-card__header">
          <span className="skill-card__label">{g.label}</span>
          <span className="skill-card__badge" style={{ color: g.color, background: `${g.color}15` }}>
            {g.items.length}
          </span>
        </div>

        <div className="skill-bar" style={{ marginBottom: 12 }}>
          <div className="skill-bar__track">
            <div className="skill-bar__fill" style={{
              width: `${barW}%`,
              background: `linear-gradient(90deg, ${g.color}, ${g.color}88)`,
              boxShadow: `0 0 8px ${g.color}44`,
            }} />
          </div>
          <span className="skill-bar__value">{g.level}%</span>
        </div>

        <div className="skill-card__items">
          {g.items.map(item => (
            <span key={item} className="skill-card__item">{item}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Skills() {
  const { t } = useLanguage()
  const { ref, visible } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section section-cyber" id="skills">
      <div className="container">
        <div ref={ref} className={`section__header animate-fade-up${visible ? ' is-visible' : ''}`}>
          <div className="section__subtitle-alt">Toolchain</div>
          <h2 className="section__title-alt">{t.skills.title}</h2>
          <p className="section__subtitle">{t.skills.desc}</p>
        </div>

        <div className="skills-grid">
          {skillGroups.map((g, i) => <SkillCard key={g.label} g={g} i={i} />)}
        </div>
      </div>
    </section>
  )
}
