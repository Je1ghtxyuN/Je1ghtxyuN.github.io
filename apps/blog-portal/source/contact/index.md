---
title: Contact
date: 2026-04-27 00:00:00
top_img: /shared-assets/images/background.jpg
aside: true
comments: false
description: Contact channels and a Formspree-ready message form for the portal rebuild.
---

## Contact Channels

- Email: `hello@je1ghtxyun.dev`
- Location: Nanjing, Jiangsu, China
- Best for: project discussions, collaboration ideas, technical writing, and portfolio conversation

## What To Include In Your Message

The clearest messages usually include:

1. who you are
2. what you are reaching out about
3. useful links or context
4. how you would like me to reply

## Contact Form

<form action="https://formspree.io/f/your-form-id" method="POST">
  <fieldset>
    <legend>Send a message</legend>
    <input type="hidden" name="_subject" value="Portal Contact Message">
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
        <input type="text" name="topic" placeholder="Project, collaboration, or a quick hello">
      </label>
    </p>
    <p>
      <label>Message<br>
        <textarea name="message" rows="6" placeholder="A short introduction and your message"></textarea>
      </label>
    </p>
    <p>
      <button type="submit">Send Message</button>
    </p>
  </fieldset>
</form>

## Notes

- This form structure is ready for Formspree-style submission once the final endpoint is added.
- The endpoint is still a placeholder and must be replaced before public launch.
- In the long term, this flow may move behind the self-hosted backend service instead of staying on Formspree.
