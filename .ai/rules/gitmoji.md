# Gitmoji + Conventional Commits Reference

This document maps Gitmoji emojis to Conventional Commit types, providing a visual reference for integrating emojis into structured commit messages. Each emoji is categorized by Conventional Commit type for easier usage.

---

## ✨ feat – New Features
| Emoji | Description |
|-------|-------------|
| ✨ | Introducing new features |
| 🆕 | New functionality or feature |
| 🧩 | Add new modular components |

### Example
```
✨ feat(auth): add OAuth2 login
```

---

## 🐛 fix – Bug Fixes
| Emoji | Description |
|-------|-------------|
| 🐛 | Fixing a bug |
| 🔧 | Small fix or adjustment |
| 🚑 | Critical hotfix |

### Example
```
🐛 fix(parser): handle null pointer exception
```

---

## 📝 docs – Documentation
| Emoji | Description |
|-------|-------------|
| 📝 | Documentation changes |
| 📖 | Update user guides or manuals |
| 🔖 | Tag or release notes updates |

### Example
```
📝 docs: update README with installation steps
```

---

## 🎨 style – Code Style
| Emoji | Description |
|-------|-------------|
| 🎨 | Code formatting, styling improvements |
| 💄 | Cosmetic UI improvements |

### Example
```
🎨 style: reformat code with prettier
```

---

## ♻️ refactor – Refactoring
| Emoji | Description |
|-------|-------------|
| ♻️ | Refactoring code without changing behavior |
| 🔨 | Code structure improvements |

### Example
```
♻️ refactor(utils): extract validation logic
```

---

## ⚡️ perf – Performance
| Emoji | Description |
|-------|-------------|
| ⚡️ | Improve performance or optimize code |
| 🏎️ | Performance enhancement |

### Example
```
⚡️ perf(db): optimize query for large datasets
```

---

## ✅ test – Tests
| Emoji | Description |
|-------|-------------|
| ✅ | Adding or fixing tests |
| 🧪 | Experimental tests or prototypes |
| 🔬 | Unit tests or integration tests |

### Example
```
✅ test: add unit tests for payment module
```

---

## 👷 build – Build System
| Emoji | Description |
|-------|-------------|
| 👷 | Build process changes, CI/CD pipeline |
| 📦 | Package updates or changes |
| 🛠️ | Build or deployment tooling changes |

### Example
```
👷 build(deps): bump dependency versions
```

---

## 💚 ci – Continuous Integration
| Emoji | Description |
|-------|-------------|
| 💚 | CI configuration or fixes |
| 🔁 | Re-run CI builds |
| 📡 | Deployment pipeline changes |

### Example
```
💚 ci: update GitHub Actions workflow for Node 20
```

---

## 🧹 chore – Maintenance / Miscellaneous
| Emoji | Description |
|-------|-------------|
| 🧹 | General chores, cleanup |
| 🔒 | Security updates or patches |
| ⬆️ | Dependency updates |
| ♻️ | General maintenance or refactor not affecting features |

### Example
```
🧹 chore: remove obsolete scripts
```

---

## ⏪ revert – Reverting Commits
| Emoji | Description |
|-------|-------------|
| ⏪ | Revert a previous commit |

### Example
```
⏪ revert: undo previous faulty commit
```

---

## ⚠️ Breaking Changes
Use the **!** after type or include `BREAKING CHANGE:` in the footer.
| Emoji | Description |
|-------|-------------|
| 💥 | Breaking change affecting API or behavior |

### Example
```
✨ feat!: migrate API to version 2.0

💥 BREAKING CHANGE: old authentication endpoints are no longer supported.
```

