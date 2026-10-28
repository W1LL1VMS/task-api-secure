export function errorHandler(err, req, res, next) {
  console.error(err);

  // En production, on ne renvoie jamais la stack trace ni les détails techniques
  const isDev = process.env.NODE_ENV === "development";

  res.status(err.status || 500).json({
    error: "Une erreur est survenue",
    ...(isDev && { details: err.message, stack: err.stack }),
  });
}