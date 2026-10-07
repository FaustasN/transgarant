"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { jobApplyProps } from "@/lib/analytics/core.mjs";
import { useFormSubmit } from "@/lib/useFormSubmit";
import { fieldLimits, validateCareerForm } from "@/lib/validation/careers";
import ApplicationForm from "./ApplicationForm";
import DetailList from "./DetailList";

export default function CareerApplication({ content, locale }) {
  const jobs = content.positions.items;
  const [selectedRole, setSelectedRole] = useState(jobs[0]?.id ?? "");
  const [activeRole, setActiveRole] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const formSectionRef = useRef(null);
  const form = useFormSubmit({
    endpoint: "/api/careers",
    formName: "career",
    locale,
    fieldLimits,
    multiline: ["message"],
    json: false,
    focusFirstError: true,
    validate: (fields, formData) =>
      validateCareerForm(
        fields,
        formData.get("cv"),
        new Set(jobs.map((job) => job.id)),
        content.application.validation,
      ),
    trackParams: (fields) => ({ job_id: fields.role }),
  });

  useEffect(() => {
    const jobElements = document.querySelectorAll("[data-career-job]");
    const jobObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) setActiveRole(visibleEntry.target.dataset.careerJob);
      },
      { rootMargin: "-24% 0px -58% 0px", threshold: 0 },
    );

    jobElements.forEach((element) => jobObserver.observe(element));

    const formObserver = new IntersectionObserver(
      ([entry]) => {
        const formHasBeenReached =
          entry.isIntersecting || entry.boundingClientRect.top < 0;
        setFormVisible(formHasBeenReached);
      },
      { threshold: 0.12 },
    );
    if (formSectionRef.current) formObserver.observe(formSectionRef.current);

    return () => {
      jobObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  function selectRole(roleId) {
    setSelectedRole(roleId);
    form.clearError("role");
  }

  function applyFor(roleId) {
    selectRole(roleId);
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const activeJob = jobs.find((job) => job.id === activeRole);

  return (
    <>
      <section className="px-5 pb-10 sm:px-8 sm:pb-12 lg:px-10 lg:pb-14">
        <div className="mx-auto max-w-[1200px]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#AE2422]">
              {content.positions.eyebrow}
            </p>
            <div className="mt-3 border-t border-[#D9D8DE]" />
            <h2 className="mt-4 hidden max-w-2xl text-[clamp(24px,2.5vw,34px)] font-extrabold leading-[1.12] tracking-[-0.035em] lg:block">
              {content.positions.title}
            </h2>
          </div>

          {jobs.map((job) => (
            <article
              key={job.id}
              id={job.id}
              data-career-job={job.id}
              className="scroll-mt-24 border-b border-[#D9D8DE] py-14 sm:py-16 lg:grid lg:grid-cols-[280px_1fr] lg:gap-16 lg:py-20"
            >
              <div>
                <h2 className="max-w-sm text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.08] tracking-[-0.035em] text-balance lg:-mt-1">
                  {job.title}
                </h2>
                <button
                  type="button"
                  {...jobApplyProps(job.id, "career_listing")}
                  onClick={() => applyFor(job.id)}
                  className="group mt-8 inline-flex items-center gap-3 py-2 text-base font-bold text-[#191925]"
                >
                  {content.positions.apply}
                  <ArrowRight
                    aria-hidden="true"
                    size={19}
                    className="transition-transform duration-300 group-hover:translate-x-1.5"
                  />
                </button>
              </div>

              <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:mt-0 lg:grid-cols-3 lg:gap-0">
                <DetailList
                  label={content.positions.responsibilitiesLabel}
                  items={job.responsibilities}
                  className="lg:pr-9 xl:pr-12"
                />
                <DetailList
                  label={content.positions.requirementsLabel}
                  items={job.requirements}
                  className="lg:border-l lg:border-[#D9D8DE] lg:px-9 xl:px-12"
                />
                <DetailList
                  label={content.positions.offerLabel}
                  items={job.offer}
                  className="lg:border-l lg:border-[#D9D8DE] lg:pl-9 xl:pl-12"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <ApplicationForm
        content={content.application}
        jobs={jobs}
        selectedRole={selectedRole}
        onSelectRole={selectRole}
        form={form}
        sectionRef={formSectionRef}
      />

      {activeJob && !formVisible ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E3E2E7] bg-[#F6F5F2]/96 px-5 py-3 shadow-[0_-10px_30px_rgba(25,25,37,0.08)] backdrop-blur sm:px-7 lg:hidden">
          <button
            type="button"
            {...jobApplyProps(activeJob.id, "career_sticky")}
            onClick={() => applyFor(activeJob.id)}
            className="flex w-full items-center justify-between gap-4 py-1 text-left"
          >
            <span className="min-w-0">
              <span className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#AE2422]">
                {content.application.stickyApply}
              </span>
              <span className="mt-0.5 block truncate text-sm font-bold text-[#191925]">
                {activeJob.title}
              </span>
            </span>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center">
              <ArrowRight aria-hidden="true" size={20} />
            </span>
          </button>
        </div>
      ) : null}
    </>
  );
}
