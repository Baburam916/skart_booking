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
          customers of the Site. We use your Personal Information only for
          providing required services and improving the functionality of the
          site. By using the Site, you agree to the collection and use of
          information in accordance with this Policy.
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

        <Text style={styles.heading}>Third party websites</Text>
        <Text style={styles.paragraph}>
          The website contains links to other websites. We are not responsible
          for the privacy policies of third party websites. Please check these
          policies before you submit any Personal Information to the websites.
          Skyways does not endorse or make any representations about third-party
          websites. Any Personal Information you choose to give to unrelated
          Third Parties is not covered by this Privacy Policy.
        </Text>

        <Text style={styles.heading}>Cookie policy</Text>
        <Text style={styles.paragraph}>
          Skyways’s digital platforms use various third partythird-party
          services to promote Skyways 's products and services. These third
          party services use cookies which are downloaded to your device when
          you visit a website in order to provide a personalized browsing
          experience. Cookies are used for lots of tasks like remembering your
          preferences & settings, provide personalized browsing experience and
          analyze site operations. These cookies collect information about how
          users use a website, for instance, how often visited pages. All
          information collected by third party cookies is aggregated and
          anonymous. By using our website user/s agree that these types of
          cookies can be placed on his/her device. User/s is free to
          disable/delete these cookies by changing his/her device / browser
          settings. Skyways is not responsible for cookies placed in the device
          of user/s by any other website and information collected thereto.
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
          placing a prominent notice on our website
        </Text>

        <Text style={styles.heading}>Contact</Text>
        <Text>
          If you have any questions about this privacy policy or our treatment
          of your personal data, please write to us by email to{" "}
          <Text style={{ fontWeight: "bold" }}>{email}</Text>.
        </Text>

        <Text style={styles.heading}>Payment, Cancellation & Refunds</Text>
        <Text style={styles.paragraph}>
          This Web site "sKart-Express.com" is owned and operated by sKart
          Global Express Pvt Ltd (herein after referred to as “sKart” /
          "Company"). sKart is a company registered under the laws of the Indian
          Companies Act and is in operation since 2019. sKart Global Express is
          a brand owned by Skyways Group. The sKart Global Express brand, logo
          and mascot are a property of Skyways Group and are the subject of a
          trademark application. PLEASE READ THE STATEMENT CAREFULLY. IF YOU
          [CUSTOMER] DO NOT WISH TO BE BOUND BY THE TERMS AND CONDITIONS
          MENTIONED HEREIN, KINDLY REFRAIN FROM ACCESSING THE WEB SITE OR
          BOOKING OF ANY CONSIGNMENT. ANY BOOKING OF SERVICE DONE /MADE ON THIS
          SITE SHALL BE DEEMED TO BE AN ACCEPTANCE OF THIS POLICY. This
          agreement was written in English (India). To the extent any translated
          version of this agreement conflicts with the English version, the
          English version controls.
        </Text>

        <Text style={styles.heading}>Context</Text>
        <Text style={styles.paragraph}>
          The "PAYMENT CANCELLATION AND REFUNDS POLICY" governs your use BOOKING
          of services made available from or through this web site. “sKart” may
          change the Terms and Conditions from time to time, at any time with or
          without notice to you, by posting such changes on the Web Site.The
          Client agrees to pay the Company according to the rates displayed on
          the Web Site at the time of Booking. The rates are subject to change &
          can be changed without notice to you, In the eventuality of any
          additional cost incurred during the course of delivery like ODA, Govt
          levies, Duty, taxes etc would be charged later. The Client will pay
          for the service in as per the invoice raised at periodical intervals
          along with additional cost incurred if any. If the Client fails to
          make any payment within FIFTEEN (15) days of billing, late charges
          will apply at the rate of 1.5% per month on the unpaid amount. If a
          bill remains unpaid for sixty (60) days, Company shall have the option
          of any or all of the following: (1) terminate this Agreement, (2)
          withhold services.
        </Text>

        <Text style={styles.heading}>Acceptable Payment Methods</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            (1.) By booking with sKart-Express.com, you authorize sKart Global
            Express / sKart and its agents to transact with your bank or other
            payment gateways on your behalf to obtain the necessary information
            required to process payment, confirm payment, resolve inquiries and
            billing disputes, and/or as otherwise required to manage the
            booking.
          </Text>
          <Text style={styles.listItem}>
            (2.) We accept the following payment methods: (i) Credit Cards with
            MasterCard or Visa branding (ii) International Debit Cards with Visa
            or MasterCard branding which your issuer allows you to use to make
            purchases online; (iii) Net Banking Payment; and (iv) Indian Bank
            Debit Cards issued by an Indian bank. You will not be asked to
            provide your online banking customername or password to sKart
            ("Account Access Data"). SKART does not want any information
            regarding your Account Access Data and you agree not to provide us
            with your Account Access Data.Notwithstanding anything mentioned
            herein, in case any loss and/or damage/harm is caused to the user,
            due to use/misuse/displacement of the information of the user,
            without any gross act/omission of “sKart” / "Company"/Skyways, in
            that eventuality, “sKart” / "Company"/Skyways shall not be liable in
            any manner whatsoever
          </Text>
          <Text style={styles.listItem}>
            (3.) Not all payment methods are available to use for all products,
            items and services.
          </Text>
        </View>

        <Text style={styles.heading}>Payment Gateway</Text>
        <Text style={styles.paragraph}>
          sKart uses a thirdparty payment gateway called xxxxxxxxxxxxxxxxxxxx.
          Xxxxxxxxxxxxxxxx provides inter alia aggregate payment gateway
          solutions to sKart for enabling its customer to pay their bills
          online. xxxxxxxxxxxxxxxxxxxxxxx provides a single payment gateway
          solution to sKart and facilitates sKart in accepting online payments
          by their customers on their website or mobile application directed to
          thexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx site or through
          xxxxxxxxxxxxxxxxxxxx IVR system. Using credit/ debit cards, net
          banking and various other acceptable modes of payment options provided
          by xxxxxxxxxxxxxxxxxx.
        </Text>

        <Text style={styles.paragraph}>
          xxxxxxxxxxxxxxxxxxxxxxxxxx is a{" "}
          <Text style={{ fontWeight: "bold" }}>
            (Please write a brief on the security aspect of the payment) .
          </Text>
          Xxxxxxxxxxxxxxxxxxxxxxxxhave implemented technical and organizational
          measures designed to secure your personal information from accidental
          loss and from unauthorized access, use, alteration or disclosure.
          However, sKart and xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx cannot guarantee
          that unauthorized third parties will never be able to defeat those
          measures or use your personal information for improper purposes. You
          acknowledge that you provide your personal information at your own
          risk.
        </Text>

        <Text style={styles.heading}>Cancellations and Modifications</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            (1.) The Cancellation Policy is dynamic and may change from time to
            time.
          </Text>
          <Text style={styles.listItem}>
            (2.) The Cancellation policy of sKart may change in the interim
            period of booking and date of expiry of subscription of services
          </Text>
          <Text style={styles.listItem}>
            (3.) The Cancellation Policy prevailing at the time of booking of
            service by the Customer will be the applicable policy. Bookings made
            at the site shall mean your implied acceptance to the policy and the
            terms and conditions set forth herein.
          </Text>
          <Text style={styles.listItem}>
            (4.) sKart offers free cancellation for all bookings only if the
            consignments haven’t been physically reached any of our PUD centers
            or HUB. This means that sKart doesn't levy any cancellation fees of
            its own
          </Text>
          <Text style={styles.listItem}>
            (5.) In case the service is availed by the customer than any request
            for cancellation of fees on account of any service deficiency would
            be subject to approval by appropriate authorities in sKart.
          </Text>
          <Text style={styles.listItem}>
            (6.) Any delay / loss / damage to the shipment because of force
            majeure wouldn’t be eligible for any refund.
          </Text>
          <Text style={styles.listItem}>
            (7.) Only those cancellation requests which are made either online
            or on email to our customer support team shall be entertained.
          </Text>
          <Text style={styles.listItem}>
            (8.) sKart may accept amendments to the booking at its sole
            discretion.
          </Text>
          <Text style={styles.listItem}>
            (9.) All the refunds shall be done by sKart directly to you.
          </Text>
          <Text style={styles.listItem}>
            (10.) Your bank may debit its own separate charges from refunds made
            to your credit card or bank account.
          </Text>
        </View>

        <Text style={styles.heading}>Refunds</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            (1.) Refunded amounts are generally returned within 7 business days
            however, the length of time required for the funds to be credited to
            your account is determined by your financial institution. Please
            check with your financial institution on their specific rules
            regarding returned or refunded transactions.
          </Text>
          <Text style={styles.listItem}>
            (2.) sKart has no obligation to issue refunds if you cannot provide
            us with full and accurate information required to complete the
            refund or credit; or the refund request has already been processed
            through our payment gateway but has not yet applied to the
            originating source of the payment; or the refund request directs
            sKart to issue the refund to a different financial institution than
            the source where the original payment was received; or sKart did not
            receive the payment for which the refund request is made due to
            force majeure or other causes beyond our direct control.
          </Text>
          <Text style={styles.listItem}>
            (3.) Refunds requiring special handling may result in a delayed
            return of the funds.
          </Text>
          <Text style={styles.listItem}>
            (4.) In the event a refund cannot be handled within standard refund
            protocols or to process a refund after 90 days, you may be asked to
            supply additional information and to provide documentation of the
            original charge.
          </Text>
          <Text style={styles.listItem}>
            (5.) Information disclosed to sKart for the purposes of processing a
            customer refund will be protected in accordance with our current
            Privacy Policy
          </Text>
        </View>

        <Text style={styles.heading}>
          General Terms & Conditions for Online Payments
        </Text>
        <Text style={styles.paragraph}>
          Once a Customer has accepted these Terms and Conditions, he/ she may
          register and avail the Services.
        </Text>
        <Text style={styles.paragraph}>
          In these Terms and Conditions, the term “Charge Back” shall mean,
          approved and settled credit card or net banking purchase
          transaction(s) which are at any time refused, debited or charged back
          to merchant account (and shall also include similar debits to Payment
          Service Provider's accounts, if any) by the acquiring bank or credit
          card company for any reason whatsoever, together with the bank fees,
          penalties and other charges incidental thereto.
        </Text>
        <Text style={styles.paragraph}>
          Server Slow Down/Session Timeout: In case the Website or Payment
          Service Provider’s webpage, that is linked to the Website, is
          experiencing any server related issues like ‘slow down’ or ‘failure’
          or ‘session timeout’, the Customer shall, before initiating the second
          payment, check whether his/her Bank Account has been debited or not
          and accordingly resort to one of the following options:
        </Text>
        <Text style={styles.paragraph}>
          In case the Bank Account appears to be debited, ensure that he/ she
          does not make the payment twice and immediately thereafter contact
          sKart via e-mail or any other mode of contact as provided by sKart to
          confirm payment.
        </Text>
        <Text style={styles.paragraph}>
          In case the Bank Account is not debited, the Customer may initiate a
          fresh transaction to make payment.
        </Text>

        <Text style={styles.heading}>LIMITATION OF LIABILITY</Text>
        <Text style={styles.paragraph}>
          sKart has made this Service available to the Customer as a matter of
          convenience. sKart expressly disclaims any claim or liability arising
          out of the provision of this Service. The Customer agrees and
          acknowledges that he/she shall be solely responsible for his/ her
          conduct and that sKart reserves the right to terminate the rights to
          use the Service immediately without giving any prior notice thereof.
        </Text>
        <Text style={styles.paragraph}>
          sKart, Company and/or the Payment Service Providers shall not be
          liable for any inaccuracy, error or delay in, or omission of (a) any
          data, information or message, or (b) the transmission or delivery of
          any such data, information or message; or (c) any loss or damage
          arising from or occasioned by any such inaccuracy, error, delay or
          omission, nonperformance or interruption in any such data, information
          or message. Under no circumstances shall the sKart, Company and/or the
          Payment Service Providers, its employees, directors, and its third
          party agents involved in processing, delivering or managing the
          Services, be liable for any direct, indirect, incidental, special or
          consequential damages, or any damages whatsoever, including punitive
          or exemplary arising out of or in any way connected with the provision
          of or any inadequacy or deficiency in the provision of the Services or
          resulting from unauthorized access or alteration of transmissions of
          data or arising from suspension or termination of the Services.
        </Text>
        <Text style={styles.paragraph}>
          The Customer shall indemnify and hold harmless the Payment Service
          Provider(s) and sKart and their respective officers, directors,
          agents, and employees, from any claim or demand, or actions arising
          out of or in connection with the utilization of the Services.
        </Text>
        <Text style={styles.paragraph}>
          The Customer agrees that sKart or any of its employees will not be
          held liable by the Customer for any loss or damages arising from your
          use of, or reliance upon the information contained on the Website, or
          any failure to comply with these Terms and Conditions where such
          failure is due to circumstance beyond sKart’s reasonable control.
        </Text>
        <Text style={styles.paragraph}>
          The Customer agrees that under no circumstances the “sKart” /
          "Company" and/or Payment Gateway Service Provider shall be held
          responsible for such fraudulent/duplicate transactions and hence no
          claims should be raised to “sKart” / "Company" and/or Payment Gateway
          Service Provider. No communication received by the “sKart” / "Company"
          and/or Payment Service Provider(s) in this regards shall be
          entertained by the “sKart” / "Company" and/or Payment Service
          Provider(s)
        </Text>
        <Text style={styles.paragraph}>
          SKart and the Payment Service Provider(s) assume no liability
          whatsoever for any monetary or other damage suffered by the Customer
          on account of:
        </Text>
        <Text style={styles.paragraph}>
          The delay, failure, interruption, or corruption of any data or other
          information transmitted in connection with use of the Payment Gateway
          or Services in connection thereto; and/ or
        </Text>
        <Text style={styles.paragraph}>
          Any interruption or errors in the operation of the Payment Gateway.
        </Text>
        <Text style={styles.paragraph}>
          The Customer agrees, understands and confirms that his/ her personal
          data including without limitation details relating to debit card/
          credit card transmitted over the Internet may be susceptible to
          misuse, hacking, theft and/ or fraud and that sKart or the Payment
          Service Provider(s) have no control over such matters.
        </Text>
        <Text style={styles.paragraph}>
          Although all reasonable care has been taken towards guarding against
          unauthorized use of any information transmitted by the Customer, sKart
          does not represent or guarantee that the use of the Services provided
          by/ through it will not result in theft and/or unauthorized use of
          data over the Internet.
        </Text>
        <Text style={styles.paragraph}>
          sKart, the Payment Service Provider(s) and its affiliates and
          associates shall not be liable, at any time, for any failure of
          performance, error, omission, interruption, deletion, defect, delay in
          operation or transmission, computer virus, communications line
          failure, theft or destruction or unauthorized access to, alteration
          of, or use of information contained on the Website.
        </Text>
        <Text style={styles.paragraph}>
          The Customer will be required to login his/ her own Customer ID and
          Password, given by sKart in order to register and/ or use the Services
          provided by Institute on the Website. By accepting these Terms and
          Conditions the Customer aggress that his/ her Customer ID and Password
          are very important pieces of information and it shall be the
          Customer’s own responsibility to keep them secure and confidential. In
          furtherance hereof, the Customer agrees to;
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            (1.) Choose a new password, whenever required for security reasons.
          </Text>
          <Text style={styles.listItem}>
            (2.) Keep his/ her Customer ID & Password strictly confidential.
          </Text>
          <Text style={styles.listItem}>
            (3.) Be responsible for any transactions made by Customer under such
            Customer ID and Password.
          </Text>
        </View>

        <Text style={styles.heading}>
          Debit/Credit Card, Bank Account Details
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            (1.) The Customer agrees that the debit/credit card details provided
            by him/ her for use of the aforesaid Service(s) must be correct and
            accurate and that the Customer shall not use a debit/ credit card,
            that is not lawfully owned by him/ her or the use of which is not
            authorized by the lawful owner thereof. The Customer further agrees
            and undertakes to provide correct and valid debit/credit card
            details.
          </Text>
          <Text style={styles.listItem}>
            (2.) The Customer may pay his/ her fees to sKart by using a
            debit/credit card or through online banking account. The Customer
            warrants, agrees and confirms that when he/ she initiates a payment
            transaction and/or issues an online payment instruction and provides
            his/ her card / bank details:
          </Text>
        </View>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            (.) The Customer is fully and lawfully entitled to use such credit /
            debit card, bank account for such transactions;
          </Text>
          <Text style={styles.listItem}>
            (.) The Customer is responsible to ensure that the card/ bank
            account details provided by him/ her are accurate
          </Text>
          <Text style={styles.listItem}>
            (.) The Customer is authorizing debit of the nominated card/ bank
            account for the payment of fees selected by such Customer along with
            the applicable Fees.
          </Text>
          <Text style={styles.listItem}>
            (.) The Customer is responsible to ensure sufficient credit is
            available on the nominated card/ bank account at the time of making
            the payment to permit the payment of the dues payable or the bill(s)
            selected by the Customer inclusive of the applicable Fee.
          </Text>
        </View>

        <Text style={styles.heading}>Payment Gateway Disclaimer</Text>
        <Text style={styles.paragraph}>
          The Service is provided in order to facilitate access to view and pay
          Fees online. sKart or the Payment Service Provider(s) do not make any
          representation of any kind, express or implied, as to the operation of
          the Payment Gateway other than what is specified in the Website for
          this purpose. By accepting/ agreeing to these Terms and Conditions,
          the Customer expressly agrees that his/ her use of the aforesaid
          online payment Service is entirely at own risk and responsibility of
          the Customer.
        </Text>

        <Text style={styles.heading}>Cancellation Policy</Text>
        <Text style={styles.paragraph}>
          The Cancellation Policy is dynamic and may change from time to time.
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            (1.) The Cancellation policy of sKart may change in the interim
            period of booking and date of expiry of subscription of services
          </Text>
          <Text style={styles.listItem}>
            (2.) The Cancellation Policy prevailing at the time of booking of
            service by the Customer will be the applicable policy.
          </Text>
          <Text style={styles.listItem}>
            (3.) sKart offers free cancellation for all bookings only if the
            consignments haven’t been physically reached any of our PUD centers
            or HUB. This means that sKart doesn't levy any cancellation fees of
            its own.
          </Text>
          <Text style={styles.listItem}>
            (4.) In case the service is availed by the customer than any request
            for cancellation of fees on account of any service deficiency would
            be subject to approval by appropriate authorities in sKart.
          </Text>
          <Text style={styles.listItem}>
            (5.) Any delay / loss / damage to the shipment because of force
            majeure wouldn’t be eligible for any refund.
          </Text>
          <Text style={styles.listItem}>
            (6.) Only those cancellation requests which are made either online
            or on email to our customer support team shall be entertained.
          </Text>
          <Text style={styles.listItem}>
            (7.) sKart may accept amendments to the booking at its sole
            discretion
          </Text>
          <Text style={styles.listItem}>
            (8.) All the refunds shall be done by sKart directly to you.
          </Text>
          <Text style={styles.listItem}>
            (9.) Your bank may debit its own separate charges from refunds made
            to your credit card or bank account.
          </Text>
        </View>

        <Text style={styles.heading}>
          Payment Refund Policy for Online Payments
        </Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: "bold" }}>
            Refund for Charge Back Transaction:
          </Text>{" "}
          In the event there is any claim for/ of charge back by the Customer
          for any reason whatsoever, such Customer shall immediately approach
          sKart with his/ her claim details and claim refund from sKart alone.
          Such refund (if any) shall be effected only by sKart via payment
          gateway or any other means as sKart deems appropriate. No claims for
          refund/ charge back shall be made by any Customer to the Payment
          Service Provider(s) and in the event such claim is made it shall not
          be entertained.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: "bold" }}>
            Refund for fraudulent/duplicate transaction(s):
          </Text>{" "}
          The Customer shall directly contact sKart for any fraudulent
          transaction(s) on account of misuse of Card/ Bank details by a
          fraudulent individual/party and such issues shall be suitably
          addressed by sKart alone in line with their policies and rules.
        </Text>
        <Text style={styles.paragraph}>
          If any part of these Terms and Conditions are determined to be invalid
          or unenforceable pursuant to applicable law including, but not limited
          to, the warranty disclaimers and liability limitations set forth
          herein, then the invalid or unenforceable provision will be deemed
          superseded by a valid, enforceable provision that most closely matches
          the intent of the original provision and the remainder of these Terms
          and Conditions shall continue in effect
        </Text>
      </Page>
    </Document>
  );
};

export default PrivacyPolicy;
