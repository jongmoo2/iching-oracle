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
    4: { name: '진', hanja: '震', nature: '雷' },
    5: { name: '손', hanja: '巽', nature: '風' },
    6: { name: '감', hanja: '坎', nature: '水' },
    7: { name: '간', hanja: '艮', nature: '山' },
    8: { name: '곤', hanja: '坤', nature: '地' }
};

const HEXAGRAM_TABLE = {
    1: {
        1: { id: 1, name: "중천건", hanja: "重天乾" }, 2: { id: 10, name: "천택리", hanja: "天澤履" }, 3: { id: 13, name: "천화동인", hanja: "天火同人" }, 4: { id: 25, name: "천뢰무망", hanja: "天雷无妄" },
        5: { id: 44, name: "천풍구", hanja: "天風姤" }, 6: { id: 6, name: "천수송", hanja: "天水訟" }, 7: { id: 33, name: "천산둔", hanja: "天山遯" }, 8: { id: 12, name: "천지비", hanja: "天地否" }
    },
    2: {
        1: { id: 43, name: "택천쾌", hanja: "澤天夬" }, 2: { id: 58, name: "중택태", hanja: "重澤兌" }, 3: { id: 49, name: "택화혁", hanja: "澤火革" }, 4: { id: 17, name: "택뢰수", hanja: "澤雷隨" },
        5: { id: 28, name: "택풍대과", hanja: "澤風大過" }, 6: { id: 47, name: "택수곤", hanja: "澤水困" }, 7: { id: 31, name: "택산함", hanja: "澤山咸" }, 8: { id: 45, name: "택지췌", hanja: "澤地萃" }
    },
    3: {
        1: { id: 14, name: "화천대유", hanja: "火天大有" }, 2: { id: 38, name: "화택규", hanja: "火澤睽" }, 3: { id: 30, name: "중화리", hanja: "重火離" }, 4: { id: 21, name: "화뢰서합", hanja: "火雷噬嗑" },
        5: { id: 50, name: "화풍정", hanja: "火風鼎" }, 6: { id: 64, name: "화수미제", hanja: "화수미제" }, 7: { id: 56, name: "화산려", hanja: "火山旅" }, 8: { id: 35, name: "화지진", hanja: "火地晉" }
    },
    4: {
        1: { id: 34, name: "뇌천대장", hanja: "雷天大壯" }, 2: { id: 54, name: "뇌택귀매", hanja: "雷澤歸妹" }, 3: { id: 55, name: "뇌화풍", hanja: "雷화풍" }, 4: { id: 51, name: "중뢰진", hanja: "重雷震" },
        5: { id: 32, name: "뇌풍항", hanja: "雷風恒" }, 6: { id: 40, name: "뇌수해", hanja: "雷수해" }, 7: { id: 62, name: "뇌산소과", hanja: "雷山小過" }, 8: { id: 16, name: "뇌지예", hanja: "雷地豫" }
    },
    5: {
        1: { id: 9, name: "풍천소축", hanja: "風天소축" }, 2: { id: 61, name: "풍택중부", hanja: "風澤中孚" }, 3: { id: 37, name: "풍화가인", hanja: "風火家人" }, 4: { id: 42, name: "풍뢰익", hanja: "風雷益" },
        5: { id: 57, name: "중손풍", hanja: "重風巽" }, 6: { id: 59, name: "풍수환", hanja: "風水渙" }, 7: { id: 53, name: "풍산점", hanja: "風山漸" }, 8: { id: 20, name: "풍지관", hanja: "風지관" }
    },
    6: {
        1: { id: 5, name: "수천수", hanja: "水天需" }, 2: { id: 60, name: "수택절", hanja: "水澤節" }, 3: { id: 63, name: "수화기제", hanja: "水火旣濟" }, 4: { id: 3, name: "수뢰둔", hanja: "水雷屯" },
        5: { id: 48, name: "수풍정", hanja: "水風井" }, 6: { id: 29, name: "중수감", hanja: "重수감" }, 7: { id: 39, name: "수산건", hanja: "水山蹇" }, 8: { id: 8, name: "수지비", hanja: "水지비" }
    },
    7: {
        1: { id: 26, name: "산천대축", hanja: "山天大축" }, 2: { id: 41, name: "산택손", hanja: "山澤損" }, 3: { id: 22, name: "산화비", hanja: "山火賁" }, 4: { id: 27, name: "산뢰이", hanja: "山雷頤" },
        5: { id: 18, name: "산풍고", hanja: "山風蠱" }, 6: { id: 4, name: "산수몽", hanja: "山수몽" }, 7: { id: 52, name: "중산간", hanja: "重山艮" }, 8: { id: 23, name: "산지박", hanja: "山지박" }
    },
    8: {
        1: { id: 11, name: "지천태", hanja: "地天泰" }, 2: { id: 19, name: "지택임", hanja: "地澤臨" }, 3: { id: 36, name: "지화명이", hanja: "地火明夷" }, 4: { id: 24, name: "지뢰복", hanja: "地雷復" },
        5: { id: 46, name: "지풍승", hanja: "地風升" }, 6: { id: 7, name: "지수사", hanja: "地水師" }, 7: { id: 15, name: "지산겸", hanja: "地山謙" }, 8: { id: 2, name: "중지곤", hanja: "重지곤" }
    }
};

let currentState = 0;
let divinationData = { upper: null, lower: null, moving: null };
let manualData = { upper: null, lower: null, moving: null };
let currentMode = 'random';

let drawBtn, resetBtn, statusMsg, originalContainer, transformedContainer, interpretationContainer, interpretationText;

// ── 모드 전환 (시간작괘 추가) ──────────────────────────
function switchMode(mode) {
    currentMode = mode;

    document.getElementById('tab-random').classList.toggle('active', mode === 'random');
    document.getElementById('tab-manual').classList.toggle('active', mode === 'manual');
    document.getElementById('tab-time').classList.toggle('active', mode === 'time');
    document.getElementById('tab-situation').classList.toggle('active', mode === 'situation');

    document.getElementById('manual-area').style.display = mode === 'manual' ? 'block' : 'none';
    document.getElementById('time-area').style.display = mode === 'time' ? 'block' : 'none';
    document.getElementById('situation-area').style.display = mode === 'situation' ? 'block' : 'none';
    document.getElementById('random-controls').style.display = mode === 'random' ? 'flex' : 'none';
    statusMsg.style.display = mode === 'random' ? 'block' : 'none';

    if (mode === 'situation') {
        document.getElementById('situation-area').innerHTML = `
            <div style="text-align:center; padding: 20px; color: #ffd700; border: 1px dashed rgba(255,215,0,0.3); border-radius: 10px;">
                <p>✨ AI 상황작괘는 보안과 안정성을 위해<br><strong>화면 상단의 [AI 상황작괘] 메뉴</strong>로 이동되었습니다.</p>
                <p>상단 메뉴에서 질문을 입력하고 [작괘하기]를 눌러주세요.</p>
            </div>
        `;
    }

    if (mode === 'time') {
        updateLiveTimeDisplay();
    }

    reset();
    if (mode === 'manual') resetManual();
}

// ── 시간작괘 모드 작동 실시간 시간 갱신 ──────────────────
function updateLiveTimeDisplay() {
    const timeEl = document.getElementById('time-display');
    if (!timeEl) return;
    const now = new Date();
    timeEl.innerText = `현재 시각: ${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${now.getHours()}시`;
}

// ── 시간작괘 핵심 수학적 알고리즘 연산 ──────────────────
function submitTimeDivination() {
    const now = new Date();
    const Y = now.getFullYear();
    const M = now.getMonth() + 1;
    const D = now.getDate();
    const H = now.getHours();

    // 현대 기조식 서기 연도 결합 공식
    let upperIdx = (Y + M + D) % 8;
    if (upperIdx === 0) upperIdx = 8;

    let lowerIdx = (Y + M + D + H) % 8;
    if (lowerIdx === 0) lowerIdx = 8;

    let movingIdx = (Y + M + D + H) % 6;
    if (movingIdx === 0) movingIdx = 6;

    divinationData.upper = upperIdx;
    divinationData.lower = lowerIdx;
    divinationData.moving = movingIdx;

    // 결과 렌더링
    originalContainer.style.display = 'block';
    renderOriginal();
    renderTransformed();
    transformedContainer.style.display = 'block';

    const rationaleEl = document.getElementById('rationale-text');
    if (rationaleEl) {
        rationaleEl.style.display = 'block';
        rationaleEl.innerHTML = `
            <strong>[작괘 근거 - 시간 연산]</strong><br>
            - 기준 연월일시: 서기 ${Y}년 ${M}월 ${D}일 ${H}시<br>
            - 상괘 연산: (${Y} + ${M} + ${D}) % 8 = 나머지 ${upperIdx} (${TRIGRAM_NAMES[upperIdx].name}·${TRIGRAM_NAMES[upperIdx].nature})<br>
            - 하괘 연산: (${Y} + ${M} + ${D} + ${H}) % 8 = 나머지 ${lowerIdx} (${TRIGRAM_NAMES[lowerIdx].name}·${TRIGRAM_NAMES[lowerIdx].nature})<br>
            - 동효 연산: (${Y} + ${M} + ${D} + ${H}) % 6 = 나머지 ${movingIdx}효 동(動)
        `;
    }

    showInterpretation();
    
    // 시간작괘는 로컬 순수 연산이므로 AI 해설창을 숨겨서 깔끔하게 연출
    if (document.getElementById('ai-interpretation')) {
        document.getElementById('ai-interpretation').style.display = 'none';
    }

    setTimeout(() => {
        originalContainer.scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// ── 수동 모드: 괘 선택 ──────────────────────────────────
function selectTrigram(which, value) {
    manualData[which] = value;
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
    divinationData.upper = manualData.upper;
    divinationData.lower = manualData.lower;
    divinationData.moving = manualData.moving;

    originalContainer.style.display = 'block';
    renderOriginal();
    renderTransformed();
    transformedContainer.style.display = 'block';
    showInterpretation();

    document.getElementById('manual-submit-btn').style.display = 'none';
    document.getElementById('manual-reset-btn').style.display = 'inline-block';
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

    originalContainer.style.display = 'none';
    transformedContainer.style.display = 'none';
    interpretationContainer.style.display = 'none';
    divinationData = { upper: null, lower: null, moving: null };
}

// ── 파이썬 백엔드 호출 데이터 핸들링 ──────────────────────
function handleInjectedAIResult(result) {
    if (result.error) {
        alert(result.error);
        return;
    }

    switchMode('random');

    divinationData.upper = result.upper;
    divinationData.lower = result.lower;
    divinationData.moving = result.moving;

    originalContainer.style.display = 'block';
    renderOriginal();
    renderTransformed();
    transformedContainer.style.display = 'block';

    const rationaleEl = document.getElementById('rationale-text');
    if (rationaleEl) {
        rationaleEl.style.display = 'block';
        rationaleEl.innerHTML = `<strong>[작괘 근거 - AI 물상 분석]</strong><br>${result.rationale}`;
    }

    showInterpretation();

    if (document.getElementById('ai-interpretation')) document.getElementById('ai-interpretation').style.display = 'block';
    if (document.getElementById('ai-text')) document.getElementById('ai-text').innerText = result.explanation;
    
    currentState = 3;
    drawBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';

    setTimeout(() => {
        originalContainer.scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

// ── 주사위 자동작괘 모드 제어 ──────────────────────────
function handleDraw() {
    switch (currentState) {
        case 0: drawUpper(); break;
        case 1: drawLower(); break;
        case 2: drawMoving(); break;
    }
}

function drawUpper() {
    divinationData.upper = Math.floor(Math.random() * 8) + 1;
    currentState = 1;
    statusMsg.innerText = `상괘로 '${TRIGRAM_NAMES[divinationData.upper].name}(${TRIGRAM_NAMES[divinationData.upper].nature})'괘를 얻었습니다. 하괘를 뽑으세요.`;
    drawBtn.innerText = "하괘 뽑기";
    renderOriginal();
    originalContainer.style.display = 'block';
}

function drawLower() {
    divinationData.lower = Math.floor(Math.random() * 8) + 1;
    currentState = 2;
    const hex = HEXAGRAM_TABLE[divinationData.upper][divinationData.lower];
    statusMsg.innerText = `하괘로 '${TRIGRAM_NAMES[divinationData.lower].name}(${TRIGRAM_NAMES[divinationData.lower].nature})'괘를 얻어 '${hex.name}' 본괘가 완성되었습니다. 동효를 뽑으세요.`;
    drawBtn.innerText = "동효 뽑기";
    renderOriginal();
}

function drawMoving() {
    divinationData.moving = Math.floor(Math.random() * 6) + 1;
    currentState = 3;
    statusMsg.innerText = `${divinationData.moving}효가 변하여 본괘가 지괘로 바뀌었습니다. 결과를 확인하십시오.`;
    drawBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';
    renderOriginal();
    renderTransformed();
    transformedContainer.style.display = 'block';
    showInterpretation();
}

// ── 공통: 해설 및 물상표 표출 ──────────────────────────
function showInterpretation() {
    const originalHex = HEXAGRAM_TABLE[divinationData.upper][divinationData.lower];
    const hexId = originalHex.id.toString();
    const lineNum = divinationData.moving;

    let gwaesaText = "괘사 정보를 찾을 수 없습니다.";
    let hyosaText = "효사 정보를 찾을 수 없습니다.";

    if (typeof HEXAGRAM_LINES_TEXT !== 'undefined' && HEXAGRAM_LINES_TEXT[hexId]) {
        if (HEXAGRAM_LINES_TEXT[hexId]["0"]) gwaesaText = HEXAGRAM_LINES_TEXT[hexId]["0"];
        if (HEXAGRAM_LINES_TEXT[hexId][lineNum.toString()]) hyosaText = HEXAGRAM_LINES_TEXT[hexId][lineNum.toString()];
    }

    interpretationText.innerText = "【 괘사 (卦辭) 】\n" + gwaesaText + "\n\n【 동효 (動爻) 】\n" + hyosaText;

    if (typeof TRIGRAM_PROPERTIES !== 'undefined') {
        let changedTrigramIdx = null;
        if (lineNum <= 3) {
            const lowerLines = [...TRIGRAM_LINES[divinationData.lower]];
            lowerLines[lineNum - 1] = lowerLines[lineNum - 1] === 1 ? 0 : 1;
            changedTrigramIdx = findTrigramIndex(lowerLines);
        } else {
            const upperLines = [...TRIGRAM_LINES[divinationData.upper]];
            upperLines[lineNum - 4] = upperLines[lineNum - 4] === 1 ? 0 : 1;
            changedTrigramIdx = findTrigramIndex(upperLines);
        }

        const uProp = TRIGRAM_PROPERTIES[divinationData.upper];
        const lProp = TRIGRAM_PROPERTIES[divinationData.lower];
        const cProp = TRIGRAM_PROPERTIES[changedTrigramIdx];

        const propKeys = ["卦德", "人倫", "人品", "動物", "人體", "物色", "器물", "雜物"];

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
}

function renderOriginal() {
    const visual = document.getElementById('original-visual');
    const nameEl = document.getElementById('original-name');
    const hanjaEl = document.getElementById('original-hanja');
    visual.innerHTML = '';

    if (divinationData.upper) {
        const upperReversed = [...TRIGRAM_LINES[divinationData.upper]].reverse();
        upperReversed.forEach((lineType, index) => {
            const lineNum = 6 - index;
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
        const lowerReversed = [...TRIGRAM_LINES[divinationData.lower]].reverse();
        lowerReversed.forEach((lineType, index) => {
            const lineNum = 3 - index;
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

    const allLines = [...TRIGRAM_LINES[divinationData.lower], ...TRIGRAM_LINES[divinationData.upper]];
    const transformedLines = allLines.map((line, index) => {
        if (index + 1 === divinationData.moving) return line === 1 ? 0 : 1;
        return line;
    });

    for (let i = 5; i >= 0; i--) {
        addLine(visual, transformedLines[i], false);
    }

    const newLowerLines = transformedLines.slice(0, 3);
    const newUpperLines = transformedLines.slice(3, 6);
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
        if (JSON.stringify(TRIGRAM_LINES[i]) === JSON.stringify(lines)) return i;
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
    if (document.getElementById('ai-interpretation')) document.getElementById('ai-interpretation').style.display = 'none';
    if (document.getElementById('ai-loading')) document.getElementById('ai-loading').style.display = 'none';
}

function init() {
    console.log("주역점 앱 초기화...");
    drawBtn = document.getElementById('draw-btn');
    resetBtn = document.getElementById('reset-btn');
    statusMsg = document.getElementById('status-msg');
    originalContainer = document.getElementById('original-container');
    transformedContainer = document.getElementById('transformed-container');
    interpretationContainer = document.getElementById('interpretation-container');
    interpretationText = document.getElementById('interpretation-text');

    if (window.AI_INJECT_DATA) {
        handleInjectedAIResult(window.AI_INJECT_DATA);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}