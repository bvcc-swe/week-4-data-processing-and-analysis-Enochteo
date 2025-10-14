import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { error } from "console";

const DataAnalyzer = () => {
  const [analysis, setAnalysis] = useState(null);

  // Current Dataset
  const [currentDataset, setCurrentDataset] = useState("temperatures");

  // Multiple Sample Datasets
  const datasets = {
    temperatures: [72, 75, 68, 80, 77, "tree", 74, 69, 78, 76, 73],
    testScores: [88, 92, 79, 95, 87, 90, 84, 89, 93, 86, null],
    salesFigures: [1200, 1450, 980, 1680, 1250, 1520, 1100, 1400, "bay"],
  };

  // Advanced Datasets
  const [advancedAnalysis, setAdvancedAnalysis] = useState(null);

  // To select from 25, 50, 75th percentile
  const [percentile, setPercentile] = useState("25");

  // Get the Analysis for sum, average, maximum, minimum and count
  const analyzeData = () => {
    // Get the current dataset
    const data = datasets[currentDataset];
    // Remove any non-numeric values from the dataset
    const validNumbers = data.filter(
      (item) => typeof item === "number" && !isNaN(item)
    );
    // Check if there are no valid data
    if (validNumbers.length === 0) {
      setAnalysis({ error: "No valid numbers found in the data" });
      return;
    }
    // Calculate the sum
    const sum = validNumbers.reduce((total, num) => total + num, 0);
    // Calculate the average
    const average = sum / validNumbers.length;
    // Get the maximum Value
    const maximum = Math.max(...validNumbers);
    // Get the minimum Value
    const minimum = Math.min(...validNumbers);
    // Get the count of valid data
    const count = validNumbers.length;

    setAnalysis({
      sum,
      average: average.toFixed(2),
      maximum,
      minimum,
      count,
    });
  };

  // Get Advanced analysis for Standard Deviation, Percentile (25th, 50th, 75th), values below and above the average
  const getAdvancedAnalysis = () => {
    // Get the current dataset
    const data = datasets[currentDataset];
    // Remove any non-numeric values from the dataset
    const validNumbers = data.filter(
      (item) => typeof item === "number" && !isNaN(item)
    );

    // Get the mean
    const average =
      validNumbers.reduce((total, num) => total + num, 0) / validNumbers.length;
    // Square the differences between each valuea and the mean
    const squaredDiff = validNumbers.map((num) => Math.pow(num - average, 2));
    // Get the variance
    const variance =
      squaredDiff.reduce((a, b) => a + b, 0) / validNumbers.length;
    // Get the standard deviation
    const stdDev = Math.sqrt(variance);

    // Sort the valid numbers
    const sorted = [...validNumbers].sort((a, b) => a - b);
    console.log(sorted);
    // Convert the percentile to its respective index
    const index = (parseInt(percentile) / 100) * (sorted.length - 1);
    let percentileValue = 0;
    // Check if it is a valid integer
    if (Number.isInteger(index)) {
      percentileValue = sorted[index];
    } else {
      // Get the valid integer
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      percentileValue =
        sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
    }
    // Filter the numbers above the average
    const numAboveAvg = validNumbers
      .filter((num) => num > average)
      .sort((a, b) => a - b);
    // Filter the numbers below the average
    const numBelowAvg = validNumbers
      .filter((num) => num < average)
      .sort((a, b) => a - b);

    setAdvancedAnalysis({
      stdDev,
      percentileValue,
      numAboveAvg,
      numBelowAvg,
    });
  };
  // Function to reset the analysis
  const resetAnalysis = () => {
    setAnalysis(null);
    setAdvancedAnalysis(null);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle> Data Analysis </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <label className="block text-sm font-medium mb-2">
            Choose Dataset:
          </label>
          <select
            value={currentDataset}
            onChange={(e) => setCurrentDataset(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="temperatures">Temperature</option>
            <option value="testScores">Test Scores</option>
            <option value="salesFigures">Sales Figures</option>
          </select>
        </div>
        <div>
          <strong>Data:</strong> {datasets[currentDataset].join(", ")}
        </div>
        <Button onClick={analyzeData}> Analyze the Data </Button>
        {analysis && (
          <div>
            {analysis.error ? (
              <div className="p-3 bg-red-50 text-red-800 rounded">
                {analysis.error}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                <div>
                  <strong>Count:</strong> {analysis.count}{" "}
                </div>
                <div>
                  <strong>Sum:</strong> {analysis.sum}{" "}
                </div>
                <div>
                  <strong>Average:</strong> {analysis.average}{" "}
                </div>
                <div>
                  <strong>Maximum:</strong> {analysis.maximum}{" "}
                </div>
                <div>
                  <strong>Minimum:</strong> {analysis.minimum}
                </div>
              </div>
            )}
            <Button onClick={getAdvancedAnalysis}>Get Advanced Analysis</Button>
            {advancedAnalysis && (
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3">Advanced Statistics</h4>
                  <strong>Standard Deviation:</strong>
                  {advancedAnalysis.stdDev}
                </div>
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Select Percentile:
                    </label>
                    <select
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={percentile}
                      onChange={(e) => {
                        setPercentile(e.target.value);
                        getAdvancedAnalysis();
                      }}
                    >
                      <option value="25">25th Percentile (Q1)</option>
                      <option value="50">50th Percentile (Median/Q2)</option>
                      <option value="75">75th Percentile (Q3)</option>
                      <option value="90">90th Percentile</option>
                      <option value="95">95th Percentile</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <strong>{percentile}th Percentile:</strong>
                      <span className="text-lg font-mono">
                        {advancedAnalysis.percentileValue}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded">
                    <strong>Above Average ({analysis?.average}):</strong>
                    <p className="text-sm mt-1 font-mono">
                      {advancedAnalysis.numAboveAvg.join(", ")}
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 rounded">
                    <strong>Below Average ({analysis?.average}):</strong>
                    <p className="text-sm mt-1 font-mono">
                      {advancedAnalysis.numBelowAvg.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <Button onClick={resetAnalysis}>Reset</Button>
      </CardContent>
    </Card>
  );
};

export default DataAnalyzer;
