import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Data deletion | ${site.name}`,
};

export default async function DataDeletionPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <LegalPage title="Data deletion" updated={site.legalUpdated}>
      {code && (
        <LegalSection title="Your request">
          <p>
            We received your data deletion request and the data associated with
            your connected account has been deleted.
          </p>
          <p>
            Confirmation code: <strong>{code}</strong>
          </p>
        </LegalSection>
      )}

      <LegalSection title="How to delete your data">
        <ul>
          <li>Disconnect your account from the Accounts page: its access tokens are deleted immediately.</li>
          <li>
            Remove {site.name} from your social network&apos;s connected apps
            settings and request deletion: we delete your account, posts and
            media automatically.
          </li>
          <li>
            Or email{" "}
            <a className="underline" href={`mailto:${site.contactEmail}`}>
              {site.contactEmail}
            </a>{" "}
            and we will delete your data within 30 days.
          </li>
        </ul>
      </LegalSection>
    </LegalPage>
  );
}
