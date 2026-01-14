const decoder = new TextDecoder();
const encoder = new TextEncoder();

export const encode = (o: unknown): Uint8Array => {
  return encoder.encode(JSON.stringify(o));
};

export const decode = <T = unknown>(u8a?: Uint8Array | null): T | null => {
  if (!u8a) return null;

  try {
    return JSON.parse(decoder.decode(u8a));
  } catch (error) {
    return null;
  }
};
