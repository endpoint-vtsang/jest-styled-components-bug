## Problem

In v7.1.1, Jest-styled-components replaced `css` dependency to `@adobe/css-tools`. There is a bug in `@adobe/css-tools` where its
parses chained selectors incorrectly. Chained selectors with psuedo-states are parsed incorrectly.

For example

```
export const StyledButton = styled('button')`
  color: white;
  padding: 40px;
  background: black;

  &[data-focus-visible-added]:not(:disabled),
  &:focus-visible:not(:disabled) {
    background: red;
    box-shadow: green;
  }
`;

```

Before the update, `css` would parse the rule as two selectors

```
    {
        type: 'rule',
        selectors: [
          '.fNulUe[data-focus-visible-added]:not(:disabled)',
          '.fNulUe:focus-visible:not(:disabled)'
        ],
        declarations: [ [Object], [Object] ],
        position: { start: [Object], end: [Object], source: '' }
    },
```
After the update, `@adobe/css-tools` would parse the rule as one selector

```
    {
        type: 'rule',
        selectors: [
            '.fNulUe[data-focus-visible-added]:not(:disabled),.fNulUe:focus-visible:not(:disabled)'
        ],
        declarations: [ [Object], [Object] ],
        position: { start: [Object], end: [Object], source: '' }
    },
```

This would result in an error where it can't find the selector with `toHaveStyleRule()`

```
   No style rules found on passed Component using options:
    {"modifier":"&:focus-visible:not(:disabled)"}

      18 |
      19 |     await expect(myButton).toHaveFocus();
    > 20 |     await expect(myButton).toHaveStyleRule("box-shadow", "green", {
         |                            ^
      21 |       modifier: "&:focus-visible:not(:disabled)",
      22 |     });
      23 |   });

```

## How to debug

In `node_modules/jest-styled-components/src/toHaveStyleRule.js` , add a console.log in `getRules()`


```
const getRules = (ast, classNames, options) => {
  const rules = (hasAtRule(options) ? getAtRules(ast, options) : ast.stylesheet.rules).map((rule) => ({
    ...rule,
    selectors: Array.isArray(rule.selectors) ? rule.selectors.map(normalizeQuotations) : rule.selectors,
  }));
  console.log(rules)
  return rules.filter((rule) => rule.type === 'rule' && hasClassNames(classNames, rule.selectors, options));
};
```