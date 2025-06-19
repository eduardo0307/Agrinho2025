(() => {
  // ===================================
  //  FUNCIONALIDADE DAS ABAS (TABS)
  // ===================================
  const tabs = document.querySelectorAll('nav button[role="tab"]');
  const panels = document.querySelectorAll('main section[role="tabpanel"]');

  function activateTab(tab) {
    tabs.forEach(t => {
      t.classList.remove('active');
      document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll('.tutorial-card a[href^="#tutorial-"]').forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').replace('#', '');
            const tabButton = document.querySelector(`button[data-tab="${targetId}"]`);
            if (tabButton) {
              tabButton.click();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          });
        });
      });
      t.setAttribute('aria-selected', 'false');
      t.tabIndex = -1;
    });
    panels.forEach(panel => {
      panel.classList.remove('active');
    });

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.tabIndex = 0;
    
    const activePanel = document.getElementById(tab.dataset.tab);
    if (activePanel) {
      activePanel.classList.add('active');
      activePanel.focus({ preventScroll: true });
    }
  }

  function moveFocus(currentTab, direction) {
    const tabsArray = Array.from(tabs);
    let index = tabsArray.indexOf(currentTab);
    index = (index + direction + tabsArray.length) % tabsArray.length;
    tabsArray[index].focus();
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', e => {
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          moveFocus(tab, -1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveFocus(tab, 1);
          break;
        case 'Home':
          e.preventDefault();
          tabs[0].focus();
          break;
        case 'End':
          e.preventDefault();
          tabs[tabs.length - 1].focus();
          break;
      }
    });
  });

  // Ativar a primeira aba no carregamento
  if (tabs.length > 0) {
    activateTab(tabs[0]);
  }

  // ===================================
  //  MODO CLARO/ESCURO
  // ===================================
  const themeToggle = document.getElementById('theme-toggle');

  // Verifica o tema preferido do usuário ou salva o tema atual
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    // Atualiza o ícone com base no tema salvo
    if (savedTheme === 'dark-mode') {
      themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    } else {
      themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
    }
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Se não há tema salvo, verifica a preferência do sistema
    document.body.classList.add('dark-mode');
    themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    let theme = 'light-mode'; // Padrão
    if (document.body.classList.contains('dark-mode')) {
      theme = 'dark-mode';
      themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    } else {
      themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
    }
    localStorage.setItem('theme', theme);
    ajustarTitulosParaModoEscuro(); // Reaplicar o ajuste dos títulos
  });


  // ===================================
  //  FUNCIONALIDADE DA GALERIA DE IMAGENS
  // ===================================
  const galleryGrid = document.getElementById('gallery-grid');
  const modal = document.getElementById('gallery-modal');
  const modalImage = document.getElementById('modal-image');
  const modalCaption = document.getElementById('modal-caption');
  const modalCloseButton = document.getElementById('modal-close-button');
  const modalPrevButton = document.getElementById('modal-prev');
  const modalNextButton = document.getElementById('modal-next');

  const images = [
    { src: 'https://via.placeholder.com/600x400/8bc34a/ffffff?text=Crescimento+Sustentavel', caption: 'Agricultura sustentável e o futuro do agronegócio.' },
    { src: 'https://via.placeholder.com/600x400/4caf50/ffffff?text=Inovacao+no+Campo', caption: 'Tecnologia de ponta otimizando a produção no campo.' },
    { src: 'https://via.placeholder.com/600x400/388e3c/ffffff?text=Colheita+Farta', caption: 'A recompensa do trabalho árduo: uma colheita abundante.' },
    { src: 'https://via.placeholder.com/600x400/689f38/ffffff?text=Agro+e+Tecnologia', caption: 'A união perfeita entre o agro e a inteligência artificial.' },
    { src: 'https://via.placeholder.com/600x400/8bc34a/ffffff?text=Campo+Verde', caption: 'Vastas plantações em harmonia com a natureza.' },
    { src: 'https://via.placeholder.com/600x400/4caf50/ffffff?text=Maquinario+Moderno', caption: 'Máquinas modernas que impulsionam a eficiência no campo.' },
    { src: 'https://via.placeholder.com/600x400/388e3c/ffffff?text=Produtor+Rural', caption: 'O produtor rural, a força que alimenta o mundo.' },
    { src: 'https://via.placeholder.com/600x400/689f38/ffffff?text=Vida+no+Campo', caption: 'A beleza e a tranquilidade da vida no campo.' }
  ];

  let currentImageIndex = 0;

  function renderGallery() {
    galleryGrid.innerHTML = ''; // Limpa a grade antes de adicionar as imagens
    images.forEach((img, index) => {
      const galleryItem = document.createElement('div');
      galleryItem.classList.add('gallery-item');
      galleryItem.setAttribute('tabindex', '0'); // Torna o item focável
      galleryItem.setAttribute('role', 'button'); // Indica que é um botão
      galleryItem.setAttribute('aria-label', `Abrir imagem: ${img.caption}`);

      const imageElement = document.createElement('img');
      imageElement.src = img.src;
      imageElement.alt = img.caption;

      const captionElement = document.createElement('div');
      captionElement.classList.add('caption');
      captionElement.textContent = img.caption;

      galleryItem.appendChild(imageElement);
      galleryItem.appendChild(captionElement);
      galleryGrid.appendChild(galleryItem);

      galleryItem.addEventListener('click', () => openModal(index));
      galleryItem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(index);
        }
      });
    });
  }

  function openModal(index) {
    currentImageIndex = index;
    modalImage.src = images[currentImageIndex].src;
    modalImage.alt = images[currentImageIndex].caption;
    modalCaption.textContent = images[currentImageIndex].caption;
    modal.style.display = 'block';
    modal.focus(); // Foca no modal para acessibilidade
    document.body.style.overflow = 'hidden'; // Evita rolagem do body
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restaura rolagem do body
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    modalImage.src = images[currentImageIndex].src;
    modalImage.alt = images[currentImageIndex].caption;
    modalCaption.textContent = images[currentImageIndex].caption;
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    modalImage.src = images[currentImageIndex].src;
    modalImage.alt = images[currentImageIndex].caption;
    modalCaption.textContent = images[currentImageIndex].caption;
  }

  modalCloseButton.addEventListener('click', closeModal);
  modalPrevButton.addEventListener('click', showPrevImage);
  modalNextButton.addEventListener('click', showNextImage);

  // Fechar modal com a tecla ESC
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    }
  });

 
// ===================================
//  LÓGICA DO QUIZ CORRIGIDA
// ===================================
const quizDifficultySelection = document.querySelector('.quiz-difficulty-selection');
const quizArea = document.getElementById('quiz-area');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizNextButton = document.getElementById('quiz-next');
const quizFeedback = document.getElementById('quiz-feedback');
const quizScoreDisplay = document.getElementById('quiz-score');
const quizTimerDisplay = document.getElementById('quiz-timer');
const quizResults = document.getElementById('quiz-results');
const finalScoreDisplay = document.getElementById('final-score');
const quizRestartButton = document.getElementById('quiz-restart');
const rankingList = document.getElementById('ranking-list');

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 0;
let quizDifficulty = 'facil'; // Default

const questions = {
  facil: [
    { question: "Qual o principal cereal cultivado no Brasil?", options: ["Trigo", "Milho", "Arroz", "Soja"], correct: "Soja" },
    { question: "Que animal é a base da pecuária leiteira?", options: ["Ovelha", "Gado", "Porco", "Galinha"], correct: "Gado" },
    { question: "Qual fertilizante é rico em Nitrogênio, Fósforo e Potássio?", options: ["Ureia", "Calcário", "NPK", "Gesso"], correct: "NPK" },
    { question: "Qual fruta é típica do Brasil e muito exportada?", options: ["Maçã", "Banana", "Abacate", "Morango"], correct: "Banana" },
    { question: "O que usamos para molhar plantas em tempos secos?", options: ["Trator", "Adubo", "Água", "Inseticida"], correct: "Água" },
    { question: "Qual o nome da plantação de milho, feijão e outros?", options: ["Pomar", "Horta", "Lavoura", "Viveiro"], correct: "Lavoura" },
    { question: "O que o agricultor usa para cortar a terra?", options: ["Trator", "Enxada", "Tesoura", "Pá"], correct: "Enxada" },
    { question: "Qual é o nome do lugar onde vivem vacas e bois?", options: ["Celeiro", "Estábulo", "Curral", "Silo"], correct: "Curral" },
    { question: "Qual é a estação ideal para o plantio?", options: ["Verão", "Outono", "Inverno", "Primavera"], correct: "Primavera" },
    { question: "O que é usado para proteger plantas contra pragas?", options: ["Fertilizante", "Herbicida", "Inseticida", "Calcário"], correct: "Inseticida" }
  ],
  medio: [
    { question: "Qual o bioma brasileiro mais associado à produção de grãos?", options: ["Amazônia", "Mata Atlântica", "Cerrado", "Caatinga"], correct: "Cerrado" },
    { question: "A sigla ILPF significa:", options: ["Integração Lavoura-Pecuária-Floresta", "Indústria de Leite e Produtos Frescos", "Irrigação Linear por Fertilizantes", "Índice de Lucro por Faturamento"], correct: "Integração Lavoura-Pecuária-Floresta" },
    { question: "O que é agricultura de precisão?", options: ["Uso de drones e sensores", "Cultivo em casa", "Plantio manual", "Venda em feiras"], correct: "Uso de drones e sensores" },
    { question: "Qual o papel da Embrapa?", options: ["Fazer leis", "Financiar lavouras", "Realizar pesquisas agrícolas", "Importar alimentos"], correct: "Realizar pesquisas agrícolas" },
    { question: "Qual máquina é usada na colheita?", options: ["Trator", "Plantadeira", "Colheitadeira", "Pulverizador"], correct: "Colheitadeira" },
    { question: "Qual técnica evita erosão no solo?", options: ["Queimada", "Plantio Direto", "Irrigação", "Pecuária intensiva"], correct: "Plantio Direto" },
    { question: "O que é agrotóxico?", options: ["Produto que fertiliza", "Produto que combate pragas", "Alimento orgânico", "Adubo natural"], correct: "Produto que combate pragas" },
    { question: "Como chamamos o cultivo sem produtos químicos?", options: ["Transgênico", "Orgânico", "Convencional", "Industrial"], correct: "Orgânico" },
    { question: "Qual o nome do gás gerado em biodigestores?", options: ["Oxigênio", "Gás carbônico", "Metano", "Etanol"], correct: "Metano" },
    { question: "Qual é a função do GPS na agricultura?", options: ["Conectar à internet", "Medir produtividade", "Navegação e mapeamento", "Produzir energia"], correct: "Navegação e mapeamento" }
  ],
  dificil: [
    { question: "Qual doença afeta a soja e reduz sua produtividade?", options: ["Ferrugem asiática", "Mofo branco", "Mancha-parda", "Oídio"], correct: "Ferrugem asiática" },
    { question: "Qual energia é usada para bombear água em áreas isoladas?", options: ["Solar fotovoltaica", "Hidrelétrica", "Biomassa", "Eólica"], correct: "Solar fotovoltaica" },
    { question: "O que é rastreabilidade?", options: ["Controle do solo", "Origem do produto do campo à mesa", "Produção com drones", "Identificação genética"], correct: "Origem do produto do campo à mesa" },
    { question: "O que é Zoneamento Agrícola de Risco Climático?", options: ["Tipo de colheita", "Calendário de pragas", "Previsão de produtividade", "Orientação sobre época segura para plantio"], correct: "Orientação sobre época segura para plantio" },
    { question: "O que são bioinsumos?", options: ["Remédios para humanos", "Produtos químicos", "Insumos biológicos para agricultura", "Defensivos tóxicos"], correct: "Insumos biológicos para agricultura" },
    { question: "Qual equipamento analisa umidade do solo?", options: ["Drone", "GPS", "Sensor de solo", "Trator autônomo"], correct: "Sensor de solo" },
    { question: "Qual é a principal fonte de emissão de metano no campo?", options: ["Tratores", "Fertilizantes", "Fermentação entérica de bovinos", "Queimadas"], correct: "Fermentação entérica de bovinos" },
    { question: "O que significa 'agricultura regenerativa'?", options: ["Uso intensivo da terra", "Produção sem colheita", "Práticas que restauram o solo e a biodiversidade", "Plantio contínuo sem rotação"], correct: "Práticas que restauram o solo e a biodiversidade" },
    { question: "O que é um SAF (Sistema Agroflorestal)?", options: ["Plantio urbano", "Cultivo com árvores, lavouras e animais", "Sistema de irrigação", "Aplicativo de controle"], correct: "Cultivo com árvores, lavouras e animais" },
    { question: "Qual cultura brasileira mais utiliza sementes transgênicas?", options: ["Arroz", "Feijão", "Soja", "Trigo"], correct: "Soja" }
  ],
  impossivel: [
    { question: "Em que ano a Embrapa foi criada?", options: ["1973", "1960", "1985", "1955"], correct: "1973" },
    { question: "Principal componente do GNV de origem agrícola?", options: ["GLP", "Biodiesel", "Biometano", "Álcool"], correct: "Biometano" },
    { question: "O que é 'sequestro de carbono no solo'?", options: ["Remoção de carbono do solo", "Captura de carbono atmosférico no solo", "Carbono como fertilizante", "Formação de carvão mineral"], correct: "Captura de carbono atmosférico no solo" },
    { question: "Processo de retorno de água da planta à atmosfera:", options: ["Evaporação", "Condensação", "Transpiração", "Infiltração"], correct: "Transpiração" },
    { question: "Função do banco de sementes?", options: ["Vender sementes", "Preservar diversidade genética", "Produzir OGM", "Controle de mercado"], correct: "Preservar diversidade genética" },
    { question: "Qual foi o 1º país a liberar soja transgênica?", options: ["Brasil", "EUA", "Argentina", "Canadá"], correct: "EUA" },
    { question: "Quem criou o conceito de Agricultura de Precisão?", options: ["Embrapa", "FAO", "John Deere", "Universidade de Minnesota"], correct: "Universidade de Minnesota" },
    { question: "O que significa 'AgTech'?", options: ["Aplicativo de agropecuária", "Tecnologia voltada para o agronegócio", "Agro de alta produtividade", "Empresa de sementes"], correct: "Tecnologia voltada para o agronegócio" },
    { question: "Qual o impacto da rotação de culturas?", options: ["Reduz produtividade", "Aumenta erosão", "Melhora solo e quebra ciclos de pragas", "Aumenta uso de venenos"], correct: "Melhora solo e quebra ciclos de pragas" },
    { question: "O que é georreferenciamento no campo?", options: ["Localização de propriedades por GPS", "Medir vento", "Uso de mapas de chuva", "Conectar máquinas à internet"], correct: "Localização de propriedades por GPS" }
  ]
};


const timeLimits = {
  facil: 60,
  medio: 40,
  dificil: 30,
  impossivel: 20
};

function startQuiz(difficulty) {
  quizDifficulty = difficulty;
  currentQuestions = [...questions[difficulty]];
  shuffleArray(currentQuestions);
  currentQuestionIndex = 0;
  score = 0;
  updateScore();
  quizDifficultySelection.style.display = 'none';
  quizArea.style.display = 'block';
  quizResults.style.display = 'none';
  quizNextButton.style.display = 'none';
  quizFeedback.textContent = '';
  displayQuestion();
}

function displayQuestion() {
  clearTimeout(timer);
  if (currentQuestionIndex < currentQuestions.length) {
    const questionData = currentQuestions[currentQuestionIndex];
    quizQuestion.textContent = questionData.question;
    quizOptions.innerHTML = '';
    quizFeedback.textContent = '';
    quizNextButton.style.display = 'none';

    const shuffledOptions = [...questionData.options];
    shuffleArray(shuffledOptions);
    shuffledOptions.forEach(option => {
      const button = document.createElement('button');
      button.textContent = option;
      button.classList.add('quiz-option-button');
      button.addEventListener('click', () => checkAnswer(option, questionData.correct));
      quizOptions.appendChild(button);
    });

    timeLeft = timeLimits[quizDifficulty];
    updateTimerDisplay();
    startQuestionTimer();
  } else {
    endQuiz();
  }
}

function startQuestionTimer() {
  if (quizDifficulty !== 'facil') {
    timer = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        clearInterval(timer);
        quizFeedback.textContent = '⏰ Tempo esgotado! A resposta correta era: ' + currentQuestions[currentQuestionIndex].correct;
        quizFeedback.classList.add('incorrect');
        disableOptions();
        quizNextButton.style.display = 'block';
      }
    }, 1000);
  } else {
    quizTimerDisplay.textContent = 'Tempo: Sem limite';
  }
}

function updateTimerDisplay() {
  if (quizDifficulty !== 'facil') {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    quizTimerDisplay.textContent = `Tempo: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

function checkAnswer(selectedOption, correctAnswer) {
  clearInterval(timer);
  const buttons = quizOptions.querySelectorAll('button');
  buttons.forEach(button => {
    button.disabled = true;
    if (button.textContent === correctAnswer) {
      button.classList.add('correct');
    } else if (button.textContent === selectedOption) {
      button.classList.add('incorrect');
    }
  });

  if (selectedOption === correctAnswer) {
    score += 10;
    quizFeedback.textContent = '✅ Correto!';
    quizFeedback.classList.remove('incorrect');
    quizFeedback.classList.add('correct');
  } else {
    quizFeedback.textContent = '❌ Incorreto. A resposta correta era: ' + correctAnswer;
    quizFeedback.classList.remove('correct');
    quizFeedback.classList.add('incorrect');
  }

  updateScore();
  quizNextButton.style.display = 'block';
}

function displayNextQuestion() {
  quizNextButton.style.display = 'none';
  quizFeedback.textContent = '';
  currentQuestionIndex++;
  displayQuestion();
}

function disableOptions() {
  const buttons = quizOptions.querySelectorAll('button');
  buttons.forEach(button => button.disabled = true);
}

function updateScore() {
  quizScoreDisplay.textContent = `Pontuação: ${score}`;
}

function endQuiz() {
  clearTimeout(timer);
  quizArea.style.display = 'none';
  quizResults.style.display = 'block';
  finalScoreDisplay.textContent = score;
  saveRanking(score, quizDifficulty);
  displayRanking();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function saveRanking(newScore, difficulty) {
  let ranking = JSON.parse(localStorage.getItem('quizRanking')) || [];
  ranking.push({ score: newScore, difficulty: difficulty, date: new Date().toLocaleString() });
  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem('quizRanking', JSON.stringify(ranking.slice(0, 10)));
}

function displayRanking() {
  const ranking = JSON.parse(localStorage.getItem('quizRanking')) || [];
  rankingList.innerHTML = '';
  if (ranking.length === 0) {
    rankingList.innerHTML = '<li>Nenhuma pontuação registrada ainda.</li>';
    return;
  }
  ranking.forEach((entry, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${index + 1}. ${entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1)}</span> <strong>${entry.score} pontos</strong> <span>(${entry.date})</span>`;
    rankingList.appendChild(li);
  });
}

document.querySelectorAll('.difficulty-button').forEach(button => {
  button.addEventListener('click', (e) => {
    startQuiz(e.target.dataset.difficulty);
  });
});

quizNextButton.addEventListener('click', displayNextQuestion);

quizRestartButton.addEventListener('click', () => {
  quizDifficultySelection.style.display = 'block';
  quizArea.style.display = 'none';
  quizResults.style.display = 'none';
  quizScoreDisplay.textContent = 'Pontuação: 0';
  quizTimerDisplay.textContent = 'Tempo: --:--';
  displayRanking();
});

displayRanking();


  // ===================================
  //  FUNCIONALIDADE DE TRADUÇÃO
  // ===================================
  const translations = {
    'pt-BR': {
      inicio: 'Início',
      quiz: 'Quiz',
      depoimentos: 'Depoimentos',
      galeria: 'Galeria',
      sobre: 'Sobre Nós',
      referencias: 'Referências',
      contato: 'Contato',
      boasvindas: 'Sementes que aproximam vidas e cultivam o futuro.',
      // Adicione mais traduções aqui conforme necessário
    },
    'en-US': {
      inicio: 'Home',
      quiz: 'Quiz',
      depoimentos: 'Testimonials',
      galeria: 'Gallery',
      sobre: 'About Us',
      referencias: 'References',
      contato: 'Contact',
      boasvindas: 'Seeds that bring lives closer and cultivate the future.',
      // Adicione mais traduções aqui conforme necessário
    }
  };

  const languageToggle = document.getElementById('language-toggle');
  let currentLanguage = localStorage.getItem('language') || 'pt-BR'; // Padrão

  function applyTranslations(lang) {
    const t = translations[lang];
    document.getElementById('site-title').textContent = t.boasvindas.split(' ')[0]; // Exemplo de tradução parcial para o título do site
    document.getElementById('tab-inicio').textContent = t.inicio;
    document.getElementById('tab-quiz').textContent = t.quiz;
    document.getElementById('tab-depoimentos').textContent = t.depoimentos;
    document.getElementById('tab-galeria').textContent = t.galeria;
    document.getElementById('tab-sobrenos').textContent = t.sobre;
    document.getElementById('tab-referencias').textContent = t.referencias;
    document.getElementById('tab-contato').textContent = t.contato;
    document.getElementById('tab-quiz').textContent = t.quiz;

    const introH1 = document.querySelector('#inicio h1');
    if (introH1) introH1.textContent = t.boasvindas;
    const introP = document.querySelector('#inicio p');
    if (introP) introP.textContent = t.boasvindas; // Apenas para teste, ajustar conforme a frase real
  }

  languageToggle.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'pt-BR' ? 'en-US' : 'pt-BR';
    localStorage.setItem('language', currentLanguage);
    applyTranslations(currentLanguage);
  });

  // Aplica as traduções ao carregar a página
  applyTranslations(currentLanguage);

  function ajustarTitulosParaModoEscuro() {
    document.querySelectorAll('h2, h3').forEach(el => {
      // Remove qualquer estilo inline de cor antes de aplicar
      el.style.color = '';
      if (document.body.classList.contains('dark-mode')) {
        el.style.color = 'var(--color-primary-light)'; // Usa a variável do dark mode para títulos
      } else {
        el.style.color = 'var(--color-primary-dark)'; // Usa a variável do light mode
      }
    });
    // Ajusta o título principal
    const mainTitle = document.querySelector('#inicio h1');
    if (mainTitle) {
      mainTitle.style.color = '';
      if (document.body.classList.contains('dark-mode')) {
        mainTitle.style.color = 'var(--color-primary-light)';
      } else {
        mainTitle.style.color = 'var(--color-primary-dark)';
      }
    }
  }
  
  ajustarTitulosParaModoEscuro(); // Ajusta ao carregar
  
  // Sempre que o botão de tema for clicado, reaplica o ajuste
  document.getElementById('theme-toggle').addEventListener('click', () => {
    // Pequeno atraso para garantir que a classe 'dark-mode' seja aplicada
    setTimeout(ajustarTitulosParaModoEscuro, 100);
  });
  
  // Feedback sonoro para cliques
  const clickSound = new Audio('click.mp3'); // Adicione um som de clique leve
  const correctSound = new Audio('correct.mp3'); // Adicione um som para resposta correta
  const wrongSound = new Audio('wrong.mp3'); // Adicione um som para resposta incorreta

  document.addEventListener('click', (event) => {
    // Reproduz o som para botões, links e itens de galeria
    if (event.target.tagName === 'BUTTON' || event.target.tagName === 'A' || event.target.classList.contains('gallery-item')) {
      clickSound.play().catch(e => console.error("Erro ao tocar o som de clique:", e));
    }
  });

  // Renderiza a galeria ao carregar a página
  renderGallery();

  // Adiciona o foco automático no primeiro elemento interativo da tab ativa
  function setInitialFocus() {
    const activePanel = document.querySelector('main section.active');
    if (activePanel) {
      const firstFocusable = activePanel.querySelector('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }

  // Chama a função após o DOM ser completamente carregado
  document.addEventListener('DOMContentLoaded', setInitialFocus);
  // Adiciona a função ao listener de clique das tabs para re-focar
  tabs.forEach(tab => {
      tab.addEventListener('click', () => {
          activateTab(tab);
          // Pequeno delay para garantir que a seção esteja visível antes de focar
          setTimeout(setInitialFocus, 50);
      });
  });

})();

