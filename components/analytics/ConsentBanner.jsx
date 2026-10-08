export default function ConsentBanner({ content, onAccept, onDecline }) {
  return (
    <section
      role="region"
      aria-labelledby="analytics-consent-title"
      aria-describedby="analytics-consent-description"
      className="fixed inset-x-2 bottom-2 z-[100] mx-auto max-w-5xl rounded-lg border border-[#D9D8DE] bg-white p-3 text-[#191925] shadow-[0_16px_45px_rgba(25,25,37,0.2)] sm:inset-x-4 sm:bottom-4 sm:p-4 md:flex md:items-center md:gap-6"
    >
      <div className="min-w-0 flex-1">
        <h2 id="analytics-consent-title" className="text-sm font-extrabold text-[#313152] sm:text-base">
          {content.title}
        </h2>
        <p id="analytics-consent-description" className="mt-1 text-xs leading-5 text-[#6F7080] sm:text-sm">
          {content.description}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 md:mt-0 md:w-auto md:shrink-0">
        <button
          type="button"
          onClick={onDecline}
          className="min-h-10 rounded-md bg-[#313152] px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-[#252541] md:min-w-36"
        >
          {content.decline}
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="min-h-10 rounded-md bg-[#AE2422] px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-[#92201E] md:min-w-36"
        >
          {content.accept}
        </button>
      </div>
    </section>
  );
}
