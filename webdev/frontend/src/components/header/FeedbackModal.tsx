'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { PersonaType } from '@/lib/persona';
import {
  MessageSquare, Star, Send, CheckCircle2, Bug, Lightbulb, FileText
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePersona?: PersonaType;
}

type FeedbackCategory = 'bug' | 'feature' | 'data' | 'general';

const FEEDBACK_CATEGORIES: { value: FeedbackCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'bug',     label: 'Laporan Bug',  icon: <Bug className="w-3.5 h-3.5" /> },
  { value: 'feature', label: 'Saran Fitur',  icon: <Lightbulb className="w-3.5 h-3.5" /> },
  { value: 'data',    label: 'Koreksi Data', icon: <FileText className="w-3.5 h-3.5" /> },
  { value: 'general', label: 'Masukan Umum', icon: <Star className="w-3.5 h-3.5" /> },
];

const PERSONA_LABEL: Record<PersonaType, string> = {
  government: 'Government',
  business:   'Business',
  commuter:   'Commuter',
};

export function FeedbackModal({ isOpen, onClose, activePersona = 'government' }: FeedbackModalProps) {
  const [feedbackCategory, setFeedbackCategory] = useState<FeedbackCategory>('general');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackText('');
      setFeedbackEmail('');
      setRating(0);
      setFeedbackCategory('general');
      onClose();
    }, 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kirim Umpan Balik & Masukan"
      maxWidth="md"
      subtitle={`Bantu kami meningkatkan kualitas platform TransitERA untuk kebutuhan ${PERSONA_LABEL[activePersona]}`}
      icon={<MessageSquare className="w-4 h-4 text-brand-lime" />}
    >
      <div className="px-5 py-4">
        {submitted ? (
          <div className="py-12 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-sm font-bold text-slate-100">Terima Kasih!</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Masukan Anda dari sudut pandang {PERSONA_LABEL[activePersona]} telah tercatat dan sangat berarti untuk pengembangan TransitERA selanjutnya.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Category Selection */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                Kategori Masukan
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {FEEDBACK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setFeedbackCategory(cat.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                      feedbackCategory === cat.value
                        ? 'bg-brand-lime/15 border-brand-lime/40 text-brand-lime shadow-sm'
                        : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <span className={feedbackCategory === cat.value ? 'text-brand-lime' : 'text-slate-500'}>
                      {cat.icon}
                    </span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                Rating Kepuasan Pengalaman
              </label>
              <div className="flex items-center gap-1.5 p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-1 transition-transform hover:scale-115 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700 hover:text-slate-500'
                    }`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
                <span className="text-xs font-medium text-slate-400 ml-2">
                  {rating === 0 ? 'Pilih bintang 1 - 5' : ['', 'Sangat Kurang', 'Kurang', 'Cukup Baik', 'Bagus', 'Sangat Memuaskan'][rating]}
                </span>
              </div>
            </div>

            {/* Feedback Textarea */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                Uraian Masukan / Temuan *
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={`Tuliskan masukan, saran fitur, atau kendala yang Anda alami dalam mode ${PERSONA_LABEL[activePersona]}...`}
                rows={4}
                className="w-full bg-slate-800/50 border border-slate-700 text-xs text-slate-200 placeholder-slate-600 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-brand-lime/50 focus:ring-1 focus:ring-brand-lime/20 transition-all"
              />
            </div>

            {/* Email Contact (Optional) */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                Email Anda (Opsional untuk Tindak Lanjut)
              </label>
              <input
                type="email"
                value={feedbackEmail}
                onChange={(e) => setFeedbackEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-slate-800/50 border border-slate-700 text-xs text-slate-200 placeholder-slate-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-lime/50 focus:ring-1 focus:ring-brand-lime/20 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitFeedback}
              disabled={!feedbackText.trim()}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                feedbackText.trim()
                  ? 'bg-brand-lime hover:bg-[#8CE0C4] text-white shadow-lg shadow-brand-lime/20 cursor-pointer'
                  : 'bg-slate-800/80 text-slate-600 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              Kirim Masukan sebagai {PERSONA_LABEL[activePersona]}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
