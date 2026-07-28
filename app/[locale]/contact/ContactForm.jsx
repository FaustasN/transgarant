"use client";

import { ArrowRight } from "lucide-react";

export default function ContactForm({ content }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const body = [
      `${content.name}: ${formData.get("name") ?? ""}`,
      `${content.email}: ${formData.get("email") ?? ""}`,
      `${content.phone}: ${formData.get("phone") ?? ""}`,
      "",
      `${content.message}:`,
      `${formData.get("message") ?? ""}`,
    ].join("\n");

    window.location.href = `mailto:info@transgarant.lt?subject=${encodeURIComponent(content.subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-[#191925]">
          {content.name}
          <input
            required
            name="name"
            autoComplete="name"
            placeholder={content.namePlaceholder}
            className="h-14 border border-[#C9C8D0] bg-white/55 px-4 font-normal text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152]"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#191925]">
          {content.email}
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder={content.emailPlaceholder}
            className="h-14 border border-[#C9C8D0] bg-white/55 px-4 font-normal text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152]"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#191925] sm:col-span-2">
          {content.phone}
          <input
            required
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder={content.phonePlaceholder}
            className="h-14 border border-[#C9C8D0] bg-white/55 px-4 font-normal text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152]"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#191925] sm:col-span-2">
          {content.message}
          <textarea
            required
            name="message"
            rows={5}
            placeholder={content.messagePlaceholder}
            className="resize-y border border-[#C9C8D0] bg-white/55 px-4 py-4 font-normal leading-7 text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152]"
          />
        </label>
      </div>

      <button
        type="submit"
        className="group mt-8 flex h-14 w-full items-center justify-center gap-3 bg-[#313152] px-6 font-extrabold text-white transition-colors hover:bg-[#252541] sm:w-auto"
      >
        {content.submit}
        <ArrowRight
          aria-hidden="true"
          size={19}
          className="transition-transform duration-300 group-hover:translate-x-1.5"
        />
      </button>
    </form>
  );
}
