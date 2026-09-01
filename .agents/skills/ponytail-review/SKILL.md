---
name: ponytail-review
description: "Code review focused exclusively on eliminating over-engineering and boilerplate. Finds what to delete: reinvented standard library, unneeded dependencies, speculative abstractions, and dead flexibility. Outputs one line per finding: location, what to cut, and what replaces it. Use when reviewing code for simplicity, minimalism, and bloat reduction."
license: MIT
---

# Ponytail Review — Hunting Over-Engineering

Review diffs and codebases specifically for **unnecessary complexity, bloated abstractions, and dead code**. The best outcome of a review is making the diff shorter.

---

## 🎯 Output Format

Output **one line per finding**:
`[file]:L[line]: [tag] [what to cut]. [replacement].`

### Tags:
- `delete:` Dead code, unused flexibility, speculative feature. **Replacement:** Nothing.
- `stdlib:` Hand-rolled logic that Python standard library or Web/JS standard already ships. **Replacement:** Name the function.
- `native:` External package or complex code doing what the browser/CSS/PostgreSQL already supports natively. **Replacement:** Name the feature.
- `yagni:` Abstraction with one implementation, config key nobody sets, helper layer with only one caller. **Replacement:** Inline or simplify.
- `shrink:` Same logic, fewer lines. **Replacement:** Show the shorter form.

---

## 🔍 Review Checklist

1. **Reinvented Wheels:** Is there a custom string/date/array helper that Python `math`/`datetime`/`itertools` or JS `Array.prototype` / `URLSearchParams` already does?
2. **Premature Abstraction:** Are there abstract base classes, generic wrappers, or factory patterns where a direct function call suffices?
3. **Redundant Dependencies:** Did someone install a library for something achievable in 3-5 lines of vanilla code?
4. **Scattered Callers:** Is a bug patched in multiple caller sites instead of once at the root source function?
