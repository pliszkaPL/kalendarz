# Git Workflow and Branch Strategy

This document describes the git workflow, branch naming conventions, and best practices for this project.

## Branch Naming Convention

### Format
```
<type>/<ticket-id>-<short-description>
```

### Types

#### Feature Branches
**Purpose:** New features or enhancements

**Format:** `feature/<ticket-id>-<description>`

**Examples:**
```bash
feature/123-user-authentication
feature/456-add-payment-gateway
feature/789-implement-caching-layer
```

**Lifecycle:**
- Created from: `main` or `develop`
- Merged to: `develop` or `main`
- Delete after: Merge is complete

#### Bugfix Branches
**Purpose:** Fix bugs found in development or staging

**Format:** `bugfix/<ticket-id>-<description>`

**Examples:**
```bash
bugfix/234-fix-login-validation
bugfix/567-correct-price-calculation
bugfix/890-resolve-memory-leak
```

**Lifecycle:**
- Created from: `develop` or affected branch
- Merged to: `develop` or `main`
- Delete after: Merge is complete

#### Hotfix Branches
**Purpose:** Critical fixes for production issues

**Format:** `hotfix/<ticket-id>-<description>`

**Examples:**
```bash
hotfix/111-critical-security-patch
hotfix/222-fix-payment-processing
hotfix/333-restore-database-connection
```

**Lifecycle:**
- Created from: `main` (production)
- Merged to: `main` AND `develop`
- Delete after: Both merges complete
- **Priority:** Highest - requires immediate attention

#### Release Branches
**Purpose:** Prepare for production release

**Format:** `release/<version>`

**Examples:**
```bash
release/1.0.0
release/1.2.0
release/2.0.0-rc1
```

**Lifecycle:**
- Created from: `develop`
- Merged to: `main` AND `develop`
- Delete after: Release is deployed
- Only bug fixes allowed

#### Chore Branches
**Purpose:** Maintenance tasks, dependency updates, tooling

**Format:** `chore/<ticket-id>-<description>`

**Examples:**
```bash
chore/444-update-dependencies
chore/555-configure-ci-pipeline
chore/666-improve-docker-setup
```

**Lifecycle:**
- Created from: `main` or `develop`
- Merged to: `develop` or `main`
- Delete after: Merge is complete

#### Refactor Branches
**Purpose:** Code refactoring without changing functionality

**Format:** `refactor/<ticket-id>-<description>`

**Examples:**
```bash
refactor/777-extract-service-layer
refactor/888-simplify-authentication
refactor/999-optimize-query-performance
```

**Lifecycle:**
- Created from: `develop`
- Merged to: `develop`
- Delete after: Merge is complete

#### Documentation Branches
**Purpose:** Documentation updates only

**Format:** `docs/<ticket-id>-<description>`

**Examples:**
```bash
docs/101-update-api-documentation
docs/202-add-setup-instructions
docs/303-create-architecture-diagrams
```

**Lifecycle:**
- Created from: `main` or `develop`
- Merged to: Same branch it was created from
- Delete after: Merge is complete

#### Test Branches
**Purpose:** Add or improve tests

**Format:** `test/<ticket-id>-<description>`

**Examples:**
```bash
test/404-add-integration-tests
test/505-improve-unit-test-coverage
test/606-create-e2e-test-suite
```

**Lifecycle:**
- Created from: `develop`
- Merged to: `develop`
- Delete after: Merge is complete

#### Experiment Branches
**Purpose:** Proof of concepts, experiments, spikes

**Format:** `experiment/<description>` or `spike/<description>`

**Examples:**
```bash
experiment/new-framework-evaluation
experiment/performance-optimization-poc
spike/graphql-implementation
```

**Lifecycle:**
- Created from: Any branch
- May never be merged
- Delete after: Experiment conclusion
- **Note:** Use when outcome is uncertain

## Git Workflow Strategies

### 1. GitHub Flow (Recommended for this project)

**Best for:** Continuous deployment, small teams, single production environment

**Main Branch:** `main`

**Workflow:**
```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/123-new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature implementation"

# 3. Push and create pull request
git push -u origin feature/123-new-feature

# 4. After PR approval, merge to main
# 5. Deploy from main
# 6. Delete feature branch
git branch -d feature/123-new-feature
```

**Principles:**
- `main` is always deployable
- Feature branches are short-lived
- Pull requests required for all changes
- CI/CD runs on every push
- Deploy from `main` frequently

### 2. Git Flow (For larger projects with scheduled releases)

**Best for:** Scheduled releases, multiple environments, larger teams

**Main Branches:**
- `main` (production)
- `develop` (integration)

**Support Branches:**
- `feature/*` (new features)
- `release/*` (release preparation)
- `hotfix/*` (production fixes)

**Workflow:**

#### Feature Development
```bash
# 1. Create feature from develop
git checkout develop
git pull origin develop
git checkout -b feature/456-payment-system

# 2. Work on feature
git add .
git commit -m "feat: implement payment gateway"

# 3. Merge back to develop
git checkout develop
git pull origin develop
git merge --no-ff feature/456-payment-system
git push origin develop

# 4. Delete feature branch
git branch -d feature/456-payment-system
```

#### Release Process
```bash
# 1. Create release branch
git checkout develop
git checkout -b release/1.2.0

# 2. Fix release bugs only
git commit -m "fix: correct version number"

# 3. Merge to main
git checkout main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"

# 4. Merge back to develop
git checkout develop
git merge --no-ff release/1.2.0

# 5. Delete release branch
git branch -d release/1.2.0
```

#### Hotfix Process
```bash
# 1. Create hotfix from main
git checkout main
git checkout -b hotfix/1.2.1-critical-bug

# 2. Fix the issue
git commit -m "fix: resolve critical security issue"

# 3. Merge to main
git checkout main
git merge --no-ff hotfix/1.2.1-critical-bug
git tag -a v1.2.1 -m "Hotfix 1.2.1"

# 4. Merge to develop
git checkout develop
git merge --no-ff hotfix/1.2.1-critical-bug

# 5. Delete hotfix branch
git branch -d hotfix/1.2.1-critical-bug
```

### 3. Trunk-Based Development

**Best for:** Mature CI/CD, experienced teams, high deployment frequency

**Main Branch:** `main` (or `trunk`)

**Workflow:**
```bash
# 1. Create short-lived branch
git checkout main
git checkout -b feature/789-quick-fix

# 2. Make small changes (< 1 day of work)
git commit -m "feat: add quick improvement"

# 3. Integrate quickly (multiple times per day)
git checkout main
git pull origin main
git merge feature/789-quick-fix
git push origin main

# 4. Delete branch immediately
git branch -d feature/789-quick-fix
```

**Principles:**
- Very short-lived branches (hours, not days)
- Commit to `main` multiple times per day
- Feature flags for incomplete features
- Strong automated testing
- Immediate integration

## Commit Message Convention

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD configuration changes
- `chore`: Maintenance tasks
- `revert`: Revert previous commit

### Examples

#### Simple commit
```bash
git commit -m "feat: add user authentication endpoint"
```

#### Detailed commit
```bash
git commit -m "feat(auth): add JWT token validation

- Implement token validation middleware
- Add token expiration check
- Create refresh token mechanism

Closes #123"
```

#### Bug fix
```bash
git commit -m "fix(payment): correct price calculation in checkout

The total price was not including tax correctly when multiple
items were in the cart. This fix ensures tax is calculated
on the subtotal before applying discounts.

Fixes #456"
```

#### Breaking change
```bash
git commit -m "feat(api)!: change authentication endpoint structure

BREAKING CHANGE: Authentication endpoint now requires email
instead of username. Update all API clients accordingly.

Migration guide: Update POST /api/auth/login payload from
{ username: 'user' } to { email: 'user@example.com' }"
```

## Best Practices

### General Rules

1. **Always pull before creating a branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/new-feature
   ```

2. **Keep branches up to date**
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/new-feature
   git merge main
   # or
   git rebase main
   ```

3. **Make atomic commits**
   - One logical change per commit
   - Each commit should be independently functional
   - Easy to review and revert if needed

4. **Write meaningful commit messages**
   - Explain WHY, not WHAT (code shows what)
   - Use imperative mood ("add feature" not "added feature")
   - Reference ticket/issue numbers

5. **Delete branches after merge**
   ```bash
   git branch -d feature/123-completed-feature
   git push origin --delete feature/123-completed-feature
   ```

6. **Never commit directly to main/develop**
   - Always use pull requests
   - Require code review
   - Run automated tests

7. **Use meaningful branch descriptions**
   - Keep it short but descriptive
   - Use kebab-case
   - Include ticket/issue number

### Code Review Process

1. **Create pull request** with clear description
2. **Reference related issues** (Closes #123)
3. **Wait for CI/CD** to pass
4. **Request review** from team members
5. **Address feedback** with additional commits
6. **Squash commits** if necessary
7. **Merge** after approval

### Protected Branches

Configure branch protection for:
- `main`
- `develop` (if using Git Flow)

**Rules:**
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict who can push
- Require linear history (optional)

## Emergency Procedures

### Reverting a Commit
```bash
# Revert last commit (creates new commit)
git revert HEAD

# Revert specific commit
git revert <commit-hash>
```

### Rolling Back Production
```bash
# 1. Create hotfix from last good commit
git checkout <last-good-commit>
git checkout -b hotfix/rollback-bad-deploy

# 2. Tag and deploy
git tag -a v1.2.3-rollback -m "Emergency rollback"
git push origin hotfix/rollback-bad-deploy --tags

# 3. Fix the issue properly in new branch
```

### Recovering Deleted Branch
```bash
# Find the commit SHA
git reflog

# Restore branch
git checkout -b feature/recovered-branch <commit-sha>
```

## Tools and Commands

### Useful Git Aliases
Add to `~/.gitconfig`:
```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --graph --oneline --all
    cleanup = "!git branch --merged | grep -v '\\*\\|main\\|develop' | xargs -n 1 git branch -d"
```

### Check Branch Status
```bash
# List all branches
git branch -a

# List merged branches
git branch --merged

# List unmerged branches
git branch --no-merged

# Show branch age
git for-each-ref --sort=committerdate refs/heads/ --format='%(committerdate:short) %(refname:short)'
```

### Interactive Rebase
```bash
# Clean up last 3 commits
git rebase -i HEAD~3

# Options: pick, reword, edit, squash, fixup, drop
```

## Integration with Makefile

Add git commands to Makefile for convenience:

```makefile
# Git commands (already implemented)
.PHONY: commit-rollback uncommit
commit-rollback uncommit: ## Rollback last commit (soft reset)
	@bash ./bin/scripts/commit-rollback.sh

.PHONY: commit-show last-commit
commit-show last-commit: ## Show last commit details
	@git log -1 --stat

# Additional useful commands
.PHONY: git-cleanup
git-cleanup: ## Delete merged branches
	@git branch --merged | grep -v '\\*\\|main\\|develop' | xargs -n 1 git branch -d

.PHONY: git-status
git-status: ## Show detailed git status
	@git status -sb
	@echo ""
	@echo "Recent commits:"
	@git log --oneline -5
```

## Summary

**Default workflow for this project:** GitHub Flow
- Simple and effective
- Single `main` branch
- Feature branches for all changes
- Pull requests for code review
- Continuous deployment

**Branch naming:** `<type>/<ticket-id>-<description>`

**Commit messages:** Follow conventional commits format

**Never:** Commit directly to `main`

**Always:** Use pull requests and code review
