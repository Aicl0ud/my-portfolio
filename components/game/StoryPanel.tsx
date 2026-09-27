import { useEffect, useRef, type KeyboardEvent } from "react";
import {
  CONTACTS,
  EXPERIENCE,
  PORTFOLIO_STATIONS,
  PROFILE,
  PROJECTS,
  SKILLS,
  type StationId,
} from "../../data/portfolio";

function StoryContent({ stationId }: { stationId: StationId }) {
  if (stationId === "about") {
    return (
      <>
        <p className="panel-lead">{PROFILE.introduction}</p>
        <dl className="profile-facts">
          <div><dt>Based in</dt><dd>{PROFILE.location}</dd></div>
          <div><dt>Education</dt><dd>{PROFILE.education}</dd></div>
        </dl>
        <div className="tag-list" aria-label="Interests">
          {PROFILE.interests.map((interest) => <span key={interest}>{interest}</span>)}
        </div>
      </>
    );
  }

  if (stationId === "experience") {
    return (
      <>
        <div className="timeline">
          {EXPERIENCE.map((item) => (
            <article key={item.company}>
              <p>{item.period}</p>
              <h3>{item.role} · {item.company}</h3>
              <span>{item.summary}</span>
            </article>
          ))}
        </div>
        <div className="tag-list" aria-label="Technical skills">
          {SKILLS.map((skill) => <span key={skill}>{skill}</span>)}
        </div>
      </>
    );
  }

  if (stationId === "projects") {
    return (
      <div className="project-grid">
        {PROJECTS.map((project) => (
          <article key={project.name} className="project-card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="tag-list">
              {project.stack.map((item) => <span key={item}>{item}</span>)}
            </div>
            <div className="project-links">
              <a href={project.sourceUrl} target="_blank" rel="noreferrer">Source</a>
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer">Live site</a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="contact-list">
      <p className="panel-lead">Have a project, role, or idea worth exploring? Let&apos;s talk.</p>
      {CONTACTS.map((contact) => (
        <a key={contact.label} href={contact.href} target="_blank" rel="noreferrer">
          <span>{contact.label}</span>
          <strong>{contact.value}</strong>
        </a>
      ))}
    </div>
  );
}

type StoryPanelProps = {
  stationId: StationId;
  visited: StationId[];
  onClose: () => void;
};

export function StoryPanel({ stationId, visited, onClose }: StoryPanelProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const station = PORTFOLIO_STATIONS.find((item) => item.id === stationId)!;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      previousFocus?.focus();
    };
  }, [onClose]);

  const trapFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      ),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <div
      className="panel-backdrop"
      role="presentation"
      onPointerDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="story-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-title"
        onKeyDown={trapFocus}
      >
        <button
          ref={closeButton}
          className="panel-close"
          type="button"
          onClick={onClose}
          aria-label="Close story"
        >
          ×
        </button>
        <p className="eyebrow">
          Story {PORTFOLIO_STATIONS.findIndex((item) => item.id === stationId) + 1} of {PORTFOLIO_STATIONS.length}
          {" · "}{visited.length} explored
        </p>
        <h2 id="story-title">{station.label}</h2>
        <StoryContent stationId={stationId} />
        <p className="panel-shortcut">Press Esc to close</p>
      </section>
    </div>
  );
}
