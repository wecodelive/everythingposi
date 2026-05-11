import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CurrencyContext = createContext(null);

const SUPPORTED_CURRENCIES = ["NGN", "USD", "GBP", "EUR"];
const DEFAULT_RATES = {
  USD: 1500,
  GBP: 1900,
  EUR: 1700,
};
const STORAGE_KEY = "preferredCurrency";

const normalizeCurrency = (value) =>
  typeof value === "string" ? value.trim().toUpperCase() : "";

const sanitizeRates = (rates, baseCurrency) => {
  const sanitized = {
    ...DEFAULT_RATES,
    ...(rates && typeof rates === "object" ? rates : {}),
  };

  return Object.fromEntries(
    Object.entries(sanitized)
      .filter(([key]) => key !== baseCurrency)
      .map(([key, value]) => [key, Number(value)]),
  );
};

const detectCurrency = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) return null;
    const data = await response.json();
    return normalizeCurrency(data?.currency);
  } catch (error) {
    console.warn("Unable to detect currency:", error);
    return null;
  }
};

export function CurrencyProvider({ children }) {
  const [baseCurrency, setBaseCurrency] = useState("NGN");
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_RATES);
  const [detectedCurrency, setDetectedCurrency] = useState(null);
  const [currency, setCurrencyState] = useState("NGN");
  const [isAuto, setIsAuto] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/settings");
      const payload = await response.json();
      if (!payload?.success) return;

      const resolvedBaseCurrency = normalizeCurrency(payload.settings?.currency) ||
        "NGN";
      const resolvedRates = sanitizeRates(
        payload.settings?.exchangeRates,
        resolvedBaseCurrency,
      );

      setBaseCurrency(resolvedBaseCurrency);
      setExchangeRates(resolvedRates);
    } catch (error) {
      console.warn("Unable to load public settings:", error);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  useEffect(() => {
    let isMounted = true;

    const resolveCurrency = async () => {
      const stored = normalizeCurrency(localStorage.getItem(STORAGE_KEY));
      if (stored && SUPPORTED_CURRENCIES.includes(stored)) {
        setCurrencyState(stored);
        setIsAuto(false);
        return;
      }

      const detected = await detectCurrency();
      if (!isMounted) return;

      const resolved =
        (detected && SUPPORTED_CURRENCIES.includes(detected)
          ? detected
          : baseCurrency) || "NGN";

      setDetectedCurrency(resolved);
      setCurrencyState(resolved);
      setIsAuto(true);
    };

    resolveCurrency();

    return () => {
      isMounted = false;
    };
  }, [baseCurrency]);

  const setCurrency = useCallback(
    (nextCurrency) => {
      const normalized = normalizeCurrency(nextCurrency);
      if (!normalized || normalized === "AUTO") {
        localStorage.removeItem(STORAGE_KEY);
        setCurrencyState(detectedCurrency || baseCurrency);
        setIsAuto(true);
        return;
      }

      if (!SUPPORTED_CURRENCIES.includes(normalized)) {
        return;
      }

      localStorage.setItem(STORAGE_KEY, normalized);
      setCurrencyState(normalized);
      setIsAuto(false);
    },
    [baseCurrency, detectedCurrency],
  );

  const getRate = useCallback(
    (targetCurrency) => {
      const normalized = normalizeCurrency(targetCurrency) || baseCurrency;
      if (normalized === baseCurrency) return 1;
      const rate = exchangeRates?.[normalized];
      return Number.isFinite(rate) && rate > 0 ? rate : 1;
    },
    [baseCurrency, exchangeRates],
  );

  const convertFromBase = useCallback(
    (amount, targetCurrency = currency) => {
      const value = Number(amount || 0);
      const rate = getRate(targetCurrency);
      return rate ? value / rate : value;
    },
    [currency, getRate],
  );

  const convertToBase = useCallback(
    (amount, sourceCurrency = currency) => {
      const value = Number(amount || 0);
      const rate = getRate(sourceCurrency);
      return rate ? value * rate : value;
    },
    [currency, getRate],
  );

  const formatCurrency = useCallback(
    (amount, targetCurrency = currency) => {
      const normalized = normalizeCurrency(targetCurrency) || baseCurrency;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: normalized,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(amount || 0));
    },
    [baseCurrency, currency],
  );

  const formatFromBase = useCallback(
    (amount, targetCurrency = currency) =>
      formatCurrency(convertFromBase(amount, targetCurrency), targetCurrency),
    [convertFromBase, currency, formatCurrency],
  );

  const value = useMemo(
    () => ({
      baseCurrency,
      currency,
      detectedCurrency,
      isAuto,
      exchangeRates,
      supportedCurrencies: SUPPORTED_CURRENCIES,
      setCurrency,
      convertFromBase,
      convertToBase,
      formatCurrency,
      formatFromBase,
    }),
    [
      baseCurrency,
      currency,
      detectedCurrency,
      exchangeRates,
      setCurrency,
      convertFromBase,
      convertToBase,
      formatCurrency,
      formatFromBase,
    ],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
};
