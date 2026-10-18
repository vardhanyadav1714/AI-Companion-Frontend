"use client";

import { Flag, X } from "lucide-react";
import { useRef, useState } from "react";
import { apiRequest } from "@/lib/api-client";

const reasons = [
  ["unsafe_content", "Unsafe or harmful"], ["sexual_content", "Sexual content"],
  ["minor_safety", "Child safety"], ["self_harm", "Self-harm"],
  ["hate_or_harassment", "Hate or harassment"], ["wrong_language", "Wrong language"],
  ["other", "Other"]
] as const;

export function ReportMessage({ messageId, companionId }: { messageId: string; companionId: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [reason, setReason] = useState<string>("unsafe_content");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("");
  const [sent, setSent] = useState(false);
  if (!/^[a-f\d]{24}$/i.test(messageId)) return null;

  async function submit() {
    if (busy.current || sent) return;
    busy.current = true; setPending(true); setStatus("");
    try {
      const result = await apiRequest<{ id: string }>("/reports", {
        method: "POST", body: JSON.stringify({ messageId, companionId, reason, details })
      });
      if (!result.success) throw new Error(result.error.message);
      setSent(true); setStatus("Report received. Thank you.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Could not send report. Please try again."); }
    finally { busy.current = false; setPending(false); }
  }

  return <>
    <button className="e-report-trigger" title="Report reply" aria-label="Report this reply" onClick={() => dialog.current?.showModal()}><Flag size={14} /></button>
    <dialog className="e-report-dialog" ref={dialog} aria-labelledby={`report-${messageId}`} onCancel={event => { if (pending) event.preventDefault(); }}>
      <header><h2 id={`report-${messageId}`}>Report reply</h2><button className="e-icon" aria-label="Close report" disabled={pending} onClick={() => dialog.current?.close()}><X size={20} /></button></header>
      {sent ? <p role="status">{status}</p> : <form onSubmit={event => { event.preventDefault(); void submit(); }}>
        <label>Reason<select value={reason} disabled={pending} onChange={event => setReason(event.target.value)}>{reasons.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>Details (optional)<textarea rows={3} maxLength={1000} value={details} disabled={pending} onChange={event => setDetails(event.target.value)} /></label>
        {status && <p role="alert">{status}</p>}
        <button className="e-button" type="submit" disabled={pending}>{pending ? "Sending..." : "Send report"}</button>
      </form>}
    </dialog>
  </>;
}
