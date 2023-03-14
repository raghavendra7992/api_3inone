const Product=require("../models/productModel.js");

function getMonth(month) {
    month = month.toLowerCase();
    if (month === "january") return "01";
    else if (month === "february") return "02";
    else if (month === "march") return "03";
    else if (month === "april") return "04";
    else if (month === "may") return "05";
    else if (month === "june") return "06";
    else if (month === "july") return "07";
    else if (month === "august") return "08";
    else if (month === "september") return "09";
    else if (month === "october") return "10";
    else if (month === "november") return "11";
    else if (month === "december") return "12";
    return month;
  }
  exports.getSales = (req, res) => {
    const month = req.params.month;
    Product.find({ monthOfSale: getMonth(month) })
      .then((data) => {
        let totalSaleAmount = 0,
          totalNumberOfSoldItems = 0,
          totalNumberOfNotSoldItems = 0;
        for (let x = 0; x < data.length; x++) {
          if (data[x].sold) {
            totalNumberOfSoldItems += 1;
            totalSaleAmount += data[x].price;
          } else totalNumberOfNotSoldItems += 1;
        }
        res.status(200).json({
          totalSaleAmount: totalSaleAmount,
          totalNumberOfSoldItems: totalNumberOfSoldItems,
          totalNumberOfNotSoldItems: totalNumberOfNotSoldItems,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: err,
        });
      });
  };
  
  exports.getBar = (req, res) => {
    const month = req.params.month;
    Product.find({ monthOfSale: getMonth(month) })
      .then((data) => {
        let itemsInPriceRange = {
          "0-100": 0,
          "101-200": 0,
          "201-300": 0,
          "301-400": 0,
          "401-500": 0,
          "501-600": 0,
          "601-700": 0,
          "701-800": 0,
          "801-900": 0,
          "901-above": 0,
        };
  
        for (let x = 0; x < data.length; x++) {
          const price = data[x].price;
          if (0 <= price && price <= 100) itemsInPriceRange["0-100"]++;
          else if (101 <= price && price <= 200) itemsInPriceRange["101-200"]++;
          else if (201 <= price && price <= 300) itemsInPriceRange["201-300"]++;
          else if (301 <= price && price <= 400) itemsInPriceRange["301-400"]++;
          else if (401 <= price && price <= 500) itemsInPriceRange["401-500"]++;
          else if (501 <= price && price <= 600) itemsInPriceRange["501-600"]++;
          else if (601 <= price && price <= 700) itemsInPriceRange["601-700"]++;
          else if (701 <= price && price <= 800) itemsInPriceRange["701-800"]++;
          else if (801 <= price && price <= 900) itemsInPriceRange["801-900"]++;
          else itemsInPriceRange["901-above"]++;
        }
        res.status(200).json({
          itemsInPriceRange: itemsInPriceRange,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: err,
        });
      });
  };
  
  exports.getPie = (req, res, next) => {
    const month = req.params.month;
    Product.find({ monthOfSale: getMonth(month) })
      .then((data) => {
        let categories = {};
        for (let x = 0; x < data.length; x++) {
          const category = data[x].category;
          if (categories.hasOwnProperty(category)) {
            categories[category]++;
          } else {
            categories[category] = 1;
          }
        }
        res.status(200).json({
          categories: categories,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: err,
        });
      });
  };



  exports.combineData = (req, res, next) => {
    const month = req.params.month;
   Product.find({ monthOfSale: getMonth(month) })
      .then((data) => {
        let totalSaleAmount = 0,
          totalNumberOfSoldItems = 0,
          totalNumberOfNotSoldItems = 0;
        for (let x = 0; x < data.length; x++) {
          if (data[x].sold) {
            totalNumberOfSoldItems += 1;
            totalSaleAmount += data[x].price;
          } else totalNumberOfNotSoldItems += 1;
        }
      




     Product.find({ monthOfSale: getMonth(month) })
      .then((data) => {
        let itemsInPriceRange = {
          "0-100": 0,
          "101-200": 0,
          "201-300": 0,
          "301-400": 0,
          "401-500": 0,
          "501-600": 0,
          "601-700": 0,
          "701-800": 0,
          "801-900": 0,
          "901-above": 0,
        };
  
        for (let x = 0; x < data.length; x++) {
          const price = data[x].price;
          if (0 <= price && price <= 100) itemsInPriceRange["0-100"]++;
          else if (101 <= price && price <= 200) itemsInPriceRange["101-200"]++;
          else if (201 <= price && price <= 300) itemsInPriceRange["201-300"]++;
          else if (301 <= price && price <= 400) itemsInPriceRange["301-400"]++;
          else if (401 <= price && price <= 500) itemsInPriceRange["401-500"]++;
          else if (501 <= price && price <= 600) itemsInPriceRange["501-600"]++;
          else if (601 <= price && price <= 700) itemsInPriceRange["601-700"]++;
          else if (701 <= price && price <= 800) itemsInPriceRange["701-800"]++;
          else if (801 <= price && price <= 900) itemsInPriceRange["801-900"]++;
          else itemsInPriceRange["901-above"]++;
        }
      
     Product.find({ monthOfSale: getMonth(month) })
      .then((data) => {
        let categories = {};
        for (let x = 0; x < data.length; x++) {
          const category = data[x].category;
          if (categories.hasOwnProperty(category)) {
            categories[category]++;
          } else {
            categories[category] = 1;
          }
        }
        res.status(200).json({
          totalSaleAmount: totalSaleAmount,
          totalNumberOfSoldItems: totalNumberOfSoldItems,
          totalNumberOfNotSoldItems: totalNumberOfNotSoldItems,
          itemsInPriceRange: itemsInPriceRange,
          categories: categories,
        });
      })
    })
})

      
  }