function getOrderedSales(inputArray) {
  return inputArray
    .map((item) => ({
      ...item,
      Total: item.amount * item.quantity,
    }))
    .sort((a, b) => b.Total - a.Total);
}

const sales = [
  { amount: 10000, quantity: 10 },
  { amount: 5000, quantity: 20 },
  { amount: 20000, quantity: 2 },
];

const orderedSales = getOrderedSales(sales);

console.log("Ordered:", orderedSales);
console.log("Original:", sales);
