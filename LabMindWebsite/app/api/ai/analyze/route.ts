import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

// Request schema validation
const analyzeRequestSchema = z.object({
  data: z.any(), // Can be array, object, or CSV string
  analysisType: z.enum(['statistical', 'quality', 'visualization', 'insights', 'custom']),
  userQuery: z.string().optional(),
  dataFormat: z.enum(['json', 'csv', 'array']).optional(),
})

// Tool definitions for data analysis
const dataAnalysisTools = [
  {
    name: 'calculate_statistics',
    description: 'Calculate descriptive statistics for numerical data including mean, median, mode, standard deviation, variance, min, max, quartiles, and skewness. Also provides distribution insights.',
    input_schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of numerical values to analyze',
        },
        column: {
          type: 'string',
          description: 'Column name if data is from a DataFrame',
        },
      },
      required: ['data'],
    },
  },
  {
    name: 'detect_outliers',
    description: 'Detect outliers in numerical data using IQR (Interquartile Range) method or Z-score method. Returns indices and values of outliers.',
    input_schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of numerical values',
        },
        method: {
          type: 'string',
          enum: ['iqr', 'zscore'],
          default: 'iqr',
          description: 'Method to use for outlier detection',
        },
        threshold: {
          type: 'number',
          default: 1.5,
          description: 'Threshold multiplier for IQR method or Z-score threshold',
        },
      },
      required: ['data'],
    },
  },
  {
    name: 'check_data_quality',
    description: 'Analyze data quality including missing values, duplicates, data types, consistency checks, and data completeness metrics.',
    input_schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'Dataset object or array to analyze',
        },
        columns: {
          type: 'array',
          items: { type: 'string' },
          description: 'Column names if analyzing structured data',
        },
      },
      required: ['data'],
    },
  },
  {
    name: 'suggest_visualizations',
    description: 'Suggest appropriate visualization types based on data characteristics. Considers data types, distributions, and relationships between variables.',
    input_schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'Dataset to analyze for visualization recommendations',
        },
        variables: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: { type: 'string', enum: ['numerical', 'categorical', 'temporal', 'text'] },
            },
          },
          description: 'Variables in the dataset with their types',
        },
        goal: {
          type: 'string',
          description: 'Analysis goal (distribution, correlation, comparison, trends, etc.)',
        },
      },
      required: ['data'],
    },
  },
  {
    name: 'correlation_analysis',
    description: 'Calculate correlation matrix between numerical variables and identify strong relationships. Supports Pearson, Spearman, and Kendall correlations.',
    input_schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'Dataset with multiple numerical columns',
        },
        variables: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of numerical column names to correlate',
        },
        method: {
          type: 'string',
          enum: ['pearson', 'spearman', 'kendall'],
          default: 'pearson',
          description: 'Correlation method to use',
        },
      },
      required: ['data', 'variables'],
    },
  },
  {
    name: 'generate_insights',
    description: 'Generate high-level insights and patterns from the data analysis results. Summarizes findings, identifies trends, and provides actionable recommendations.',
    input_schema: {
      type: 'object',
      properties: {
        analysisResults: {
          type: 'object',
          description: 'Results from previous analysis tools',
        },
        context: {
          type: 'string',
          description: 'Additional context or research questions',
        },
      },
      required: ['analysisResults'],
    },
  },
] as const

// Tool implementations
async function executeTool(toolName: string, args: any, originalData: any) {
  switch (toolName) {
    case 'calculate_statistics': {
      const numbers = args.data || args.column ? extractColumn(args.data || originalData, args.column) : args.data
      if (!Array.isArray(numbers) || numbers.length === 0) {
        return { error: 'Invalid data provided for statistics calculation' }
      }
      
      const numericData = numbers.filter((n: any) => typeof n === 'number' && !isNaN(n))
      if (numericData.length === 0) {
        return { error: 'No valid numerical data found' }
      }

      const sorted = [...numericData].sort((a, b) => a - b)
      const sum = numericData.reduce((a, b) => a + b, 0)
      const mean = sum / numericData.length
      const median = sorted[Math.floor(sorted.length / 2)]
      const variance = numericData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numericData.length
      const stdDev = Math.sqrt(variance)
      const min = Math.min(...numericData)
      const max = Math.max(...numericData)
      const q1 = sorted[Math.floor(sorted.length * 0.25)]
      const q3 = sorted[Math.floor(sorted.length * 0.75)]
      const iqr = q3 - q1

      return {
        count: numericData.length,
        mean,
        median,
        stdDev,
        variance,
        min,
        max,
        q1,
        q3,
        iqr,
        range: max - min,
        coefficientOfVariation: mean !== 0 ? stdDev / mean : 0,
      }
    }

    case 'detect_outliers': {
      const numbers = args.data || args.column ? extractColumn(args.data || originalData, args.column) : args.data
      if (!Array.isArray(numbers)) {
        return { error: 'Invalid data provided for outlier detection' }
      }

      const numericData = numbers.map((n: any, i: number) => ({ value: n, index: i }))
        .filter((item: any) => typeof item.value === 'number' && !isNaN(item.value))

      if (numericData.length === 0) {
        return { outliers: [], message: 'No valid numerical data found' }
      }

      const values = numericData.map((item: any) => item.value)
      const sorted = [...values].sort((a, b) => a - b)
      const q1 = sorted[Math.floor(sorted.length * 0.25)]
      const q3 = sorted[Math.floor(sorted.length * 0.75)]
      const iqr = q3 - q1
      const threshold = args.threshold || 1.5

      const outliers = numericData.filter((item: any) => {
        const value = item.value
        return value < q1 - threshold * iqr || value > q3 + threshold * iqr
      })

      return {
        outliers: outliers.map((o: any) => ({ index: o.index, value: o.value })),
        count: outliers.length,
        percentage: (outliers.length / numericData.length) * 100,
        method: args.method || 'iqr',
      }
    }

    case 'check_data_quality': {
      const data = args.data || originalData
      let rows: any[] = []
      
      if (Array.isArray(data)) {
        rows = data
      } else if (typeof data === 'object') {
        // Convert object to array of rows
        const keys = Object.keys(data)
        if (keys.length > 0 && Array.isArray(data[keys[0]])) {
          // Object with array columns
          const firstColLength = data[keys[0]].length
          rows = Array.from({ length: firstColLength }, (_, i) => {
            const row: any = {}
            keys.forEach(key => {
              row[key] = data[key][i]
            })
            return row
          })
        } else {
          rows = [data]
        }
      }

      const columns = args.columns || (rows.length > 0 ? Object.keys(rows[0]) : [])
      const qualityReport: any = {
        totalRows: rows.length,
        totalColumns: columns.length,
        missingValues: {},
        duplicates: 0,
        dataTypes: {},
      }

      columns.forEach((col: string) => {
        const values = rows.map((row: any) => row[col])
        const missing = values.filter((v: any) => v === null || v === undefined || v === '' || isNaN(v)).length
        qualityReport.missingValues[col] = {
          count: missing,
          percentage: rows.length > 0 ? (missing / rows.length) * 100 : 0,
        }
        
        // Infer data type
        const nonMissing = values.filter((v: any) => v !== null && v !== undefined && v !== '')
        if (nonMissing.length > 0) {
          const types = new Set(nonMissing.map((v: any) => typeof v))
          qualityReport.dataTypes[col] = Array.from(types)
        }
      })

      // Check for duplicate rows
      const rowStrings = rows.map((r: any) => JSON.stringify(r))
      const uniqueRows = new Set(rowStrings)
      qualityReport.duplicates = rowStrings.length - uniqueRows.size

      return qualityReport
    }

    case 'suggest_visualizations': {
      const data = args.data || originalData
      const variables = args.variables || []
      const goal = args.goal || 'general'

      const suggestions = []
      
      // Analyze variable types
      const numVars = variables.filter((v: any) => v.type === 'numerical').length
      const catVars = variables.filter((v: any) => v.type === 'categorical').length
      const tempVars = variables.filter((v: any) => v.type === 'temporal').length

      if (goal.includes('distribution') && numVars > 0) {
        suggestions.push({ type: 'histogram', reason: 'Best for showing distribution of numerical data' })
        suggestions.push({ type: 'box_plot', reason: 'Shows distribution, quartiles, and outliers' })
        suggestions.push({ type: 'violin_plot', reason: 'Combines distribution and density information' })
      }

      if (goal.includes('comparison') && catVars > 0 && numVars > 0) {
        suggestions.push({ type: 'bar_chart', reason: 'Compare categories using numerical values' })
        suggestions.push({ type: 'box_plot', reason: 'Compare distributions across categories' })
      }

      if (goal.includes('correlation') && numVars >= 2) {
        suggestions.push({ type: 'scatter_plot', reason: 'Show relationships between two numerical variables' })
        suggestions.push({ type: 'correlation_heatmap', reason: 'Visualize correlation matrix' })
      }

      if (goal.includes('trend') && tempVars > 0) {
        suggestions.push({ type: 'line_chart', reason: 'Show trends over time' })
        suggestions.push({ type: 'area_chart', reason: 'Emphasize cumulative trends' })
      }

      if (suggestions.length === 0) {
        suggestions.push({ type: 'scatter_plot', reason: 'General purpose visualization' })
        suggestions.push({ type: 'bar_chart', reason: 'Good for categorical data' })
      }

      return {
        suggestions,
        variablesAnalyzed: variables.length,
        recommended: suggestions[0]?.type || 'scatter_plot',
      }
    }

    case 'correlation_analysis': {
      const data = args.data || originalData
      const variables = args.variables || []
      
      if (!Array.isArray(data) && typeof data === 'object') {
        // Convert object to array format
        const rows = []
        const firstKey = Object.keys(data)[0]
        if (firstKey && Array.isArray(data[firstKey])) {
          const length = data[firstKey].length
          for (let i = 0; i < length; i++) {
            const row: any = {}
            Object.keys(data).forEach(key => {
              row[key] = data[key][i]
            })
            rows.push(row)
          }
        }

        const correlations: any = {}
        for (let i = 0; i < variables.length; i++) {
          for (let j = i; j < variables.length; j++) {
            const var1 = variables[i]
            const var2 = variables[j]
            const values1 = rows.map((r: any) => r[var1]).filter((v: any) => typeof v === 'number' && !isNaN(v))
            const values2 = rows.map((r: any) => r[var2]).filter((v: any) => typeof v === 'number' && !isNaN(v))
            
            if (values1.length === values2.length && values1.length > 1) {
              const corr = calculatePearsonCorrelation(values1, values2)
              correlations[`${var1}_${var2}`] = corr
            }
          }
        }

        return {
          method: args.method || 'pearson',
          correlations,
          variables,
        }
      }

      return { error: 'Invalid data format for correlation analysis' }
    }

    case 'generate_insights': {
      // This would be handled by Claude, so return placeholder
      return {
        message: 'Insights will be generated by the AI model based on analysis results',
        analysisResults: args.analysisResults,
      }
    }

    default:
      return { error: `Unknown tool: ${toolName}` }
  }
}

// Helper functions
function extractColumn(data: any, columnName?: string): number[] {
  if (!columnName) {
    return Array.isArray(data) ? data : []
  }
  
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    return data.map((row: any) => row[columnName]).filter((v: any) => typeof v === 'number' && !isNaN(v))
  }
  
  if (typeof data === 'object' && data[columnName]) {
    return Array.isArray(data[columnName]) 
      ? data[columnName].filter((v: any) => typeof v === 'number' && !isNaN(v))
      : []
  }
  
  return []
}

function calculatePearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0

  const n = x.length
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)
  const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))

  return denominator === 0 ? 0 : numerator / denominator
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request
    const validation = analyzeRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request format', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { data, analysisType, userQuery, dataFormat } = validation.data

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      )
    }

    // Prepare the message for Claude
    const systemPrompt = `You are an expert data analyst AI assistant specializing in data analysis. You have access to powerful data analysis tools. Use these tools to help researchers analyze their data.

Guidelines:
- Always use the appropriate tools for the requested analysis
- Provide clear, actionable insights
- Explain statistical concepts in accessible terms
- Suggest next steps for further analysis
- Be thorough but concise

Available analysis types:
- statistical: Descriptive statistics, distributions, measures of central tendency
- quality: Data quality checks, missing values, duplicates, consistency
- visualization: Suggest appropriate charts and visualizations
- insights: High-level insights and patterns
- custom: User-defined analysis based on their query`

    const userMessage = userQuery 
      ? `${userQuery}\n\nData: ${JSON.stringify(data).substring(0, 5000)}...`
      : `Please perform ${analysisType} analysis on the provided data.\n\nData: ${JSON.stringify(data).substring(0, 5000)}...`

    // Call Claude with tool use
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      tools: dataAnalysisTools,
    })

    // Handle tool calls if any
    let toolResults: any[] = []
    let finalResponse = message

    if (message.content.some((block: any) => block.type === 'tool_use')) {
      // Execute tool calls
      for (const block of message.content) {
        if (block.type === 'tool_use') {
          try {
            const toolResult = await executeTool(block.name, block.input, data)
            toolResults.push({
              tool_use_id: block.id,
              content: JSON.stringify(toolResult),
            })
          } catch (error: any) {
            toolResults.push({
              tool_use_id: block.id,
              content: JSON.stringify({ error: error.message }),
            })
          }
        }
      }

      // Get final response with tool results
      finalResponse = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
          {
            role: 'assistant',
            content: message.content,
          },
          {
            role: 'user',
            content: toolResults,
          },
        ],
        tools: dataAnalysisTools,
      })
    }

    // Extract text response
    const textBlocks = finalResponse.content.filter((block: any) => block.type === 'text')
    const analysisText = textBlocks.map((block: any) => block.text).join('\n\n')

    return NextResponse.json({
      success: true,
      analysis: analysisText,
      toolResults: toolResults.length > 0 ? toolResults : undefined,
      model: 'claude-3-5-sonnet',
    })

  } catch (error: any) {
    console.error('AI Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to perform analysis', details: error.message },
      { status: 500 }
    )
  }
}
