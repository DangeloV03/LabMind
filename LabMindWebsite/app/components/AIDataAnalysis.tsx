'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface AnalysisResult {
  success: boolean
  analysis?: string
  toolResults?: any[]
  error?: string
}

type AnalysisType = 'statistical' | 'quality' | 'visualization' | 'insights' | 'custom'

export default function AIDataAnalysis() {
  const [data, setData] = useState<string>('')
  const [analysisType, setAnalysisType] = useState<AnalysisType>('statistical')
  const [userQuery, setUserQuery] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string>('')

  const handleAnalyze = async () => {
    if (!data.trim()) {
      setError('Please provide data to analyze')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      // Parse the input data
      let parsedData: any
      try {
        // Try parsing as JSON first
        parsedData = JSON.parse(data)
      } catch {
        // If not JSON, try CSV-like format or treat as array of numbers
        const lines = data.trim().split('\n')
        if (lines.length > 1) {
          // Try to parse as CSV
          const headers = lines[0].split(',').map(h => h.trim())
          const rows = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim())
            const row: any = {}
            headers.forEach((header, i) => {
              const numVal = parseFloat(values[i])
              row[header] = isNaN(numVal) ? values[i] : numVal
            })
            return row
          })
          parsedData = rows
        } else {
          // Try as space or comma separated numbers
          const numbers = data.split(/[,\s]+/).map(n => parseFloat(n.trim())).filter(n => !isNaN(n))
          parsedData = numbers
        }
      }

      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: parsedData,
          analysisType,
          userQuery: userQuery.trim() || undefined,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to analyze data')
      }

      setResult(responseData)
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis')
    } finally {
      setLoading(false)
    }
  }

  const exampleData = {
    statistical: `[
  {"participant": 1, "reaction_time_ms": 450, "condition": "control"},
  {"participant": 2, "reaction_time_ms": 520, "condition": "control"},
  {"participant": 3, "reaction_time_ms": 380, "condition": "treatment"},
  {"participant": 4, "reaction_time_ms": 410, "condition": "treatment"},
  {"participant": 5, "reaction_time_ms": 480, "condition": "control"},
  {"participant": 6, "reaction_time_ms": 395, "condition": "treatment"}
]`,
    quality: `[
  {"id": 1, "age": 25, "score": 85, "group": "experimental"},
  {"id": 2, "age": null, "score": 92, "group": "control"},
  {"id": 3, "age": 30, "score": 78, "group": "experimental"},
  {"id": 4, "age": 28, "score": null, "group": "control"},
  {"id": 1, "age": 25, "score": 85, "group": "experimental"}
]`,
    visualization: `[
  {"condition": "control", "mean_score": 72.5, "n": 20},
  {"condition": "treatment", "mean_score": 85.3, "n": 22},
  {"condition": "placebo", "mean_score": 70.1, "n": 18}
]`,
    insights: `[
  {"date": "2024-01", "temperature": 22.5, "experiment_success": true},
  {"date": "2024-02", "temperature": 23.1, "experiment_success": true},
  {"date": "2024-03", "temperature": 21.8, "experiment_success": false},
  {"date": "2024-04", "temperature": 24.2, "experiment_success": true}
]`,
    custom: `[
  {"participant": 1, "baseline": 50, "post_treatment": 65, "age": 25},
  {"participant": 2, "baseline": 45, "post_treatment": 70, "age": 30},
  {"participant": 3, "baseline": 55, "post_treatment": 72, "age": 28}
]`,
  }

  const loadExample = () => {
    setData(exampleData[analysisType])
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">AI-Powered Data Analysis for Researchers</h2>
          <p className="text-white/60">
            Paste your research data and get instant statistical analysis, data quality checks, visualization recommendations, and insights. Works with Excel, CSV, JSON, or any numerical data format.
          </p>
        </div>

        {/* Analysis Type Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/80">Analysis Type</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {(['statistical', 'quality', 'visualization', 'insights', 'custom'] as AnalysisType[]).map((type) => (
              <button
                key={type}
                onClick={() => setAnalysisType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  analysisType === type
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Data Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-white/80">Data Input</label>
            <button
              onClick={loadExample}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Load Example
            </button>
          </div>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Paste your research data here... (Excel data, CSV, JSON, or simple lists of numbers all work)"
            className="w-full h-48 px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 font-mono text-sm resize-none"
          />
        </div>

        {/* Custom Query (for custom analysis type) */}
        {analysisType === 'custom' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Analysis Query</label>
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask a specific research question (e.g., 'What's the correlation between age and test scores?' or 'Are there outliers in the treatment group?')"
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30"
            />
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading || !data.trim()}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
            loading || !data.trim()
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-white text-black hover:bg-white/90 active:scale-95'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze Data'
          )}
        </button>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Results Display */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
              ✓ Analysis Complete
            </div>

            {result.analysis && (
              <div className="p-6 bg-black/40 border border-white/10 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Analysis Results</h3>
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-white/80 leading-relaxed font-sans">
                    {result.analysis}
                  </div>
                </div>
              </div>
            )}

            {result.toolResults && result.toolResults.length > 0 && (
              <details className="p-4 bg-black/40 border border-white/10 rounded-lg">
                <summary className="cursor-pointer text-white/80 font-medium mb-2">
                  Tool Execution Details
                </summary>
                <pre className="mt-2 text-xs text-white/60 overflow-auto max-h-64 font-mono">
                  {JSON.stringify(result.toolResults, null, 2)}
                </pre>
              </details>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-3">How Each Analysis Type Helps Your Research</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
          <div>
            <h4 className="font-semibold text-white mb-1">Statistical Analysis</h4>
            <p>Get means, medians, standard deviations, and distributions. Perfect for preparing your methods section or understanding your data before running tests.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-1">Data Quality Check</h4>
            <p>Find missing values, duplicates, and data entry errors. Essential step before running any statistical analysis to ensure data integrity.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-1">Visualization Suggestions</h4>
            <p>Get recommendations for the best charts and graphs based on your data type and research questions. Great for figure selection in manuscripts.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-1">Insights Generation</h4>
            <p>Discover unexpected patterns, trends, and relationships in your data. Helps identify findings for your results and discussion sections.</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-200">
          <p className="font-semibold mb-1">💡 Research Tip:</p>
          <p>Start with a Quality check, then run Statistical analysis, and finish with Insights to get the full picture of your data. Use Custom analysis for specific research questions.</p>
        </div>
      </motion.div>
    </div>
  )
}
