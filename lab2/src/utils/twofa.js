import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

export function generateTOTPSecret({ name = 'MyApp' } = {}) {
  const secret = speakeasy.generateSecret({ name });
  return {
    ascii: secret.ascii,
    hex: secret.hex,
    base32: secret.base32,
    otpauth_url: secret.otpauth_url
  };
}

export async function generateQRCodeDataURL(otpauthUrl) {
  return await qrcode.toDataURL(otpauthUrl);
}

export function verifyTOTP(token, base32Secret) {
  return speakeasy.totp.verify({ secret: base32Secret, encoding: 'base32', token, window: 1 });
}
