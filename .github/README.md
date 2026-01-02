# OpenPinas GitHub Repository

This directory contains GitHub-specific configuration files for the OpenPinas project.

## Contents

### Issue Templates (`.github/ISSUE_TEMPLATE/`)
- `bug_report.md` - Template for reporting bugs
- `feature_request.md` - Template for suggesting features
- `data_update.md` - Template for data corrections/additions
- `documentation.md` - Template for documentation improvements
- `question.md` - Template for questions and discussions
- `config.yml` - Configuration for issue templates

### Workflows (`.github/workflows/`)
- `validate.yml` - GitHub Actions workflow for automated data validation
  - Runs on push and pull requests
  - Validates JSON syntax
  - Checks data integrity
  - Verifies file structure

### Other Files
- `pull_request_template.md` - Template for pull requests
- `FUNDING.yml` - Configuration for funding/sponsorship (if enabled)
- `dependabot.yml` - Configuration for automated dependency updates

## Using Issue Templates

When creating a new issue on GitHub, you'll see options to use these templates. They help ensure all necessary information is included.

## Automated Validation

The GitHub Actions workflow automatically validates:
- JSON syntax for all data files
- Data integrity (counts, IDs, relationships)
- Required files are present

This runs automatically on:
- Every push to `main` or `develop` branches
- Every pull request
- Manual trigger via workflow_dispatch

## Contributing

See the main [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

