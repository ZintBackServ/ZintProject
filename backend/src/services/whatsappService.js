const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const pino = require("pino");
const path = require("path");
const fs = require("fs");

let sock = null;
let isConnected = false;
let isConnecting = false;

// Keep credentials outside `src`: Nodemon watches that folder, and restarting
// while Baileys writes credentials interrupts the QR-linking handshake.
const AUTH_DIR = path.join(__dirname, "..", "..", "auth_info_baileys");

/**
 * Normalizes any phone number into WhatsApp JID format (e.g., 919876543210@s.whatsapp.net)
 */
function formatWhatsAppJid(phone) {
  if (!phone) return null;
  // Remove all non-digits
  let cleaned = String(phone).replace(/\D/g, "");
  
  // If Indian 10-digit number without country code, prepend 91
  if (cleaned.length === 10) {
    cleaned = "91" + cleaned;
  }
  
  // Ensure it doesn't already have @s.whatsapp.net
  if (cleaned.includes("@")) {
    return cleaned;
  }
  
  return `${cleaned}@s.whatsapp.net`;
}

/**
 * Initializes the Baileys WhatsApp client
 */
async function initWhatsApp() {
  if (isConnecting || (sock && isConnected)) return;
  isConnecting = true;

  try {
    if (!fs.existsSync(AUTH_DIR)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

    // Use a stable hardcoded WA Web version to avoid fetchLatestBaileysVersion()
    // network failure which silently prevents the socket from connecting.
    let version = [2, 3000, 1023247296];
    try {
      const fetched = await fetchLatestBaileysVersion();
      if (fetched?.version) {
        version = fetched.version;
        console.log(`[WhatsApp] Using latest WA version: ${version.join(".")}`);
      }
    } catch (vErr) {
      console.log(`[WhatsApp] Could not fetch latest version, using fallback: ${version.join(".")}`);
    }

    sock = makeWASocket({
      version,
      logger: pino({ level: "silent" }), // suppress verbose pino logs
      printQRInTerminal: false,           // we render manually via qrcode-terminal
      auth: state,
      browser: ["Zint Institute", "Chrome", "1.0.0"],
      syncFullHistory: false,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 30000,
      keepAliveIntervalMs: 10000,
      retryRequestDelayMs: 250,
    });

    sock.ev.on("creds.update", async () => {
      // The directory can be absent after an intentional session reset.
      // Recreate it before Baileys persists refreshed credentials.
      if (!fs.existsSync(AUTH_DIR)) {
        fs.mkdirSync(AUTH_DIR, { recursive: true });
      }
      await saveCreds();
    });

    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log("\n=======================================================");
        console.log(" 📲 SCAN THIS WHATSAPP QR CODE WITH YOUR PHONE:");
        console.log(" (WhatsApp -> Linked Devices -> Link a Device)");
        console.log("=======================================================\n");
        qrcode.generate(qr, { small: true });
        console.log("\n=======================================================\n");
      }

     if (connection === "close") {
  isConnected = false;
  isConnecting = false;

  const statusCode = lastDisconnect?.error?.output?.statusCode;

  console.log(
    `[WhatsApp] Connection closed. Status code: ${statusCode}`
  );

  // 440 = connection replaced
  if (statusCode === DisconnectReason.connectionReplaced) {
    console.error(
      "[WhatsApp] ❌ Connection replaced (440). " +
      "Another WhatsApp session may be using this auth session."
    );

    // Do not immediately reconnect in a loop.
    setTimeout(() => {
      if (!isConnected && !isConnecting) {
        console.log("[WhatsApp] Attempting reconnect after 440...");
        initWhatsApp();
      }
    }, 30000);

    return;
  }

  // 401/logged out
  if (statusCode === DisconnectReason.loggedOut) {
    console.error(
      "[WhatsApp] ❌ WhatsApp logged out. " +
      "Delete auth_info_baileys and scan QR again."
    );
    return;
  }

  // Other disconnects
  setTimeout(() => {
    if (!isConnected && !isConnecting) {
      initWhatsApp();
    }
  }, 10000);
      } else if (connection === "open") {
        isConnected = true;
        isConnecting = false;
        console.log("\n[WhatsApp] ✅ WhatsApp connected! Ready to send messages.\n");
      } else if (connection === "connecting") {
        console.log("[WhatsApp] 🔄 Connecting to WhatsApp...");
      }
    });

  } catch (err) {
    isConnecting = false;
    console.error("[WhatsApp] ❌ Error initializing WhatsApp:", err.message);
    // Retry after 10 seconds
    setTimeout(() => initWhatsApp(), 10000);
  }
}

/**
 * Sends a WhatsApp text message to a given phone number
 * @param {string} phoneNumber 
 * @param {string} text 
 */
async function sendWhatsAppMessage(phoneNumber, text) {
  try {
    const jid = formatWhatsAppJid(phoneNumber);
    if (!jid) {
      console.warn("[WhatsApp] Invalid phone number:", phoneNumber);
      return { success: false, error: "Invalid phone number" };
    }

    if (!sock || !isConnected) {
      console.warn("[WhatsApp] WhatsApp client is not connected. Message queued or skipped.");
      return { success: false, error: "WhatsApp client not connected yet" };
    }

    const sent = await sock.sendMessage(jid, { text });
    console.log(`[WhatsApp] 📨 Message successfully sent to ${phoneNumber}`);
    return { success: true, messageId: sent?.key?.id };
  } catch (err) {
    console.error(`[WhatsApp] Failed to send message to ${phoneNumber}:`, err.message);
    return { success: false, error: err.message };
  }
}

function getWhatsAppStatus() {
  return {
    isConnected,
    isConnecting,
  };
}

module.exports = {
  initWhatsApp,
  sendWhatsAppMessage,
  getWhatsAppStatus,
  formatWhatsAppJid,
};
