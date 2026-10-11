# Foundations — 1.11 Optical rules · 1.12 Forms · 1.13 Interaction states

Figma 📘 doc frame'laridan olingan asos qoidalar (ingliz tilida, asl matn). Har komponentni yozishda shu qoidalarga tayaning:

- **1.11** — matn ↔ qattiq chekka orasida +4 px kompensatsiya; bitta chap vertikal; ikonka birinchi qator balandligida markazlanadi.
- **1.12** — forma fieldset'lardan tuziladi; label — maydon ichida (Filled); validatsiya blur'da; tugma hech qachon disabled bo'lmaydi.
- **1.13** — hover/pressed/focus/disabled/selected tokenlari va ularning qatlam tartibi.

## 1.11 Optical rules

```text
1.11 Optical rules
When equal in numbers is not equal to the eye. Compensation, the left vertical and icon alignment — the rules every other spacing rule builds on.
Compensation
A text box carries empty space above and below the letters; a button, field, card or photo does not. Where text meets a flat edge, add 4 px (scale/4).
Text → text · 16
Two text boxes: both carry their own leading, so 16 reads as 16.
Section title
BEK sells the design system as a monthly subscription for designers and teams.
Text → button · 16
Same number, but only one side has leading. The button looks glued to the text.
BEK sells the design system as a monthly subscription for designers and teams.
Content
Text → button · 16 + 4
Add scale/4. Now the gap reads the same as text → text.
BEK sells the design system as a monthly subscription for designers and teams.
16 + 4
Content
Compensate between text and anything with a hard edge: Button, Text field, Chip, Card, Image, Divider.
Do not compensate text → text, or flat edge → flat edge (card → card, button → button).
The tables in 1.3 “Text → control” already include the 4 px — do not add it twice.
Left vertical
Keep one clean left edge per column. Fewer steps on the left reads as order.
Web · hang bullets and icons
What you get
Every component in three sizes, one token set, and documentation for designers and developers.
Figma library with 90+ components
React package with the same tokens
Weekly updates and a changelog
Free for students
Cancel any time
Content
Mobile · two verticals
What you get
Every component in three sizes, one token set, and documentation.
Figma library
React package
Weekly updates
Content
Web: bullets and icons hang outside the text edge, so headings, paragraphs and list text share one vertical.
Mobile and Tablet: the page margin (16 / 24) is too small to hang anything. Use two verticals — one for plain text, one for the text of icon and bullet rows.
Inside a bordered or filled block (Card, Alert, Banner) never hang — keep everything inside the surface.
Keep the left edge; adjust the right padding so neighbouring text blocks do not touch. Never pull photos in a row off their right edge.
Icon alignment
An icon sits in a box as tall as the first line of its text. Centre it in that box — never against the whole paragraph.
Single line · centre
Delivery in 2 days
Body/S + icon/sm 16 · gap 4
Delivery in 2 days
Body/M + icon/md 20 · gap 6
Delivery in 2 days
Title/L + icon/lg 24 · gap 8
Multi-line · first line box
The order is packed and leaves the warehouse today. You will get a message when the courier is on the way.
Wrapper height = the text style’s line-height (Body/M → 24). The icon is centred inside it, so it lines up with the first line however many lines follow.
Icon size and gap follow the text style — the full table is in 1.2 Typography → Text + icon.
Icons with a pointed bottom (pin, chevron-down) may sit 1 px lower to look centred.
In code: a flex row with align-items: flex-start, and the icon in a box of height = line-height.
Never place an icon inside the text layer (inline glyph) — it does not scale with Dynamic Type.
Do / Don’t
Pay in four parts with no interest.
Content
Text → button with compensation: 16 + 4.
Don’t
Pay in four parts with no interest.
Content
Same 16 as between paragraphs — the button looks stuck to the text.
The order leaves the warehouse today. We will message you when the courier is on the way.
Icon lines up with the first line.
Don’t
The order leaves the warehouse today. We will message you when the courier is on the way.
Icon centred on the whole paragraph floats between lines.
What you get
Everything in one library.
Components
Tokens
Web: one vertical, bullets hang.
Don’t
What you get
Everything in one library.
• Components
• Tokens
Three left edges — a staircase.
Tokens
No new tokens — the rules use existing scale and layout roles.
Token
Value
Use for
CSS
scale/4
Compensation, text ↔ flat edge
--bek-scale-4
layout/page-margin
16 · 24 · 32
First vertical on Mobile · Tablet · Web
--bek-layout-page-margin
icon/sm · md · lg
16 · 20 · 24
Icon next to text — see 1.2
--bek-icon-sm · -md · -lg
_doc/gap · _doc/grid
Redlines in documentation only, never in product
```

## 1.12 Forms

```text
1.12 Forms
Forms are built from fieldsets, not loose fields. Layout, width, spacing, validation and where the buttons go — one standard for every BEK product.

Anatomy — five parts. A fieldset is a field (or a group of controls) with its label and its helper or error text.
1 · Form title — what the form is for, in plain words. Headline/S. Skip it inside a Modal that already has a title.
2 · Section title — splits a long form into meaning groups. Title/M. Not needed for forms under ~6 fields.
3 · Fieldset — field — Text field / Select with its label and supporting text. Label is inside the field (BEK Filled). Never use the placeholder as the label.
4 · Fieldset — group — Chips, Checkbox or Radio under one Label/M. One error message for the whole group.
5 · Actions — primary first (left), secondary as Flat. Never disabled — see Validation.

Layouts — Vertical is the default. Horizontal and Inline are for specific places.
Vertical · default — fields stacked, full column width. All devices; the only layout on Mobile.
Horizontal · Web — label on the left (160–200 px, about 3 columns). Saves height in settings and long admin forms. Web only.
Inline · filters — fieldsets in one row above results — filters and search. No supporting text; errors go to a single line below the row.

Width — a fieldset snaps to columns; the field inside follows the expected content.
Web default: 4 of 12 columns. Wider only when the content is long (address, comment). Short, fixed-length content gets a short field — phone, date, PIN, card expiry.
Tablet: 4 of 8 columns or full width. Mobile: always full width.
The fieldset must snap to columns; fields inside a complex fieldset (from–to, day–month–year) may be any width.

Spacing — only scale/* tokens. The field's label and supporting text are inside the component — you only space fieldsets.
Between                                   Mobile · Tablet   Web
Form title → first section                24 · scale/24     32 · scale/32
Section title → first fieldset            16 · scale/16     16 · scale/16
Fieldset → fieldset                       16 · scale/16     20 · scale/20
Last fieldset → next section title        32 · scale/32     40 · scale/40
Last fieldset → actions                   24 · scale/24     24 · scale/24
Button → button (actions row)             12 · scale/12     12 · scale/12
Fields inside one complex fieldset        8 · scale/8       12 · scale/12

Validation — validate on submit by default. Validate on blur only where a submit check is not possible.
On submit · default: 1 Press submit — every invalid field turns to State = Error at once. 2 The page scrolls to the first error: 12 px under the app bar (Mobile) or 24 px from the window top (Web). 3 Focus moves into that field; the keyboard opens on Mobile. 4 Each error clears as soon as its value becomes valid — not on the next submit.
On blur · exception: use when the value can be checked alone and early feedback saves a step — promo codes, usernames, card numbers. Check only after the user leaves a field that has a value — never while typing, never on an empty field. The field stays red until the value is valid. Do not pull focus back into the field.
Complex fieldset · one message: fields that are checked together share one error line under the whole group.

Error messages — say what to do, not what went wrong. A form-level error sits at the top of the form (5.4 Alert, Danger; stays until the next submit) — never in a Toast.
Don't: "Invalid input" · "Required field" · "Wrong date" · "Error 500".
Do: "Enter a phone number like +998 90 123 45 67" · "Enter your full name" · "The date must be today or later" · "We couldn't save the form. Try again in a minute — nothing you typed is lost."

Actions — Mobile: full width, under the fields. Web: left edge of the fields; primary first, secondary as Flat after it. Buttons line up with the left edge of the fields, not the right edge of the page.
Short form (one field + one action: subscribe, promo code, search): the button sits beside the field.
Submit is never disabled — BEK standard. Keep the submit button enabled at all times. On press, run validation and show what is missing. A disabled button gives no reason, cannot be focused, and leaves the user guessing.

Long forms — more than ~3 sections: show progress beside the form (Web: sticky panel on the right; Mobile: compact counter under the top bar "2 of 4"). Very long flows split into steps with a Stepper (Steps component arrives in P2).

Do / Don't
Do: button stays enabled; pressing it shows exactly what is missing. Don't: disabled submit — no reason, no focus, the user is stuck guessing.
Do: error under the field it belongs to, saying how to fix it. Don't: a Toast "Invalid data" — gone in 4 s, not linked to any field.
Do: the label names the field; the placeholder shows the format. Don't: instruction only as a placeholder — it vanishes on the first keystroke.
Do: actions on the left edge of the fields, primary first. Don't: primary pushed to the far right.

Tokens — no form-specific tokens.
scale/16 · scale/20 — Fieldset → fieldset (Mobile·Tablet · Web) — --bek-scale-16 · -20
scale/24 — Last fieldset → actions; form title → section (Mobile) — --bek-scale-24
scale/32 · scale/40 — Between form sections — --bek-scale-32 · -40
text/danger · border/danger — Error text and field outline (inside Text field / Select) — --bek-text-danger
layout/grid/columns — 4 · 8 · 12 — Fieldset width snaps to columns — --bek-layout-grid-columns
```

## 1.13 Interaction states

```text
1.13 Interaction states
One rule for every interactive component: how Default, Hover, Pressed, Focus, Disabled and Loading look, and which token each state uses.
State sequence
Every interactive component moves through the same six states. Selected is the Pressed / on value.
Default
Content
At rest.
Hover
Content
Pointer over it. Web only.
Pressed
Content
Being pressed, or on.
Focus
Content
Keyboard focus. 1.6.
Disabled
Content
Not available now.
Loading
Content
Working. Size stays the same.
Step rule
Hover moves one palette step, Pressed two. The step always moves away from the text colour, so contrast only goes up.
Light
Role
Default
Hover
Pressed
Accent
accent/default
accent/hover
accent/active
Danger
status/danger/default
status/danger/hover
status/danger/active
Success
status/success/default
status/success/hover
status/success/active
Info
status/info/default
status/info/hover
status/info/active
Warning ↑ lighter
status/warning/default
status/warning/hover
status/warning/active
Accent soft
accent/soft
accent/soft-hover
accent/default
Neutral soft
fill/soft
fill/soft-hover
fill/soft-pressed
Dark
Role
Default
Hover
Pressed
Accent
accent/default
accent/hover
accent/active
Danger
status/danger/default
status/danger/hover
status/danger/active
Success
status/success/default
status/success/hover
status/success/active
Info
status/info/default
status/info/hover
status/info/active
Warning ↑ lighter
status/warning/default
status/warning/hover
status/warning/active
Accent soft
accent/soft
accent/soft-hover
accent/default
Neutral soft
fill/soft
fill/soft-hover
fill/soft-pressed
Role
Default
Hover · +1
Pressed · +2
Why
accent
indigo 550 · 550
600 · 500
650 · 450
White text — step darker in Light
status/danger
red 650 · 450
700 · 400
750 · 350
White text
status/success
green 800 · 350
850 · 300
900 · 250
White text — new in 1.13
status/info
blue 650 · 450
700 · 400
750 · 350
White text — new in 1.13
status/utility
purple 600 · 450
650 · 400
700 · 350
White text — new in 1.13
status/warning
orange 550 · 550
500 · 600
450 · 650
Dark text — step goes lighter. New in 1.13
*/soft
100 · 150
50 · 100
→ */default
Tinted text on top — step away from text. New in 1.13
fill/soft
gray-α 100
150
200
Neutral surfaces: chips, list rows
Hover area
The hover fill takes the shape of the thing it belongs to. Touching an edge means no radius on that side.
Card
Card title
Short description text
Body text. A card can hold a description, statistics or any other content.
Keeps its own radius (radius/surface/md). Elevated cards lift with Elevation/2 instead of changing colour.
List row — edge to edge
Title
Supporting description text
Title
Supporting description text
Title
Supporting description text
Row runs to the container edge, so radius 0. The container clips.
Menu item — inset
Edit
Duplicate
Archive
Inset from the panel edge, so it gets radius/control/md (8).
Icon button
Always a circle (radius/full), whatever the icon.
Hover can reveal, never hide
Extra actions may appear on hover, but nothing a user needs can live only behind hover.
On Web, secondary actions (favourite, edit, delete) may appear on hover over a card or a table row.
On touch there is no hover: the same actions are always visible, or sit in a ⋯ menu / swipe action.
Hover never changes layout — revealed actions overlay the content or take space that was already reserved.
Rule of thumb
If you delete the hover state, can the user still do everything? If not, the action needs a visible home.
Touch, pointer and keyboard
Which states each input method actually produces.
Input
Hover
Pressed
Focus
Mouse / trackpad — Web
Yes
Yes
Only after keyboard use (:focus-visible)
Touch — Mobile, Tablet
No — never design a touch state that needs hover
Yes — show it immediately, under 100 ms
Only with Switch Control / external keyboard
Keyboard — all devices
Space / Enter press
Always — _Focus ring, see 1.6
Touch components
Nav item · Touch and Rail item · Tablet have no Hover value on purpose. Their sequence is Default → Pressed → Selected.
Disabled and Loading
Two ways of saying “not now” — they are not interchangeable.
Disabled
Content
fill/disabled + text/disabled. Not focusable. Explain why nearby if it is not obvious.
Loading
Content
Keeps its size and colour; the Spinner replaces the start icon. Not clickable twice.
Never disable a form’s submit button — keep it enabled and validate on press (see 1.12 Forms).
Disabled controls are exempt from contrast rules, so never put information only in disabled text.
Loading longer than 1 s on a page: use Skeleton (5.7), not a spinner in every control.
States matrix
Real components, every state, both themes. Size M shown; the full matrix lives in each component set.
Light
Component
Default
Hover
Pressed
Focus
Disabled
Button · Normal
Content
Content
Content
Content
Content
Button · Action
Content
Content
Content
Content
Content
Button · Outline-action
Content
Content
Content
Content
Content
Button · Flat-action
Content
Content
Content
Content
Content
Button · Outline-success
Content
Content
Content
Content
Content
Button · Danger
Content
Content
Content
Content
Content
Chip
Label
Label
Label
Label
Label
List item
Title
Supporting description text
Title
Supporting description text
Title
Supporting description text
Title
Supporting description text
Title
Supporting description text
Dark
Component
Default
Hover
Pressed
Focus
Disabled
Button · Normal
Content
Content
Content
Content
Content
Button · Action
Content
Content
Content
Content
Content
Button · Outline-action
Content
Content
Content
Content
Content
Button · Flat-action
Content
Content
Content
Content
Content
Button · Outline-success
Content
Content
Content
Content
Content
Button · Danger
Content
Content
Content
Content
Content
Chip
Label
Label
Label
Label
Label
List item
Title
Supporting description text
Title
Supporting description text
Title
Supporting description text
Title
Supporting description text
Title
Supporting description text
Do /
```
