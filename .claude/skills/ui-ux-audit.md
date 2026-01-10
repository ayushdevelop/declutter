# UI/UX Comprehensive Audit

Performs a thorough audit of UI components for mental wellness applications, covering therapeutic UX, accessibility, animations, component library compliance, microcopy, and mobile-first design.

## What This Skill Does

This skill audits UI components across **6 critical dimensions**:

1. **Mental Wellness UX** - Ensures supportive, therapeutic design
2. **Accessibility (WCAG AA)** - Validates inclusive design
3. **Animation Performance** - Checks Motion/Framer Motion optimization
4. **Component Library Compliance** - Enforces design system usage
5. **Therapeutic Copy** - Reviews all user-facing text for warmth
6. **Mobile-First Layout** - Validates responsive design and touch targets

## When to Use

- After implementing new UI components
- Before submitting PRs with user-facing changes
- During design system migrations
- When adding animations or transitions
- After receiving UX/accessibility feedback

## Usage

```bash
/ui-ux-audit <component-path>
```

**Examples:**
```bash
/ui-ux-audit components/journal/entry-form.tsx
/ui-ux-audit components/journal/
/ui-ux-audit app/journal/page.tsx
```

## What Gets Audited

### 1. Mental Wellness UX Principles

**Checks:**
- ✅ Interface feels supportive vs clinical
- ✅ Language creates emotional safety
- ✅ No pressure-inducing copy ("You must", "Start now")
- ✅ Past data is read-only (prevents rumination)
- ✅ Error states are gentle, not punitive
- ✅ Empty states are encouraging

**Example Issues:**
```tsx
// ❌ Clinical and directive
<h2>Entry for {date}</h2>
<p>Past entries are read-only. Select today's date to create a new entry.</p>

// ✅ Warm and inviting
<h2>Take a moment to reflect</h2>
<p>Past moments live here just as they were. Return to today when you're ready to write.</p>
```

---

### 2. Accessibility Compliance (WCAG AA)

**Checks:**
- ✅ Semantic HTML (`<article>`, `<header>`, `<main>`, `<aside>`, `<section>`)
- ✅ ARIA labels and roles (`aria-label`, `aria-labelledby`, `role="radio"`)
- ✅ Live regions for dynamic content (`aria-live="polite"`, `role="status"`)
- ✅ Focus indicators visible
- ✅ Keyboard navigation support
- ✅ Color contrast ratios (4.5:1 minimum)
- ✅ Form field error announcements
- ✅ datetime attributes on `<time>` elements

**Example Issues:**
```tsx
// ❌ Missing ARIA and semantic HTML
<div>
  <div>Journal Entry</div>
  <div>{content}</div>
</div>

// ✅ Proper semantics and ARIA
<article aria-label="Journal entry from 3:45 PM">
  <header>
    <time dateTime="2026-01-10T15:45:00.000Z">3:45 PM</time>
  </header>
  <p>{content}</p>
</article>
```

```tsx
// ❌ Missing live region for errors
{errors.mood && <p>{errors.mood.message}</p>}

// ✅ Screen reader announces errors
{errors.mood && (
  <p role="alert" aria-live="polite">
    <AlertCircle aria-hidden="true" />
    {errors.mood.message}
  </p>
)}
```

---

### 3. Animation Performance

**Checks:**
- ✅ Variant objects defined outside components
- ✅ AnimatePresence used for exit animations
- ✅ GPU-accelerated properties (transform, opacity, scale)
- ✅ No layout thrashing (avoid animating width/height)
- ✅ Reasonable animation durations (200-600ms)
- ✅ Appropriate easing curves

**Example Issues:**
```tsx
// ❌ Variants recreated on every render
function MyComponent() {
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return <motion.div variants={variants}>...</motion.div>
}

// ✅ Variants defined outside component
const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function MyComponent() {
  return <motion.div variants={variants}>...</motion.div>
}
```

```tsx
// ❌ Missing AnimatePresence for exit
{showToast && <motion.div initial={{ opacity: 0 }}>Toast</motion.div>}

// ✅ Proper exit animation
<AnimatePresence>
  {showToast && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Toast
    </motion.div>
  )}
</AnimatePresence>
```

---

### 4. Component Library Compliance

**Checks:**
- ✅ Using design system components (Button vs `<button>`)
- ✅ Proper variant usage (not custom styling)
- ✅ Correct pattern (render prop vs asChild)
- ✅ No raw HTML when library component exists
- ✅ Consistent component imports

**Example Issues:**
```tsx
// ❌ Raw HTML button
<button className="px-4 py-2 bg-blue-500">Click me</button>

// ✅ Design system Button component
<Button variant="primary" size="md">Click me</Button>
```

```tsx
// ❌ Using asChild on component without support
<Card asChild>
  <article>Content</article>
</Card>

// ✅ Using cardVariants directly
<article className={cn(cardVariants({ variant: "elevated" }))}>
  Content
</article>
```

---

### 5. Therapeutic Copy Review

**Checks:**
- ✅ No directive language ("You must", "You should", "You need to")
- ✅ Warm, inviting placeholders
- ✅ Supportive error messages
- ✅ Encouraging empty states
- ✅ Non-stigmatizing labels (e.g., "Frustrated" not "Angry")
- ✅ Gentle confirmation messages

**Example Issues:**
```tsx
// ❌ Clinical and directive
placeholder="Write your thoughts, feelings, or reflections here..."
error: "Entry must be at least 10 characters"
button: "Save Entry"
loading: "Saving..."

// ✅ Warm and supportive
placeholder="How are you really feeling right now?"
error: "Just a few more words to capture this moment"
button: "Done"
loading: "Holding onto this..."
```

```tsx
// ❌ Stigmatizing mood label
{ value: "Angry", label: "Angry", color: "text-red-600" }

// ✅ Gentler alternative
{ value: "Angry", label: "Frustrated", color: "text-rose-600" }
```

---

### 6. Mobile-First Layout

**Checks:**
- ✅ Touch targets minimum 44px × 44px
- ✅ Responsive breakpoints (sm, md, lg)
- ✅ Proper CSS order for mobile priority
- ✅ Sticky positioning works on mobile
- ✅ Text readable without zoom
- ✅ Grid/flex layouts adapt properly

**Example Issues:**
```tsx
// ❌ Touch target too small
<button className="h-8 px-2">Icon</button>

// ✅ Minimum 44px for touch
<button className="min-h-[44px] px-4">Icon</button>
```

```tsx
// ❌ Desktop-first layout order
<div className="grid grid-cols-12">
  <aside className="col-span-3">Calendar</aside>
  <main className="col-span-5">Form</main>
  <section className="col-span-4">Entries</section>
</div>

// ✅ Mobile-first with order utility
<div className="grid grid-cols-1 lg:grid-cols-12">
  <main className="order-1 lg:order-2 lg:col-span-5">Form</main>
  <aside className="order-2 lg:order-1 lg:col-span-3">Calendar</aside>
  <section className="order-3 lg:col-span-4">Entries</section>
</div>
```

---

## Output Format

The audit will provide:

### Summary
- ✅ Passes / ❌ Issues found for each dimension
- Overall score

### Detailed Findings

For each issue:
```
[Category] [Severity: High/Medium/Low]
Location: file.tsx:line

Issue: Description of what's wrong

Current:
<code snippet>

Recommended:
<fixed code snippet>

Why: Explanation of the impact
```

### Priority Recommendations

1. **High Priority** - Accessibility blockers, clinical language
2. **Medium Priority** - Performance issues, missing variants
3. **Low Priority** - Polish opportunities, minor improvements

---

## Configuration

You can customize the audit focus by adding flags:

```bash
/ui-ux-audit components/form.tsx --focus=a11y
/ui-ux-audit components/ --focus=copy,wellness
/ui-ux-audit app/page.tsx --skip=animations
```

**Available flags:**
- `--focus=wellness,a11y,animations,library,copy,mobile` - Audit specific dimensions only
- `--skip=<dimensions>` - Skip certain checks
- `--strict` - Enforce stricter rules (e.g., require prefers-reduced-motion)
- `--output=json` - Machine-readable output

---

## Integration

This skill works best when:
- Run as a pre-commit hook
- Part of CI/CD pipeline
- Before design reviews
- During component development

---

## Examples from Our Journal Feature

### Entry Form Audit Results

**Mental Wellness UX: ✅ PASS**
- Warm header: "Take a moment to reflect"
- Supportive read-only message with Leaf icon
- Gentle placeholder: "How are you really feeling right now?"

**Accessibility: ✅ PASS**
- role="alert" on error messages
- aria-live="polite" on character counter
- aria-describedby linking textarea to counter
- Proper semantic HTML throughout

**Animations: ✅ PASS**
- Variants moved outside component (itemVariants)
- AnimatePresence used for toast
- GPU-accelerated properties (opacity, y)

**Component Library: ✅ PASS**
- Uses Button component (not raw button)
- Uses Card component
- Uses Controller for custom MoodSelector

**Therapeutic Copy: ✅ PASS**
- Button text: "Done" not "Save Entry"
- Loading: "Holding onto this..." not "Saving..."
- Error: "Just a few more words..." not "Must be 10 characters"

**Mobile-First: ✅ PASS**
- Mood selector: min-h-[44px] for touch targets
- Responsive grid: grid-cols-2 sm:grid-cols-4
- No fixed heights that break mobile

---

## Tips

1. **Run early and often** - Catch issues before they compound
2. **Focus on high-priority items first** - Accessibility and wellness blockers
3. **Review copy with stakeholders** - Therapeutic language is subjective
4. **Test with real users** - Automated checks can't replace user testing
5. **Iterate** - UX improvements are ongoing, not one-time

---

## Related Skills

- `/form-timezone-check` - Deep dive on form validation and timezone handling
- `/convex-optimizer` - Backend query optimization
