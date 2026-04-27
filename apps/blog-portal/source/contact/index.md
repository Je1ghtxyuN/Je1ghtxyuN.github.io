---
title: Contact
date: 2026-04-27 00:00:00
top_img: /shared-assets/images/background.jpg
aside: true
comments: false
description: Contact and inquiry entry page prepared for future Formspree integration.
---

## Contact Overview

This page is the future public contact entry for the portal.

- The current form structure is a placeholder.
- The final Formspree endpoint has not been connected yet.
- Backend-owned contact handling may replace Formspree later if the architecture decision changes.

## Planned Contact Fields

- Name
- Email
- Topic
- Message

## Placeholder Form Structure

<form action="https://formspree.io/f/your-form-id" method="POST">
  <fieldset disabled>
    <p><strong>Status:</strong> Placeholder only. Replace the Formspree endpoint before launch.</p>
    <p>
      <label>Name<br>
        <input type="text" name="name" placeholder="Your name">
      </label>
    </p>
    <p>
      <label>Email<br>
        <input type="email" name="email" placeholder="you@example.com">
      </label>
    </p>
    <p>
      <label>Topic<br>
        <input type="text" name="topic" placeholder="Project, collaboration, or hello">
      </label>
    </p>
    <p>
      <label>Message<br>
        <textarea name="message" rows="6" placeholder="Write your message here"></textarea>
      </label>
    </p>
    <p>
      <button type="submit">Send Placeholder Message</button>
    </p>
  </fieldset>
</form>

## Editing Notes

- Form endpoint placeholder is also stored in `source/_data/site_profile.yml`.
- Replace placeholder contact data before this page is considered public-ready.
