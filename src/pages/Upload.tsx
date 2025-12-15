import { useState, useCallback } from 'react';
import { Upload as UploadIcon, FileSpreadsheet, Check, AlertCircle, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PreviewData {
  headers: string[];
  rows: string[][];
}

const sampleCSVData: PreviewData = {
  headers: ['Name', 'Roll No', 'Class', 'Attendance', 'Avg Marks', 'Assignment Completion', 'Behavior Score'],
  rows: [
    ['Rahul Verma', 'CS2024011', '10-A', '88', '72', '85', '7'],
    ['Neha Sharma', 'CS2024012', '10-A', '75', '65', '70', '6'],
    ['Aditya Kumar', 'CS2024013', '10-B', '92', '88', '95', '9'],
    ['Pooja Singh', 'CS2024014', '10-B', '60', '45', '50', '5'],
    ['Karan Patel', 'CS2024015', '10-A', '85', '78', '82', '8'],
  ],
};

const dbFields = [
  'name',
  'rollNo',
  'class',
  'attendance',
  'avgMarks',
  'assignmentCompletion',
  'behaviorScore',
];

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      // Simulate parsing - in real app, parse actual CSV
      setPreviewData(sampleCSVData);
      // Auto-map fields with matching names
      const autoMapping: Record<string, string> = {};
      sampleCSVData.headers.forEach((header) => {
        const matchingField = dbFields.find(
          (field) => field.toLowerCase() === header.toLowerCase().replace(/\s/g, '')
        );
        if (matchingField) {
          autoMapping[header] = matchingField;
        }
      });
      setFieldMapping(autoMapping);
      toast.success('File loaded successfully!');
    } else {
      toast.error('Please upload a valid CSV file');
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          toast.success('Data uploaded and predictions generated!');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const resetUpload = () => {
    setFile(null);
    setPreviewData(null);
    setFieldMapping({});
    setUploadProgress(0);
    setUploadComplete(false);
  };

  return (
    <Layout title="Upload Data" subtitle="Upload student data via CSV file">
      {!previewData ? (
        <div
          className={cn(
            'stat-card border-2 border-dashed transition-all duration-300 cursor-pointer',
            isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <UploadIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Drop your CSV file here</h3>
            <p className="text-muted-foreground mb-6">or click to browse</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Supported format: CSV</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Info */}
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">{file?.name || 'sample_students.csv'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {previewData.rows.length} records found
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={resetUpload}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Field Mapping */}
          <div className="stat-card">
            <h3 className="text-lg font-semibold mb-4">Map CSV Columns to Database Fields</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {previewData.headers.map((header) => (
                <div key={header} className="flex items-center gap-3">
                  <span className="text-sm font-medium min-w-[120px]">{header}</span>
                  <span className="text-muted-foreground">→</span>
                  <Select
                    value={fieldMapping[header] || ''}
                    onValueChange={(value) =>
                      setFieldMapping((prev) => ({ ...prev, [header]: value }))
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {dbFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Table */}
          <div className="stat-card">
            <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {previewData.headers.map((header) => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.rows.slice(0, 5).map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {previewData.rows.length > 5 && (
              <p className="text-sm text-muted-foreground mt-4">
                Showing first 5 of {previewData.rows.length} records
              </p>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="stat-card">
              <h3 className="text-lg font-semibold mb-4">Uploading & Processing...</h3>
              <Progress value={uploadProgress} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
            </div>
          )}

          {/* Success Message */}
          {uploadComplete && (
            <div className="stat-card border-success/50 bg-success/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-success">Upload Complete!</h3>
                  <p className="text-muted-foreground">
                    {previewData.rows.length} students added. Risk predictions generated.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleUpload}
              disabled={isUploading || uploadComplete}
              className="bg-primary hover:bg-primary/90"
            >
              {uploadComplete ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Uploaded
                </>
              ) : (
                <>
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Upload & Generate Predictions
                </>
              )}
            </Button>
            <Button variant="outline" onClick={resetUpload}>
              Upload Different File
            </Button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="stat-card mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          CSV Format Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Required Columns</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Name (student full name)</li>
              <li>• Roll No (unique identifier)</li>
              <li>• Class (e.g., 10-A)</li>
              <li>• Attendance (0-100%)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Optional Columns</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Avg Marks (0-100%)</li>
              <li>• Assignment Completion (0-100%)</li>
              <li>• Behavior Score (0-10)</li>
              <li>• Email (contact)</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
