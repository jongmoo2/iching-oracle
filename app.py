import streamlit as st
import streamlit.components.v1 as components
import re
import requests
import json

# 1. 페이지 설정 (최상단 고정)
st.set_page_config(
    page_title="주역점 - 하늘과 땅의 이치를 묻다",
    page_icon="☯️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# 2. 상단 공백 및 기본 패딩 강제 제거
st.markdown("""
    <style>
    /* 스트림릿 기본 요소 숨기기 */
    #MainMenu, footer, header { visibility: hidden; height: 0; }
    /* 상단 공백 제거 */
    .block-container { padding: 0 !important; margin: 0 !important; }
    .stApp { background-color: #0a0a0f; }
    iframe { display: block; }
    </style>
""", unsafe_allow_html=True)

api_key = st.secrets.get("GEMINI_API_KEY", "")

# 3. Python 백엔드 (JS 응답용)
params = st.query_params
if "gemini_prompt" in params:
    prompt = params["gemini_prompt"]
    if api_key:
        url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"
        try:
            resp = requests.post(
                f"{url}?key={api_key}",
                json={"contents": [{"parts": [{"text": prompt}]}],
                      "generationConfig": {"temperature": 0.7}},
                timeout=30
            )
            # 마커를 사용하여 순수 데이터만 출력
            st.text(f"[[START]]{json.dumps(resp.json())}[[END]]")
        except Exception as e:
            st.text(f"[[START]]{json.dumps({'error': str(e)})}[[END]]")
    st.stop()

# 4. 앱 로드 로직
def load_app():
    with open("index.html", "r", encoding="utf-8") as f: html = f.read()
    with open("style.css", "r", encoding="utf-8") as f: css = f.read()
    with open("data.js", "r", encoding="utf-8") as f: data_js = f.read()
    with open("dictionary.js", "r", encoding="utf-8") as f: dict_js = f.read()
    with open("script.js", "r", encoding="utf-8") as f: script_js = f.read()

    # CSS 주입 및 여백 강제 수정
    html = html.replace('<link rel="stylesheet" href="style.css">', f'<style>{css}\nbody{{margin:0;padding:0;justify-content:flex-start!important;}}</style>')
    
    # 스크립트 통합
    combined_js = f"<script>\n{data_js}\n{dict_js}\n{script_js}\n</script>"
    html = re.sub(r'<script src="data\.js"></script>', '', html)
    html = re.sub(r'<script src="dictionary\.js"></script>', '', html)
    html = html.replace('<script src="script.js"></script>', combined_js)
    
    return html

app_html = load_app()
# 높이를 넉넉히 주되 상단 정렬
components.html(app_html, height=1600, scrolling=True)