# Contributing to OpenPinas

Thank you for your interest in contributing to OpenPinas! This project tracks Philippine political dynasties, corruption cases, and major events to help the Filipino diaspora understand political power structures back home.

## How to Contribute

There are many ways to contribute:

- 🐛 **Report bugs** - Found an error in the data or a broken visualization?
- 📊 **Add or correct data** - Know about a missing dynasty, event, or corruption case?
- 💡 **Suggest features** - Have ideas to make the project more useful?
- 📝 **Improve documentation** - Help make the project easier to understand
- 🔍 **Fact-check** - Verify existing data and sources
- 🌐 **Translate** - Help make this accessible to more people

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/openpinas.git
   cd openpinas
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b your-branch-name
   ```

## Types of Contributions

### 1. Data Updates

#### Adding a New Dynasty

1. Open `philippine-political-dynasties-network-2025.json`
2. Add a new dynasty object to the `dynasties` array
3. Follow the existing structure (see examples in the file)
4. Update the metadata `total_dynasties` count
5. Validate JSON syntax

**Required fields:**
- `id`: Unique identifier (e.g., `DYNASTY_NAME`)
- `name`: Dynasty name
- `key_members`: Array of key politicians
- `geographic_control`: Provinces/regions they control
- `power_level`: `national`, `regional`, or `local`
- `establishment_date`: Year dynasty was established

**Example:**
```json
{
  "id": "EXAMPLE_DYNASTY",
  "name": "Example Dynasty",
  "key_members": [
    {
      "name": "John Doe",
      "position": "Governor",
      "province": "Example Province",
      "years_active": "2020-present"
    }
  ],
  "geographic_control": [
    {
      "province": "Example Province",
      "region": "Example Region",
      "control_level": "strong",
      "years_controlled": "2020-present"
    }
  ],
  "power_level": "regional",
  "establishment_date": 2020
}
```

#### Adding a Timeline Event

1. Open `philippines-2025-timeline.json`
2. Add a new event to the `timeline` array
3. Include `mentioned_dynasties` if applicable
4. Update the metadata `total_events` count
5. Validate JSON syntax

**Required fields:**
- `date`: Event date (YYYY-MM-DD)
- `title`: Event title
- `description`: What happened
- `category`: Event category
- `sources`: Array of source URLs

#### Adding a Corruption Case

See the detailed guide: [`corruption-tracker/ADDING_CASES.md`](corruption-tracker/ADDING_CASES.md)

### 2. Code Contributions

#### Fixing Bugs

1. Identify the bug (or check existing issues)
2. Create a branch for your fix
3. Make your changes
4. Test locally (see Testing section)
5. Submit a pull request

#### Adding Features

1. **Open an issue first** to discuss the feature
2. Wait for feedback before starting work
3. Create a branch for your feature
4. Implement the feature
5. Add tests if applicable
6. Update documentation
7. Submit a pull request

### 3. Documentation

- Fix typos or unclear explanations
- Add examples to guides
- Improve README sections
- Add code comments
- Create new guides for complex features

## Data Quality Standards

### Source Requirements

All data must be sourced from:
- **News sources**: Rappler, Philippine Daily Inquirer, Philippine Star, PCIJ, Manila Bulletin
- **Government sources**: Senate hearings, NBI/PNP press releases, COMELEC data
- **Academic sources**: Peer-reviewed research
- **Wikipedia**: As a secondary source (with primary source verification)

### What We Don't Accept

- Unverified rumors or speculation
- Personal opinions without factual backing
- Data from unreliable sources
- Information that could be defamatory without evidence

### Fact-Checking

Before submitting data:
- ✅ Verify information from multiple sources
- ✅ Check dates and names for accuracy
- ✅ Ensure relationships are documented
- ✅ Include source URLs in your submission

## Development Setup

### Running Locally

You need a local web server (browser security restrictions):

```bash
# Python 3
python3 -m http.server 8000

# Or Node.js
npx http-server -p 8000

# Or PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### Validating Data

Before committing, validate JSON files:

```bash
# Validate all JSON files
./validate-openpinas.sh

# Or validate individual files
python3 -m json.tool philippine-political-dynasties-network-2025.json
python3 -m json.tool philippines-2025-timeline.json
python3 -m json.tool pogo-corruption-cases-2025.json
```

### Testing

1. **Test your changes locally:**
   - Start a local server
   - Navigate to the affected pages
   - Test all functionality
   - Check browser console for errors

2. **Test data integrity:**
   - Run validation script
   - Check that metadata counts match actual data
   - Verify all IDs are unique
   - Ensure relationships reference valid IDs

## Pull Request Process

1. **Update your fork:**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create your branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   # or
   git checkout -b data/add-dynasty-name
   ```

3. **Make your changes:**
   - Write clear commit messages
   - Keep changes focused (one feature/fix per PR)
   - Test your changes

4. **Validate:**
   ```bash
   ./validate-openpinas.sh
   ```

5. **Commit:**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

6. **Push:**
   ```bash
   git push origin your-branch-name
   ```

7. **Open a Pull Request:**
   - Use a clear title
   - Describe what you changed and why
   - Reference any related issues
   - Include screenshots if applicable

### PR Title Format

- `[DATA] Add Example Dynasty`
- `[DATA] Fix incorrect date for Event Name`
- `[FEATURE] Add export functionality to timeline`
- `[BUG] Fix network visualization on mobile`
- `[DOCS] Improve contributing guide`

## Code Style

- **HTML/CSS/JavaScript**: Follow existing patterns in the codebase
- **JSON**: Use 2-space indentation, no trailing commas
- **Comments**: Add comments for complex logic
- **Naming**: Use descriptive variable and function names

## Commit Message Guidelines

Write clear, descriptive commit messages:

**Good:**
- `[DATA] Add Garcia dynasty to Cebu`
- `[BUG] Fix timeline filter not working on mobile`
- `[DOCS] Add guide for adding new dynasties`

**Avoid:**
- `fix stuff`
- `update`
- `changes`

## Review Process

1. Your PR will be reviewed for:
   - Data accuracy and sources
   - Code quality
   - Testing
   - Documentation

2. You may be asked to:
   - Make changes
   - Add more sources
   - Clarify something
   - Add tests

3. Once approved, your PR will be merged!

## Questions?

- Check existing [issues](https://github.com/dat-angel/openpinas/issues)
- Open a [question issue](https://github.com/dat-angel/openpinas/issues/new?template=question.md)
- Review the [README](README.md)

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md). Be respectful, inclusive, and constructive in all interactions.

## Recognition

Contributors will be:
- Listed in the README (if you'd like)
- Credited in release notes
- Appreciated by the community! 🙏

Thank you for helping make Philippine political power structures more transparent!

## Support the Project

If you find OpenPinas useful, consider supporting its development:

[![ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/beatrizd)

[Support on Ko-fi](https://ko-fi.com/beatrizd) - Help me buy my next cup of coffee exploring Philippine coffee shops ☕

Every contribution helps keep this project updated, maintained, and free for everyone.

