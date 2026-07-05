import { useScrollReveal } from '../hooks/useScrollReveal'
import { useLanguage } from '../context/LanguageContext'

const services = [
  {
    icon: '⚡',
    en: { title: 'Firmware Engineering', desc: 'Bare-metal C/C++, FreeRTOS, STM32/ESP32, bootloaders, BSP, driver development. From prototype to production.' },
    it: { title: 'Ingegneria Firmware', desc: 'C/C++ bare-metal, FreeRTOS, STM32/ESP32, bootloader, BSP, sviluppo driver. Dal prototipo alla produzione.' },
  },
  {
    icon: '🔬',
    en: { title: 'PCB Design & Layout', desc: 'KiCad/Altium, 2-4 layer, impedance control, power tree design, thermal simulation, DRC-zero.' },
    it: { title: 'Progettazione PCB', desc: 'KiCad/Altium, 2-4 strati, controllo impedenza, power tree, simulazione termica, DRC-zero.' },
  },
  {
    icon: '🔍',
    en: { title: 'Reverse Engineering', desc: 'Firmware extraction, Ghidra analysis, protocol reversal, UEFI/NVRAM, hardware teardown.' },
    it: { title: 'Reverse Engineering', desc: 'Estrazione firmware, analisi Ghidra, reversal protocolli, UEFI/NVRAM, teardown hardware.' },
  },
  {
    icon: '🎛️',
    en: { title: 'Audio Electronics', desc: 'Class AB/D amplifiers, active crossovers, DSP integration, THD optimization, analog signal chain.' },
    it: { title: 'Elettronica Audio', desc: 'Amplificatori AB/D, crossover attivi, integrazione DSP, ottimizzazione THD, catena analogica.' },
  },
  {
    icon: '⚙️',
    en: { title: 'Digital Fabrication', desc: 'CNC conversion, VFD control, laser cutter mods, 3D printer optimization, Fusion 360 CAD.' },
    it: { title: 'Fabbricazione Digitale', desc: 'Conversione CNC, controllo VFD, mod laser, ottimizzazione stampa 3D, CAD Fusion 360.' },
  },
  {
    icon: '🏭',
    en: { title: 'Industrial Automation', desc: 'Modbus RTU, CAN bus, PLC integration, DIN rail design, safety circuits, SCADA interfacing.' },
    it: { title: 'Automazione Industriale', desc: 'Modbus RTU, CAN bus, integrazione PLC, design DIN rail, circuiti sicurezza, interfacciamento SCADA.' },
  },
]

export default function Services() {
  const { t, locale } = useLanguage()
  const { ref, visible } = useScrollReveal<HTMLDivElement>()
  const lang = locale === 'it' ? 'it' : 'en'

  return (
    <section className="section section-cyber" id="services">
      <div className="container">
        <div ref={ref} className={`section__header animate-fade-up${visible ? ' is-visible' : ''}`}>
          <div className="section__subtitle-alt">{locale === 'it' ? 'Competenze' : 'Expertise'}</div>
          <h2 className="section__title-alt">{locale === 'it' ? 'Cosa Offro' : 'Services'}</h2>
          <p className="section__subtitle">
            {locale === 'it'
              ? 'Consulenza tecnica a ogni livello: dal silicio al software, dal prototipo alla produzione.'
              : 'Technical consulting at every level: from silicon to software, from prototype to production.'}
          </p>
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <div key={i} className={`animate-fade-up${visible ? ' is-visible' : ''}`}
              style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="service-card-cyber">
                <div className="service-card-cyber__icon">{s.icon}</div>
                <h3 className="service-card-cyber__title">{s[lang].title}</h3>
                <p className="service-card-cyber__desc">{s[lang].desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
