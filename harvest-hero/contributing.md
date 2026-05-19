# Contributing to HarvestHero

First off! Thanks for taking the time to contribute. Every bug fix, feature, and doc improvement makes HarvestHero better for farmers and vendors who depend on it.

This document covers everything you need to know to get started.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting the Project Running Locally](#getting-the-project-running-locally)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

Be respectful. Disagreements are fine rudeness isn't. We're all here to build something useful.

---

## How Can I Contribute?

There are several ways to help:

- **Fix a bug** - check the [Issues](../../issues) tab for anything labelled `bug`
- **Build a feature** - look for issues labelled `enhancement` or `good first issue`
- **Improve the docs** - spotted something unclear or missing? Fix it
- **Write tests** - test coverage is always welcome
- **Review pull requests** - a second pair of eyes helps everyone

If you're unsure where to start, open an issue and ask. We'll help you find something suitable.

---

## Getting the Project Running Locally

Follow the setup steps in [README.md](https://github.com/Tech-No-Phile/HarvestHero/blob/main/harvest-hero/ReadMe.md). Once you have it running:

1. Make sure both the client (`localhost:5173`) and server (`localhost:5000`) are running
2. For blockchain features, ensure the Hardhat node is also up (`npx hardhat node`)
3. Confirm your `.env` file has all required values filled in

---

## Branch Naming

Create a new branch for every change. Use this naming pattern:

```
feat/short-description       # new feature
fix/short-description        # bug fix
docs/short-description       # documentation only
refactor/short-description   # code cleanup, no behaviour change
test/short-description       # adding or updating tests
```

Examples:

```bash
git checkout -b feat/bid-negotiation
git checkout -b fix/vendor-purchase-stats
git checkout -b docs/update-api-reference
```

---

## Commit Messages

Write commit messages that explain *what* changed and *why*, not just *what file* changed.

**Format:**
```
<type>: <short summary>

<optional body - explain why, not what>
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**Good examples:**
```
feat: add price negotiation between farmer and vendor
fix: buyerId comparison now handles both string and object IDs
docs: add blockchain flow diagram to README
```

**Avoid:**
```
fixed stuff
update
WIP
```

Keep the summary under 72 characters. If more context is needed, add it in the body.

---

## Pull Request Process

1. **Fork** the repository and create your branch from `main`
2. **Make your changes** - keep them focused on one thing per PR
3. **Test your changes** - make sure nothing existing breaks
4. **Update docs** if your change affects setup, APIs, or behaviour
5. **Open a pull request** against the `main` branch

In your PR description, include:

- What problem does this solve?
- How did you test it?
- Screenshots or recordings if it's a UI change
- Any known limitations or follow-up work needed

PRs that touch the blockchain integration should note whether they were tested with a live Hardhat node.

A maintainer will review your PR within a few days. We may ask for changes - that's normal, not a rejection.

---

## Code Style

### General

- Prefer clarity over cleverness - the next person reading this might be a first-time contributor
- Keep functions small and focused
- Delete commented-out code before opening a PR

### Frontend (React)

- Use functional components with hooks, no class components
- Keep component files focused; split large components into smaller ones
- Use Tailwind utility classes; avoid inline `style` props unless absolutely necessary
- State that belongs to one component stays in that component, don't lift unnecessarily

### Backend (Express)

- Keep route handlers thin business logic belongs in separate controller or service functions
- Always handle errors with try/catch and return meaningful error messages
- Use `async/await` --> avoid `.then()` chains

### Blockchain

- Test contract changes against the local Hardhat node before raising a PR
- Document any new contract functions with NatSpec comments

---

## Reporting Bugs

Before opening a bug report, check if it already exists in [Issues](../../issues).

When you open a new bug report, include:

- **What you expected to happen**
- **What actually happened**
- **Steps to reproduce** - the more specific, the faster we can fix it
- **Environment** - OS, Node.js version, browser
- **Console errors or logs** - paste them in full, wrapped in code blocks

---

## Suggesting Features

Open an issue with the label `enhancement`. Describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you considered
- Who this would help (farmers, vendors, landowners, or all three)

Features that align with the [Roadmap](https://github.com/Tech-No-Phile/HarvestHero/blob/main/harvest-hero/ReadMe.md) are more likely to be picked up quickly, but nothing is off the table.

---

## Questions?

If something in this document is unclear, or you're stuck on setup, open an issue and tag it `question`. We'll get back to you.

Thanks again for contributing. It means a lot.
