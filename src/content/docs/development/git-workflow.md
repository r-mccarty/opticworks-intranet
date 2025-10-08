---
title: Git Workflow
description: Git workflow and best practices for OpticWorks development.
---

## Branching Strategy

We use a modified Git Flow workflow that balances flexibility with structure.

### Main Branches

#### `main`
- Production-ready code
- Protected branch (requires PR approval)
- Automatically deploys to production
- Never commit directly

#### `develop`
- Integration branch for features
- Staging environment deployment
- Base for feature branches
- Protected branch

### Supporting Branches

#### Feature Branches
```bash
# Create from develop
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# Naming convention
feature/short-description
feature/add-dark-mode
feature/user-profile-page
```

#### Bugfix Branches
```bash
# Create from develop
git checkout develop
git checkout -b bugfix/login-timeout

# Naming convention
bugfix/short-description
bugfix/fix-memory-leak
bugfix/resolve-api-error
```

#### Hotfix Branches
```bash
# Create from main (for urgent production fixes)
git checkout main
git checkout -b hotfix/security-patch

# Naming convention
hotfix/critical-issue-description
```

## Daily Workflow

### Starting a New Feature

```bash
# 1. Ensure develop is up to date
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Make changes and commit regularly
git add .
git commit -m "feat: add user authentication"

# 4. Push to remote
git push -u origin feature/new-feature

# 5. Create pull request when ready
```

### Keeping Your Branch Updated

```bash
# Regularly sync with develop
git checkout develop
git pull origin develop
git checkout feature/your-feature
git rebase develop

# Or use merge if you prefer
git merge develop
```

### Resolving Conflicts

```bash
# During rebase/merge, if conflicts occur
git status  # See conflicted files

# Edit files to resolve conflicts
# Look for markers: <<<<<<<, =======, >>>>>>>

# After resolving
git add <resolved-files>
git rebase --continue  # if rebasing
# or
git commit  # if merging
```

## Commit Guidelines

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add user registration` |
| `fix` | Bug fix | `fix: resolve login timeout` |
| `docs` | Documentation | `docs: update API guide` |
| `style` | Code style/formatting | `style: fix linting errors` |
| `refactor` | Code refactoring | `refactor: simplify auth logic` |
| `test` | Add/update tests | `test: add user service tests` |
| `chore` | Maintenance | `chore: update dependencies` |
| `perf` | Performance | `perf: optimize database queries` |
| `ci` | CI/CD changes | `ci: update deployment pipeline` |

### Good Commit Examples

```bash
feat: add password reset functionality

Implements password reset via email with secure token.
Includes rate limiting to prevent abuse.

Closes #123

---

fix: resolve race condition in payment processing

The payment handler was processing concurrent requests
incorrectly, leading to duplicate charges.

Fixes #456

---

docs: add authentication flow diagram

---

refactor: extract validation logic to separate module

Improves testability and reusability of validation functions.

---

test: add integration tests for checkout flow
```

### Commit Best Practices

#### Do's
- ✅ Make atomic commits (one logical change per commit)
- ✅ Write descriptive commit messages
- ✅ Commit early and often
- ✅ Reference issue numbers when applicable
- ✅ Use present tense ("add feature" not "added feature")

#### Don'ts
- ❌ Don't commit commented-out code
- ❌ Don't commit console.log or debug statements
- ❌ Don't commit sensitive data (API keys, passwords)
- ❌ Don't commit large binary files (unless necessary)
- ❌ Don't use vague messages like "fix stuff" or "update"

## Pull Request Process

### Creating a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature
   ```

2. **Open PR on GitHub**
   - Navigate to repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out PR template

3. **PR Title Format**
   ```
   [Type] Brief description

   Examples:
   [Feature] Add user authentication
   [Bugfix] Fix memory leak in image processing
   [Hotfix] Patch security vulnerability
   ```

4. **PR Description Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Changes Made
   - Bullet point list of changes
   - Each significant change on its own line

   ## Testing
   - How to test these changes
   - Any specific test cases

   ## Screenshots (if applicable)
   [Add screenshots]

   ## Related Issues
   Closes #123
   Related to #456

   ## Checklist
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] No console.log statements
   - [ ] Code follows style guide
   - [ ] Security considerations addressed
   ```

### PR Review Process

#### For Authors

1. **Self-review first**
   - Review your own code before requesting review
   - Check for debug code, console.logs
   - Ensure tests pass
   - Run linter

2. **Request reviewers**
   - Assign at least 2 reviewers
   - Include domain expert when relevant
   - Tag in Slack for urgent reviews

3. **Respond to feedback**
   - Address all comments
   - Push additional commits with fixes
   - Reply to comments explaining changes
   - Re-request review after updates

4. **Keep PR updated**
   - Rebase on develop if conflicts arise
   - Keep PR description current
   - Update related documentation

#### For Reviewers

1. **Review checklist**
   - [ ] Code follows style guide
   - [ ] Logic is sound and efficient
   - [ ] Tests are adequate
   - [ ] No security vulnerabilities
   - [ ] Error handling is proper
   - [ ] Documentation is updated
   - [ ] No breaking changes (or well documented)

2. **Provide constructive feedback**
   ```
   Good: "Consider using async/await here for better readability"
   Bad: "This code is bad"

   Good: "This could cause a memory leak. Consider using WeakMap"
   Bad: "Fix this"
   ```

3. **Use GitHub suggestions**
   ```markdown
   ```suggestion
   const user = await db.users.findOne({ id: userId });
   ```
   ```

4. **Approval criteria**
   - All tests pass
   - No major issues unresolved
   - Code meets quality standards
   - Documentation updated

### Merging

#### Merge Requirements
- ✅ At least 2 approvals
- ✅ All CI checks passing
- ✅ No merge conflicts
- ✅ Branch up to date with base

#### Merge Strategy
- **Squash and merge** for feature branches (default)
  - Creates clean, linear history
  - All commits combined into one

- **Merge commit** for release branches
  - Preserves branch history

- **Rebase and merge** for small fixes
  - Maintains individual commits

```bash
# After PR approval
# GitHub will handle the merge via UI
# Or from command line:
git checkout develop
git pull origin develop
git merge --squash feature/your-feature
git commit
git push origin develop
```

## Advanced Git Operations

### Interactive Rebase

```bash
# Clean up last 3 commits
git rebase -i HEAD~3

# Commands:
# pick = use commit
# reword = change commit message
# edit = amend commit
# squash = combine with previous
# drop = remove commit
```

### Cherry-Pick

```bash
# Apply specific commit to current branch
git cherry-pick <commit-hash>

# Cherry-pick multiple commits
git cherry-pick <commit1> <commit2>
```

### Stash

```bash
# Save uncommitted changes
git stash

# List stashes
git stash list

# Apply latest stash
git stash pop

# Apply specific stash
git stash apply stash@{2}

# Stash with message
git stash save "WIP: working on feature"
```

### Undoing Changes

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a commit (create new commit)
git revert <commit-hash>

# Discard local changes
git checkout -- <file>

# Reset to remote state
git fetch origin
git reset --hard origin/develop
```

## Git Hooks

### Pre-commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/bash

# Run linter
npm run lint
if [ $? -ne 0 ]; then
  echo "Linting failed. Please fix errors before committing."
  exit 1
fi

# Run tests
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Please fix before committing."
  exit 1
fi
```

### Using Husky

```bash
# Install husky
npm install --save-dev husky

# Add to package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm test",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

## Best Practices

### Branch Lifecycle

1. Create branch from develop
2. Develop and commit changes
3. Keep branch updated with develop
4. Create pull request
5. Address review feedback
6. Merge to develop
7. Delete branch after merge

```bash
# Delete local branch
git branch -d feature/completed-feature

# Delete remote branch
git push origin --delete feature/completed-feature
```

### Commit Frequency

- Commit after completing a logical unit of work
- Don't commit half-finished features
- Commit before switching contexts
- Create checkpoint commits during long features

### Branch Naming

```bash
# Good
feature/user-authentication
bugfix/login-form-validation
hotfix/security-patch-cve-2024

# Bad
fix
my-branch
test123
john-dev
```

### Working with Remotes

```bash
# List remotes
git remote -v

# Add upstream (for forks)
git remote add upstream git@github.com:opticworks/repo.git

# Fetch from upstream
git fetch upstream

# Sync fork with upstream
git checkout develop
git pull upstream develop
git push origin develop
```

## Troubleshooting

### Accidentally Committed to Wrong Branch

```bash
# Move last commit to new branch
git branch new-feature
git reset --hard HEAD~1
git checkout new-feature
```

### Merge Conflicts

```bash
# Abort merge
git merge --abort

# Abort rebase
git rebase --abort

# Use theirs or ours
git checkout --theirs <file>  # Use their version
git checkout --ours <file>    # Use our version
```

### Recover Deleted Branch

```bash
# Find commit hash
git reflog

# Recreate branch
git checkout -b recovered-branch <commit-hash>
```

### Clean Up Local Branches

```bash
# List merged branches
git branch --merged

# Delete all merged branches
git branch --merged | grep -v "main\|develop" | xargs git branch -d

# Prune remote branches
git remote prune origin
```

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- Internal Git training videos

## Getting Help

- **Slack:** #engineering or #git-help
- **Pair with senior dev:** Schedule time for complex operations
- **Documentation:** This guide and official Git docs
- **Emergency:** IT Support can help with repository issues

Remember: **When in doubt, ask before force-pushing or rewriting history!**
