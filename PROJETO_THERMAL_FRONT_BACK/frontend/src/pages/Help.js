import React, { useState } from 'react';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const faqItems = [
    {
      id: 'temperature',
      question: 'Como posso configurar os limites de temperatura?',
      answer: 'Para configurar os limites de temperatura, acesse o menu "Configurações" e selecione a opção "Geral". Lá você encontrará opções para definir o limite de alerta e o limite crítico de temperatura.'
    },
    {
      id: 'notifications',
      question: 'Como desativar as notificações?',
      answer: 'Para desativar as notificações, vá para "Configurações > Notificações" e desmarque a opção "Habilitar Notificações". Você pode também personalizar quais tipos de alertas você deseja receber.'
    },
    {
      id: 'stream',
      question: 'Por que o stream de vídeo está lento?',
      answer: 'A lentidão no stream de vídeo pode ocorrer devido a vários fatores como: conexão de rede lenta, resolução muito alta da câmera ou limitações de hardware. Tente reduzir a resolução nas configurações de vídeo ou verifique sua conexão de rede.'
    },
    {
      id: 'reports',
      question: 'Como exportar um relatório em Excel?',
      answer: 'Para exportar um relatório em Excel, acesse a página "Relatórios", selecione o tipo de dados e o período desejado, e escolha "Excel" como formato de saída. Em seguida, clique em "Gerar Relatório" e o download será iniciado automaticamente.'
    },
    {
      id: 'sensors',
      question: 'Como adicionar um novo sensor ao sistema?',
      answer: 'Para adicionar um novo sensor, vá para "Configurações > Sensores" e clique em "Adicionar Novo Sensor". Preencha as informações como o nome, tipo e local do sensor, e siga as instruções na tela para concluir a configuração.'
    }
  ];

  // Filtrar FAQs com base na pesquisa
  const filteredFaqs = searchQuery 
    ? faqItems.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="title-divider">Centro de Ajuda</h1>
      </div>
      
      <div className="help-container">
        <div className="help-search">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Pesquisar ajuda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="clear-search" 
                onClick={() => setSearchQuery('')}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
        
        {searchQuery ? (
          <div className="search-results">
            <h2>Resultados da Pesquisa</h2>
            {filteredFaqs.length === 0 ? (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <p>Nenhum resultado encontrado para "{searchQuery}"</p>
                <button 
                  className="button" 
                  onClick={() => setSearchQuery('')}
                >
                  Limpar Pesquisa
                </button>
              </div>
            ) : (
              <div className="faq-list">
                {filteredFaqs.map(item => (
                  <div key={item.id} className="faq-item">
                    <div className="faq-question">
                      <i className="fas fa-question-circle"></i>
                      {item.question}
                    </div>
                    <div className="faq-answer">
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="help-content">
            <div className="help-sidebar">
              <div className="help-nav">
                <button 
                  className={`help-nav-item ${activeCategory === 'getting-started' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('getting-started')}
                >
                  <i className="fas fa-play-circle"></i> Introdução
                </button>
                <button 
                  className={`help-nav-item ${activeCategory === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('dashboard')}
                >
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </button>
                <button 
                  className={`help-nav-item ${activeCategory === 'analysis' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('analysis')}
                >
                  <i className="fas fa-chart-line"></i> Análise de Dados
                </button>
                <button 
                  className={`help-nav-item ${activeCategory === 'alerts' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('alerts')}
                >
                  <i className="fas fa-bell"></i> Alertas
                </button>
                <button 
                  className={`help-nav-item ${activeCategory === 'reports' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('reports')}
                >
                  <i className="fas fa-file-alt"></i> Relatórios
                </button>
                <button 
                  className={`help-nav-item ${activeCategory === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('settings')}
                >
                  <i className="fas fa-cog"></i> Configurações
                </button>
                <button 
                  className={`help-nav-item ${activeCategory === 'faq' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('faq')}
                >
                  <i className="fas fa-question-circle"></i> FAQ
                </button>
              </div>
              
              <div className="help-contact">
                <h3>Precisa de mais ajuda?</h3>
                <button className="button primary">
                  <i className="fas fa-headset"></i> Contatar Suporte
                </button>
              </div>
            </div>
            
            <div className="help-main">
              {activeCategory === 'getting-started' && (
                <div className="content-card">
                  <h2><i className="fas fa-play-circle"></i> Introdução ao ThermalGuard</h2>
                  <div className="help-section">
                    <p>
                      Bem-vindo ao Sistema de Monitoramento Térmico ThermalGuard! Este sistema foi projetado para monitorar 
                      e analisar dados de temperatura em tempo real, fornecendo alertas e relatórios detalhados.
                    </p>
                    
                    <h3>Principais Recursos</h3>
                    <ul className="feature-list">
                      <li>
                        <i className="fas fa-video"></i>
                        <div>
                          <strong>Stream de Vídeo em Tempo Real</strong>
                          <p>Visualize o ambiente monitorado com stream de vídeo ao vivo</p>
                        </div>
                      </li>
                      <li>
                        <i className="fas fa-temperature-high"></i>
                        <div>
                          <strong>Monitoramento de Temperatura</strong>
                          <p>Acompanhe as variações de temperatura com precisão</p>
                        </div>
                      </li>
                      <li>
                        <i className="fas fa-bell"></i>
                        <div>
                          <strong>Sistema de Alertas</strong>
                          <p>Receba notificações em tempo real quando limites são ultrapassados</p>
                        </div>
                      </li>
                      <li>
                        <i className="fas fa-chart-line"></i>
                        <div>
                          <strong>Análise de Dados Avançada</strong>
                          <p>Visualize tendências e faça previsões com base em dados históricos</p>
                        </div>
                      </li>
                      <li>
                        <i className="fas fa-file-export"></i>
                        <div>
                          <strong>Relatórios Personalizados</strong>
                          <p>Gere relatórios detalhados em múltiplos formatos</p>
                        </div>
                      </li>
                    </ul>
                    
                    <div className="video-tutorial">
                      <h3>Tutorial em Vídeo</h3>
                      <div className="tutorial-placeholder">
                        <i className="fas fa-play-circle"></i>
                        <p>Tutorial de Introdução ao ThermalGuard</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeCategory === 'faq' && (
                <div className="content-card">
                  <h2><i className="fas fa-question-circle"></i> Perguntas Frequentes</h2>
                  <div className="faq-list">
                    {faqItems.map(item => (
                      <div key={item.id} className="faq-item">
                        <div className="faq-question">
                          <i className="fas fa-question-circle"></i>
                          {item.question}
                        </div>
                        <div className="faq-answer">
                          {item.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeCategory !== 'getting-started' && activeCategory !== 'faq' && (
                <div className="content-card">
                  <h2>
                    <i className={`fas fa-${
                      activeCategory === 'dashboard' ? 'tachometer-alt' : 
                      activeCategory === 'analysis' ? 'chart-line' :
                      activeCategory === 'alerts' ? 'bell' :
                      activeCategory === 'reports' ? 'file-alt' : 'cog'
                    }`}></i> 
                    {activeCategory === 'dashboard' ? 'Ajuda do Dashboard' : 
                     activeCategory === 'analysis' ? 'Ajuda da Análise de Dados' :
                     activeCategory === 'alerts' ? 'Ajuda dos Alertas' :
                     activeCategory === 'reports' ? 'Ajuda dos Relatórios' : 'Ajuda das Configurações'}
                  </h2>
                  <div className="help-section">
                    <p className="coming-soon">
                      <i className="fas fa-tools"></i>
                      Esta seção de ajuda está em desenvolvimento. Por favor, consulte as perguntas frequentes ou entre em contato com o suporte para obter assistência.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Help;