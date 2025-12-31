# LabMind AI Data Analysis - Quick Start for Researchers

Welcome! This tool helps you analyze your research data using AI. No programming required—just paste your data and get instant insights.

## What You Need to Know

### 1. It's Easy to Use
- Paste data from Excel, Google Sheets, or any spreadsheet
- Click one button to analyze
- Get results in plain language

### 2. What It Does
- **Checks your data quality** (finds errors, missing values)
- **Calculates statistics** (means, medians, standard deviations)
- **Suggests visualizations** (best charts for your data)
- **Finds patterns** (insights you might have missed)
- **Answers questions** (ask about your data in plain English)

### 3. Costs
- Free credits usually provided when you sign up ($5-$25)
- Each analysis costs less than $0.01
- Free credits are enough for hundreds of analyses

## Getting Started (5 Minutes)

### Step 1: Get Your Free API Key
1. Go to: https://console.anthropic.com/
2. Sign up (free)
3. Click "API Keys" → "Create Key"
4. Copy the key

### Step 2: Give Key to Your Technical Team
Just send them:
- Your API key (starts with `sk-ant-...`)
- Ask them to set up the `.env.local` file

**OR if you're setting it up yourself:**
1. In the `LabMindWebsite` folder, create a file named `.env.local`
2. Add this line (replace with your actual key):
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

### Step 3: Start Analyzing!
1. Open: `http://localhost:3000/analyze`
2. Paste your data
3. Click "Analyze Data"

## Examples for Researchers

### Example 1: Checking Data Before Analysis
**Paste your experimental data**, choose **"Quality"** analysis:
- See if there are missing values
- Find duplicate entries
- Check for data entry errors

### Example 2: Getting Descriptive Statistics
**Paste your results**, choose **"Statistical"** analysis:
- Get means and standard deviations
- Find outliers that might need investigation
- Understand your data distribution

### Example 3: Choosing Figures for Your Paper
**Paste your data**, choose **"Visualization"** analysis:
- Get recommendations for best chart types
- Know which visualizations work for your data

### Example 4: Finding Patterns
**Paste your full dataset**, choose **"Insights"** analysis:
- Discover unexpected relationships
- Get ideas for your discussion section
- Find trends you might have missed

## Need Help?

- **Detailed guide**: See `AI_ANALYSIS_SETUP.md` for step-by-step instructions
- **Data format questions**: Click "Load Example" in the tool to see formats
- **Technical issues**: Ask your development team

## Privacy & Security

- Your data is processed securely
- Data is not stored permanently
- Your API key stays safe on the server
- Data is only used for analysis, not training

---

**Ready to analyze?** Go to `http://localhost:3000/analyze` and paste your first dataset!

