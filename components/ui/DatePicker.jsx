"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { toDateValue } from "@/lib/validation/rules";

const copy = {
  lt: { placeholder: "Pasirinkite datą", previous: "Ankstesnis mėnuo", next: "Kitas mėnuo" },
  en: { placeholder: "Select a date", previous: "Previous month", next: "Next month" },
  pl: { placeholder: "Wybierz datę", previous: "Poprzedni miesiąc", next: "Następny miesiąc" },
  de: { placeholder: "Datum auswählen", previous: "Vorheriger Monat", next: "Nächster Monat" },
  ru: { placeholder: "Выберите дату", previous: "Предыдущий месяц", next: "Следующий месяц" },
  uk: { placeholder: "Оберіть дату", previous: "Попередній місяць", next: "Наступний місяць" },
};

export default function DatePicker({
  label,
  name,
  required = false,
  locale = "lt",
  error,
  onChange,
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const pickerRef = useRef(null);
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const language = copy[locale] ? locale : "lt";
  const labels = copy[language];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      if (!pickerRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(language, { month: "long", year: "numeric" }),
    [language],
  );
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(language, { day: "2-digit", month: "2-digit", year: "numeric" }),
    [language],
  );
  const weekdayFormatter = useMemo(
    () => new Intl.DateTimeFormat(language, { weekday: "short" }),
    [language],
  );
  const weekdays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => weekdayFormatter.format(new Date(2024, 0, index + 1))),
    [weekdayFormatter],
  );
  const leadingDays = (visibleMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  ).getDate();
  const calendarDays = [
    ...Array.from({ length: leadingDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const selectedValue = selectedDate ? toDateValue(selectedDate) : "";
  const displayValue = selectedDate ? dateFormatter.format(selectedDate) : labels.placeholder;
  const previousMonthDisabled = visibleMonth <= currentMonth;
  const errorId = `${name}-date-error`;

  function changeMonth(offset) {
    setVisibleMonth((current) => {
      const nextMonth = new Date(current.getFullYear(), current.getMonth() + offset, 1);
      return nextMonth < currentMonth ? currentMonth : nextMonth;
    });
  }

  function selectDay(day) {
    const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);

    if (date < today) {
      return;
    }

    setSelectedDate(date);
    setIsOpen(false);
    onChange?.(toDateValue(date));
    triggerRef.current?.focus();
  }

  return (
    <div ref={pickerRef} className="relative grid w-full max-w-[340px] gap-2 text-sm font-bold text-[#191925]">
      <span>{label}</span>
      <input
        type="text"
        name={name}
        value={selectedValue}
        required={required}
        readOnly
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />
      <button
        ref={triggerRef}
        type="button"
        aria-label={`${label}: ${displayValue}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-describedby={error ? errorId : undefined}
        onClick={() => setIsOpen((current) => !current)}
        className={`flex h-14 w-full items-center justify-between border bg-white/55 px-4 text-left font-normal outline-none transition-colors hover:border-[#8B8B98] focus:border-[#313152] ${error ? "border-red-600" : "border-[#C9C8D0]"}`}
      >
        <span className={selectedDate ? "text-[#191925]" : "text-[#8B8B98]"}>
          {displayValue}
        </span>
        <CalendarDays aria-hidden="true" size={20} className="shrink-0 text-[#6F7080]" />
      </button>
      {error && (
        <span id={errorId} role="alert" className="font-normal text-red-700">
          {error}
        </span>
      )}

      {isOpen && (
        <div
          role="dialog"
          aria-label={label}
          className="absolute left-0 top-full z-30 mt-2 w-full min-w-[280px] max-w-[340px] border border-[#D9D8DE] bg-white p-4 font-normal shadow-[0_18px_45px_rgba(25,25,37,0.18)]"
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label={labels.previous}
              disabled={previousMonthDisabled}
              onClick={() => changeMonth(-1)}
              className="flex h-9 w-9 items-center justify-center text-[#313152] transition-colors hover:bg-[#EDECF0] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft aria-hidden="true" size={18} />
            </button>
            <p className="font-extrabold capitalize text-[#191925]">
              {monthFormatter.format(visibleMonth)}
            </p>
            <button
              type="button"
              aria-label={labels.next}
              onClick={() => changeMonth(1)}
              className="flex h-9 w-9 items-center justify-center text-[#313152] transition-colors hover:bg-[#EDECF0]"
            >
              <ChevronRight aria-hidden="true" size={18} />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 text-center text-[11px] font-bold uppercase text-[#8B8B98]">
            {weekdays.map((weekday, index) => (
              <span key={`${weekday}-${index}`} className="py-2">
                {weekday}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 text-center">
            {calendarDays.map((day, index) => {
              if (!day) return <span key={`empty-${index}`} />;

              const value = new Date(
                visibleMonth.getFullYear(),
                visibleMonth.getMonth(),
                day,
              );
              const isSelected = selectedDate && toDateValue(value) === selectedValue;
              const isPast = value < today;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isPast}
                  aria-pressed={Boolean(isSelected)}
                  onClick={() => selectDay(day)}
                  className={`aspect-square text-sm transition-colors ${
                    isPast
                      ? "cursor-not-allowed text-[#B9B8C2]"
                      : isSelected
                      ? "bg-[#AE2422] font-bold text-white"
                      : "text-[#313152] hover:bg-[#EDECF0]"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
