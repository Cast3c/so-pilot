import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${site.name}`,
  description: `How ${site.name} collects, uses and protects your data.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated={site.legalUpdated}>
      <LegalSection title="1. Who we are">
        <p>
          {site.name} is a web application that lets you write, schedule and
          publish posts to the social media accounts you connect, and manage
          replies to comments. This policy explains what data we handle and why.
        </p>
        <p>
          Contact:{" "}
          <a className="underline" href={`mailto:${site.contactEmail}`}>
            {site.contactEmail}
          </a>
        </p>
      </LegalSection>

      <LegalSection title="2. Data we collect">
        <ul>
          <li>
            <strong>Account data:</strong> your name, email address and sign-in
            method, managed by our authentication provider.
          </li>
          <li>
            <strong>Connected social accounts:</strong> when you connect an
            account (for example Threads) we receive its identifier, username,
            profile picture and an access token that lets {site.name} act on
            your behalf within the permissions you approve.
          </li>
          <li>
            <strong>Content you create:</strong> post text, images and videos
            you upload, and the schedule you choose.
          </li>
          <li>
            <strong>Comments on your posts:</strong> only when you enable the
            automatic reply feature, so we can detect keywords and reply.
          </li>
          <li>
            <strong>Technical data:</strong> basic server logs needed to run and
            secure the service.
          </li>
        </ul>
        <p>We do not sell your data and we do not use it for advertising.</p>
      </LegalSection>

      <LegalSection title="3. How we use your data">
        <ul>
          <li>To authenticate you and show you only your own data.</li>
          <li>To publish or schedule the posts you create.</li>
          <li>To show the status and history of your posts.</li>
          <li>To reply to comments according to the rules you define.</li>
          <li>To keep the service secure and fix problems.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Access tokens and security">
        <p>
          Access tokens issued by social networks are stored encrypted in our
          database and are only decrypted on our servers at the moment they are
          needed to publish or reply. Tokens are never sent to your browser. We
          only request the permissions required for the features you use.
        </p>
      </LegalSection>

      <LegalSection title="5. Service providers">
        <p>We rely on third parties to operate the service:</p>
        <ul>
          <li>Authentication and user management.</li>
          <li>Database hosting.</li>
          <li>Application hosting.</li>
          <li>Image and video storage.</li>
          <li>The social networks you connect, which process the content you publish under their own terms and privacy policies.</li>
        </ul>
        <p>
          These providers process data only to provide their services to us.
        </p>
      </LegalSection>

      <LegalSection title="6. Retention and deletion">
        <p>
          We keep your data while your account is active. When you disconnect a
          social account, we delete its access tokens right away. You can ask us
          to delete your data, including your post history and uploaded media,
          at any time, and we will do so without undue delay and within 30 days.
        </p>
        <p>
          If a social network notifies us that you removed our app or asked for
          your data to be deleted, we delete the data associated with that
          account automatically. You can also email us at{" "}
          <a className="underline" href={`mailto:${site.contactEmail}`}>
            {site.contactEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="7. Your rights">
        <p>
          You can request access to, correction of, or deletion of your personal
          data, and you can disconnect any social account at any time from the
          Accounts page. Contact us to exercise these rights.
        </p>
      </LegalSection>

      <LegalSection title="8. Children">
        <p>
          {site.name} is not intended for people under 16, and we do not
          knowingly collect their data.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to this policy">
        <p>
          We may update this policy. The date at the top shows the latest
          version. Significant changes will be announced in the application.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
