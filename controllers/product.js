const Product = require("../models/product");
const getProduct = async (req, res) => {
  const { feature, company, name, sort, fields, numericFields } = req.query;
  const queryObj = {};
  if (feature) {
    queryObj.feature = feature === "true" ? true : false;
  }
  if (company) {
    queryObj.company = company;
  }
  if (name) {
    queryObj.name = { $regex: name, $options: "i" };
  }
  if (numericFields) {
    const oparatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
      "=": "$eq",
    };
    const regex = /\b(>|>=|=|<|<=)\b/g;
    let filters = numericFields.replace(
      regex,
      (match) => `-${oparatorMap[match]}-`
    );
    possibleFields = ["price", "rating"];
    filters.split(",").forEach((item) => {
      const [field, oparator, value] = item.split("-");
      if (possibleFields.includes(field)) {
        queryObj[field] = { [oparator]: Number(value) };
      }
    });
  }
  let result = Product.find(queryObj);
  //sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  }
  //fields
  if (fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  const limit = Number(req.query.limit) || 3;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;
  result.skip(skip).limit(limit);
  const products = await result;
  res.status(200).json({ nbHits: products.length, products });
};
const getProductStatic = async (req, res) => {
  const products = await Product.find({}).sort("name -price");
  res.status(200).json({ nbHits: products.length, products });
};

module.exports = { getProduct, getProductStatic };
