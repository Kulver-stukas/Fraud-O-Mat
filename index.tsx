import "./index.css";
import type { AnalysisReport, CriterionId, Locale, QuotaStatus, Tone } from "./shared/types";

const TRANSLATIONS = {
  ru: {
    slogan: "Анализируем громкие обещания. Иронизируем. Помогаем думать.",
    analyses: "Бесплатные анализы",
    reset: "Сброс квоты",
    connecting: "OpenRouter — скоро",
    connectSub: "Личные квоты в следующей версии",
    inputHeading: "Вставьте текст для анализа",
    examples: "Примеры:",
    tabs: ["Текст", "URL · скоро", "Файл · скоро"],
    placeholder: "Вставьте сюда рекламный текст, коммерческое предложение или письмо, которое обещает слишком много...",
    privacyTitle: "Конфиденциальность",
    privacy: "Не отправляйте личные данные, платёжные реквизиты и коммерческие тайны. Текст будет обработан провайдером модели.",
    analyze: "Анализировать",
    busy: "Анализируем...",
    sampleNames: ["Криптокурс", "Инвестпроект", "Фитнес-челлендж", "Честный стартап"],
    result: "Результат",
    copy: "Копировать отчёт",
    demo: "Пример результата — без обращения к API",
    live: "Результат анализа",
    formalHeading: "Аналитический разбор",
    formalSub: "Шесть критериев, оценки по тексту и основания выводов",
    satireHeading: "Сатирический комментарий",
    satireSub: "Те же факты, но без рекламного оптимизма",
    heuristic: "Индекс красных флагов",
    level: ["Низкий", "Умеренный", "Высокий"],
    recommendation: "Вывод и рекомендация",
    caveat: "Ограничение оценки:",
    note: "Эвристический индекс по представленному тексту; не доказательство мошенничества.",
    observations: "Особенно примечательно",
    tone: "Стиль комментария",
    tones: ["Мягкий", "Классический", "Жёсткий"],
    toneHint: "Выбранный стиль применяется при следующем анализе.",
    footer: "Fraud-O-Mat не проверяет факты независимо и не даёт юридических заключений.",
    quotaPending: "Загрузка квоты...",
    quotaNotReady: "Общая квота ещё не настроена",
    quotaFailure: "Не удалось загрузить квоту",
    remaining: "осталось",
    empty: "Введите текст предложения.",
    tooLong: "Текст превышает лимит 20 000 символов.",
    exhausted: "Общая квота на сегодня исчерпана.",
    error: "Не удалось завершить анализ. Попробуйте позже.",
    errors: {
      MODEL_RATE_LIMIT: "Лимит Gemini временно исчерпан. Повторите запрос позже.",
      QUOTA_EXHAUSTED: "Лимит бесплатных анализов на сегодня исчерпан.",
      QUOTA_NOT_CONFIGURED: "Серверный счётчик квоты пока не подключён.",
      MODEL_NOT_CONFIGURED: "Серверная модель не настроена.",
      QUOTA_UNAVAILABLE: "Счётчик квоты временно недоступен.",
      ANALYSIS_FAILED: "Модель вернула ошибку или некорректный формат ответа.",
    },
    copied: "Скопировано",
    copyError: "Не удалось скопировать",
    criteria: {
      transparency: ["Прозрачность модели", "Кто, что и на каких условиях предлагает"],
      participant_risk: ["Риски участника", "Что произойдёт, если обещания не сбудутся"],
      disguised_sales: ["Маскировка продаж", "Насколько прямо обозначена сделка"],
      pressure: ["Давление и срочность", "Дедлайны, дефицит, эмоциональный нажим"],
      value: ["Содержательная ценность", "Есть ли проверяемый продукт или результат"],
      distribution: ["Распределение выгод", "Кто получает выгоду и несёт риск"],
    },
  },
  en: {
    slogan: "We examine big promises. We add irony. You decide.",
    analyses: "Free analyses",
    reset: "Quota resets",
    connecting: "OpenRouter — coming soon",
    connectSub: "Personal quotas in a later version",
    inputHeading: "Paste an offer to analyze",
    examples: "Examples:",
    tabs: ["Text", "URL · later", "File · later"],
    placeholder: "Paste an ad, offer, commercial proposal or email that promises rather too much...",
    privacyTitle: "Privacy",
    privacy: "Do not submit personal data, payment details or confidential business information. Your text is processed by the model provider.",
    analyze: "Analyze",
    busy: "Analyzing...",
    sampleNames: ["Crypto course", "Investment pitch", "Fitness challenge", "Honest startup"],
    result: "Result",
    copy: "Copy report",
    demo: "Sample report — no API calls",
    live: "Generated report",
    formalHeading: "Formal analysis",
    formalSub: "Six criteria, text-based scores and supporting evidence",
    satireHeading: "Satirical commentary",
    satireSub: "The same material, with rather less marketing optimism",
    heuristic: "Red flag index",
    level: ["Low", "Moderate", "High"],
    recommendation: "Conclusion and recommendation",
    caveat: "Assessment limits:",
    note: "A heuristic index based on the submitted text, not evidence of fraud.",
    observations: "Especially noteworthy",
    tone: "Satire style",
    tones: ["Gentle", "Classic", "Sharp"],
    toneHint: "Your selected style will apply to the next analysis.",
    footer: "Fraud-O-Mat does not independently verify facts or provide legal opinions.",
    quotaPending: "Loading quota...",
    quotaNotReady: "Shared quota has not been configured",
    quotaFailure: "Could not load quota",
    remaining: "left",
    empty: "Enter the text of an offer.",
    tooLong: "The text exceeds 20,000 characters.",
    exhausted: "Today's free quota has been exhausted.",
    error: "Could not finish the analysis. Please try again later.",
    errors: {
      MODEL_RATE_LIMIT: "Gemini's limit has been reached. Please try later.",
      QUOTA_EXHAUSTED: "Today's free report quota has been exhausted.",
      QUOTA_NOT_CONFIGURED: "The shared quota store has not yet been configured.",
      MODEL_NOT_CONFIGURED: "The model has not yet been configured on the server.",
      QUOTA_UNAVAILABLE: "The quota service is temporarily unavailable.",
      ANALYSIS_FAILED: "The model failed or returned an invalid response.",
    },
    copied: "Copied",
    copyError: "Could not copy",
    criteria: {
      transparency: ["Model transparency", "Who sells what and on what terms"],
      participant_risk: ["Participant risk", "What happens if the promises fail"],
      disguised_sales: ["Disguised sales", "How clearly the commercial transaction is described"],
      pressure: ["Pressure and urgency", "Deadlines, scarcity and emotional leverage"],
      value: ["Substantive value", "An identifiable product or real deliverable"],
      distribution: ["Distribution of benefits", "Who profits and who bears the downside"],
    },
  },
} as const;

const SAMPLES = [
  {
    ru: "Вы устали работать за зарплату? Наш эксклюзивный курс по криптовалютам гарантирует доход от 5 000 $ уже в первый месяц. Никаких специальных знаний! Более 10 000 выпускников изменили свою жизнь. Только сегодня доступ по специальной цене. Осталось три места. Результаты зависят только от вашей мотивации!",
    en: "Tired of working for a salary? Our exclusive crypto course guarantees $5,000 in your first month. No prior knowledge needed! Over 10,000 graduates have changed their lives. Special price today only; just three spots left. Your results depend only on your motivation!",
  },
  {
    ru: "Инвестируйте 100 000 рублей в инновационную стратегию. Потенциальная доходность до 45% годовых. Детали бизнес-модели раскрываются после внесения депозита. Предложение действует до конца недели.",
    en: "Invest $2,000 in our innovative strategy. Potential annual returns of up to 45%. Our business model is disclosed once you make a deposit. This offer expires at the end of the week.",
  },
  {
    ru: "Новый фитнес-челлендж: тело мечты за 14 дней! Участие стоит 12 900 рублей. Отзывы впечатляют, а подробности программы получите после оплаты. Запишитесь прямо сейчас.",
    en: "Our new fitness challenge: your dream body in 14 days! Enrollment is $199. Testimonials are amazing, and you'll get the program details once you pay. Sign up right now.",
  },
  {
    ru: "Мы разрабатываем приложение для малого бизнеса. Сейчас доступен бесплатный пилот для первых 20 компаний. Нет обещаний экономии или доходности; мы хотим проверить спрос, собрать обратную связь и опубликовать тарифы после пилота.",
    en: "We are building an app for small businesses. A free pilot is available to the first 20 companies. We make no claims about savings or returns; we're testing demand, collecting feedback and will publish pricing after the pilot.",
  },
];

const DEMO_RU = {
  formal: {
    headline: "Слишком много гарантий при недостатке проверяемых условий",
    summary: "Предложение опирается на обещание быстрого заработка и социальное подтверждение, не раскрывая механизм доходности или доказательства результата.",
    caveat: "Оценивался только текст предложения; реальные данные о продукте и продавце не проверялись.",
    recommendation: "Не оплачивать курс до проверки договора, условий возврата, программы обучения и независимых подтверждений заявленных результатов.",
    riskIndex: 7.8,
    riskLevel: "high" as const,
    criteria: [
      { id: "transparency", risk: 2, explanation: "Механизм дохода не раскрыт.", evidence: "«гарантирует доход от 5 000 $»" },
      { id: "participant_risk", risk: 2, explanation: "Риски и условия возврата не указаны.", evidence: "«Результаты зависят только от вашей мотивации»" },
      { id: "disguised_sales", risk: 3, explanation: "Продажа подаётся как личная трансформация.", evidence: "«изменили свою жизнь»" },
      { id: "pressure", risk: 3, explanation: "Используются ограничение времени и дефицит мест.", evidence: "«Только сегодня», «Осталось три места»" },
      { id: "value", risk: 2, explanation: "Нет конкретной программы и проверяемых результатов.", evidence: "«Никаких специальных знаний!»" },
      { id: "distribution", risk: 2, explanation: "Доход продавца ясен, выгода покупателя не доказана.", evidence: "«специальной цене»" },
    ],
  },
  satire: {
    title: "Миллионер после вебинара (ну… почти)",
    paragraphs: [
      "Авторы этого предложения, похоже, нашли способ отменить неопределённость финансовых рынков. Правда, подробности способа предлагается узнать после оплаты.",
      "Особенно удобно, что успех гарантирован рекламой, а неудача заранее объяснена недостатком вашей мотивации.",
    ],
    observations: [
      "Гарантированный доход без описания механизма.",
      "Тысячи счастливых выпускников без проверяемой статистики.",
      "Три оставшихся места, о количестве которых знает только реклама.",
    ],
    conclusion: "Если курс действительно настолько эффективен, независимая проверка условий ему не повредит.",
  },
  model: "demo",
} satisfies Omit<AnalysisReport, "quota">;

const DEMO_EN = {
  formal: {
    headline: "Strong guarantees, few independently checkable details",
    summary: "The offer promises quick earnings and invokes social proof without providing a clear mechanism, verifiable outcomes, or meaningful contract terms.",
    caveat: "Only the submitted wording was reviewed. The seller and product have not been verified independently.",
    recommendation: "Do not pay before reviewing the contract, refunds, course syllabus and independently corroborated outcomes.",
    riskIndex: 7.8,
    riskLevel: "high" as const,
    criteria: [
      { id: "transparency", risk: 2, explanation: "The revenue mechanism is unclear.", evidence: "“guarantees $5,000”" },
      { id: "participant_risk", risk: 2, explanation: "Downside and refund terms are missing.", evidence: "“depend only on your motivation”" },
      { id: "disguised_sales", risk: 3, explanation: "A sale is framed as personal transformation.", evidence: "“changed their lives”" },
      { id: "pressure", risk: 3, explanation: "Urgency and scarcity are used.", evidence: "“today only”, “three spots left”" },
      { id: "value", risk: 2, explanation: "The deliverables remain vague.", evidence: "“No prior knowledge needed”" },
      { id: "distribution", risk: 2, explanation: "Seller benefits are clearer than buyer benefits.", evidence: "“Special price”" },
    ],
  },
  satire: {
    title: "Millionaire by the end of the webinar (more or less)",
    paragraphs: [
      "The authors appear to have found a way to eliminate uncertainty from financial markets. The explanation is available after checkout.",
      "A pleasant arrangement: advertising guarantees success, while lack of motivation explains any failure.",
    ],
    observations: [
      "Guaranteed income, mechanism not included.",
      "Thousands of happy students; no independently checkable statistics.",
      "Three remaining seats, according to the advertisement.",
    ],
    conclusion: "If the offer is as effective as claimed, independent scrutiny should be welcome.",
  },
  model: "demo",
} satisfies Omit<AnalysisReport, "quota">;

const state: {
  locale: Locale; tone: Tone; offer: string; quota: QuotaStatus | null;
  report: AnalysisReport | null; loading: boolean; quotaError: boolean; message: string;
} = {
  locale: navigator.language.toLowerCase().startsWith("en") ? "en" : "ru",
  tone: "classic",
  offer: "",
  quota: null,
  report: null,
  loading: false,
  quotaError: false,
  message: "",
};

const app = document.querySelector<HTMLDivElement>("#app")!;
function t() { return TRANSLATIONS[state.locale]; }
function escapeHtml(input: unknown): string {
  return String(input ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] || char);
}

const CAT = `<svg class="cat-svg" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
  <circle cx="60" cy="60" r="56" fill="#e7d8b8" stroke="#1d252e" stroke-width="3"/>
  <path d="M31 51 27 19 49 35 70 31 95 18 91 54" fill="#25272a" stroke="#101519" stroke-width="3" stroke-linejoin="round"/>
  <path d="M42 35 34 27 35 42M80 34 88 26 86 42" fill="#b0aaa1"/>
  <ellipse cx="61" cy="62" rx="34" ry="30" fill="#65625c"/>
  <path d="M32 59Q58 40 89 59L85 77Q60 91 36 77Z" fill="#c1b7a6"/>
  <path d="M39 52h19l5 3h20l-1 13-5 5H65l-5-7-4 7H42l-6-6-1-14z" fill="#11191e"/>
  <path d="M61 60h-1" stroke="#d8c5a1" stroke-width="4"/>
  <path d="M52 76q8 8 16 0" fill="none" stroke="#303235" stroke-width="2"/>
  <path d="M53 71 61 76 68 71" fill="#27272a"/>
  <path d="M22 95q11-12 27-14l11 13 12-13q19 2 29 14v14H22Z" fill="#222a32"/>
  <path d="M49 81 60 95l12-14-4 22-8 8-8-8z" fill="#f3f0e8"/>
  <path d="M59 94 64 94 69 114 57 114z" fill="#ac3334"/>
  <path d="M22 95l16 5-5 8m67-13-16 5 6 8" stroke="#585b61" fill="none" stroke-width="2"/>
  <path d="M37 77 16 73m22 9-22 2m69-7 19-4m-19 9 20 3" stroke="#262a2c" stroke-width="2"/>
</svg>`;

function levelIndex(level: AnalysisReport["formal"]["riskLevel"]): number {
  return level === "high" ? 2 : level === "medium" ? 1 : 0;
}

function shell() {
  const d = t();
  document.documentElement.lang = state.locale;
  document.title = "Fraud-O-Mat · Bullshit Detector";
  app.innerHTML = `
  <div class="page-shell">
    <header class="masthead">
      <div class="identity">
        <div class="cat-mark">${CAT}</div>
        <div class="brand">
          <div class="brand-line"><h1>Fraud-O-Mat</h1><span class="version">v3.4</span></div>
          <span class="red-stamp">BULLSHIT DETECTOR</span>
        </div>
        <p class="tagline">${escapeHtml(d.slogan)}</p>
      </div>
      <div class="mast-actions">
        <div class="language-switch" role="group" aria-label="Language">
          <button data-lang="ru" class="${state.locale === "ru" ? "selected" : ""}" aria-pressed="${state.locale === "ru"}">RU</button>
          <button data-lang="en" class="${state.locale === "en" ? "selected" : ""}" aria-pressed="${state.locale === "en"}">EN</button>
        </div>
        <section class="quota-card" aria-label="${escapeHtml(d.analyses)}">
          <div class="quota-top"><span>⚡ ${escapeHtml(d.analyses)}</span><strong id="quota-left">—</strong></div>
          <div class="quota-track"><div id="quota-progress" class="quota-progress"></div></div>
          <div id="quota-reset" class="quota-bottom" aria-live="polite">${escapeHtml(d.quotaPending)}</div>
        </section>
        <button class="connect-button" disabled title="${escapeHtml(d.connectSub)}">
          <span class="link-icon">↗</span>
          <span><strong>${escapeHtml(d.connecting)}</strong><small>${escapeHtml(d.connectSub)}</small></span>
        </button>
      </div>
    </header>

    <main>
      <section class="input-card">
        <div class="input-top">
          <h2><span class="label-icon">▣</span>${escapeHtml(d.inputHeading)}</h2>
          <div class="examples"><span>${escapeHtml(d.examples)}</span>
            ${d.sampleNames.map((name, i) => `<button class="example-pill" data-example="${i}">${escapeHtml(name)}</button>`).join("")}
          </div>
        </div>
        <div class="input-tabs" role="group" aria-label="Input type">
          <button class="tab active" aria-pressed="true">▤ ${escapeHtml(d.tabs[0])}</button>
          <button class="tab" disabled title="Coming later">↗ ${escapeHtml(d.tabs[1])}</button>
          <button class="tab" disabled title="Coming later">⇧ ${escapeHtml(d.tabs[2])}</button>
        </div>
        <div class="input-content">
          <div class="textarea-wrap">
            <textarea id="offer" maxlength="20000" spellcheck="true" placeholder="${escapeHtml(d.placeholder)}"></textarea>
            <div id="chars" class="char-count">0 / 20 000</div>
          </div>
          <aside class="input-aside">
            <div class="privacy-card"><span class="privacy-icon">◇</span><div><strong>${escapeHtml(d.privacyTitle)}</strong><p>${escapeHtml(d.privacy)}</p></div></div>
            <div class="run-options">
              <span class="minor-label">${escapeHtml(d.tone)}</span>
              <div class="tone-switch" role="group" aria-label="${escapeHtml(d.tone)}">
                ${(["soft","classic","sharp"] as Tone[]).map((tone, i) =>
                  `<button data-tone="${tone}" class="${state.tone === tone ? "active" : ""}" aria-pressed="${state.tone === tone}">${escapeHtml(d.tones[i])}</button>`).join("")}
              </div>
            </div>
            <button id="analyze" class="analyze-button"><span class="sparkle">✦</span><span id="analyze-label">${escapeHtml(d.analyze)}</span><span>→</span></button>
          </aside>
        </div>
        <div id="message" class="message" role="alert" aria-live="polite"></div>
      </section>

      <section class="results-section" aria-label="${escapeHtml(d.result)}">
        <div class="results-bar">
          <div class="results-label"><span class="results-chip">${escapeHtml(d.result)}</span>
            <span id="report-status" class="status-label">${escapeHtml(d.demo)}</span></div>
          <button id="copy-report" class="copy-button">▣ ${escapeHtml(d.copy)}</button>
        </div>
        <div class="result-grid">
          <article class="result-panel formal-panel">
            <div class="panel-header"><div class="panel-heading"><span class="number-icon navy">01</span><div><h2>${escapeHtml(d.formalHeading)}</h2><p>${escapeHtml(d.formalSub)}</p></div></div><div id="risk-meter" class="risk-meter"></div></div>
            <div id="formal-body"></div>
          </article>
          <article class="result-panel satire-panel">
            <div class="panel-header"><div class="panel-heading"><span class="number-icon violet">02</span><div><h2>${escapeHtml(d.satireHeading)}</h2><p>${escapeHtml(d.satireSub)}</p></div></div></div>
            <div id="satire-body"></div>
          </article>
        </div>
      </section>
    </main>
    <footer class="footer"><span>© 2026 Fraud-O-Mat · v3.4</span><span>${escapeHtml(d.footer)}</span></footer>
  </div>`;

  const textarea = document.querySelector<HTMLTextAreaElement>("#offer")!;
  textarea.value = state.offer;
  textarea.addEventListener("input", () => {
    state.offer = textarea.value;
    updateCount();
    setMessage("");
    updateAnalyzeButton();
  });
  textarea.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      void analyze();
    }
  });
  document.querySelectorAll<HTMLButtonElement>("[data-lang]").forEach((button) =>
    button.addEventListener("click", () => {
      const next = button.dataset.lang as Locale;
      if (next !== state.locale) { state.locale = next; shell(); }
    })
  );
  document.querySelectorAll<HTMLButtonElement>("[data-tone]").forEach((button) =>
    button.addEventListener("click", () => {
      state.tone = button.dataset.tone as Tone;
      document.querySelectorAll<HTMLButtonElement>("[data-tone]").forEach((b) => {
        const active = b.dataset.tone === state.tone;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", String(active));
      });
    })
  );
  document.querySelectorAll<HTMLButtonElement>("[data-example]").forEach((button) =>
    button.addEventListener("click", () => {
      state.offer = SAMPLES[Number(button.dataset.example)][state.locale];
      textarea.value = state.offer;
      updateCount();
      updateAnalyzeButton();
      setMessage("");
      textarea.focus();
    })
  );
  document.querySelector("#analyze")!.addEventListener("click", () => { void analyze(); });
  document.querySelector("#copy-report")!.addEventListener("click", () => { void copyReport(); });
  updateCount();
  updateQuotaUI();
  updateAnalyzeButton();
  renderReport();
  setMessage(state.message);
}

function updateCount() {
  const count = document.querySelector("#chars");
  if (count) count.textContent = state.offer.length.toLocaleString(state.locale) + " / 20 000";
}

function setMessage(message: string) {
  state.message = message;
  const element = document.querySelector("#message");
  if (element) {
    element.textContent = message;
    element.classList.toggle("visible", Boolean(message));
  }
}

function updateQuotaUI() {
  const d = t();
  const quota = state.quota;
  const left = document.querySelector("#quota-left");
  const reset = document.querySelector("#quota-reset");
  const progress = document.querySelector<HTMLElement>("#quota-progress");
  if (!left || !reset || !progress) return;
  const total = quota ? Math.floor(quota.dailyRequests / quota.requestsPerAnalysis) : 10;
  if (!quota || quota.state !== "ready" || quota.remainingAnalyses === null) {
    left.textContent = "— / " + total;
    reset.textContent = state.quotaError ? d.quotaFailure : quota?.state === "unconfigured" ? d.quotaNotReady : d.quotaPending;
    progress.style.width = "0%";
    return;
  }
  left.textContent = quota.remainingAnalyses + " / " + total;
  progress.style.width = String(Math.min(100, quota.remainingAnalyses / Math.max(1, total) * 100)) + "%";
  reset.textContent = d.reset + ": " + new Intl.DateTimeFormat(state.locale, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(quota.resetAt));
}

function updateAnalyzeButton() {
  const btn = document.querySelector<HTMLButtonElement>("#analyze");
  const label = document.querySelector("#analyze-label");
  if (!btn || !label) return;
  const usable = state.quota?.state === "ready" &&
    (state.quota.remainingAnalyses ?? 0) > 0;
  btn.disabled = state.loading || !usable;
  label.textContent = state.loading ? t().busy : t().analyze;
  btn.classList.toggle("busy", state.loading);
}

async function refreshQuota() {
  try {
    const response = await fetch("/api/quota", { cache: "no-store" });
    if (!response.ok) throw new Error("Quota request failed");
    const quota = await response.json() as QuotaStatus;
    state.quota = quota;
    state.quotaError = false;
  } catch {
    state.quotaError = true;
    state.quota = null;
  }
  updateQuotaUI();
  updateAnalyzeButton();
}

async function analyze() {
  const d = t();
  if (!state.offer.trim()) { setMessage(d.empty); return; }
  if (state.offer.length > 20000) { setMessage(d.tooLong); return; }
  if (state.loading) return;
  if (state.quota?.state !== "ready") { setMessage(d.quotaNotReady); return; }
  if ((state.quota.remainingAnalyses || 0) <= 0) { setMessage(d.exhausted); return; }
  state.loading = true;
  setMessage("");
  updateAnalyzeButton();
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offer: state.offer.trim(), locale: state.locale, tone: state.tone }),
    });
    const body = await response.json() as AnalysisReport & { error?: string };
    if (body.quota) state.quota = body.quota;
    if (!response.ok) {
      const error = body.error || "";
      const translated = d.errors[error as keyof typeof d.errors];
      throw new Error(translated || d.error);
    }
    state.report = body;
    renderReport();
    document.querySelector(".results-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    setMessage(error instanceof Error ? error.message : d.error);
  } finally {
    state.loading = false;
    updateQuotaUI();
    updateAnalyzeButton();
    void refreshQuota();
  }
}

function report(): AnalysisReport {
  if (state.report) return state.report;
  const demo = state.locale === "ru" ? DEMO_RU : DEMO_EN;
  return {
    ...(demo as Omit<AnalysisReport, "quota">),
    quota: state.quota || {
      state: "unconfigured", dailyRequests: 20, requestsPerAnalysis: 2,
      remainingAnalyses: null, usedRequests: null, resetAt: new Date().toISOString(),
    },
  };
}

function renderReport() {
  const current = report();
  const d = t();
  const isDemo = !state.report;
  const status = document.querySelector("#report-status");
  if (status) status.textContent = isDemo ? d.demo : d.live;

  const formal = current.formal;
  const riskLevel = formal.riskLevel === "high" ? "high" : formal.riskLevel === "medium" ? "medium" : "low";
  const meter = document.querySelector("#risk-meter");
  if (meter) meter.innerHTML = `<div class="meter-arc ${riskLevel}" aria-hidden="true">◔</div>
    <div><span class="meter-caption">${escapeHtml(d.heuristic)}</span>
    <strong class="meter-score">${Number(formal.riskIndex).toFixed(1)} <small>/ 10</small></strong>
    <span class="meter-risk">${escapeHtml(d.level[levelIndex(riskLevel)])}</span></div>`;

  const formalBody = document.querySelector("#formal-body");
  if (formalBody) {
    formalBody.innerHTML = `
      <p class="report-summary">${escapeHtml(formal.summary)}</p>
      <div class="criteria-list">${formal.criteria.map((c) => {
        const descriptor = d.criteria[c.id as CriterionId] || d.criteria.transparency;
        const value = Math.max(0, Math.min(3, Number(c.risk) || 0));
        return `<section class="criteria-row">
          <div class="criteria-mark criterion-${escapeHtml(c.id)}">✦</div>
          <div class="criteria-copy"><strong>${escapeHtml(descriptor[0])}</strong>
            <small>${escapeHtml(c.explanation || descriptor[1])}</small></div>
          <div class="criteria-bar" aria-label="${value} / 3"><div style="width:${value / 3 * 100}%"></div></div>
          <b class="criteria-value">${value} / 3</b>
          <blockquote class="criteria-evidence">${escapeHtml(c.evidence)}</blockquote>
        </section>`;
      }).join("")}</div>
      <div class="recommendation"><span class="recommendation-icon">☼</span><div><strong>${escapeHtml(d.recommendation)}</strong>
        <p>${escapeHtml(formal.recommendation)}</p>
        <small>${escapeHtml(d.caveat)} ${escapeHtml(formal.caveat)}</small></div></div>
      <p class="heuristic-note">${escapeHtml(d.note)}</p>`;
  }

  const satireBody = document.querySelector("#satire-body");
  if (satireBody) satireBody.innerHTML = `<div class="roast-paper">
    <div class="roast-mark">“</div>
    <h3>${escapeHtml(current.satire.title)}</h3>
    ${current.satire.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
    <div class="observations"><strong>${escapeHtml(d.observations)}</strong>
    <ul>${current.satire.observations.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul></div>
    <p class="roast-conclusion">${escapeHtml(current.satire.conclusion)}</p>
    </div>`;
}

async function copyReport() {
  const r = report();
  const d = t();
  const content = [
    "Fraud-O-Mat · " + d.formalHeading,
    r.formal.headline,
    d.heuristic + ": " + r.formal.riskIndex.toFixed(1) + "/10",
    r.formal.summary,
    ...r.formal.criteria.map((c) =>
      d.criteria[c.id][0] + ": " + c.risk + "/3 — " + c.explanation + " [" + c.evidence + "]"),
    d.recommendation + ": " + r.formal.recommendation,
    "",
    d.satireHeading + ": " + r.satire.title,
    ...r.satire.paragraphs,
    ...r.satire.observations.map((x) => "• " + x),
    r.satire.conclusion,
    "",
    d.note,
  ].join("\n");
  try {
    await navigator.clipboard.writeText(content);
    const button = document.querySelector("#copy-report");
    if (button) {
      button.textContent = "✓ " + d.copied;
      window.setTimeout(() => { button.textContent = "▣ " + d.copy; }, 1700);
    }
  } catch {
    setMessage(d.copyError);
  }
}

shell();
void refreshQuota();
window.setInterval(() => { void refreshQuota(); }, 60_000);
