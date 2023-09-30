import { Anchor, Grid, Paper, Stack, Text, Title } from "@mantine/core";
import React from "react";

const TermsAndConditions = () => {
  const handleLinkClick = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const sections: string[] = [
    "OUR SERVICES",
    "INTELLECTUAL PROPERTY RIGHTS",
    "USER REPRESENTATIONS",
    "USER REGISTRATION",
    "PURCHASES AND PAYMENT",
    "CANCELLATION",
    "PROHIBITED ACTIVITIES",
    "USER GENERATED CONTRIBUTIONS",
    "CONTRIBUTION LICENSE",
    "MOBILE APPLICATION LICENSE",
    "SERVICES MANAGEMENT",
    "PRIVACY POLICY",
    "TERM AND TERMINATION",
    "MODIFICATIONS AND INTERRUPTIONS",
    "GOVERNING LAW",
    "DISPUTE RESOLUTION",
    "CORRECTIONS",
    "DISCLAIMER",
    "LIMITATIONS OF LIABILITY",
    "INDEMNIFICATION",
    "USER DATA",
    "ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES",
    "MISCELLANEOUS",
    "CONTACT US",
  ];

  return (
    <Paper p="md">
      <Grid>
        {/* Table of Content */}
        <Grid.Col span={2}>
          <Stack>
            {sections.map((s, i) => {
              return (
                <Anchor key={s + i} size="sm" onClick={() => handleLinkClick(`section-${i + 1}`)}>
                  {i + 1}. {s}
                </Anchor>
              );
            })}
          </Stack>
        </Grid.Col>

        {/* Main Content */}
        <Grid.Col span={10}>
          {/* Header */}
          <Title order={2} mb="md">
            TERMS OF SERVICE
          </Title>

          <Text weight="bold">Last updated August 24, 2023</Text>

          <Title my="xl" order={4}>
            AGREEMENT TO OUR LEGAL TERMS
          </Title>
          <Stack>
            <Text>
              We are Les Logiciels Hexadesk, doing business as Hexadesk (
              <b>"Company," "we," "us," "our"</b>), a company registered in Canada at 1211 17e
              avenue, Pointe-Aux-Trembles, Montreal, Quebec H1B 3L2.
            </Text>

            <Text>
              We operate the website
              <Anchor href="https://mantine.dev/" target="_blank">
                https://www.hexadesk.ca
              </Anchor>
              (the <b>"Site"</b>), the mobile application Hexadesk (the <b>"App"</b>), as well as
              any other related products and services that refer or link to these legal terms (the
              <b>"Legal Terms"</b>) (collectively, the <b>"Services"</b>).
            </Text>

            <Text>
              You can contact us by email at info@hexadesk.io or by mail to C.P. 32, Montreal,
              Quebec H1B 5K1, Canada.
            </Text>
            <Text>
              These Legal Terms constitute a legally binding agreement made between you, whether
              personally or on behalf of an entity ("you"), and Les Logiciels Hexadesk, concerning
              your access to and use of the Services. You agree that by accessing the Services, you
              have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO
              NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING
              THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
            </Text>
            <Text>
              We will provide you with prior notice of any scheduled changes to the Services you are
              using. The modified Legal Terms will become effective upon posting or notifying you by
              notification@hexadesk.io, as stated in the email message. By continuing to use the
              Services after the effective date of any changes, you agree to be bound by the
              modified terms.
            </Text>
            <Text>
              The Services are intended for users who are at least 18 years old. Persons under the
              age of 18 are not permitted to use or register for the Services.
            </Text>
            <Text>
              The Services are intended for users who are at least 18 years old. Persons under the
              age of 18 are not permitted to use or register for the Services.
            </Text>
          </Stack>

          {/* Main Points */}

          <Stack my="xl">
            <Title order={5} id="section-1">
              1. OUR SERVICES
            </Title>
            <Text>
              The information provided when using the Services is not intended for distribution to
              or use by any person or entity in any jurisdiction or country where such distribution
              or use would be contrary to law or regulation or which would subject us to any
              registration requirement within such jurisdiction or country. Accordingly, those
              persons who choose to access the Services from other locations do so on their own
              initiative and are solely responsible for compliance with local laws, if and to the
              extent local laws are applicable.
            </Text>
            <Title order={5} id="section-2">
              2. INTELLECTUAL PROPERTY RIGHTS
            </Title>
            <Title order={6}>Our intellectual property</Title>
            <Text>
              We are the owner or the licensee of all intellectual property rights in our Services,
              including all source code, databases, functionality, software, website designs, audio,
              video, text, photographs, and graphics in the Services (collectively, the "Content"),
              as well as the trademarks, service marks, and logos contained therein (the "Marks").
            </Text>
            <Text>
              Our Content and Marks are protected by copyright and trademark laws (and various other
              intellectual property rights and unfair competition laws) and treaties in the United
              States and around the world.
            </Text>
            <Text>
              The Content and Marks are provided in or through the Services "AS IS" for your
              internal business purpose only.
            </Text>
            <Title order={6}>Your use of our Services</Title>
            <Text>
              Subject to your compliance with these Legal Terms, including the
              <Anchor href="#">"PROHIBITED ACTIVITIES"</Anchor>
              section below, we grant you a non-exclusive, non-transferable, revocable license to:
            </Text>
            <ul style={{ marginLeft: "16px" }}>
              <li>* access the Services; and</li>
              <li>
                * download or print a copy of any portion of the Content to which you have properly
                gained access.
              </li>
            </ul>
            <Text> solely for your internal business purpose.</Text>
            <Text>
              Except as set out in this section or elsewhere in our Legal Terms, no part of the
              Services and no Content or Marks may be copied, reproduced, aggregated, republished,
              uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed,
              sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without
              our express prior written permission.
            </Text>
            <Text>
              If you wish to make any use of the Services, Content, or Marks other than as set out
              in this section or elsewhere in our Legal Terms, please address your request to:
              info@hexadesk.io. If we ever grant you the permission to post, reproduce, or publicly
              display any part of our Services or Content, you must identify us as the owners or
              licensors of the Services, Content, or Marks and ensure that any copyright or
              proprietary notice appears or is visible on posting, reproducing, or displaying our
              Content.
            </Text>
            <Text></Text>
            <Text>
              Any breach of these Intellectual Property Rights will constitute a material breach of
              our Legal Terms and your right to use our Services will terminate immediately.
            </Text>
            <Title order={6}>Your submissions and contributions</Title>
            <Text>
              Please review this section and the
              <Anchor href="#">"PROHIBITED ACTIVITIES"</Anchor> section carefully prior to using our
              Services to understand the (a) rights you give us and (b) obligations you have when
              you post or upload any content through the Services.
            </Text>
            <Text>
              <b>Submissions:</b> By directly sending us any question, comment, suggestion, idea,
              feedback, or other information about the Services ("Submissions"), you agree to assign
              to us all intellectual property rights in such Submission. You agree that we shall own
              this Submission and be entitled to its unrestricted use and dissemination for any
              lawful purpose, commercial or otherwise, without acknowledgment or compensation to
              you.
            </Text>
            <Text>
              <b>Contributions:</b> The Services may invite you to chat, contribute to, or
              participate in blogs, message boards, online forums, and other functionality during
              which you may create, submit, post, display, transmit, publish, distribute, or
              broadcast content and materials to us or through the Services, including but not
              limited to text, writings, video, audio, photographs, music, graphics, comments,
              reviews, rating suggestions, personal information, or other material
              ("Contributions"). Any Submission that is publicly posted shall also be treated as a
              Contribution.
            </Text>
            <Text>
              You understand that Contributions may be viewable by other users of the Services.
            </Text>
            <Text>
              <b>
                When you post Contributions, you grant us a license (including use of your name,
                trademarks, and logos):
              </b>
              By posting any Contributions, you grant us an unrestricted, unlimited, irrevocable,
              perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and
              license to: use, copy, reproduce, distribute, sell, resell, publish, broadcast,
              retitle, store, publicly perform, publicly display, reformat, translate, excerpt (in
              whole or in part), and exploit your Contributions (including, without limitation, your
              image, name, and voice) for any purpose, commercial, advertising, or otherwise, to
              prepare derivative works of, or incorporate into other works, your Contributions, and
              to sublicense the licenses granted in this section. Our use and distribution may occur
              in any media formats and through any media channels.
            </Text>
            <Text>
              This license includes our use of your name, company name, and franchise name, as
              applicable, and any of the trademarks, service marks, trade names, logos, and personal
              and commercial images you provide.
            </Text>
            <Text>
              You are responsible for what you post or upload: By sending us Submissions and/or
              posting Contributions through any part of the Services or making Contributions
              accessible through the Services by linking your account through the Services to any of
              your social networking accounts, you:
            </Text>
            <ul style={{ marginLeft: "16px" }}>
              <li>
                * confirm that you have read and agree with our "PROHIBITED ACTIVITIES" and will not
                post, send, publish, upload, or transmit through the Services any Submission nor
                post any Contribution that is illegal, harassing, hateful, harmful, defamatory,
                obscene, bullying, abusive, discriminatory, threatening to any person or group,
                sexually explicit, false, inaccurate, deceitful, or misleading;
              </li>
              <li>
                * to the extent permissible by applicable law, waive any and all moral rights to any
                such Submission and/or Contribution;
              </li>
              <li>
                * warrant that any such Submission and/or Contributions are original to you or that
                you have the necessary rights and licenses to submit such Submissions and/or
                Contributions and that you have full authority to grant us the above-mentioned
                rights in relation to your Submissions and/or Contributions; and
              </li>
              <li>
                * warrant and represent that your Submissions and/or Contributions do not constitute
                confidential information.
              </li>
            </ul>
            <Text>
              You are solely responsible for your Submissions and/or Contributions and you expressly
              agree to reimburse us for any and all losses that we may suffer because of your breach
              of (a) this section, (b) any third party’s intellectual property rights, or (c)
              applicable law.
            </Text>
            <Text>
              <b> We may remove or edit your Content:</b> Although we have no obligation to monitor
              any Contributions, we shall have the right to remove or edit any Contributions at any
              time without notice if in our reasonable opinion we consider such Contributions
              harmful or in breach of these Legal Terms. If we remove or edit any such
              Contributions, we may also suspend or disable your account and report you to the
              authorities.
            </Text>
            {/* Section 3 */}
            <Title order={5} id="section-3">
              3. USER REPRESENTATIONS
            </Title>
            <Text>
              By using the Services, you represent and warrant that: (1) all registration
              information you submit will be true, accurate, current, and complete; (2) you will
              maintain the accuracy of such information and promptly update such registration
              information as necessary; (3) you have the legal capacity and you agree to comply with
              these Legal Terms; (4) you are not a minor in the jurisdiction in which you reside;
              (5) you will not access the Services through automated or non-human means, whether
              through a bot, script or otherwise; (6) you will not use the Services for any illegal
              or unauthorized purpose; and (7) your use of the Services will not violate any
              applicable law or regulation.
            </Text>
            <Text>
              If you provide any information that is untrue, inaccurate, not current, or incomplete,
              we have the right to suspend or terminate your account and refuse any and all current
              or future use of the Services (or any portion thereof).
            </Text>
            {/* Section 4 */}
            <Title order={5} id="section-4">
              4. USER REGISTRATION
            </Title>
            <Text>
              You may be required to register to use the Services. You agree to keep your password
              confidential and will be responsible for all use of your account and password. We
              reserve the right to remove, reclaim, or change a username you select if we determine,
              in our sole discretion, that such username is inappropriate, obscene, or otherwise
              objectionable.
            </Text>
            {/* Section 5 */}
            <Title order={5} id="section-5">
              5. PURCHASES AND PAYMENT
            </Title>
            <Text>We accept the following forms of payment:</Text>
            <ul style={{ marginLeft: "16px" }}>
              <li>-Visa</li>
              <li>-MasterCard</li>
            </ul>
            <Text>
              You agree to provide current, complete, and accurate purchase and account information
              for all purchases made via the Services. You further agree to promptly update account
              and payment information, including email address, payment method, and payment card
              expiration date, so that we can complete your transactions and contact you as needed.
              Sales tax will be added to the price of purchases as deemed required by us. We may
              change prices at any time. All payments shall be in CAD.
            </Text>
            <Text>
              You agree to pay all charges at the prices then in effect for your purchases and any
              applicable shipping fees, and you authorize us to charge your chosen payment provider
              for any such amounts upon placing your order. If your order is subject to recurring
              charges, then you consent to our charging your payment method on a recurring basis
              without requiring your prior approval for each recurring charge, until such time as
              you cancel the applicable order. We reserve the right to correct any errors or
              mistakes in pricing, even if we have already requested or received payment.
            </Text>
            <Text>
              We reserve the right to refuse any order placed through the Services. We may, in our
              sole discretion, limit or cancel quantities purchased per person, per household, or
              per order. These restrictions may include orders placed by or under the same customer
              account, the same payment method, and/or orders that use the same billing or shipping
              address. We reserve the right to limit or prohibit orders that, in our sole judgment,
              appear to be placed by dealers, resellers, or distributors.
            </Text>
            {/* Section 6 */}
            <Title order={5} id="section-6">
              6. CANCELLATION
            </Title>
            <Text>
              All purchases are non-refundable. You can cancel your subscription at any time by
              logging into your account. Your cancellation will take effect at the end of the
              current paid term.
            </Text>
            <Text>
              If you are unsatisfied with our Services, please email us at info@hexadesk.io.
            </Text>
            {/* Section 7 */}
            <Title order={5} id="section-7">
              7. PROHIBITED ACTIVITIES
            </Title>
            <Text>
              You may not access or use the Services for any purpose other than that for which we
              make the Services available. The Services may not be used in connection with any
              commercial endeavors except those that are specifically endorsed or approved by us.
            </Text>
            <Text>As a user of the Services, you agree not to:</Text>
            <ul style={{ marginLeft: "16px" }}>
              <li>
                * Systematically retrieve data or other content from the Services to create or
                compile, directly or indirectly, a collection, compilation, database, or directory
                without written permission from us.
              </li>
              <li>
                * Trick, defraud, or mislead us and other users, especially in any attempt to learn
                sensitive account information such as user passwords.
              </li>
              <li>
                * Circumvent, disable, or otherwise interfere with security-related features of the
                Services, including features that prevent or restrict the use or copying of any
                Content or enforce limitations on the use of the Services and/or the Content
                contained therein.
              </li>
              <li>
                * Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.
              </li>
              <li>
                * Use any information obtained from the Services in order to harass, abuse, or harm
                another person.
              </li>
              <li>
                * Make improper use of our support services or submit false reports of abuse or
                misconduct.
              </li>
              <li>
                * Use the Services in a manner inconsistent with any applicable laws or regulations.
              </li>
              <li>* Engage in unauthorized framing of or linking to the Services.</li>
              <li>
                * Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses,
                or other material, including excessive use of capital letters and spamming
                (continuous posting of repetitive text), that interferes with any party’s
                uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts,
                alters, or interferes with the use, features, functions, operation, or maintenance
                of the Services.
              </li>
              <li>
                * Engage in any automated use of the system, such as using scripts to send comments
                or messages, or using any data mining, robots, or similar data gathering and
                extraction tools.
              </li>
              <li>* Delete the copyright or other proprietary rights notice from any Content.</li>
              <li>
                * Attempt to impersonate another user or person or use the username of another user.
              </li>
              <li>
                * Upload or transmit (or attempt to upload or to transmit) any material that acts as
                a passive or active information collection or transmission mechanism, including
                without limitation, clear graphics interchange formats ("gifs"), 1×1 pixels, web
                bugs, cookies, or other similar devices (sometimes referred to as "spyware" or
                "passive collection mechanisms" or "pcms").
              </li>
              <li>
                * Interfere with, disrupt, or create an undue burden on the Services or the networks
                or services connected to the Services.
              </li>
              <li>
                * Harass, annoy, intimidate, or threaten any of our employees or agents engaged in
                providing any portion of the Services to you.
              </li>
              <li>
                * Attempt to bypass any measures of the Services designed to prevent or restrict
                access to the Services, or any portion of the Services.
              </li>
              <li>
                * Copy or adapt the Services' software, including but not limited to Flash, PHP,
                HTML, JavaScript, or other code.
              </li>
              <li>
                * Except as permitted by applicable law, decipher, decompile, disassemble, or
                reverse engineer any of the software comprising or in any way making up a part of
                the Services.
              </li>
              <li>
                * Except as may be the result of standard search engine or Internet browser usage,
                use, launch, develop, or distribute any automated system, including without
                limitation, any spider, robot, cheat utility, scraper, or offline reader that
                accesses the Services, or use or launch any unauthorized script or other software.
              </li>
              <li>* Use a buying agent or purchasing agent to make purchases on the Services.</li>
              <li>
                * Make any unauthorized use of the Services, including collecting usernames and/or
                email addresses of users by electronic or other means for the purpose of sending
                unsolicited email, or creating user accounts by automated means or under false
                pretenses.
              </li>
              <li>
                * Use the Services as part of any effort to compete with us or otherwise use the
                Services and/or the Content for any revenue-generating endeavor or commercial
                enterprise.
              </li>
              <li>* Use the Services to advertise or offer to sell goods and services.</li>
              <li>* Sell or otherwise transfer your profile.</li>
            </ul>
            {/* Section 8 */}
            <Title order={5} id="section-8">
              8. USER GENERATED CONTRIBUTIONS
            </Title>
            <Text>
              The Services may invite you to chat, contribute to, or participate in blogs, message
              boards, online forums, and other functionality, and may provide you with the
              opportunity to create, submit, post, display, transmit, perform, publish, distribute,
              or broadcast content and materials to us or on the Services, including but not limited
              to text, writings, video, audio, photographs, graphics, comments, suggestions, or
              personal information or other material (collectively, "Contributions"). Contributions
              may be viewable by other users of the Services and through third-party websites. As
              such, any Contributions you transmit may be treated as non-confidential and
              non-proprietary. When you create or make available any Contributions, you thereby
              represent and warrant that:
            </Text>
            <ul style={{ marginLeft: "16px" }}>
              <li>
                * The creation, distribution, transmission, public display, or performance, and the
                accessing, downloading, or copying of your Contributions do not and will not
                infringe the proprietary rights, including but not limited to the copyright, patent,
                trademark, trade secret, or moral rights of any third party.
              </li>
              <li>
                * You are the creator and owner of or have the necessary licenses, rights, consents,
                releases, and permissions to use and to authorize us, the Services, and other users
                of the Services to use your Contributions in any manner contemplated by the Services
                and these Legal Terms.
              </li>
              <li>
                * You have the written consent, release, and/or permission of each and every
                identifiable individual person in your Contributions to use the name or likeness of
                each and every such identifiable individual person to enable inclusion and use of
                your Contributions in any manner contemplated by the Services and these Legal Terms.
              </li>
              <li>* Your Contributions are not false, inaccurate, or misleading.</li>
              <li>
                * Your Contributions are not unsolicited or unauthorized advertising, promotional
                materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of
                solicitation.
              </li>
              <li>
                * Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing,
                libelous, slanderous, or otherwise objectionable (as determined by us).
              </li>
              <li>
                * Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone.
              </li>
              <li>
                * Your Contributions are not used to harass or threaten (in the legal sense of those
                terms) any other person and to promote violence against a specific person or class
                of people.
              </li>
              <li>* Your Contributions do not violate any applicable law, regulation, or rule.</li>
              <li>
                * Your Contributions do not violate the privacy or publicity rights of any third
                party.
              </li>
              <li>
                * Your Contributions do not violate any applicable law concerning child pornography,
                or otherwise intended to protect the health or well-being of minors.
              </li>
              <li>
                * Your Contributions do not include any offensive comments that are connected to
                race, national origin, gender, sexual preference, or physical handicap.
              </li>
              <li>
                * Your Contributions do not otherwise violate, or link to material that violates,
                any provision of these Legal Terms, or any applicable law or regulation.
              </li>
            </ul>
            <Text>
              The Services may invite you to chat, contribute to, or participate in blogs, message
              boards, online forums, and other functionality, and may provide you with the
              opportunity to create, submit, post, display, transmit, perform, publish, distribute,
              or broadcast content and materials to us or on the Services, including but not limited
              to text, writings, video, audio, photographs, graphics, comments, suggestions, or
              personal information or other material (collectively, "Contributions"). Contributions
              may be viewable by other users of the Services and through third-party websites. As
              such, any Contributions you transmit may be treated as non-confidential and
              non-proprietary. When you create or make available any Contributions, you thereby
              represent and warrant that:
            </Text>
            {/* Section 9 */}
            <Title order={5} id="section-9">
              9. CONTRIBUTION LICENSE
            </Title>
            <Text>
              {" "}
              By posting your Contributions to any part of the Services, you automatically grant,
              and you represent and warrant that you have the right to grant, to us an unrestricted,
              unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free,
              fully-paid, worldwide right, and license to host, use, copy, reproduce, disclose,
              sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform,
              publicly display, reformat, translate, transmit, excerpt (in whole or in part), and
              distribute such Contributions (including, without limitation, your image and voice)
              for any purpose, commercial, advertising, or otherwise, and to prepare derivative
              works of, or incorporate into other works, such Contributions, and grant and authorize
              sublicenses of the foregoing. The use and distribution may occur in any media formats
              and through any media channels.
            </Text>
            <Text>
              This license will apply to any form, media, or technology now known or hereafter
              developed, and includes our use of your name, company name, and franchise name, as
              applicable, and any of the trademarks, service marks, trade names, logos, and personal
              and commercial images you provide. You waive all moral rights in your Contributions,
              and you warrant that moral rights have not otherwise been asserted in your
              Contributions.
            </Text>
            <Text>
              We do not assert any ownership over your Contributions. You retain full ownership of
              all of your Contributions and any intellectual property rights or other proprietary
              rights associated with your Contributions. We are not liable for any statements or
              representations in your Contributions provided by you in any area on the Services. You
              are solely responsible for your Contributions to the Services and you expressly agree
              to exonerate us from any and all responsibility and to refrain from any legal action
              against us regarding your Contributions.
            </Text>
            <Text>
              We have the right, in our sole and absolute discretion, (1) to edit, redact, or
              otherwise change any Contributions; (2) to re-categorize any Contributions to place
              them in more appropriate locations on the Services; and (3) to pre-screen or delete
              any Contributions at any time and for any reason, without notice. We have no
              obligation to monitor your Contributions.
            </Text>{" "}
            {/* Section 10 */}
            <Title order={5} id="section-10">
              10. MOBILE APPLICATION LICENSE
            </Title>
            <Title order={6}>Use License</Title>
            <Text>
              If you access the Services via the App, then we grant you a revocable, non-exclusive,
              non-transferable, limited right to install and use the App on wireless electronic
              devices owned or controlled by you, and to access and use the App on such devices
              strictly in accordance with the terms and conditions of this mobile application
              license contained in these Legal Terms. You shall not: (1) except as permitted by
              applicable law, decompile, reverse engineer, disassemble, attempt to derive the source
              code of, or decrypt the App; (2) make any modification, adaptation, improvement,
              enhancement, translation, or derivative work from the App; (3) violate any applicable
              laws, rules, or regulations in connection with your access or use of the App; (4)
              remove, alter, or obscure any proprietary notice (including any notice of copyright or
              trademark) posted by us or the licensors of the App; (5) use the App for any
              revenue-generating endeavor, commercial enterprise, or other purpose for which it is
              not designed or intended; (6) make the App available over a network or other
              environment permitting access or use by multiple devices or users at the same time;
              (7) use the App for creating a product, service, or software that is, directly or
              indirectly, competitive with or in any way a substitute for the App; (8) use the App
              to send automated queries to any website or to send any unsolicited commercial email;
              or (9) use any proprietary information or any of our interfaces or our other
              intellectual property in the design, development, manufacture, licensing, or
              distribution of any applications, accessories, or devices for use with the App.
            </Text>
            <Title order={6}>Apple and Android Devices</Title>
            <Text>
              The following terms apply when you use the App obtained from either the Apple Store or
              Google Play (each an "App Distributor") to access the Services: (1) the license
              granted to you for our App is limited to a non-transferable license to use the
              application on a device that utilizes the Apple iOS or Android operating systems, as
              applicable, and in accordance with the usage rules set forth in the applicable App
              Distributor’s terms of service; (2) we are responsible for providing any maintenance
              and support services with respect to the App as specified in the terms and conditions
              of this mobile application license contained in these Legal Terms or as otherwise
              required under applicable law, and you acknowledge that each App Distributor has no
              obligation whatsoever to furnish any maintenance and support services with respect to
              the App; (3) in the event of any failure of the App to conform to any applicable
              warranty, you may notify the applicable App Distributor, and the App Distributor, in
              accordance with its terms and policies, may refund the purchase price, if any, paid
              for the App, and to the maximum extent permitted by applicable law, the App
              Distributor will have no other warranty obligation whatsoever with respect to the App;
              (4) you represent and warrant that (i) you are not located in a country that is
              subject to a US government embargo, or that has been designated by the US government
              as a "terrorist supporting" country and (ii) you are not listed on any US government
              list of prohibited or restricted parties; (5) you must comply with applicable
              third-party terms of agreement when using the App, e.g., if you have a VoIP
              application, then you must not be in violation of their wireless data service
              agreement when using the App; and (6) you acknowledge and agree that the App
              Distributors are third-party beneficiaries of the terms and conditions in this mobile
              application license contained in these Legal Terms, and that each App Distributor will
              have the right (and will be deemed to have accepted the right) to enforce the terms
              and conditions in this mobile application license contained in these Legal Terms
              against you as a third-party beneficiary thereof.
            </Text>
            {/* Section 11 */}
            <Title order={5} id="section-11">
              11. SERVICES MANAGEMENT
            </Title>
            <Text>
              We reserve the right, but not the obligation, to: (1) monitor the Services for
              violations of these Legal Terms; (2) take appropriate legal action against anyone who,
              in our sole discretion, violates the law or these Legal Terms, including without
              limitation, reporting such user to law enforcement authorities; (3) in our sole
              discretion and without limitation, refuse, restrict access to, limit the availability
              of, or disable (to the extent technologically feasible) any of your Contributions or
              any portion thereof; (4) in our sole discretion and without limitation, notice, or
              liability, to remove from the Services or otherwise disable all files and content that
              are excessive in size or are in any way burdensome to our systems; and (5) otherwise
              manage the Services in a manner designed to protect our rights and property and to
              facilitate the proper functioning of the Services.
            </Text>
            {/* Section 12 */}
            <Title order={5} id="section-12">
              12. PRIVACY POLICY
            </Title>
            <Text>
              We care about data privacy and security. Please review our Privacy Policy:
              https://www.hexadesk.ca/privacy. By using the Services, you agree to be bound by our
              Privacy Policy, which is incorporated into these Legal Terms. Please be advised the
              Services are hosted in Canada. If you access the Services from any other region of the
              world with laws or other requirements governing personal data collection, use, or
              disclosure that differ from applicable laws in Canada, then through your continued use
              of the Services, you are transferring your data to Canada, and you expressly consent
              to have your data transferred to and processed in Canada.
            </Text>
            {/* Section 13 */}
            <Title order={5} id="section-13">
              13. TERM AND TERMINATION
            </Title>
            <Text>
              These Legal Terms shall remain in full force and effect while you use the Services.
              WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN
              OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE
              SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR
              FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION,
              WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR
              REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR
              ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING,
              IN OUR SOLE DISCRETION.
            </Text>
            <Text>
              If we terminate or suspend your account for any reason, you are prohibited from
              registering and creating a new account under your name, a fake or borrowed name, or
              the name of any third party, even if you may be acting on behalf of the third party.
              In addition to terminating or suspending your account, we reserve the right to take
              appropriate legal action, including without limitation pursuing civil, criminal, and
              injunctive redress.
            </Text>
            {/* Section 14 */}
            <Title order={5} id="section-14">
              14. MODIFICATIONS AND INTERRUPTIONS
            </Title>
            <Text>
              We reserve the right to change, modify, or remove the contents of the Services at any
              time or for any reason at our sole discretion without notice. However, we have no
              obligation to update any information on our Services. We will not be liable to you or
              any third party for any modification, price change, suspension, or discontinuance of
              the Services.
            </Text>
            <Text>
              We cannot guarantee the Services will be available at all times. We may experience
              hardware, software, or other problems or need to perform maintenance related to the
              Services, resulting in interruptions, delays, or errors. We reserve the right to
              change, revise, update, suspend, discontinue, or otherwise modify the Services at any
              time or for any reason without notice to you. You agree that we have no liability
              whatsoever for any loss, damage, or inconvenience caused by your inability to access
              or use the Services during any downtime or discontinuance of the Services. Nothing in
              these Legal Terms will be construed to obligate us to maintain and support the
              Services or to supply any corrections, updates, or releases in connection therewith.
            </Text>
            {/* Section 15 */}
            <Title order={5} id="section-15">
              15. GOVERNING LAW
            </Title>
            <Text>
              These Legal Terms shall be governed by and defined following the laws of Canada. Les
              Logiciels Hexadesk and yourself irrevocably consent that the courts of Canada shall
              have exclusive jurisdiction to resolve any dispute which may arise in connection with
              these Legal Terms.
            </Text>
            {/* Section 16 */}
            <Title order={5} id="section-16">
              16. DISPUTE RESOLUTION
            </Title>
            <Title order={6}>Informal Negotiations</Title>
            <Text>
              To expedite resolution and control the cost of any dispute, controversy, or claim
              related to these Legal Terms (each a "Dispute" and collectively, the "Disputes")
              brought by either you or us (individually, a "Party" and collectively, the "Parties"),
              the Parties agree to first attempt to negotiate any Dispute (except those Disputes
              expressly provided below) informally for at least ninety (90) days before initiating
              arbitration. Such informal negotiations commence upon written notice from one Party to
              the other Party.
            </Text>
            <Title order={6}>Binding Arbitration</Title>
            <Text>
              Any dispute arising out of or in connection with these Legal Terms, including any
              question regarding its existence, validity, or termination, shall be referred to and
              finally resolved by the International Commercial Arbitration Court under the European
              Arbitration Chamber (Belgium, Brussels, Avenue Louise, 146) according to the Rules of
              this ICAC, which, as a result of referring to it, is considered as the part of this
              clause. The number of arbitrators shall be three (3). The seat, or legal place, or
              arbitration shall be Montreal, Canada. The language of the proceedings shall be
              French. The governing law of these Legal Terms shall be substantive law of Canada.
            </Text>
            <Title order={6}>Restrictions</Title>
            <Text>
              The Parties agree that any arbitration shall be limited to the Dispute between the
              Parties individually. To the full extent permitted by law, (a) no arbitration shall be
              joined with any other proceeding; (b) there is no right or authority for any Dispute
              to be arbitrated on a class-action basis or to utilize class action procedures; and
              (c) there is no right or authority for any Dispute to be brought in a purported
              representative capacity on behalf of the general public or any other persons.
            </Text>
            <Title order={6}>Exceptions to Informal Negotiations and Arbitration</Title>
            <Text>
              The Parties agree that the following Disputes are not subject to the above provisions
              concerning informal negotiations binding arbitration: (a) any Disputes seeking to
              enforce or protect, or concerning the validity of, any of the intellectual property
              rights of a Party; (b) any Dispute related to, or arising from, allegations of theft,
              piracy, invasion of privacy, or unauthorized use; and (c) any claim for injunctive
              relief. If this provision is found to be illegal or unenforceable, then neither Party
              will elect to arbitrate any Dispute falling within that portion of this provision
              found to be illegal or unenforceable and such Dispute shall be decided by a court of
              competent jurisdiction within the courts listed for jurisdiction above, and the
              Parties agree to submit to the personal jurisdiction of that court.
            </Text>
            {/* Section 17 */}
            <Title order={5} id="section-17">
              17. CORRECTIONS
            </Title>
            <Text>
              There may be information on the Services that contains typographical errors,
              inaccuracies, or omissions, including descriptions, pricing, availability, and various
              other information. We reserve the right to correct any errors, inaccuracies, or
              omissions and to change or update the information on the Services at any time, without
              prior notice.
            </Text>
            {/* Section 18 */}
            <Title order={5} id="section-18">
              18. DISCLAIMER
            </Title>
            <Text>
              THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE
              OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE
              DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR
              USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR
              REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES' CONTENT OR THE
              CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE WILL
              ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF
              CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE
              WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES, (3) ANY
              UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL
              INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR
              CESSATION OF TRANSMISSION TO OR FROM THE SERVICES, (5) ANY BUGS, VIRUSES, TROJAN
              HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD
              PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS
              OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED,
              TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES. WE DO NOT WARRANT, ENDORSE,
              GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED
              BY A THIRD PARTY THROUGH THE SERVICES, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR
              MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE WILL NOT BE A
              PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND
              ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE PURCHASE OF A PRODUCT
              OR SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGMENT
              AND EXERCISE CAUTION WHERE APPROPRIATE.
            </Text>
            {/* Section 19 */}
            <Title order={5} id="section-19">
              19. LIMITATIONS OF LIABILITY
            </Title>
            <Text>
              IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY
              THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL,
              OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER
              DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE
              POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED
              HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF
              THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US
              DURING THE three (3) mONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING. CERTAIN US
              STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR
              THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR
              ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE
              ADDITIONAL RIGHTS.
            </Text>
            {/* Section 20 */}
            <Title order={5} id="section-20">
              20. INDEMNIFICATION
            </Title>
            <Text>
              You agree to defend, indemnify, and hold us harmless, including our subsidiaries,
              affiliates, and all of our respective officers, agents, partners, and employees, from
              and against any loss, damage, liability, claim, or demand, including reasonable
              attorneys’ fees and expenses, made by any third party due to or arising out of: (1)
              your Contributions; (2) use of the Services; (3) breach of these Legal Terms; (4) any
              breach of your representations and warranties set forth in these Legal Terms; (5) your
              violation of the rights of a third party, including but not limited to intellectual
              property rights; or (6) any overt harmful act toward any other user of the Services
              with whom you connected via the Services. Notwithstanding the foregoing, we reserve
              the right, at your expense, to assume the exclusive defense and control of any matter
              for which you are required to indemnify us, and you agree to cooperate, at your
              expense, with our defense of such claims. We will use reasonable efforts to notify you
              of any such claim, action, or proceeding which is subject to this indemnification upon
              becoming aware of it.
            </Text>
            {/* Section 21 */}
            <Title order={5} id="section-21">
              21. USER DATA
            </Title>
            <Text>
              We will maintain certain data that you transmit to the Services for the purpose of
              managing the performance of the Services, as well as data relating to your use of the
              Services. Although we perform regular routine backups of data, you are solely
              responsible for all data that you transmit or that relates to any activity you have
              undertaken using the Services. You agree that we shall have no liability to you for
              any loss or corruption of any such data, and you hereby waive any right of action
              against us arising from any such loss or corruption of such data.
            </Text>
            {/* Section 22 */}
            <Title order={5} id="section-22">
              22. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES
            </Title>
            <Text>
              Visiting the Services, sending us emails, and completing online forms constitute
              electronic communications. You consent to receive electronic communications, and you
              agree that all agreements, notices, disclosures, and other communications we provide
              to you electronically, via email and on the Services, satisfy any legal requirement
              that such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC
              SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF
              NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE
              SERVICES. You hereby waive any rights or requirements under any statutes, regulations,
              rules, ordinances, or other laws in any jurisdiction which require an original
              signature or delivery or retention of non-electronic records, or to payments or the
              granting of credits by any means other than electronic means.
            </Text>
            {/* Section 23 */}
            <Title order={5} id="section-23">
              23. MISCELLANEOUS
            </Title>
            <Text>
              These Legal Terms and any policies or operating rules posted by us on the Services or
              in respect to the Services constitute the entire agreement and understanding between
              you and us. Our failure to exercise or enforce any right or provision of these Legal
              Terms shall not operate as a waiver of such right or provision. These Legal Terms
              operate to the fullest extent permissible by law. We may assign any or all of our
              rights and obligations to others at any time. We shall not be responsible or liable
              for any loss, damage, delay, or failure to act caused by any cause beyond our
              reasonable control. If any provision or part of a provision of these Legal Terms is
              determined to be unlawful, void, or unenforceable, that provision or part of the
              provision is deemed severable from these Legal Terms and does not affect the validity
              and enforceability of any remaining provisions. There is no joint venture,
              partnership, employment or agency relationship created between you and us as a result
              of these Legal Terms or use of the Services. You agree that these Legal Terms will not
              be construed against us by virtue of having drafted them. You hereby waive any and all
              defenses you may have based on the electronic form of these Legal Terms and the lack
              of signing by the parties hereto to execute these Legal Terms.
            </Text>
            {/* Section 24 */}
            <Title order={5} id="section-24">
              24. CONTACT US
            </Title>
            <Text>
              In order to resolve a complaint regarding the Services or to receive further
              information regarding use of the Services, please contact us at:
            </Text>
            <Stack spacing={0}>
              <Text fw={700}>Les Logiciels Hexadesk</Text>
              <Text fw={700}>C.P. 32</Text>
              <Text fw={700}>Montreal, Quebec H1B 5K1</Text>
              <Text fw={700}>Canada</Text>
              <Text fw={700}>info@hexadesk.io</Text>
            </Stack>
          </Stack>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default TermsAndConditions;
