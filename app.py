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
    url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"
    
    # 주역점 전문 프롬프트
    full_prompt = f"""
    사용자가 다음 상황에 대해 주역점을 치려고 합니다:
    "{prompt_text}"
    
    당신은 주역(I Ching)과 매화역수 등에 능통한 역학자입니다. 이 상황과 내용을 분석하여 가장 적절한 상괘(1~8), 하괘(1~8), 동효(1~6)를 도출해주세요. 
    결과는 반드시 다음 형식의 JSON으로만 반환해주세요:
    {{
      "upper": 숫자(1~8),
      "lower": 숫자(1~8),
      "moving": 숫자(1~6),
      "rationale": "왜 이 괘와 동효를 도출했는지에 대한 작괘 근거 및 상황 분석 (한국어)",
      "explanation": "이 점괘가 현재 상황에 대해 주는 조언 및 해설 (한국어)"
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
        situation_input = st.text_input("상황 입력", placeholder="예: 이번 프로젝트의 성패는 어떻게 될까요?", label_visibility="collapsed")
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
