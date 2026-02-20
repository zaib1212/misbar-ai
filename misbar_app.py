import streamlit as st
import google.generativeai as genai
from fpdf import FPDF

# إعداد الذكاء الاصطناعي
genai.configure(api_key="AIzaSyAZP-2WeCKUiPHzCwOh0gljE7J49rAF9RA")

def create_pdf(text, school, teacher):
    pdf = FPDF()
    pdf.add_page()
    # ملاحظة: FPDF تدعم الإنجليزية بشكل أساسي، للغة العربية نحتاج إعدادات متقدمة
    # سنقوم حالياً بإنشاء الملف بتنسيق بسيط
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"School: {school}", ln=1, align='C')
    pdf.cell(200, 10, txt=f"Teacher: {teacher}", ln=2, align='C')
    pdf.ln(10)
    pdf.multi_cell(0, 10, txt=text)
    return pdf.output(dest='S').encode('latin-1', 'ignore')

# --- واجهة التطبيق ---
st.set_page_config(page_title="مسبار الذكي 2.5", layout="centered")

if 'page' not in st.session_state:
    st.session_state.page = 'welcome'

if st.session_state.page == 'welcome':
    st.markdown("<h1 style='text-align: center;'>🤖 مسبار الذكي</h1>", unsafe_allow_html=True)
    if st.button("🚀 ابدأ رحلة الإعداد"):
        st.session_state.page = 'settings'
        st.rerun()

elif st.session_state.page == 'settings':
    st.markdown("## 🛡️ إعدادات اختبار نافس")
    
    with st.container():
        school_name = st.text_input("اسم المدرسة")
        teacher_name = st.text_input("اسم المعلم")
        subject = st.radio("المادة", ["الرياضيات", "العلوم", "لغتي"], horizontal=True)
        target_class = st.selectbox("الصف", ["السادس ابتدائي", "الثالث متوسط"])

    if st.button("توليد الأسئلة وتحضير الملف"):
        with st.spinner("🧠 مسبار يقوم بإنشاء الاختبار..."):
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"أنشئ اختبار نافس لمادة {subject} للصف {target_class}. اكتب الأسئلة باللغة العربية."
            response = model.generate_content(prompt)
            
            test_content = response.text
            st.success("تم توليد الأسئلة بنجاح!")
            st.text_area("معاينة الاختبار:", value=test_content, height=300)
            
            # زر تحميل PDF
            pdf_data = create_pdf(test_content, school_name, teacher_name)
            st.download_button(
                label="📥 تحميل الاختبار كـ PDF",
                data=pdf_data,
                file_name=f"test_{subject}.pdf",
                mime="application/pdf"
            )
 
