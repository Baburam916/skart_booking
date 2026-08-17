import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 18,
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },
  heading: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 6,
    textAlign: "center",
  },
  paragraph: {
    marginBottom: 6,
  },
  list: {
    marginLeft: 10,
    marginBottom: 6,
  },
  listItem: {
    marginBottom: 2,
  },
});
const PrivacyPolicy = () => {
  const email = "info@skart-express.com";
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>PRIVACY POLICY</Text>

        <Text style={styles.paragraph}>
          Skyways Group is committed to safeguarding the privacy of our website
          visitors. This page informs you of our policies regarding the
          collection, use and disclosure of Personal Information we receive from
          users of the Site. We use your Personal Information only for providing
          required services and improving the functionality of the site. By
          using the Site, you agree to the collection and use of information in
          accordance with this Policy.
        </Text>

        <Text style={styles.heading}>What information do we collect?</Text>
        <Text style={styles.paragraph}>
          We may collect, store and use the following kinds of data covering
          both personal & office information:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            (a) Information about your visits to, and use of, this website.
          </Text>
          <Text style={styles.listItem}>
            (b) Information about any interactions carried out between you and
            us on, or in relation to, this website.
          </Text>
          <Text style={styles.listItem}>
            (c) Information that you provide to us for the purpose of
            registering with us and/or subscribing to our website services
            and/or email notifications.
          </Text>
          <Text style={styles.listItem}>
            (d) Information that you provide to us for booking of a shipment &
            all relevant information shared for creation of regulatory documents
            necessary for transportation.
          </Text>
        </View>
        <Text style={styles.paragraph}>
          We may collect, store and use non-personal data about your visits to
          and use of this website.
        </Text>

        <Text style={styles.heading}>Information about website visits</Text>
        <Text style={styles.paragraph}>
          We may collect information about your computer and your visits to this
          website such as your IP address, geographical location, browser type,
          referral source, length of visit and number of page views. We may use
          this information in the administration of this website, to improve the
          website’s usability, and for marketing purposes.
        </Text>
        <Text style={styles.paragraph}>
          Cookies are files with small amount of data, which may include an
          anonymous unique identifier. Cookies are sent to your browser from a
          web site and stored on your computer's hard drive. Like many sites, we
          use "cookies" to collect information. You can instruct your browser to
          refuse all cookies or to indicate when a cookie is being sent.
          However, This will, however, have a negative impact upon the usability
          of many websites, including this one.
        </Text>

        <Text style={styles.heading}>Using your personal data</Text>
        <Text style={styles.paragraph}>
          Personal data submitted on this website will be used for the purposes
          specified in this privacy policy or in relevant parts of the website
        </Text>
        <Text style={styles.paragraph}>
          In addition to the uses identified elsewhere in this privacy policy,
          we may use your personal information to:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            (a) improve your browsing experience by personalizing the website;
          </Text>
          <Text style={styles.listItem}>
            (b) process your requests and inquiries
          </Text>
          <Text style={styles.listItem}>
            (c) send information (other than marketing communications) to you
            which we think may be of interest to you by post or by email or
            similar technology;
          </Text>
          <Text style={styles.listItem}>
            (d) debug, identify, and repair errors that impair existing intended
            functionality of the Website;
          </Text>
          <Text style={styles.listItem}>
            (e) send to you marketing communications relating to our business.
          </Text>
        </View>

        <Text style={styles.title}></Text>
        <Text style={styles.title}></Text>

        <Text style={styles.heading}>Other disclosures</Text>
        <Text style={styles.paragraph}>
          In addition to the disclosures reasonably necessary for the purposes
          identified elsewhere in this privacy policy, we may disclose
          information about you:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            (a) to the extent that we are required to do so by law;
          </Text>
          <Text style={styles.listItem}>
            (b) in connection with any legal proceedings or prospective legal
            proceedings;
          </Text>
          <Text style={styles.listItem}>
            (c) in order to establish, exercise or defend our legal rights
            (including providing information to others for the purposes of fraud
            prevention and reducing credit risk).
          </Text>
        </View>

        <Text style={styles.heading}>Security of your personal data</Text>
        <Text style={styles.paragraph}>
          We will take reasonable precautions to prevent the loss, misuse or
          alteration of your information covering both personal & business. Of
          course, data transmission over the Internet is inherently insecure,
          and we cannot guarantee the security of data sent over the Internet We
          will store all the information you provide on our secure servers. We
          may also store your login information for any third-party applications
          you denote as a connector. In case of any loss and/or damage to the
          user, due to use/misuse of the information of the user, or due to data
          pilferage, we will not be liable in any manner whatsoever.
        </Text>

        <Text style={styles.heading}>Cookie policy</Text>
        <Text style={styles.paragraph}>
          Our digital platforms use various third party services to promote our
          products and services. These third party services use cookies which
          are downloaded to your device when you visit a website in order to
          provide a personalized browsing experience. Cookies are used for lots
          of tasks like remembering your preferences & settings, provide
          personalized browsing experience and analyze site operations. These
          cookies collect information about how users use a website, for
          instance, how often visited pages. All information collected by third
          party cookies is aggregated and anonymous. By using our website user/s
          agree that these types of cookies can be placed on his/her device.
          User/s is free to disable/delete these cookies by changing his/her
          device / browser settings. We are not responsible for cookies placed
          in the device of user/s by any other website and information collected
          thereto.
        </Text>

        <Text style={styles.heading}>Third party websites</Text>
        <Text style={styles.paragraph}>
          The website contains links to other websites. We are not responsible
          for the privacy policies of third party websites. Please check these
          policies before you submit any Personal Information to the websites.
          Skyways does not endorse or make any representations about third-party
          websites. Any Personal Information you choose to give to unrelated
          Third Parties is not covered by this Privacy Policy.
        </Text>

        <Text style={styles.heading}>Changes to This Privacy Policy</Text>
        <Text style={styles.paragraph}>
          This policy is effective as of{" "}
          <Text style={{ fontWeight: "bold" }}>{currentDate}</Text>. And will
          remain in effect except with respect to any changes in its provisions
          in the future, which will be in effect immediately after being posted
          on this page. We reserve the right to update or change our Privacy
          Policy at any time and you should check this Privacy Policy
          periodically. If you do not accept the terms of this Privacy Policy,
          we ask that you exit our Website immediately. Your continued use of
          the Service after we post any modifications to the Privacy Policy on
          this page will constitute your acknowledgment of the modifications and
          your consent to abide and be bound by the modified Privacy Policy. If
          we make any material changes to this Privacy Policy, we will notify by
          placing a prominent notice on our website.
        </Text>

        <Text style={styles.heading}>Contact</Text>
        <Text>
          If you have any questions about this privacy policy or our treatment
          of your personal data, please write to us by email to{" "}
          <Text style={{ fontWeight: "bold" }}>{email}</Text>.
        </Text>
      </Page>
    </Document>
  );
};

export default PrivacyPolicy;
