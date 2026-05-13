const TRIGRAM_LINES = {
    1: [1, 1, 1], // 건 (Qian) - ☰
    2: [1, 1, 0], // 태 (Tui) - ☱
    3: [1, 0, 1], // 리 (Li) - ☲
    4: [1, 0, 0], // 진 (Chen) - ☳
    5: [0, 1, 1], // 손 (Sun) - ☴
    6: [0, 1, 0], // 감 (Kan) - ☵
    7: [0, 0, 1], // 간 (Ken) - ☶
    8: [0, 0, 0]  // 곤 (Kun) - ☷
};

const TRIGRAM_NAMES = {
    1: { name: '건', hanja: '乾', nature: '天' },
    2: { name: '태', hanja: '兌', nature: '澤' },
    3: { name: '리', hanja: '離', nature: '火' },
    4: { name: '진', hanja: '진', nature: '雷' },
    5: { name: '손', hanja: '巽', nature: '風' },
    6: { name: '감', hanja: '坎', nature: '水' },
    7: { name: '간', hanja: '艮', nature: '山' },
    8: { name: '곤', hanja: '坤', nature: '地' }
};

// 64 Hexagrams Mapping [Upper][Lower] with King Wen IDs
const HEXAGRAM_TABLE = {
    1: { // 상괘 건(天)
        1: { id: 1, name: "중천건", hanja: "重天乾" }, 2: { id: 10, name: "천택리", hanja: "天澤履" }, 3: { id: 13, name: "천화동인", hanja: "天火同人" }, 4: { id: 25, name: "천뢰무망", hanja: "天雷无妄" },
        5: { id: 44, name: "천풍구", hanja: "天風姤" }, 6: { id: 6, name: "천수송", hanja: "天水訟" }, 7: { id: 33, name: "천산돈", hanja: "天山遯" }, 8: { id: 12, name: "천지비", hanja: "天地否" }
    },
    2: { // 상괘 태(澤)
        1: { id: 43, name: "택천쾌", hanja: "澤天夬" }, 2: { id: 58, name: "중택태", hanja: "重澤兌" }, 3: { id: 49, name: "택화혁", hanja: "澤火革" }, 4: { id: 17, name: "택뢰수", hanja: "澤雷隨" },
        5: { id: 28, name: "택풍대과", hanja: "澤風大過" }, 6: { id: 47, name: "택수곤", hanja: "澤水困" }, 7: { id: 31, name: "택산함", hanja: "澤山咸" }, 8: { id: 45, name: "택지취", hanja: "澤地萃" }
    },
    3: { // 상괘 리(火)
        1: { id: 14, name: "화천대유", hanja: "火天大有" }, 2: { id: 38, name: "화택규", hanja: "火澤睽" }, 3: { id: 30, name: "중화리", hanja: "重火離" }, 4: { id: 21, name: "화뢰서합", hanja: "火雷噬嗑" },
        5: { id: 50, name: "화풍정", hanja: "火風鼎" }, 6: { id: 64, name: "화수미제", hanja: "火水未濟" }, 7: { id: 56, name: "화산려", hanja: "火山旅" }, 8: { id: 35, name: "화지진", hanja: "火地晉" }
    },
    4: { // 상괘 진(雷)
        1: { id: 34, name: "뇌천대장", hanja: "雷天大壯" }, 2: { id: 54, name: "뇌택귀매", hanja: "雷澤歸妹" }, 3: { id: 55, name: "뇌화풍", hanja: "雷火豊" }, 4: { id: 51, name: "중뢰진", hanja: "重雷震" },
        5: { id: 32, name: "뇌풍항", hanja: "雷風恒" }, 6: { id: 40, name: "뇌수해", hanja: "雷水解" }, 7: { id: 62, name: "뇌산소과", hanja: "雷山小過" }, 8: { id: 16, name: "뇌지예", hanja: "雷地豫" }
    },
    5: { // 상괘 손(風)
        1: { id: 9, name: "풍천소축", hanja: "風天小畜" }, 2: { id: 61, name: "풍택중부", hanja: "風澤中孚" }, 3: { id: 37, name: "풍화가인", hanja: "風火家人" }, 4: { id: 42, name: "풍뢰익", hanja: "風雷益" },
        5: { id: 57, name: "중손풍", hanja: "重風巽" }, 6: { id: 59, name: "풍수환", hanja: "風水渙" }, 7: { id: 53, name: "풍산점", hanja: "風山漸" }, 8: { id: 20, name: "풍지관", hanja: "風地觀" }
    },
    6: { // 상괘 감(水)
        1: { id: 5, name: "수천수", hanja: "水天需" }, 2: { id: 60, name: "수택절", hanja: "水澤節" }, 3: { id: 63, name: "수화기제", hanja: "水火旣濟" }, 4: { id: 3, name: "수뢰둔", hanja: "水雷屯" },
        5: { id: 48, name: "수풍정", hanja: "水風井" }, 6: { id: 29, name: "중수감", hanja: "重水坎" }, 7: { id: 39, name: "수산건", hanja: "水山蹇" }, 8: { id: 8, name: "수지비", hanja: "水지比" }
    },
    7: { // 상괘 간(山)
        1: { id: 26, name: "산천대축", hanja: "山天大畜" }, 2: { id: 41, name: "산택손", hanja: "山澤損" }, 3: { id: 22, name: "산화비", hanja: "山火賁" }, 4: { id: 27, name: "산뢰이", hanja: "山雷頤" },
        5: { id: 18, name: "산풍고", hanja: "山風蠱" }, 6: { id: 4, name: "산수몽", hanja: "山水蒙" }, 7: { id: 52, name: "중산간", hanja: "重山艮" }, 8: { id: 23, name: "산지박", hanja: "山地剝" }
    },
    8: { // 상괘 곤(地)
        1: { id: 11, name: "지천태", hanja: "地天泰" }, 2: { id: 19, name: "지택임", hanja: "地澤臨" }, 3: { id: 36, name: "지화명이", hanja: "地火明夷" }, 4: { id: 24, name: "지뢰복", hanja: "地雷復" },
        5: { id: 46, name: "지풍승", hanja: "地風升" }, 6: { id: 7, name: "지수사", hanja: "地水師" }, 7: { id: 15, name: "지산겸", hanja: "地山謙" }, 8: { id: 2, name: "중지곤", hanja: "重地坤" }
    }
};

let currentState = 0; // 0: Start, 1: Upper Drawn, 2: Lower Drawn, 3: Moving Drawn
let divinationData = {
    upper: null,
    lower: null,
    moving: null
};

// 수동 모드 상태
let manualData = { upper: null, lower: null, moving: null };
let currentMode = 'random'; // 'random' | 'manual' | 'situation'

const drawBtn = document.getElementById('draw-btn');
const resetBtn = document.getElementById('reset-btn');
const statusMsg = document.getElementById('status-msg');
const originalContainer = document.getElementById('original-container');
const transformedContainer = document.getElementById('transformed-container');
const interpretationContainer = document.getElementById('interpretation-container');
const interpretationText = document.getElementById('interpretation-text');

// --- Gemini API Configuration ---
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

function getGeminiApiKey() {
    // Streamlit에서 주입한 API 키 우선 사용
    if (window.STREAMLIT_API_KEY && window.STREAMLIT_API_KEY.trim()) {
        return window.STREAMLIT_API_KEY.trim();
    }
    // 로컬 환경: localStorage 사용
    try {
        let key = localStorage.getItem('gemini_api_key');
        if (!key) {
            key = prompt("Google AI Studio에서 발급받은 Gemini API 키를 입력해주세요.\n(키는 브라우저에만 저장되며 외부로 전송되지 않습니다.)");
            if (key) localStorage.setItem('gemini_api_key', key.trim());
        }
        return key;
    } catch(e) {
        return null;
    }
}

function setupGeminiKey() {
    if (window.STREAMLIT_API_KEY && window.STREAMLIT_API_KEY.trim()) {
        alert("Streamlit 배포 환경에서는 API 키가 서버 Secrets에서 자동으로 주입됩니다.");
        return;
    }
    try {
        const currentKey = localStorage.getItem('gemini_api_key') || "";
        const newKey = prompt("Gemini API 키를 입력하세요:", currentKey);
        if (newKey !== null) {
            localStorage.setItem('gemini_api_key', newKey.trim());
            alert("API 키가 저장되었습니다.");
        }
    } catch(e) {
        alert("이 환경에서는 API 키를 직접 설정할 수 없습니다. Streamlit Secrets를 사용해주세요.");
    }
}

async function callGeminiAPI(promptText) {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        throw new Error("API 키가 없습니다.");
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: promptText }]
            }],
            generationConfig: {
                temperature: 0.7,
                responseMimeType: "application/json"
            }
        })
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("Gemini API Error:", err);
        throw new Error("API 호출에 실패했습니다. 키가 올바른지 확인해주세요.");
    }

    const data = await response.json();
    try {
        const textResponse = data.candidates[0].content.parts[0].text;
        return JSON.parse(textResponse);
    } catch (e) {
        console.error("Failed to parse JSON:", e, data);
        throw new Error("결과를 해석하는데 실패했습니다.");
    }
}


function init() {
    drawBtn.addEventListener('click', handleDraw);
    resetBtn.addEventListener('click', reset);
}

// ── 모드 전환 ──────────────────────────────────────────
function switchMode(mode) {
    currentMode = mode;

    document.getElementById('tab-random').classList.toggle('active', mode === 'random');
    document.getElementById('tab-manual').classList.toggle('active', mode === 'manual');
    document.getElementById('tab-situation').classList.toggle('active', mode === 'situation');

    document.getElementById('manual-area').style.display = mode === 'manual' ? 'block' : 'none';
    document.getElementById('situation-area').style.display = mode === 'situation' ? 'block' : 'none';
    document.getElementById('random-controls').style.display = mode === 'random' ? 'flex' : 'none';
    statusMsg.style.display = mode === 'random' ? 'block' : 'none';

    // 결과 영역 초기화
    reset();
    if (mode === 'manual') resetManual();
    if (mode === 'situation') document.getElementById('situation-text').value = '';
}

// ── 수동 모드: 괘 선택 ──────────────────────────────────
function selectTrigram(which, value) {
    manualData[which] = value;

    // 버튼 하이라이트
    const groupId = which === 'upper' ? 'upper-buttons' : 'lower-buttons';
    document.querySelectorAll(`#${groupId} .trigram-btn`).forEach((btn, idx) => {
        btn.classList.toggle('selected', idx + 1 === value);
    });

    updateManualStatus();
}

function selectMoving(value) {
    manualData.moving = value;

    document.querySelectorAll('#moving-buttons .moving-btn').forEach((btn, idx) => {
        btn.classList.toggle('selected', idx + 1 === value);
    });

    updateManualStatus();
}

function updateManualStatus() {
    const statusEl = document.getElementById('manual-status');
    const submitBtn = document.getElementById('manual-submit-btn');

    if (!manualData.upper) {
        statusEl.innerText = '상괘를 선택하십시오.';
    } else if (!manualData.lower) {
        const u = TRIGRAM_NAMES[manualData.upper];
        statusEl.innerText = `상괘: ${u.name}(${u.nature}) ✓  —  하괘를 선택하십시오.`;
    } else if (!manualData.moving) {
        const u = TRIGRAM_NAMES[manualData.upper];
        const l = TRIGRAM_NAMES[manualData.lower];
        const hex = HEXAGRAM_TABLE[manualData.upper][manualData.lower];
        statusEl.innerText = `본괘: ${hex.name}(${u.nature}/${l.nature}) ✓  —  동효를 선택하십시오.`;
    } else {
        const hex = HEXAGRAM_TABLE[manualData.upper][manualData.lower];
        statusEl.innerText = `${hex.name} · ${manualData.moving}효 동 — 준비 완료`;
    }

    const ready = manualData.upper && manualData.lower && manualData.moving;
    submitBtn.disabled = !ready;
}

function submitManual() {
    // 수동 데이터를 divinationData에 복사 후 공통 렌더 함수 호출
    divinationData.upper = manualData.upper;
    divinationData.lower = manualData.lower;
    divinationData.moving = manualData.moving;

    // 결과 표시
    originalContainer.style.display = 'block';
    renderOriginal();
    renderTransformed();
    transformedContainer.style.display = 'block';
    showInterpretation();

    // 버튼 전환
    document.getElementById('manual-submit-btn').style.display = 'none';
    document.getElementById('manual-reset-btn').style.display = 'inline-block';

    // 선택 버튼 비활성화
    document.querySelectorAll('.trigram-btn, .moving-btn').forEach(btn => btn.disabled = true);
}

function resetManual() {
    manualData = { upper: null, lower: null, moving: null };

    document.querySelectorAll('.trigram-btn, .moving-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
    });

    document.getElementById('manual-submit-btn').style.display = 'inline-block';
    document.getElementById('manual-submit-btn').disabled = true;
    document.getElementById('manual-reset-btn').style.display = 'none';
    document.getElementById('manual-status').innerText = '상괘를 선택하십시오.';

    // 결과 영역 초기화
    originalContainer.style.display = 'none';
    transformedContainer.style.display = 'none';
    interpretationContainer.style.display = 'none';
    document.getElementById('original-visual').innerHTML = '';
    document.getElementById('transformed-visual').innerHTML = '';
    document.getElementById('original-name').innerText = '';
    document.getElementById('original-hanja').innerText = '';
    divinationData = { upper: null, lower: null, moving: null };
}

// ── 상황작괘 모드 ──────────────────────────────────────
async function submitSituation() {
    const text = document.getElementById('situation-text').value.trim();
    if (!text) {
        alert("상황이나 질문을 입력해주세요.");
        return;
    }

    const apiKey = getGeminiApiKey();
    if (!apiKey) return;

    // Show loading
    document.getElementById('situation-submit-btn').disabled = true;
    document.getElementById('situation-submit-btn').innerText = "작괘 중...";
    const loadingEl = document.getElementById('ai-loading');
    if (loadingEl) {
        loadingEl.style.display = 'block';
        loadingEl.scrollIntoView({ behavior: 'smooth' });
    }
    
    if(document.getElementById('ai-interpretation')) document.getElementById('ai-interpretation').style.display = 'none';
    if(document.getElementById('ai-controls')) document.getElementById('ai-controls').style.display = 'none';
    
    originalContainer.style.display = 'none';
    transformedContainer.style.display = 'none';
    interpretationContainer.style.display = 'none';

    const prompt = `사용자가 다음 상황에 대해 주역점을 치려고 합니다:\n"${text}"\n\n당신은 주역(I Ching)과 매화역수 등에 능통한 역학자입니다. 이 상황과 내용을 분석하여 가장 적절한 상괘(1~8), 하괘(1~8), 동효(1~6)를 도출해주세요. \n\n결과는 반드시 다음 형식의 JSON으로만 반환해주세요:\n{\n  "upper": 숫자(1~8),\n  "lower": 숫자(1~8),\n  "moving": 숫자(1~6),\n  "rationale": "왜 이 괘와 동효를 도출했는지에 대한 작괘 근거 및 상황 분석 (한국어)",\n  "explanation": "이 점괘가 현재 상황에 대해 주는 조언 및 해설 (한국어)"\n}`;

    try {
        const result = await callGeminiAPI(prompt);
        
        divinationData.upper = result.upper;
        divinationData.lower = result.lower;
        divinationData.moving = result.moving;

        // 결과 렌더링
        originalContainer.style.display = 'block';
        renderOriginal();
        renderTransformed();
        transformedContainer.style.display = 'block';
        
        // 근거 텍스트 표시
        const rationaleEl = document.getElementById('rationale-text');
        if(rationaleEl) {
            rationaleEl.style.display = 'block';
            rationaleEl.innerHTML = `<strong>[작괘 근거 - AI 분석]</strong><br>${result.rationale}`;
        }

        // 전통 해설 렌더링
        showInterpretation();
        
        // AI 해설 표시 (직접 받아온 해설)
        if(document.getElementById('ai-controls')) document.getElementById('ai-controls').style.display = 'none';
        if(document.getElementById('ai-interpretation')) document.getElementById('ai-interpretation').style.display = 'block';
        if(document.getElementById('ai-text')) document.getElementById('ai-text').innerText = result.explanation;
        
    } catch (error) {
        alert(error.message);
    } finally {
        document.getElementById('situation-submit-btn').disabled = false;
        document.getElementById('situation-submit-btn').innerText = "작괘하기 (作卦)";
        if (loadingEl) loadingEl.style.display = 'none';
    }
}

function handleDraw() {
    switch (currentState) {
        case 0:
            drawUpper();
            break;
        case 1:
            drawLower();
            break;
        case 2:
            drawMoving();
            break;
    }
}

function drawUpper() {
    divinationData.upper = Math.floor(Math.random() * 8) + 1;
    currentState = 1;

    statusMsg.innerText = `상괘로 '${TRIGRAM_NAMES[divinationData.upper].name}(${TRIGRAM_NAMES[divinationData.upper].nature})'괘를 얻었습니다. 이제 하괘를 뽑으세요.`;
    drawBtn.innerText = "하괘 뽑기";

    renderOriginal();
    originalContainer.style.display = 'block';
}

function drawLower() {
    divinationData.lower = Math.floor(Math.random() * 8) + 1;
    currentState = 2;

    const hex = HEXAGRAM_TABLE[divinationData.upper][divinationData.lower];
    statusMsg.innerText = `하괘로 '${TRIGRAM_NAMES[divinationData.lower].name}(${TRIGRAM_NAMES[divinationData.lower].nature})'괘를 얻어 '${hex.name}' 본괘가 완성되었습니다. 마지막으로 동효를 뽑으세요.`;
    drawBtn.innerText = "동효 뽑기";

    renderOriginal();
}

function drawMoving() {
    divinationData.moving = Math.floor(Math.random() * 6) + 1; // 1-6 (from bottom)
    currentState = 3;

    statusMsg.innerText = `${divinationData.moving}효가 변하여 본괘가 지괘로 바뀌었습니다. 결과를 확인하십시오.`;
    drawBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';

    renderOriginal();
    renderTransformed();
    transformedContainer.style.display = 'block';

    // Display Interpretation
    showInterpretation();
}

function showInterpretation() {
    const originalHex = HEXAGRAM_TABLE[divinationData.upper][divinationData.lower];
    const hexId = originalHex.id.toString();
    const lineNum = divinationData.moving;

    // 1. 해설 텍스트 구성
    let gwaesaText = "괘사 정보를 찾을 수 없습니다.";
    let hyosaText = "효사 정보를 찾을 수 없습니다.";

    if (typeof HEXAGRAM_LINES_TEXT !== 'undefined' && HEXAGRAM_LINES_TEXT[hexId]) {
        if (HEXAGRAM_LINES_TEXT[hexId]["0"]) {
            gwaesaText = HEXAGRAM_LINES_TEXT[hexId]["0"];
        }
        if (HEXAGRAM_LINES_TEXT[hexId][lineNum.toString()]) {
            hyosaText = HEXAGRAM_LINES_TEXT[hexId][lineNum.toString()];
        }
    }

    interpretationText.innerText = "【 괘사 (卦辭) 】\n" + gwaesaText + "\n\n【 동효 (動爻) 】\n" + hyosaText;

    // 2. 물상표 구성
    if (typeof TRIGRAM_PROPERTIES !== 'undefined') {
        let changedTrigramIdx = null;
        if (lineNum <= 3) {
            // 하괘 변동
            const lowerLines = [...TRIGRAM_LINES[divinationData.lower]];
            lowerLines[lineNum - 1] = lowerLines[lineNum - 1] === 1 ? 0 : 1;
            changedTrigramIdx = findTrigramIndex(lowerLines);
        } else {
            // 상괘 변동
            const upperLines = [...TRIGRAM_LINES[divinationData.upper]];
            upperLines[lineNum - 4] = upperLines[lineNum - 4] === 1 ? 0 : 1;
            changedTrigramIdx = findTrigramIndex(upperLines);
        }

        const uProp = TRIGRAM_PROPERTIES[divinationData.upper];
        const lProp = TRIGRAM_PROPERTIES[divinationData.lower];
        const cProp = TRIGRAM_PROPERTIES[changedTrigramIdx];

        const propKeys = ["卦德", "人倫", "人品", "動物", "人體", "物色", "器物", "雜物"];

        let tableHtml = `
            <table class="properties-table">
                <thead>
                    <tr>
                        <th>구분</th>
                        ${propKeys.map(key => `<th>${key}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="property-label">본괘 상괘<br><small>(${uProp.name}·${uProp.nature})</small></td>
                        ${propKeys.map(key => `<td>${uProp.properties[key]}</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="property-label">본괘 하괘<br><small>(${lProp.name}·${lProp.nature})</small></td>
                        ${propKeys.map(key => `<td>${lProp.properties[key]}</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="property-label">지괘 변괘<br><small>(${cProp.name}·${cProp.nature})</small></td>
                        ${propKeys.map(key => `<td>${cProp.properties[key]}</td>`).join('')}
                    </tr>
                </tbody>
            </table>
        `;
        document.getElementById('properties-container').innerHTML = tableHtml;
    }

    interpretationContainer.style.display = 'block';
    
    // AI 관련 초기화 (상황작괘가 아닐 경우 버튼 표시)
    if (currentMode !== 'situation') {
        if(document.getElementById('ai-interpretation')) document.getElementById('ai-interpretation').style.display = 'none';
        if(document.getElementById('ai-controls')) document.getElementById('ai-controls').style.display = 'block';
    }
}

async function requestAIInterpretation() {
    const apiKey = getGeminiApiKey();
    if (!apiKey) return;

    const btn = document.querySelector('#ai-controls button');
    if(btn) {
        btn.disabled = true;
        btn.innerText = "해설 작성 중...";
    }
    
    const loadingEl = document.getElementById('ai-loading');
    if (loadingEl) {
        loadingEl.style.display = 'block';
        loadingEl.scrollIntoView({ behavior: 'smooth' });
    }
    if(document.getElementById('ai-interpretation')) document.getElementById('ai-interpretation').style.display = 'none';
    
    const hex = HEXAGRAM_TABLE[divinationData.upper][divinationData.lower];
    
    const prompt = `당신은 주역(I Ching) 전문가입니다. 방금 점을 쳐서 본괘로 '${hex.name}(${hex.hanja})' 괘를 얻었고, 제${divinationData.moving}효가 동효로 나왔습니다.\n이 괘와 동효가 의미하는 바를 현대인의 관점에서 이해하기 쉽고 명확하게 풀이해주세요.\n\n반드시 다음 형식의 JSON으로만 반환해주세요:\n{\n  "explanation": "해당 괘와 동효에 대한 현대적이고 직관적인 해설 (한국어)"\n}`;
    
    try {
        const result = await callGeminiAPI(prompt);
        if(document.getElementById('ai-text')) document.getElementById('ai-text').innerText = result.explanation;
        if(document.getElementById('ai-controls')) document.getElementById('ai-controls').style.display = 'none';
        if(document.getElementById('ai-interpretation')) document.getElementById('ai-interpretation').style.display = 'block';
    } catch (error) {
        alert(error.message);
    } finally {
        if(btn) {
            btn.disabled = false;
            btn.innerText = "AI 해설 보기";
        }
        if(loadingEl) loadingEl.style.display = 'none';
    }
}

function renderOriginal() {
    const visual = document.getElementById('original-visual');
    const nameEl = document.getElementById('original-name');
    const hanjaEl = document.getElementById('original-hanja');

    visual.innerHTML = '';

    // TRIGRAM_LINES[n] = [하효, 중효, 상효]
    // 상괘: index0=효4, index1=효5, index2=효6
    // 하괘: index0=효1, index1=효2, index2=효3
    // 화면은 위→아래: 효6, 효5, 효4, 효3, 효2, 효1

    if (divinationData.upper) {
        // 상괘: 역순으로 효6,5,4
        const upperReversed = [...TRIGRAM_LINES[divinationData.upper]].reverse();
        upperReversed.forEach((lineType, index) => {
            const lineNum = 6 - index; // 6, 5, 4
            addLine(visual, lineType, lineNum === divinationData.moving);
        });
    } else {
        for (let i = 0; i < 3; i++) {
            const emptyLine = document.createElement('div');
            emptyLine.className = 'line';
            emptyLine.style.border = '1px dashed rgba(255,255,255,0.1)';
            visual.appendChild(emptyLine);
        }
    }

    if (divinationData.lower) {
        // 하괘: 역순으로 효3,2,1
        const lowerReversed = [...TRIGRAM_LINES[divinationData.lower]].reverse();
        lowerReversed.forEach((lineType, index) => {
            const lineNum = 3 - index; // 3, 2, 1
            addLine(visual, lineType, lineNum === divinationData.moving);
        });
    } else {
        for (let i = 0; i < 3; i++) {
            const emptyLine = document.createElement('div');
            emptyLine.className = 'line';
            emptyLine.style.border = '1px dashed rgba(255,255,255,0.1)';
            visual.appendChild(emptyLine);
        }
    }

    if (divinationData.upper && divinationData.lower) {
        const hex = HEXAGRAM_TABLE[divinationData.upper][divinationData.lower];
        nameEl.innerText = hex.name;
        hanjaEl.innerText = hex.hanja;
    }
}

function renderTransformed() {
    const visual = document.getElementById('transformed-visual');
    const nameEl = document.getElementById('transformed-name');
    const hanjaEl = document.getElementById('transformed-hanja');

    visual.innerHTML = '';

    // TRIGRAM_LINES[n] = [하효, 중효, 상효] 순서
    // 전체 효 배열: allLines[0]=효1 ~ allLines[5]=효6
    const allLines = [...TRIGRAM_LINES[divinationData.lower], ...TRIGRAM_LINES[divinationData.upper]];

    const transformedLines = allLines.map((line, index) => {
        if (index + 1 === divinationData.moving) {
            return line === 1 ? 0 : 1; // 동효: 음양 반전
        }
        return line;
    });

    // 화면에 그릴 때: 효6(상)부터 효1(하) 순서로 (위→아래)
    for (let i = 5; i >= 0; i--) {
        addLine(visual, transformedLines[i], false);
    }

    // 지괘 계산
    const newLowerLines = transformedLines.slice(0, 3); // 효1~3 = [하효,중효,상효] 형식 그대로
    const newUpperLines = transformedLines.slice(3, 6); // 효4~6

    const newLowerIdx = findTrigramIndex(newLowerLines);
    const newUpperIdx = findTrigramIndex(newUpperLines);

    const hex = HEXAGRAM_TABLE[newUpperIdx][newLowerIdx];
    nameEl.innerText = hex.name;
    hanjaEl.innerText = hex.hanja;
}

function addLine(container, type, isMoving) {
    const line = document.createElement('div');
    line.className = `line ${type === 1 ? 'solid' : 'broken'} ${isMoving ? 'moving' : ''} line-enter`;
    container.appendChild(line);
}

function findTrigramIndex(lines) {
    for (let i = 1; i <= 8; i++) {
        if (JSON.stringify(TRIGRAM_LINES[i]) === JSON.stringify(lines)) {
            return i;
        }
    }
    return null;
}

function reset() {
    currentState = 0;
    divinationData = { upper: null, lower: null, moving: null };

    statusMsg.innerText = "경건한 마음으로 아래 버튼을 눌러 점을 치십시오.";
    drawBtn.innerText = "상괘 뽑기";
    drawBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';

    originalContainer.style.display = 'none';
    transformedContainer.style.display = 'none';
    interpretationContainer.style.display = 'none';

    document.getElementById('original-visual').innerHTML = '';
    document.getElementById('transformed-visual').innerHTML = '';
    document.getElementById('original-name').innerText = '';
    document.getElementById('original-hanja').innerText = '';
    
    const rationaleEl = document.getElementById('rationale-text');
    if (rationaleEl) {
        rationaleEl.style.display = 'none';
        rationaleEl.innerHTML = '';
    }
    
    if(document.getElementById('ai-interpretation')) document.getElementById('ai-interpretation').style.display = 'none';
    if(document.getElementById('ai-controls')) document.getElementById('ai-controls').style.display = 'none';
    if(document.getElementById('ai-loading')) document.getElementById('ai-loading').style.display = 'none';
}

init();
