import { useEffect, useMemo, useState } from "react";
import type { AudienceKey, AudienceDemoConfig } from "./audience-config";
import { AUDIENCE_DEMOS } from "./audience-config";
import "./audience-demo.css";

const BEATS = [
  { label: "Connect inbox", title: "Connect your inbox, personalize at scale." },
  { label: "Merge fields", title: "A personal note, with the right context." },
  { label: "Personalized sends", title: "One workflow. Many relevant conversations." },
  { label: "Replies arrive", title: "Replies land where your team can act." },
  { label: "Pipeline board", title: "Keep the next step visible." },
  { label: "Tracked results", title: "See what outreach is moving forward." },
] as const;

export interface AudienceDemoProps {
  audience: AudienceKey;
  autoPlay?: boolean;
  className?: string;
}

function Scene({ config, step }: { config: AudienceDemoConfig; step: number }) {
  const beat = BEATS[step];
  return (
      <div key={`${config.key}-${step}`} className="ll-audience-demo__scene" aria-label={`Step ${step + 1}: ${beat.label}`}>
      <p className="ll-audience-demo__scene-label">Step {String(step + 1).padStart(2, "0")} / 06 · {beat.label}</p>
      <h3 className="ll-audience-demo__scene-title">{beat.title}</h3>
      {step === 0 && (
        <>
          <p className="ll-audience-demo__scene-copy">{config.angle}</p>
          <div className="ll-audience-demo__card">
            <div className="ll-audience-demo__card-head">
              <div><p className="ll-audience-demo__card-title">Inbox connection</p><span className="ll-audience-demo__micro">Keep outreach and incoming opportunities together.</span></div>
            </div>
            <div className="ll-audience-demo__demo-sample"><strong>Connected:</strong> acquisitions@northwindresidential.com <span aria-hidden="true">·</span> Inbox sync ready</div>
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <p className="ll-audience-demo__scene-copy">Each message uses relevant, audience-specific context from the contact record.</p>
          <div className="ll-audience-demo__card">
            <div className="ll-audience-demo__card-head">
              <div><p className="ll-audience-demo__card-title">{config.recipient} <span className="ll-audience-demo__micro">· {config.recipientDetail}</span></p></div>
            </div>
            <div className="ll-audience-demo__fields">
              {config.mergeFields.map((field) => <div className="ll-audience-demo__field" key={field.token}><span className="ll-audience-demo__field-label">{field.label} <span aria-hidden="true">·</span> {field.token}</span><span className="ll-audience-demo__field-value">{field.value}</span></div>)}
            </div>
          </div>
          <div className="ll-audience-demo__demo-sample"><strong>Opportunity:</strong> {config.sample} · {config.sampleDetail}</div>
        </>
      )}
      {step === 2 && (
        <>
          <p className="ll-audience-demo__scene-copy">Personalized details carry through each send; the team can see who was contacted and why.</p>
          <div className="ll-audience-demo__send-grid">
            {[config.recipient, "Avery Brooks", "Morgan Reed"].map((person, index) => (
              <div className="ll-audience-demo__send" key={person}>
                <div className="ll-audience-demo__send-to">To: {index === 0 ? config.recipientDetail : person}</div>
                <div className="ll-audience-demo__send-subject">{config.subject}</div>
                <div className="ll-audience-demo__micro" style={{ marginTop: 7 }}>Personalized · sent</div>
              </div>
            ))}
          </div>
          <div className="ll-audience-demo__send-count"><strong>48</strong><span>personalized messages in this campaign</span></div>
        </>
      )}
      {step === 3 && (
        <>
          <p className="ll-audience-demo__scene-copy">A reply is attached to the contact and the relevant opportunity, ready for a clear follow-up.</p>
          <div className="ll-audience-demo__reply">
            <span className="ll-audience-demo__reply-from">Reply · {config.replyFrom}</span>
            <p>“{config.reply}”</p>
            <div className="ll-audience-demo__demo-sample"><strong>Linked to:</strong> {config.sample}</div>
          </div>
        </>
      )}
      {step === 4 && (
        <>
          <p className="ll-audience-demo__scene-copy">Move opportunities forward with stages that match how this audience works.</p>
          <div className="ll-audience-demo__board" aria-label="Opportunity pipeline board">
            {config.stages.map((stage, index) => (
              <div className="ll-audience-demo__column" key={stage}>
                <div className="ll-audience-demo__column-head"><span>{stage}</span><span>{index === 0 ? "02" : index === 1 ? "03" : "01"}</span></div>
                <div className="ll-audience-demo__pipeline-card">{index === 1 ? config.sample : ["New conversation", "Follow-up due", "Next step planned", "In progress"][index]}<small>{index === 1 ? config.recipient : config.recipientDetail}</small></div>
                {index === 1 && <div className="ll-audience-demo__pipeline-card">Second conversation<small>Follow-up scheduled</small></div>}
              </div>
            ))}
          </div>
        </>
      )}
      {step === 5 && (
        <>
          <p className="ll-audience-demo__scene-copy">A practical snapshot of outreach, response, and pipeline movement.</p>
          <div className="ll-audience-demo__metrics">
            {config.resultMetrics.map((metric) => <div className="ll-audience-demo__metric" key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
          </div>
          <div className="ll-audience-demo__demo-sample"><strong>Scope:</strong> Southeast outreach · active opportunity pipeline</div>
        </>
      )}
    </div>
  );
}

export default function AudienceDemo({ audience, autoPlay = true, className = "" }: AudienceDemoProps) {
  const config = AUDIENCE_DEMOS[audience];
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const steps = useMemo(() => BEATS.map((beat) => beat.label), []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener?.("change", sync);
    return () => query.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    setStep(0);
    setPaused(false);
  }, [audience]);

  useEffect(() => {
    if (!autoPlay || paused || reducedMotion) return;
    const timer = window.setInterval(() => setStep((current) => (current + 1) % BEATS.length), 3200);
    return () => window.clearInterval(timer);
  }, [autoPlay, paused, reducedMotion, audience]);

  const selectStep = (next: number) => setStep(Math.max(0, Math.min(BEATS.length - 1, next)));
  const currentBeat = BEATS[step];

  return (
    <section className={`ll-solutions-brand ll-audience-demo ${className}`.trim()} aria-label={`${config.label} workflow`}>
      <div className="ll-audience-demo__frame">
        <div className="ll-audience-demo__top">
          <div className="ll-audience-demo__brand"><span className="ll-audience-demo__brandmark" aria-hidden="true">D</span><span>DealLinq workspace</span><span className="ll-audience-demo__eyebrow">{config.eyebrow}</span></div>
        </div>
        <header className="ll-audience-demo__intro">
          <h2 className="ll-audience-demo__title">Inbox-connected outreach for {config.label.toLowerCase()}.</h2>
          <p className="ll-audience-demo__subhead">{config.angle}</p>
        </header>
        <div className="ll-audience-demo__content">
          <div aria-live="polite" aria-atomic="true" className="ll-audience-demo__sr-only">Step {step + 1} of 6: {currentBeat.label}. {currentBeat.title}</div>
          <Scene config={config} step={step} />
        </div>
        <footer className="ll-audience-demo__foot">
          <div className="ll-audience-demo__timeline" role="group" aria-label="Demo sequence steps">
            {steps.map((label, index) => (
              <button key={label} type="button" className="ll-audience-demo__step" aria-label={`Show step ${index + 1}: ${label}`} aria-current={step === index ? "step" : undefined} onClick={() => selectStep(index)}>
                <span className="ll-audience-demo__step-dot" aria-hidden="true" /><span className="ll-audience-demo__step-label">{label}</span>
              </button>
            ))}
          </div>
          <div className="ll-audience-demo__controls">
            <span className="ll-audience-demo__step-caption">Step {step + 1} of 6 <span aria-hidden="true">·</span> {currentBeat.label}</span>
            <div className="ll-audience-demo__control-row">
              <button className="ll-audience-demo__control ll-audience-demo__control--quiet" type="button" onClick={() => selectStep(step === 0 ? BEATS.length - 1 : step - 1)} aria-label="Previous demo step">Back</button>
              {autoPlay && !reducedMotion && <button className="ll-audience-demo__control ll-audience-demo__control--quiet" type="button" onClick={() => setPaused((current) => !current)} aria-pressed={paused}>{paused ? "Resume" : "Pause"}</button>}
              <button className="ll-audience-demo__control" type="button" onClick={() => selectStep(step === BEATS.length - 1 ? 0 : step + 1)}>{step === BEATS.length - 1 ? "Replay" : "Next step"}</button>
            </div>
          </div>
          {reducedMotion && <p className="ll-audience-demo__sr-only">Automatic animation is off because reduced motion is enabled. Use the step controls to browse the demo.</p>}
        </footer>
      </div>
    </section>
  );
}

export { AUDIENCE_DEMOS, AUDIENCE_KEYS } from "./audience-config";
export type { AudienceKey, AudienceDemoConfig } from "./audience-config";
