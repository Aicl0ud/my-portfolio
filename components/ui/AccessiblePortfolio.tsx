import { CONTACTS, EXPERIENCE, PROFILE, PROJECTS, SKILLS } from "../../data/portfolio";

export function AccessiblePortfolio({ onReturn }: { onReturn: () => void }) {
  return (
    <main className="portfolio-page" id="portfolio-content">
      <section className="portfolio-hero">
        <p className="eyebrow">Software engineer · Bangkok</p>
        <h1>{PROFILE.name}</h1>
        <p>{PROFILE.introduction}</p>
        <div className="portfolio-actions">
          <a href="mailto:teerasit.won@gmail.com">Start a conversation</a>
          <button type="button" onClick={onReturn}>Return to 3D room</button>
        </div>
      </section>

      <section className="portfolio-section" aria-labelledby="about-heading">
        <p className="section-index">01</p>
        <div>
          <h2 id="about-heading">About</h2>
          <p>{PROFILE.education}. Based in {PROFILE.location}.</p>
          <div className="tag-list">{SKILLS.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </div>
      </section>

      <section className="portfolio-section" aria-labelledby="experience-heading">
        <p className="section-index">02</p>
        <div>
          <h2 id="experience-heading">Experience</h2>
          <div className="timeline portfolio-timeline">
            {EXPERIENCE.map((item) => (
              <article key={item.company}>
                <p>{item.period}</p>
                <h3>{item.role} · {item.company}</h3>
                <span>{item.summary}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="portfolio-section" aria-labelledby="projects-heading">
        <p className="section-index">03</p>
        <div>
          <h2 id="projects-heading">Selected projects</h2>
          <div className="project-grid">
            {PROJECTS.map((project) => (
              <article key={project.name} className="project-card">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                <div className="project-links">
                  <a href={project.sourceUrl} target="_blank" rel="noreferrer">Source</a>
                  {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer">Live site</a> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="portfolio-section" aria-labelledby="contact-heading">
        <p className="section-index">04</p>
        <div>
          <h2 id="contact-heading">Contact</h2>
          <div className="contact-list portfolio-contact">
            {CONTACTS.map((contact) => (
              <a key={contact.label} href={contact.href} target="_blank" rel="noreferrer">
                <span>{contact.label}</span><strong>{contact.value}</strong>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
