import type { ReactNode } from 'react';
import { AppStep } from '../../types';
import { useLocale } from '../../LocaleProvider';

interface Props {
  activeStep: AppStep;
  onSetStep: (step: AppStep) => void;
  children?: ReactNode;
}

export default function AdminShell({ activeStep, onSetStep, children }: Props) {
  const { t } = useLocale();
  const steps: { key: AppStep; label: string }[] = [
    { key: 'hypothesis', label: t('step1') },
    { key: 'form', label: t('step2') },
    { key: 'dashboard', label: t('step3') },
    { key: 'report', label: t('step4') },
  ];

  return (
    <div className="min-h-[calc(100vh-60px)]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:grid-cols-5">
        <aside className="col-span-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm h-fit">
          <div className="mb-6 text-sm font-semibold text-slate-700">{t('adminConsole')}</div>
          <nav className="space-y-2">
            {steps.map((s) => (
              <button
                key={s.key}
                onClick={() => onSetStep(s.key)}
                className={`block w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  activeStep === s.key
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="col-span-1 lg:col-span-4">{children}</main>
      </div>
    </div>
  );
}
