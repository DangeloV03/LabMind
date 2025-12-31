# AI Data Analysis Guide for Researchers

Welcome to LabMind's AI-powered data analysis tool! This guide will help you get started analyzing your research data using artificial intelligence.

## What is This Tool?

LabMind's AI Analysis feature helps you:
- **Automatically analyze** your research data with statistical methods
- **Identify patterns and insights** you might miss
- **Check data quality** before running your main analyses
- **Get visualization recommendations** for presenting your findings
- **Ask questions** about your data in plain language

Perfect for researchers working with experimental data, survey results, clinical trials, or any numerical datasets.

## Quick Start (For Researchers)

### Step 1: Get Your Free API Key

You'll need an API key to use the AI analysis. Don't worry—this is free to set up:

1. Visit: https://console.anthropic.com/
2. Click "Sign Up" (or "Log In" if you have an account)
3. After signing up, go to "API Keys" in the menu
4. Click "Create Key"
5. Copy the key (it looks like: `sk-ant-...`)

**Note:** Anthropic often provides free credits ($5-$25) when you sign up, which is plenty for testing and small analyses.

### Step 2: Add Your API Key

If you're working with a developer or technical team member, ask them to:
- Create a file called `.env.local` in the `LabMindWebsite` folder
- Add this line: `ANTHROPIC_API_KEY=paste_your_key_here`

If you're setting this up yourself:
1. Open the `LabMindWebsite` folder on your computer
2. Create a new text file named `.env.local` (make sure it starts with a dot)
3. Type this exact line, replacing with your key:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
   ```
4. Save the file

### Step 3: Start Using the Tool

1. Open your web browser
2. Go to: `http://localhost:3000/analyze`
3. Start analyzing your data!

## How to Use It

### Step 1: Choose Your Analysis Type

Click on the type of analysis you need:

- **Statistical**: Get basic stats (mean, median, standard deviation, etc.)
- **Quality**: Check for missing data, duplicates, or data entry errors
- **Visualization**: Get suggestions for the best charts/graphs to use
- **Insights**: Discover patterns and trends in your data
- **Custom**: Ask specific questions about your data

### Step 2: Paste Your Data

You can paste your data in several formats:

**Option 1: From Excel/Google Sheets**
- Copy your data (Ctrl+C / Cmd+C)
- Paste it directly into the text box
- The tool will automatically understand it

**Option 2: JSON Format** (common for research data)
```json
[
  {"participant": 1, "age": 25, "score": 85, "condition": "control"},
  {"participant": 2, "age": 30, "score": 92, "condition": "treatment"},
  {"participant": 3, "age": 28, "score": 78, "condition": "control"}
]
```

**Option 3: CSV Format** (Excel export)
```
participant,age,score,condition
1,25,85,control
2,30,92,treatment
3,28,78,control
```

**Option 4: Simple Numbers** (for single variables)
```
25, 30, 28, 32, 29, 31, 27
```

**Tip:** Click "Load Example" to see sample data for each analysis type.

### Step 3: Click "Analyze Data"

The AI will process your data and provide results in seconds. For custom analyses, you can also type a specific question like:
- "What's the correlation between age and test scores?"
- "Are there any outliers in the treatment group?"
- "What visualization would best show the differences between groups?"

## Real Research Examples

### Example 1: Analyzing Experimental Results

**Your Data:**
You ran an experiment with 20 participants. You measured their reaction times (in milliseconds) under two conditions.

**Paste this:**
```json
[
  {"participant": 1, "control": 450, "treatment": 380},
  {"participant": 2, "control": 520, "treatment": 410},
  {"participant": 3, "control": 480, "treatment": 395},
  {"participant": 4, "control": 510, "treatment": 400}
]
```

**Analysis Type:** Choose "Statistical" or "Insights"

**What You Get:**
- Mean reaction times for each condition
- Standard deviations
- Whether the difference is statistically meaningful
- Outliers that might need investigation

### Example 2: Survey Data Quality Check

**Your Data:**
You collected survey responses and want to check for data entry errors.

**Paste your survey data:**
```json
[
  {"id": 1, "age": 25, "satisfaction": 4, "comments": "Good"},
  {"id": 2, "age": null, "satisfaction": 5, "comments": ""},
  {"id": 3, "age": 30, "satisfaction": 4, "comments": "Excellent"},
  {"id": 4, "age": 25, "satisfaction": 4, "comments": "Good"}
]
```

**Analysis Type:** Choose "Quality"

**What You Get:**
- How many responses have missing data
- Duplicate entries to review
- Data type inconsistencies
- Overall data completeness score

### Example 3: Finding Patterns in Time Series Data

**Your Data:**
You measured temperature every day for a month.

**Paste this:**
```json
[
  {"date": "2024-01-01", "temperature": 22.5, "humidity": 65},
  {"date": "2024-01-02", "temperature": 23.1, "humidity": 67},
  {"date": "2024-01-03", "temperature": 21.8, "humidity": 64}
]
```

**Analysis Type:** Choose "Insights" or ask "What trends do you see in temperature over time?"

**What You Get:**
- Temperature trends and patterns
- Correlation between temperature and humidity
- Recommendations for further analysis

## Understanding Your Results

After clicking "Analyze Data," you'll see:

1. **Analysis Results**: A detailed explanation of what the AI found in your data, written in plain language
2. **Key Findings**: Important patterns, outliers, or insights highlighted
3. **Recommendations**: Suggestions for next steps in your analysis

The AI uses specialized statistical tools to ensure accuracy:
- Descriptive statistics (means, medians, standard deviations)
- Outlier detection (finding unusual data points)
- Correlation analysis (relationships between variables)
- Data quality assessment (checking for errors)

## Common Questions

### How much does this cost?

- **Free credits:** Anthropic usually provides $5-$25 in free credits when you sign up
- **Typical cost:** Most analyses cost less than $0.01 each
- **For reference:** You can analyze hundreds of datasets with the free credits
- **Monitor usage:** Check your usage at https://console.anthropic.com/

### What data formats work?

The tool accepts:
- Excel/Google Sheets data (paste directly)
- CSV files (comma-separated values)
- JSON format
- Simple lists of numbers
- Space or comma-separated values

### Is my data private?

- Your data is processed securely
- It's sent to Anthropic's API for analysis only
- Data is not stored or used for training
- Your API key stays secure on your server

### What if I get an error?

**"API key not configured"**
- Make sure you created the `.env.local` file
- Check that your API key is correct (starts with `sk-ant-`)
- Ask your technical team to verify the setup

**"Failed to analyze data"**
- Check that your data is in a valid format
- Try the "Load Example" button to see the correct format
- Make sure you have credits remaining in your Anthropic account

**Data parsing issues**
- Try copying data directly from Excel/Sheets
- Ensure CSV files have consistent column counts
- For JSON, check that all brackets and commas are correct

## Tips for Best Results

1. **Clean your data first**: Remove obvious errors before analysis
2. **Be specific with custom queries**: "Find correlations between X and Y" works better than "analyze this"
3. **Start with examples**: Use "Load Example" to understand the format
4. **Check quality first**: Run a "Quality" analysis before doing statistics
5. **Export your results**: Copy important findings to your research notes

## Example Research Workflows

### Before Running Statistical Tests
1. Run **Quality** analysis to check for missing data
2. Run **Statistical** analysis to understand distributions
3. Check for outliers that might affect your tests

### For Manuscript Preparation
1. Run **Statistical** analysis for your methods section
2. Use **Visualization** suggestions to choose figures
3. Use **Insights** to support your discussion

### Exploring New Datasets
1. Start with **Quality** to understand your data
2. Use **Insights** to discover unexpected patterns
3. Follow up with **Custom** queries for specific questions

## Getting Help

If you need assistance:
1. **Technical issues**: Contact your development team
2. **API key problems**: Check https://console.anthropic.com/ or their support
3. **Data format questions**: Try the "Load Example" button to see correct formats

## Next Steps

Once you're comfortable with the basic features:
- Try custom queries for specific research questions
- Combine multiple analysis types for comprehensive understanding
- Export results to include in your research reports
- Use visualization suggestions for presentations

---

**Ready to start?** Open `http://localhost:3000/analyze` and paste your first dataset!
