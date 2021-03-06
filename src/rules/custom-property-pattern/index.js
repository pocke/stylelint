import {
  isCustomProperty,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import {
  isRegExp,
  isString }
from "lodash"

export const ruleName = "custom-property-pattern"

export const messages = ruleMessages(ruleName, {
  expected: "Expected custom property name to match specified pattern",
})

export default function (pattern) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: pattern,
      possible: [ isRegExp, isString ],
    })
    if (!validOptions) { return }

    const regexpPattern = (isString(pattern))
      ? new RegExp(pattern)
      : pattern

    root.walkDecls(decl => {
      const { prop } = decl
      if (!isCustomProperty(prop)) { return }
      if (regexpPattern.test(prop.slice(2))) { return }

      report({
        message: messages.expected,
        node: decl,
        result,
        ruleName,
      })
    })
  }
}
