import { Resend } from 'resend';
import { env } from '../config/env';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!resend) {
    console.warn('Resend no configurado. Email no enviado:', options.subject);
    return false;
  }

  try {
    await resend.emails.send({
      from: 'Inmobiliaria <noreply@tuinmobiliaria.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
  }
}

export async function sendVisitConfirmation(
  userEmail: string,
  userName: string,
  propertyTitle: string,
  visitDate: string,
  startTime: string,
  endTime: string,
  propertyAddress: string
): Promise<void> {
  // Email al usuario
  await sendEmail({
    to: userEmail,
    subject: `Visita confirmada - ${propertyTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f7f8fa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1e3a5f, #2d5a8e); padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">✅ Visita Confirmada</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #333; font-size: 16px;">Hola <strong>${userName}</strong>,</p>
          <p style="color: #555;">Tu visita ha sido confirmada con los siguientes detalles:</p>
          <div style="background: #ffffff; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #c5a55a;">
            <p style="margin: 8px 0;"><strong>🏠 Propiedad:</strong> ${propertyTitle}</p>
            <p style="margin: 8px 0;"><strong>📍 Dirección:</strong> ${propertyAddress}</p>
            <p style="margin: 8px 0;"><strong>📅 Fecha:</strong> ${visitDate}</p>
            <p style="margin: 8px 0;"><strong>🕐 Horario:</strong> ${startTime} - ${endTime}</p>
          </div>
          <p style="color: #888; font-size: 14px;">Si necesitas cancelar, puedes hacerlo desde tu perfil.</p>
        </div>
      </div>
    `,
  });

  // Email al admin
  if (env.ADMIN_EMAIL) {
    await sendEmail({
      to: env.ADMIN_EMAIL,
      subject: `Nueva visita agendada - ${propertyTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a5f;">Nueva visita agendada</h2>
          <p><strong>Usuario:</strong> ${userName} (${userEmail})</p>
          <p><strong>Propiedad:</strong> ${propertyTitle}</p>
          <p><strong>Fecha:</strong> ${visitDate}</p>
          <p><strong>Horario:</strong> ${startTime} - ${endTime}</p>
        </div>
      `,
    });
  }
}

export async function sendContactNotification(
  name: string,
  email: string,
  phone: string,
  message: string,
  propertyTitle?: string
): Promise<void> {
  if (!env.ADMIN_EMAIL) return;

  await sendEmail({
    to: env.ADMIN_EMAIL,
    subject: `Nuevo mensaje de contacto${propertyTitle ? ` - ${propertyTitle}` : ''}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e3a5f;">📩 Nuevo mensaje de contacto</h2>
        ${propertyTitle ? `<p><strong>Propiedad:</strong> ${propertyTitle}</p>` : ''}
        <div style="background: #f7f8fa; border-radius: 8px; padding: 20px; margin: 16px 0;">
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
          <p><strong>Mensaje:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `,
  });
}
