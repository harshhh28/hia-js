let pdfParserFn = null;

async function getPdfParser() {
  if (pdfParserFn) return pdfParserFn;

  // Prefer pdf-parse-new (pure JS, maintained fork)
  try {
    const mod = await import("pdf-parse-new");
    pdfParserFn = mod?.default ?? mod;
    if (typeof pdfParserFn === "function") return pdfParserFn;
  } catch (_e) {
    // ignore and fallback
  }

  // Fallback to pdf-parse if present
  const mod = await import("pdf-parse");
  pdfParserFn = mod?.default ?? mod;
  return pdfParserFn;
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
    try {
      const parsePdf = await getPdfParser();
      if (typeof parsePdf !== "function") {
        throw new Error("PDF parser is not available");
      }

      const result = await parsePdf(buffer);

      // Clean and format the extracted text
      let extractedText = (result?.text ?? "").toString();

      // Remove excessive whitespace but preserve structure
      extractedText = extractedText
        .replace(/\s+/g, " ")
        .replace(/\n\s*\n/g, "\n")
        .trim();

      // Validate that we extracted meaningful content
      if (extractedText.length < 50) {
        throw new Error(
          "PDF contains insufficient extractable text (it may be a scanned image). Please upload a text-based medical report PDF."
        );
      }

      return {
        text: extractedText,
        pages: result?.numpages ?? result?.numPages ?? null,
        info: result?.info ?? null,
      };
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      console.error("Error details:", error.message);
      throw new Error(`Failed to process PDF: ${error.message}`);
    }
  }

  static async validateMedicalContent(text) {
    // NOTE: Keep this list focused on medical/lab terms to reduce false positives.
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

    // Additional heuristics to reduce false positives
    const hasUnits =
      /\b(mg\/dl|g\/dl|mmol\/l|iu\/l|iu\/ml|ng\/ml|pg\/ml|cells\/cumm|\/hpf)\b/i.test(
        text
      );
    const hasReferenceRange = /reference\s*range|normal\s*range/i.test(text);
    const hasPatientContext = /\b(patient|age|sex|gender|mrn|uhid)\b/i.test(text);
    const hasManyNumbers = (text.match(/\d+(\.\d+)?/g) ?? []).length >= 10;

    const score =
      foundKeywords.length +
      (hasUnits ? 2 : 0) +
      (hasReferenceRange ? 2 : 0) +
      (hasPatientContext ? 1 : 0) +
      (hasManyNumbers ? 2 : 0);

    // Pass criteria: enough medical keywords OR strong lab-report structure
    const isValid = foundKeywords.length >= 2 || score >= 6;

    return {
      isValid,
      foundKeywords: foundKeywords,
      confidence: Math.min(
        (score / (medicalKeywords.length + 7)) * 100,
        100
      ),
      reason: isValid
        ? null
        : "Document does not appear to be a medical report (not enough lab/medical indicators found).",
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
