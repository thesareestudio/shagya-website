# Master Implementation Checklist

## Phase 1: Foundation Fields

[↑ Phase Overview](./01-phase-foundation-fields.md)

### 1.1 Collection creation

- [x] Create `src/collections/Products.ts` with slug, admin, timestamps
- [x] Add name field (text, required)
- [x] Add slug field (text, unique, indexed, admin.readOnly)
- [x] Add description field (richText, Lexical)
- [x] Add status field (select: draft/published/archived, default=draft)

### 1.2 Slug generation

- [x] Add beforeChange hook to auto-generate slug from name
- [x] Slug logic: lowercase, spaces→dashes, special chars removed, trimmed

### 1.3 Registration

- [x] Register Products in `src/payload.config.ts` collections array

---

## Phase 2: Saree-Specific Selects

[↑ Phase Overview](./02-phase-saree-selects.md)

### 2.1 Fabric field

- [x] Add fabric select field (required)
- [x] Options: silk, cotton, linen, georgette, chiffon, crepe, velvet, net, blend

### 2.2 Weave field

- [x] Add weave select field (required)
- [x] Options: banarasi, kanchipuram, bandhani, patola, kalamkari, ikkat, paithani, maheshwari, chanderi, tant, baluchari

### 2.3 Pattern field

- [x] Add pattern select field (required)
- [x] Options: solid, printed, embroidered, embellished, painted

---

## Phase 3: Detail Fields

[↑ Phase Overview](./03-phase-detail-fields.md)

### 3.1 Numeric field

- [x] Add length field (number, min=1, max=9, step=0.1, admin.suffix='meters')

### 3.2 Text detail fields

- [x] Add blouseType text field
- [x] Add palluDetails text field
- [x] Add borderType text field
- [x] Add weavePattern text field

### 3.3 Occasion field

- [x] Add occasion text field (placeholder for CLO-23 relationship)

---

## Phase 4: Testing & Verification

[↑ Phase Overview](./04-phase-testing-verification.md)

### 4.1 Collection structure

- [x] Test: collection slug is 'products'
- [x] Test: useAsTitle is 'name'
- [x] Test: admin group is 'Products'

### 4.2 Field existence

- [x] Test: all 12 fields present with correct types

### 4.3 Select fields

- [x] Test: fabric has 9 options
- [x] Test: weave has 11 options
- [x] Test: pattern has 5 options
- [x] Test: status has 3 options (draft, published, archived)

### 4.4 Slug generation

- [x] Test: generates lowercase slug from name
- [x] Test: replaces spaces with dashes
- [x] Test: removes special characters

### 4.5 Length validation

- [x] Test: min value is 1
- [x] Test: max value is 9
- [x] Test: step is 0.1

### 4.6 Full suite

- [x] `make test` — all tests pass
- [x] `make typecheck` — no type errors
- [x] `make lint` — no lint errors
