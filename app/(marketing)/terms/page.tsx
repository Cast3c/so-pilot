import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Terms of Service | ${site.name}`,
  description: `The terms that apply when you use ${site.name}.`,
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated={site.legalUpdated}>
      <LegalSection title="1. Acceptance">
        <p>
          By creating an account or using {site.name} you agree to these terms.
          If you do not agree, please do not use the service.
        </p>
      </LegalSection>

      <LegalSection title="2. The service">
        <p>
          {site.name} lets you write, schedule and publish posts to social media
          accounts you connect, and manage replies to comments. Features may
          change over time, and some may depend on the availability and rules of
          third-party platforms.
        </p>
      </LegalSection>

      <LegalSection title="3. Your account">
        <ul>
          <li>You must provide accurate information and keep your sign-in secure.</li>
          <li>You are responsible for activity that happens under your account.</li>
          <li>You may only connect social accounts that you own or are authorized to manage.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Third-party platforms">
        <p>
          When you connect a social account you authorize {site.name} to act on
          your behalf within the permissions you approve. Your use of each
          platform remains subject to that platform&apos;s own terms and
          policies, and you must comply with them. We are not responsible for
          changes, outages, limits or decisions made by those platforms,
          including suspending or restricting your account.
        </p>
      </LegalSection>

      <LegalSection title="5. Your content">
        <p>
          You keep ownership of the content you create and upload. You are
          responsible for it and confirm you have the rights to publish it. You
          give us the permission needed to store it and to publish it to the
          accounts you choose.
        </p>
      </LegalSection>

      <LegalSection title="6. Acceptable use">
        <p>You agree not to use the service to:</p>
        <ul>
          <li>Publish illegal, harmful, deceptive or infringing content.</li>
          <li>Send spam or run automated replies that harass or mislead people.</li>
          <li>Break the rules or technical limits of any connected platform.</li>
          <li>Attempt to disrupt, reverse engineer or gain unauthorized access to the service.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Availability">
        <p>
          We work to keep {site.name} available and publishing on time, but we
          do not guarantee uninterrupted operation. Scheduled posts may be
          delayed or fail because of problems on our side or on a connected
          platform.
        </p>
      </LegalSection>

      <LegalSection title="8. Termination">
        <p>
          You can stop using the service and disconnect your accounts at any
          time. We may suspend or end access if these terms are violated or to
          protect the service and other users.
        </p>
      </LegalSection>

      <LegalSection title="9. Disclaimer and liability">
        <p>
          The service is provided &quot;as is&quot; without warranties of any
          kind. To the extent permitted by law, {site.name} is not liable for
          indirect or consequential damages, or for loss of data, audience or
          revenue arising from the use of the service.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes and contact">
        <p>
          We may update these terms; the date at the top shows the latest
          version. Continued use after a change means you accept it. Questions:{" "}
          <a className="underline" href={`mailto:${site.contactEmail}`}>
            {site.contactEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
