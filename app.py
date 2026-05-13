import streamlit as st
import streamlit.components.v1 as components
import re

st.set_page_config(
    page_title="주역점 - 하늘과 땅의 이치를 묻다",
    page_icon="☯️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Streamlit 기본 UI 완전 숨기기
st.markdown("""
    <style>
    .stApp { background-color: #0a0a0f; }
    #MainMenu, footer, header { visibility: hidden; }
    .block-container { padding: 0 !important; max-width: 100% !important; }
    iframe { border: none !important; }
    </style>
""", unsafe_allow_html=True)

# Secrets에서 API 키 (없으면 빈 문자열)
api_key = st.secrets.get("GEMINI_API_KEY", "")

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
    html = html.replace('<link rel="stylesheet" href="style.css">', f'<style>{css}</style>')

    # body의 justify-content: center 제거 → 화면 밀림 방지
    # (iframe은 자체 스크롤이 있으므로 수직 중앙정렬 불필요)
    css_fix = """
    <style>
    body {
        justify-content: flex-start !important;
        padding-top: 2rem;
    }
    </style>
    """

    # JS 통합 주입 (API 키 포함)
    combined_js = f"""
    <script>
        // Streamlit에서 주입한 API 키
        window.STREAMLIT_API_KEY = "{api_key}";
        {data_js}
        {dict_js}
        {script_js}
    </script>
    """

    # 기존 script 태그 제거 후 통합본 삽입
    html = re.sub(r'<script src="data\.js"></script>', '', html)
    html = re.sub(r'<script src="dictionary\.js"></script>', '', html)
    html = re.sub(r'<script src="script\.js"></script>', combined_js, html)

    # body 닫기 전에 CSS 오버라이드 삽입
    html = html.replace('</body>', css_fix + '</body>')

    return html

app_html = load_app()

# 높이를 넉넉하게 설정 (스크롤 허용)
components.html(app_html, height=2200, scrolling=True)
