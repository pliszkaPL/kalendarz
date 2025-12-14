# Conventional Commits Documentation

This document provides a complete reference for using **Conventional Commits 1.0.0**, including structure, commit types, breaking changes, examples, and best practices.

---

## 📄 Commit Message Structure

A valid Conventional Commit message MUST follow this structure:

```
<type>[optional scope]: <short description>

[optional body]

[optional footers]
```

### Elements
- **type** – required. Describes the purpose of the change (e.g., `feat`, `fix`).
- **scope** – optional. Provides additional contextual information (e.g., `auth`, `api`, `ui`). Written in parentheses.
- **description** – short summary of the change.
- **body** – optional. A more detailed explanation of the change.
- **footers** – optional. Used for metadata such as references, acknowledgments, or breaking changes.

---

## ✅ Commit Types

Below are the recommended commit types commonly used in projects. Only `feat` and `fix` are required by the specification, but others help maintain clarity.

### **feat**
A new feature.
```
feat: add user authentication
```

### **fix**
A bug fix.
```
fix(parser): handle null pointer when parsing headers
```

### **docs**
Documentation-only changes.
```
docs: update installation instructions
```

### **style**
Code formatting changes that do not affect behavior.
```
style: apply eslint formatting
```

### **refactor**
Code changes that do not add features or fix bugs.
```
refactor(core): simplify validation logic
```

### **perf**
Performance improvements.
```
perf(db): optimize query for large datasets
```

### **test**
Adding or updating tests.
```
test: add missing unit tests for payments
```

### **build**
Changes affecting build tools or dependencies.
```
build(deps): update dependency versions
```

### **ci**
Changes to CI/CD configuration.
```
ci: update GitHub Actions workflow
```

### **chore**
Maintenance tasks that do not affect production code.
```
chore: update project license year
```

### **revert**
Reverts a previous commit.
```
revert: undo incorrect refactor
```

---

## ⚠️ Breaking Changes

Breaking changes indicate updates that are **not backward compatible**.

You can declare a breaking change in two ways:

### 1. By adding `!` after type or scope
```
feat!: drop support for legacy API
```
```
feat(api)!: rework authentication flow
```

### 2. By adding a `BREAKING CHANGE:` footer
```
chore: remove deprecated method

BREAKING CHANGE: public API method `getUser()` has been removed.
```

A breaking change triggers a **major version bump** when using semantic versioning.

---

## ✨ Example Commits

```
feat: add new dashboard UI
```
```
fix(auth): correct token refresh handling
```
```
docs: improve README formatting
```
```
style: reformat code with prettier
```
```
refactor(utils): extract shared parsing logic
```
```
perf(api): reduce response time for heavy requests
```
```
test: add integration tests for login
```
```
build(deps): bump react to latest version
```
```
ci: update pipeline to node 20
```
```
chore: remove unused scripts
```
```
revert: revert previous commit due to regression
```
```
feat!: migrate to new authorization system
```
```
chore!: remove support for Node 10

BREAKING CHANGE: Node 10 is no longer supported.
```
```
fix: prevent race condition in request scheduler

Introduce request IDs to track and reject stale responses.

Reviewed-by: John Doe
Refs: #123
```

---

## 🛠️ Best Practices

- Keep commit messages focused: **one logical change per commit**.
- Use scopes consistently across your project.
- Keep descriptions short but meaningful.
- Use the body to explain *why* a change was made, not what was changed.
- Use breaking change indicators whenever the change is not backward compatible.
- Follow the structure strictly to enable automation tools such as changelog generators and semantic versioning.

---

## 🧾 Summary

Conventional Commits provide a clear, structured, and machine-readable format that helps teams:
- maintain readable commit histories,
- enable automated changelog generation,
- enforce semantic versioning rules,
- improve collaboration and review processes.

Adopting this convention leads to cleaner development workflows and more predictable releases.

