import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useLanguage } from '../context/LanguageContext'
import { projectCategories } from '../data/projects'

const accents = ['#7c3aed', '#3b82f6', '#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#ef4444']

function ProjectCard({ project, accent, index }: {
  project: { title: string; desc: string; tags: string[]; links?: { label: string; url: string }[] }
  accent: string
  index: number
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ delay: index * 80 })

  return (
    <div ref={ref} className={`animate-fade-up${visible ? ' is-visible' : ''}`}>
      <div className="project-card glass-cyber">
        <div className="project-card__thumb" style={{
          background: `linear-gradient(135deg, ${accent}22, ${accent}44)`,
        }}>
          <span className="project-card__thumb-text" style={{ color: accent }}>
            {'{ }'}
          </span>
        </div>

        <div className="project-card__tags">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="project-card__tag">{tag}</span>
          ))}
        </div>

        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.desc}</p>

        {project.links && (
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            {project.links.map(link => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener"
                className="project-card__link">
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Projects() {
  const { t } = useLanguage()
  const { ref, visible } = useScrollReveal<HTMLDivElement>()
  const [activeCat, setActiveCat] = useState<string | null>(null)

  const categories = projectCategories.map(c => ({ id: c.id, label: c.label }))

  const filtered = activeCat
    ? projectCategories.filter(c => c.id === activeCat).flatMap(c =>
        c.projects.map(p => ({ ...p, accent: accents[Math.floor(Math.random() * accents.length)] }))
      )
    : projectCategories.flatMap(c =>
        c.projects.map(p => ({ ...p, accent: accents[Math.floor(Math.random() * accents.length)] }))
      )

  return (
    <section className="section section-cyber" id="projects">
      <div className="container">
        <div ref={ref} className={`section__header animate-fade-up${visible ? ' is-visible' : ''}`}>
          <div className="section__subtitle-alt">Portfolio</div>
          <h2 className="section__title-alt">{t.projects.title}</h2>
          <p className="section__subtitle">{t.projects.desc}</p>
        </div>

        <div className="projects-filter">
          <button
            className={`projects-filter__btn${activeCat === null ? ' projects-filter__btn--active' : ''}`}
            onClick={() => setActiveCat(null)}
          >All</button>
          {categories.map(c => (
            <button key={c.id}
              className={`projects-filter__btn${activeCat === c.id ? ' projects-filter__btn--active' : ''}`}
              onClick={() => setActiveCat(c.id)}
            >{c.label}</button>
          ))}
        </div>

        <div className="projects-grid">
          {filtered.map((p, i) => (
            <ProjectCard key={p.title + i} project={p} accent={p.accent} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
