import streamlit as st
import streamlit.components.v1 as components
import re
import requests

st.set_page_config(
    page_title="주역점 - 하늘과 땅의 이치를 묻다",
    page_icon="☯️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

st.markdown("""
    <style>
    .stApp { background-color: #0a0a0f; }
    #MainMenu, footer, header { visibility: hidden; }
    .block-container { padding: 0 !important; max-width: 100% !important; }
    </style>
""", unsafe_allow_html=True)

api_key = st.secrets.get("GEMINI_API_KEY", "")

# ── Python 백엔드로 Gemini 호출 ──────────────────────────────
# JS의 fetch가 CORS에 막히는 경우를 위해 Python이 대신 호출
if "gemini_prompt" in st.query_params:
    prompt = st.query_params.get("gemini_prompt", "")
    if prompt and api_key:
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
        try:
            resp = requests.post(
                url + "?key=" + api_key,
                json={"contents": [{"parts": [{"text": prompt}]}],
                      "generationConfig": {"temperature": 0.7}},
                timeout=30
            )
            st.json(resp.json())
        except Exception as e:
            st.error(str(e))
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

    # CSS 인라인 주입
    html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + css + '</style>')

    # body 수직 중앙정렬 제거 (iframe 화면 밀림 방지)
    body_fix = '<style>body{justify-content:flex-start!important;padding-top:2rem;}</style>'

    # ★ f-string 사용 금지 ★
    # data.js 안의 \\n 이 f-string에서 실제 줄바꿈으로 변환되어 JS SyntaxError 발생
    # → + 연산자로 직접 연결
    api_key_js = 'window.STREAMLIT_API_KEY = "' + api_key.replace('"', '\\"') + '";'

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
    html = html.replace('</body>', body_fix + '\n</body>')

    return html

app_html = load_app()
components.html(app_html, height=2200, scrolling=True)
