import streamlit as st
import google.generativeai as genai
from fpdf import FPDF

# إعداد الذكاء الاصطناعي بمفتاحك
genai.configure(api_key="AIzaSyAZP-2WeCKUiPHzCwOh0gljE7J49rAF9RA")

# دالة تحويل النص إلى PDF (دعم أساسي)
def create_pdf(text, school, teacher, subject):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Misbar Smart Platform", ln=1, align='C')
    pdf.cell(200, 10, txt=f"School: {school} - Teacher: {teacher}", ln=2, align='C')
    pdf.cell(200, 10, txt=f"Subject: {subject}", ln=3, align='C')
    pdf.ln(10)
    pdf.multi_cell(0, 10, txt=text)
    return pdf.output(dest='S').encode('latin-1', 'ignore')

# --- تصميم الواجهة الاحترافية ---
st.set_page_config(page_title="منصة مسبار الذكي", layout="centered")

# التنسيق البصري ليطابق صورتك
st.markdown("""
    <style>
    .main { background-color: #f8f9fa; }
    .stButton>button { background-color: #27ae60; color: white; border-radius: 10px; font-weight: bold; }
    .card-style { background-color: white; padding: 20px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    </style>
    """, unsafe_allow_html=True)

st.title("🛡️ إعدادات اختبار نافس المتقدمة")

# 1. قسم البيانات المدرسية
with st.container():
    st.markdown('<div class="card-style">', unsafe_allow_html=True)
    st.subheader("📋 البيانات المدرسية")
    col1, col2 = st.columns(2)
    with col1:
        school_name = st.text_input("اسم المدرسة", placeholder="مثلاً: مدرسة التميز")
    with col2:
        teacher_name = st.text_input("اسم المعلم/ة")
    st.markdown('</div>', unsafe_allow_html=True)

st.divider()

# 2. تفاصيل المادة والمعايير (كما في صورتك)
with st.container():
    st.markdown('<div class="card-style">', unsafe_allow_html=True)
    st.subheader("📝 تفاصيل المحتوى")
    subject = st.selectbox("المادة الدراسية", ["الرياضيات", "العلوم", "لغتي", "الفيزياء", "الكيمياء"])
    target_class = st.selectbox("الصف والمرحلة", ["السادس ابتدائي", "الثالث متوسط", "الثالث ابتدائي"])
    
    doc_type = st.radio("نوع الوثيقة", ["ورق عمل", "اختبار فترتي", "اختبار نهائي", "خطة علاجية"], horizontal=True)
    
    st.write("🎯 المعايير المطلوبة:")
    c1, c2, c3 = st.columns(3)
    with c1: st.checkbox("الأشكال الهندسية")
    with c2: st.checkbox("المستوى الإحداثي")
    with c3: st.checkbox("وحدات القياس")
    
    num_questions = st.slider("عدد الأسئلة", 5, 20, 10)
    st.markdown('</div>', unsafe_allow_html=True)

# 3. زر التوليد الذكي (الزر الأخضر في صورتك)
if st.button("✨ توليد المحتوى الذكي"):
    if not school_name or not teacher_name:
        st.warning("يرجى إكمال البيانات المدرسية أولاً")
    else:
        with st.spinner("🧠 جاري ابتكار الأسئلة بناءً على المعايير..."):
            try:
                model = genai.GenerativeModel('gemini-1.5-flash')
                prompt = f"أنشئ {doc_type} لمادة {subject} للصف {target_class} يحتوي على {num_questions} أسئلة اختيار من متعدد متوافقة مع معايير نافس الوطنية السعودية."
                response = model.generate_content(prompt)
                
                st.success("تم إنشاء المحتوى بنجاح!")
                st.text_area("معاينة الاختبار:", response.text, height=300)
                
                # خدمات التحميل
                pdf_data = create_pdf(response.text, school_name, teacher_name, subject)
                st.download_button(
                    label="📥 حفظ كـ PDF جاهز للطباعة",
                    data=pdf_data,
                    file_name=f"misbar_{subject}.pdf",
                    mime="application/pdf"
                )
            except Exception as e:
                st.error(f"حدث خطأ: {e}")
 
