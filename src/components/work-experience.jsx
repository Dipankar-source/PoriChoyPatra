import {
  BriefcaseBusinessIcon,
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  CodeXmlIcon,
  DraftingCompassIcon,
  GraduationCapIcon,
} from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const iconMap = {
  code: CodeXmlIcon,
  design: DraftingCompassIcon,
  business: BriefcaseBusinessIcon,
  education: GraduationCapIcon,
};

export function WorkExperience({ className, experiences }) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-[#0a0a0a] px-4 text-gray-900 dark:text-gray-100",
        className
      )}
    >
      {experiences.map((experience) => (
        <ExperienceItem key={experience.id} experience={experience} />
      ))}
    </div>
  );
}

export function ExperienceItem({ experience }) {
  return (
    <div className="space-y-4 py-4">
      <div className="not-prose flex items-center gap-3">
        <div
          className="flex size-6 shrink-0 items-center justify-center"
          aria-hidden
        >
          {experience.companyLogo ? (
              <img
                src={experience.companyLogo}
                alt={experience.companyName}
                loading="lazy"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover"
              />
          ) : (
            <span className="flex size-2 rounded-full bg-gray-300 dark:bg-gray-600" />
          )}
        </div>

        <h3 className="text-lg  font-medium text-gray-900 dark:text-white leading-loose">
          {experience.companyName}
        </h3>

        {experience.isCurrentEmployer && (
          <span className="relative flex items-center justify-center">
            <span className="absolute inline-flex size-3 animate-ping rounded-full bg-blue-500 opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-blue-500" />
            <span className="sr-only">Current Employer</span>
          </span>
        )}
      </div>
      <div className="relative space-y-4 before:absolute before:left-3 before:h-full before:w-px before:bg-gray-200 dark:before:bg-gray-700">
        {experience.positions.map((position) => (
          <ExperiencePositionItem key={position.id} position={position} />
        ))}
      </div>
    </div>
  );
}

export function ExperiencePositionItem({ position }) {
  const ExperienceIcon = iconMap[position.icon || "business"];

  return (
    <Collapsible defaultOpen={position.isExpanded} asChild>
      <div className="relative last:before:absolute last:before:h-full last:before:w-1">
        <CollapsibleTrigger
          className={cn(
            "group/experience not-prose block w-full text-left select-none",
            "relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:rounded-lg hover:before:bg-gray-100 dark:hover:before:bg-gray-800"
          )}
        >
          <div className="relative z-1 mb-1 flex items-center gap-3">
            <div className="flex size-7.5 p-1 border-1 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-400 text-gray-700 dark:text-gray-300">
              <div
                className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                aria-hidden
              >
                <ExperienceIcon className="size-4" />
              </div>
            </div>

            <h4 className="flex-1 text-base font-medium text-balance text-gray-900 dark:text-white">
              {position.title}
            </h4>

            <div
              className="shrink-0 text-gray-500 dark:text-gray-400 [&_svg]:size-4"
              aria-hidden
            >
              <ChevronsDownUpIcon className="hidden group-data-[state=open]/experience:block" />
              <ChevronsUpDownIcon className="hidden group-data-[state=closed]/experience:block" />
            </div>
          </div>

          <div className="relative z-1 flex items-center gap-2 pl-9 text-sm text-gray-600 dark:text-gray-400">
            {position.employmentType && (
              <>
                <dl>
                  <dt className="sr-only">Employment Type</dt>
                  <dd>{position.employmentType}</dd>
                </dl>

                <Separator
                  className="data-[orientation=vertical]:h-4 bg-gray-300 dark:bg-gray-600"
                  orientation="vertical"
                />
              </>
            )}

            <dl>
              <dt className="sr-only">Employment Period</dt>
              <dd>{position.employmentPeriod}</dd>
            </dl>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          {position.description && (
            <Prose className="pt-2 pl-9">
              <ReactMarkdown>{position.description}</ReactMarkdown>
            </Prose>
          )}

          {Array.isArray(position.skills) && position.skills.length > 0 && (
            <ul className="not-prose flex flex-wrap gap-1.5 pt-2 pl-9">
              {position.skills.map((skill, index) => (
                <li key={index} className="flex">
                  <Skill>{skill}</Skill>
                </li>
              ))}
            </ul>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function Prose({ className, ...props }) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none font-mono text-gray-700 dark:text-gray-300 prose-zinc dark:prose-invert",
        "prose-a:font-medium prose-a:wrap-break-word prose-a:text-gray-900 dark:prose-a:text-white prose-a:underline prose-a:underline-offset-4",
        "prose-code:rounded-md prose-code:border prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-code:border-gray-200 dark:prose-code:border-gray-700 prose-code:text-gray-800 dark:prose-code:text-gray-200",
        className
      )}
      {...props}
    />
  );
}

function Skill({ className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 font-mono text-xs text-gray-700 dark:text-gray-300",
        className
      )}
      {...props}
    />
  );
}
