import { useApp } from '../context/AppContext';
import { formatArabicDate } from '../utils/scheduler';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import Toast from '../components/Toast';
import SectionPicker from '../components/SectionPicker';
import { HeroSection, FeaturesSection, StepsSection } from '../components/HomeSections';
import { useState } from 'react';
import { ArrowLeft, CalendarDays, Flame, Trash2, TrendingUp, PlayCircle, FileText } from 'lucide-react';
import { getStreakTier } from '../utils/streak';

export default function Home() {
  const { setPage, selectedSources, schedule, scheduleConfirmed, clearSchedule, streak, progress, completedDays, showDeleteWarning, setShowDeleteWarning } = useApp();
  const [showBlockToast, setShowBlockToast] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const blockMessage = 'لديك جدول حالي — لا يمكن إنشاء جدول جديد. احذف الجدول الحالي أولاً من زر الحذف في بطاقة جدولك.';

  const handleStart = () => {
    if (scheduleConfirmed) { setShowBlockToast(true); return; }
    setShowPicker(true);
  };

  const handlePick = (section: 'qiyas' | 'tahsili') => {
    setShowPicker(false);
    setPage(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in">
      <HeroSection onStart={handleStart} />

      {schedule && scheduleConfirmed && (
        <section className="px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="card relative overflow-hidden p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-0 -z-10"><div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-gold-500/10 blur-3xl" /></div>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2"><CalendarDays className="h-6 w-6 text-gold-300" /><h2 className="font-display text-xl font-bold text-white">جدولك الحالي</h2></div>
                <div className="flex items-center gap-2">
                  {streak > 0 && (() => { const t = getStreakTier(streak); return (<div title={`${t.label} — ${streak} أيام`} className={`flex items-center gap-1.5 rounded-full border ${t.border} ${t.bg} ${t.glow} px-3 py-1.5 text-xs font-bold ${t.text}`}><Flame className="h-4 w-4 animate-flame-flicker" />{streak} أيام — {t.label}</div>); })()}
                  <button onClick={() => setShowDeleteWarning(true)} className="grid h-9 w-9 place-items-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 transition-all hover:bg-red-500/20" title="حذف الجدول"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="mb-4 text-sm text-ink-300">من {formatArabicDate(schedule.startDate)} إلى {formatArabicDate(schedule.endDate)}</p>
              <div className="mb-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-ink-700 bg-ink-800/40 p-3 text-center"><PlayCircle className="mx-auto mb-1 h-5 w-5 text-sky-400" /><div className="font-display text-lg font-bold text-white">{schedule.totalVideos}</div><div className="text-[10px] text-ink-300">فيديوهات</div></div>
                <div className="rounded-xl border border-ink-700 bg-ink-800/40 p-3 text-center"><FileText className="mx-auto mb-1 h-5 w-5 text-gold-300" /><div className="font-display text-lg font-bold text-white">{schedule.totalTests}</div><div className="text-[10px] text-ink-300">اختبارات</div></div>
                <div className="rounded-xl border border-ink-700 bg-ink-800/40 p-3 text-center"><CalendarDays className="mx-auto mb-1 h-5 w-5 text-sky-400" /><div className="font-display text-lg font-bold text-white">{schedule.days.length}</div><div className="text-[10px] text-ink-300">أيام دراسة</div></div>
              </div>
              <div className="mb-2 flex items-center justify-between text-xs"><span className="font-bold text-ink-200">نسبة الإنجاز</span><span className="font-bold text-gold-300">{completedDays} / {schedule.days.length} يوم</span></div>
              <div className="h-3 overflow-hidden rounded-full bg-ink-800"><div className="h-full rounded-full bg-gradient-to-l from-gold-300 to-gold-500 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
              <div className="mt-5 text-center"><button onClick={() => setPage('schedule')} className="btn-gold"><TrendingUp className="h-5 w-5" />متابعة الجدول</button></div>
            </div>
          </div>
        </section>
      )}

      {selectedSources.length > 0 && !scheduleConfirmed && (
        <div className="px-4 pb-4 text-center sm:px-6"><button onClick={() => setPage('schedule')} className="btn-ghost"><CalendarDays className="h-4 w-4 text-gold-300" />لديك {selectedSources.length} مصادر محددة — أكمل الإعداد<ArrowLeft className="h-4 w-4" /></button></div>
      )}

      <FeaturesSection />
      <StepsSection />

      <Toast open={showBlockToast} onClose={() => setShowBlockToast(false)} message={blockMessage} />
      <SectionPicker open={showPicker} onClose={() => setShowPicker(false)} onPick={handlePick} />

      <DeleteConfirmDialog
        open={showDeleteWarning}
        onClose={() => setShowDeleteWarning(false)}
        onConfirm={() => { clearSchedule(); setShowDeleteWarning(false); setPage('home'); }}
        title="حذف الجدول"
        message="هل أنت متأكد من حذف الجدول؟ سيتم حذف جميع المهام والتقدم والشعلة. لا يمكن التراجع عن هذا الإجراء."
      />
    </div>
  );
}
