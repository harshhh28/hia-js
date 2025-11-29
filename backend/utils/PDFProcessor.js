import { DOMMatrix } from "@napi-rs/canvas";

// Polyfill DOMMatrix if not present (needed for pdfjs-dist in Node environment)
global.DOMMatrix = global.DOMMatrix || DOMMatrix;

let PDFParseClass = null;

async function getPdfParseClass() {
  if (!PDFParseClass) {
    const module = await import("pdf-parse");
    PDFParseClass = module.PDFParse;
  }
  return PDFParseClass;
}

export class PDFProcessor {
  // Helper method to verify PDF buffer before processing
  static verifyPDFBuffer(buffer) {
    try {
      if (!buffer || buffer.length === 0) {
        throw new Error("Buffer is empty");
      }

      // Read first few bytes to check PDF header
      const header = buffer.slice(0, 10).toString("ascii");

      if (!header.startsWith("%PDF-")) {
        throw new Error("File does not appear to be a valid PDF");
      }

      return true;
    } catch (error) {
      console.error("❌ PDF buffer verification failed:", error.message);
      throw error;
    }
  }

  static async extractTextFromBuffer(buffer) {
    let parser = null;
    try {
      // Get pdf-parse class
      const PDFParse = await getPdfParseClass();

      // Initialize parser with buffer
      parser = new PDFParse({ data: buffer });

      // Extract text
      const textResult = await parser.getText();

      // Get document info
      const infoResult = await parser.getInfo();

      // Clean and format the extracted text
      let extractedText = textResult.text;

      // Remove excessive whitespace but preserve structure
      extractedText = extractedText
        .replace(/\s+/g, " ")
        .replace(/\n\s*\n/g, "\n")
        .trim();

      // Validate that we extracted meaningful content
      if (extractedText.length < 50) {
        throw new Error(
          "PDF appears to be empty or contains insufficient text"
        );
      }

      return {
        text: extractedText,
        pages: textResult.total,
        info: infoResult.info,
      };
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      console.error("Error details:", error.message);
      throw new Error(`Failed to process PDF: ${error.message}`);
    } finally {
      if (parser) {
        await parser.destroy();
      }
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

  static async processMedicalReport(buffer) {
    try {
      // First verify the PDF buffer
      this.verifyPDFBuffer(buffer);

      // Extract text from PDF buffer
      const extractionResult = await this.extractTextFromBuffer(buffer);

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
}
