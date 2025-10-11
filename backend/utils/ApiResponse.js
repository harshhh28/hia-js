export default class ApiResponse {
  static success(res, data, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({ status: "success", message, data });
  }

  static error(res, message = "Error", statusCode = 400) {
    return res.status(statusCode).json({ status: "error", message });
  }

  static notFound(res, message = "Not Found") {
    return res.status(404).json({ status: "error", message });
  }

  static serverError(res, message = "Internal Server Error") {
    return res.status(500).json({ status: "error", message });
  }

  static custom(res, status, message, data = null, statusCode = 200) {
    return res
      .status(statusCode)
      .json({ status, message, ...(data && { data }) });
  }
}
