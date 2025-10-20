import pdfParse from "pdf-parse-new";
import fs from "fs";
import path from "path";

export class PDFProcessor {
  // Helper method to verify PDF file before processing
  static verifyPDFFile(filePath) {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error("File does not exist");
      }

      // Get file stats
      const stats = fs.statSync(filePath);

      // Check file extension
      const ext = path.extname(filePath).toLowerCase();

      if (ext !== ".pdf") {
        throw new Error("File is not a PDF");
      }

      // Read first few bytes to check PDF header
      const buffer = fs.readFileSync(filePath, { start: 0, end: 10 });
      const header = buffer.toString("ascii");

      if (!header.startsWith("%PDF-")) {
        throw new Error("File does not appear to be a valid PDF");
      }

      return true;
    } catch (error) {
      console.error("❌ PDF file verification failed:", error.message);
      throw error;
    }
  }

  static async extractText(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);

      // Parse PDF with options for better text extraction
      const data = await pdfParse(dataBuffer, {
        // Options for better text extraction
        max: 0, // Parse all pages
        version: "v1.10.100", // Use specific version
        normalizeWhitespace: false, // Keep original whitespace
        disableCombineTextItems: false, // Combine text items
      });

      // Clean and format the extracted text
      let extractedText = data.text;

      // Remove excessive whitespace but preserve structure
      extractedText = extractedText
        .replace(/\s+/g, " ")
        .replace(/\n\s*\n/g, "\n")
        .trim();

      // Show some key indicators if this looks like a medical report
      const textLower = extractedText.toLowerCase();
      const medicalIndicators = [
        "patient",
        "doctor",
        "hospital",
        "clinic",
        "medical",
        "diagnosis",
        "treatment",
        "prescription",
        "blood",
        "test",
        "lab",
        "report",
        "symptoms",
        "condition",
        "medicine",
        "dose",
        "mg",
        "ml",
      ];

      const foundIndicators = medicalIndicators.filter((indicator) =>
        textLower.includes(indicator)
      );

      // Validate that we extracted meaningful content
      if (extractedText.length < 50) {
        throw new Error(
          "PDF appears to be empty or contains insufficient text"
        );
      }

      return {
        text: extractedText,
        pages: data.numpages,
        info: data.info,
      };
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      console.error("Error details:", error.message);
      throw new Error(`Failed to process PDF: ${error.message}`);
    }
  }

  static async validateMedicalContent(text) {
    const medicalKeywords = [
      // Blood test terms
      "hemoglobin",
      "hematocrit",
      "rbc",
      "wbc",
      "platelet",
      "mcv",
      "mch",
      "mchc",
      "neutrophil",
      "lymphocyte",
      "monocyte",
      "eosinophil",
      "basophil",

      // Liver function
      "alt",
      "ast",
      "alp",
      "bilirubin",
      "total bilirubin",
      "direct bilirubin",
      "indirect bilirubin",
      "ggt",
      "ldh",
      "albumin",
      "globulin",

      // Kidney function
      "creatinine",
      "bun",
      "urea",
      "egfr",
      "gfr",
      "protein",
      "albumin",

      // Metabolic panel
      "glucose",
      "hba1c",
      "cholesterol",
      "hdl",
      "ldl",
      "triglycerides",
      "sodium",
      "potassium",
      "chloride",
      "co2",
      "calcium",
      "phosphorus",

      // Other common tests
      "tsh",
      "t3",
      "t4",
      "vitamin d",
      "b12",
      "folate",
      "iron",
      "ferritin",
      "crp",
      "esr",
      "psa",
      "cea",
      "ca125",
      "ca19-9",

      // Additional keywords from your report
      "haemogram",
      "cbc",
      "neutrophils",
      "lymphocytes",
      "eosinophils",
      "monocytes",
      "basophills",
      "hct",
      "rdw",
      "cv",
      "smear",
      "normocytic",
      "normochromic",
      "adequate",
      "parasite",
      "mp",
      "jaffe",
      "cmia",
      "hexokinase",
      "g-6-pdh",
      "strip",
      "hpf",
      "pus cells",
      "red blood cells",
      "epithelial cells",
      "casts",
      "crystals",
      "trichomonas",
      "bacteria",
      "budding yeast",
      "urine",
      "r/m",
      "transperancy",
      "sp. gravity",
      "bile salt",
      "bile pigment",
      "ketones",
      "microscopic examination",
      "physical examination",
      "chemical examination",

      // General medical terms
      "normal",
      "abnormal",
      "high",
      "low",
      "elevated",
      "decreased",
      "reference range",
      "units",
      "mg/dl",
      "g/dl",
      "iu/ml",
      "ng/ml",
      "mmol/l",
      "micromol/l",
      "test results",
      "laboratory",
      "pathology",
    ];

    const textLower = text.toLowerCase();
    const foundKeywords = medicalKeywords.filter((keyword) =>
      textLower.includes(keyword.toLowerCase())
    );

    // Require at least 1 medical keyword to be considered a valid medical report (reduced from 3)
    if (foundKeywords.length < 1) {
      throw new Error(
        "Document does not appear to contain sufficient medical content"
      );
    }

    return {
      isValid: true,
      foundKeywords: foundKeywords,
      confidence: Math.min(
        (foundKeywords.length / medicalKeywords.length) * 100,
        100
      ),
    };
  }

  static async processMedicalReport(filePath) {
    try {
      // First verify the PDF file
      this.verifyPDFFile(filePath);

      // Extract text from PDF
      const extractionResult = await this.extractText(filePath);

      // Validate medical content
      const validationResult = await this.validateMedicalContent(
        extractionResult.text
      );

      return {
        text: extractionResult.text,
        pages: extractionResult.pages,
        info: extractionResult.info,
        validation: validationResult,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error processing medical report:", error);
      throw error;
    }
  }

  static cleanupFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("Error cleaning up file:", error);
    }
  }
}
