const setCorelationId = (req, res, next) => {
  const key = "x-co-relation-id";
  const coRelationId = req.headers[key] || Date.now().toString();
  req.headers[key] = coRelationId;
  res.set(key, coRelationId);
  next();
};

module.exports = setCorelationId;
