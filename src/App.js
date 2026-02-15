import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled, { keyframes } from 'styled-components';
import { 
  FaGithub, FaLinkedin, FaEnvelope, 
  FaSkull, FaCrown, FaPhone 
} from 'react-icons/fa';
import { GiBroadsword, GiMagicShield } from 'react-icons/gi';
import './App.css';
import profileImage from './SJ.jpg';

// ==================== STYLED COMPONENTS ====================

const blueFlame = keyframes`
  0% { filter: hue-rotate(0deg) brightness(1); }
  50% { filter: hue-rotate(10deg) brightness(1.3); }
  100% { filter: hue-rotate(0deg) brightness(1); }
`;

const AppContainer = styled.div`
  background: #0a0a0a;
  color: white;
  overflow-x: hidden;
  position: relative;
  min-height: 100vh;
`;

const BlueFlameBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(0, 100, 255, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 40% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(0, 255, 200, 0.1) 0%, transparent 40%);
  animation: ${blueFlame} 8s ease-in-out infinite;
`;

const ParticleCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const ShadowOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%);
  pointer-events: none;
  z-index: 1;
`;

// ==================== LOADING SCREEN ====================

function LoadingScreen() {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0a0a0a',
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          fontFamily: 'Orbitron, sans-serif',
          color: '#8b5cf6',
          fontSize: '1.2rem',
          letterSpacing: '4px',
          marginBottom: '2rem',
          textAlign: 'center'
        }}
      >
        SYNCING WITH THE SYSTEM...
      </motion.div>

      <div style={{
        width: '300px',
        height: '4px',
        background: 'rgba(139, 92, 246, 0.1)',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)'
      }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
            height: '100%',
            background: '#8b5cf6',
            boxShadow: '0 0 15px #8b5cf6'
          }}
        />
      </div>
    </motion.div>
  );
}

// ==================== MAIN COMPONENT ====================

function App() {
  const { scrollYProgress } = useScroll();
  const [loading, setLoading] = useState(true);
  const [showSystemMessage, setShowSystemMessage] = useState(false);
  const [level, setLevel] = useState(85);
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0.3]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowSystemMessage(true);
    }, 2000);

    const messageTimer = setTimeout(() => setShowSystemMessage(false), 7000);

    return () => {
      clearTimeout(timer);
      clearTimeout(messageTimer);
    };
  }, []);

  return (
    <AppContainer>
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loading" />
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <BlueFlameBackground style={{ y: backgroundY, opacity }} />
            <ParticleBackground />
            <ShadowOverlay />
            
            <Content>
              <SystemMessage show={showSystemMessage} />
              <Header level={level} />
              <ProfileSection />
              <ExperienceTimeline />
              <ProjectsGrid />
              <SkillsAndAchievements />
              <ContactSection />
              <LevelUpButton onLevelUp={() => setLevel(level + 1)} />
            </Content>
          </motion.div>
        )}
      </AnimatePresence>
    </AppContainer>
  );
}

// ==================== PARTICLE BACKGROUND ====================

function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(139, 92, 246, ${Math.random() * 0.5})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 100; i++) particles.push(new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance/100)})`;
            ctx.stroke();
          }
        }
      }
      particles.forEach(p => { p.update(); p.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    };

    resize(); init(); animate();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <ParticleCanvas ref={canvasRef} />;
}

// ==================== SYSTEM MESSAGE ====================

function SystemMessage({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: -500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -500, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          style={{
            background: 'linear-gradient(90deg, rgba(139,92,246,0.2), rgba(0,0,0,0.9))',
            borderLeft: '4px solid #8b5cf6',
            padding: '1rem 2rem',
            marginBottom: '2rem',
            fontFamily: 'Orbitron, sans-serif',
            color: '#8b5cf6',
            borderRadius: '0 10px 10px 0',
            boxShadow: '0 0 30px rgba(139,92,246,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <motion.div
            animate={{ x: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.2), transparent)',
              pointerEvents: 'none'
            }}
          />
          ⚡ SYSTEM: Shadow Monarch detected. Initializing portfolio interface...
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==================== HEADER ====================

function Header({ level }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ y: -100, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 1, type: 'spring' }}
      style={{ textAlign: 'center', marginBottom: '4rem' }}
    >
      <motion.h1
        animate={{ textShadow: ['0 0 20px #8b5cf6', '0 0 40px #6d28d9', '0 0 20px #8b5cf6'] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(2rem, 8vw, 5rem)',
          fontWeight: 900,
          background: 'linear-gradient(45deg, #8b5cf6, #d8b4fe, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem',
          letterSpacing: '8px'
        }}
      >
        Ashish Shenoy.K 
      </motion.h1>
      
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          width: '100px', height: '100px', margin: '0 auto 2rem',
          border: '2px solid #8b5cf6', borderRadius: '50%',
          position: 'relative', boxShadow: '0 0 50px #8b5cf6'
        }}
      >
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', fontSize: '3rem', color: '#8b5cf6'
        }}>
          <FaSkull />
        </div>
      </motion.div>
      
      <div style={{
        fontFamily: 'Orbitron, sans-serif', fontSize: '1.5rem', color: '#8b5cf6',
        background: 'rgba(139,92,246,0.1)', padding: '0.5rem 2rem',
        borderRadius: '50px', display: 'inline-block', border: '1px solid #8b5cf6'
      }}>
        LEVEL {level} · S-RANK HUNTER
      </div>
    </motion.div>
  );
}

// ==================== PROFILE SECTION ====================

function ProfileSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ x: -200, opacity: 0 }}
      animate={inView ? { x: 0, opacity: 1 } : {}}
      transition={{ duration: 1, type: 'spring' }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem', marginBottom: '4rem'
      }}
    >
      <motion.div
        whileHover={{ scale: 1.05, rotate: 2 }}
        style={{
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          border: '2px solid rgba(139, 92, 246, 0.3)', borderRadius: '20px',
          padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
          boxShadow: '0 0 50px rgba(139, 92, 246, 0.2)'
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{
            position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
            zIndex: -1
          }}
        />
        
        <motion.div
          animate={{ y: [0, -10, 0], boxShadow: ["0 0 20px rgba(139,92,246,0.5)", "0 0 40px rgba(139,92,246,0.8)", "0 0 20px rgba(139,92,246,0.5)"] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            width: '160px', height: '160px', margin: '0 auto 1.5rem',
            borderRadius: '50%', border: '3px solid #8b5cf6', overflow: 'hidden', position: 'relative'
          }}
        >
          <div style={{ width: '100%', height: '100%', transform: 'scale(2.2)', transformOrigin: 'top center' }}>
            <img 
              src={profileImage} alt="Ashish"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 10%', filter: 'contrast(120%) brightness(1.1)' }}
            />
          </div>
        </motion.div>
        
        <h2 style={{ color: '#8b5cf6', marginBottom: '0.5rem' }}>Ashish Shenoy.K</h2>
        <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>The Shadow Monarch</p>
        
        <div style={{ textAlign: 'left' }}>
          {[
            { label: 'LEVEL', value: '85', color: '#8b5cf6' },
            { label: 'CLASS', value: 'Shadow Monarch', color: '#ff00ff' },
            { label: 'STR', value: '95', color: '#ff8844' },
            { label: 'AGI', value: '92', color: '#44ff44' },
            { label: 'INT', value: '99', color: '#44ffff' }
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <span style={{ color: stat.color }}>{stat.label}</span>
              <span style={{ color: '#fff' }}>{stat.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        style={{
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          border: '2px solid rgba(139, 92, 246, 0.3)', borderRadius: '20px',
          padding: '2rem', boxShadow: '0 0 50px rgba(139, 92, 246, 0.1)'
        }}
      >
        <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#8b5cf6', fontSize: '1.5rem', marginBottom: '1.5rem' }}>SYSTEM STATUS</h3>
        <p style={{ lineHeight: '1.8', marginBottom: '2rem', color: '#eee' }}>
          A Shadow Monarch at work—transforming concepts into working systems through code. 
          Currently leading the campus validation study for FlocHealth and managing corporate sponsorships for Aerophilia 2025.
        </p>

        <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#8b5cf6', fontSize: '1.5rem', marginBottom: '1.5rem' }}>CODING ARMORY</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
          {[
            { name: 'C', color: '#A8B9CC' }, { name: 'Java', color: '#f89820' },
            { name: 'React', color: '#61dafb' }, { name: 'Python', color: '#3776ab' },
            { name: 'HTML', color: '#e34c26' }, { name: 'CSS', color: '#264de4' }
          ].map((lang) => (
            <motion.div key={lang.name} whileHover={{ scale: 1.05, background: 'rgba(139, 92, 246, 0.2)' }}
              style={{
                background: 'rgba(139, 92, 246, 0.05)', border: `1px solid rgba(139, 92, 246, 0.3)`,
                borderRadius: '12px', padding: '1.2rem 0.5rem', textAlign: 'center'
              }}>
              <div style={{ color: lang.color, fontSize: '1.1rem', fontWeight: 'bold' }}>{lang.name}</div>
              <div style={{ fontSize: '0.65rem', color: '#8b5cf6', marginTop: '6px', fontWeight: '600' }}>RANK: S</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==================== EXPERIENCE TIMELINE ====================

function ExperienceTimeline() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const experiences = [
    { date: '2026 - PRESENT', title: 'Product Developer - FlocHealth', description: 'Leading product development for health awareness, including the campus validation study.', icon: <FaCrown />, color: '#ffd700' },
    { date: '2021 - 2027', title: 'CSE Engineer', description: 'Developing high-rank projects including AI legal summarizers and civic-sense platforms.', icon: <GiBroadsword />, color: '#c0c0c0' },
    { date: '2019 - 2021', title: 'Sharadha PU College', description: 'Built a strong foundation in analytical thinking and problem-solving.', icon: <GiMagicShield />, color: '#cd7f32' }
  ];

  return (
    <motion.div ref={ref} initial={{ y: 200, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} style={{ marginBottom: '4rem' }}>
      <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#8b5cf6', fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>QUEST LOG</h3>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '20px', top: 0, width: '2px', height: '100%', background: 'linear-gradient(180deg, #8b5cf6, #6d28d9)' }} />
        {experiences.map((exp, i) => (
          <div key={i} style={{ marginLeft: '50px', marginBottom: '2rem', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '15px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: exp.color }}>{exp.icon} {exp.date}</div>
            <h4 style={{ color: '#fff' }}>{exp.title}</h4>
            <p style={{ color: '#ccc' }}>{exp.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ==================== PROJECTS GRID ====================

function ProjectsGrid() {
  const projects = [
    { title: 'Python AI Framework', rank: 'S-RANK', description: 'Modular framework with an interactive command loop.', tags: ['Python', 'AI'], color: '#3776AB' },
    { title: 'AI Judicial Summarizer', rank: 'S-RANK', description: 'Full-stack system using RAG and LangChain agents.', tags: ['React', 'FastAPI'], color: '#9b59b6' },
    { title: 'CivicSense Platform', rank: 'S-RANK', description: 'Real-time civic issue reporting and analytics.', tags: ['React', 'Node.js'], color: '#e67e22' },];

  return (
    <div style={{ marginBottom: '4rem' }}>
      <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#8b5cf6', fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>COMPLETED QUESTS</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {projects.map((p, i) => (
          <div key={i} style={{ background: 'rgba(10,10,10,0.9)', border: `1px solid ${p.color}44`, borderRadius: '20px', padding: '2rem' }}>
            <h4 style={{ color: p.color }}>{p.rank}</h4>
            <h5>{p.title}</h5>
            <p style={{ color: '#ccc' }}>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== SKILLS AND ACHIEVEMENTS ====================

function SkillsAndAchievements() {
  const skills = [
    { name: 'Full-Stack Dev', level: 85 },
    { name: 'Data Engineering', level: 85 }, { name: 'OOPS', level: 88 },
    { name: 'Problem Solving', level: 92 }, { name: 'Communication', level: 80 }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
      <div style={{ background: 'rgba(0,0,0,0.8)', border: '2px solid rgba(139, 92, 246, 0.3)', borderRadius: '20px', padding: '2rem' }}>
        <h3 style={{ color: '#8b5cf6' }}>SKILL TREE</h3>
        {skills.map(s => (
          <div key={s.name} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>{s.name} <span>{s.level}%</span></div>
            <div style={{ height: '8px', background: '#333', borderRadius: '4px' }}><div style={{ width: `${s.level}%`, height: '100%', background: '#8b5cf6' }} /></div>
          </div>
        ))}
      </div>
      <div style={{ background: 'rgba(0,0,0,0.8)', border: '2px solid rgba(139, 92, 246, 0.3)', borderRadius: '20px', padding: '2rem' }}>
        <h3 style={{ color: '#8b5cf6' }}>ACHIEVEMENTS</h3>
        {[
          { icon: '🏆', title: 'NIPE Hackathon', desc: 'Consolation Prize' },
          { icon: '⚡', title: 'NxtWave Competition', desc: 'Bangalore Round Participant' },
          { icon: '📊', title: 'IEEE Member', desc: 'Bangalore Sub-Section' },
          { icon: '👑', title: 'Volunteer - Synergia', desc: 'Active Volunteer 2023-2025' }
        ].map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <span>{a.icon}</span>
            <div><div style={{ color: '#8b5cf6', fontWeight: 'bold' }}>{a.title}</div><div style={{ fontSize: '0.8rem', color: '#ccc' }}>{a.desc}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== CONTACT SECTION ====================

function ContactSection() {
  const contacts = [
    { icon: <FaGithub />, color: '#8b5cf6', link: 'https://github.com/Darkwizard07' },
    { icon: <FaLinkedin />, color: '#0077b5', link: 'https://www.linkedin.com/in/ashish-shenoy-9a57bb294/' },
    { icon: <FaEnvelope />, color: '#ea4335', link: 'mailto:ash.s.konchady@gmail.com' },
    { icon: <FaPhone />, color: '#44ff44', link: 'tel:+919632671611' }
  ];

  return (
    <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(0,0,0,0.8)', border: '2px solid rgba(139, 92, 246, 0.3)', borderRadius: '50px', marginBottom: '4rem' }}>
      <h3 style={{ color: '#8b5cf6', marginBottom: '2rem' }}>SUMMON CONTACT</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        {contacts.map((c, i) => (
          <motion.a key={i} href={c.link} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2 }} style={{ fontSize: '2.5rem', color: c.color }}>
            {c.icon}
          </motion.a>
        ))}
      </div>
    </div>
  );
}

// ==================== LEVEL UP BUTTON ====================

function LevelUpButton({ onLevelUp }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <motion.button whileHover={{ scale: 1.1, boxShadow: '0 0 30px #8b5cf6' }} onClick={onLevelUp}
        style={{ background: '#8b5cf6', border: 'none', padding: '1rem 3rem', color: '#000', fontWeight: 'bold', borderRadius: '30px', cursor: 'pointer' }}>
        LEVEL UP
      </motion.button>
    </div>
  );
}

export default App;