import { useState } from "react";
import {
  Scale, LayoutDashboard, FileText, BarChart3, Settings, Calendar,
  Bell, Headphones, Shield, AlertTriangle, CheckCircle, XCircle,
  ChevronDown, ChevronRight, Mic, Send, Paperclip, Keyboard,
  Building2, Mail, MapPin, Briefcase, MessageSquare, Globe, Volume2,
  FileCheck, Lock, Key, RefreshCw, Clock, Plus, Crown, Star,
  TrendingUp, TrendingDown, Activity, Users, Zap, Phone, BookOpen,
  Copy, ExternalLink, ChevronLeft, Circle, MoreHorizontal, Wifi,
  LogOut, User, Search, Filter, Eye, EyeOff, ToggleLeft, ToggleRight
} from "lucide-react";

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C96D";
const BG = "#0A0A0F";
const CARD = "#13131C";
const CARD2 = "#1A1A26";
const BORDER = "#2A2A3A";
const TEXT = "#F0EEF8";
const MUTED = "#7A7A94";
const MUTED2 = "#4A4A64";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold: ${GOLD};
    --gold-light: ${GOLD_LIGHT};
    --bg: ${BG};
    --card: ${CARD};
    --card2: ${CARD2};
    --border: ${BORDER};
    --text: ${TEXT};
    --muted: ${MUTED};
    --muted2: ${MUTED2};
    --red: #E05555;
    --amber: #E0993A;
    --green: #4CAF82;
    --blue: #4A90E2;
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-sans: 'DM Sans', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  html, body, #root { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-sans); font-size: 14px; line-height: 1.6; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .layout { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

  /* TOP NAV */
  .topnav {
    display: flex; align-items: center; gap: 0;
    background: rgba(10,10,15,0.95); backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 0 24px; height: 52px; flex-shrink: 0; position: relative; z-index: 50;
  }
  .brand { display: flex; align-items: center; gap: 10px; margin-right: 32px; }
  .brand-icon { width: 32px; height: 32px; background: linear-gradient(135deg, #1A1408, #2A2010); border: 1px solid var(--gold); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .brand-name { font-family: var(--font-display); font-size: 20px; font-weight: 600; color: var(--text); letter-spacing: 0.02em; }
  .premium-pill { display: flex; align-items: center; gap: 4px; background: linear-gradient(135deg, #1A1408, #251C08); border: 1px solid rgba(201,168,76,0.5); border-radius: 20px; padding: 2px 8px 2px 6px; font-size: 10px; font-weight: 500; color: var(--gold); letter-spacing: 0.08em; text-transform: uppercase; }
  .nav-tabs { display: flex; align-items: stretch; gap: 0; flex: 1; height: 100%; }
  .nav-tab { display: flex; align-items: center; gap: 6px; padding: 0 14px; height: 100%; font-size: 13px; font-weight: 400; color: var(--muted); cursor: pointer; position: relative; border: none; background: none; transition: color 0.2s; white-space: nowrap; }
  .nav-tab:hover { color: var(--text); }
  .nav-tab.active { color: var(--text); }
  .nav-tab.active::after { content: ''; position: absolute; bottom: 0; left: 14px; right: 14px; height: 2px; background: var(--gold); border-radius: 1px 1px 0 0; }
  .nav-right { display: flex; align-items: center; gap: 8px; margin-left: auto; }
  .status-dot { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--green); }
  .status-dot::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  .icon-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid transparent; background: none; color: var(--muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; position: relative; }
  .icon-btn:hover { color: var(--text); background: var(--card); border-color: var(--border); }
  .notif-badge { position: absolute; top: 4px; right: 4px; width: 14px; height: 14px; background: var(--red); border-radius: 50%; font-size: 9px; font-weight: 600; color: white; display: flex; align-items: center; justify-content: center; border: 1.5px solid var(--bg); }
  .avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #1E1A08, #2A2210); border: 1.5px solid var(--gold); font-family: var(--font-display); font-size: 13px; font-weight: 600; color: var(--gold); display: flex; align-items: center; justify-content: center; cursor: pointer; }

  /* BODY */
  .body { display: flex; flex: 1; overflow: hidden; }

  /* SIDEBAR */
  .sidebar { width: 220px; flex-shrink: 0; background: rgba(13,13,20,0.8); border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow-y: auto; padding: 16px 0 0; }
  .sidebar-section { padding: 0 12px 16px; }
  .sidebar-label { font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted2); padding: 0 8px 8px; }
  .sidebar-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 8px; color: var(--muted); cursor: pointer; font-size: 13px; transition: all 0.15s; margin-bottom: 2px; }
  .sidebar-item:hover { color: var(--text); background: var(--card); }
  .sidebar-item.active { color: var(--text); background: rgba(201,168,76,0.08); }
  .sidebar-item.active svg { color: var(--gold); }
  .pro-badge { margin-left: auto; font-size: 9px; font-weight: 600; color: var(--gold); background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25); border-radius: 4px; padding: 1px 5px; letter-spacing: 0.06em; }
  .plan-card { margin: auto 12px 0; padding: 14px; background: linear-gradient(135deg, #14110A, #1C1710); border: 1px solid rgba(201,168,76,0.3); border-radius: 10px; margin-bottom: 12px; }
  .plan-name { font-size: 12px; font-weight: 600; color: var(--gold); display: flex; align-items: center; gap: 5px; margin-bottom: 2px; }
  .plan-sub { font-size: 11px; color: var(--muted); margin-bottom: 8px; }
  .plan-bar-bg { height: 3px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
  .plan-bar { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold-light)); border-radius: 2px; width: 34%; }
  .plan-usage { font-size: 10px; color: var(--muted); margin-top: 4px; }

  /* MAIN */
  .main { flex: 1; overflow-y: auto; background: var(--bg); }

  /* CHAT */
  .chat-wrap { display: flex; flex-direction: column; height: 100%; position: relative; }
  .chat-hero { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px 120px; text-align: center; }
  .chat-emblem { width: 88px; height: 88px; border-radius: 50%; background: radial-gradient(circle at 40% 35%, #1E1A08, #0A0A0F); border: 1px solid rgba(201,168,76,0.35); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 0 40px rgba(201,168,76,0.06); }
  .chat-title { font-family: var(--font-display); font-size: 36px; font-weight: 500; line-height: 1.2; margin-bottom: 10px; }
  .chat-title span { color: var(--gold); }
  .chat-subtitle { font-size: 13px; color: var(--muted); letter-spacing: 0.03em; margin-bottom: 36px; }
  .chat-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 640px; width: 100%; }
  .chat-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; text-align: left; cursor: pointer; transition: all 0.2s; }
  .chat-card:hover { border-color: rgba(201,168,76,0.4); background: rgba(201,168,76,0.03); }
  .chat-card-tag { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
  .chat-card p { font-size: 13px; color: var(--text); line-height: 1.4; }
  .chat-input-bar { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 24px 20px; background: linear-gradient(to top, var(--bg) 70%, transparent); }
  .chat-input { display: flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 10px 14px; transition: border-color 0.2s; }
  .chat-input:focus-within { border-color: rgba(201,168,76,0.5); }
  .chat-input input { flex: 1; background: none; border: none; outline: none; color: var(--text); font-family: var(--font-sans); font-size: 14px; }
  .chat-input input::placeholder { color: var(--muted2); }
  .chat-input-actions { display: flex; align-items: center; gap: 6px; }
  .input-icon-btn { width: 28px; height: 28px; border-radius: 6px; border: none; background: none; color: var(--muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: color 0.2s; }
  .input-icon-btn:hover { color: var(--text); }
  .send-btn { width: 32px; height: 32px; border-radius: 8px; border: none; background: var(--gold); color: #0A0A0F; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
  .send-btn:hover { background: var(--gold-light); }

  /* PAGE HEADER */
  .page-header { padding: 28px 28px 24px; border-bottom: 1px solid var(--border); }
  .page-title { font-family: var(--font-display); font-size: 28px; font-weight: 500; color: var(--text); margin-bottom: 3px; }
  .page-sub { font-size: 13px; color: var(--muted); }
  .page-body { padding: 24px 28px; }

  /* DASHBOARD */
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
  .kpi-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; position: relative; overflow: hidden; }
  .kpi-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .kpi-gold::before { background: linear-gradient(90deg, var(--gold), var(--gold-light)); }
  .kpi-blue::before { background: linear-gradient(90deg, #4A90E2, #7AB3F0); }
  .kpi-green::before { background: linear-gradient(90deg, #4CAF82, #7DCFA5); }
  .kpi-amber::before { background: linear-gradient(90deg, #E0993A, #F0BC6A); }
  .kpi-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
  .kpi-value { font-family: var(--font-display); font-size: 32px; font-weight: 500; line-height: 1; margin-bottom: 4px; }
  .kpi-label { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
  .kpi-delta { display: flex; align-items: center; gap: 4px; font-size: 11px; }
  .delta-up { color: var(--green); }
  .delta-down { color: var(--red); }
  .two-col { display: grid; grid-template-columns: 1fr 1.2fr; gap: 14px; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; }
  .card-header { padding: 18px 20px 0; font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
  .card-body { padding: 0 20px 20px; }
  .score-wrap { display: flex; align-items: center; gap: 20px; }
  .donut { position: relative; width: 90px; height: 90px; flex-shrink: 0; }
  .donut svg { width: 90px; height: 90px; transform: rotate(-90deg); }
  .donut-label { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 22px; font-weight: 500; }
  .score-rows { flex: 1; display: flex; flex-direction: column; gap: 10px; }
  .score-row { display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
  .score-row-label { color: var(--text); }
  .status-pill { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 20px; }
  .status-current { background: rgba(76,175,130,0.1); color: var(--green); }
  .status-pending { background: rgba(224,153,58,0.1); color: var(--amber); }
  .status-missing { background: rgba(224,85,85,0.1); color: var(--red); }
  .status-active { background: rgba(76,175,130,0.1); color: var(--green); }
  .deadline-list { display: flex; flex-direction: column; gap: 2px; }
  .deadline-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; transition: background 0.15s; cursor: pointer; }
  .deadline-item:hover { background: var(--card2); }
  .deadline-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .deadline-name { font-size: 13px; flex: 1; }
  .deadline-date { font-size: 12px; color: var(--muted); font-family: var(--font-mono); }

  /* DOCUMENTS */
  .upload-zone { border: 1.5px dashed var(--border); border-radius: 12px; padding: 48px 24px; text-align: center; margin-bottom: 28px; cursor: pointer; transition: all 0.2s; }
  .upload-zone:hover { border-color: rgba(201,168,76,0.4); background: rgba(201,168,76,0.02); }
  .upload-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--card2); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
  .upload-title { font-size: 15px; font-weight: 500; margin-bottom: 4px; }
  .upload-sub { font-size: 13px; color: var(--muted); }
  .section-label { font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .saved-count { background: var(--card2); border-radius: 4px; padding: 1px 6px; font-size: 11px; }
  .templates-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .template-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 18px; cursor: pointer; transition: all 0.2s; position: relative; }
  .template-card:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-1px); }
  .template-icon { width: 36px; height: 36px; border-radius: 8px; background: var(--card2); display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
  .template-title { font-size: 13px; font-weight: 500; margin-bottom: 4px; }
  .template-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }
  .pro-tag { position: absolute; top: 12px; right: 12px; font-size: 9px; font-weight: 600; color: var(--gold); background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.2); border-radius: 4px; padding: 1px 5px; }

  /* ANALYTICS */
  .chart-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 14px; }
  .bar-rows { display: flex; flex-direction: column; gap: 10px; }
  .bar-row { display: flex; align-items: center; gap: 12px; }
  .bar-label { font-size: 13px; width: 180px; flex-shrink: 0; }
  .bar-track { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
  .bar-fill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold-light)); border-radius: 3px; }
  .bar-val { font-size: 12px; color: var(--muted); font-family: var(--font-mono); width: 32px; text-align: right; }
  .activity-rows { display: flex; flex-direction: column; gap: 8px; }
  .activity-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .activity-row:last-child { border-bottom: none; }
  .activity-label { font-size: 13px; flex: 1; }
  .activity-bar-track { width: 120px; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
  .activity-val { font-size: 13px; font-family: var(--font-mono); color: var(--muted); width: 20px; text-align: right; }

  /* SETTINGS */
  .settings-banner { background: linear-gradient(135deg, #14110A, #1C1710); border: 1px solid rgba(201,168,76,0.3); border-radius: 12px; padding: 18px 20px; display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
  .banner-icon { width: 42px; height: 42px; border-radius: 10px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .banner-title { font-size: 14px; font-weight: 500; color: var(--gold); margin-bottom: 2px; }
  .banner-sub { font-size: 12px; color: var(--muted); }
  .manage-btn { margin-left: auto; padding: 7px 16px; background: rgba(201,168,76,0.12); border: 1px solid rgba(201,168,76,0.4); border-radius: 8px; color: var(--gold); font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
  .manage-btn:hover { background: rgba(201,168,76,0.2); }
  .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .settings-section { background: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .settings-section-header { padding: 14px 18px; font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 7px; }
  .settings-row { display: flex; align-items: center; gap: 12px; padding: 13px 18px; border-bottom: 1px solid rgba(255,255,255,0.03); }
  .settings-row:last-child { border-bottom: none; }
  .settings-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--card2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .settings-info { flex: 1; }
  .settings-label { font-size: 13px; font-weight: 500; }
  .settings-desc { font-size: 11px; color: var(--muted); }
  .toggle { width: 36px; height: 20px; border-radius: 10px; position: relative; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
  .toggle.on { background: var(--gold); }
  .toggle.off { background: var(--muted2); }
  .toggle-thumb { position: absolute; top: 3px; width: 14px; height: 14px; border-radius: 50%; background: white; transition: left 0.2s; }
  .toggle.on .toggle-thumb { left: 19px; }
  .toggle.off .toggle-thumb { left: 3px; }
  .settings-select { background: var(--card2); border: 1px solid var(--border); border-radius: 7px; padding: 5px 28px 5px 10px; font-size: 13px; color: var(--text); font-family: var(--font-sans); cursor: pointer; appearance: none; -webkit-appearance: none; outline: none; }
  .settings-input { background: var(--card2); border: 1px solid var(--border); border-radius: 7px; padding: 6px 10px; font-size: 12px; color: var(--text); font-family: var(--font-mono); outline: none; width: 160px; }
  .setup-btn { padding: 5px 12px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); border-radius: 6px; color: var(--gold); font-size: 12px; cursor: pointer; }

  /* CALENDAR */
  .cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .cal-month { font-family: var(--font-display); font-size: 22px; font-weight: 500; }
  .cal-nav-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-size: 13px; cursor: pointer; transition: all 0.2s; }
  .cal-nav-btn:hover { border-color: rgba(201,168,76,0.4); }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--border); border-radius: 10px; overflow: hidden; }
  .cal-day-header { background: var(--card); padding: 10px; text-align: center; font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  .cal-cell { background: var(--card); min-height: 80px; padding: 8px; position: relative; }
  .cal-cell.other-month { background: rgba(13,13,20,0.5); }
  .cal-cell.today { background: rgba(201,168,76,0.04); }
  .cal-date { font-size: 12px; color: var(--muted); margin-bottom: 4px; }
  .cal-cell.today .cal-date { color: var(--gold); font-weight: 500; }
  .cal-event { font-size: 10px; padding: 2px 5px; border-radius: 4px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cal-event.urgent { background: rgba(224,85,85,0.2); color: var(--red); }
  .cal-event.soon { background: rgba(224,153,58,0.2); color: var(--amber); }
  .cal-event.ok { background: rgba(76,175,130,0.15); color: var(--green); }

  /* ALERTS */
  .alert-section { background: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 14px; }
  .alert-section-header { padding: 14px 18px; font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--border); }
  .alert-item { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-bottom: 1px solid rgba(255,255,255,0.03); }
  .alert-item:last-child { border-bottom: none; }
  .alert-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .alert-icon.urgent { background: rgba(224,85,85,0.1); }
  .alert-icon.soon { background: rgba(224,153,58,0.1); }
  .alert-icon.info { background: rgba(74,144,226,0.1); }
  .alert-title { font-size: 14px; font-weight: 500; margin-bottom: 2px; }
  .alert-title.urgent { color: var(--red); }
  .alert-title.soon { color: var(--amber); }
  .alert-sub { font-size: 12px; color: var(--muted); }
  .alert-badge { margin-left: auto; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; flex-shrink: 0; }
  .badge-urgent { background: rgba(224,85,85,0.15); color: var(--red); border: 1px solid rgba(224,85,85,0.3); }
  .badge-soon { background: rgba(224,153,58,0.15); color: var(--amber); border: 1px solid rgba(224,153,58,0.3); }
  .badge-action { background: var(--card2); color: var(--muted); border: 1px solid var(--border); cursor: pointer; }
  .add-alert-btn { display: flex; align-items: center; gap: 7px; padding: 14px 18px; font-size: 13px; color: var(--gold); cursor: pointer; transition: background 0.15s; }
  .add-alert-btn:hover { background: rgba(201,168,76,0.04); }

  /* SUPPORT */
  .support-banner { background: linear-gradient(135deg, #0F130C, #141C10); border: 1px solid rgba(76,175,130,0.25); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .support-banner-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(76,175,130,0.1); border: 1px solid rgba(76,175,130,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .support-status-title { font-size: 15px; font-weight: 500; color: #7DCFA5; margin-bottom: 3px; }
  .support-status-sub { font-size: 12px; color: var(--muted); }
  .contact-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
  .contact-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 18px 16px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
  .contact-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .contact-card:nth-child(1)::before { background: linear-gradient(90deg, var(--gold), var(--gold-light)); }
  .contact-card:nth-child(2)::before { background: linear-gradient(90deg, #4CAF82, #7DCFA5); }
  .contact-card:nth-child(3)::before { background: linear-gradient(90deg, #4A90E2, #7AB3F0); }
  .contact-card:nth-child(4)::before { background: linear-gradient(90deg, #9B59B6, #C39BD3); }
  .contact-card:hover { border-color: rgba(201,168,76,0.35); }
  .contact-card-icon { margin-bottom: 10px; }
  .contact-card-title { font-size: 13px; font-weight: 500; margin-bottom: 3px; }
  .contact-card-sub { font-size: 11px; color: var(--muted); font-family: var(--font-mono); }
  .ticket-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .ticket-header { padding: 14px 18px; font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 7px; }
  .ticket-body { padding: 18px; display: flex; flex-direction: column; gap: 12px; }
  .form-select, .form-input, .form-textarea { width: 100%; background: var(--card2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; font-size: 13px; color: var(--text); font-family: var(--font-sans); outline: none; transition: border-color 0.2s; }
  .form-select:focus, .form-input:focus, .form-textarea:focus { border-color: rgba(201,168,76,0.5); }
  .form-textarea { min-height: 100px; resize: vertical; }
  .form-select option { background: var(--card); }
  .submit-btn { display: flex; align-items: center; gap: 7px; padding: 10px 22px; background: var(--gold); color: #0A0A0F; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; font-family: var(--font-sans); }
  .submit-btn:hover { background: var(--gold-light); }

  /* MISC */
  .premium-badge-sm { display: inline-flex; align-items: center; gap: 3px; font-size: 9px; font-weight: 500; color: var(--gold); background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.2); border-radius: 4px; padding: 1px 5px; margin-left: 6px; }
  .new-badge { display: inline-flex; align-items: center; font-size: 9px; font-weight: 600; color: var(--green); background: rgba(76,175,130,0.1); border: 1px solid rgba(76,175,130,0.2); border-radius: 4px; padding: 1px 5px; margin-left: 6px; }
`;

const TABS = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "support", label: "Support", icon: Headphones },
];

const SIDEBAR_NAV = [
  { id: "chat", label: "AI Legal Chat", icon: MessageSquare },
  { id: "dashboard", label: "Compliance Dashboard", icon: LayoutDashboard, pro: true },
  { id: "documents", label: "Document Studio", icon: FileText, pro: true },
  { id: "analytics", label: "Analytics", icon: BarChart3, pro: true },
];
const SIDEBAR_TOOLS = [
  { id: "calendar", label: "Compliance Calendar", icon: Calendar, pro: true },
  { id: "alerts", label: "Smart Alerts", icon: Bell, pro: true },
  { id: "support", label: "Priority Support", icon: Headphones, pro: true },
];

function Toggle({ on, onToggle }) {
  return (
    <div className={`toggle ${on ? "on" : "off"}`} onClick={onToggle}>
      <div className="toggle-thumb" />
    </div>
  );
}

function ChatTab() {
  const cards = [
    { tag: "GST", icon: <FileCheck size={14} />, q: "What is the GST registration threshold for businesses?" },
    { tag: "Companies Act", icon: <Building2 size={14} />, q: "What are director responsibilities under Companies Act 2013?" },
    { tag: "IT Act", icon: <Shield size={14} />, q: "What are data protection obligations for businesses under IT Act?" },
    { tag: "SEBI", icon: <Activity size={14} />, q: "What are insider trading regulations under SEBI?" },
  ];
  return (
    <div className="chat-wrap">
      <div className="chat-hero">
        <div className="chat-emblem">
          <Scale size={32} color={GOLD} />
        </div>
        <h1 className="chat-title">
          Ask <span>NitiBot</span> anything about<br />Indian legal compliance
        </h1>
        <p className="chat-subtitle">Powered by GST Act · Companies Act · IT Act · SEBI · RBI</p>
        <div className="chat-cards">
          {cards.map((c, i) => (
            <div key={i} className="chat-card">
              <div className="chat-card-tag">
                {c.icon} {c.tag}
              </div>
              <p>{c.q}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-input-bar">
        <div className="chat-input">
          <input placeholder="Ask about GST, Companies Act, SEBI, RBI, MSME…" />
          <div className="chat-input-actions">
            <button className="input-icon-btn"><Keyboard size={15} /></button>
            <button className="input-icon-btn"><Paperclip size={15} /></button>
            <button className="input-icon-btn"><Mic size={15} /></button>
            <button className="send-btn"><Send size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardTab() {
  const kpis = [
    { cls: "kpi-gold", icon: <Scale size={18} color={GOLD} />, iconBg: "rgba(201,168,76,0.1)", val: "78%", label: "Overall Compliance Score", delta: "+4% from last month", up: true },
    { cls: "kpi-blue", icon: <MessageSquare size={18} color="#4A90E2" />, iconBg: "rgba(74,144,226,0.1)", val: "34", label: "Queries This Month", delta: "+12 more than last month", up: true },
    { cls: "kpi-green", icon: <CheckCircle size={18} color="#4CAF82" />, iconBg: "rgba(76,175,130,0.1)", val: "9", label: "Filings Completed", delta: "On track", up: true },
    { cls: "kpi-amber", icon: <AlertTriangle size={18} color="#E0993A" />, iconBg: "rgba(224,153,58,0.1)", val: "3", label: "Pending Actions", delta: "2 overdue", up: false },
  ];
  const scores = [
    { label: "GST Filings", status: "Current", cls: "status-current", icon: <CheckCircle size={12} /> },
    { label: "MCA / ROC", status: "1 Pending", cls: "status-pending", icon: <AlertTriangle size={12} /> },
    { label: "TDS Returns", status: "Current", cls: "status-current", icon: <CheckCircle size={12} /> },
    { label: "MSME Registration", status: "Missing", cls: "status-missing", icon: <XCircle size={12} /> },
    { label: "DPIIT Recognition", status: "Active", cls: "status-active", icon: <CheckCircle size={12} /> },
  ];
  const deadlines = [
    { name: "GSTR-3B Filing", date: "20 May 2026", color: "var(--red)" },
    { name: "TDS Return Q4", date: "31 May 2026", color: "var(--red)" },
    { name: "AOC-4 (Annual Accounts)", date: "30 Oct 2026", color: "var(--amber)" },
    { name: "MGT-7 (Annual Return)", date: "30 Nov 2026", color: "var(--amber)" },
    { name: "DPIIT Renewal", date: "Jan 2027", color: "var(--green)" },
  ];

  const r = 35; const circ = 2 * Math.PI * r;
  const offset = circ * (1 - 0.78);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Compliance Dashboard</h1>
        <p className="page-sub">Real-time overview of your company's legal compliance status — Acme Corp</p>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          {kpis.map((k, i) => (
            <div key={i} className={`kpi-card ${k.cls}`}>
              <div className="kpi-icon" style={{ background: k.iconBg }}>{k.icon}</div>
              <div className="kpi-value">{k.val}</div>
              <div className="kpi-label">{k.label}</div>
              <div className={`kpi-delta ${k.up ? "delta-up" : "delta-down"}`}>
                {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {k.delta}
              </div>
            </div>
          ))}
        </div>
        <div className="two-col">
          <div className="card">
            <div className="card-header">Compliance Score Breakdown</div>
            <div className="card-body">
              <div className="score-wrap">
                <div className="donut">
                  <svg viewBox="0 0 90 90">
                    <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle cx="45" cy="45" r={r} fill="none" stroke={GOLD} strokeWidth="8"
                      strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
                  </svg>
                  <div className="donut-label">78%</div>
                </div>
                <div className="score-rows">
                  {scores.map((s, i) => (
                    <div key={i} className="score-row">
                      <span className="score-row-label">{s.label}</span>
                      <span className={`status-pill ${s.cls}`}>{s.icon} {s.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">Upcoming Deadlines</div>
            <div className="card-body" style={{ paddingTop: 0 }}>
              <div className="deadline-list">
                {deadlines.map((d, i) => (
                  <div key={i} className="deadline-item">
                    <div className="deadline-dot" style={{ background: d.color }} />
                    <span className="deadline-name">{d.name}</span>
                    <span className="deadline-date">{d.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentsTab() {
  const templates = [
    { icon: <FileText size={18} color={GOLD} />, title: "Memorandum of Association", desc: "Auto-filled MOA template for private limited companies" },
    { icon: <Users size={18} color="#4A90E2" />, title: "Shareholder Agreement", desc: "Customisable SHA with vesting, drag-along, and tag-along clauses" },
    { icon: <Briefcase size={18} color="#9B59B6" />, title: "Founder Agreement", desc: "IP assignment, roles, equity split, and exit provisions" },
    { icon: <Lock size={18} color="#E0993A" />, title: "NDA / Confidentiality", desc: "Mutual and one-way NDA templates compliant with Indian Contract Act" },
    { icon: <Users size={18} color="#4CAF82" />, title: "Employment Agreement", desc: "Offer letter + employment contract with IP and non-compete clauses" },
    { icon: <BarChart3 size={18} color="#E05555" />, title: "ESOP Policy", desc: "Employee stock option plan compliant with Companies Act 2013" },
    { icon: <Shield size={18} color="#4A90E2" />, title: "Privacy Policy", desc: "DPDP Act 2023 compliant privacy policy for your website/app" },
    { icon: <FileCheck size={18} color={GOLD} />, title: "GST Invoice Template", desc: "GSTIN-compliant tax invoice with HSN/SAC codes" },
  ];
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Document Studio</h1>
        <p className="page-sub">Generate, analyse, and manage legal documents — powered by NitiBot AI</p>
      </div>
      <div className="page-body">
        <div className="upload-zone">
          <div className="upload-icon">
            <FileText size={22} color={GOLD} />
          </div>
          <div className="upload-title">Upload a Document for AI Analysis</div>
          <div className="upload-sub">Drop a PDF, TXT, or Word document — NitiBot will review it against Indian law</div>
        </div>
        <div className="section-label">
          <FileText size={13} color={MUTED} /> Saved Responses <span className="saved-count">0</span>
        </div>
        <div className="section-label" style={{ marginTop: 20 }}>Legal Document Templates</div>
        <div className="templates-grid">
          {templates.map((t, i) => (
            <div key={i} className="template-card">
              <span className="pro-tag">PRO</span>
              <div className="template-icon">{t.icon}</div>
              <div className="template-title">{t.title}</div>
              <div className="template-desc">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const topics = [
    { label: "GST & Indirect Tax", val: 72 },
    { label: "Companies Act / MCA", val: 55 },
    { label: "SEBI & Capital Markets", val: 41 },
    { label: "Employment & Labour Law", val: 34 },
    { label: "IT Act & Data Privacy", val: 29 },
    { label: "MSME & Startup Policy", val: 22 },
  ];
  const activity = [
    { label: "Documents Generated", val: 11, pct: 55 },
    { label: "Filings Completed", val: 9, pct: 45 },
    { label: "Alerts Triggered", val: 4, pct: 20 },
    { label: "Issues Resolved", val: 7, pct: 35 },
  ];
  const weeks = [4, 7, 5, 9, 6, 11, 8, 12];
  const maxW = Math.max(...weeks);
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Usage Analytics</h1>
        <p className="page-sub">Insights into your legal queries and compliance activity</p>
      </div>
      <div className="page-body">
        <div className="chart-card">
          <div className="card-header">Queries Per Week (Last 8 Weeks)</div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120, paddingBottom: 8 }}>
              {weeks.map((w, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", background: `linear-gradient(to top, ${GOLD}, ${GOLD_LIGHT})`, borderRadius: "4px 4px 0 0", height: `${(w / maxW) * 90}px`, opacity: 0.7 + (i / weeks.length) * 0.3 }} />
                  <span style={{ fontSize: 10, color: MUTED }}>W{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="chart-card">
          <div className="card-header">Top Query Topics</div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            <div className="bar-rows">
              {topics.map((t, i) => (
                <div key={i} className="bar-row">
                  <span className="bar-label">{t.label}</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${t.val}%` }} /></div>
                  <span className="bar-val">{t.val}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="chart-card">
          <div className="card-header">Monthly Compliance Activity Summary</div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            <div className="activity-rows">
              {activity.map((a, i) => (
                <div key={i} className="activity-row">
                  <span className="activity-label">{a.label}</span>
                  <div className="activity-bar-track"><div className="bar-fill" style={{ width: `${a.pct}%` }} /></div>
                  <span className="activity-val">{a.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  const [toggles, setToggles] = useState({
    citations: true, memory: true, voice: true, autofill: true,
    deadlineAlerts: true, weeklyDigest: false, regAlerts: true, calSync: false, whatsapp: false,
    twofa: false,
  });
  const toggle = (k) => setToggles(p => ({ ...p, [k]: !p[k] }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-sub">Manage your account, preferences, and integrations</p>
      </div>
      <div className="page-body">
        <div style={{ maxWidth: 900 }}>
          <div className="settings-banner">
            <div className="banner-icon"><Crown size={20} color={GOLD} /></div>
            <div>
              <div className="banner-title">NitiBot Premium — Active</div>
              <div className="banner-sub">Unlimited AI queries · 8 document templates · Priority support · Analytics · Renews Jun 2026 · ₹299/month</div>
            </div>
            <button className="manage-btn">Manage Plan</button>
          </div>

          <div className="settings-grid">
            <div className="settings-section">
              <div className="settings-section-header"><User size={13} /> Profile &amp; Company</div>
              <div className="settings-row">
                <div className="settings-icon"><Crown size={15} color={GOLD} /></div>
                <div className="settings-info"><div className="settings-label">Company Onboarding</div><div className="settings-desc">Complete your profile for personalised guidance</div></div>
                <button className="setup-btn">Setup</button>
              </div>
              <div className="settings-row">
                <div className="settings-icon"><Building2 size={15} color={MUTED} /></div>
                <div className="settings-info"><div className="settings-label">Company Name</div><div className="settings-desc">Acme Corp Pvt. Ltd.</div></div>
                <button className="setup-btn" style={{ background: "none", border: "1px solid var(--border)", color: "var(--muted)" }}>Edit</button>
              </div>
              <div className="settings-row">
                <div className="settings-icon"><Mail size={15} color={MUTED} /></div>
                <div className="settings-info"><div className="settings-label">Email Address</div><div className="settings-desc">admin@acmecorp.in</div></div>
                <input className="settings-input" defaultValue="admin@acmecorp.in" style={{ width: 160 }} />
              </div>
              <div className="settings-row">
                <div className="settings-icon"><MapPin size={15} color={MUTED} /></div>
                <div className="settings-info"><div className="settings-label">Business Jurisdiction</div><div className="settings-desc">Primary state of incorporation</div></div>
                <select className="settings-select"><option>Maharashtra</option><option>Karnataka</option><option>Delhi</option></select>
              </div>
              <div className="settings-row">
                <div className="settings-icon"><Briefcase size={15} color={MUTED} /></div>
                <div className="settings-info"><div className="settings-label">Business Type</div><div className="settings-desc">Legal entity classification</div></div>
                <select className="settings-select"><option>Pvt. Ltd.</option><option>LLP</option><option>Startup</option></select>
              </div>
            </div>

            <div className="settings-section">
              <div className="settings-section-header"><Zap size={13} /> AI Preferences</div>
              {[
                { key: "citations", icon: <BookOpen size={15} color={MUTED} />, label: "Source Citations", desc: "Show legal act sections alongside responses", badge: "premium" },
                { key: "memory", icon: <Activity size={15} color={MUTED} />, label: "Conversation Memory", desc: "Retain context across your sessions (last 6 turns)", badge: "premium" },
              ].map(r => (
                <div key={r.key} className="settings-row">
                  <div className="settings-icon">{r.icon}</div>
                  <div className="settings-info">
                    <div className="settings-label">{r.label}{r.badge === "premium" && <span className="premium-badge-sm"><Crown size={8} /> PREMIUM</span>}</div>
                    <div className="settings-desc">{r.desc}</div>
                  </div>
                  <Toggle on={toggles[r.key]} onToggle={() => toggle(r.key)} />
                </div>
              ))}
              <div className="settings-row">
                <div className="settings-icon"><BarChart3 size={15} color={MUTED} /></div>
                <div className="settings-info"><div className="settings-label">Response Detail Level</div><div className="settings-desc">How comprehensive should AI answers be?</div></div>
                <select className="settings-select"><option>Detailed</option><option>Standard</option><option>Concise</option></select>
              </div>
              <div className="settings-row">
                <div className="settings-icon"><Globe size={15} color={MUTED} /></div>
                <div className="settings-info"><div className="settings-label">Response Language</div><div className="settings-desc">Language for AI responses</div></div>
                <select className="settings-select"><option>English</option><option>Hindi</option><option>Marathi</option></select>
              </div>
              {[
                { key: "voice", icon: <Mic size={15} color={MUTED} />, label: "Voice Input", desc: "Enable microphone for voice queries", badge: "new" },
                { key: "autofill", icon: <FileCheck size={15} color={MUTED} />, label: "Auto-fill Documents", desc: "Use company profile to pre-fill legal templates" },
              ].map(r => (
                <div key={r.key} className="settings-row">
                  <div className="settings-icon">{r.icon}</div>
                  <div className="settings-info">
                    <div className="settings-label">{r.label}{r.badge === "new" && <span className="new-badge">NEW</span>}</div>
                    <div className="settings-desc">{r.desc}</div>
                  </div>
                  <Toggle on={toggles[r.key]} onToggle={() => toggle(r.key)} />
                </div>
              ))}
            </div>

            <div className="settings-section">
              <div className="settings-section-header"><Bell size={13} /> Notifications &amp; Alerts</div>
              {[
                { key: "deadlineAlerts", icon: <Bell size={15} color={MUTED} />, label: "Compliance Deadline Alerts", desc: "Reminders 7 days before key filing dates" },
                { key: "weeklyDigest", icon: <Mail size={15} color={MUTED} />, label: "Weekly Digest Email", desc: "Compliance summary every Monday" },
                { key: "regAlerts", icon: <FileText size={15} color={MUTED} />, label: "Regulatory Update Alerts", desc: "Notified when GST / MCA / SEBI rules change" },
                { key: "calSync", icon: <Calendar size={15} color={MUTED} />, label: <>Calendar Sync <span className="new-badge">NEW</span></>, desc: "Push deadlines to Google / Outlook Calendar" },
                { key: "whatsapp", icon: <Phone size={15} color={MUTED} />, label: <>WhatsApp Alerts <span className="premium-badge-sm"><Crown size={8} /> PREMIUM</span></>, desc: "Get urgent compliance alerts on WhatsApp" },
              ].map(r => (
                <div key={r.key} className="settings-row">
                  <div className="settings-icon">{r.icon}</div>
                  <div className="settings-info"><div className="settings-label">{r.label}</div><div className="settings-desc">{r.desc}</div></div>
                  <Toggle on={toggles[r.key]} onToggle={() => toggle(r.key)} />
                </div>
              ))}
            </div>

            <div className="settings-section">
              <div className="settings-section-header"><Lock size={13} /> Security &amp; Access</div>
              <div className="settings-row">
                <div className="settings-icon"><Lock size={15} color={MUTED} /></div>
                <div className="settings-info"><div className="settings-label">Two-Factor Authentication</div><div className="settings-desc">Extra layer of security (TOTP-based)</div></div>
                <Toggle on={toggles.twofa} onToggle={() => toggle("twofa")} />
              </div>
              <div className="settings-row">
                <div className="settings-icon"><Key size={15} color={MUTED} /></div>
                <div className="settings-info"><div className="settings-label">API Access Key</div><div className="settings-desc" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>nb_live_••••••••••4f2a</div></div>
                <button className="setup-btn" style={{ background: "none", border: "1px solid var(--border)", color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}><Copy size={11} /> Copy</button>
              </div>
              <div className="settings-row">
                <div className="settings-icon"><RefreshCw size={15} color={MUTED} /></div>
                <div className="settings-info"><div className="settings-label">Regenerate API Key</div><div className="settings-desc">Invalidates the current key immediately</div></div>
                <button className="setup-btn">Regenerate</button>
              </div>
              <div className="settings-row">
                <div className="settings-icon"><Clock size={15} color={MUTED} /></div>
                <div className="settings-info"><div className="settings-label">Session Timeout</div><div className="settings-desc">Auto-logout after inactivity</div></div>
                <select className="settings-select"><option>30 minutes</option><option>1 hour</option><option>4 hours</option></select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarTab() {
  const [month, setMonth] = useState(4); // 0-indexed, 4 = May
  const [year, setYear] = useState(2026);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const events = {
    "2026-5-20": [{ label: "GSTR-3B", cls: "urgent" }],
    "2026-5-31": [{ label: "TDS Q4", cls: "urgent" }],
    "2026-5-15": [{ label: "Today", cls: "ok" }],
  };
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, other: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, other: false, today: d === 15 && month === 4 });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, other: true });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Compliance Calendar</h1>
        <p className="page-sub">Track all upcoming statutory deadlines — GST, MCA, TDS, SEBI and more</p>
      </div>
      <div className="page-body">
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={() => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); }}>
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="cal-month">{months[month]} {year}</span>
          <button className="cal-nav-btn" onClick={() => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); }}>
            Next <ChevronRight size={14} />
          </button>
        </div>
        <div className="cal-grid">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="cal-day-header">{d}</div>
          ))}
          {cells.map((c, i) => {
            const key = `${year}-${month + 1}-${c.day}`;
            const evts = events[key] || [];
            return (
              <div key={i} className={`cal-cell${c.other ? " other-month" : ""}${c.today ? " today" : ""}`}>
                <div className="cal-date">{c.day}</div>
                {evts.map((e, j) => <div key={j} className={`cal-event ${e.cls}`}>{e.label}</div>)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AlertsTab() {
  const [toggles, setToggles] = useState({ deadline: true, regChange: true, digest: false, whatsapp: false });
  const toggle = (k) => setToggles(p => ({ ...p, [k]: !p[k] }));
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Smart Alerts</h1>
        <p className="page-sub">Configure compliance deadline reminders and regulatory change notifications</p>
      </div>
      <div className="page-body" style={{ maxWidth: 760 }}>
        <div className="alert-section">
          <div className="alert-section-header">Active Notifications (3)</div>
          <div className="alert-item">
            <div className="alert-icon urgent"><AlertTriangle size={18} color="var(--red)" /></div>
            <div>
              <div className="alert-title urgent">GSTR-3B Due in 14 Days</div>
              <div className="alert-sub">Monthly GST return — Due: 20 May 2026</div>
            </div>
            <span className="alert-badge badge-urgent">Urgent</span>
          </div>
          <div className="alert-item">
            <div className="alert-icon soon"><Clock size={18} color="var(--amber)" /></div>
            <div>
              <div className="alert-title soon">TDS Return Q4 Due in 25 Days</div>
              <div className="alert-sub">TDS return filing — Due: 31 May 2026</div>
            </div>
            <span className="alert-badge badge-soon">Due Soon</span>
          </div>
          <div className="alert-item">
            <div className="alert-icon info"><FileText size={18} color="var(--blue)" /></div>
            <div>
              <div className="alert-title" style={{ fontSize: 14, fontWeight: 500 }}>MSME Registration Missing</div>
              <div className="alert-sub">Your compliance score is affected — Register on Udyam Portal</div>
            </div>
            <span className="alert-badge badge-action">Ask NitiBot</span>
          </div>
        </div>

        <div className="alert-section">
          <div className="alert-section-header">Alert Configuration</div>
          {[
            { key: "deadline", icon: <Bell size={16} color={MUTED} />, label: "Deadline Reminders", desc: "Notify 7 days before filing dates" },
            { key: "regChange", icon: <FileText size={16} color={MUTED} />, label: "Regulatory Change Alerts", desc: "GST, MCA, SEBI rule updates" },
            { key: "digest", icon: <Mail size={16} color={MUTED} />, label: "Weekly Digest Email", desc: "Monday morning compliance summary" },
            { key: "whatsapp", icon: <Phone size={16} color={MUTED} />, label: "WhatsApp Alerts", desc: "Get critical deadlines on WhatsApp (Premium)" },
          ].map(r => (
            <div key={r.key} className="alert-item">
              <div className="alert-icon info" style={{ background: "var(--card2)" }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{r.label}</div>
                <div style={{ fontSize: 12, color: MUTED }}>{r.desc}</div>
              </div>
              <Toggle on={toggles[r.key]} onToggle={() => toggle(r.key)} />
            </div>
          ))}
          <div className="add-alert-btn">
            <Plus size={15} /> Add Custom Alert
          </div>
        </div>
      </div>
    </div>
  );
}

function SupportTab() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Priority Support</h1>
        <p className="page-sub">Premium members get priority access to our legal compliance team</p>
      </div>
      <div className="page-body" style={{ maxWidth: 860 }}>
        <div className="support-banner">
          <div className="support-banner-icon"><Crown size={22} color="#4CAF82" /></div>
          <div>
            <div className="support-status-title">Premium Support Active</div>
            <div className="support-status-sub">Average response time: <strong style={{ color: "#7DCFA5" }}>2 hours</strong> · Available Mon–Sat 9AM–6PM IST</div>
          </div>
        </div>

        <div className="contact-grid">
          {[
            { icon: <Mail size={20} color={GOLD} />, title: "Email Support", sub: "premium@nitibot.in" },
            { icon: <Phone size={20} color="#4CAF82" />, title: "WhatsApp", sub: "+91-99999-00000" },
            { icon: <Calendar size={20} color="#4A90E2" />, title: "Schedule Call", sub: "Book a 30-min session" },
            { icon: <BookOpen size={20} color="#9B59B6" />, title: "Knowledge Base", sub: "docs.nitibot.in" },
          ].map((c, i) => (
            <div key={i} className="contact-card">
              <div className="contact-card-icon">{c.icon}</div>
              <div className="contact-card-title">{c.title}</div>
              <div className="contact-card-sub">{c.sub}</div>
            </div>
          ))}
        </div>

        <div className="ticket-card">
          <div className="ticket-header"><FileText size={13} /> Submit a Support Ticket</div>
          <div className="ticket-body">
            <select className="form-select">
              <option value="">Select category...</option>
              <option>GST / Indirect Tax</option>
              <option>Companies Act / MCA</option>
              <option>TDS / Direct Tax</option>
              <option>SEBI / Capital Markets</option>
              <option>Document Generation</option>
              <option>Billing / Account</option>
            </select>
            <input className="form-input" placeholder="Subject" />
            <textarea className="form-textarea" placeholder="Describe your issue in detail..." />
            <div>
              <button className="submit-btn">Submit Ticket <ChevronRight size={15} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TAB_COMPONENTS = {
  chat: ChatTab,
  dashboard: DashboardTab,
  documents: DocumentsTab,
  analytics: AnalyticsTab,
  settings: SettingsTab,
  calendar: CalendarTab,
  alerts: AlertsTab,
  support: SupportTab,
};

export default function NitiBot() {
  const [activeTab, setActiveTab] = useState("chat");
  const TabContent = TAB_COMPONENTS[activeTab];
  const isChat = activeTab === "chat";

  return (
    <>
      <style>{css}</style>
      <div className="layout">
        {/* TOP NAV */}
        <nav className="topnav">
          <div className="brand">
            <div className="brand-icon"><Scale size={16} color={GOLD} /></div>
            <span className="brand-name">NitiBot</span>
            <div className="premium-pill"><Crown size={10} /> Premium</div>
          </div>
          <div className="nav-tabs">
            {TABS.map(t => (
              <button key={t.id} className={`nav-tab${activeTab === t.id ? " active" : ""}`} onClick={() => setActiveTab(t.id)}>
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>
          <div className="nav-right">
            <span className="status-dot">Connected</span>
            <button className="icon-btn"><Bell size={15} /><span className="notif-badge">3</span></button>
            <button className="icon-btn"><Settings size={15} /></button>
            <div className="avatar">AC</div>
          </div>
        </nav>

        {/* BODY */}
        <div className="body">
          {/* SIDEBAR — only on chat */}
          {isChat && (
            <aside className="sidebar">
              <div className="sidebar-section">
                <div className="sidebar-label">Recent Chats</div>
                <div className="sidebar-item active">
                  <MessageSquare size={14} /> hii
                </div>
              </div>
              <div className="sidebar-section">
                <div className="sidebar-label">Navigation</div>
                {SIDEBAR_NAV.map(item => (
                  <div key={item.id} className={`sidebar-item${activeTab === item.id ? " active" : ""}`} onClick={() => setActiveTab(item.id)}>
                    <item.icon size={14} /> {item.label}
                    {item.pro && <span className="pro-badge">PRO</span>}
                  </div>
                ))}
              </div>
              <div className="sidebar-section">
                <div className="sidebar-label">Tools</div>
                {SIDEBAR_TOOLS.map(item => (
                  <div key={item.id} className={`sidebar-item${activeTab === item.id ? " active" : ""}`} onClick={() => setActiveTab(item.id)}>
                    <item.icon size={14} /> {item.label}
                    {item.pro && <span className="pro-badge">PRO</span>}
                  </div>
                ))}
              </div>
              <div className="sidebar-section">
                <div className="sidebar-label">Account</div>
                <div className="sidebar-item" onClick={() => setActiveTab("settings")}>
                  <Settings size={14} /> Settings
                </div>
              </div>
              <div className="plan-card">
                <div className="plan-name"><Crown size={12} /> Premium Plan</div>
                <div className="plan-sub">Acme Corp · Renews Jun 2026</div>
                <div className="plan-bar-bg"><div className="plan-bar" /></div>
                <div className="plan-usage">34 / 100 queries this month</div>
              </div>
            </aside>
          )}

          {/* MAIN CONTENT */}
          <main className="main">
            <TabContent />
          </main>
        </div>
      </div>
    </>
  );
}
