# CLO-23: Create Tags, Brands, Fabric Types, Occasion collections

## Overview

Four flat taxonomy collections with identical structure: name, slug (auto-generated), description. Used for product/blog categorization and filtering.

## Collections

| Collection  | Slug         | Admin Group | Use                               |
| ----------- | ------------ | ----------- | --------------------------------- |
| Tags        | tags         | Taxonomy    | Products + Blog                   |
| Brands      | brands       | Taxonomy    | Product brands                    |
| FabricTypes | fabric-types | Taxonomy    | Replace enum with extensible list |
| Occasion    | occasions    | Taxonomy    | Replace text field on Products    |

## Acceptance Criteria

- [ ] All 4 collections with name, slug, description fields
- [ ] Slug auto-generated via beforeChange hook
- [ ] Registered in payload.config.ts
- [ ] Unit tests for each collection
