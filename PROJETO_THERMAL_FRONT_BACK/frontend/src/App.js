import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DataAnalysis from './pages/DataAnalysis';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Help from './pages/Help';
import './assets/styles.css';
// Importe o logo no topo do arquivo
import logoImage from './assets/images/LogoXTentDark.png';

// Criar contexto para o tema
export const ThemeContext = createContext();

// Componente NavLink personalizado com ícones e detecção de rota ativa
const NavLink = ({ to, icon, label, badge }) => {
  return (
    <RouterNavLink 
      to={to} 
      className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
    >
      <i className={icon}></i>
      <span>{label}</span>
      {badge && <span className="nav-badge">{badge}</span>}
    </RouterNavLink>
  );
};

// Componente do Cabeçalho
const Header = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(new Date());
  const [opened, setOpened] = useState(false);
  
  // Efeito de scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Atualizador de tempo
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <>
      <header className={`header-container ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-left">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setOpened(!opened)}
          >
            <i className="fas fa-bars"></i>
          </button>
          
          <div className="logo-container">
            <img 
              src={logoImage} 
              alt="xtent" 
              className="logo-image" 
            />
            <div className="logo-text">
              <span className="logo">Neural Lens</span>
              <span className="company">by xtent</span>
            </div>
          </div>
        </div>
        
        <div className="system-title">Sistema de Monitoramento Avançado</div>
        
        <div className="header-right">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'}`}></i>
          </button>
          
          <div className="current-time">
            <i className="far fa-clock"></i>
            {time.toLocaleTimeString()} 
          </div>
          
          <div className="user-menu">
            <i className="fas fa-user-circle"></i>
            <span>Admin</span>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </header>
      
      <nav className={`nav-menu ${scrolled ? 'scrolled' : ''} ${opened ? 'opened' : ''}`}>
        <div className="nav-container">
          <NavLink to="/" icon="fas fa-tachometer-alt" label="Dashboard" />
          <NavLink to="/data-analysis" icon="fas fa-chart-line" label="Análise de Dados" />
          <NavLink to="/alerts" icon="fas fa-bell" label="Alertas" badge="3" />
          <NavLink to="/reports" icon="fas fa-file-alt" label="Relatórios" />
          <NavLink to="/settings" icon="fas fa-cog" label="Configurações" />
          <NavLink to="/help" icon="fas fa-question-circle" label="Ajuda" />
        </div>
      </nav>
      
      <div className="logo-container">
        <span className="logo">
          <i className="fas fa-microchip"></i> Neural Lens
        </span>
        <span className="company">by xtent</span>
      </div>

      <div className="system-title">Sistema de Monitoramento Avançado</div>
    </>
  );
};

// Componente Footer
const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-left">
          © 2023 Neural Lens by xtent
        </div>
        <div className="footer-right">
          <span>Versão 1.2.0</span>
          <a href="#status" className="system-status">
            <span className="status-dot online"></span> Sistema Online
          </a>
        </div>
      </div>
    </footer>
  );
};

// Componente App principal
const App = () => {
  // Estado do tema (dark/light)
  const [theme, setTheme] = useState(() => {
    // Verificar preferência salva no localStorage
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });
  
  // Alternar entre temas dark/light
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  // Aplicar classe de tema ao elemento body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Router>
        <div className={`app-container ${theme}`}>
          <Header theme={theme} toggleTheme={toggleTheme} />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/data-analysis" element={<DataAnalysis />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeContext.Provider>
  );
};

export default App;