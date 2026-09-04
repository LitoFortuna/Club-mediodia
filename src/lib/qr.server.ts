// Generación de códigos QR — SOLO servidor
import QRCode from "qrcode";

export async function generateQrPng(data: string): Promise<Buffer> {
  return QRCode.toBuffer(data, {
    width: 480,
    margin: 2,
    errorCorrectionLevel: "M",
  });
}
