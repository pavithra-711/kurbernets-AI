import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import {
  Cpu, Activity, Send, Server, Database, GitBranch,
  Layers, Zap, Shield, ArrowDown, Terminal, BarChart2,
  Code2, Cloud, Bot, ChevronRight
} from 'lucide-react';
import './App.css';

/* ── STATIC DATA ── */
const ALL_PROJECTS = [
  {
    id: 1, icon: '⚡', color: 'rgba(56,189,248,0.12)',
    name: 'Distributed Transaction System',
    desc: 'High-throughput payment gateway built with Node.js + Kafka. Processes 50k TPS with guaranteed delivery.',
    roles: ['Backend', 'DevOps'], tags: ['Node.js', 'Kafka', 'Redis', 'Microservices'],
  },
  {
    id: 2, icon: '🎨', color: 'rgba(167,139,250,0.12)',
    name: 'Omni-Channel UI Framework',
    desc: 'React component library with physics-based animations. Achieves consistent 60fps across 200+ components.',
    roles: ['Frontend', 'Fullstack'], tags: ['React', 'Framer Motion', 'WebGL', 'Storybook'],
  },
  {
    id: 3, icon: '🔮', color: 'rgba(244,114,182,0.12)',
    name: 'Predictive Load Balancer',
    desc: 'ML-driven L7 balancer that predicts traffic spikes and preemptively scales Kubernetes pods via HPA.',
    roles: ['DevOps', 'AI', 'Backend'], tags: ['Go', 'Kubernetes', 'Python', 'TensorFlow'],
  },
  {
    id: 4, icon: '🧠', color: 'rgba(52,211,153,0.12)',
    name: 'Semantic Log Analyzer',
    desc: 'NLP pipeline for real-time anomaly detection in application logs, reducing MTTR by 40%.',
    roles: ['AI', 'Backend'], tags: ['Python', 'Transformers', 'Elasticsearch'],
  },
  {
    id: 5, icon: '🚀', color: 'rgba(251,146,60,0.12)',
    name: 'E-Commerce 3D Platform',
    desc: 'Full-stack shop featuring WebGL product renders, optimistic UI, and realtime order tracking via sockets.',
    roles: ['Frontend', 'Fullstack'], tags: ['Next.js', 'Three.js', 'PostgreSQL', 'Socket.io'],
  },
  {
    id: 6, icon: '🛡️', color: 'rgba(56,189,248,0.12)',
    name: 'Zero-Trust Auth Gateway',
    desc: 'mTLS-based service mesh with short-lived certificate rotation and RBAC on every pod-to-pod call.',
    roles: ['DevOps', 'Backend'], tags: ['Istio', 'Kubernetes', 'Vault', 'SPIFFE'],
  },
];

const SKILLS = [
  { name: 'Kubernetes / Helm', pct: 92, icon: '☸️' },
  { name: 'React / Next.js', pct: 90, icon: '⚛️' },
  { name: 'Node.js / Express', pct: 88, icon: '🟩' },
  { name: 'Python / ML Ops', pct: 80, icon: '🐍' },
  { name: 'Docker / CI-CD', pct: 94, icon: '🐳' },
  { name: 'MongoDB / PostgreSQL', pct: 82, icon: '🗄️' },
  { name: 'TypeScript', pct: 87, icon: '🔷' },
  { name: 'Prometheus / Grafana', pct: 78, icon: '📊' },
];

const ARCH_STACK = [
  { icon: '⚛️', name: 'React + Vite', desc: 'Adaptive UI with role-based project filtering and WebSocket live updates.' },
  { icon: '🟩', name: 'Node.js + Express', desc: 'REST & Socket.io backend serving analytics events and AI evaluations.' },
  { icon: '🐳', name: 'Docker', desc: 'Both services containerized with multi-stage builds and .dockerignore.' },
  { icon: '☸️', name: 'Kubernetes', desc: 'Deployment, ClusterIP & LoadBalancer services for zero-downtime infra.' },
  { icon: '📈', name: 'HPA', desc: 'Horizontal Pod Autoscaler watches CPU >50% and scales 1→10 replicas.' },
  { icon: '🤖', name: 'OpenAI API', desc: 'NLP evaluation engine scores interview answers and returns structured JSON.' },
];

const AI_QUESTIONS = [
  'How does Horizontal Pod Autoscaling work in Kubernetes?',
  'Explain the difference between a Deployment and a StatefulSet.',
  'What is the role of an Ingress controller?',
  'How would you debug a CrashLoopBackOff pod?',
  'Explain how Kubernetes service discovery works.',
];

const BACKEND = 'http://localhost:5000';

/* ── COMPONENT ── */
export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [role, setRole] = useState('All');
  const [stats, setStats] = useState({ visitors: 0, interviews: 0 });
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [chatLog, setChatLog] = useState([
    { sender: 'ai', text: `Hello! I'm KubeHire AI. Answer this: "${AI_QUESTIONS[0]}"` }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [questionIdx, setQuestionIdx] = useState(0);

  const chatEndRef = useRef(null);
  const skillsRef = useRef(null);
  const socketRef = useRef(null);

  /* ── SOCKET & TRACKING ── */
  useEffect(() => {
    socketRef.current = io(BACKEND, { transports: ['websocket', 'polling'] });
    socketRef.current.on('analytics_update', setStats);

    fetch(`${BACKEND}/api/analytics/visit`, { method: 'POST' }).catch(() => { });

    return () => socketRef.current.disconnect();
  }, []);

  /* ── SKILL BAR INTERSECTION OBSERVER ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setSkillsVisible(true); },
      { threshold: 0.2 }
    );
    if (skillsRef.current) obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── NAV SCROLL SPY ── */
  useEffect(() => {
    const sections = ['hero', 'projects', 'skills', 'architecture', 'dashboard', 'interview'];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.4 }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  /* ── CHAT SCROLL ── */
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatLog]);

  const filteredProjects = role === 'All'
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter(p => p.roles.includes(role));

  const handleSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isEvaluating) return;

    const userText = chatInput;
    setChatInput('');
    setChatLog(prev => [...prev, { sender: 'user', text: userText }]);
    setIsEvaluating(true);
    setScore(null);
    setFeedback(null);

    try {
      fetch(`${BACKEND}/api/analytics/interview`, { method: 'POST' }).catch(() => { });

      const res = await fetch(`${BACKEND}/api/interview/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: AI_QUESTIONS[questionIdx], answer: userText }),
      });
      const data = await res.json();

      const nextIdx = (questionIdx + 1) % AI_QUESTIONS.length;
      setQuestionIdx(nextIdx);
      setScore(data.score);
      setFeedback(data.areas_for_improvement);

      setChatLog(prev => [
        ...prev,
        { sender: 'ai', text: data.feedback },
        { sender: 'ai', text: `Next question: "${AI_QUESTIONS[nextIdx]}"` },
      ]);
    } catch {
      setChatLog(prev => [...prev, { sender: 'ai', text: '⚠️ Backend connection failed. Make sure the server is running on port 5000.' }]);
    } finally {
      setIsEvaluating(false);
    }
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  /* ── RENDER ── */
  return (
    <>
      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => scrollTo('hero')}>⚡ KubeHire AI</div>
        <div className="nav-links">
          {['projects', 'skills', 'architecture', 'dashboard', 'interview'].map(s => (
            <button
              key={s}
              className="nav-link"
              style={{ color: activeSection === s ? 'var(--text)' : undefined }}
              onClick={() => scrollTo(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <select className="role-select" value={role} onChange={e => setRole(e.target.value)}>
            {['All', 'Frontend', 'Backend', 'DevOps', 'AI', 'Fullstack'].map(r => (
              <option key={r} value={r}>{r === 'All' ? '👋 All Roles' : `🎯 ${r}`}</option>
            ))}
          </select>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Live on Kubernetes · HPA Active
        </div>
        <h1 className="hero-title">
          Not just a portfolio.
          <span className="hero-title-gradient">A scalable hiring platform.</span>
        </h1>
        <p className="hero-sub">
          KubeHire AI adapts to your role, evaluates interviews with NLP, and runs on a
          production-grade Kubernetes cluster with Horizontal Pod Autoscaling.
        </p>
        <div className="hero-cta">
          <button className="btn-primary" onClick={() => scrollTo('projects')}>Explore Projects</button>
          <button className="btn-ghost" onClick={() => scrollTo('interview')}>Try AI Interview →</button>
        </div>
        <div className="hero-scroll-hint">
          <span>Scroll</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="stats-bar">
        {[
          { val: '6+', label: 'Production Projects' },
          { val: `${stats.visitors}`, label: 'Recruiter Visits (Live)' },
          { val: `${stats.interviews}`, label: 'AI Interviews (Live)' },
          { val: '10x', label: 'HPA Max Replicas' },
        ].map(s => (
          <div key={s.label} className="stat-item">
            <div className="stat-item-val">{s.val}</div>
            <div className="stat-item-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── PROJECTS ── */}
      <div id="projects">
        <div className="section">
          <div className="section-label">Adaptive Portfolio</div>
          <h2 className="section-title">Projects filtered for: <span className="text-blue">{role}</span></h2>
          <p className="section-sub">Switch recruiter mode in the top-right to dynamically reorder and highlight relevant work.</p>
          <div className="projects-grid">
            {filteredProjects.map(p => (
              <div key={p.id} className="glass project-card">
                <div className="project-header">
                  <div className="project-icon" style={{ background: p.color }}>{p.icon}</div>
                  <div className="project-name">{p.name}</div>
                </div>
                <p className="project-desc">{p.desc}</p>
                <div className="tags">
                  {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SKILLS ── */}
      <div id="skills" ref={skillsRef}>
        <div className="section">
          <div className="section-label">Technical Proficiency</div>
          <h2 className="section-title">Skills & Stack</h2>
          <p className="section-sub">Measured by real production usage, not just tutorials.</p>
          <div className="skills-grid">
            {SKILLS.map(s => (
              <div key={s.name} className="glass skill-bar">
                <div className="skill-info">
                  <div className="skill-name"><span>{s.icon}</span>{s.name}</div>
                  <div className="skill-pct">{s.pct}%</div>
                </div>
                <div className="bar-bg">
                  <div className="bar-fill" style={{ width: skillsVisible ? `${s.pct}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ARCHITECTURE ── */}
      <div id="architecture">
        <div className="section">
          <div className="section-label">System Design</div>
          <h2 className="section-title">Architecture Overview</h2>
          <p className="section-sub">Every layer is intentional. From WebSocket events to auto-scaling pods.</p>
          <div className="arch-grid">
            {ARCH_STACK.map(a => (
              <div key={a.name} className="glass arch-card">
                <div className="arch-icon">{a.icon}</div>
                <div className="arch-name">{a.name}</div>
                <div className="arch-desc">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LIVE DASHBOARD ── */}
      <div id="dashboard">
        <div className="section">
          <div className="section-label">Real-Time Analytics</div>
          <h2 className="section-title">Live Metrics Dashboard</h2>
          <p className="section-sub">Powered by WebSockets. Every recruiter visit and interview attempt syncs instantly.</p>
          <div className="dashboard-grid">
            <div className="glass metric-card">
              <div className="live-dot"><span />Live</div>
              <div className="metric-val"><span className="metric-val-num">{stats.visitors}</span></div>
              <div className="metric-label">Recruiters currently tracked via Socket.io</div>
            </div>
            <div className="glass metric-card">
              <div className="live-dot"><span />Live</div>
              <div className="metric-val"><span className="metric-val-num">{stats.interviews}</span></div>
              <div className="metric-label">AI mock interviews completed this session</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI INTERVIEW ── */}
      <div id="interview">
        <div className="section">
          <div className="section-label">AI Mock Interview Engine</div>
          <h2 className="section-title">Test Your Knowledge</h2>
          <p className="section-sub">Powered by OpenAI. Answer Kubernetes and DevOps questions and get instant scored feedback.</p>
          <div className="interview-wrap">

            {/* Chat */}
            <div className="glass chat-panel">
              <div className="chat-header">
                <Bot size={20} className="text-blue" />
                <div>
                  <div className="chat-title">KubeHire Interviewer</div>
                  <div className="chat-subtitle">AI-powered technical screener</div>
                </div>
              </div>
              <div className="chat-messages">
                {chatLog.map((m, i) => (
                  <div key={i} className={`msg ${m.sender}`}>{m.text}</div>
                ))}
                {isEvaluating && <div className="msg ai thinking">Evaluating your response…</div>}
                <div ref={chatEndRef} />
              </div>
              <form className="chat-form" onSubmit={handleSend}>
                <input
                  className="chat-input"
                  placeholder="Type your answer here…"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  disabled={isEvaluating}
                />
                <button type="submit" className="send-btn" disabled={isEvaluating || !chatInput.trim()}>
                  <Send size={18} color="white" />
                </button>
              </form>
            </div>

            {/* Score Panel */}
            <div className="glass score-card">
              {score ? (
                <>
                  <div className="score-big">
                    <div className="score-number">{score}</div>
                    <div className="score-label">/ 100 Technical Score</div>
                  </div>
                  <div>
                    <div className="section-label" style={{ marginBottom: '0.75rem' }}>Areas to Improve</div>
                    {feedback?.map((f, i) => (
                      <div key={i} className="feedback-item">
                        <span className="feedback-icon text-blue">→</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem 1rem' }}>
                  <Bot size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                  <p>Submit an answer to see your AI-evaluated score here.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div>Built with ⚡ React + Node.js + Kubernetes</div>
        <div className="live-dot">
          <span />
          Backend Live · Port 5000
        </div>
      </footer>
    </>
  );
}
