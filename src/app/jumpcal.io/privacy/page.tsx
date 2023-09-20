/* eslint-disable react/no-unescaped-entities */
import MaxWidthContainer from "@/components/app/max-width-container";
import { makeMetadata } from "@/lib/utils";

export const metadata = makeMetadata({
  title: "Jumpcal | Privacy",
});

const PrivacyPage = () => {
  return (
    <MaxWidthContainer className="py-10">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">PRIVACY POLICY</h1>
        <p className="text-gray-600">Last updated September 20, 2023</p>

        <section className="space-y-4">
          <p>
            This privacy notice for Perit LLC ("we," "us," or "our") describes
            how and why we might collect, store, use, and/or share ("process")
            your information when you use our services ("Services"), such as
            when you:
          </p>
          <ul className="list-disc pl-5">
            <li>
              Visit our website at{" "}
              <a href="https://jumpcal.io" className="text-blue-600 underline">
                https://jumpcal.io
              </a>
              , or any website of ours that links to this privacy notice
            </li>
            <li>
              Engage with us in other related ways, including any sales,
              marketing, or events
            </li>
          </ul>
          <p>
            Questions or concerns? Reading this privacy notice will help you
            understand your privacy rights and choices. If you do not agree with
            our policies and practices, please do not use our Services. If you
            still have any questions or concerns, please contact us at{" "}
            <a
              href="mailto:horris@jumpcal.io"
              className="text-blue-600 underline"
            >
              horris@jumpcal.io
            </a>
            .
          </p>
        </section>

        <section className="border-t pt-4 space-y-4">
          <h2 className="text-xl font-semibold">
            1. WHAT INFORMATION DO WE COLLECT?
          </h2>
          <h3 className="text-lg font-medium">
            Personal information you disclose to us
          </h3>
          <p>
            In Short: We collect personal information that you provide to us.
          </p>
          <p>
            We collect personal information that you voluntarily provide to us
            when you register on the Services, express an interest in obtaining
            information about us or our products and Services, when you
            participate in activities on the Services, or otherwise when you
            contact us.
          </p>
          <p>
            Personal Information Provided by You. The personal information that
            we collect depends on the context of your interactions with us and
            the Services, the choices you make, and the products and features
            you use. The personal information we collect may include the
            following: names, phone numbers, email addresses, usernames.
          </p>
          <p>Sensitive Information. We do not process sensitive information.</p>
          <p>
            Payment Data. We may collect data necessary to process your payment
            if you make purchases, such as your payment instrument number, and
            the security code associated with your payment instrument. All
            payment data is stored by Stripe. You may find their privacy notice
            link(s) here:{" "}
            <a
              href="http://www.stripe.com/privacy"
              className="text-blue-600 underline"
            >
              http://www.stripe.com/privacy
            </a>
            .
          </p>
          <p>
            Social Media Login Data. We may provide you with the option to
            register with us using your existing social media account details,
            like your Facebook, Twitter, or other social media account. If you
            choose to register in this way, we will collect the information
            described in the section called "HOW DO WE HANDLE YOUR SOCIAL
            LOGINS?" below.
          </p>
          <p>
            All personal information that you provide to us must be true,
            complete, and accurate, and you must notify us of any changes to
            such personal information.
          </p>
        </section>

        <section className="border-t pt-4 space-y-4">
          <h2 className="text-xl font-semibold">
            2. HOW DO WE PROCESS YOUR INFORMATION?
          </h2>
          <p>
            In Short: We process your information to provide, improve, and
            administer our Services, communicate with you, for security and
            fraud prevention, and to comply with law. We may also process your
            information for other purposes with your consent.
          </p>
          <p>
            We process your personal information for a variety of reasons,
            depending on how you interact with our Services, including: To
            facilitate account creation and authentication and otherwise manage
            user accounts. We may process your information so you can create and
            log in to your account, as well as keep your account in working
            order.
          </p>
          <p>
            To save or protect an individual's vital interest. We may process
            your information when necessary to save or protect an individual’s
            vital interest, such as to prevent harm.
          </p>
        </section>
        <section className="border-t pt-4 space-y-4">
          <h2 className="text-xl font-semibold">
            3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?
          </h2>
          <p>
            In Short: We only process your personal information when we believe
            it is necessary and we have a valid legal reason (i.e., legal basis)
            to do so under applicable law, like with your consent, to comply
            with laws, to provide you with services to enter into or fulfill our
            contractual obligations, to protect your rights, or to fulfill our
            legitimate business interests.
          </p>

          <p>
            If you are located in the EU or UK, this section applies to you.
          </p>
          <p>
            The General Data Protection Regulation (GDPR) and UK GDPR require us
            to explain the valid legal bases we rely on in order to process your
            personal information. As such, we may rely on the following legal
            bases to process your personal information: Consent, Legal
            Obligations, and Vital Interests.
          </p>

          <p>If you are located in Canada, this section applies to you.</p>
          <p>
            We may process your information if you have given us specific
            permission (i.e., express consent) to use your personal information
            for a specific purpose, or in situations where your permission can
            be inferred (i.e., implied consent). There are also certain
            exceptional cases where we might process your information without
            your consent.
          </p>
        </section>

        <section className="border-t pt-4 space-y-4">
          <h2 className="text-xl font-semibold">
            4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
          </h2>
          <p>
            In Short: We may share information in specific situations described
            in this section and/or with the following third parties.
          </p>
          <p>
            We may need to share your personal information in the following
            situations: Business Transfers.
          </p>
        </section>

        <section className="border-t pt-4 space-y-4">
          <h2 className="text-xl font-semibold">
            5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
          </h2>
          <p>
            In Short: If you choose to register or log in to our Services using
            a social media account, we may have access to certain information
            about you.
          </p>
          <p>
            Our Services offer you the ability to register and log in using your
            third-party social media account details. Depending on the platform,
            we might receive certain profile information about you from your
            social media provider.
          </p>
        </section>

        <section className="border-t pt-4 space-y-4">
          <h2 className="text-xl font-semibold">
            6. HOW LONG DO WE KEEP YOUR INFORMATION?
          </h2>
          <p>
            In Short: We keep your information for as long as necessary to
            fulfill the purposes outlined in this privacy notice unless
            otherwise required by law.
          </p>
          <p>
            We will only keep your personal information for as long as
            necessary. No purpose in this notice will require us keeping your
            personal information for longer than the period in which users have
            an account with us.
          </p>
        </section>

        <section className="border-t pt-4 space-y-4">
          <h2 className="text-xl font-semibold">
            7. HOW DO WE KEEP YOUR INFORMATION SAFE?
          </h2>
          <p>
            In Short: We aim to protect your personal information through a
            system of organizational and technical security measures.
          </p>
          <p>
            We have implemented appropriate and reasonable technical and
            organizational security measures designed to protect the security of
            any personal information we process. However, despite our safeguards
            and efforts to secure your information, no electronic transmission
            over the Internet or information storage technology can be
            guaranteed to be 100% secure, so we cannot promise or guarantee that
            hackers, cybercriminals, or other unauthorized third parties will
            not be able to defeat our security and improperly collect, access,
            steal, or modify your information. Although we will do our best to
            protect your personal information, transmission of personal
            information to and from our Services is at your own risk. You should
            only access the Services within a secure environment.
          </p>
        </section>

        <section className="border-t pt-4 space-y-4">
          <h2 className="text-xl font-semibold">
            8. DO WE COLLECT INFORMATION FROM MINORS?
          </h2>
          <p>
            In Short: We do not knowingly collect data from or market to
            children under 18 years of age.
          </p>
          <p>
            We do not knowingly solicit data from or market to children under 18
            years of age. By using the Services, you represent that you are at
            least 18 or that you are the parent or guardian of such a minor and
            consent to such minor dependent&apos;s use of the Services. If we
            learn that personal information from users less than 18 years of age
            has been collected, we will deactivate the account and take
            reasonable measures to promptly delete such data from our records.
            If you become aware of any data we may have collected from children
            under age 18, please contact us at horris@jumpcal.io.
          </p>
        </section>

        <section className="border-t pt-4 space-y-4">
          <h2 className="text-xl font-semibold">
            9. WHAT ARE YOUR PRIVACY RIGHTS?
          </h2>
          <p>
            In Short: In some regions, such as the European Economic Area (EEA),
            United Kingdom (UK), Switzerland, and Canada, you have rights that
            allow you greater access to and control over your personal
            information. You may review, change, or terminate your account at
            any time.
          </p>
          <p>
            In some regions (like the EEA, UK, Switzerland, and Canada), you
            have certain rights under applicable data protection laws. These may
            include the right (i) to request access and obtain a copy of your
            personal information, (ii) to request rectification or erasure;
            (iii) to restrict the processing of your personal information; (vi)
            if applicable, to data portability; and (vii) not to be subject to
            automated decision-making. In certain circumstances, you may also
            have the right to object to the processing of your personal
            information. You can make such a request by contacting us by using
            the contact details provided in the section "HOW CAN YOU CONTACT US
            ABOUT THIS NOTICE?" below.
          </p>
          <p>
            We will consider and act upon any request in accordance with
            applicable data protection laws. If you are located in the EEA or UK
            and you believe we are unlawfully processing your personal
            information, you also have the right to complain to your Member
            State data protection authority or UK data protection authority. If
            you are located in Switzerland, you may contact the Federal Data
            Protection and Information Commissioner. Withdrawing your consent:
            If we are relying on your consent to process your personal
            information, which may be express and/or implied consent depending
            on the applicable law, you have the right to withdraw your consent
            at any time. You can withdraw your consent at any time by contacting
            us by using the contact details provided in the section "HOW CAN YOU
            CONTACT US ABOUT THIS NOTICE?" below.
          </p>
          <p>
            However, please note that this will not affect the lawfulness of the
            processing before its withdrawal nor, when applicable law allows,
            will it affect the processing of your personal information conducted
            in reliance on lawful processing grounds other than consent. Opting
            out of marketing and promotional communications: You can unsubscribe
            from our marketing and promotional communications at any time by
            clicking on the unsubscribe link in the emails that we send, or by
            contacting us using the details provided in the section "HOW CAN YOU
            CONTACT US ABOUT THIS NOTICE?" below. You will then be removed from
            the marketing lists. However, we may still communicate with you —
            for example, to send you service-related messages that are necessary
            for the administration and use of your account, to respond to
            service requests, or for other non-marketing purposes. Account
            Information: If you would at any time like to review or change the
            information in your account or terminate your account, you can log
            in to your account settings and update your user account. Upon your
            request to terminate your account, we will deactivate or delete your
            account and information from our active databases. However, we may
            retain some information in our files to prevent fraud, troubleshoot
            problems, assist with any investigations, enforce our legal terms
            and/or comply with applicable legal requirements. If you have
            questions or comments about your privacy rights, you may email us at
            horris@jumpcal.io.
          </p>
        </section>

        <section className="border-t pt-4 space-y-4">
          <h2 className="text-xl font-semibold">
            10. CONTROLS FOR DO-NOT-TRACK FEATURES
          </h2>
          <p>
            Most web browsers and some mobile operating systems and mobile
            applications include a Do-Not-Track ("DNT") feature or setting you
            can activate to signal your privacy preference not to have data
            about your online browsing activities monitored and collected. At
            this stage, no uniform technology standard for recognizing and
            implementing DNT signals has been finalized. As such, we do not
            currently respond to DNT browser signals or any other mechanism that
            automatically communicates your choice not to be tracked online. If
            a standard for online tracking is adopted that we must follow in the
            future, we will inform you about that practice in a revised version
            of this privacy notice.
          </p>
        </section>
      </div>
    </MaxWidthContainer>
  );
};

export default PrivacyPage;
