---
title: Agent Skills
description: Document processing skills available in agent-harness for AI agents
---

# Agent Skills

Skills are specialized capabilities that extend what AI agents can do. They're stored in `agent-harness/skills/` and provide tooling for document processing, data manipulation, and more.

## Available Skills

### DOCX - Word Document Processing

**Purpose**: Create, edit, and analyze Microsoft Word documents (.docx)

**Capabilities**:
- Create new documents with formatting, headers, tables
- Edit existing documents while preserving tracked changes
- Extract text content via pandoc
- Add comments and work with redlines
- Access raw XML for advanced manipulation

**Key workflows**:
- **New document**: Use docx-js (JavaScript) to create from scratch
- **Edit existing**: Use OOXML Python library with unpack/edit/pack cycle
- **Redlining**: Required for legal, academic, business, or government docs

---

### PDF - PDF Manipulation

**Purpose**: Extract, create, merge, split, and fill PDF documents

**Capabilities**:
- Extract text and tables (pdfplumber)
- Create new PDFs (reportlab)
- Merge and split documents (pypdf, qpdf)
- Fill PDF forms (pdf-lib, pypdf)
- OCR scanned documents (pytesseract)
- Add watermarks and password protection

**Key tools**:
| Task | Tool |
|------|------|
| Extract text | `pdfplumber` or `pdftotext` |
| Extract tables | `pdfplumber` → pandas |
| Create PDFs | `reportlab` |
| Merge/split | `pypdf` or `qpdf` |
| Fill forms | See `forms.md` in skill |
| OCR | `pytesseract` + `pdf2image` |

---

### PPTX - PowerPoint Presentations

**Purpose**: Create, edit, and analyze PowerPoint presentations (.pptx)

**Capabilities**:
- Create new presentations from HTML slides
- Edit existing presentations via XML manipulation
- Extract text content via markitdown
- Access speaker notes and layouts
- Generate thumbnail grids for validation

**Key workflows**:
- **New presentation**: Use html2pptx workflow (HTML → PPTX)
- **Edit existing**: Unpack OOXML, edit XML, validate, repack
- **Text extraction**: `python -m markitdown file.pptx`

**Slide dimensions**: 720pt × 405pt for 16:9 aspect ratio

---

### XLSX - Excel Spreadsheets

**Purpose**: Create, edit, and analyze Excel spreadsheets (.xlsx)

**Capabilities**:
- Read and analyze data with pandas
- Create new spreadsheets with formulas and formatting
- Edit existing files while preserving formulas
- Recalculate formulas via LibreOffice
- Data visualization and analysis

**Critical rule**: Always use Excel formulas, never hardcode calculated values.

```python
# ❌ Wrong
sheet['B10'] = df['Sales'].sum()

# ✅ Correct
sheet['B10'] = '=SUM(B2:B9)'
```

**Financial model colors**:
- Blue text: Hardcoded inputs
- Black text: Formulas
- Green text: Links from other sheets
- Yellow background: Key assumptions

---

## Repo Structure

```
agent-harness/skills/
├── docx/
│   ├── SKILL.md          # Main documentation
│   ├── docx-js.md        # Creating new docs
│   ├── ooxml.md          # Editing existing docs
│   ├── ooxml/scripts/    # pack, unpack, validate
│   └── scripts/          # Python document library
├── pdf/
│   ├── SKILL.md          # Main documentation
│   ├── forms.md          # Form filling guide
│   ├── reference.md      # Advanced reference
│   └── scripts/          # PDF utilities
├── pptx/
│   ├── SKILL.md          # Main documentation
│   ├── html2pptx.md      # HTML to PPTX workflow
│   ├── ooxml.md          # OOXML editing
│   └── scripts/          # Conversion utilities
└── xlsx/
    ├── SKILL.md          # Main documentation
    └── recalc.py         # Formula recalculation
```

## MCP Servers

MCP (Model Context Protocol) server configs are stored under `agent-harness/mcp/`. Each server has:
- `README.md` - Purpose, auth, enabling instructions
- `config.json` - Server configuration
- `docs.md` - Detailed documentation

## Adding New Skills

1. Create folder under `skills/<skill-name>/`
2. Add `SKILL.md` with overview and workflows
3. Include any reference docs and scripts
4. Update `AGENTS.md` if workspace footprint changes
