import streamlit as st
import streamlit.components.v1 as components
import re
import requests
import json

st.set_page_config(
    page_title="주역점 - 하늘과 땅의 이치를 묻다",
    page_icon="☯️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# 기본 스타일 설정
st.markdown("""
    <style>
    #MainMenu, footer, header { visibility: hidden; height: 0; }
    .block-container { padding: 0 !important; margin: 0 !important; }
    .stApp { background-color: #0a0a0f; }
    
    .stSpinner > div > div {
        color: #ffffff !important; /* 글자 색상을 완전한 흰색으로 변경 */
        font-weight: 500;          /* 글자를 조금 더 도톰하게 조절 */
    }
    .stSpinner [data-testid="stSpinnerCube"], 
    .stSpinner svg, 
    .stSpinner i,
    div[role="status"] svg {
        stroke: #ffd700 !important;
        color: #ffd700 !important;
        fill: #ffd700 !important;
    }
            
    /* 펼침 메뉴 스타일 */
    .stExpander { 
        background: rgba(255,255,255,0.05); 
        border-radius: 10px; 
        margin: 10px 20px;
        border: 1px solid rgba(255,215,0,0.3);
    }
    </style>
""", unsafe_allow_html=True)

api_key = st.secrets.get("GEMINI_API_KEY", "").strip()

# --- AI 상황작괘 처리 함수 ---
def call_gemini_ai(prompt_text):
    if not api_key or api_key == "내_실제_API_키_입력":
        return {"error": "API 키가 설정되지 않았습니다. .streamlit/secrets.toml 파일에 실제 키를 입력했는지 확인해 주세요."}
    
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"
    
    # 순수 물상 중심의 상황작괘 프롬프트
    full_prompt = f"""
    [역할 정의]
    당신은 사용자의 문장을 상수역학(象數易學)과 매화역수(梅花易數)의 원리에 따라 철저하게 '물상(物象)'과 '수리(數理)'로 변환하는 정밀한 작괘 엔진(Oracle Engine)이다. 의미나 감정 해석에 치우치지 말고 자연계의 8대 물상을 최우선 기준으로 삼아 괘와 효를 계산하라.

    [사용자 입력 데이터]
    - 질문/상황: "{prompt_text}"

    [작괘 알고리즘 및 규칙]

    1. 상괘(외괘) 및 하괘(내괘) 결정 단계 (물상학적 매칭):
       - 1단계: [최우선 원칙 - 물상 추출] 문장에서 가장 직관적이고 뚜렷하게 연상되는 '자연물이나 형상, 사물, 인물(물상)'을 먼저 추출하여 소성괘를 매칭한다.
         * 8대 물상 기준: 건(1)=天, 태(2)=澤, 리(3)=火, 진(4)=雷, 손(5)=風, 감(6)=水, 간(7)=山, 곤(8)=地
         * 물상의 주된 매칭은 주역 설괘전(說卦傳)의 분류 체계를 따른다. (예: 방위, 계절, 색깔, 동물, 가족 구성원, 신체 부위 등)
         * 예: "갈색 고양이가 울었다" -> 고양이는 손(5, 風) 또는 이 부근의 색깔이나 동물 물상 매칭, 울음소리나 움직임은 진(4, 雷) 등 문맥상 가장 지배적인 물상을 추출.
       - 2단계: [차선책 - 상황 매칭] 문장이 너무 추상적이거나 단어가 짧아 구체적 '물상'을 도출할 수 없는 경우에만, 상황의 동적 성격(나아감, 정체, 충돌, 수렴)을 8대 괘의 성질(건=강건함, 곤=유순함, 감=함정 등)과 연결하여 상괘와 하괘를 결정하라.

    2. 동효(動爻) 계산 규칙:
       - 문장에 직접 언급된 특정 숫자(예: 3번, 5명 등)가 있다면 그것을 우선적으로 동효로 취한다.
       - 문장에 숫자가 없다면, 입력된 문장의 전체 글자 수(공백 제외) 또는 핵심 단어의 수리를 6으로 나눈 나머지로 동효를 결정하라.
         * (단, 6으로 나누어 떨어지는 나머지가 0이 나올 경우 최종 동효는 반드시 '6'으로 결정한다.)
         * 산수 오류는 절대 용납되지 않는다. 신중하게 검산 후 최종 값을 도출하라.

    [반드시 준수할 출력 형식]
    - 결과는 웹앱 프론트엔드(script.js)에서 즉시 구조적으로 활용하고 화면에 파싱 오류 없이 뿌릴 수 있도록 아래 지정된 JSON 구조로만 출력하라.
    - 마크다운 백틱(```json ... ```)이나 부가적인 설명 텍스트를 절대 붙이지 말고 오직 순수한 JSON 객체만 반환하라.

    {{
      "upper": 숫자(1~8),
      "lower": 숫자(1~8),
      "moving": 숫자(1~6),
      "rationale": "사용자의 문장에서 어떤 단어와 상징을 통해 상괘, 하괘를 물상학적으로 추출했는지, 그리고 동효 수리는 어떻게 연산했는지 명확하고 구체적으로 서술 (한국어)",
      "explanation": "도출된 본괘, 지괘, 동효가 현재 사용자의 상황에 주는 현대적이고 명쾌한 역학적 조언 및 해설 (한국어)"
    }}
    """
    
    try:
        resp = requests.post(
            f"{url}?key={api_key}",
            json={
                "contents": [{"parts": [{"text": full_prompt}]}],
                "generationConfig": {"temperature": 0.7}
            },
            timeout=30
        )
        res_json = resp.json()
        
        if 'error' in res_json:
            error_msg = res_json['error'].get('message', '알 수 없는 API 에러')
            return {"error": f"Google API 오류: {error_msg}"}
            
        if 'candidates' not in res_json or not res_json['candidates']:
            return {"error": "AI가 응답을 생성하지 못했습니다."}

        text_response = res_json['candidates'][0]['content']['parts'][0]['text']
        cleaned_text = re.sub(r'```json|```', '', text_response).strip()
        return json.loads(cleaned_text)
    except Exception as e:
        return {"error": f"AI 분석 중 오류가 발생했습니다: {str(e)}"}


# --- 세션 상태 초기화 ---
if "ai_result" not in st.session_state:
    st.session_state.ai_result = None

# --- UI 레이아웃 (상단 AI 입력 섹션) ---
with st.expander("✨ AI 상황작괘 (묻고 싶은 것이나 특정한 상황을 입력하여 점치기)", expanded=False):
    col1, col2 = st.columns([4, 1])
    with col1:
        situation_input = st.text_input("상황 입력", placeholder="예: 길 건너편에서 흰 고양이가 5번 울고 가는 것을 봤는데 어떤 의미일까요?", label_visibility="collapsed")
    with col2:
        if st.button("작괘하기", use_container_width=True):
            if situation_input:
                with st.spinner("하늘의 이치를 묻는 중..."):
                    result = call_gemini_ai(situation_input)
                    st.session_state.ai_result = result
            else:
                st.warning("내용을 입력해주세요.")

# --- 메인 앱 로드 함수 ---
def load_app(ai_data=None):
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()
    with open("style.css", "r", encoding="utf-8") as f:
        css = f.read()
    with open("data.js", "r", encoding="utf-8") as f:
        data_js = f.read()
    with open("dictionary.js", "r", encoding="utf-8") as f:
        dict_js = f.read()
    with open("script.js", "r", encoding="utf-8") as f:
        script_js = f.read()

    body_override = (
        'html { height:100%; margin:0; }'
        'body {'
        '  display:flex;'
        '  flex-direction:column;'
        '  align-items:center !important;'
        '  justify-content:flex-start !important;'
        '  padding:0 !important;'
        '  margin:0 !important;'
        '  min-height:100vh !important;'
        '}'
        '.stApp {'
        '  display:flex;'
        '  flex-direction:column;'
        '  align-items:center !important;'
        '  justify-content:flex-start !important;'
        '  padding:0 !important;'
        '  margin:0 !important;'
        '}'
    )
    html = html.replace(
        '<link rel="stylesheet" href="style.css">',
        '<style>' + css + '\n' + body_override + '</style>'
    )

    # AI 결과 데이터 주입 및 앱 URL 전달
    ai_inject_js = (
        f"window.AI_INJECT_DATA = {json.dumps(ai_data)};\n"
        f"window.STREAMLIT_APP_URL = window.location.origin + window.location.pathname;"
    )

    # JS 통합
    combined_js = (
        '<script>\n'
        + ai_inject_js + '\n'
        + 'window.STREAMLIT_API_KEY = "";\n' 
        + data_js + '\n'
        + dict_js + '\n'
        + script_js + '\n'
        + '</script>'
    )

    html = re.sub(r'<script src="data\.js"></script>\s*', '', html)
    html = re.sub(r'<script src="dictionary\.js"></script>\s*', '', html)
    html = html.replace('<script src="script.js"></script>', combined_js)

    return html

# 앱 렌더링
app_html = load_app(st.session_state.ai_result)
components.html(app_html, height=1800, scrolling=True)