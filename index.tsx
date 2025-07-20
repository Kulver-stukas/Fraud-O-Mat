/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import showdown from 'showdown';

// --- START INTERNATIONALIZATION (I18N) ---
const translations = {
    ru: {
        APP_TITLE: "Разводк-О-Мат v3.3",
        PAGE_SUBTITLE: "Последовательный анализ сомнительных офферов: формальная оценка и саркастический комментарий.",
        INPUT_SECTION_SR_LABEL: "Ввод текста оффера",
        INPUT_LABEL: "Введите текст оффера или коммерческого предложения для анализа:",
        TEXTAREA_PLACEHOLDER: "Вставьте сюда текст оффера...",
        TEXTAREA_ARIA_LABEL: "Текст оффера для анализа",
        ANALYZE_BUTTON: "Анализировать",
        ANALYZE_BUTTON_ARIA_LABEL: "Начать анализ оффера",
        FORMAL_PANEL_DEFAULT_TITLE: "Формальный анализ",
        SARCASTIC_PANEL_DEFAULT_TITLE: "Саркастический комментарий",
        LOADING_FORMAL: "Анализирую... Пожалуйста, подождите.",
        LOADING_SARCASTIC: "Саркастический ум размышляет...",
        ERROR_INPUT_EMPTY: "Пожалуйста, введите текст оффера для анализа.",
        ERROR_CONFIG: "Ошибка конфигурации: API ключ не найден или недействителен. Пожалуйста, убедитесь, что API_KEY установлен в переменных окружения и действителен.",
        ERROR_INIT_FAILED: "Ошибка инициализации приложения: не найдены ключевые элементы страницы для одного или обоих анализаторов.",
        ERROR_FORMAL_API_BASE: "Произошла ошибка при формальном анализе оффера.",
        ERROR_SARCASTIC_API_BASE: "Произошла ошибка при саркастическом анализе оффера.",
        ERROR_UNEXPECTED: "Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз.",
        SARCASTIC_ANALYSIS_CANCELLED_MSG: "Формальный анализ не был успешно завершен, поэтому саркастический анализ не может быть выполнен.",
        SARCASTIC_ANALYSIS_CANCELLED_TITLE: "Саркастический анализ отменен",
        FOOTER_TEXT: "&copy; 2024 Разводк-О-Мат v3.3. Все права защищены (но это не точно).",
        SCORE_LINE_PREFIX: "Оценка Разводк-О-Мат:",
        SCORE_REGEX_PATTERN: "^Оценка Разводк-О-Мат:\\s*(\\d+)\\/10",
        PROMPT_TEMPLATE_HEADER: `Ты выступаешь в роли ассистента "Разводк-О-Мат", созданного для анализа коммерческих предложений, инвестиционных офферов и авторских курсов с точки зрения:
- этичности,
- прозрачности бизнес-модели,
- манипулятивных приёмов,
- реализуемости заявленных выгод,
- и вероятного распределения рисков и доходов.

Проанализируй следующий текст оффера:
"""
`,
        PROMPT_TEMPLATE_FOOTER: `
"""

Применяй следующие **6 критериев оценки** (по шкале от 0 до 3):
1. **Прозрачность модели** — как чётко и честно описано, откуда берётся доход, как окупается участие.
2. **Оценка риска** — есть ли реальные потери у участника, если гипотезы автора не сработают.
3. **Маскировка продаж** — использует ли автор дружелюбный нарратив вместо чёткой сделки.
4. **Манипуляции и нажим** — ограниченность времени, эмоциональные крючки, навязывание вины.
5. **Ценностное наполнение** — передаётся ли реальный навык, опыт, продукт или только образы и обещания.
6. **Распределение выгод** — кому реально достаётся ценность, возможен ли эффект zero-sum.

**Выведи таблицу** с краткими оценками по каждому критерию и пояснением. Форматируй таблицу используя markdown.

Затем подведи **итоговую оценку доверия (0–10)** и выведи **рекомендацию**:
- Игнорировать
- С осторожностью
- Переговоры возможны
- Надежно

Обязательно укажи **маркер риска** (например: ⚠️ Высокий риск, ✅ Низкий риск, ❗ Средний риск).

Не используй сарказм и переход на личности. Стиль — аналитический, прямой, деловой.

**Важно**: Отвечай на том же языке, на котором написан анализируемый текст оффера.

Ответ должен включать:
0. **Первой строкой ответа ОБЯЗАТЕЛЬНО выведи**: "Оценка Разводк-О-Мат: X/10" (где X — **целочисленная** итоговая оценка доверия **от 0 до 10**).
1. Диагностику по 6 критериям (в виде markdown таблицы)
2. Пояснение к итоговой оценке (сама оценка выведена отдельной первой строкой).
3. Маркер риска (⚠️ / ✅ / ❗)
4. Рекомендацию
`,
        PROMPT_SARCASTIC_ANALYST_INTRO: `Ты — аналитик манипулятивных маркетинговых схем, циничный и остроумный, но без явных обвинений в мошенничестве. Твоя задача — вскрывать риторические уловки, маркетинговую демагогию, завуалированные схемы привлечения денег и сомнительные способы убеждения.
`,
        PROMPT_SARCASTIC_ANALYST_OFFER_TEXT_LABEL: `
Ты анализируешь следующий **исходный текст оффера**:
"""
`,
        PROMPT_SARCASTIC_ANALYST_FORMAL_ANALYSIS_LABEL: `
"""

При этом, **учитывай следующий предварительный формальный анализ**, но НЕ ПОВТОРЯЙ его выводы, а используй для более глубокого саркастического комментария:
"""
`,
        PROMPT_SARCASTIC_ANALYST_INSTRUCTION_AFTER_INPUTS: `
"""

Твой анализ должен быть основан на **исходном тексте оффера**, но с учетом данных из формального анализа.
`,
        PROMPT_SARCASTIC_ANALYST_FOOTER: `
При этом:
- Не используешь слово "scam", "fraud", "мошенничество".
- Говоришь как бы "между строк", с умной иронией.
- Показываешь, какие приёмы используются: FOMO, social proof, authority bias, obfuscated pricing, emotional pressure и т.п.
- Не даёшь юридических советов, но оцениваешь **логическую убедительность** и **маркетинговую этичность**.

Говори кратко, с долей сарказма. Ориентир — рецензия опытного маркетолога, ушедшего в индустрию после серии разочарований.

Всегда отвечай в структуре:
1. Краткий вердикт (одно-два предложения).
2. Главные триггеры / приёмы.
3. Вывод о соотношении риска и пользы.

Если текст прозрачен и честен — так и скажи: "Редкий случай — здесь всё открыто и честно. Похвально."

Если текст выглядит особенно подозрительно и напоминает известные схемы обмана, не стесняйся предложить меткую историческую или культурную аналогию (например, "классическая инфоцыганская воронка 2010-х", "в духе великих комбинаторов" или "старые песни о главном от мира финансов"). Делай это остроумно и к месту.

Избегай общих фраз, отвечай по существу.
Ответ должен быть в текстовом формате, можно использовать markdown для списков или выделения.

**Ключевое требование**: Всегда отвечай на том же языке, на котором написан анализируемый текст оффера.
`,
        FORMAL_PANEL_TITLES: ["Анализ документа", "Экспертная оценка", "Формальное заключение", "Разбор по существу", "Результаты анализа", "Аналитический отчет"],
        SARCASTIC_PANEL_TITLES_LOW_SCORE: ["Тревожный звоночек!", "Осторожно, минное поле!", "Здесь пахнет разводом!", "Держите кошелек покрепче!", "Сигнал 'SOS' для вашего бюджета"],
        SARCASTIC_PANEL_TITLES_MID_SCORE: ["Скептический взгляд", "Есть нюансы...", "Не всё так гладко", "Под лупой сарказма", "Читаем между строк"],
        SARCASTIC_PANEL_TITLES_HIGH_SCORE: ["Ну, допустим...", "Почти без подвоха?", "Удивили (не сарказм)", "Можно рассмотреть... с опаской", "Неожиданно достойно"],
        SARCASTIC_PANEL_TITLES_DEFAULT: ["Мнение (очень) частного лица", "Как я это вижу", "Пара мыслей вслух", "Без протокола", "Комментарий циника"],
    },
    en: {
        APP_TITLE: "Scam-O-Mat v3.3",
        PAGE_SUBTITLE: "Sequential analysis of dubious offers: formal assessment and sarcastic commentary.",
        INPUT_SECTION_SR_LABEL: "Offer Text Input",
        INPUT_LABEL: "Enter the text of the offer or commercial proposal for analysis:",
        TEXTAREA_PLACEHOLDER: "Paste the offer text here...",
        TEXTAREA_ARIA_LABEL: "Offer text for analysis",
        ANALYZE_BUTTON: "Analyze",
        ANALYZE_BUTTON_ARIA_LABEL: "Start offer analysis",
        FORMAL_PANEL_DEFAULT_TITLE: "Formal Analysis",
        SARCASTIC_PANEL_DEFAULT_TITLE: "Sarcastic Commentary",
        LOADING_FORMAL: "Analyzing... Please wait.",
        LOADING_SARCASTIC: "Sarcastic mind at work...",
        ERROR_INPUT_EMPTY: "Please enter the offer text for analysis.",
        ERROR_CONFIG: "Configuration error: API key not found or invalid. Please ensure API_KEY is set in environment variables and is valid.",
        ERROR_INIT_FAILED: "Application initialization error: key page elements for one or both analyzers were not found.",
        ERROR_FORMAL_API_BASE: "An error occurred during the formal analysis of the offer.",
        ERROR_SARCASTIC_API_BASE: "An error occurred during the sarcastic analysis of the offer.",
        ERROR_UNEXPECTED: "An unexpected error occurred. Please try again.",
        SARCASTIC_ANALYSIS_CANCELLED_MSG: "Formal analysis was not successfully completed, so sarcastic analysis cannot be performed.",
        SARCASTIC_ANALYSIS_CANCELLED_TITLE: "Sarcastic Analysis Cancelled",
        FOOTER_TEXT: "&copy; 2024 Scam-O-Mat v3.3. All rights reserved (but not really).",
        SCORE_LINE_PREFIX: "Scam-O-Mat Score:",
        SCORE_REGEX_PATTERN: "^Scam-O-Mat Score:\\s*(\\d+)\\/10",
        PROMPT_TEMPLATE_HEADER: `You are an assistant "Scam-O-Mat", designed to analyze commercial proposals, investment offers, and author courses from the perspective of:
- ethics,
- transparency of the business model,
- manipulative techniques,
- feasibility of the stated benefits,
- and a likely distribution of risks and income.

Analyze the following offer text:
"""
`,
        PROMPT_TEMPLATE_FOOTER: `
"""

Apply the following **6 evaluation criteria** (on a scale of 0 to 3):
1. **Model Transparency** — how clearly and honestly it's described where the income comes from, how participation pays off.
2. **Risk Assessment** — are there real losses for the participant if the author's hypotheses don't work out.
3. **Sales Disguise** — does the author use a friendly narrative instead of a clear deal.
4. **Manipulation and Pressure** — time limits, emotional hooks, guilt-tripping.
5. **Value Content** — is a real skill, experience, product transmitted, or only images and promises.
6. **Benefit Distribution** — who really gets the value, is a zero-sum effect possible.

**Output a table** with brief assessments for each criterion and an explanation. Format the table using markdown.

Then, provide a **final trust score (0–10)** and output a **recommendation**:
- Ignore
- With caution
- Negotiations possible
- Reliable

Be sure to indicate a **risk marker** (e.g., ⚠️ High risk, ✅ Low risk, ❗ Medium risk).

Do not use sarcasm or personal attacks. Style — analytical, direct, business-like.

**Important**: Respond in the same language as the analyzed offer text.

The response must include:
0. **The first line of the response MUST BE**: "Scam-O-Mat Score: X/10" (where X is an **integer** final trust score **from 0 to 10**).
1. Diagnostics based on 6 criteria (as a markdown table)
2. Explanation for the final score (the score itself is on a separate first line).
3. Risk marker (⚠️ / ✅ / ❗)
4. Recommendation
`,
        PROMPT_SARCASTIC_ANALYST_INTRO: `You are an analyst of manipulative marketing schemes, cynical and witty, but without explicit accusations of fraud. Your task is to expose rhetorical tricks, marketing demagoguery, veiled money-making schemes, and questionable persuasion methods.
`,
        PROMPT_SARCASTIC_ANALYST_OFFER_TEXT_LABEL: `
You are analyzing the following **original offer text**:
"""
`,
        PROMPT_SARCASTIC_ANALYST_FORMAL_ANALYSIS_LABEL: `
"""

At the same time, **consider the following preliminary formal analysis**, but DO NOT REPEAT its conclusions; instead, use it for a deeper sarcastic commentary:
"""
`,
        PROMPT_SARCASTIC_ANALYST_INSTRUCTION_AFTER_INPUTS: `
"""

Your analysis should be based on the **original offer text**, but taking into account the data from the formal analysis.
`,
        PROMPT_SARCASTIC_ANALYST_FOOTER: `
In doing so:
- Do not use words like "scam", "fraud".
- Speak "between the lines", with clever irony.
- Show what techniques are used: FOMO, social proof, authority bias, obfuscated pricing, emotional pressure, etc.
- Do not give legal advice, but assess **logical persuasiveness** and **marketing ethics**.

Speak concisely, with a touch of sarcasm. Benchmark — a review by an experienced marketer who left the industry after a series of disappointments.

Always respond in the following structure:
1. Brief verdict (one or two sentences).
2. Main triggers / techniques.
3. Conclusion about the risk-benefit ratio.

If the text is transparent and honest — say so: "A rare case — everything here is open and honest. Commendable."

If the text looks particularly suspicious and resembles known deception schemes, feel free to offer a witty historical or cultural analogy (e.g., "classic info-hustler funnel of the 2010s", "in the spirit of great combinators" or "old wine in new bottles from the world of finance"). Do this wittily and appropriately.

Avoid general phrases, answer to the point.
The response should be in text format; markdown can be used for lists or emphasis.

**Key requirement**: Always respond in the same language as the analyzed offer text.
`,
        FORMAL_PANEL_TITLES: ["Document Analysis", "Expert Assessment", "Formal Conclusion", "Substantive Review", "Analysis Results", "Analytical Report"],
        SARCASTIC_PANEL_TITLES_LOW_SCORE: ["Red Flag Alert!", "Warning: Minefield!", "Something Smells Fishy!", "Hold On To Your Wallet!", "SOS for Your Budget"],
        SARCASTIC_PANEL_TITLES_MID_SCORE: ["A Skeptical Look", "There Are Nuances...", "Not So Smooth", "Under the Sarcasm Lens", "Reading Between the Lines"],
        SARCASTIC_PANEL_TITLES_HIGH_SCORE: ["Well, Alright Then...", "Almost No Catch?", "Surprisingly (Not Sarcasm)", "Worth Considering... With Caution", "Unexpectedly Decent"],
        SARCASTIC_PANEL_TITLES_DEFAULT: ["A (Very) Private Opinion", "How I See It", "A Few Thoughts Aloud", "Off The Record", "Cynic's Commentary"],
    }
};

let currentLang = 'ru'; // Default language
const userBrowserLang = navigator.language.split('-')[0];
if (translations.hasOwnProperty(userBrowserLang)) {
    currentLang = userBrowserLang;
}
const T = translations[currentLang as keyof typeof translations];
// --- END INTERNATIONALIZATION (I18N) ---


// API Key must be in environment variable process.env.API_KEY
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
}

const GEMINI_MODEL = 'gemini-2.5-flash';

function parseScore(responseText: string): number | null {
    if (!responseText) return null;
    const scoreRegex = new RegExp(T.SCORE_REGEX_PATTERN, 'i');
    const match = responseText.match(scoreRegex);
    if (match && match[1]) {
        const score = parseInt(match[1], 10);
        if (!isNaN(score) && score >= 0 && score <= 10) {
            return score;
        }
    }
    return null;
}


document.addEventListener('DOMContentLoaded', () => {
    // Apply translations to HTML elements
    document.documentElement.lang = currentLang;
    const appTitleElement = document.getElementById('appTitle') as HTMLHeadingElement;
    if (appTitleElement) appTitleElement.textContent = T.APP_TITLE;
    const pageTitleElement = document.querySelector('title');
    if (pageTitleElement) pageTitleElement.textContent = T.APP_TITLE;
    
    const appSubtitleElement = document.getElementById('appSubtitle') as HTMLParagraphElement;
    if (appSubtitleElement) appSubtitleElement.textContent = T.PAGE_SUBTITLE;

    const inputSectionSrLabel = document.getElementById('input-label') as HTMLHeadingElement;
    if (inputSectionSrLabel) inputSectionSrLabel.textContent = T.INPUT_SECTION_SR_LABEL;
    
    const offerTextLabelElement = document.getElementById('offerTextLabel') as HTMLLabelElement;
    if (offerTextLabelElement) offerTextLabelElement.textContent = T.INPUT_LABEL;
    
    const offerTextarea = document.getElementById('offerText') as HTMLTextAreaElement;
    if (offerTextarea) {
        offerTextarea.placeholder = T.TEXTAREA_PLACEHOLDER;
        offerTextarea.setAttribute('aria-label', T.TEXTAREA_ARIA_LABEL);
    }
    
    const analyzeButton = document.getElementById('analyzeButton') as HTMLButtonElement;
    if (analyzeButton) {
        analyzeButton.textContent = T.ANALYZE_BUTTON;
        analyzeButton.setAttribute('aria-label', T.ANALYZE_BUTTON_ARIA_LABEL);
    }

    const formalOutputLabelElement = document.getElementById('formal-output-label') as HTMLHeadingElement;
    if (formalOutputLabelElement) formalOutputLabelElement.textContent = T.FORMAL_PANEL_DEFAULT_TITLE;
    
    const sarcasticOutputLabelElement = document.getElementById('sarcastic-output-label') as HTMLHeadingElement;
    if (sarcasticOutputLabelElement) sarcasticOutputLabelElement.textContent = T.SARCASTIC_PANEL_DEFAULT_TITLE;

    const loadingFormalTextElement = document.getElementById('loadingFormalText');
    if (loadingFormalTextElement) loadingFormalTextElement.textContent = T.LOADING_FORMAL;
    
    const loadingSarcasticTextElement = document.getElementById('loadingSarcasticText');
    if (loadingSarcasticTextElement) loadingSarcasticTextElement.textContent = T.LOADING_SARCASTIC;

    const footerTextElement = document.getElementById('footerText');
    if (footerTextElement) footerTextElement.innerHTML = T.FOOTER_TEXT; // Use innerHTML for &copy;

    // Get other DOM elements
    const resultsContainer = document.querySelector('.results-container') as HTMLDivElement;
    const resultDiv = document.getElementById('result') as HTMLDivElement;
    const loadingDiv = document.getElementById('loading') as HTMLDivElement;
    const errorDiv = document.getElementById('error') as HTMLDivElement;

    const sarcasticResultDiv = document.getElementById('sarcasticResult') as HTMLDivElement;
    const sarcasticLoadingDiv = document.getElementById('sarcasticLoading') as HTMLDivElement;
    const sarcasticErrorDiv = document.getElementById('sarcasticError') as HTMLDivElement;
    
    const globalErrorDiv = errorDiv; 

    if (!API_KEY || !ai) {
        if (globalErrorDiv) {
            globalErrorDiv.textContent = T.ERROR_CONFIG;
            globalErrorDiv.style.display = 'block';
            if(resultsContainer) resultsContainer.style.display = 'block'; 
            if(formalOutputLabelElement) formalOutputLabelElement.textContent = T.ERROR_CONFIG.split(':')[0]; // "Ошибка конфигурации" or "Configuration error"
            if(sarcasticOutputLabelElement) sarcasticOutputLabelElement.style.display = 'none';
        } else {
            alert(T.ERROR_CONFIG); 
        }
        if(analyzeButton) analyzeButton.disabled = true;
        if(offerTextarea) offerTextarea.disabled = true;
        if(loadingDiv) loadingDiv.style.display = 'none';
        if(sarcasticLoadingDiv) sarcasticLoadingDiv.style.display = 'none';
        return;
    }

    const markdownConverter = new showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true,
        simpleLineBreaks: true,
        ghCompatibleHeaderId: true,
    });

    if (analyzeButton && offerTextarea && resultsContainer && formalOutputLabelElement && resultDiv && loadingDiv && errorDiv && sarcasticOutputLabelElement && sarcasticResultDiv && sarcasticLoadingDiv && sarcasticErrorDiv) {
        analyzeButton.addEventListener('click', async () => {
            const offerText = offerTextarea.value.trim();
            
            if (!offerText) {
                resultsContainer.style.display = 'block'; 
                formalOutputLabelElement.textContent = T.ERROR_INPUT_EMPTY.split(':')[0]; // "Ошибка ввода" or similar
                sarcasticOutputLabelElement.textContent = ''; 
                errorDiv.textContent = T.ERROR_INPUT_EMPTY;
                errorDiv.style.display = 'block';
                resultDiv.style.display = 'none';
                sarcasticResultDiv.style.display = 'none';
                sarcasticErrorDiv.style.display = 'none';
                loadingDiv.style.display = 'none';
                sarcasticLoadingDiv.style.display = 'none';
                return;
            }

            resultsContainer.style.display = 'flex';
            analyzeButton.disabled = true;
            offerTextarea.disabled = true;

            resultDiv.innerHTML = '';
            resultDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            sarcasticResultDiv.innerHTML = '';
            sarcasticResultDiv.style.display = 'none';
            sarcasticErrorDiv.style.display = 'none';
            
            loadingDiv.style.display = 'flex';
            sarcasticLoadingDiv.style.display = 'flex';

            const currentFormalTitle = T.FORMAL_PANEL_TITLES[Math.floor(Math.random() * T.FORMAL_PANEL_TITLES.length)];
            formalOutputLabelElement.textContent = currentFormalTitle;
            sarcasticOutputLabelElement.textContent = T.SARCASTIC_PANEL_TITLES_DEFAULT[Math.floor(Math.random() * T.SARCASTIC_PANEL_TITLES_DEFAULT.length)];

            let formalAnalysisText = '';
            let parsedScoreVal: number | null = null;

            try {
                const formalPrompt = `${T.PROMPT_TEMPLATE_HEADER}${offerText}${T.PROMPT_TEMPLATE_FOOTER}`;
                try {
                    const formalResponse: GenerateContentResponse = await ai!.models.generateContent({
                        model: GEMINI_MODEL,
                        contents: formalPrompt,
                    });
                    formalAnalysisText = formalResponse.text || '';
                    const htmlContent = markdownConverter.makeHtml(formalAnalysisText);
                    resultDiv.innerHTML = htmlContent;
                    resultDiv.style.display = 'block';

                    parsedScoreVal = parseScore(formalAnalysisText);
                    if (parsedScoreVal !== null) {
                        formalOutputLabelElement.textContent = `${currentFormalTitle} (${parsedScoreVal}/10)`;
                    } else {
                         formalOutputLabelElement.textContent = currentFormalTitle;
                    }
                } catch (formalApiError: any) {
                    console.error('Gemini API error (formal analysis):', formalApiError);
                    let errorMessage = T.ERROR_FORMAL_API_BASE;
                    if (formalApiError && formalApiError.message) {
                        errorMessage += ` Details: ${formalApiError.message}`;
                    }
                    errorDiv.textContent = errorMessage;
                    errorDiv.style.display = 'block';

                    sarcasticOutputLabelElement.textContent = T.SARCASTIC_ANALYSIS_CANCELLED_TITLE;
                    sarcasticResultDiv.innerHTML = `<p>${T.SARCASTIC_ANALYSIS_CANCELLED_MSG}</p>`;
                    sarcasticResultDiv.style.display = 'block';
                    sarcasticErrorDiv.style.display = 'none';
                    sarcasticLoadingDiv.style.display = 'none';
                    throw formalApiError; 
                } finally {
                    loadingDiv.style.display = 'none';
                }

                if (parsedScoreVal !== null) {
                    if (parsedScoreVal <= 3) {
                        sarcasticOutputLabelElement.textContent = T.SARCASTIC_PANEL_TITLES_LOW_SCORE[Math.floor(Math.random() * T.SARCASTIC_PANEL_TITLES_LOW_SCORE.length)];
                    } else if (parsedScoreVal <= 6) {
                        sarcasticOutputLabelElement.textContent = T.SARCASTIC_PANEL_TITLES_MID_SCORE[Math.floor(Math.random() * T.SARCASTIC_PANEL_TITLES_MID_SCORE.length)];
                    } else {
                        sarcasticOutputLabelElement.textContent = T.SARCASTIC_PANEL_TITLES_HIGH_SCORE[Math.floor(Math.random() * T.SARCASTIC_PANEL_TITLES_HIGH_SCORE.length)];
                    }
                }

                const sarcasticPrompt = 
                    `${T.PROMPT_SARCASTIC_ANALYST_INTRO}` +
                    `${T.PROMPT_SARCASTIC_ANALYST_OFFER_TEXT_LABEL}${offerText}` +
                    `${T.PROMPT_SARCASTIC_ANALYST_FORMAL_ANALYSIS_LABEL}${formalAnalysisText}` +
                    `${T.PROMPT_SARCASTIC_ANALYST_INSTRUCTION_AFTER_INPUTS}` +
                    `${T.PROMPT_SARCASTIC_ANALYST_FOOTER}`;

                try {
                    const sarcasticResponse: GenerateContentResponse = await ai!.models.generateContent({
                        model: GEMINI_MODEL,
                        contents: sarcasticPrompt,
                    });
                    const analysisText = sarcasticResponse.text || '';
                    const htmlContent = markdownConverter.makeHtml(analysisText);
                    sarcasticResultDiv.innerHTML = htmlContent;
                    sarcasticResultDiv.style.display = 'block';
                } catch (sarcasticApiError: any) {
                    console.error('Gemini API error (sarcastic analysis):', sarcasticApiError);
                    let errorMessage = T.ERROR_SARCASTIC_API_BASE;
                     if (sarcasticApiError && sarcasticApiError.message) {
                        errorMessage += ` Details: ${sarcasticApiError.message}`;
                    }
                    sarcasticErrorDiv.textContent = errorMessage;
                    sarcasticErrorDiv.style.display = 'block';
                } finally {
                    sarcasticLoadingDiv.style.display = 'none';
                }

            } catch (e: any) { 
                console.error('Unexpected error during sequential analysis:', e);
                if (errorDiv.style.display === 'none') { // Only show if not already shown by formal analysis error
                    errorDiv.textContent = T.ERROR_UNEXPECTED;
                    errorDiv.style.display = 'block';
                }
                sarcasticLoadingDiv.style.display = 'none';
            } finally {
                loadingDiv.style.display = 'none';
                sarcasticLoadingDiv.style.display = 'none';
                analyzeButton.disabled = false;
                offerTextarea.disabled = false;
            }
        });
    } else {
        console.error('Failed to find necessary DOM elements for one or both analyzers.');
        if (resultsContainer) resultsContainer.style.display = 'block'; 
        if (formalOutputLabelElement) formalOutputLabelElement.textContent = T.ERROR_INIT_FAILED.split(':')[0];
        if (sarcasticOutputLabelElement) sarcasticOutputLabelElement.style.display = 'none';
        if (globalErrorDiv) {
            globalErrorDiv.textContent = T.ERROR_INIT_FAILED;
            globalErrorDiv.style.display = 'block';
        } else {
            alert(T.ERROR_INIT_FAILED);
        }
        if(loadingDiv) loadingDiv.style.display = 'none';
        if(sarcasticLoadingDiv) sarcasticLoadingDiv.style.display = 'none';
    }
});