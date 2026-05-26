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
        color: #e0e0e0 !important; /* 글자 색상을 연회색으로 변경 */
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

# --- AI 작괘 처리 함수 ---
def call_gemini_ai(prompt_text):
    if not api_key or api_key == "내_실제_API_키_입력":
        return {"error": "API 키가 설정되지 않았습니다. .streamlit/secrets.toml 파일에 실제 키를 입력했는지 확인해 주세요."}
    
    # 목록에서 확인된 정확한 별칭 사용
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"
    
    # --- 현재 한국 시간의 시, 분, 초를 정수로 추출 ---
    import datetime
    tz_kst = datetime.timezone(datetime.timedelta(hours=9))
    kor_now = datetime.datetime.now(tz_kst)
    
    current_time_data = {
        "year": kor_now.year,
        "month": kor_now.month,
        "day": kor_now.day,
        "hour": kor_now.hour
    }
    
    # 주역점 전문 프롬프트
    full_prompt = f"""
    [역할 정의]
    당신은 사용자의 문장을 상수역학(象數易學)과 매화역수(梅花易數)의 원리에 따라 철저하게 '물상(物象)'과 '수리(數理)'로 변환하는 정밀한 작괘 엔진(Oracle Engine)이다. 작괘를 할 때는 의미나 감정 해석에 치우치지 말고 자연계의 8대 물상을 최우선 기준으로 삼아 괘와 효를 계산하라.

    [사용자 입력 데이터]
    - 질문/상황: "{prompt_text}"
    - 기준 시각 (한국 표준시): {json.dumps(current_time_data)} 
      (※ 이 변수 값을 바탕으로 아래 [규칙 1의 3단계] 및 [규칙 2의 2단계] 연산 식을 오차 없이 계산하라.)

    [작괘 알고리즘 및 규칙]

    1. 상괘(외괘) 및 하괘(내괘) 결정 단계(물상 중심):
       - 1단계: [최우선 원칙 - 물상] 문장에서 가장 직관적이고 뚜렷하게 연상되는 '자연물이나 형상(물상)'을 먼저 추출하여 소성괘를 매칭한다.
         * 8대 물상 기준: 건(1)=天, 태(2)=澤, 리(3)=火, 진(4)=雷, 손(5)=風, 감(6)=水, 간(7)=山, 곤(8)=地
         * 예: "주식 폭락, 하락, 우울" -> 아래로 떨어지거나 흐르는 물상인 '감(6, 水)' 또는 '곤(8, 地)'
       - 2단계: [차선책 - 상황] 문장이 너무 추상적이거나 단어가 짧아 '물상'을 도저히 도출할 수 없는 경우에만, 상황의 성격(나아감, 정체, 충돌, 수렴)을 괘의 의미와 연결하여 도출하라.
       - 3단계: [최후의 수단 - 수리 공식] 물상과 상황으로 괘를 정할 수 없는 예외적인 경우에만, 제공된 기준 시각 숫자를 모두 더해 아래 공식으로 수학적 작괘를 수행하라.
         * 상괘(외괘) = (year + month + day) % 8 
         * 하괘(내괘) = (year + month + day + hour) % 8
         * (단, %8 연산 결과가 0이면 상/하괘는 모두 8로 간주한다.)

    2. 동효(動爻) 계산 규칙 (★절대 변조 불가 수학 공식):
       - 1단계: 물상이나 상황에 나오는 특정 숫자(예: 3가지 문제, 5명 등)가 있다면 그것을 우선적으로 동효로 삼는다.
       - 2단계: 만약 물상이나 상황에서 동효 숫자를 지정할 수 없는 경우, 아래 공식으로 동효를 정한다.
         * 최종 동효 = (year + month + day + hour) % 6
         * (단, %6 연산 결과가 0이면 최종 동효는 반드시 '6'으로 결정한다.)
         * 산수 오류는 절대 용납되지 않는다. 신중하게 검산 후 최종 값을 도출하라.

    [반드시 준수할 출력 형식]
    - 결과는 웹앱 프론트엔드(script.js)에서 즉시 구조적으로 활용하고 화면에 파싱 오류 없이 뿌릴 수 있도록 아래 지정된 JSON 구조로만 출력하라.
    - 마크다운 백틱(```json ... ```)이나 부가적인 설명 텍스트를 절대 붙이지 말고 오직 순수한 JSON 객체만 반환하라.

    {{
      "upper": 숫자(1~8),
      "lower": 숫자(1~8),
      "moving": 숫자(1~6),
      "rationale": "상·하괘를 선정한 구체적 물상학적 근거(물상이 안 될 때 규칙1의 3단계 연산 과정을 명시할 것) 및 동효 연산 과정 [예: (Y+M+D+H)%6 = 최종동효]을 명확히 기록한 분석 (한국어)",
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
        
        # 1. API 자체 에러 확인 (API 키 오류 등)
        if 'error' in res_json:
            error_msg = res_json['error'].get('message', '알 수 없는 API 에러')
            return {"error": f"Google API 오류: {error_msg}"}
            
        # 2. 답변 존재 여부 확인
        if 'candidates' not in res_json or not res_json['candidates']:
            return {"error": "AI가 응답을 생성하지 못했습니다. (안전 정책에 의해 차단되었거나 답변이 없음)"}

        text_response = res_json['candidates'][0]['content']['parts'][0]['text']
        # 마크다운 백틱 제거 및 JSON 파싱
        cleaned_text = re.sub(r'```json|```', '', text_response).strip()
        return json.loads(cleaned_text)
    except Exception as e:
        return {"error": f"AI 분석 중 오류가 발생했습니다: {str(e)}"}



# --- 세션 상태 초기화 ---
if "ai_result" not in st.session_state:
    st.session_state.ai_result = None

# --- UI 레이아웃 (상단 AI 입력 섹션) ---
with st.expander("✨ AI 상황작괘 (묻고 싶은 것이나 특정한 상황을 입력하여 점치기)", expanded=False):
    # 컬럼 배치 (버튼과 입력창 수평 정렬 유지)
    col1, col2 = st.columns([4, 1])
    with col1:
        # label_visibility="collapsed"를 사용하여 버튼과 수평 정렬
        situation_input = st.text_input("상황 입력", placeholder="예: 길 건너편에서 흰 고양이가 5번 울고 가는 것을 봤는데 어떤 의미일까요?", label_visibility="collapsed")
    with col2:
        # 버튼이 입력창과 높이가 맞도록 스타일 조정
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

    # CSS 인라인 주입 + 중앙 정렬 수정
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
