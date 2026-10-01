"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "@/src/components/icon";
import Toast from "@/src/components/Toast";
import { useLocalizedDigits } from "@/src/hooks/useLocalizedDigits";
import {
  getApiErrorMessage,
  loginNurse,
  registerNurse,
  requestOtp,
  saveNurseSession,
  verifyOtp,
} from "@/src/lib/auth";
import { extractDigits } from "@/src/utils/digits";
import AuthHeader from "./AuthHeader";
import LoginLogo from "./LoginLogo";
import EnteringPanel from "./EnteringPanel";
import OTPModal from "./OTPModal";

type Place = { id: number; name: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!]).{8,}$/;

const EDUCATION = [
  { value: 0, labelKey: "educationLevel_associate" },
  { value: 1, labelKey: "educationLevel_bachelor" },
  { value: 2, labelKey: "educationLevel_master" },
  { value: 3, labelKey: "educationLevel_phd" },
  { value: 4, labelKey: "educationLevel_specialist" },
] as const;

function isValidNationalId(code: string) {
  if (!/^\d{10}$/.test(code)) return false;
  if (/^(\d)\1{9}$/.test(code)) return false;
  const check = Number(code[9]);
  const sum = [...code.slice(0, 9)].reduce(
    (acc, digit, index) => acc + Number(digit) * (10 - index),
    0,
  );
  const remainder = sum % 11;
  return remainder < 2 ? check === remainder : check === 11 - remainder;
}

function jalaliToGregorian(
  jy: number,
  jm: number,
  jd: number,
): [number, number, number] {
  let gy;
  if (jy > 979) {
    gy = 1600;
    jy -= 979;
  } else {
    gy = 621;
  }
  let days =
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  gy += 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const monthDays = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let gm = 0;
  for (gm = 0; gm < 13 && days >= monthDays[gm]; gm++) days -= monthDays[gm];
  return [gy, gm, days + 1];
}

function graduationToIso(yearText: string): string {
  const year = Number(extractDigits(yearText));
  if (!year) return new Date().toISOString();
  if (year >= 1700) return new Date(year, 0, 1).toISOString();
  const [gy, gm, gd] = jalaliToGregorian(year, 1, 1);
  return new Date(gy, gm - 1, gd).toISOString();
}

const fieldLabel =
  "login-heading mb-1.5 block text-[14px] font-semibold leading-[16px] text-black";
const fieldInput =
  "login-input h-full w-full min-w-0 border-0 bg-transparent text-[13px] text-[#2671FD] placeholder:text-[#93B4F5] focus:outline-none focus:ring-0";

function boxClass(invalid?: boolean) {
  return `flex h-[45px] w-full items-center rounded-[13px] border bg-[#FEFEFD] px-3 ${
    invalid ? "border-red-500" : "border-[#E2E8F0]"
  }`;
}

export default function SignupView() {
  const t = useTranslations();
  const { display } = useLocalizedDigits();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [university, setUniversity] = useState("");
  const [experience, setExperience] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [address, setAddress] = useState("");
  const [biography, setBiography] = useState("");
  const [provinces, setProvinces] = useState<Place[]>([]);
  const [cities, setCities] = useState<Place[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enteringPanel, setEnteringPanel] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoadingPlaces(true);
      try {
        const response = await fetch("/api/geo/provinces");
        const result = await response.json();
        setProvinces(Array.isArray(result.data) ? result.data : []);
      } catch {
        setProvinces([]);
      } finally {
        setLoadingPlaces(false);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    if (!provinceId) {
      setCities([]);
      setCityId("");
      return;
    }
    const load = async () => {
      try {
        const response = await fetch(`/api/geo/cities/${provinceId}`);
        const result = await response.json();
        setCities(Array.isArray(result.data) ? result.data : []);
      } catch {
        setCities([]);
      }
    };
    void load();
  }, [provinceId]);

  const validate = () => {
    if (!firstName.trim() || !lastName.trim()) return t("name_required");
    if (!isValidNationalId(extractDigits(nationalCode))) return t("invalid_national_id");
    if (!/^[0-9]{11}$/.test(extractDigits(phone))) return t("invalid_phone");
    if (email.trim() && !EMAIL_RE.test(email.trim())) return t("invalid_email");
    if (!PASSWORD_RE.test(password)) return t("password_pattern");
    if (password !== confirmPassword) return t("passwords_not_match");
    return "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      setToast({ message, type: "error" });
      return;
    }

    const cleanedPhone = extractDigits(phone);
    setPhone(cleanedPhone);
    setError("");
    setLoading(true);
    try {
      const { ok, result } = await requestOtp(cleanedPhone);
      if (!ok) {
        const msg = getApiErrorMessage(result, t("otp_send_error"));
        setError(msg);
        setToast({ message: msg, type: "error" });
        return;
      }
      setShowOTP(true);
      setToast({ message: t("otp_sent"), type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: t("otp_send_error"), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const finishRegistration = async (verificationToken: string) => {
    const cleanedPhone = extractDigits(phone);
    setLoading(true);
    setEnteringPanel(true);
    try {
      const { ok, result } = await registerNurse({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        academicLevel: academicLevel === "" ? 0 : Number(academicLevel),
        experience: experience ? Number(extractDigits(experience)) : 0,
        activationState: 0,
        yearOfGraduation: graduationToIso(graduationYear),
        lastUniversity: university.trim(),
        provinceId: provinceId ? Number(provinceId) : 0,
        cityId: cityId ? Number(cityId) : 0,
        identityUserId: null,
        phoneNumber: cleanedPhone,
        address: address.trim() || null,
        biography: biography.trim() || null,
        nationalCode: extractDigits(nationalCode),
        isActive: true,
        token: verificationToken,
        password,
        confirmPassword,
        email: email.trim(),
      });

      if (!ok) {
        setEnteringPanel(false);
        const msg = getApiErrorMessage(result, t("signup_error"));
        setError(msg);
        setToast({ message: msg, type: "error" });
        return;
      }

      const loginAttempts = [
        ...(email.trim()
          ? [{ email: email.trim(), phoneNumber: "", password }]
          : []),
        { email: "", phoneNumber: cleanedPhone, password },
      ];

      for (const attempt of loginAttempts) {
        const loginResult = await loginNurse(attempt);
        if (loginResult.tokens.token) {
          saveNurseSession(loginResult.tokens, {
            userName: `${firstName.trim()} ${lastName.trim()}`.trim(),
            userEmail: email.trim(),
            userPhone: cleanedPhone,
          });
          window.location.href = "/";
          return;
        }
      }

      setEnteringPanel(false);
      setToast({ message: t("signup_success_login"), type: "success" });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      console.error(err);
      setEnteringPanel(false);
      setToast({ message: t("signup_error"), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (code: string) => {
    const cleanedPhone = extractDigits(phone);
    const verified = await verifyOtp(cleanedPhone, code);
    if (!verified.ok) {
      throw new Error(getApiErrorMessage(verified.result, t("otp_invalid")));
    }
    setShowOTP(false);
    await finishRegistration(verified.tokens.token || code);
  };

  return (
    <>
      {enteringPanel && <EnteringPanel message={t("signing_up")} />}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        phoneNumber={extractDigits(phone)}
        onVerify={handleOTPVerify}
      />
      <div className="signup-page relative z-10 flex min-h-[100dvh] w-full justify-center bg-white">
        <div className="flex w-full max-w-[390px] flex-col px-6 pb-[var(--pad-bottom)] pt-[var(--pad-top)]">
          <AuthHeader
            showBack
            onBack={() => window.history.back()}
            logo={<LoginLogo />}
          />

          <div className="mx-auto mt-6 flex w-full max-w-[316px] flex-col items-center justify-center gap-[12px] px-[12px]">
            <h1 className="login-heading w-full text-center text-[16px] font-semibold capitalize leading-[20px] text-black">
              {t("register_as_nurse")}
            </h1>
            <p className="login-text w-full text-center text-[10px] font-light leading-[15px] tracking-[-0.05px] text-[#252525]">
              {t("signup_subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto mt-4 flex w-full flex-col gap-3">
            <div className="flex gap-3">
              <label className="flex-1">
                <span className={fieldLabel}>{t("firstName_label")}</span>
                <div className={boxClass()}>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t("firstName_placeholder")}
                    className={fieldInput}
                    required
                  />
                </div>
              </label>
              <label className="flex-1">
                <span className={fieldLabel}>{t("familyName_label")}</span>
                <div className={boxClass()}>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t("familyName_placeholder")}
                    className={fieldInput}
                    required
                  />
                </div>
              </label>
            </div>

            <label>
              <span className={fieldLabel}>{t("nationalId_label")}</span>
              <div className={boxClass()}>
                <input
                  value={display(nationalCode)}
                  onChange={(e) =>
                    setNationalCode(extractDigits(e.target.value).slice(0, 10))
                  }
                  placeholder={t("nationalId_placeholder")}
                  inputMode="numeric"
                  className={fieldInput}
                  required
                />
              </div>
            </label>

            <label>
              <span className={fieldLabel}>{t("mobileNumber_label")}</span>
              <div className={boxClass()}>
                <input
                  value={display(phone)}
                  onChange={(e) => setPhone(extractDigits(e.target.value).slice(0, 11))}
                  placeholder={t("mobileNumber_placeholder")}
                  inputMode="numeric"
                  className={fieldInput}
                  required
                />
              </div>
            </label>

            <label>
              <span className={fieldLabel}>{t("email_label")}</span>
              <div className={boxClass()}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("email_placeholder")}
                  className={fieldInput}
                />
              </div>
            </label>

            <div className="flex gap-3">
              <label className="flex-1">
                <span className={fieldLabel}>{t("password_label")}</span>
                <div className={boxClass()}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("password_placeholder")}
                    className={fieldInput}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="shrink-0"
                  >
                    {showPassword ? <Eye color="#2671FD" /> : <EyeOff color="#2671FD" />}
                  </button>
                </div>
              </label>
              <label className="flex-1">
                <span className={fieldLabel}>{t("confirmPassword_label")}</span>
                <div className={boxClass()}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("confirmPassword_placeholder")}
                    className={fieldInput}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="shrink-0"
                  >
                    {showConfirm ? <Eye color="#2671FD" /> : <EyeOff color="#2671FD" />}
                  </button>
                </div>
              </label>
            </div>
            <p className="login-text -mt-1 text-[11px] font-light leading-[15px] text-[#6B7280]">
              {t("password_description")}
            </p>

            <label>
              <span className={fieldLabel}>{t("province_label")}</span>
              <div className={boxClass()}>
                <select
                  value={provinceId}
                  onChange={(e) => {
                    setProvinceId(e.target.value);
                    setCityId("");
                  }}
                  className={fieldInput}
                >
                  <option value="">
                    {loadingPlaces ? t("loading") : t("province_placeholder")}
                  </option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label>
              <span className={fieldLabel}>{t("city_label")}</span>
              <div className={boxClass()}>
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className={fieldInput}
                  disabled={!provinceId}
                >
                  <option value="">
                    {provinceId ? t("city_placeholder") : t("city_needs_province")}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label>
              <span className={fieldLabel}>{t("graduationYear_label")}</span>
              <div className={boxClass()}>
                <input
                  value={display(graduationYear)}
                  onChange={(e) =>
                    setGraduationYear(extractDigits(e.target.value).slice(0, 4))
                  }
                  placeholder={t("graduationYear_placeholder")}
                  inputMode="numeric"
                  className={fieldInput}
                />
              </div>
            </label>

            <label>
              <span className={fieldLabel}>{t("university_label")}</span>
              <div className={boxClass()}>
                <input
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder={t("university_placeholder")}
                  className={fieldInput}
                />
              </div>
            </label>

            <label>
              <span className={fieldLabel}>{t("experience_label")}</span>
              <div className={boxClass()}>
                <input
                  value={display(experience)}
                  onChange={(e) =>
                    setExperience(extractDigits(e.target.value).slice(0, 2))
                  }
                  placeholder={t("experience_placeholder")}
                  inputMode="numeric"
                  className={fieldInput}
                />
              </div>
            </label>

            <label>
              <span className={fieldLabel}>{t("educationLevel_label")}</span>
              <div className={boxClass()}>
                <select
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value)}
                  className={fieldInput}
                >
                  <option value="">{t("educationLevel_placeholder")}</option>
                  {EDUCATION.map((item) => (
                    <option key={item.value} value={item.value}>
                      {t(item.labelKey)}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label>
              <span className={fieldLabel}>{t("signup_address_label")}</span>
              <div className={boxClass()}>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t("signup_address_placeholder")}
                  className={fieldInput}
                />
              </div>
            </label>

            <label>
              <span className={fieldLabel}>{t("biography_label")}</span>
              <textarea
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder={t("biography_placeholder")}
                rows={3}
                className="login-input w-full rounded-[13px] border border-[#E2E8F0] bg-[#FEFEFD] px-3 py-2 text-[13px] text-[#2671FD] placeholder:text-[#93B4F5] focus:outline-none"
              />
            </label>

            {error && <p className="text-[12px] text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`login-btn mx-auto mt-2 h-[52px] w-[230px] max-w-full rounded-[12px] text-[16px] font-bold text-white transition-all duration-300 ease-out ${
                loading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-[#2563EB] hover:bg-[#1d4ed8] active:scale-[0.98]"
              }`}
            >
              {loading ? t("signing_up") : t("signup_button")}
            </button>
          </form>

          <p className="login-text mt-5 pb-4 text-center text-[12px] leading-[18px] text-[#6B7280]">
            {t("login_prompt")}{" "}
            <Link href="/login" className="font-medium text-[#2563EB] hover:underline">
              {t("login_button")}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
