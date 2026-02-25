import { useState, useEffect, useCallback } from 'react';
import {
  allSubjects, nafsSubjects, nafsGrades, stages, allGrades,
  getContent, getNafsStandards,
} from './data/curriculum';
import type { Unit, Chapter, Lesson } from './data/curriculum';
import './App.css';

// ─── Types ───────────────────────────────────────────────────────────────────
type AppPage = 'splash' | 'welcome' | 'routeSelect' | 'general' | 'nafs';
type Theme = 'light' | 'dark';

interface ExamConfig {
  schoolName: string;
  teacherName: string;
  educationAdmin: string;
  subject: string;
  semester: string;
  grade: string;
  stage: string;
  selectedUnits: string[];
  selectedChapters: string[];
  selectedLessons: string[];
  assessmentType: string;
  totalGrade: number;
  questionType: string;
  questionCount: number;
}

interface NafsConfig {
  educationAdmin: string;
  schoolName: string;
  teacherName: string;
  targetGrade: string;
  subject: string;
  semester: string;
  week: string;
  selectedStandards: string[];
  questionCount: number;
  totalGrade: number;
}

// ─── App Component ───────────────────────────────────────────────────────────
function App() {
  const [page, setPage] = useState<AppPage>('splash');
  const [theme, setTheme] = useState<Theme>('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  // General exam config
  const [examConfig, setExamConfig] = useState<ExamConfig>({
    schoolName: '',
    teacherName: '',
    educationAdmin: '',
    subject: '',
    semester: 'الأول',
    grade: '',
    stage: '',
    selectedUnits: [],
    selectedChapters: [],
    selectedLessons: [],
    assessmentType: 'ورق عمل',
    totalGrade: 20,
    questionType: 'آلي',
    questionCount: 10,
  });

  // NAFS config
  const [nafsConfig, setNafsConfig] = useState<NafsConfig>({
    educationAdmin: '',
    schoolName: '',
    teacherName: '',
    targetGrade: '',
    subject: '',
    semester: 'الأول',
    week: '',
    selectedStandards: [],
    questionCount: 10,
    totalGrade: 20,
  });

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Get dynamic content based on selections
  const getAvailableUnits = useCallback((): Unit[] => {
    if (!examConfig.grade || !examConfig.subject) return [];
    return getContent(examConfig.grade, examConfig.subject, examConfig.semester);
  }, [examConfig.grade, examConfig.subject, examConfig.semester]);

  const getAvailableChapters = useCallback((): Chapter[] => {
    const units = getAvailableUnits();
    if (examConfig.selectedUnits.length === 0) return units.flatMap(u => u.chapters);
    return units
      .filter(u => examConfig.selectedUnits.includes(u.id))
      .flatMap(u => u.chapters);
  }, [getAvailableUnits, examConfig.selectedUnits]);

  const getAvailableLessons = useCallback((): Lesson[] => {
    const chapters = getAvailableChapters();
    if (examConfig.selectedChapters.length === 0) return chapters.flatMap(c => c.lessons);
    return chapters
      .filter(c => examConfig.selectedChapters.includes(c.id))
      .flatMap(c => c.lessons);
  }, [getAvailableChapters, examConfig.selectedChapters]);

  // Get NAFS standards based on selections
  const getAvailableStandards = useCallback((): string[] => {
    if (!nafsConfig.targetGrade || !nafsConfig.subject || !nafsConfig.week) return [];
    return getNafsStandards(nafsConfig.targetGrade, nafsConfig.subject, nafsConfig.week);
  }, [nafsConfig.targetGrade, nafsConfig.subject, nafsConfig.week]);

  // Toggle array selection helper
  const toggleArrayItem = (arr: string[], item: string): string[] => {
    return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
  };

  // Handle login
  const handleLogin = (provider: string) => {
    // Simulated login
    console.log(`Login with ${provider}`);
    setIsLoggedIn(true);
    setSidebarOpen(false);
    setPage('routeSelect');
  };

  // Handle generate content
  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedContent('');
    // Simulate AI generation
    setTimeout(() => {
      const content = `بسم الله الرحمن الرحيم
المدرسة: ${examConfig.schoolName}
المعلم/ة: ${examConfig.teacherName}
المادة: ${examConfig.subject}
الصف: ${examConfig.grade}
نوع التقويم: ${examConfig.assessmentType}

━━━━━━━━━━━━━━━━━━━━━━━━━

السؤال الأول: اختر الإجابة الصحيحة:
${Array.from({ length: Math.min(examConfig.questionCount, 5) }, (_, i) =>
  `${i + 1}. سؤال تجريبي رقم ${i + 1} في ${examConfig.subject}
   أ) الخيار الأول    ب) الخيار الثاني
   ج) الخيار الثالث   د) الخيار الرابع`
).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━

السؤال الثاني: أكمل الفراغات التالية:
${Array.from({ length: Math.min(examConfig.questionCount - 5, 3) }, (_, i) =>
  `${i + 1}. __________ هو/هي __________`
).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━
الدرجة الكلية: ${examConfig.totalGrade}
عدد الأسئلة: ${examConfig.questionCount}

تم التوليد بواسطة منصة مِسبار الذكية`;
      setGeneratedContent(content);
      setIsGenerating(false);
    }, 2500);
  };

  // Handle NAFS generate
  const handleNafsGenerate = () => {
    setIsGenerating(true);
    setGeneratedContent('');
    setTimeout(() => {
      const content = `بسم الله الرحمن الرحيم
البرنامج الوطني للتقويم المدرسي (نافس)
━━━━━━━━━━━━━━━━━━━━━━━━━
إدارة التعليم: ${nafsConfig.educationAdmin}
المدرسة: ${nafsConfig.schoolName}
المعلم/ة: ${nafsConfig.teacherName}
المادة: ${nafsConfig.subject}
الصف المستهدف: ${nafsConfig.targetGrade}
الفصل الدراسي: ${nafsConfig.semester}
الأسبوع: ${nafsConfig.week}

━━━━━━━━━━━━━━━━━━━━━━━━━
المعايير المستهدفة:
${nafsConfig.selectedStandards.map((s, i) => `${i + 1}. ${s}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━
الأسئلة:
${Array.from({ length: Math.min(nafsConfig.questionCount, 8) }, (_, i) =>
  `${i + 1}. سؤال نافس تجريبي رقم ${i + 1}
   أ) الخيار الأول    ب) الخيار الثاني
   ج) الخيار الثالث   د) الخيار الرابع`
).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━
الدرجة الكلية: ${nafsConfig.totalGrade}
عدد الأسئلة: ${nafsConfig.questionCount}

تم التوليد بواسطة منصة مِسبار الذكية - نموذج نافس`;
      setGeneratedContent(content);
      setIsGenerating(false);
    }, 2500);
  };

  // Navigate safely (never go to splash after login)
  const navigateTo = (target: AppPage) => {
    if (target === 'splash' && isLoggedIn) {
      setPage('routeSelect');
      return;
    }
    setPage(target);
    setGeneratedContent('');
  };

  // ─── Render: Splash Page ────────────────────────────────────────────────
  const renderSplash = () => (
    <div className="splash-page">
      <div className="splash-content fade-in">
        <div className="book-icon">
          <svg viewBox="0 0 200 200" width="180" height="180">
            {/* Open book SVG */}
            <defs>
              <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
              <filter id="bookShadow">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15"/>
              </filter>
            </defs>
            {/* Left page */}
            <path d="M20,40 Q100,30 100,40 L100,160 Q100,150 20,160 Z"
              fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" filter="url(#bookShadow)"/>
            {/* Right page */}
            <path d="M180,40 Q100,30 100,40 L100,160 Q100,150 180,160 Z"
              fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" filter="url(#bookShadow)"/>
            {/* Book spine */}
            <line x1="100" y1="30" x2="100" y2="165" stroke="#94a3b8" strokeWidth="2"/>
            {/* Text lines - left page */}
            <line x1="35" y1="65" x2="90" y2="65" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>
            <line x1="35" y1="80" x2="85" y2="80" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round"/>
            <line x1="35" y1="95" x2="88" y2="95" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>
            <line x1="35" y1="110" x2="80" y2="110" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round"/>
            <line x1="35" y1="125" x2="86" y2="125" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>
            {/* Text lines - right page */}
            <line x1="110" y1="65" x2="165" y2="65" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>
            <line x1="110" y1="80" x2="160" y2="80" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round"/>
            <line x1="110" y1="95" x2="163" y2="95" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>
            <line x1="110" y1="110" x2="155" y2="110" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round"/>
            <line x1="110" y1="125" x2="161" y2="125" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>
            {/* Decorative star */}
            <circle cx="100" cy="25" r="8" fill="url(#bookGrad)" opacity="0.8"/>
          </svg>
        </div>
        <h1 className="splash-title">مِسبار</h1>
        <p className="splash-subtitle">المنصة التعليمية الذكية</p>
        <button
          className="start-btn"
          onClick={() => navigateTo('welcome')}
        >
          <span>ابدأ رحلة الإعداد</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
      </div>
    </div>
  );

  // ─── Render: Sidebar ────────────────────────────────────────────────────
  const renderSidebar = () => (
    <>
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
      <div className={`sidebar ${sidebarOpen ? 'slide-in' : ''}`} style={{ display: sidebarOpen ? 'flex' : 'none' }}>
        <div className="sidebar-header">
          <h3>القائمة</h3>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <div className="sidebar-items">
          {/* Dark Mode Toggle */}
          <button className="sidebar-item" onClick={() => {
            setTheme(theme === 'light' ? 'dark' : 'light');
          }}>
            <span className="sidebar-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
            <span>{theme === 'light' ? 'الوضع الليلي' : 'الوضع العادي'}</span>
          </button>

          {/* User Guide */}
          <button className="sidebar-item" onClick={() => {
            setShowGuide(true);
            setSidebarOpen(false);
          }}>
            <span className="sidebar-icon">📖</span>
            <span>دليل الاستخدام</span>
          </button>

          {/* Login / Logout */}
          {!isLoggedIn ? (
            <>
              <div className="sidebar-divider" />
              <p className="sidebar-label">تسجيل الدخول</p>
              <button className="sidebar-item login-google" onClick={() => handleLogin('google')}>
                <span className="sidebar-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </span>
                <span>تسجيل بواسطة Google</span>
              </button>
              <button className="sidebar-item login-microsoft" onClick={() => handleLogin('microsoft')}>
                <span className="sidebar-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                    <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                    <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                    <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                  </svg>
                </span>
                <span>تسجيل بواسطة Microsoft</span>
              </button>
            </>
          ) : (
            <>
              <div className="sidebar-divider" />
              <button className="sidebar-item" onClick={() => {
                setIsLoggedIn(false);
                navigateTo('welcome');
                setSidebarOpen(false);
              }}>
                <span className="sidebar-icon">🚪</span>
                <span>تسجيل الخروج</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );

  // ─── Render: User Guide Modal ───────────────────────────────────────────
  const renderGuideModal = () => {
    if (!showGuide) return null;
    return (
      <>
        <div className="overlay" onClick={() => setShowGuide(false)} />
        <div className="guide-modal fade-in">
          <div className="guide-header">
            <h2>📖 دليل استخدام مِسبار</h2>
            <button onClick={() => setShowGuide(false)} className="guide-close">✕</button>
          </div>
          <div className="guide-content">
            <div className="guide-section">
              <h3>1. البدء</h3>
              <p>قم بتسجيل الدخول عبر حساب Google أو Microsoft للوصول إلى جميع الميزات.</p>
            </div>
            <div className="guide-section">
              <h3>2. اختيار المسار</h3>
              <p>اختر بين مسار "بنك المواد المنهجية" لإعداد أوراق العمل والاختبارات، أو مسار "تدريب نافس" لإعداد نماذج اختبارات نافس الوطنية.</p>
            </div>
            <div className="guide-section">
              <h3>3. المسار العام</h3>
              <p>أدخل البيانات المدرسية، اختر المادة والصف والفصل الدراسي، ثم حدد تصنيف المحتوى (الوحدة والفصل والدرس). اختر نوع التقويم وعدد الأسئلة والدرجات، ثم اضغط "توليد المحتوى الذكي".</p>
            </div>
            <div className="guide-section">
              <h3>4. مسار نافس</h3>
              <p>أدخل بيانات المدرسة، اختر الصف المستهدف والمادة والأسبوع الدراسي. سيتم عرض المعايير المطلوبة تلقائيا. حدد المعايير وعدد الأسئلة ثم اضغط "توليد نموذج نافس".</p>
            </div>
            <div className="guide-section">
              <h3>5. التصدير</h3>
              <p>يمكنك تصدير المحتوى المولد بصيغة Word أو PDF، كما يمكن تصدير نموذج تضليل ورقة الإجابة.</p>
            </div>
          </div>
        </div>
      </>
    );
  };

  // ─── Render: Welcome Page ───────────────────────────────────────────────
  const renderWelcome = () => (
    <div className="welcome-page">
      <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      {renderSidebar()}
      {renderGuideModal()}
      <div className="welcome-content fade-in">
        <div className="welcome-logo">
          <div className="logo-circle">
            <svg viewBox="0 0 100 100" width="80" height="80">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb"/>
                  <stop offset="50%" stopColor="#7c3aed"/>
                  <stop offset="100%" stopColor="#f97316"/>
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#logoGrad)" opacity="0.1"/>
              <text x="50" y="58" textAnchor="middle" fontSize="28" fontWeight="bold" fill="url(#logoGrad)" fontFamily="Tajawal">م</text>
            </svg>
          </div>
        </div>
        <h1 className="welcome-title">مرحبا بك في مِسبار</h1>
        <p className="welcome-subtitle">المنصة التعليمية الذكية لإعداد الاختبارات وأوراق العمل</p>
        {!isLoggedIn ? (
          <div className="welcome-login-section">
            <p className="welcome-login-hint">سجل دخولك للبدء</p>
            <div className="welcome-login-buttons">
              <button className="btn login-btn-google" onClick={() => handleLogin('google')}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                تسجيل بواسطة Google
              </button>
              <button className="btn login-btn-ms" onClick={() => handleLogin('microsoft')}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                  <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                  <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                  <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                </svg>
                تسجيل بواسطة Microsoft
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => navigateTo('routeSelect')}>
            الدخول إلى المنصة
          </button>
        )}
      </div>
    </div>
  );

  // ─── Render: Route Selection Page ───────────────────────────────────────
  const renderRouteSelect = () => (
    <div className="route-page">
      <div className="route-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <h2 className="route-page-title">مِسبار</h2>
      </div>
      {renderSidebar()}
      {renderGuideModal()}
      <div className="route-content fade-in">
        <h1 className="route-title">اختر المسار</h1>
        <p className="route-subtitle">حدد نوع المحتوى الذي ترغب في إعداده</p>
        <div className="route-cards">
          {/* NAFS Card */}
          <div
            className="route-card nafs-card"
            onClick={() => navigateTo('nafs')}
          >
            <div className="route-card-icon nafs-icon">
              <svg viewBox="0 0 80 80" width="64" height="64">
                <defs>
                  <linearGradient id="nafsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb"/>
                    <stop offset="100%" stopColor="#f97316"/>
                  </linearGradient>
                </defs>
                <circle cx="40" cy="40" r="36" fill="none" stroke="url(#nafsGrad)" strokeWidth="3"/>
                <text x="40" y="35" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2563eb" fontFamily="Tajawal">NAFS</text>
                <text x="40" y="52" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f97316" fontFamily="Tajawal">نافس</text>
              </svg>
            </div>
            <h3 className="route-card-title">البرنامج الوطني للتقويم المدرسي (نافس)</h3>
            <p className="route-card-desc">بناء اختبارات تحاكي الاختبارات الوطنية وفق المعايير المعتمدة</p>
            <div className="route-card-badge nafs-badge">تدريب نافس</div>
          </div>

          {/* General Card */}
          <div
            className="route-card general-card"
            onClick={() => navigateTo('general')}
          >
            <div className="route-card-icon general-icon">
              <svg viewBox="0 0 80 80" width="64" height="64">
                <defs>
                  <linearGradient id="genGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#16a34a"/>
                    <stop offset="100%" stopColor="#22c55e"/>
                  </linearGradient>
                </defs>
                <rect x="15" y="10" width="50" height="60" rx="4" fill="none" stroke="url(#genGrad)" strokeWidth="3"/>
                <rect x="20" y="18" width="24" height="3" rx="1.5" fill="#22c55e"/>
                <rect x="20" y="26" width="35" height="2" rx="1" fill="#86efac"/>
                <rect x="20" y="32" width="30" height="2" rx="1" fill="#86efac"/>
                <rect x="20" y="38" width="33" height="2" rx="1" fill="#86efac"/>
                <rect x="20" y="46" width="24" height="3" rx="1.5" fill="#22c55e"/>
                <rect x="20" y="54" width="35" height="2" rx="1" fill="#86efac"/>
                <rect x="20" y="60" width="28" height="2" rx="1" fill="#86efac"/>
              </svg>
            </div>
            <h3 className="route-card-title">بنك المواد المنهجية</h3>
            <p className="route-card-desc">إعداد أوراق العمل والاختبارات الدورية لجميع المراحل الدراسية</p>
            <div className="route-card-badge general-badge">عام</div>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Render: Loading Screen ─────────────────────────────────────────────
  const renderLoading = () => {
    if (!isGenerating) return null;
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p className="loading-text">جاري التوليد بذكاء مِسبار...</p>
        <p className="loading-subtext">يرجى الانتظار</p>
      </div>
    );
  };

  // ─── Render: Generated Content ──────────────────────────────────────────
  const renderGeneratedContent = () => {
    if (!generatedContent) return null;
    return (
      <div className="generated-section card fade-in">
        <h3 className="section-title">المحتوى المُولَّد</h3>
        <pre className="generated-text">{generatedContent}</pre>
        <div className="export-buttons">
          <button className="btn btn-primary" onClick={() => {
            const blob = new Blob([generatedContent], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'misbar-content.doc';
            a.click();
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            تصدير Word
          </button>
          <button className="btn btn-orange" onClick={() => {
            const blob = new Blob([generatedContent], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'misbar-content.pdf';
            a.click();
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            تصدير PDF
          </button>
        </div>
      </div>
    );
  };

  // ─── Render: General Path ───────────────────────────────────────────────
  const renderGeneral = () => {
    const units = getAvailableUnits();
    const chapters = getAvailableChapters();
    const lessons = getAvailableLessons();

    return (
      <div className="path-page">
        {renderLoading()}
        <div className="path-header">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <h2 className="path-title">بنك المواد المنهجية</h2>
          <button className="btn btn-secondary route-change-btn" onClick={() => navigateTo('routeSelect')}>
            تغيير المسار
          </button>
        </div>
        {renderSidebar()}
        {renderGuideModal()}

        <div className="path-content">
          {/* School Data */}
          <div className="card fade-in">
            <h3 className="section-title">البيانات المدرسية</h3>
            <div className="grid-2">
              <div className="form-group">
                <label>اسم المدرسة</label>
                <input
                  type="text"
                  placeholder="أدخل اسم المدرسة"
                  value={examConfig.schoolName}
                  onChange={e => setExamConfig({ ...examConfig, schoolName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>اسم المعلم/ة</label>
                <input
                  type="text"
                  placeholder="أدخل اسم المعلم/ة"
                  value={examConfig.teacherName}
                  onChange={e => setExamConfig({ ...examConfig, teacherName: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Subject & Exam Details */}
          <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="section-title">تفاصيل المادة والاختبار</h3>

            {/* Subject Selection */}
            <div className="form-group">
              <label>المادة الدراسية</label>
              <div className="chip-group">
                {allSubjects.map(s => (
                  <button
                    key={s}
                    className={`chip ${examConfig.subject === s ? 'active' : ''}`}
                    onClick={() => setExamConfig({
                      ...examConfig,
                      subject: s,
                      selectedUnits: [],
                      selectedChapters: [],
                      selectedLessons: [],
                    })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Semester Toggle */}
            <div className="form-group">
              <label>الفصل الدراسي</label>
              <div className="toggle-container">
                <button
                  className={`toggle-btn ${examConfig.semester === 'الأول' ? 'active' : ''}`}
                  onClick={() => setExamConfig({
                    ...examConfig,
                    semester: 'الأول',
                    selectedUnits: [],
                    selectedChapters: [],
                    selectedLessons: [],
                  })}
                >
                  الفصل الأول
                </button>
                <button
                  className={`toggle-btn ${examConfig.semester === 'الثاني' ? 'active' : ''}`}
                  onClick={() => setExamConfig({
                    ...examConfig,
                    semester: 'الثاني',
                    selectedUnits: [],
                    selectedChapters: [],
                    selectedLessons: [],
                  })}
                >
                  الفصل الثاني
                </button>
              </div>
            </div>

            {/* Grade & Stage */}
            <div className="grid-2">
              <div className="form-group">
                <label>المرحلة</label>
                <select
                  value={examConfig.stage}
                  onChange={e => setExamConfig({
                    ...examConfig,
                    stage: e.target.value,
                    grade: '',
                    selectedUnits: [],
                    selectedChapters: [],
                    selectedLessons: [],
                  })}
                >
                  <option value="">اختر المرحلة</option>
                  {Object.keys(stages).map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>الصف</label>
                <select
                  value={examConfig.grade}
                  onChange={e => setExamConfig({
                    ...examConfig,
                    grade: e.target.value,
                    selectedUnits: [],
                    selectedChapters: [],
                    selectedLessons: [],
                  })}
                >
                  <option value="">اختر الصف</option>
                  {(examConfig.stage ? stages[examConfig.stage] : allGrades).map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Content Classification */}
          <div className="card fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="section-title">تصنيف المحتوى</h3>
            {units.length > 0 ? (
              <>
                <div className="form-group">
                  <label>الوحدة (يمكن اختيار أكثر من واحدة)</label>
                  <div className="chip-group">
                    {units.map(u => (
                      <button
                        key={u.id}
                        className={`chip ${examConfig.selectedUnits.includes(u.id) ? 'active' : ''}`}
                        onClick={() => setExamConfig({
                          ...examConfig,
                          selectedUnits: toggleArrayItem(examConfig.selectedUnits, u.id),
                          selectedChapters: [],
                          selectedLessons: [],
                        })}
                      >
                        {u.name}
                      </button>
                    ))}
                  </div>
                </div>

                {chapters.length > 0 && (
                  <div className="form-group">
                    <label>الفصل (يمكن اختيار أكثر من واحد)</label>
                    <div className="chip-group">
                      {chapters.map(c => (
                        <button
                          key={c.id}
                          className={`chip ${examConfig.selectedChapters.includes(c.id) ? 'active' : ''}`}
                          onClick={() => setExamConfig({
                            ...examConfig,
                            selectedChapters: toggleArrayItem(examConfig.selectedChapters, c.id),
                            selectedLessons: [],
                          })}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {lessons.length > 0 && (
                  <div className="form-group">
                    <label>الدرس (يمكن اختيار أكثر من واحد)</label>
                    <div className="chip-group">
                      {lessons.map(l => (
                        <button
                          key={l.id}
                          className={`chip ${examConfig.selectedLessons.includes(l.id) ? 'active' : ''}`}
                          onClick={() => setExamConfig({
                            ...examConfig,
                            selectedLessons: toggleArrayItem(examConfig.selectedLessons, l.id),
                          })}
                        >
                          {l.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="empty-hint">اختر المادة والصف والفصل الدراسي لعرض المحتوى المتاح</p>
            )}
          </div>

          {/* Assessment Type */}
          <div className="card fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="section-title">التقويم</h3>
            <div className="chip-group">
              {['ورق عمل', 'اختبار فترة', 'اختبار نهائي', 'مهام أدائية', 'خطط علاجية', 'نشاط'].map(t => (
                <button
                  key={t}
                  className={`chip ${examConfig.assessmentType === t ? 'active' : ''}`}
                  onClick={() => setExamConfig({ ...examConfig, assessmentType: t })}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Grades & Questions */}
          <div className="card fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="section-title">الدرجات وتوزيع الأسئلة</h3>
            <div className="grid-3">
              <div className="form-group">
                <label>الدرجة الكلية</label>
                <select
                  value={examConfig.totalGrade}
                  onChange={e => setExamConfig({ ...examConfig, totalGrade: Number(e.target.value) })}
                >
                  {Array.from({ length: 100 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>نوع الأسئلة</label>
                <div className="toggle-container">
                  <button
                    className={`toggle-btn ${examConfig.questionType === 'آلي' ? 'active' : ''}`}
                    onClick={() => setExamConfig({ ...examConfig, questionType: 'آلي' })}
                  >
                    آلي
                  </button>
                  <button
                    className={`toggle-btn ${examConfig.questionType === 'مخصص' ? 'active' : ''}`}
                    onClick={() => setExamConfig({ ...examConfig, questionType: 'مخصص' })}
                  >
                    مخصص
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>عدد الأسئلة</label>
                <select
                  value={examConfig.questionCount}
                  onChange={e => setExamConfig({ ...examConfig, questionCount: Number(e.target.value) })}
                >
                  {Array.from({ length: 100 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="card fade-in action-card" style={{ animationDelay: '0.5s' }}>
            <div className="action-buttons">
              <button className="btn btn-success action-btn" onClick={handleGenerate}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                توليد المحتوى الذكي
              </button>
              <button className="btn btn-primary action-btn" onClick={() => alert('سيتم فتح الكاميرا للتصحيح')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                تصحيح بالكاميرا
              </button>
              <button className="btn btn-secondary action-btn" onClick={() => alert('سيتم الإنشاء حسب جدول المواصفات')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                إنشاء حسب جدول المواصفات
              </button>
            </div>
          </div>

          {/* Generated Content */}
          {renderGeneratedContent()}

          {/* Back Button */}
          <div className="back-section">
            <button className="btn btn-secondary" onClick={() => navigateTo('routeSelect')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              عودة
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Render: NAFS Path ──────────────────────────────────────────────────
  const renderNafs = () => {
    const standards = getAvailableStandards();

    return (
      <div className="path-page nafs-theme">
        {renderLoading()}
        <div className="path-header nafs-header">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <h2 className="path-title">إعداد اختبار نافس</h2>
          <button className="btn btn-secondary route-change-btn" onClick={() => navigateTo('routeSelect')}>
            تغيير المسار
          </button>
        </div>
        {renderSidebar()}
        {renderGuideModal()}

        <div className="path-content">
          {/* School Data */}
          <div className="card fade-in">
            <h3 className="section-title nafs-title">البيانات المدرسية</h3>
            <div className="grid-3">
              <div className="form-group">
                <label>إدارة التعليم</label>
                <input
                  type="text"
                  placeholder="أدخل إدارة التعليم"
                  value={nafsConfig.educationAdmin}
                  onChange={e => setNafsConfig({ ...nafsConfig, educationAdmin: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>اسم المدرسة</label>
                <input
                  type="text"
                  placeholder="أدخل اسم المدرسة"
                  value={nafsConfig.schoolName}
                  onChange={e => setNafsConfig({ ...nafsConfig, schoolName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>اسم المعلم/ة</label>
                <input
                  type="text"
                  placeholder="أدخل اسم المعلم/ة"
                  value={nafsConfig.teacherName}
                  onChange={e => setNafsConfig({ ...nafsConfig, teacherName: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Test Details */}
          <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="section-title nafs-title">تفاصيل الاختبار</h3>

            {/* Target Grade */}
            <div className="form-group">
              <label>الصف المستهدف</label>
              <div className="chip-group">
                {nafsGrades.map(g => (
                  <button
                    key={g}
                    className={`chip nafs-chip ${nafsConfig.targetGrade === g ? 'active' : ''}`}
                    onClick={() => setNafsConfig({
                      ...nafsConfig,
                      targetGrade: g,
                      selectedStandards: [],
                    })}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div className="form-group">
              <label>المادة</label>
              <div className="chip-group">
                {nafsSubjects.map(s => (
                  <button
                    key={s}
                    className={`chip nafs-chip ${nafsConfig.subject === s ? 'active' : ''}`}
                    onClick={() => setNafsConfig({
                      ...nafsConfig,
                      subject: s,
                      selectedStandards: [],
                    })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Semester */}
            <div className="form-group">
              <label>الفصل الدراسي</label>
              <div className="toggle-container">
                <button
                  className={`toggle-btn ${nafsConfig.semester === 'الأول' ? 'active nafs-toggle' : ''}`}
                  onClick={() => setNafsConfig({ ...nafsConfig, semester: 'الأول' })}
                >
                  الفصل الأول
                </button>
                <button
                  className={`toggle-btn ${nafsConfig.semester === 'الثاني' ? 'active nafs-toggle' : ''}`}
                  onClick={() => setNafsConfig({ ...nafsConfig, semester: 'الثاني' })}
                >
                  الفصل الثاني
                </button>
              </div>
            </div>

            {/* Week */}
            <div className="form-group">
              <label>الأسبوع الدراسي</label>
              <div className="chip-group">
                {Array.from({ length: 9 }, (_, i) => String(i + 1)).map(w => (
                  <button
                    key={w}
                    className={`chip nafs-chip ${nafsConfig.week === w ? 'active' : ''}`}
                    onClick={() => setNafsConfig({
                      ...nafsConfig,
                      week: w,
                      selectedStandards: [],
                    })}
                  >
                    الأسبوع {w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Standards */}
          <div className="card fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="section-title nafs-title">المعايير المطلوبة</h3>
            {standards.length > 0 ? (
              <div className="standards-list">
                {standards.map((std, i) => (
                  <label key={i} className="standard-item">
                    <input
                      type="checkbox"
                      checked={nafsConfig.selectedStandards.includes(std)}
                      onChange={() => setNafsConfig({
                        ...nafsConfig,
                        selectedStandards: toggleArrayItem(nafsConfig.selectedStandards, std),
                      })}
                    />
                    <span className="standard-text">{std}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="empty-hint">اختر الصف المستهدف والمادة والأسبوع الدراسي لعرض المعايير</p>
            )}
          </div>

          {/* Questions & Grades */}
          <div className="card fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="section-title nafs-title">عدد الأسئلة والدرجات</h3>
            <div className="grid-2">
              <div className="form-group">
                <label>عدد الأسئلة</label>
                <select
                  value={nafsConfig.questionCount}
                  onChange={e => setNafsConfig({ ...nafsConfig, questionCount: Number(e.target.value) })}
                >
                  {Array.from({ length: 100 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>عدد الدرجات</label>
                <select
                  value={nafsConfig.totalGrade}
                  onChange={e => setNafsConfig({ ...nafsConfig, totalGrade: Number(e.target.value) })}
                >
                  {Array.from({ length: 100 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* NAFS Actions */}
          <div className="card fade-in action-card" style={{ animationDelay: '0.4s' }}>
            <div className="action-buttons">
              <button className="btn btn-nafs-primary action-btn" onClick={handleNafsGenerate}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                توليد نموذج نافس
              </button>
              <button className="btn btn-primary action-btn" onClick={() => {
                const blob = new Blob([generatedContent || 'نموذج تضليل ورقة الإجابة'], { type: 'application/msword' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'nafs-answer-sheet.doc';
                a.click();
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M3 9h6"/><path d="M3 15h6"/></svg>
                تصدير نموذج تضليل ورقة الإجابة
              </button>
              <button className="btn btn-secondary action-btn" onClick={() => alert('سيتم فتح الكاميرا لتصحيح النموذج')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                تصحيح النموذج بالكاميرا
              </button>
            </div>
          </div>

          {/* Generated Content */}
          {renderGeneratedContent()}

          {/* Back Button */}
          <div className="back-section">
            <button className="btn btn-secondary" onClick={() => navigateTo('routeSelect')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              عودة
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Main Render ────────────────────────────────────────────────────────
  return (
    <div className="app">
      {page === 'splash' && renderSplash()}
      {page === 'welcome' && renderWelcome()}
      {page === 'routeSelect' && renderRouteSelect()}
      {page === 'general' && renderGeneral()}
      {page === 'nafs' && renderNafs()}
    </div>
  );
}

export default App;
