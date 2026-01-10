# Form & Timezone Safety Checker

Validates form implementations using react-hook-form + Zod and identifies timezone-related bugs in date/time handling.

## What This Skill Does

This skill performs deep analysis of:

1. **Form Best Practices** - react-hook-form + Zod validation patterns
2. **Timezone Safety** - Date/time bugs across timezones (UTC-12 to UTC+14)

## When to Use

- After implementing forms with react-hook-form
- When users report date/time bugs
- Before deploying features with date validation
- During code reviews of form components
- When adding date pickers or calendar features

## Usage

```bash
/form-timezone-check <file-or-directory>
```

**Examples:**
```bash
/form-timezone-check components/journal/entry-form.tsx
/form-timezone-check convex/journal.ts
/form-timezone-check components/forms/
```

---

## Part 1: Form Best Practices Validation

### What Gets Checked

#### 1. useState Overuse (Anti-Pattern with RHF)

**Issue:** Using useState for form fields when react-hook-form should handle all form state.

```tsx
// ❌ Anti-pattern: useState for form fields
function MyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
    </form>
  );
}

// ✅ Correct: react-hook-form manages state
function MyForm() {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      <input {...register("email")} />
    </form>
  );
}
```

**When useState IS acceptable:**
- UI state (modals, tabs, tooltips)
- Component-local state (selectedDate)
- Non-form interactions (showSuccessToast)

---

#### 2. Zod Schema Validation

**Checks:**
- ✅ Schema matches form field names
- ✅ Validation messages are user-friendly
- ✅ Transform functions used correctly
- ✅ Enum validation for select/radio groups
- ✅ Error map for custom messages

```tsx
// ❌ Generic error messages
const schema = z.object({
  mood: z.enum(["Happy", "Sad"]),
  content: z.string().min(10).max(5000),
});

// ✅ Therapeutic error messages
const schema = z.object({
  mood: z.enum(["Happy", "Sad"], {
    errorMap: () => ({ message: "How are you feeling right now?" }),
  }),
  content: z
    .string()
    .min(10, "Just a few more words to capture this moment")
    .max(5000, "You've written so much - consider saving some thoughts for tomorrow")
    .transform((val) => val.trim()),
});
```

---

#### 3. Error Message Accessibility

**Checks:**
- ✅ Error messages use `role="alert"`
- ✅ `aria-live="polite"` for dynamic errors
- ✅ Icons marked `aria-hidden="true"`
- ✅ Form fields have `aria-describedby` linking to errors

```tsx
// ❌ Errors not accessible
{errors.content && (
  <p className="text-red-600">
    <AlertCircle />
    {errors.content.message}
  </p>
)}

// ✅ Screen reader accessible errors
{errors.content && (
  <p role="alert" aria-live="polite" className="text-red-600">
    <AlertCircle aria-hidden="true" />
    {errors.content.message}
  </p>
)}

<textarea
  {...register("content")}
  aria-describedby="content-error"
  aria-invalid={!!errors.content}
/>
```

---

#### 4. Controller Usage for Custom Components

**Checks:**
- ✅ Custom components use Controller, not register
- ✅ field.value and field.onChange properly connected
- ✅ Controlled components don't use defaultValue

```tsx
// ❌ Trying to use register with custom component
<MoodSelector {...register("mood")} />

// ✅ Using Controller for custom components
<Controller
  name="mood"
  control={control}
  render={({ field }) => (
    <MoodSelector
      value={field.value}
      onChange={field.onChange}
    />
  )}
/>
```

---

#### 5. Character Counter Implementation

**Checks:**
- ✅ Uses watch() for real-time updates
- ✅ Has `aria-live="polite"` for screen readers
- ✅ Has unique id linked via `aria-describedby`
- ✅ Shows helpful labels (not just numbers)

```tsx
// ❌ Missing accessibility
const content = watch("content");
const count = content?.length || 0;

<p className="text-xs">{count} / 5000</p>

// ✅ Accessible character counter
const content = watch("content");
const count = content?.length || 0;

<textarea
  {...register("content")}
  aria-describedby="char-count"
/>

<p
  id="char-count"
  aria-live="polite"
  aria-atomic="true"
  className="text-xs"
>
  {count} / 5000 characters
</p>
```

---

#### 6. Form Reset After Submission

**Checks:**
- ✅ Form resets after successful submission
- ✅ Success callback triggers appropriately
- ✅ Loading states managed correctly

```tsx
// ❌ Form not reset after submit
const onSubmit = async (data) => {
  await createEntry(data);
  onSuccess?.();
};

// ✅ Proper reset and success flow
const onSubmit = async (data) => {
  try {
    await createEntry(data);
    reset(); // Reset form fields
    onSuccess?.(); // Trigger success callback
  } catch (error) {
    console.error("Failed:", error);
  }
};
```

---

## Part 2: Timezone Safety Validation

### What Gets Checked

#### 1. Server-Side Date Comparisons

**Issue:** Comparing dates using local time instead of UTC.

```tsx
// ❌ Server using local time (breaks for UTC+ users)
export const createEntry = mutation({
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0]; // UTC-based
    if (args.date > today) {
      throw new Error("Cannot create entries for future dates");
    }
  },
});

// User in UTC+10 tries to journal on 2026-01-10
// Server in UTC sees 2026-01-09
// User's "today" (2026-01-10) > server's "today" (2026-01-09)
// ERROR: Future date!

// ✅ Timezone-tolerant validation
export const createEntry = mutation({
  handler: async (ctx, args) => {
    const now = new Date();
    const utcToday = now.toISOString().split("T")[0];
    const utcTomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Allow dates up to UTC tomorrow (covers all timezones)
    if (args.date > utcTomorrow) {
      throw new Error("Cannot create entries for future dates");
    }
  },
});
```

---

#### 2. ISO 8601 Format Validation

**Checks:**
- ✅ Dates stored as ISO strings (YYYY-MM-DD)
- ✅ Timestamps include timezone (ISO 8601 with Z or offset)
- ✅ No locale-specific date parsing

```tsx
// ❌ Ambiguous date format
const date = "01/10/2026"; // Is this Jan 10 or Oct 1?

// ✅ ISO 8601 format (unambiguous)
const date = "2026-01-10"; // Always January 10, 2026
const timestamp = "2026-01-10T15:45:00.000Z"; // 3:45 PM UTC
```

---

#### 3. Client-Side vs Server-Side Time

**Checks:**
- ✅ Client uses local time for display (`isToday()`)
- ✅ Server uses UTC for storage and validation
- ✅ date-fns functions used correctly

```tsx
// ✅ Client-side: Use local time for UX
import { isToday, format } from "date-fns";

const canEdit = isToday(selectedDate); // Uses browser's timezone

// ✅ Server-side: Use UTC for storage
const timestamp = new Date().toISOString(); // Always UTC
const date = timestamp.split("T")[0]; // YYYY-MM-DD in UTC
```

---

#### 4. Month Boundary Edge Cases

**Checks:**
- ✅ December → January rollover
- ✅ Year increment handled
- ✅ Leap year support

```tsx
// ❌ Month boundary bug
const nextMonth = month + 1; // What if month is 12?
const nextMonthStr = `${year}-${nextMonth}-01`; // "2026-13-01" is invalid!

// ✅ Proper month boundary handling
const nextMonth = month === 12 ? 1 : month + 1;
const nextYear = month === 12 ? year + 1 : year;
const nextMonthStr = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;
```

---

#### 5. datetime Attribute on <time> Elements

**Checks:**
- ✅ `<time>` elements have `datetime` attribute
- ✅ datetime value is ISO 8601 format
- ✅ Displayed time can differ from datetime (localized)

```tsx
// ❌ Missing datetime attribute
<time className="text-xs">{timestamp}</time>

// ✅ Proper datetime with ISO format
const isoDateTime = new Date(entry._creationTime).toISOString();
const displayTime = format(entry._creationTime, "h:mm a"); // "3:45 PM"

<time dateTime={isoDateTime} className="text-xs">
  {displayTime}
</time>
```

---

#### 6. Timezone Edge Cases Testing

**Checks:**
- ✅ Tested with UTC-12 (earliest timezone)
- ✅ Tested with UTC+14 (latest timezone)
- ✅ Tested around midnight boundaries
- ✅ Tested daylight saving transitions

**Test Scenarios:**

```tsx
// Scenario 1: User in UTC+14 (Kiribati)
// Local time: 2026-01-10 23:00
// UTC time: 2026-01-10 09:00
// Should allow journaling for 2026-01-10 ✅

// Scenario 2: User in UTC-12 (Baker Island)
// Local time: 2026-01-10 01:00
// UTC time: 2026-01-10 13:00
// Should allow journaling for 2026-01-10 ✅

// Scenario 3: User in UTC+10 (Sydney)
// Local time: 2026-01-11 00:30 (just past midnight)
// UTC time: 2026-01-10 14:30
// Should allow journaling for 2026-01-11 ✅
```

---

## Output Format

### Form Validation Results

```
✅ PASS: react-hook-form Best Practices
  - No useState for form fields
  - Zod schema properly defined
  - Errors accessible with role="alert"
  - Controller used for MoodSelector

⚠️ WARNING: Character Counter
  Location: components/form.tsx:68

  Issue: watch() triggers React Compiler warning

  Current:
  const content = watch("content");

  Note: This is acceptable - watch() is required for real-time
  character count updates. The warning can be safely ignored.
```

### Timezone Validation Results

```
❌ FAIL: Server-Side Date Validation
  Location: convex/journal.ts:88
  Severity: HIGH

  Issue: Date validation uses strict UTC comparison, blocking
  users in UTC+1 to UTC+14 from journaling on "today"

  Current:
  const today = new Date().toISOString().split("T")[0];
  if (args.date > today) {
    throw new Error("Cannot create entries for future dates");
  }

  Recommended:
  const now = new Date();
  const utcTomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  if (args.date > utcTomorrow) {
    throw new Error("Cannot create entries for future dates");
  }

  Why: Allows all users (UTC-12 to UTC+14) to journal for "today"
  in their local timezone while preventing actual future dates.
```

---

## Integration

Run this skill:
- **Before deployment** - Catch timezone bugs early
- **During code review** - Validate form patterns
- **After user reports** - Debug date/time issues
- **In CI/CD pipeline** - Automated validation

---

## Configuration

```bash
# Focus on forms only
/form-timezone-check components/form.tsx --focus=forms

# Focus on timezone only
/form-timezone-check convex/ --focus=timezone

# Strict mode (warn on all watch() usage)
/form-timezone-check components/ --strict

# Test specific timezone scenario
/form-timezone-check convex/journal.ts --test-timezone=UTC+14
```

---

## Real Example: Our Journal Feature Bug

**Bug Report:**
Users in UTC+10 (Australia) reported: "Can't journal for today, says it's a future date!"

**Root Cause:**
```typescript
// Server validation (running in UTC)
const today = new Date().toISOString().split("T")[0]; // "2026-01-09"

// User's local time: 2026-01-10 08:00 (UTC+10)
// User submits: date = "2026-01-10"

// Server check: "2026-01-10" > "2026-01-09" → ERROR! ❌
```

**Fix:**
```typescript
// Allow tolerance for timezone differences
const now = new Date();
const utcTomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0]; // "2026-01-10"

// User submits: "2026-01-10"
// Server check: "2026-01-10" > "2026-01-10" → false → PASS ✅
```

**Impact:** Fixed journaling for 50+ timezones (UTC-12 to UTC+14)

---

## Tips

1. **Always use ISO 8601** - Eliminates ambiguity
2. **Store in UTC, display in local** - Best practice
3. **Test timezone edge cases** - Don't assume UTC
4. **Use date-fns carefully** - Some functions use local time
5. **Document timezone assumptions** - Help future developers

---

## Related Skills

- `/ui-ux-audit` - Comprehensive UI/UX validation (includes form accessibility)
- `/convex-optimizer` - Backend query optimization
