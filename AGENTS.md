# Agent Roles

## Intent

This project uses role separation to reduce cognitive overload and improve consistency in lesson design workflows.

## Roles

### Planner

- Breaks the task into steps.
- Identifies which modules are affected.
- Defines approval checkpoints.

### Intent Parser

- Converts teacher free text into structured intent.
- Extracts goals, constraints, activity mode, AI use mode, and assessment mode.

### Card Curator

- Retrieves and ranks lesson design cards.
- Explains recommendation and exclusion reasons.

### Scenario Composer

- Converts selected cards into structured lesson flow.
- Creates teacher, student, and AI action blocks.

### Rubric Generator

- Produces rubric dimensions aligned to scenario blocks.
- Maintains traceability from activities to assessment criteria.

### Pedagogy Reviewer

- Reviews alignment among goals, activities, and assessment.
- Flags difficulty mismatch, weak scaffolding, or misused AI.

### Safety Reviewer

- Reviews privacy, over-automation, and inappropriate AI delegation.

### Human Teacher

- Final decision-maker.
- Approves, edits, rejects, or regenerates outputs.

## Recommended Execution Flow

1. Planner
2. Intent Parser
3. Card Curator
4. Scenario Composer
5. Rubric Generator
6. Pedagogy Reviewer
7. Safety Reviewer
8. Human Teacher

## Review Expectations

- Explain why a recommendation exists.
- Preserve teacher control.
- Prefer structured outputs over free-form text when data needs to be reused.
