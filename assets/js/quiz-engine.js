class QuizEngine {
  constructor({ containerId, dataUrl }) {
    this.container = document.getElementById(containerId);
    this.dataUrl = dataUrl;
    this.questions = [];
    this.current = 0;
    this.score = 0;
  }

  async init() {
    const res = await fetch(this.dataUrl);
    const data = await res.json();
    this.questions = data.questions;
    this.render();
    this.updateProgress();
  }

  render() {
    const q = this.questions[this.current];
    if (!q) return this.showResult();

    this.container.innerHTML = `
      <div class="quiz-question">
        <h2>${q.question}</h2>
        <div class="quiz-options">
          ${q.options
            .map(
              (opt, i) =>
                `<button class="quiz-btn" data-index="${i}">${opt}</button>`
            )
            .join('')}
        </div>
      </div>
    `;

    document.querySelectorAll('.quiz-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = Number(btn.dataset.index);
        this.checkAnswer(index);
      });
    });
  }

  checkAnswer(index) {
    const correct = this.questions[this.current].answer;

    if (index === correct) {
      this.score++;
      const scoreEl = document.getElementById('score');
      if (scoreEl) scoreEl.innerText = `Puntaje: ${this.score}`;
    }

    this.current++;
    this.updateProgress();
    this.render();
  }

  updateProgress() {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;
    const percent = (this.current / this.questions.length) * 100;
    bar.style.width = percent + '%';
  }

  showResult() {
    const total = this.questions.length;
    let message = 'Buen intento';

    if (this.score === total) message = '¡Perfecto! 🏆';
    else if (this.score >= total * 0.7) message = '¡Muy bien! 🎉';
    else if (this.score >= total * 0.4) message = 'Bien, sigue practicando 👍';

    this.container.innerHTML = `
      <div class="quiz-result">
        <h2>${message}</h2>
        <p>Resultado final: ${this.score} / ${total}</p>
        <button onclick="location.reload()">Reintentar</button>
      </div>
    `;

    this.updateProgress();
  }
}
 