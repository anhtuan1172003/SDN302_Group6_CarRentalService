import React from "react";

import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Term() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/register");
  };

  return (
    <Container className="py-5">
      <h1 className="text-center fw-bold text-primary mb-4">Terms of Use</h1>

      <h4 className="fw-bold mt-4">INTRODUCTION</h4>
      <p>
        EAN Services, LLC (“Alamo” or “We”) provides this website (“Site”) for
        your use, subject to these Terms of Use and all applicable laws and
        regulations. Please read these Terms of Use carefully. By accessing
        and/or using the Site, you fully and unconditionally accept and agree to
        be bound by these Terms of Use, including binding arbitration. If you do
        not agree to them, please do not visit or use the Site.
      </p>

      <h4 className="fw-bold mt-4">USE OF THE SITE</h4>
      <p>
        Alamo maintains the Site for your informational and non-commercial
        personal use. Your use of the Site for any other purpose is permissible
        only upon the express prior written consent of Alamo.
      </p>

      <h4 className="fw-bold mt-4">SCRAPERS AND BOTS</h4>
      <p>
        Use of any robot, spider, site search, retrieval application or other
        manual or automatic device to retrieve, index, scrape, data mine or in
        any way gather or extract discount coupons or other content on or
        available through the Site or reproduce or circumvent the navigational
        structure or presentation on the Site without Alamo's express written
        consent is prohibited.
      </p>

      <h4 className="fw-bold mt-4">PRIVACY POLICY</h4>
      <p>
        Alamo takes your privacy seriously. Any information submitted on or
        collected through the Site is subject to our Privacy Policy, the terms
        of which are incorporated into these Terms of Use.
      </p>

      <h4 className="fw-bold mt-4">LINKS TO OTHER SITES</h4>
      <p>
        The Site may include links to third-party websites. Alamo does not
        control and is not responsible for the content or privacy policies of
        any linked site, and the inclusion of any link on the Site does not
        imply our endorsement, review or approval of it.
      </p>

      <h4 className="fw-bold mt-4">RESERVATIONS AND TRANSACTIONS</h4>
      <p>
        All reservations and transactions made through the Site are subject to
        Alamo's acceptance, which is in our sole discretion.
      </p>

      <h4 className="fw-bold mt-4">USER RESPONSIBILITIES</h4>
      <p>
        You agree to use the Site responsibly and in compliance with all
        applicable laws, regulations, and these Terms of Use.
      </p>

      <h4 className="fw-bold mt-4">LIMITATION OF LIABILITY</h4>
      <p>
        Under no circumstances will Alamo be liable for any damages resulting
        from your use of the Site or the inability to use the Site.
      </p>

      <h4 className="fw-bold mt-4">INDEMNIFICATION</h4>
      <p>
        You agree to indemnify, defend, and hold harmless Alamo from and against
        all claims, damages, costs, and expenses arising from your use of the
        Site.
      </p>

      <h4 className="fw-bold mt-4">INTELLECTUAL PROPERTY</h4>
      <p>
        All content on the Site, including text, graphics, logos, and images, is
        the property of Alamo and is protected by copyright laws.
      </p>

      <h4 className="fw-bold mt-4">TERMINATION</h4>
      <p>
        Alamo reserves the right to terminate or suspend your access to the Site
        at any time, without notice, for conduct that violates these Terms of
        Use.
      </p>

      <h4 className="fw-bold mt-4">DISCLAIMER</h4>
      <p>The Site is provided "as is" without warranty of any kind, express or implied.</p>

      <h4 className="fw-bold mt-4">GOVERNING LAW</h4>
      <p>
        These Terms of Use are governed by and construed in accordance with the
        laws of the state where Alamo is headquartered.
      </p>

      <h4 className="fw-bold mt-4">MODIFICATIONS</h4>
      <p>
        Alamo reserves the right to modify these Terms of Use at any time. Your
        continued use of the Site constitutes acceptance of the modified terms.
      </p>

      <h4 className="fw-bold mt-4">CONTACT INFORMATION</h4>
      <p>
        If you have any questions about these Terms of Use, please contact us at
        support@alamo.com.
      </p>

      <Button variant="warning" className="mt-4 fw-bold" onClick={handleBack}>
        Back to Login
      </Button>
    </Container>
  );
}

export default Term;
