const fs = require("fs/promises");
const path = require("path");

const SETTINGS_FILE_PATH = path.join(
  __dirname,
  "..",
  "data",
  "admin-settings.json",
);

const DEFAULT_SETTINGS = {
  storeName: "Everythingpossy",
  storeEmail: "admin@everythingposy.com",
  storePhone: "+234 916 709 6611",
  currency: "NGN",
  taxRate: "7.5",
  notificationsEnabled: true,
  exchangeRates: {
    USD: 1500,
    GBP: 1900,
    EUR: 1700,
  },
};

const ensureSettingsFile = async () => {
  const directory = path.dirname(SETTINGS_FILE_PATH);
  await fs.mkdir(directory, { recursive: true });

  try {
    await fs.access(SETTINGS_FILE_PATH);
  } catch {
    await fs.writeFile(
      SETTINGS_FILE_PATH,
      JSON.stringify(DEFAULT_SETTINGS, null, 2),
      "utf-8",
    );
  }
};

const readSettings = async () => {
  await ensureSettingsFile();
  const raw = await fs.readFile(SETTINGS_FILE_PATH, "utf-8");
  const parsed = JSON.parse(raw);
  return { ...DEFAULT_SETTINGS, ...parsed };
};

const writeSettings = async (settings) => {
  await ensureSettingsFile();
  await fs.writeFile(
    SETTINGS_FILE_PATH,
    JSON.stringify(settings, null, 2),
    "utf-8",
  );
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await readSettings();
    res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const current = await readSettings();
    const {
      storeName,
      storeEmail,
      storePhone,
      currency,
      taxRate,
      notificationsEnabled,
      exchangeRates,
    } = req.body;

    if (taxRate !== undefined) {
      const parsedTaxRate = Number(taxRate);
      if (
        !Number.isFinite(parsedTaxRate) ||
        parsedTaxRate < 0 ||
        parsedTaxRate > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Tax rate must be a number between 0 and 100",
        });
      }
    }

    const nextSettings = {
      ...current,
      ...(storeName !== undefined
        ? { storeName: String(storeName).trim() }
        : {}),
      ...(storeEmail !== undefined
        ? { storeEmail: String(storeEmail).trim() }
        : {}),
      ...(storePhone !== undefined
        ? { storePhone: String(storePhone).trim() }
        : {}),
      ...(currency !== undefined
        ? { currency: String(currency).trim().toUpperCase() }
        : {}),
      ...(taxRate !== undefined ? { taxRate: String(Number(taxRate)) } : {}),
      ...(typeof notificationsEnabled === "boolean"
        ? { notificationsEnabled }
        : {}),
      ...(exchangeRates && typeof exchangeRates === "object"
        ? {
            exchangeRates: {
              ...current.exchangeRates,
              ...Object.fromEntries(
                Object.entries(exchangeRates)
                  .filter(([key]) => ["USD", "GBP", "EUR"].includes(key))
                  .map(([key, value]) => [key, Number(value)]),
              ),
            },
          }
        : {}),
      updatedAt: new Date().toISOString(),
    };

    if (nextSettings.exchangeRates) {
      const invalidRate = Object.entries(nextSettings.exchangeRates).find(
        ([, value]) => !Number.isFinite(value) || value <= 0,
      );
      if (invalidRate) {
        return res.status(400).json({
          success: false,
          message: "Exchange rates must be positive numbers",
        });
      }
    }

    await writeSettings(nextSettings);

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings: nextSettings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await readSettings();

    res.status(200).json({
      success: true,
      settings: {
        storeName: settings.storeName,
        currency: settings.currency,
        exchangeRates: settings.exchangeRates || DEFAULT_SETTINGS.exchangeRates,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.clearCache = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Cache clear request completed",
      details: {
        clearedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.resetSettings = async (req, res) => {
  try {
    await writeSettings({
      ...DEFAULT_SETTINGS,
      updatedAt: new Date().toISOString(),
    });
    res.status(200).json({
      success: true,
      message: "Settings reset to defaults",
      settings: await readSettings(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
