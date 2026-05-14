import streamlit as st
import streamlit.components.v1 as components
import re
import requests
import json

st.set_page_config(page_title="주역점", page_icon="☯️", layout="wide")

# 스트림릿 Secrets에서 키 가져오기
api_key = st.secrets.get("GEMINI_API_KEY", "")

# ── [핵심] Python 백엔드: JS의 요청을 처리 ──────────────────────
# query_params 대신 앱 최상단에서 즉시 응답을 쏘고 종료하게 구성
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
            # 스트림릿 서식을 모두 무시하고 '순수 JSON'만 텍스트로 출력
            st.write(f"[[START]]{json.dumps(resp.json())}[[END]]")
        except Exception as e:
            st.write(f"[[START]]{json.dumps({'error': str(e)})}[[END]]")
    st.stop()

# ── 앱 화면 로드 ──────────────────────────────────────────
def load_app():
    with open("index.html", "r", encoding="utf-8") as f: html = f.read()
    with open("style.css", "r", encoding="utf-8") as f: css = f.read()
    with open("data.js", "r", encoding="utf-8") as f: data_js = f.read()
    with open("dictionary.js", "r", encoding="utf-8") as f: dict_js = f.read()
    with open("script.js", "r", encoding="utf-8") as f: script_js = f.read()

    html = html.replace('<link rel="stylesheet" href="style.css">', f'<style>{css}</style>')
    combined_js = f"<script>\n{data_js}\n{dict_js}\n{script_js}\n</script>"
    
    html = re.sub(r'<script src="data\.js"></script>', '', html)
    html = re.sub(r'<script src="dictionary\.js"></script>', '', html)
    html = html.replace('<script src="script.js"></script>', combined_js)
    return html

app_html = load_app()
components.html(app_html, height=1800, scrolling=True)