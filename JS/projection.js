function projection(prot, obj, proj = {}) {
  for (let key in prot) {
    if (Object.hasOwnProperty.call(prot, key)) {
      // as we can have property names like 'hasOwnProperty'
      const protValue = prot[key];
      const objValue = obj[key];

      if (
        typeof protValue === "object" &&
        protValue !== null &&
        !Array.isArray(protValue)
      ) {
        proj[key] = projection(protValue, objValue, proj[key] || {});
      } else if (Array.isArray(protValue)) {
        if (Array.isArray(objValue)) {
          proj[key] = objValue.map((item, index) => {
            if (typeof protValue[0] === "object" && protValue[0] !== null) {
              return projection(protValue[0], item, {});
            } else {
              return item;
            }
          });
        } else {
          proj[key] = [];
        }
      } else {
        proj[key] = objValue !== undefined ? objValue : undefined;
      }
    }
  }
  return proj;
}

const prot = {
  prop1: {
    prop1: null,
    prop2: {
      prop1: null,
    },
  },
  prop2: { prop1: null },
  prop3: {
    prop1: [
      {
        prop1: {
          prop2: null,
        },
      },
    ],
    prop2: null,
  },
};

const obj = {
  prop1: {
    prop1: "value",
    prop2: {
      prop1: "value",
      prop2: "value",
    },
  },
  prop2: { prop2: "value" },
  prop3: {
    prop1: [
      {
        prop1: {
          prop2: 1,
          prop3: 2,
        },
      },
    ],
    prop2: "value",
  },
};

const result = projection(prot, obj);
console.log(JSON.stringify(result, null, 2));
