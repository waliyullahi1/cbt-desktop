<template>
  <article class="mx-auto max-w-3xl px-4 py-8">
    <BlockRenderer
      v-for="(block, index) in blocks"
      :key="index"
      :block="block"
    />
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import katex from 'katex'
import BlockRenderer from './BlockRenderer.vue'

const props = defineProps({
  lesson: {
    type: Object,
    required: true
  }
})

const blocks = computed(() => buildLessonBlocks(props.lesson))

function buildLessonBlocks(lesson) {
  const blocks = []

  // 0. Lesson metadata
  blocks.push({
    type: 'callout',
    style: 'info',
    title: 'Lesson Information',
    text_html: buildMetadataHtml(lesson)
  })

  // 1. Title
  blocks.push({
    type: 'heading',
    level: 2,
    text: lesson.title
  })

  // 2. Learning objectives
  if (lesson.learningObjectives?.length) {
    blocks.push({
      type: 'heading',
      level: 3,
      text: 'Learning Objectives'
    })
    blocks.push({
      type: 'checklist',
      items: lesson.learningObjectives.map((obj, i) => ({
        key: `objective-${i}`,
        text: obj
      }))
    })
  }

  // 3. Introduction (Markdown + LaTeX)
  if (lesson.introduction) {
    blocks.push({
      type: 'paragraph',
      text_html: renderMarkdownWithMath(lesson.introduction)
    })
  }

  // 4. Overview table (Markdown in cells)
  if (lesson.overviewTable) {
    blocks.push({
      type: 'table',
      headers: lesson.overviewTable.headers.map(h => renderMarkdown(h)),
      rows: lesson.overviewTable.rows.map(row =>
        row.map(cell => renderMarkdown(cell))
      ),
      caption: renderMarkdown(lesson.overviewTable.title || '')
    })
  }

  // 5. Concepts
  lesson.concepts?.forEach((concept) => {
    blocks.push({
      type: 'heading',
      level: 3,
      text: concept.title
    })

    if (concept.explanation) {
      blocks.push({
        type: 'paragraph',
        text_html: renderMarkdownWithMath(concept.explanation)
      })
    }

    if (concept.formula) {
      blocks.push({
        type: 'formula',
        latex: stripLatexDelimiters(concept.formula),
        display: true
      })
    }

    if (concept.table) {
      blocks.push({
        type: 'table',
        headers: concept.table.headers.map(h => renderMarkdown(h)),
        rows: concept.table.rows.map(row =>
          row.map(cell => renderMarkdown(cell))
        ),
        caption: renderMarkdown(concept.table.title || '')
      })
    }

    concept.examples?.forEach((example) => {
      blocks.push({
        type: 'example',
        title: 'Example',
        text_html: renderMarkdownWithMath(example.text_html || example.text || ''),
        math: example.math || null
      })
    })

    if (concept.svg?.svg) {
      blocks.push({
        type: 'svg',
        markup: concept.svg.svg,
        caption: concept.svg.title || concept.svg.description
      })
    }
  })

  // 6. Key formulas
  if (lesson.formulas?.length) {
    blocks.push({
      type: 'heading',
      level: 3,
      text: 'Key Formulas'
    })
    lesson.formulas.forEach((formula) => {
      blocks.push({
        type: 'formula',
        latex: stripLatexDelimiters(formula.formula),
        display: true,
        caption: renderMarkdown(formula.variables || '')
      })
    })
  }

  // 7. Worked examples
  if (lesson.workedExamples?.length) {
    blocks.push({
      type: 'heading',
      level: 3,
      text: 'Worked Examples'
    })

    lesson.workedExamples.forEach((workedExample, index) => {
      blocks.push({
        type: 'question',
        title: `Worked Example ${index + 1}`,
        text_html: renderMarkdownWithMath(workedExample.question)
      })

      if (workedExample.steps?.length) {
        blocks.push({
          type: 'steps',
          title: 'Solution steps',
          items: workedExample.steps.map(step =>
            typeof step === 'string'
              ? renderMarkdownWithMath(step)
              : {
                  ...step,
                  text_html: renderMarkdownWithMath(step.text_html || step.text || ''),
                  text: undefined, // avoid double
                  math: step.math || undefined
                }
          )
        })
      }

      blocks.push({
        type: 'answer',
        title: 'Answer',
        text_html: renderMarkdownWithMath(workedExample.answer)
      })
    })
  }

  // 8. JAMB question patterns
  if (lesson.jambQuestionPatterns?.length) {
    blocks.push({
      type: 'tip',
      title: 'JAMB Question Patterns',
      text_html: renderMarkdownWithMath(lesson.jambQuestionPatterns.join('\n'))
    })
  }

  // 9. JAMB exam techniques
  if (lesson.jambExamTechniques?.length) {
    blocks.push({
      type: 'tip',
      title: 'JAMB Exam Techniques',
      text_html: renderMarkdownWithMath(lesson.jambExamTechniques.join('\n'))
    })
  }

  // 10. Common mistakes
  if (lesson.commonMistakes?.length) {
    blocks.push({
      type: 'heading',
      level: 3,
      text: 'Common Mistakes'
    })
    lesson.commonMistakes.forEach((mistake) => {
      blocks.push({
        type: 'warning',
        title: mistake.mistake,
        text_html: renderMarkdownWithMath(
          `${mistake.explanation} Correction: ${mistake.correction}`
        )
      })
    })
  }

  // 11. Exam shortcuts
  if (lesson.examShortcuts?.length) {
    blocks.push({
      type: 'heading',
      level: 3,
      text: 'Exam Shortcuts'
    })
    lesson.examShortcuts.forEach((shortcut) => {
      blocks.push({
        type: 'tip',
        title: shortcut.method,
        text_html: renderMarkdownWithMath(`Example: ${shortcut.example}`)
      })
    })
  }

  // 12. Quiz
  if (lesson.quiz) {
    blocks.push({
      type: 'quiz',
      questions: lesson.quiz.questions
    })
  }

  // 13. Quick revision
  if (lesson.quickRevision) {
    blocks.push({
      type: 'heading',
      level: 3,
      text: 'Quick Revision'
    })

    if (lesson.quickRevision.keyDefinitions?.length) {
      blocks.push({
        type: 'heading',
        level: 4,
        text: 'Key Definitions'
      })
      blocks.push({
        type: 'list',
        ordered: false,
        items: lesson.quickRevision.keyDefinitions.map(def =>
          renderMarkdownWithMath(def)
        )
      })
    }

    if (lesson.quickRevision.importantFormulas?.length) {
      blocks.push({
        type: 'heading',
        level: 4,
        text: 'Important Formulas'
      })
      lesson.quickRevision.importantFormulas.forEach((formula) => {
        blocks.push({
          type: 'formula',
          latex: stripLatexDelimiters(formula),
          display: true
        })
      })
    }

    if (lesson.quickRevision.commonTraps?.length) {
      blocks.push({
        type: 'warning',
        title: 'Common Traps',
        text_html: renderMarkdownWithMath(lesson.quickRevision.commonTraps.join('\n'))
      })
    }
  }

  // 14. Final summary
  if (lesson.finalSummary) {
    blocks.push({
      type: 'note',
      title: 'Quick Summary',
      text_html: renderMarkdownWithMath(lesson.finalSummary)
    })
  }

  return blocks
}

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

function buildMetadataHtml(lesson) {
  const parts = []
  if (lesson.topic) parts.push(`<strong>Topic:</strong> ${lesson.topic}`)
  if (lesson.subtopic) parts.push(`<strong>Subtopic:</strong> ${lesson.subtopic}`)
  if (lesson.difficulty) parts.push(`<strong>Difficulty:</strong> ${lesson.difficulty}`)
  if (lesson.estimatedMinutes) parts.push(`<strong>Estimated time:</strong> ${lesson.estimatedMinutes} min`)
  if (lesson.prerequisites?.length) parts.push(`<strong>Prerequisites:</strong> ${lesson.prerequisites.join(', ')}`)
  if (lesson.syllabusReference) parts.push(`<strong>Syllabus:</strong> ${lesson.syllabusReference}`)
  return parts.join('<br>')
}

function stripLatexDelimiters(latex) {
  if (!latex) return ''
  return latex.replace(/^\\\[|\\\]$/g, '').trim()
}

/**
 * Converts Markdown (with optional LaTeX) to HTML.
 * - First replaces display math \[ ... \] and inline math \( ... \)
 * - Then runs the result through marked
 */
function renderMarkdownWithMath(markdown = '') {
  let html = markdown || ''

  // Display math: \[ ... \]
  html = html.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, latex) =>
      katex.renderToString(latex.trim(), {
        displayMode: true,
        throwOnError: false
      })
  )

  // Inline math: \( ... \)
  html = html.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, latex) =>
      katex.renderToString(latex.trim(), {
        displayMode: false,
        throwOnError: false
      })
  )

  // Convert Markdown to HTML
  return marked.parse(html, { breaks: true })
}

/**
 * Simple Markdown to HTML (no LaTeX) for table cells, captions, etc.
 */
function renderMarkdown(markdown = '') {
  return marked.parse(markdown, { breaks: true })
}
</script>