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
import { useGameStore } from "../../store/game";

function StationContent({ stationId }: { stationId: StationId }) {
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
      <div className="project-grid compact-project-grid">
        {PROJECTS.map((project) => (
          <article key={project.name} className="project-card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
            <div className="project-links">
              <a href={project.sourceUrl} target="_blank" rel="noreferrer">Source</a>
              {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer">Live</a> : null}
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="contact-list">
      <p className="panel-lead">Have a project, role, or idea worth exploring? Let’s talk.</p>
      {CONTACTS.map((contact) => (
        <a key={contact.label} href={contact.href} target="_blank" rel="noreferrer">
          <span>{contact.label}</span>
          <strong>{contact.value}</strong>
        </a>
      ))}
    </div>
  );
}

export function PortfolioOverlay() {
  const activeStationId = useGameStore((state) => state.activeStationId);
  const nearbyStationId = useGameStore((state) => state.nearbyStationId);
  const visitedStationIds = useGameStore((state) => state.visitedStationIds);
  const closeStation = useGameStore((state) => state.closeStation);
  const openStation = useGameStore((state) => state.openStation);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (activeStationId) {
      previousFocus.current = document.activeElement as HTMLElement;
      closeButton.current?.focus();
    } else {
      previousFocus.current?.focus();
      previousFocus.current = null;
    }
  }, [activeStationId]);

  const trapDialogFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'),
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  const station = PORTFOLIO_STATIONS.find((item) => item.id === activeStationId);
  const nearbyStation = PORTFOLIO_STATIONS.find((item) => item.id === nearbyStationId);

  return (
    <>
      <div className="explore-progress" aria-label={`${visitedStationIds.length} of ${PORTFOLIO_STATIONS.length} stories explored`}>
        <span>Explore</span>
        <strong>{visitedStationIds.length}/{PORTFOLIO_STATIONS.length}</strong>
        <div>{PORTFOLIO_STATIONS.map((item) => <i key={item.id} className={visitedStationIds.includes(item.id) ? "done" : ""} />)}</div>
      </div>

      {nearbyStation && !activeStationId ? (
        <button className="interaction-prompt" type="button" onClick={() => openStation(nearbyStation.id)}>
          <kbd>E</kbd> Explore {nearbyStation.shortLabel}
        </button>
      ) : null}

      {activeStationId && station ? (
        <div className="panel-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeStation()}>
          <section className="story-panel" role="dialog" aria-modal="true" aria-labelledby="story-title" onKeyDown={trapDialogFocus}>
            <button ref={closeButton} className="panel-close" type="button" onClick={closeStation} aria-label="Close story">×</button>
            <p className="eyebrow">Story {visitedStationIds.indexOf(activeStationId) + 1} of {PORTFOLIO_STATIONS.length}</p>
            <h2 id="story-title">{station.label}</h2>
            <StationContent stationId={activeStationId} />
            <p className="panel-shortcut">Press Esc to close</p>
          </section>
        </div>
      ) : null}
    </>
  );
}
