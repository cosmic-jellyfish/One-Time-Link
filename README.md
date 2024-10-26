# One-Time Link Generator

This project allows users to create one-time links to securely share content. Once the link is accessed, it becomes invalid, ensuring that content is only viewable once.

A live version of this project [can be found here!](https://damn.not-so-cool.com/)

This project is released as open source to promote transparency and accessibility. I want others to benefit from the work I’ve done, whether it's for learning purposes or for enhancing their own projects.

---


## Table of Contents
- [Features](https://github.com/cosmic-jellyfish/1-timer/new/main?filename=README.md#features)
- [Tech Stack](https://github.com/cosmic-jellyfish/1-timer/new/main?filename=README.md#tech-stack)
- [Usage](https://github.com/cosmic-jellyfish/1-timer/new/main?filename=README.md#usage)


## Features
- Generate one-time links to securely share content
- Each link has a customisable expiration time
- Links are marked as "viewed" after the first access, preventing reuse
- Notifications for when clipboard is copied


## Tech Stack
This project utilises: 

- **Backend:** Node.js, Express
- **Database:** Supabase
- **Deployment:** Vercel
- **Frontend:** HTML, CSS, JavaScript


## Usage
### Generating a One-Time Link

- Go to the [home page](https://damn.not-so-cool.com/)
- Enter the content you wish to share
- Set the expiration time in minutes (*optional, defaults to 60 minutes*)
- Click "Generate Link" and a unique one-time link will be created, copied to your clipboard, and shown on the screen.

### Accessing a One-Time Link
- Share the link with the recipient
- The link is only accessible **once**. After that, it will no longer exist.
