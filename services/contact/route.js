import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('📧 Starting email process...');
    
    const body = await request.json();
    console.log('📦 Received data:', body);
    
    const { name, phone, email, service, message } = body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('❌ Missing environment variables');
      return NextResponse.json(
        { success: false, error: 'Email configuration missing' }, 
        { status: 500 }
      );
    }

    console.log('🔑 Email user:', process.env.EMAIL_USER);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log('✅ Transporter created');

    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified');
    } catch (verifyError) {
      console.error('❌ SMTP verification failed:', verifyError);
      return NextResponse.json(
        { success: false, error: 'Email server connection failed: ' + verifyError.message }, 
        { status: 500 }
      );
    }

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'gelmidentabot@gmail.com',
  replyTo: email,
  subject: `🦷 NAUJA REGISTRACIJA: ${name} - ${service}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #5d7bb3; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">🦷 Nauja registracijos užklausa</h2>
      </div>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px;">
        <h3 style="color: #5d7bb3; margin-top: 0;">Kliento informacija:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; background: white; border: 1px solid #ddd;"><strong>Vardas Pavardė:</strong></td>
            <td style="padding: 10px; background: white; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: white; border: 1px solid #ddd;"><strong>Telefonas:</strong></td>
            <td style="padding: 10px; background: white; border: 1px solid #ddd;"><a href="tel:${phone}" style="color: #5d7bb3; text-decoration: none;">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; background: white; border: 1px solid #ddd;"><strong>El. paštas:</strong></td>
            <td style="padding: 10px; background: white; border: 1px solid #ddd;"><a href="mailto:${email}" style="color: #5d7bb3; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; background: white; border: 1px solid #ddd;"><strong>Paslauga:</strong></td>
            <td style="padding: 10px; background: white; border: 1px solid #ddd;">${service}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: white; border: 1px solid #ddd;" valign="top"><strong>Žinutė:</strong></td>
            <td style="padding: 10px; background: white; border: 1px solid #ddd;">${message || 'Nenurodyta'}</td>
          </tr>
        </table>
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 20px; text-align: center;">
        📅 Išsiųsta: ${new Date().toLocaleString('lt-LT', { 
          dateStyle: 'long', 
          timeStyle: 'short' 
        })}
      </p>
      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ffc107;">
        <p style="margin: 0; color: #856404;">
          <strong>💡 Greitas atsakymas:</strong> Tiesiog spauskite "Reply" šiam laiškui - atsakymas bus išsiųstas klientui ${email}
        </p>
      </div>
    </div>
  `,
};

    const clientMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Jūsų registracija gauta - GelmiDenta',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5d7bb3;">Ačiū už registraciją!</h2>
          <p>Sveiki, ${name},</p>
          <p>Gavome Jūsų užklausą dėl paslaugos: <strong>${service}</strong></p>
          <p>Su Jumis susisieksime artimiausiu metu telefonu <strong>${phone}</strong> arba el. paštu.</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Mūsų kontaktai:</h3>
            <p><strong>Tel.:</strong> +37068793063</p>
            <p><strong>El. paštas:</strong> gelmidenta@gmail.com</p>
            <p><strong>Adresas:</strong> Nemuno g. 11, Panevėžys</p>
            <p><strong>Darbo laikas:</strong> I-V: 08:00 - 20:00</p>
          </div>
          <p>Su pagarba,<br/><strong>GelmiDenta komanda</strong></p>
        </div>
      `,
    };

    console.log('📨 Sending emails...');

    await transporter.sendMail(mailOptions);
    console.log('✅ Clinic email sent');
    
    await transporter.sendMail(clientMailOptions);
    console.log('✅ Client email sent');

    return NextResponse.json({ 
      success: true, 
      message: 'Emails sent successfully' 
    });

  } catch (error) {
    console.error('❌ Error in API route:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.code 
    }, { status: 500 });
  }
}
