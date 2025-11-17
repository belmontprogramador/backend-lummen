// src/modules/passwordReset/passwordReset.service.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const repository = require("./passwordReset.repository");

const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST_LUMMEN || "smtp.hostinger.com",
  port: Number(process.env.SMTP_PORT_LUMMEN) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER_LUMMEN,
    pass: process.env.SMTP_PASS_LUMMEN,
  },
  tls: { rejectUnauthorized: false },
});

function emailTemplate({ name, resetUrl }) {
  return `
    <h1>Reset your password</h1>
    <p>Hello ${name}, click the link below:</p>
    <a href="${resetUrl}">Reset password</a>
  `;
}

module.exports = {
  async forgotPassword(email) {
    if (!email) throw new Error("email é obrigatório");

    const normalized = email.trim().toLowerCase();
    const user = await repository.findByEmail(normalized);

    if (!user) return { success: true };

    const resetSecret = process.env.JWT_RESET_SECRET || process.env.JWT_SECRET;

    const token = jwt.sign(
      { id: user.id, email: user.email, type: "password_reset" },
      resetSecret,
      { expiresIn: "1h" }
    );

    const urlBase = process.env.FRONTEND_RESET_URL;
    const resetUrl = `${urlBase}?token=${encodeURIComponent(token)}`;

    const html = emailTemplate({
      name: user.email.split("@")[0],
      resetUrl,
    });

    await mailTransporter.sendMail({
      from: `"Lummen App" <${process.env.SMTP_USER_LUMMEN}>`,
      to: user.email,
      subject: "Reset your password",
      html,
    });

    return { success: true };
  },

  async resetPassword({ token, newPassword }) {
    if (!token || !newPassword)
      throw new Error("token e newPassword são obrigatórios");

    const resetSecret = process.env.JWT_RESET_SECRET || process.env.JWT_SECRET;

    let decoded;
    try {
      decoded = jwt.verify(token, resetSecret);
    } catch {
      throw new Error("Token inválido ou expirado");
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await repository.updatePassword(decoded.id, hash);

    return { success: true, message: "Senha redefinida com sucesso" };
  },
};
