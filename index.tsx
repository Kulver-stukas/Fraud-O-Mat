/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import showdown from 'showdown';

const APP_TITLE = "Разводк-О-Мат v3.1";

// API Key must be in environment variable process.env.API_KEY
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
}

const GEMINI_MODEL = 'gemini-2.5-flash-preview-04-17';

const PROMPT_TEMPLATE_HEADER = `Ты выступаешь в роли ассистента "Разводк-О-Мат", созданного для анализа коммерческих предложений, инвестиционных офферов и авторских курсов с точки зрения:
- этичности,
- прозрачности бизнес-модели,
- манипулятивных приёмов,
- реализуемости заявленных выгод,
- и вероятного распределения рисков и доходов.

Проанализируй следующий текст оффера:
"""
`; // User offer text will be inserted here

const PROMPT_TEMPLATE_FOOTER = `
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

Ответ должен включать:
0. **Первой строкой ответа ОБЯЗАТЕЛЬНО выведи**: "Оценка Разводк-О-Мат: X/10" (где X — **целочисленная** итоговая оценка доверия **от 0 до 10**).
1. Диагностику по 6 критериям (в виде markdown таблицы)
2. Пояснение к итоговой оценке (сама оценка выведена отдельной первой строкой).
3. Маркер риска (⚠️ / ✅ / ❗)
4. Рекомендацию
`;

const PROMPT_SARCASTIC_ANALYST_INTRO = `Ты — аналитик манипулятивных маркетинговых схем, циничный и остроумный, но без явных обвинений в мошенничестве. Твоя задача — вскрывать риторические уловки, маркетинговую демагогию, завуалированные схемы привлечения денег и сомнительные способы убеждения.
`;

const PROMPT_SARCASTIC_ANALYST_OFFER_TEXT_LABEL = `
Ты анализируешь следующий **исходный текст оффера**:
"""
`; // User offer text will be inserted here

const PROMPT_SARCASTIC_ANALYST_FORMAL_ANALYSIS_LABEL = `
"""

При этом, **учитывай следующий предварительный формальный анализ**, но НЕ ПОВТОРЯЙ его выводы, а используй для более глубокого саркастического комментария:
"""
`; // Formal analysis text will be inserted here

const PROMPT_SARCASTIC_ANALYST_INSTRUCTION_AFTER_INPUTS = `
"""

Твой анализ должен быть основан на **исходном тексте оффера**, но с учетом данных из формального анализа.
`;


const PROMPT_SARCASTIC_ANALYST_FOOTER = `
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
`;

const FORMAL_PANEL_TITLES = ["Анализ документа", "Экспертная оценка", "Формальное заключение", "Разбор по существу", "Результаты анализа", "Аналитический отчет"];
const SARCASTIC_PANEL_TITLES_LOW_SCORE = ["Тревожный звоночек!", "Осторожно, минное поле!", "Здесь пахнет разводом!", "Держите кошелек покрепче!", "Сигнал 'SOS' для вашего бюджета"];
const SARCASTIC_PANEL_TITLES_MID_SCORE = ["Скептический взгляд", "Есть нюансы...", "Не всё так гладко", "Под лупой сарказма", "Читаем между строк"];
const SARCASTIC_PANEL_TITLES_HIGH_SCORE = ["Ну, допустим...", "Почти без подвоха?", "Удивили (не сарказм)", "Можно рассмотреть... с опаской", "Неожиданно достойно"];
const SARCASTIC_PANEL_TITLES_DEFAULT = ["Мнение (очень) частного лица", "Как я это вижу", "Пара мыслей вслух", "Без протокола", "Комментарий циника"];


function parseScore(responseText: string): number | null {
    if (!responseText) return null;
    const scoreRegex = /^Оценка Разводк-О-Мат:\s*(\d+)\/10/i;
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
    const offerTextarea = document.getElementById('offerText') as HTMLTextAreaElement;
    const analyzeButton = document.getElementById('analyzeButton') as HTMLButtonElement;
    
    const resultsContainer = document.querySelector('.results-container') as HTMLDivElement;

    const formalOutputLabel = document.getElementById('formal-output-label') as HTMLHeadingElement;
    const resultDiv = document.getElementById('result') as HTMLDivElement;
    const loadingDiv = document.getElementById('loading') as HTMLDivElement;
    const errorDiv = document.getElementById('error') as HTMLDivElement;

    const sarcasticOutputLabel = document.getElementById('sarcastic-output-label') as HTMLHeadingElement;
    const sarcasticResultDiv = document.getElementById('sarcasticResult') as HTMLDivElement;
    const sarcasticLoadingDiv = document.getElementById('sarcasticLoading') as HTMLDivElement;
    const sarcasticErrorDiv = document.getElementById('sarcasticError') as HTMLDivElement;

    const appTitleElement = document.getElementById('appTitle') as HTMLHeadingElement;
    if (appTitleElement) {
        appTitleElement.textContent = APP_TITLE;
    }
    const pageTitleElement = document.querySelector('title');
    if (pageTitleElement) {
        pageTitleElement.textContent = APP_TITLE;
    }

    const globalErrorDiv = errorDiv; 

    if (!API_KEY || !ai) {
        const configErrorMessage = "Ошибка конфигурации: API ключ не найден или недействителен. Пожалуйста, убедитесь, что API_KEY установлен в переменных окружения и действителен.";
        if (globalErrorDiv) {
            globalErrorDiv.textContent = configErrorMessage;
            globalErrorDiv.style.display = 'block';
            if(resultsContainer) resultsContainer.style.display = 'block'; 
            if(formalOutputLabel) formalOutputLabel.textContent = 'Ошибка конфигурации';
            if(sarcasticOutputLabel) sarcasticOutputLabel.style.display = 'none'; // Hide sarcastic panel title
        } else {
            alert(configErrorMessage); 
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

    if (analyzeButton && offerTextarea && resultsContainer && formalOutputLabel && resultDiv && loadingDiv && errorDiv && sarcasticOutputLabel && sarcasticResultDiv && sarcasticLoadingDiv && sarcasticErrorDiv) {
        analyzeButton.addEventListener('click', async () => {
            const offerText = offerTextarea.value.trim();
            
            if (!offerText) {
                resultsContainer.style.display = 'block'; 
                formalOutputLabel.textContent = 'Ошибка ввода';
                sarcasticOutputLabel.textContent = ''; 
                errorDiv.textContent = 'Пожалуйста, введите текст оффера для анализа.';
                errorDiv.style.display = 'block';
                resultDiv.style.display = 'none';
                sarcasticResultDiv.style.display = 'none';
                sarcasticErrorDiv.style.display = 'none';
                loadingDiv.style.display = 'none';
                sarcasticLoadingDiv.style.display = 'none';
                return;
            }

            // Reset UI and prepare for analysis
            resultsContainer.style.display = 'flex';
            analyzeButton.disabled = true;
            offerTextarea.disabled = true;

            // Clear previous results and errors
            resultDiv.innerHTML = '';
            resultDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            sarcasticResultDiv.innerHTML = '';
            sarcasticResultDiv.style.display = 'none';
            sarcasticErrorDiv.style.display = 'none';
            
            // Show loading indicators
            loadingDiv.style.display = 'flex';
            sarcasticLoadingDiv.style.display = 'flex'; // Show both initially

            const currentFormalTitle = FORMAL_PANEL_TITLES[Math.floor(Math.random() * FORMAL_PANEL_TITLES.length)];
            formalOutputLabel.textContent = currentFormalTitle;
            sarcasticOutputLabel.textContent = SARCASTIC_PANEL_TITLES_DEFAULT[Math.floor(Math.random() * SARCASTIC_PANEL_TITLES_DEFAULT.length)];

            let formalAnalysisText = ''; // Will store the raw text from formal analysis
            let parsedScore: number | null = null;

            try {
                // --- 1. Formal Analysis ---
                const formalPrompt = `${PROMPT_TEMPLATE_HEADER}${offerText}${PROMPT_TEMPLATE_FOOTER}`;
                try {
                    const formalResponse: GenerateContentResponse = await ai!.models.generateContent({
                        model: GEMINI_MODEL,
                        contents: formalPrompt,
                    });
                    formalAnalysisText = formalResponse.text || ''; // Store raw text
                    const htmlContent = markdownConverter.makeHtml(formalAnalysisText);
                    resultDiv.innerHTML = htmlContent;
                    resultDiv.style.display = 'block';

                    parsedScore = parseScore(formalAnalysisText);
                    if (parsedScore !== null) {
                        formalOutputLabel.textContent = `${currentFormalTitle} (${parsedScore}/10)`;
                    } else {
                        formalOutputLabel.textContent = currentFormalTitle; // Keep original title if score parsing fails
                    }
                } catch (formalApiError: any) {
                    console.error('Ошибка при вызове Gemini API для формального анализа:', formalApiError);
                    let errorMessage = 'Произошла ошибка при формальном анализе оффера.';
                    if (formalApiError && formalApiError.message) {
                        errorMessage += ` Детали: ${formalApiError.message}`;
                    }
                    errorDiv.textContent = errorMessage;
                    errorDiv.style.display = 'block';

                    // Update sarcastic panel to indicate it won't run
                    sarcasticOutputLabel.textContent = "Саркастический анализ отменен";
                    sarcasticResultDiv.innerHTML = '<p>Формальный анализ не был успешно завершен, поэтому саркастический анализ не может быть выполнен.</p>';
                    sarcasticResultDiv.style.display = 'block';
                    sarcasticErrorDiv.style.display = 'none';
                    sarcasticLoadingDiv.style.display = 'none'; // Hide sarcastic loading
                    throw formalApiError; // Propagate to outer catch to skip sarcastic analysis
                } finally {
                    loadingDiv.style.display = 'none'; // Hide formal loading indicator
                }

                // --- 2. Sarcastic Analysis (only if formal analysis succeeded) ---
                // Update sarcastic title based on score
                if (parsedScore !== null) {
                    if (parsedScore <= 3) {
                        sarcasticOutputLabel.textContent = SARCASTIC_PANEL_TITLES_LOW_SCORE[Math.floor(Math.random() * SARCASTIC_PANEL_TITLES_LOW_SCORE.length)];
                    } else if (parsedScore <= 6) {
                        sarcasticOutputLabel.textContent = SARCASTIC_PANEL_TITLES_MID_SCORE[Math.floor(Math.random() * SARCASTIC_PANEL_TITLES_MID_SCORE.length)];
                    } else {
                        sarcasticOutputLabel.textContent = SARCASTIC_PANEL_TITLES_HIGH_SCORE[Math.floor(Math.random() * SARCASTIC_PANEL_TITLES_HIGH_SCORE.length)];
                    }
                } // else, it keeps the default title set earlier

                const sarcasticPrompt = 
                    `${PROMPT_SARCASTIC_ANALYST_INTRO}` +
                    `${PROMPT_SARCASTIC_ANALYST_OFFER_TEXT_LABEL}${offerText}` +
                    `${PROMPT_SARCASTIC_ANALYST_FORMAL_ANALYSIS_LABEL}${formalAnalysisText}` + // Pass formal analysis text
                    `${PROMPT_SARCASTIC_ANALYST_INSTRUCTION_AFTER_INPUTS}` +
                    `${PROMPT_SARCASTIC_ANALYST_FOOTER}`;

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
                    console.error('Ошибка при вызове Gemini API для саркастического анализа:', sarcasticApiError);
                    let errorMessage = 'Произошла ошибка при саркастическом анализе оффера.';
                     if (sarcasticApiError && sarcasticApiError.message) {
                        errorMessage += ` Детали: ${sarcasticApiError.message}`;
                    }
                    sarcasticErrorDiv.textContent = errorMessage;
                    sarcasticErrorDiv.style.display = 'block';
                } finally {
                    sarcasticLoadingDiv.style.display = 'none'; // Hide sarcastic loading indicator
                }

            } catch (e: any) { 
                // This catches errors re-thrown from formal analysis, or other unexpected errors
                console.error('Непредвиденная ошибка в процессе последовательного анализа:', e);
                // If formal error div is not already displaying a message, show a general one.
                if (errorDiv.style.display === 'none') {
                    const generalErrorMessage = 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз.';
                    errorDiv.textContent = generalErrorMessage;
                    errorDiv.style.display = 'block';
                }
                // Ensure sarcastic loading is hidden if an error occurred that prevented its explicit hiding
                sarcasticLoadingDiv.style.display = 'none';
            } finally {
                // Ensure all loading indicators are hidden and inputs are re-enabled
                loadingDiv.style.display = 'none';
                sarcasticLoadingDiv.style.display = 'none';
                analyzeButton.disabled = false;
                offerTextarea.disabled = false;
            }
        });
    } else {
        console.error('Не удалось найти необходимые DOM элементы для одного или обоих анализаторов.');
        const initErrorMessage = 'Ошибка инициализации приложения: не найдены ключевые элементы страницы для одного или обоих анализаторов.';
        if (resultsContainer) resultsContainer.style.display = 'block'; 
        if (formalOutputLabel) formalOutputLabel.textContent = 'Ошибка инициализации';
        if (sarcasticOutputLabel) sarcasticOutputLabel.style.display = 'none';
        if (globalErrorDiv) { // globalErrorDiv is an alias for errorDiv, check if it's the target for general init error.
            globalErrorDiv.textContent = initErrorMessage;
            globalErrorDiv.style.display = 'block';
        } else {
            alert(initErrorMessage);
        }
        if(loadingDiv) loadingDiv.style.display = 'none';
        if(sarcasticLoadingDiv) sarcasticLoadingDiv.style.display = 'none';
    }
});