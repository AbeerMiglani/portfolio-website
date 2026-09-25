// Simulates redis-cpp's server reading two requests off a TCP socket, with and
// without the length-prefixed framing. Pure functions; the UI lives in
// FrameDemo.tsx. The model mirrors the real code:
//   - the client sends each message as [4-byte length][payload], the length
//     copied in host byte order (little-endian on x86 and ARM);
//   - read_full() calls read(fd, buf, n) until exactly n bytes have arrived;
//   - the unframed version is the old do_something(): read(fd, buf, 63) and
//     print whatever came back.

export const MAX_TEXT_BYTES = 7;
const UNFRAMED_READ = 63;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const encode = (text: string) => encoder.encode(text);
export const decode = (bytes: Uint8Array) => decoder.decode(bytes);

/** Trims text so its UTF-8 encoding fits in `max` bytes without splitting a character. */
export function clampBytes(text: string, max = MAX_TEXT_BYTES): string {
  let out = "";
  for (const char of text) {
    if (encode(out + char).length > max) break;
    out += char;
  }
  return out;
}

/** The two requests the client sends, like redis_client.cpp's "hello1" and "hello2". */
export const messagesFor = (text: string) => [`${text}1`, `${text}2`];

export function frame(message: string): Uint8Array {
  const payload = encode(message);
  const out = new Uint8Array(4 + payload.length);
  new DataView(out.buffer).setUint32(0, payload.length, true);
  out.set(payload, 4);
  return out;
}

export type Step =
  | { kind: "read"; call: string; got: number; note: string; waiting: number; consumed: number }
  | { kind: "print"; text: string };

/**
 * Splits `total` bytes into TCP segments of `min`–`max` bytes. Retries until
 * at least one segment boundary falls inside a message, so the demo always
 * shows the problem framing solves.
 */
export function randomSegments(total: number, boundaries: number[], [min, max] = [1, 5], rand = Math.random): number[] {
  for (let attempt = 0; attempt < 20; attempt++) {
    const sizes: number[] = [];
    let sent = 0;
    while (sent < total) {
      const size = Math.min(total - sent, min + Math.floor(rand() * (max - min + 1)));
      sizes.push(size);
      sent += size;
    }
    const cuts = new Set(sizes.map((_, i) => sizes.slice(0, i + 1).reduce((a, b) => a + b, 0)));
    if ([...cuts].some((cut) => cut < total && !boundaries.includes(cut))) return sizes;
  }
  return [1, total - 1];
}

/** A socket receive buffer fed one segment at a time. */
function socket(segments: number[]) {
  let next = 0;
  let buffered = 0;
  let consumed = 0;
  return {
    read(max: number) {
      if (buffered === 0 && next < segments.length) buffered += segments[next++];
      const got = Math.min(max, buffered);
      buffered -= got;
      consumed += got;
      return { got, waiting: buffered, consumed };
    },
  };
}

const at = (offset: number) => (offset ? `buf+${offset}` : "buf");

export function simulateFramed(messages: string[], segments: number[]): Step[] {
  const stream = concat(messages.map(frame));
  const sock = socket(segments);
  const steps: Step[] = [];
  let pos = 0;

  // read_full(): keep calling read() until `n` bytes are in, or the peer hangs up.
  const readFull = (start: number, n: number, label: (have: number) => string) => {
    let have = 0;
    while (have < n) {
      const { got, waiting, consumed } = sock.read(n - have);
      steps.push({ kind: "read", call: `read(fd, ${at(start + have)}, ${n - have})`, got, note: got ? label(have + got) : "EOF", waiting, consumed });
      if (got === 0) return false;
      have += got;
    }
    return true;
  };

  for (;;) {
    if (!readFull(0, 4, (have) => (have < 4 ? `header ${have}/4` : "header done"))) break;
    const len = new DataView(stream.buffer, pos, 4).getUint32(0, true);
    const last = steps[steps.length - 1];
    if (last.kind === "read") last.note = `len = ${len}`;
    readFull(4, len, (have) => `payload ${have}/${len}`);
    steps.push({ kind: "print", text: `Client says: ${decode(stream.slice(pos + 4, pos + 4 + len))}` });
    pos += 4 + len;
  }
  steps.push({ kind: "print", text: "EOF" });
  return steps;
}

export function simulateUnframed(messages: string[], segments: number[]): Step[] {
  const stream = concat(messages.map(encode));
  const sock = socket(segments);
  const steps: Step[] = [];
  let pos = 0;
  for (;;) {
    const { got, waiting, consumed } = sock.read(UNFRAMED_READ);
    steps.push({ kind: "read", call: `read(fd, buf, ${UNFRAMED_READ})`, got, note: got ? "" : "EOF", waiting, consumed });
    if (got === 0) break;
    steps.push({ kind: "print", text: `Client says: ${decode(stream.slice(pos, pos + got))}` });
    pos += got;
  }
  return steps;
}

function concat(parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}
