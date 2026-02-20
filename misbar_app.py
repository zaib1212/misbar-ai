import streamlit as st
import google.generativeai as genai

# إعداد واجهة الموقع
st.set_page_config(page_title="مساعدي الذكي", page_icon="🤖")

# ربط الذكاء الاصطناعي بمفتاحك
genai.configure(api_key="AIzaSyAZP-2WeCKUiPHzCwOh0gljE7J49rAF9RA")

st.title("🤖 تطبيق مسبار للذكاء الاصطناعي")
st.write("أهلاً بك! أنا أبحث عن أفضل محرك ذكاء اصطناعي متاح لك الآن...")

# العثور على الموديل المتاح تلقائياً
@st.cache_resource
def get_available_model():
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            return m.name
    return None

available_model_name = get_available_model()

if available_model_name:
    st.info(f"تم تفعيل المحرك: {available_model_name}")
    user_input = st.text_input("بماذا يمكنني مساعدتك اليوم؟")
    
    if st.button("إرسال"):
        if user_input:
            with st.spinner('جاري التفكير...'):
                try:
                    model = genai.GenerativeModel(available_model_name)
                    response = model.generate_content(user_input)
                    st.success(response.text)
                except Exception as e:
                    st.error(f"حدث خطأ أثناء الرد: {e}")
        else:
            st.warning("الرجاء كتابة سؤال أولاً.")
else:
    st.error("لم يتم العثور على موديلات متاحة. تأكد من صلاحية مفتاح الـ API.")