// Plantilla del email de confirmación de asistencia — SOLO servidor
import { CONCERT, formatConcertDateEs } from "@/lib/concert";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderConfirmationEmail(people: { name: string }[], cids: string[]): string {
  const qrBlocks = people
    .map(
      (p, i) => `
      <div style="margin:20px 0;padding:20px;border:1px solid #e5e5e5;text-align:center;">
        <p style="margin:0 0 12px;font-weight:700;font-size:16px;color:#111;">${escapeHtml(p.name)}</p>
        <img src="cid:${cids[i]}" width="220" height="220" alt="Código QR de entrada" style="display:block;margin:0 auto;" />
      </div>`,
    )
    .join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;color:#111;line-height:1.5;">
    <p style="text-transform:uppercase;letter-spacing:2px;font-size:11px;color:#C12523;font-weight:700;margin:0 0 4px;">
      Confirmación de asistencia
    </p>
    <h1 style="font-size:22px;margin:0 0 20px;">${CONCERT.bandName} en directo</h1>

    <div style="padding:16px;background:#f7f7f7;margin-bottom:20px;">
      <p style="margin:0 0 4px;font-weight:700;">${escapeHtml(CONCERT.venue)}</p>
      <p style="margin:0 0 12px;color:#555;">${escapeHtml(CONCERT.address)}</p>
      <p style="margin:0;">${formatConcertDateEs()}</p>
      <p style="margin:0;">Puertas: ${CONCERT.doorsTime}h &middot; Inicio: ${CONCERT.startTime}h</p>
      <p style="margin:12px 0 0;font-size:13px;color:#555;">${CONCERT.priceInfo}. ${CONCERT.ageInfo}.</p>
    </div>

    <p style="margin:0 0 8px;">Presenta este código QR en la puerta — <strong>uno por persona</strong>:</p>
    ${qrBlocks}

    <p style="font-size:12px;color:#888;margin-top:24px;">
      Si al final no podéis venir, no hace falta que aviséis: simplemente no uséis el código.
    </p>
  </div>`;
}
