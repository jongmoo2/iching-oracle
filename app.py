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

st.markdown("""
    <style>
    #MainMenu, footer, header { visibility: hidden; height: 0; }
    .block-container { padding: 0 !important; margin: 0 !important; }
    .stApp { background-color: #0a0a0f; }
    </style>
""", unsafe_allow_html=True)

api_key = st.secrets.get("GEMINI_API_KEY", "")

# Python 백엔드 Gemini 호출 (JS fetch CORS 우회용)
if "gemini_prompt" in st.query_params:
    prompt = st.query_params["gemini_prompt"]
    if api_key:
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent"
        try:
            resp = requests.post(
                url + "?key=" + api_key,
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"temperature": 0.7}
                },
                timeout=30
            )
            st.text("[[START]]" + json.dumps(resp.json()) + "[[END]]")
        except Exception as e:
            st.text("[[START]]" + json.dumps({"error": str(e)}) + "[[END]]")
    st.stop()

def load_app():
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

    # CSS 인라인 주입 + body 밀림 수정
    # ★ f-string 절대 사용 금지 ★
    # data.js 안의 \\n 이 f-string에서 실제 줄바꿈으로 변환 → JS SyntaxError
    body_override = (
        'html { height:100%; margin:0; }'
        'body {'
        '  display:flex;'
        '  flex-direction:column;'
        '  align-items:center !important;'
        '  justify-content:center !important;'
        '  padding:0 !important;'
        '  margin:0 !important;'
        '  min-height:100vh !important;'
        '}'
        '.stApp {'
        '  display:flex;'
        '  flex-direction:column;'
        '  align-items:center !important;'
        '  justify-content:center !important;'
        '  padding:0 !important;'
        '  margin:0 !important;'
        '}'
    )
    html = html.replace(
        '<link rel="stylesheet" href="style.css">',
        '<style>' + css + '\n' + body_override + '</style>'
    )

    # API 키 전역 변수 선언 (+ 연산자로 연결, f-string 사용 안 함)
    api_key_js = 'window.STREAMLIT_API_KEY = "' + api_key.replace('"', '\\"') + '";'

    # JS 통합 (+ 연산자로 연결)
    combined_js = (
        '<script>\n'
        + api_key_js + '\n'
        + data_js + '\n'
        + dict_js + '\n'
        + script_js + '\n'
        + '</script>'
    )

    html = re.sub(r'<script src="data\.js"></script>\s*', '', html)
    html = re.sub(r'<script src="dictionary\.js"></script>\s*', '', html)
    html = html.replace('<script src="script.js"></script>', combined_js)

    return html

app_html = load_app()
components.html(app_html, height=1800, scrolling=True)
