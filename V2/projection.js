// Edge cases:
//  There was not clarified that prototype is a JSON object
//  Cyclic structures
//  Non-plain objects
//  JS Symbol
//  Non-enumerable properties

// JSON object - https://www.rfc-editor.org/rfc/rfc8259

function projection(prot, obj) {
  const visitedObjs = new WeakSet();

  function _projection(prot, obj, proj = {}) {
    if (visitedObjs.has(prot)) {
      return proj;
    }

    visitedObjs.add(prot);

    for (let key in prot) {
      if (Object.hasOwn(prot, key)) {
        const protValue = prot[key];
        const srcValue = obj[key];

        const isNativeObject = (value) =>
          typeof value === "object" && value !== null && !Array.isArray(value);

        const isObjProtValue = isNativeObject(protValue);
        const isObjsrcValue = isNativeObject(srcValue);

        if (isObjProtValue && isObjsrcValue) {
          proj[key] = _projection(protValue, srcValue, srcValue);
        } else if (isObjProtValue && !isObjsrcValue) {
          delete proj[key];
        } else if (Object.hasOwn(obj, key)) {
          proj[key] = srcValue;
        }
      }
    }

    visitedObjs.delete(prot);
    return proj;
  }

  return _projection(prot, obj);
}

// Case 1
// const src = {
//   prop22: undefined, //prop22
//   prop33: {
//     prop331: 1, //prop33.prop331
//     prop332: 2, //prop33.prop332
//   },
//   prop11: {
//     prop111: "value", //prop11.prop111
//     prop112: {
//       prop112: null, //prop11.prop112.prop112
//     },
//   },
// };

// const prot = {
//   prop33: {}, //prop33
//   prop22: 2, //prop22
//   prop11: {
//     prop22: null, //prop11.prop22
//     prop111: {
//       prop111: null, //prop11.prop111.prop111
//     },
//     prop112: null, //prop11.prop112
//   },
// };

// const answer = {
//   prop11: {
//     prop112: {
//       prop112: null, //prop11.prop112.prop112
//     },
//   },
//   prop33: {
//     prop331: 1,
//     prop332: 2,
//   },
//   prop22: undefined, //prop22
// };

//Case 2
// const src = {
//   myOne: 1,
//   newOne: 123,
// };

// const prot = [1, 2, 3];
// prot.myOne = null;

// Case 3
// const src = {
//   prop22: undefined, //prop22
//   prop33: {
//     prop331: 1, //prop33.prop331
//     prop332: 2, //prop33.prop332
//   },
//   prop11: {
//     prop111: "value", //prop11.prop111
//     prop112: {
//       prop112: null, //prop11.prop112.prop112
//     },
//   },
// };

// const prot = {
//   prop33: [], //prop33
//   prop22: 2, //prop22
//   prop11: {
//     prop22: null, //prop11.prop22
//     prop111: {
//       prop111: null, //prop11.prop111.prop111
//     },
//     prop112: null, //prop11.prop112
//   },
// };

// const answer = {
//   prop11: {
//     prop112: {
//       prop112: null, //prop11.prop112.prop112
//     },
//   },
//   prop33: {
//     prop331: 1,
//     prop332: 2,
//   },
//   prop22: undefined, //prop22
// };

//Case 4:
const prot = {
  a: { b: 1 },
  c: {
    d: 2,
    e: {
      f: 3,
    },
  },
};

prot.c.refToC = prot.c;

const src = {
  a: { b: 42 },
  c: {
    d: 100,
    e: 10,
  },
};

const answer = {
  a: { b: 42 },
  c: {
    d: 100,
  },
};

const result = projection(prot, src);

console.log("Result: ", result);

//Testing;
var _ = require("lodash"); //bad practice for prod as require is a blocking operation
console.log("Correct: ", _.isEqual(result, answer));
