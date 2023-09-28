import { Paper, Grid, Stack, Anchor, Title, Text } from "@mantine/core";
import React from "react";

const PrivacyPolicy = () => {
  const handleLinkClick = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const sections = [
    "WHAT INFORMATION DO WE COLLECT?",
    "HOW DO WE PROCESS YOUR INFORMATION?",
    "WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?",
    "WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?",
    "HOW LONG DO WE KEEP YOUR INFORMATION?",
    "HOW DO WE KEEP YOUR INFORMATION SAFE?",
    "DO WE COLLECT INFORMATION FROM MINORS?",
    "WHAT ARE YOUR PRIVACY RIGHTS?",
    "CONTROLS FOR DO-NOT-TRACK FEATURES",
    "DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?",
    "DO WE MAKE UPDATES TO THIS NOTICE?",
    "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?",
    "HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?",
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
                  {s}
                </Anchor>
              );
            })}
          </Stack>
        </Grid.Col>

        {/* Main Content */}
        <Grid.Col span={10}>
          {/* Header */}
          <Title order={2} mb="md">
            PRIVACY POLICY
          </Title>

          <Text weight="bold">Last updated August 24, 2023</Text>

          <Title my="xl" order={4}>
            AGREEMENT TO OUR LEGAL TERMS
          </Title>

          <Stack>
            <Text>
              {" "}
              This privacy notice for Les Logiciels Hexadesk (doing business as Hexadesk) (
              <b>"we,", "us," or "our"</b>), describes how and why we might collect, store, use,
              and/or share (<b>"process"</b>) your information when you use our services (
              <b>"Services"</b>), such as when you:
            </Text>

            <ul style={{ marginLeft: "16px" }}>
              <li>
                * Visit our website at{" "}
                <Anchor target="_blank" href="https://www.hexadesk.ca">
                  https://www.hexadesk.ca
                </Anchor>
                , or any website of ours that links to this privacy notice
              </li>
              <li>
                * Download and use our mobile application (Hexadesk), or any other application of
                ours that links to this privacy notice
              </li>
              <li>
                * Engage with us in other related ways, including any sales, marketing, or events
              </li>
            </ul>

            <Text>
              <b>Questions or concerns?</b> Reading this privacy notice will help you understand
              your privacy rights and choices. If you do not agree with our policies and practices,
              please do not use our Services. If you still have any questions or concerns, please
              contact us at hexadesk@gmail.com.
            </Text>

            <Title order={3}>SUMMARY OF KEY POINTS</Title>
            <Text>
              {" "}
              This summary provides key points from our privacy notice, but you can find out more
              details about any of these topics by clicking the link following each key point or by
              using our table of contents below to find the section you are looking for.
            </Text>
            <Text>
              What personal information do we process? When you visit, use, or navigate our
              Services, we may process personal information depending on how you interact with us
              and the Services, the choices you make, and the products and features you use. Learn
              more about personal information you disclose to us.
            </Text>

            <Text>
              Do we process any sensitive personal information? We do not process sensitive personal
              information.
            </Text>

            <Text>
              Do we receive any information from third parties? We may receive information from
              public databases, marketing partners, social media platforms, and other outside
              sources. Learn more about information collected from other sources.
            </Text>

            <Text>
              How do we process your information? We process your information to provide, improve,
              and administer our Services, communicate with you, for security and fraud prevention,
              and to comply with law. We may also process your information for other purposes with
              your consent. We process your information only when we have a valid legal reason to do
              so. Learn more about how we process your information.
            </Text>

            <Text>
              In what situations and with which parties do we share personal information? We may
              share information in specific situations and with specific third parties. Learn more
              about when and with whom we share your personal information.
            </Text>

            <Text>
              How do we keep your information safe? We have organizational and technical processes
              and procedures in place to protect your personal information. However, no electronic
              transmission over the internet or information storage technology can be guaranteed to
              be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or
              other unauthorized third parties will not be able to defeat our security and
              improperly collect, access, steal, or modify your information. Learn more about how we
              keep your information safe.
            </Text>

            <Text>
              What are your rights? Depending on where you are located geographically, the
              applicable privacy law may mean you have certain rights regarding your personal
              information. Learn more about your privacy rights.
            </Text>

            <Text>
              How do you exercise your rights? The easiest way to exercise your rights is by
              submitting a data subject access request, or by contacting us. We will consider and
              act upon any request in accordance with applicable data protection laws.
            </Text>

            <Text>
              Want to learn more about what we do with any information we collect? Review the
              privacy notice in full.
            </Text>
          </Stack>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default PrivacyPolicy;
