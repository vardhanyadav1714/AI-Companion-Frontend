"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type GoogleIdentity = {
  initialize(options: { client_id: string; callback: (response: { credential?: string }) => void; auto_select: boolean }): void;
  renderButton(element: HTMLElement, options: { type: string; theme: string; size: string; text: string; shape: string; width: number }): void;
};

export function GoogleSignIn({ clientId, disabled, onCredential, onError }: {
  clientId: string; disabled: boolean; onCredential: (token: string) => void; onError: () => void;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onCredential, onError, disabled });
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => { callbacks.current = { onCredential, onError, disabled }; }, [onCredential, onError, disabled]);
  useEffect(() => {
    if (!ready || !mount.current) return;
    const identity = (window as Window & { google?: { accounts?: { id?: GoogleIdentity } } }).google?.accounts?.id;
    if (!identity) { setFailed(true); callbacks.current.onError(); return; }
    const element = mount.current;
    identity.initialize({ client_id: clientId, auto_select: false, callback: response => {
      if (callbacks.current.disabled) return;
      if (response.credential) callbacks.current.onCredential(response.credential);
      else callbacks.current.onError();
    } });
    let previousWidth = 0;
    const render = () => {
      const width = Math.min(400, Math.floor(element.clientWidth));
      if (width < 200 || width === previousWidth) return;
      previousWidth = width;
      element.replaceChildren();
      identity.renderButton(element, { type: "standard", theme: "outline", size: "large", text: "continue_with", shape: "rectangular", width });
    };
    render();
    const observer = new ResizeObserver(render);
    observer.observe(element);
    return () => { observer.disconnect(); element.replaceChildren(); };
  }, [ready, clientId]);
  return <>
    <Script id="eva-google-identity" src="https://accounts.google.com/gsi/client" strategy="afterInteractive"
      onReady={() => setReady(true)} onError={() => { setFailed(true); callbacks.current.onError(); }} />
    <div ref={mount} className="e-google-button" inert={disabled} aria-busy={!ready && !failed}>
      {!ready && <span className="e-fine">{failed ? "Google unavailable" : "Loading Google sign-in..."}</span>}
    </div>
  </>;
}
