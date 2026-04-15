'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle, AlertTriangle, RotateCcw, ChevronRight, Star } from 'lucide-react';
import { useLang } from '@/lib/i18n/lang-context';

/* ── Types ────────────────────────────────────────────────────────────────── */

type Quality = 'best' | 'good' | 'ok' | 'poor';

interface Option {
  id: string;
  text: string;
  textRu: string;
  quality: Quality;
  feedback: string;
  feedbackRu: string;
}

interface TimelineEvent {
  time: string;
  titleEn: string;
  titleRu: string;
  descEn: string;
  descRu: string;
  options: Option[];
}

/* ── Score helpers ────────────────────────────────────────────────────────── */

const SCORE_MAP: Record<Quality, number> = { best: 10, good: 7, ok: 4, poor: 0 };

const QUALITY_COLORS: Record<Quality, string> = {
  best: 'bg-emerald-500',
  good: 'bg-blue-500',
  ok:   'bg-amber-500',
  poor: 'bg-red-500',
};

const QUALITY_BG: Record<Quality, string> = {
  best: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
  good: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
  ok:   'bg-amber-500/10 border-amber-500/30 text-amber-300',
  poor: 'bg-red-500/10 border-red-500/30 text-red-300',
};

const QUALITY_LABEL: Record<Quality, { en: string; ru: string }> = {
  best: { en: 'Excellent', ru: '\u041E\u0442\u043B\u0438\u0447\u043D\u043E' },
  good: { en: 'Good', ru: '\u0425\u043E\u0440\u043E\u0448\u043E' },
  ok:   { en: 'Okay', ru: '\u041D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u043E' },
  poor: { en: 'Poor', ru: '\u041F\u043B\u043E\u0445\u043E' },
};

/* ── Timeline Data ────────────────────────────────────────────────────────── */

const EVENTS: TimelineEvent[] = [
  {
    time: '7:00 AM',
    titleEn: 'Morning Setup',
    titleRu: '\u0423\u0442\u0440\u0435\u043D\u043D\u044F\u044F \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430',
    descEn: "You just logged in. What's your first action?",
    descRu: '\u0412\u044B \u0442\u043E\u043B\u044C\u043A\u043E \u0447\u0442\u043E \u0432\u043E\u0448\u043B\u0438 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443. \u0427\u0442\u043E \u0441\u0434\u0435\u043B\u0430\u0435\u0442\u0435 \u043F\u0435\u0440\u0432\u044B\u043C?',
    options: [
      {
        id: 'a',
        text: 'Get coffee first, loads can wait',
        textRu: '\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043A\u043E\u0444\u0435, \u0433\u0440\u0443\u0437\u044B \u043F\u043E\u0434\u043E\u0436\u0434\u0443\u0442',
        quality: 'poor',
        feedback: 'Every minute counts in dispatch. Morning is when the best loads get booked. Coffee can wait!',
        feedbackRu: '\u041A\u0430\u0436\u0434\u0430\u044F \u043C\u0438\u043D\u0443\u0442\u0430 \u043D\u0430 \u0441\u0447\u0435\u0442\u0443 \u0432 \u0434\u0438\u0441\u043F\u0435\u0442\u0447\u0438\u043D\u0433\u0435. \u0423\u0442\u0440\u043E\u043C \u0431\u0440\u043E\u043D\u0438\u0440\u0443\u044E\u0442\u0441\u044F \u043B\u0443\u0447\u0448\u0438\u0435 \u0433\u0440\u0443\u0437\u044B. \u041A\u043E\u0444\u0435 \u043F\u043E\u0434\u043E\u0436\u0434\u0451\u0442!',
      },
      {
        id: 'b',
        text: 'Check all driver statuses and update AVAILABLE CITY',
        textRu: '\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u0443\u0441\u044B \u0432\u0441\u0435\u0445 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439 \u0438 \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C AVAILABLE CITY',
        quality: 'best',
        feedback: "Perfect start! Knowing your fleet status is always priority #1. You can't dispatch effectively without knowing who's available and where.",
        feedbackRu: '\u041E\u0442\u043B\u0438\u0447\u043D\u043E\u0435 \u043D\u0430\u0447\u0430\u043B\u043E! \u0417\u043D\u0430\u0442\u044C \u0441\u0442\u0430\u0442\u0443\u0441 \u0441\u0432\u043E\u0435\u0433\u043E \u043F\u0430\u0440\u043A\u0430 \u2014 \u0432\u0441\u0435\u0433\u0434\u0430 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442 \u21161. \u0412\u044B \u043D\u0435 \u0441\u043C\u043E\u0436\u0435\u0442\u0435 \u044D\u0444\u0444\u0435\u043A\u0442\u0438\u0432\u043D\u043E \u0434\u0438\u0441\u043F\u0435\u0442\u0447\u0438\u0440\u043E\u0432\u0430\u0442\u044C, \u043D\u0435 \u0437\u043D\u0430\u044F, \u043A\u0442\u043E \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0438 \u0433\u0434\u0435.',
      },
      {
        id: 'c',
        text: 'Open load board and start searching loads',
        textRu: '\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043B\u043E\u0430\u0434 \u0431\u043E\u0440\u0434 \u0438 \u043D\u0430\u0447\u0430\u0442\u044C \u0438\u0441\u043A\u0430\u0442\u044C \u0433\u0440\u0443\u0437\u044B',
        quality: 'good',
        feedback: 'Good hustle, but checking driver availability first helps you know what loads to search for.',
        feedbackRu: '\u0425\u043E\u0440\u043E\u0448\u0438\u0439 \u043D\u0430\u0441\u0442\u0440\u043E\u0439, \u043D\u043E \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u044C \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439 \u2014 \u0442\u043E\u0433\u0434\u0430 \u0432\u044B \u0431\u0443\u0434\u0435\u0442\u0435 \u0437\u043D\u0430\u0442\u044C, \u043A\u0430\u043A\u0438\u0435 \u0433\u0440\u0443\u0437\u044B \u0438\u0441\u043A\u0430\u0442\u044C.',
      },
      {
        id: 'd',
        text: 'Check emails from yesterday',
        textRu: '\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0432\u0447\u0435\u0440\u0430\u0448\u043D\u0438\u0435 \u043F\u0438\u0441\u044C\u043C\u0430',
        quality: 'ok',
        feedback: 'Emails can wait 15 minutes. Your drivers and their statuses are more time-sensitive.',
        feedbackRu: '\u041F\u0438\u0441\u044C\u043C\u0430 \u043C\u043E\u0433\u0443\u0442 \u043F\u043E\u0434\u043E\u0436\u0434\u0430\u0442\u044C 15 \u043C\u0438\u043D\u0443\u0442. \u0412\u0430\u0448\u0438 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0438 \u0438 \u0438\u0445 \u0441\u0442\u0430\u0442\u0443\u0441\u044B \u0432\u0430\u0436\u043D\u0435\u0435.',
      },
    ],
  },
  {
    time: '8:15 AM',
    titleEn: 'Hot Load Alert',
    titleRu: '\u0421\u0440\u043E\u0447\u043D\u044B\u0439 \u0433\u0440\u0443\u0437',
    descEn: 'Urgent load posted: Miami \u2192 NYC, pickup in 2 hours. $4,200 for 1,280 miles. Your driver Jake is 30 min from pickup.',
    descRu: '\u0421\u0440\u043E\u0447\u043D\u044B\u0439 \u0433\u0440\u0443\u0437: Miami \u2192 NYC, \u043F\u0438\u043A\u0430\u043F \u0447\u0435\u0440\u0435\u0437 2 \u0447\u0430\u0441\u0430. $4,200 \u0437\u0430 1,280 \u043C\u0438\u043B\u044C. \u0412\u0430\u0448 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C Jake \u0432 30 \u043C\u0438\u043D\u0443\u0442\u0430\u0445 \u043E\u0442 \u043F\u0438\u043A\u0430\u043F\u0430.',
    options: [
      {
        id: 'a',
        text: 'Bid on it first, ask Jake later',
        textRu: '\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u0430\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C, \u043F\u043E\u0442\u043E\u043C \u0441\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u0414\u0436\u0435\u0439\u043A\u0430',
        quality: 'ok',
        feedback: "Risky \u2014 if Jake can't take it (HOS, equipment, personal), you'll have to fall off the load. That damages your reputation.",
        feedbackRu: '\u0420\u0438\u0441\u043A\u043E\u0432\u0430\u043D\u043D\u043E \u2014 \u0435\u0441\u043B\u0438 \u0414\u0436\u0435\u0439\u043A \u043D\u0435 \u0441\u043C\u043E\u0436\u0435\u0442 (HOS, \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u0435, \u043B\u0438\u0447\u043D\u044B\u0435 \u043F\u0440\u0438\u0447\u0438\u043D\u044B), \u043F\u0440\u0438\u0434\u0451\u0442\u0441\u044F \u043E\u0442\u043A\u0430\u0437\u0430\u0442\u044C\u0441\u044F \u043E\u0442 \u0433\u0440\u0443\u0437\u0430. \u042D\u0442\u043E \u043F\u043E\u0440\u0442\u0438\u0442 \u0440\u0435\u043F\u0443\u0442\u0430\u0446\u0438\u044E.',
      },
      {
        id: 'b',
        text: 'Too rushed, skip it',
        textRu: '\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0441\u043F\u0435\u0448\u043D\u043E, \u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C',
        quality: 'poor',
        feedback: '$3.28/mile is well above average. Fast decisions make money in dispatch \u2014 learn to verify quickly, not avoid urgency.',
        feedbackRu: '$3.28/\u043C\u0438\u043B\u044F \u2014 \u0437\u043D\u0430\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0432\u044B\u0448\u0435 \u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E. \u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0437\u0430\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u044E\u0442 \u0434\u0435\u043D\u044C\u0433\u0438 \u0432 \u0434\u0438\u0441\u043F\u0435\u0442\u0447\u0438\u043D\u0433\u0435 \u2014 \u0443\u0447\u0438\u0442\u0435\u0441\u044C \u0431\u044B\u0441\u0442\u0440\u043E \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u0442\u044C, \u0430 \u043D\u0435 \u0438\u0437\u0431\u0435\u0433\u0430\u0442\u044C \u0441\u043F\u0435\u0448\u043A\u0438.',
      },
      {
        id: 'c',
        text: "Check Jake's HOS, verify truck type matches, then call broker",
        textRu: '\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C HOS \u0414\u0436\u0435\u0439\u043A\u0430, \u0443\u0431\u0435\u0434\u0438\u0442\u044C\u0441\u044F \u0447\u0442\u043E \u0442\u0438\u043F \u0442\u0440\u0430\u043A\u0430 \u043F\u043E\u0434\u0445\u043E\u0434\u0438\u0442, \u043F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C \u0431\u0440\u043E\u043A\u0435\u0440\u0443',
        quality: 'best',
        feedback: 'Textbook approach. Verifying HOS and equipment before committing prevents costly mistakes. $3.28/mile is an excellent rate.',
        feedbackRu: '\u041F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 \u043F\u043E\u0434\u0445\u043E\u0434. \u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 HOS \u0438 \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F \u043F\u0435\u0440\u0435\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435\u043C \u043F\u0440\u0435\u0434\u043E\u0442\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u0434\u043E\u0440\u043E\u0433\u0438\u0435 \u043E\u0448\u0438\u0431\u043A\u0438. $3.28/\u043C\u0438\u043B\u044F \u2014 \u043E\u0442\u043B\u0438\u0447\u043D\u0430\u044F \u0441\u0442\u0430\u0432\u043A\u0430.',
      },
      {
        id: 'd',
        text: 'Call Jake immediately to ask if he wants it',
        textRu: '\u0421\u0440\u0430\u0437\u0443 \u043F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C \u0414\u0436\u0435\u0439\u043A\u0443 \u0438 \u0441\u043F\u0440\u043E\u0441\u0438\u0442\u044C, \u0445\u043E\u0447\u0435\u0442 \u043B\u0438 \u043E\u043D \u044D\u0442\u043E\u0442 \u0433\u0440\u0443\u0437',
        quality: 'good',
        feedback: 'Quick action, but you should verify HOS and equipment compatibility first. What if Jake only has 5 hours left?',
        feedbackRu: '\u0411\u044B\u0441\u0442\u0440\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435, \u043D\u043E \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 HOS \u0438 \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u0438\u043C\u043E\u0441\u0442\u044C \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F. \u0427\u0442\u043E \u0435\u0441\u043B\u0438 \u0443 \u0414\u0436\u0435\u0439\u043A\u0430 \u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C \u0442\u043E\u043B\u044C\u043A\u043E 5 \u0447\u0430\u0441\u043E\u0432?',
      },
    ],
  },
  {
    time: '9:30 AM',
    titleEn: 'Driver Problem',
    titleRu: '\u041F\u0440\u043E\u0431\u043B\u0435\u043C\u0430 \u0441 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u043C',
    descEn: 'Driver Maria calls: "My truck won\'t start. I have a pickup in Phoenix at 11 AM."',
    descRu: '\u0412\u043E\u0434\u0438\u0442\u0435\u043B\u044C \u041C\u0430\u0440\u0438\u044F \u0437\u0432\u043E\u043D\u0438\u0442: \u00AB\u041C\u043E\u0439 \u0442\u0440\u0430\u043A \u043D\u0435 \u0437\u0430\u0432\u043E\u0434\u0438\u0442\u0441\u044F. \u0423 \u043C\u0435\u043D\u044F \u043F\u0438\u043A\u0430\u043F \u0432 Phoenix \u0432 11:00.\u00BB',
    options: [
      {
        id: 'a',
        text: 'Tell Maria to figure it out and call you back',
        textRu: '\u0421\u043A\u0430\u0437\u0430\u0442\u044C \u041C\u0430\u0440\u0438\u0438 \u0440\u0430\u0437\u043E\u0431\u0440\u0430\u0442\u044C\u0441\u044F \u0441\u0430\u043C\u043E\u0439 \u0438 \u043F\u0435\u0440\u0435\u0437\u0432\u043E\u043D\u0438\u0442\u044C',
        quality: 'poor',
        feedback: "You're the dispatcher \u2014 it's YOUR job to coordinate solutions, not push problems back to the driver.",
        feedbackRu: '\u0412\u044B \u2014 \u0434\u0438\u0441\u043F\u0435\u0442\u0447\u0435\u0440. \u042D\u0442\u043E \u0412\u0410\u0428\u0410 \u0440\u0430\u0431\u043E\u0442\u0430 \u043A\u043E\u043E\u0440\u0434\u0438\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0440\u0435\u0448\u0435\u043D\u0438\u044F, \u0430 \u043D\u0435 \u043F\u0435\u0440\u0435\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u044B \u043E\u0431\u0440\u0430\u0442\u043D\u043E \u043D\u0430 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F.',
      },
      {
        id: 'b',
        text: 'Call the broker to push the pickup time',
        textRu: '\u041F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C \u0431\u0440\u043E\u043A\u0435\u0440\u0443 \u0438 \u043F\u043E\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u043F\u0435\u0440\u0435\u043D\u0435\u0441\u0442\u0438 \u0432\u0440\u0435\u043C\u044F \u043F\u0438\u043A\u0430\u043F\u0430',
        quality: 'good',
        feedback: 'Good broker communication, but you also need roadside assistance for the truck and a backup plan if repairs take too long.',
        feedbackRu: '\u0425\u043E\u0440\u043E\u0448\u0430\u044F \u0441\u0432\u044F\u0437\u044C \u0441 \u0431\u0440\u043E\u043A\u0435\u0440\u043E\u043C, \u043D\u043E \u0432\u0430\u043C \u0442\u0430\u043A\u0436\u0435 \u043D\u0443\u0436\u043D\u0430 \u0442\u0435\u0445\u043F\u043E\u043C\u043E\u0449\u044C \u0434\u043B\u044F \u0442\u0440\u0430\u043A\u0430 \u0438 \u0437\u0430\u043F\u0430\u0441\u043D\u043E\u0439 \u043F\u043B\u0430\u043D, \u0435\u0441\u043B\u0438 \u0440\u0435\u043C\u043E\u043D\u0442 \u0437\u0430\u0442\u044F\u043D\u0435\u0442\u0441\u044F.',
      },
      {
        id: 'c',
        text: "Start looking for a different load for Maria's route",
        textRu: '\u041D\u0430\u0447\u0430\u0442\u044C \u0438\u0441\u043A\u0430\u0442\u044C \u0434\u0440\u0443\u0433\u043E\u0439 \u0433\u0440\u0443\u0437 \u0434\u043B\u044F \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0430 \u041C\u0430\u0440\u0438\u0438',
        quality: 'ok',
        feedback: "You're giving up on the current load too quickly. First try to save it \u2014 the truck might be a simple fix.",
        feedbackRu: '\u0412\u044B \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u044B\u0441\u0442\u0440\u043E \u0441\u0434\u0430\u0451\u0442\u0435\u0441\u044C \u0441 \u0442\u0435\u043A\u0443\u0449\u0438\u043C \u0433\u0440\u0443\u0437\u043E\u043C. \u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u043E\u043F\u044B\u0442\u0430\u0439\u0442\u0435\u0441\u044C \u0435\u0433\u043E \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u2014 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0430 \u0441 \u0442\u0440\u0430\u043A\u043E\u043C \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043F\u0440\u043E\u0441\u0442\u043E\u0439.',
      },
      {
        id: 'd',
        text: 'Call roadside assistance + call broker to report + check backup drivers near Phoenix',
        textRu: '\u0412\u044B\u0437\u0432\u0430\u0442\u044C \u0442\u0435\u0445\u043F\u043E\u043C\u043E\u0449\u044C + \u043F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C \u0431\u0440\u043E\u043A\u0435\u0440\u0443 \u0438 \u0441\u043E\u043E\u0431\u0449\u0438\u0442\u044C + \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0437\u0430\u043F\u0430\u0441\u043D\u044B\u0445 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439 \u0440\u044F\u0434\u043E\u043C \u0441 Phoenix',
        quality: 'best',
        feedback: "Triple-action response! You're solving the truck issue, managing broker expectations, AND having a backup plan. This is A+ dispatching.",
        feedbackRu: '\u0422\u0440\u043E\u0439\u043D\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435! \u0412\u044B \u0440\u0435\u0448\u0430\u0435\u0442\u0435 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0443 \u0441 \u0442\u0440\u0430\u043A\u043E\u043C, \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442\u0435 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u044F\u043C\u0438 \u0431\u0440\u043E\u043A\u0435\u0440\u0430 \u0418 \u0438\u043C\u0435\u0435\u0442\u0435 \u0437\u0430\u043F\u0430\u0441\u043D\u043E\u0439 \u043F\u043B\u0430\u043D. \u042D\u0442\u043E \u0434\u0438\u0441\u043F\u0435\u0442\u0447\u0438\u043D\u0433 \u0443\u0440\u043E\u0432\u043D\u044F A+.',
      },
    ],
  },
  {
    time: '11:00 AM',
    titleEn: 'Rate Negotiation',
    titleRu: '\u0422\u043E\u0440\u0433 \u043F\u043E \u0441\u0442\u0430\u0432\u043A\u0435',
    descEn: 'Broker offers $2,000 for an 800-mile sprinter-van run. Load board shows average $3.00/mile for this lane.',
    descRu: '\u0411\u0440\u043E\u043A\u0435\u0440 \u043F\u0440\u0435\u0434\u043B\u0430\u0433\u0430\u0435\u0442 $2 000 \u0437\u0430 800 \u043C\u0438\u043B\u044C (sprinter van). \u041B\u043E\u0430\u0434 \u0431\u043E\u0440\u0434 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0441\u0440\u0435\u0434\u043D\u044E\u044E \u0441\u0442\u0430\u0432\u043A\u0443 $3.00/\u043C\u0438\u043B\u044F \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u043B\u0435\u0439\u043D\u0430.',
    options: [
      {
        id: 'a',
        text: 'Ask broker "what\'s your best rate?"',
        textRu: '\u0421\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u0431\u0440\u043E\u043A\u0435\u0440\u0430 \u00AB\u043A\u0430\u043A\u0430\u044F \u0432\u0430\u0448\u0430 \u043B\u0443\u0447\u0448\u0430\u044F \u0441\u0442\u0430\u0432\u043A\u0430?\u00BB',
        quality: 'ok',
        feedback: "Not terrible, but you're giving away negotiation power. You should name YOUR price first, backed by market data.",
        feedbackRu: '\u041D\u0435\u043F\u043B\u043E\u0445\u043E, \u043D\u043E \u0432\u044B \u043E\u0442\u0434\u0430\u0451\u0442\u0435 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u0443. \u0412\u044B \u0434\u043E\u043B\u0436\u043D\u044B \u043D\u0430\u0437\u0432\u0430\u0442\u044C \u0421\u0412\u041E\u042E \u0446\u0435\u043D\u0443 \u043F\u0435\u0440\u0432\u044B\u043C, \u043F\u043E\u0434\u043A\u0440\u0435\u043F\u0438\u0432 \u0440\u044B\u043D\u043E\u0447\u043D\u044B\u043C\u0438 \u0434\u0430\u043D\u043D\u044B\u043C\u0438.',
      },
      {
        id: 'b',
        text: 'Counter at $2,800, citing market rate and truck availability',
        textRu: '\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C $2 800, \u0441\u0441\u044B\u043B\u0430\u044F\u0441\u044C \u043D\u0430 \u0440\u044B\u043D\u043E\u0447\u043D\u0443\u044E \u0441\u0442\u0430\u0432\u043A\u0443 \u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u044C \u0442\u0440\u0430\u043A\u043E\u0432',
        quality: 'best',
        feedback: 'Strong negotiation. $3.50/mile counter leaves room to settle around the $3.00/mile sprinter market rate. Always anchor high with data to back it up.',
        feedbackRu: '\u0421\u0438\u043B\u044C\u043D\u0430\u044F \u043F\u043E\u0437\u0438\u0446\u0438\u044F. \u041A\u043E\u043D\u0442\u0440\u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 $3,50/\u043C\u0438\u043B\u044F \u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 \u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u0441\u0442\u0432\u043E \u0434\u043B\u044F \u0441\u0434\u0435\u043B\u043A\u0438 \u043E\u043A\u043E\u043B\u043E $3,00/\u043C\u0438\u043B\u044F \u0434\u043B\u044F sprinter van. \u0412\u0441\u0435\u0433\u0434\u0430 \u043D\u0430\u0447\u0438\u043D\u0430\u0439\u0442\u0435 \u0441 \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u0446\u0435\u043D\u044B, \u043F\u043E\u0434\u043A\u0440\u0435\u043F\u043B\u044F\u044F \u0434\u0430\u043D\u043D\u044B\u043C\u0438.',
      },
      {
        id: 'c',
        text: 'Counter at $2,400',
        textRu: '\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C $2 400',
        quality: 'good',
        feedback: '$3.00/mile is right at market, but you left money on the table by not starting higher. The broker expected a counter.',
        feedbackRu: '$3,00/\u043C\u0438\u043B\u044F \u0440\u043E\u0432\u043D\u043E \u043F\u043E \u0440\u044B\u043D\u043A\u0443, \u043D\u043E \u0432\u044B \u0443\u043F\u0443\u0441\u0442\u0438\u043B\u0438 \u0434\u0435\u043D\u044C\u0433\u0438, \u043D\u0435 \u043D\u0430\u0447\u0430\u0432 \u0432\u044B\u0448\u0435. \u0411\u0440\u043E\u043A\u0435\u0440 \u043E\u0436\u0438\u0434\u0430\u043B \u043A\u043E\u043D\u0442\u0440\u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435.',
      },
      {
        id: 'd',
        text: 'Accept $2,000 \u2014 any load is better than empty',
        textRu: '\u041F\u0440\u0438\u043D\u044F\u0442\u044C $2 000 \u2014 \u043B\u044E\u0431\u043E\u0439 \u0433\u0440\u0443\u0437 \u043B\u0443\u0447\u0448\u0435, \u0447\u0435\u043C \u043F\u0443\u0441\u0442\u043E\u0439',
        quality: 'poor',
        feedback: '$2.50/mile is below market for a sprinter van. "Any load" mentality costs you thousands over time. Know your lane rates and fight for them.',
        feedbackRu: '$2,50/\u043C\u0438\u043B\u044F \u043D\u0438\u0436\u0435 \u0440\u044B\u043D\u043A\u0430 \u0434\u043B\u044F sprinter van. \u041C\u0435\u043D\u0442\u0430\u043B\u0438\u0442\u0435\u0442 \u00AB\u043B\u044E\u0431\u043E\u0439 \u0433\u0440\u0443\u0437\u00BB \u0441\u0442\u043E\u0438\u0442 \u0442\u044B\u0441\u044F\u0447 \u0441\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0435\u043C. \u0417\u043D\u0430\u0439\u0442\u0435 \u0441\u0442\u0430\u0432\u043A\u0438 \u043F\u043E \u043B\u0435\u0439\u043D\u0430\u043C \u0438 \u0431\u043E\u0440\u0438\u0442\u0435\u0441\u044C \u0437\u0430 \u043D\u0438\u0445.',
      },
    ],
  },
  {
    time: '1:00 PM',
    titleEn: 'Documentation Issue',
    titleRu: '\u041F\u0440\u043E\u0431\u043B\u0435\u043C\u0430 \u0441 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u043C\u0438',
    descEn: 'Driver sends photo of BOL \u2014 weight shows 44,000 lbs but rate con says 38,000 lbs.',
    descRu: '\u0412\u043E\u0434\u0438\u0442\u0435\u043B\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442 \u0444\u043E\u0442\u043E BOL \u2014 \u0432\u0435\u0441 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 44,000 lbs, \u043D\u043E rate con \u0443\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 38,000 lbs.',
    options: [
      {
        id: 'a',
        text: 'Ignore it, weight discrepancies happen',
        textRu: '\u041F\u0440\u043E\u0438\u0433\u043D\u043E\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C, \u0440\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u044F \u043F\u043E \u0432\u0435\u0441\u0443 \u0431\u044B\u0432\u0430\u044E\u0442',
        quality: 'poor',
        feedback: 'Never ignore documentation errors. This could lead to insurance claim denials, fines, or even fraud accusations.',
        feedbackRu: '\u041D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435 \u0438\u0433\u043D\u043E\u0440\u0438\u0440\u0443\u0439\u0442\u0435 \u043E\u0448\u0438\u0431\u043A\u0438 \u0432 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0445. \u042D\u0442\u043E \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u0438\u0432\u0435\u0441\u0442\u0438 \u043A \u043E\u0442\u043A\u0430\u0437\u0443 \u0432 \u0441\u0442\u0440\u0430\u0445\u043E\u0432\u044B\u0445 \u0432\u044B\u043F\u043B\u0430\u0442\u0430\u0445, \u0448\u0442\u0440\u0430\u0444\u0430\u043C \u0438\u043B\u0438 \u0434\u0430\u0436\u0435 \u043E\u0431\u0432\u0438\u043D\u0435\u043D\u0438\u044F\u043C \u0432 \u043C\u043E\u0448\u0435\u043D\u043D\u0438\u0447\u0435\u0441\u0442\u0432\u0435.',
      },
      {
        id: 'b',
        text: 'Call broker to update, but let driver continue',
        textRu: '\u041F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C \u0431\u0440\u043E\u043A\u0435\u0440\u0443 \u0434\u043B\u044F \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F, \u043D\u043E \u043F\u043E\u0437\u0432\u043E\u043B\u0438\u0442\u044C \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044E \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C',
        quality: 'good',
        feedback: "Good that you're contacting the broker, but it's safer to verify at a scale first. What if the actual weight is even different from the BOL?",
        feedbackRu: '\u0425\u043E\u0440\u043E\u0448\u043E, \u0447\u0442\u043E \u0432\u044B \u0441\u0432\u044F\u0437\u044B\u0432\u0430\u0435\u0442\u0435\u0441\u044C \u0441 \u0431\u0440\u043E\u043A\u0435\u0440\u043E\u043C, \u043D\u043E \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u0435\u0435 \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u043D\u0430 \u0432\u0435\u0441\u0430\u0445. \u0427\u0442\u043E \u0435\u0441\u043B\u0438 \u0444\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0432\u0435\u0441 \u043E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u0434\u0430\u0436\u0435 \u043E\u0442 BOL?',
      },
      {
        id: 'c',
        text: 'Stop the driver, call broker to correct rate con, verify weight at scale',
        textRu: '\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F, \u043F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C \u0431\u0440\u043E\u043A\u0435\u0440\u0443 \u0434\u043B\u044F \u0438\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F rate con, \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0432\u0435\u0441 \u043D\u0430 \u0432\u0435\u0441\u0430\u0445',
        quality: 'best',
        feedback: 'Documentation must match reality. A 6,000 lb discrepancy could mean wrong insurance coverage, overweight fines, or claims issues at delivery.',
        feedbackRu: '\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B \u0434\u043E\u043B\u0436\u043D\u044B \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438. \u0420\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0435 \u0432 6,000 lbs \u043C\u043E\u0436\u0435\u0442 \u043E\u0437\u043D\u0430\u0447\u0430\u0442\u044C \u043D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0443\u044E \u0441\u0442\u0440\u0430\u0445\u043E\u0432\u043A\u0443, \u0448\u0442\u0440\u0430\u0444\u044B \u0437\u0430 \u043F\u0435\u0440\u0435\u0432\u0435\u0441 \u0438\u043B\u0438 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u044B \u0441 \u043F\u0440\u0435\u0442\u0435\u043D\u0437\u0438\u044F\u043C\u0438 \u043F\u0440\u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0435.',
      },
      {
        id: 'd',
        text: 'Tell driver to proceed \u2014 44K is still under 80K limit',
        textRu: '\u0421\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044E \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0442\u044C \u2014 44K \u0432\u0441\u0451 \u0435\u0449\u0451 \u0432 \u043F\u0440\u0435\u0434\u0435\u043B\u0430\u0445 80K',
        quality: 'ok',
        feedback: "The weight limit isn't the issue \u2014 the paperwork mismatch is. If there's a claim, insurance may deny it based on wrong documentation.",
        feedbackRu: '\u0414\u0435\u043B\u043E \u043D\u0435 \u0432 \u043F\u0440\u0435\u0434\u0435\u043B\u0435 \u0432\u0435\u0441\u0430 \u2014 \u0430 \u0432 \u043D\u0435\u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0438 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u043E\u0432. \u041F\u0440\u0438 \u043F\u0440\u0435\u0442\u0435\u043D\u0437\u0438\u0438 \u0441\u0442\u0440\u0430\u0445\u043E\u0432\u0430\u044F \u043C\u043E\u0436\u0435\u0442 \u043E\u0442\u043A\u0430\u0437\u0430\u0442\u044C \u0438\u0437-\u0437\u0430 \u043D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0439 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u0438.',
      },
    ],
  },
  {
    time: '3:00 PM',
    titleEn: 'Multi-tasking Challenge',
    titleRu: '\u041C\u0443\u043B\u044C\u0442\u0438\u0437\u0430\u0434\u0430\u0447\u043D\u043E\u0441\u0442\u044C',
    descEn: "3 things happening at once: Driver A needs a load for tomorrow, Broker B is waiting for your counter, Driver C reports traffic delay.",
    descRu: '3 \u0434\u0435\u043B\u0430 \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E: \u0412\u043E\u0434\u0438\u0442\u0435\u043B\u044E A \u043D\u0443\u0436\u0435\u043D \u0433\u0440\u0443\u0437 \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430, \u0411\u0440\u043E\u043A\u0435\u0440 B \u0436\u0434\u0451\u0442 \u0432\u0430\u0448 \u043A\u043E\u043D\u0442\u0440\u043E\u0444\u0444\u0435\u0440, \u0412\u043E\u0434\u0438\u0442\u0435\u043B\u044C C \u0441\u043E\u043E\u0431\u0449\u0430\u0435\u0442 \u043E \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0435 \u0438\u0437-\u0437\u0430 \u0442\u0440\u0430\u0444\u0438\u043A\u0430.',
    options: [
      {
        id: 'a',
        text: 'Handle Driver A first since they need a load',
        textRu: '\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u0430\u043D\u044F\u0442\u044C\u0441\u044F \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u043C A, \u0435\u043C\u0443 \u043D\u0443\u0436\u0435\u043D \u0433\u0440\u0443\u0437',
        quality: 'ok',
        feedback: "Driver A's load is for TOMORROW \u2014 it's the least urgent. Meanwhile, Broker B might give the load to someone else.",
        feedbackRu: '\u0413\u0440\u0443\u0437 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F A \u043D\u0430 \u0417\u0410\u0412\u0422\u0420\u0410 \u2014 \u044D\u0442\u043E \u043D\u0430\u0438\u043C\u0435\u043D\u0435\u0435 \u0441\u0440\u043E\u0447\u043D\u043E. \u0422\u0435\u043C \u0432\u0440\u0435\u043C\u0435\u043D\u0435\u043C \u0431\u0440\u043E\u043A\u0435\u0440 B \u043C\u043E\u0436\u0435\u0442 \u043E\u0442\u0434\u0430\u0442\u044C \u0433\u0440\u0443\u0437 \u043A\u043E\u043C\u0443-\u0442\u043E \u0434\u0440\u0443\u0433\u043E\u043C\u0443.',
      },
      {
        id: 'b',
        text: "Tell everyone you'll call back in 30 min",
        textRu: '\u0421\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435\u043C, \u0447\u0442\u043E \u043F\u0435\u0440\u0435\u0437\u0432\u043E\u043D\u0438\u0442\u0435 \u0447\u0435\u0440\u0435\u0437 30 \u043C\u0438\u043D\u0443\u0442',
        quality: 'poor',
        feedback: "In 30 minutes, the broker will have moved on, the receiver won't know about the delay, and you look unprofessional.",
        feedbackRu: '\u0427\u0435\u0440\u0435\u0437 30 \u043C\u0438\u043D\u0443\u0442 \u0431\u0440\u043E\u043A\u0435\u0440 \u0443\u0439\u0434\u0451\u0442, \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u0431\u0443\u0434\u0435\u0442 \u0437\u043D\u0430\u0442\u044C \u043E \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0435, \u0438 \u0432\u044B \u0432\u044B\u0433\u043B\u044F\u0434\u0438\u0442\u0435 \u043D\u0435\u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E.',
      },
      {
        id: 'c',
        text: "Handle Driver C's delay first, then broker, then Driver A",
        textRu: '\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0430 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F C, \u043F\u043E\u0442\u043E\u043C \u0431\u0440\u043E\u043A\u0435\u0440, \u043F\u043E\u0442\u043E\u043C \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C A',
        quality: 'good',
        feedback: "Close! But the broker counter is more time-sensitive than the delay notification. A 5-minute difference with the broker could lose the load.",
        feedbackRu: '\u041F\u043E\u0447\u0442\u0438! \u041D\u043E \u043A\u043E\u043D\u0442\u0440\u043E\u0444\u0444\u0435\u0440 \u0431\u0440\u043E\u043A\u0435\u0440\u0430 \u0431\u043E\u043B\u0435\u0435 \u0441\u0440\u043E\u0447\u043D\u044B\u0439, \u0447\u0435\u043C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435 \u043E \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0435. 5-\u043C\u0438\u043D\u0443\u0442\u043D\u0430\u044F \u0440\u0430\u0437\u043D\u0438\u0446\u0430 \u0441 \u0431\u0440\u043E\u043A\u0435\u0440\u043E\u043C \u043C\u043E\u0436\u0435\u0442 \u0441\u0442\u043E\u0438\u0442\u044C \u0433\u0440\u0443\u0437\u0430.',
      },
      {
        id: 'd',
        text: "Prioritize: call Broker B (time-sensitive), update Driver C's receiver on delay, then find Driver A a load",
        textRu: '\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C: \u043F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C \u0411\u0440\u043E\u043A\u0435\u0440\u0443 B (\u0441\u0440\u043E\u0447\u043D\u043E), \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044F \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F C \u043E \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0435, \u043F\u043E\u0442\u043E\u043C \u043D\u0430\u0439\u0442\u0438 \u0433\u0440\u0443\u0437 \u0434\u043B\u044F \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F A',
        quality: 'best',
        feedback: "Perfect prioritization! Broker B's counter is time-sensitive (they'll move on), Driver C's delay needs immediate communication, and Driver A's load search can wait.",
        feedbackRu: '\u0418\u0434\u0435\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0438\u0437\u0430\u0446\u0438\u044F! \u041A\u043E\u043D\u0442\u0440\u043E\u0444\u0444\u0435\u0440 \u0431\u0440\u043E\u043A\u0435\u0440\u0430 B \u2014 \u0441\u0440\u043E\u0447\u043D\u044B\u0439 (\u043E\u043D \u0443\u0439\u0434\u0451\u0442), \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0430 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F C \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043D\u0435\u043C\u0435\u0434\u043B\u0435\u043D\u043D\u043E\u0439 \u043A\u043E\u043C\u043C\u0443\u043D\u0438\u043A\u0430\u0446\u0438\u0438, \u0430 \u043F\u043E\u0438\u0441\u043A \u0433\u0440\u0443\u0437\u0430 \u0434\u043B\u044F \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F A \u043C\u043E\u0436\u0435\u0442 \u043F\u043E\u0434\u043E\u0436\u0434\u0430\u0442\u044C.',
      },
    ],
  },
  {
    time: '5:00 PM',
    titleEn: 'End of Day Accounting',
    titleRu: '\u041A\u043E\u043D\u0435\u0446 \u0440\u0430\u0431\u043E\u0447\u0435\u0433\u043E \u0434\u043D\u044F',
    descEn: "Time to wrap up. You booked 4 loads today. How do you end the workday so tomorrow morning starts smoothly?",
    descRu: '\u041F\u043E\u0440\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0430\u0442\u044C \u0434\u0435\u043D\u044C. \u0412\u044B \u0437\u0430\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043B\u0438 4 \u0433\u0440\u0443\u0437\u0430. \u041A\u0430\u043A \u0437\u0430\u043A\u043E\u043D\u0447\u0438\u0442\u044C \u0440\u0430\u0431\u043E\u0447\u0438\u0439 \u0434\u0435\u043D\u044C, \u0447\u0442\u043E\u0431\u044B \u0437\u0430\u0432\u0442\u0440\u0430 \u0443\u0442\u0440\u043E\u043C \u043D\u0430\u0447\u0430\u0442\u044C \u0431\u0435\u0437 \u0445\u0430\u043E\u0441\u0430?',
    options: [
      {
        id: 'a',
        text: 'Send delivery updates to brokers only',
        textRu: '\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043E \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430\u0445 \u0442\u043E\u043B\u044C\u043A\u043E \u0431\u0440\u043E\u043A\u0435\u0440\u0430\u043C',
        quality: 'ok',
        feedback: "Broker updates are important, but you're forgetting driver statuses and tomorrow's planning. Half the work done.",
        feedbackRu: '\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u0434\u043B\u044F \u0431\u0440\u043E\u043A\u0435\u0440\u043E\u0432 \u0432\u0430\u0436\u043D\u044B, \u043D\u043E \u0432\u044B \u0437\u0430\u0431\u044B\u043B\u0438 \u0441\u0442\u0430\u0442\u0443\u0441\u044B \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439 \u0438 \u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430. \u041F\u043E\u043B\u043E\u0432\u0438\u043D\u0430 \u0440\u0430\u0431\u043E\u0442\u044B.',
      },
      {
        id: 'b',
        text: 'Update driver statuses and check pending invoices',
        textRu: '\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u0443\u0441\u044B \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439 \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u043E\u0436\u0438\u0434\u0430\u044E\u0449\u0438\u0435 \u0438\u043D\u0432\u043E\u0439\u0441\u044B',
        quality: 'good',
        feedback: "Good coverage, but add tomorrow's dispatch plan. What loads are your drivers delivering, and who'll be empty in the morning?",
        feedbackRu: '\u0425\u043E\u0440\u043E\u0448\u0438\u0439 \u043E\u0445\u0432\u0430\u0442, \u043D\u043E \u0434\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043F\u043B\u0430\u043D \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430. \u041A\u0430\u043A\u0438\u0435 \u0433\u0440\u0443\u0437\u044B \u0434\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u044E\u0442 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0438 \u0438 \u043A\u0442\u043E \u0431\u0443\u0434\u0435\u0442 \u0441\u0432\u043E\u0431\u043E\u0434\u0435\u043D \u0443\u0442\u0440\u043E\u043C?',
      },
      {
        id: 'c',
        text: "Update all driver statuses, send delivery confirmations, prep tomorrow's dispatch plan",
        textRu: '\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u0443\u0441\u044B \u0432\u0441\u0435\u0445 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439, \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F \u0434\u043E\u0441\u0442\u0430\u0432\u043E\u043A, \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u0438\u0442\u044C \u043F\u043B\u0430\u043D \u0434\u0438\u0441\u043F\u0435\u0442\u0447\u0438\u043D\u0433\u0430 \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430',
        quality: 'best',
        feedback: "Complete close-out routine. Tomorrow morning you'll hit the ground running because everything is organized tonight.",
        feedbackRu: '\u041F\u043E\u043B\u043D\u0430\u044F \u043F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F. \u0417\u0430\u0432\u0442\u0440\u0430 \u0443\u0442\u0440\u043E\u043C \u0432\u044B \u043D\u0430\u0447\u043D\u0451\u0442\u0435 \u043D\u0430 \u043F\u043E\u043B\u043D\u043E\u0439 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u0438, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u0432\u0441\u0451 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u043E\u0432\u0430\u043D\u043E \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0432\u0435\u0447\u0435\u0440\u043E\u043C.',
      },
      {
        id: 'd',
        text: "Just log off \u2014 everything's handled",
        textRu: '\u041F\u0440\u043E\u0441\u0442\u043E \u0432\u044B\u0439\u0442\u0438 \u2014 \u0432\u0441\u0451 \u0443\u0436\u0435 \u0441\u0434\u0435\u043B\u0430\u043D\u043E',
        quality: 'poor',
        feedback: 'What about tomorrow? Without prep, your morning will be chaos. And did you verify all deliveries are on track?',
        feedbackRu: '\u0410 \u0447\u0442\u043E \u043D\u0430\u0441\u0447\u0451\u0442 \u0437\u0430\u0432\u0442\u0440\u0430? \u0411\u0435\u0437 \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0438 \u0443\u0442\u0440\u043E \u0431\u0443\u0434\u0435\u0442 \u0445\u0430\u043E\u0442\u0438\u0447\u043D\u044B\u043C. \u0418 \u0432\u044B \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u043B\u0438, \u0447\u0442\u043E \u0432\u0441\u0435 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438 \u0438\u0434\u0443\u0442 \u043F\u043E \u043F\u043B\u0430\u043D\u0443?',
      },
    ],
  },
  {
    time: '6:30 PM',
    titleEn: 'After Hours Emergency',
    titleRu: '\u042D\u043A\u0441\u0442\u0440\u0435\u043D\u043D\u044B\u0439 \u0437\u0432\u043E\u043D\u043E\u043A \u043F\u043E\u0441\u043B\u0435 \u0440\u0430\u0431\u043E\u0442\u044B',
    descEn: "Driver calls at 6:30 PM: \"I'm at the receiver but they're closed. Sign says they close at 5 PM but rate con says 7 PM.\"",
    descRu: '\u0412\u043E\u0434\u0438\u0442\u0435\u043B\u044C \u0437\u0432\u043E\u043D\u0438\u0442 \u0432 6:30 PM: \u00AB\u042F \u0443 \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044F, \u043D\u043E \u043E\u043D\u0438 \u0437\u0430\u043A\u0440\u044B\u0442\u044B. \u041D\u0430 \u0432\u044B\u0432\u0435\u0441\u043A\u0435 \u043D\u0430\u043F\u0438\u0441\u0430\u043D\u043E \u2014 \u0437\u0430\u043A\u0440\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u0432 5 PM, \u043D\u043E rate con \u0433\u043E\u0432\u043E\u0440\u0438\u0442 7 PM.\u00BB',
    options: [
      {
        id: 'a',
        text: 'Tell driver to wait until morning',
        textRu: '\u0421\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044E \u0436\u0434\u0430\u0442\u044C \u0434\u043E \u0443\u0442\u0440\u0430',
        quality: 'ok',
        feedback: 'Where will the driver sleep? Is the area safe? You need to at least find them parking and notify the broker.',
        feedbackRu: '\u0413\u0434\u0435 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C \u0431\u0443\u0434\u0435\u0442 \u0441\u043F\u0430\u0442\u044C? \u0411\u0435\u0437\u043E\u043F\u0430\u0441\u0435\u043D \u043B\u0438 \u0440\u0430\u0439\u043E\u043D? \u0412\u044B \u0434\u043E\u043B\u0436\u043D\u044B \u0445\u043E\u0442\u044F \u0431\u044B \u043D\u0430\u0439\u0442\u0438 \u0438\u043C \u043F\u0430\u0440\u043A\u043E\u0432\u043A\u0443 \u0438 \u0443\u0432\u0435\u0434\u043E\u043C\u0438\u0442\u044C \u0431\u0440\u043E\u043A\u0435\u0440\u0430.',
      },
      {
        id: 'b',
        text: "Call receiver's main number and leave voicemail",
        textRu: '\u041F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u044B\u0439 \u043D\u043E\u043C\u0435\u0440 \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044F \u0438 \u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0433\u043E\u043B\u043E\u0441\u043E\u0432\u043E\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435',
        quality: 'good',
        feedback: "Good initiative, but a voicemail won't get answered tonight. Call the broker's after-hours line \u2014 they have escalation contacts.",
        feedbackRu: '\u0425\u043E\u0440\u043E\u0448\u0430\u044F \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u0430, \u043D\u043E \u043D\u0430 \u0433\u043E\u043B\u043E\u0441\u043E\u0432\u043E\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043D\u0435 \u043E\u0442\u0432\u0435\u0442\u044F\u0442 \u0441\u0435\u0433\u043E\u0434\u043D\u044F. \u0417\u0432\u043E\u043D\u0438\u0442\u0435 \u043D\u0430 \u043F\u043E\u0441\u043B\u0435-\u0447\u0430\u0441\u043E\u0432\u043E\u0439 \u043D\u043E\u043C\u0435\u0440 \u0431\u0440\u043E\u043A\u0435\u0440\u0430 \u2014 \u0443 \u043D\u0438\u0445 \u0435\u0441\u0442\u044C \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u044B \u0434\u043B\u044F \u044D\u0441\u043A\u0430\u043B\u0430\u0446\u0438\u0438.',
      },
      {
        id: 'c',
        text: "Say \"nothing I can do now, we'll deal with it tomorrow\"",
        textRu: '\u0421\u043A\u0430\u0437\u0430\u0442\u044C \u00AB\u0441\u0435\u0439\u0447\u0430\u0441 \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043C\u043E\u0433\u0443 \u0441\u0434\u0435\u043B\u0430\u0442\u044C, \u0440\u0430\u0437\u0431\u0435\u0440\u0451\u043C\u0441\u044F \u0437\u0430\u0432\u0442\u0440\u0430\u00BB',
        quality: 'poor',
        feedback: 'Your driver is stranded with a loaded truck. You can always do SOMETHING \u2014 find parking, call the broker, document the issue for a claim.',
        feedbackRu: '\u0412\u0430\u0448 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C \u0437\u0430\u0441\u0442\u0440\u044F\u043B \u0441 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043D\u044B\u043C \u0442\u0440\u0430\u043A\u043E\u043C. \u0412\u044B \u0432\u0441\u0435\u0433\u0434\u0430 \u043C\u043E\u0436\u0435\u0442\u0435 \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u0427\u0422\u041E-\u0422\u041E \u2014 \u043D\u0430\u0439\u0442\u0438 \u043F\u0430\u0440\u043A\u043E\u0432\u043A\u0443, \u043F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C \u0431\u0440\u043E\u043A\u0435\u0440\u0443, \u0437\u0430\u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0434\u043B\u044F \u043F\u0440\u0435\u0442\u0435\u043D\u0437\u0438\u0438.',
      },
      {
        id: 'd',
        text: "Call broker's after-hours number, document discrepancy, find driver safe parking nearby",
        textRu: '\u041F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C \u043D\u0430 \u043F\u043E\u0441\u043B\u0435-\u0447\u0430\u0441\u043E\u0432\u043E\u0439 \u043D\u043E\u043C\u0435\u0440 \u0431\u0440\u043E\u043A\u0435\u0440\u0430, \u0437\u0430\u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0440\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0435, \u043D\u0430\u0439\u0442\u0438 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044E \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u0443\u044E \u043F\u0430\u0440\u043A\u043E\u0432\u043A\u0443 \u0440\u044F\u0434\u043E\u043C',
        quality: 'best',
        feedback: "Full response: escalate through proper channel, document for potential detention claim, and take care of your driver's safety.",
        feedbackRu: '\u041F\u043E\u043B\u043D\u0430\u044F \u0440\u0435\u0430\u043A\u0446\u0438\u044F: \u044D\u0441\u043A\u0430\u043B\u0430\u0446\u0438\u044F \u0447\u0435\u0440\u0435\u0437 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 \u043A\u0430\u043D\u0430\u043B, \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0434\u043B\u044F \u043F\u043E\u0442\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0439 \u043F\u0440\u0435\u0442\u0435\u043D\u0437\u0438\u0438 \u043F\u043E \u0434\u0435\u0442\u0435\u043D\u0448\u043D\u0443, \u0438 \u0437\u0430\u0431\u043E\u0442\u0430 \u043E \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F.',
      },
    ],
  },
];

/* ── Component ────────────────────────────────────────────────────────────── */

export function DispatcherDaySimulator() {
  const { lang } = useLang();
  const [currentEvent, setCurrentEvent] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [scores, setScores] = useState<Record<number, number>>({});
  const [qualities, setQualities] = useState<Record<number, Quality>>({});
  const [finished, setFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  const totalEvents = EVENTS.length;
  const answeredCount = Object.keys(responses).length;
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxScore = totalEvents * 10;

  /* scroll active card into view */
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentEvent, showFeedback]);

  const handleChoice = useCallback((eventIdx: number, optionId: string, quality: Quality, points: number) => {
    setResponses(r => ({ ...r, [eventIdx]: optionId }));
    setScores(s => ({ ...s, [eventIdx]: points }));
    setQualities(q => ({ ...q, [eventIdx]: quality }));
    setShowFeedback(eventIdx);
  }, []);

  const handleNext = useCallback(() => {
    setShowFeedback(null);
    if (currentEvent + 1 >= totalEvents) {
      setFinished(true);
    } else {
      setCurrentEvent(c => c + 1);
    }
  }, [currentEvent, totalEvents]);

  const handleRestart = useCallback(() => {
    setCurrentEvent(0);
    setResponses({});
    setScores({});
    setQualities({});
    setFinished(false);
    setShowFeedback(null);
  }, []);

  /* ── Day progress (7 AM = 0%, 7 PM = 100%) ── */
  const progressPct = finished
    ? 100
    : (() => {
        const timeStr = EVENTS[currentEvent].time;
        const [h, rest] = timeStr.split(':');
        const [m, ampm] = rest.split(' ');
        let hour = parseInt(h);
        if (ampm === 'PM' && hour !== 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        const minutes = hour * 60 + parseInt(m);
        const start = 7 * 60;   // 7:00 AM
        const end   = 19 * 60;  // 7:00 PM
        return Math.round(((minutes - start) / (end - start)) * 100);
      })();

  /* ── Performance rating ── */
  function getRating(pct: number) {
    if (pct >= 90) return { en: 'Dispatch Manager Material', ru: '\u041C\u0430\u0442\u0435\u0440\u0438\u0430\u043B \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430 \u0434\u0438\u0441\u043F\u0435\u0442\u0447\u0438\u043D\u0433\u0430', stars: 5 };
    if (pct >= 75) return { en: 'Solid Dispatcher', ru: '\u041A\u0440\u0435\u043F\u043A\u0438\u0439 \u0434\u0438\u0441\u043F\u0435\u0442\u0447\u0435\u0440', stars: 4 };
    if (pct >= 55) return { en: 'Getting There', ru: '\u041D\u0430 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u043C \u043F\u0443\u0442\u0438', stars: 3 };
    if (pct >= 35) return { en: 'Needs Practice', ru: '\u041D\u0443\u0436\u043D\u0430 \u043F\u0440\u0430\u043A\u0442\u0438\u043A\u0430', stars: 2 };
    return { en: 'Back to Training', ru: '\u041D\u0430\u0437\u0430\u0434 \u043A \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u044E', stars: 1 };
  }

  /* ── Result screen ── */
  if (finished) {
    const pct = Math.round((totalScore / maxScore) * 100);
    const rating = getRating(pct);

    return (
      <div className="mt-6 rounded-2xl overflow-hidden border border-slate-700/50 bg-gradient-to-b from-slate-800 to-slate-900 p-6 lg:p-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-2">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            {lang === 'ru' ? '\u0414\u0435\u043D\u044C \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D!' : 'Day Complete!'}
          </h3>
          <p className="text-5xl font-black text-white">{pct}%</p>
          <p className="text-sm text-slate-400">
            {totalScore}/{maxScore} {lang === 'ru' ? '\u0431\u0430\u043B\u043B\u043E\u0432' : 'points'}
          </p>

          {/* Stars */}
          <div className="flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-6 h-6 transition-all',
                  i < rating.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                )}
              />
            ))}
          </div>
          <p className="text-lg font-semibold text-slate-200">
            {lang === 'ru' ? rating.ru : rating.en}
          </p>

          {/* Per-event breakdown */}
          <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
            {EVENTS.map((ev, i) => {
              const q = qualities[i];
              return (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="text-slate-500 w-16 flex-shrink-0 font-mono text-xs">{ev.time}</span>
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', q ? QUALITY_COLORS[q] : 'bg-slate-600')} />
                  <span className="text-slate-300 flex-1 truncate">
                    {lang === 'ru' ? ev.titleRu : ev.titleEn}
                  </span>
                  <span className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    q ? QUALITY_BG[q] : 'bg-slate-700 text-slate-400'
                  )}>
                    {q ? (lang === 'ru' ? QUALITY_LABEL[q].ru : QUALITY_LABEL[q].en) : '-'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Tips based on score */}
          <div className="mt-6 bg-slate-700/30 rounded-xl p-4 text-left">
            <p className="text-sm font-semibold text-slate-300 mb-2">
              {lang === 'ru' ? '\u041A\u043B\u044E\u0447\u0435\u0432\u044B\u0435 \u0432\u044B\u0432\u043E\u0434\u044B:' : 'Key Takeaways:'}
            </p>
            <ul className="text-sm text-slate-400 space-y-1">
              {pct < 60 && (
                <>
                  <li>- {lang === 'ru' ? '\u0412\u0441\u0435\u0433\u0434\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u0439\u0442\u0435 HOS \u043F\u0435\u0440\u0435\u0434 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435\u043C \u0433\u0440\u0443\u0437\u0430' : 'Always check HOS before assigning a load'}</li>
                  <li>- {lang === 'ru' ? '\u041A\u043E\u043C\u043C\u0443\u043D\u0438\u043A\u0430\u0446\u0438\u044F \u0441 \u0431\u0440\u043E\u043A\u0435\u0440\u043E\u043C \u2014 \u0432\u0430\u0448\u0430 \u0433\u043B\u0430\u0432\u043D\u0430\u044F \u0437\u0430\u0434\u0430\u0447\u0430' : 'Broker communication is your #1 job'}</li>
                  <li>- {lang === 'ru' ? '\u041D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435 \u0438\u0433\u043D\u043E\u0440\u0438\u0440\u0443\u0439\u0442\u0435 \u043D\u0435\u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u044F \u0432 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0445' : 'Never ignore documentation discrepancies'}</li>
                </>
              )}
              {pct >= 60 && pct < 85 && (
                <>
                  <li>- {lang === 'ru' ? '\u0423\u0447\u0438\u0442\u0435\u0441\u044C \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0440\u043E\u0447\u043D\u044B\u0435 \u0437\u0430\u0434\u0430\u0447\u0438' : 'Learn to prioritize time-sensitive tasks'}</li>
                  <li>- {lang === 'ru' ? '\u041D\u0430\u0447\u0438\u043D\u0430\u0439\u0442\u0435 \u0442\u043E\u0440\u0433 \u0441 \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u0446\u0435\u043D\u044B, \u043F\u043E\u0434\u043A\u0440\u0435\u043F\u043B\u0451\u043D\u043D\u043E\u0439 \u0434\u0430\u043D\u043D\u044B\u043C\u0438' : 'Start negotiations high, backed by data'}</li>
                </>
              )}
              {pct >= 85 && (
                <>
                  <li>- {lang === 'ru' ? '\u041E\u0442\u043B\u0438\u0447\u043D\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430! \u0412\u044B \u043C\u044B\u0441\u043B\u0438\u0442\u0435 \u043A\u0430\u043A \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0434\u0438\u0441\u043F\u0435\u0442\u0447\u0435\u0440.' : 'Great work! You think like a professional dispatcher.'}</li>
                  <li>- {lang === 'ru' ? '\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0439\u0442\u0435 \u0440\u0430\u0437\u0432\u0438\u0432\u0430\u0442\u044C \u043D\u0430\u0432\u044B\u043A\u0438 \u043C\u0443\u043B\u044C\u0442\u0438\u0437\u0430\u0434\u0430\u0447\u043D\u043E\u0441\u0442\u0438' : 'Keep honing your multi-tasking skills'}</li>
                </>
              )}
            </ul>
          </div>

          <button
            onClick={handleRestart}
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {lang === 'ru' ? '\u041D\u0430\u0447\u0430\u0442\u044C \u0434\u0435\u043D\u044C \u0437\u0430\u043D\u043E\u0432\u043E' : 'Restart Day'}
          </button>
        </div>
      </div>
    );
  }

  /* ── Main timeline ── */
  return (
    <div ref={containerRef} className="mt-6 rounded-2xl overflow-hidden border border-slate-700/50 bg-gradient-to-b from-slate-800 to-slate-900">
      {/* Header with progress */}
      <div className="bg-slate-800/80 border-b border-slate-700/50 px-4 py-3 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-sm lg:text-base">
              {lang === 'ru' ? '\u0414\u0435\u043D\u044C \u0434\u0438\u0441\u043F\u0435\u0442\u0447\u0435\u0440\u0430: \u0441\u0438\u043C\u0443\u043B\u044F\u0442\u043E\u0440' : 'Day of a Dispatcher: Simulator'}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {answeredCount}/{totalEvents}
          </span>
        </div>
        {/* Progress bar: 7 AM -> 7 PM */}
        <div className="relative">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>7 AM</span>
            <span>12 PM</span>
            <span>7 PM</span>
          </div>
          <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg, #1e3a5f 0%, #3b82f6 50%, #f59e0b 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Timeline body */}
      <div className="p-4 lg:p-6 space-y-1">
        {EVENTS.map((event, idx) => {
          const isActive = idx === currentEvent && showFeedback === null;
          const isAnswered = responses[idx] !== undefined;
          const isFeedback = showFeedback === idx;
          const chosenOption = isAnswered ? event.options.find(o => o.id === responses[idx]) : null;

          return (
            <div
              key={idx}
              ref={isActive || isFeedback ? activeRef : undefined}
              className="relative flex gap-3 lg:gap-5"
            >
              {/* Timeline connector line */}
              <div className="flex flex-col items-center flex-shrink-0 w-16 lg:w-20">
                <span className={cn(
                  'text-xs font-mono font-semibold mb-1 transition-colors',
                  isActive || isFeedback ? 'text-blue-400' : isAnswered ? 'text-slate-400' : 'text-slate-600'
                )}>
                  {event.time}
                </span>
                <div className={cn(
                  'w-3 h-3 rounded-full border-2 flex-shrink-0 transition-all z-10',
                  isActive || isFeedback
                    ? 'border-blue-400 bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                    : isAnswered
                      ? cn('border-transparent', QUALITY_COLORS[qualities[idx]])
                      : 'border-slate-600 bg-slate-800'
                )}>
                </div>
                {idx < totalEvents - 1 && (
                  <div className={cn(
                    'w-0.5 flex-1 min-h-[24px] transition-colors',
                    isAnswered ? 'bg-slate-600' : 'bg-slate-700/50'
                  )} />
                )}
              </div>

              {/* Event card */}
              <div className={cn(
                'flex-1 rounded-xl border transition-all duration-300 mb-3',
                isActive
                  ? 'border-blue-500/40 bg-slate-700/50 shadow-lg shadow-blue-500/5'
                  : isFeedback
                    ? 'border-slate-600/50 bg-slate-700/30'
                    : isAnswered
                      ? 'border-slate-700/30 bg-slate-800/30'
                      : 'border-slate-700/20 bg-slate-800/20 opacity-40',
              )}>
                {/* Card header */}
                <div className="px-4 py-3 flex items-center gap-2">
                  {isAnswered && !isFeedback ? (
                    <div className={cn('w-5 h-5 rounded-full flex items-center justify-center', QUALITY_COLORS[qualities[idx]])}>
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  ) : isActive || isFeedback ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  )}
                  <h4 className={cn(
                    'font-semibold text-sm',
                    isActive || isFeedback ? 'text-white' : isAnswered ? 'text-slate-300' : 'text-slate-500'
                  )}>
                    {lang === 'ru' ? event.titleRu : event.titleEn}
                  </h4>
                </div>

                {/* Expanded content for active event */}
                {(isActive || isFeedback) && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {lang === 'ru' ? event.descRu : event.descEn}
                    </p>

                    {isActive && (
                      <div className="space-y-2">
                        {event.options.map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => handleChoice(idx, opt.id, opt.quality, SCORE_MAP[opt.quality])}
                            className="w-full text-left text-sm px-4 py-3 rounded-lg border border-slate-600/50 bg-slate-700/30 text-slate-200 hover:border-blue-500/50 hover:bg-blue-500/10 active:bg-blue-500/20 transition-all"
                          >
                            {lang === 'ru' ? opt.textRu : opt.text}
                          </button>
                        ))}
                      </div>
                    )}

                    {isFeedback && chosenOption && (
                      <div className="space-y-3">
                        {/* Chosen answer */}
                        <div className={cn(
                          'px-4 py-3 rounded-lg border text-sm',
                          QUALITY_BG[chosenOption.quality]
                        )}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-xs uppercase tracking-wide">
                              {lang === 'ru' ? QUALITY_LABEL[chosenOption.quality].ru : QUALITY_LABEL[chosenOption.quality].en}
                              {' '}(+{SCORE_MAP[chosenOption.quality]} {lang === 'ru' ? '\u0431.' : 'pts'})
                            </span>
                          </div>
                          <p className="opacity-90 leading-relaxed">
                            {lang === 'ru' ? chosenOption.feedbackRu : chosenOption.feedback}
                          </p>
                        </div>

                        {/* Show best answer if not chosen */}
                        {chosenOption.quality !== 'best' && (
                          <div className="px-4 py-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm">
                            <p className="text-emerald-400 font-semibold text-xs uppercase tracking-wide mb-1">
                              {lang === 'ru' ? '\u041B\u0443\u0447\u0448\u0438\u0439 \u043E\u0442\u0432\u0435\u0442:' : 'Best answer:'}
                            </p>
                            <p className="text-emerald-300/80 leading-relaxed">
                              {lang === 'ru'
                                ? event.options.find(o => o.quality === 'best')?.textRu
                                : event.options.find(o => o.quality === 'best')?.text}
                            </p>
                          </div>
                        )}

                        <button
                          onClick={handleNext}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
                        >
                          {currentEvent + 1 >= totalEvents
                            ? (lang === 'ru' ? '\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C \u0434\u0435\u043D\u044C' : 'End Day')
                            : (lang === 'ru' ? '\u0414\u0430\u043B\u0435\u0435' : 'Next')}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Collapsed answered summary */}
                {isAnswered && !isFeedback && chosenOption && (
                  <div className="px-4 pb-3">
                    <p className="text-xs text-slate-500 truncate">
                      {lang === 'ru' ? chosenOption.textRu : chosenOption.text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Score footer */}
      <div className="bg-slate-800/60 border-t border-slate-700/30 px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {lang === 'ru' ? '\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u0441\u0447\u0451\u0442' : 'Current Score'}
        </span>
        <span className="text-sm font-bold text-white">
          {totalScore}/{maxScore}
        </span>
      </div>
    </div>
  );
}
