# CLO-13: Create Product Variants (size, color, blouse)

## Overview

Variants collection: size (XS-6XL/Free), color, blouse size, stock per variant, SKU, price override. Validate: At least one variant per product. Size chart block.

## Acceptance Criteria

- [ ] Variants collection with relationship to Products
- [ ] Size select: XS, S, M, L, XL, 2XL, 3XL, 4XL, 5XL, 6XL, Free
- [ ] Color text field
- [ ] Blouse size text field
- [ ] SKU field (unique identifier per variant)
- [ ] Stock quantity per variant (number)
- [ ] Price override field (optional, overrides product base price)
- [ ] Size chart block (array of blocks for measurements)
- [ ] Registered in payload.config.ts

## Technical Notes

- New file: `src/collections/Variants.ts`
- Relationship to Products via `relationship` field type
- SKU auto-generated or manual
- Size chart uses Payload `blocks` field
