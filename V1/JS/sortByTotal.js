function getOrderedSales(inputArray, decreasing) {
  return inputArray
    .map((item) => ({
      ...item,
      Total: item.amount * item.quantity,
    }))
    .sort((a, b) => (decreasing ? b.Total - a.Total : a.Total - b.Total));
}

const sales = [
  { amount: 10000, quantity: 10 },
  { amount: 20000, quantity: 2 },
  { amount: 5000, quantity: 20 },
];

const orderedSales = getOrderedSales(sales);
const orderedSalesInc = getOrderedSales(sales, (decreasing = false));

console.log("Ordered decresing:", orderedSales);
console.log("Ordered increasing:", orderedSalesInc);
console.log("Original:", sales);
