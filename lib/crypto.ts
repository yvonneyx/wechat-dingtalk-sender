import crypto from "crypto"

// 加密密钥
const SECRET_KEY = process.env.SESSION_SECRET || "your-secret-key-min-32-chars-long-here"
const ALGORITHM = "aes-256-gcm"

// 加密数据
export function encrypt(text: string) {
  const iv = crypto.randomBytes(16)
  const salt = crypto.randomBytes(16)
  const key = crypto.pbkdf2Sync(SECRET_KEY, salt, 100000, 32, "sha512")

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()])
  const authTag = cipher.getAuthTag()

  // 将所有部分组合成一个字符串
  const result = Buffer.concat([salt, iv, authTag, encrypted]).toString("base64")
  return result
}

// 解密数据
export function decrypt(encryptedText: string) {
  const buffer = Buffer.from(encryptedText, "base64")

  const salt = buffer.subarray(0, 16)
  const iv = buffer.subarray(16, 32)
  const authTag = buffer.subarray(32, 48)
  const encrypted = buffer.subarray(48)

  const key = crypto.pbkdf2Sync(SECRET_KEY, salt, 100000, 32, "sha512")
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString("utf8")
}
