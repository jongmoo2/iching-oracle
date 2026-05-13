import streamlit as st
import streamlit.components.v1 as components
import os
import json

# 페이지 설정
st.set_page_config(
    page_title="주역점 - 하늘과 땅의 이치를 묻다",
    page_icon="☯️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Secrets에서 API 키 가져오기 (배포용)
# 로컬 테스트 시에는 .streamlit/secrets.toml에 GEMINI_API_KEY="값" 필요
api_key = st.secrets.get("GEMINI_API_KEY", "")

def load_app():
    # 파일 읽기
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

    # HTML 내부에 리소스 주입 (Streamlit 컴포넌트 특성상 인라인이 가장 안정적임)
    html = html.replace('<link rel="stylesheet" href="style.css">', f'<style>{css}</style>')
    
    # 스크립트 주입 및 API 키 전달 로직 추가
    # 스크립트 태그들을 하나로 합쳐서 주입
    combined_js = f"""
    <script>
        {data_js}
        {dict_js}
        // Streamlit에서 넘겨준 API 키를 전역 변수로 설정
        window.STREAMLIT_API_KEY = "{api_key}";
        {script_js}
    </script>
    """
    
    # 기존 script src 태그들 제거 및 통합 스크립트 삽입
    import re
    html = re.sub(r'<script src="data.js"></script>', '', html)
    html = re.sub(r'<script src="dictionary.js"></script>', '', html)
    html = re.sub(r'<script src="script.js"></script>', combined_js, html)

    return html

# 메인 화면
st.markdown("""
    <style>
    .stApp { background-color: #0a0a0f; }
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    </style>
""", unsafe_allow_html=True)

app_html = load_app()
components.html(app_html, height=1500, scrolling=True)
