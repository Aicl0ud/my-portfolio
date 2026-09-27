import { CONTACTS, EXPERIENCE, PROFILE, PROJECTS, SKILLS } from "../../data/portfolio";

export function ReadablePortfolio({ onReturn }: { onReturn: () => void }) {
  return (
    <div className="readable-page" id="portfolio-content">
      <header className="readable-hero">
        <p className="eyebrow">Software engineer · Bangkok</p>
        <h1>{PROFILE.name}</h1>
        <p>{PROFILE.introduction}</p>
        <div className="readable-actions">
          <a href="mailto:teerasit.won@gmail.com">Start a conversation</a>
          <button type="button" onClick={onReturn}>Return to pixel room</button>
        </div>
      </header>

      <section className="readable-section" aria-labelledby="readable-about">
        <span>01</span>
        <div>
          <h2 id="readable-about">About</h2>
          <p>{PROFILE.education}. Based in {PROFILE.location}.</p>
          <div className="tag-list">{SKILLS.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </div>
      </section>

      <section className="readable-section" aria-labelledby="readable-experience">
        <span>02</span>
        <div>
          <h2 id="readable-experience">Experience</h2>
          <div className="timeline">
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

      <section className="readable-section" aria-labelledby="readable-projects">
        <span>03</span>
        <div>
          <h2 id="readable-projects">Selected projects</h2>
          <div className="project-grid">
            {PROJECTS.map((project) => (
              <article className="project-card" key={project.name}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="tag-list">
                  {project.stack.map((item) => <span key={item}>{item}</span>)}
                </div>
                <div className="project-links">
                  <a href={project.sourceUrl} target="_blank" rel="noreferrer">Source</a>
                  {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer">Live site</a> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="readable-section" aria-labelledby="readable-contact">
        <span>04</span>
        <div>
          <h2 id="readable-contact">Contact</h2>
          <div className="contact-list">
            {CONTACTS.map((contact) => (
              <a key={contact.label} href={contact.href} target="_blank" rel="noreferrer">
                <span>{contact.label}</span><strong>{contact.value}</strong>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
