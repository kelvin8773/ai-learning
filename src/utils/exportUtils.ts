/**
 * Export utilities for conversations
 */

import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { ChatHistoryItem } from './database';

export type ExportFormat = 'markdown' | 'pdf' | 'json' | 'txt';

export interface ExportOptions {
  format: ExportFormat;
  includeTimestamp: boolean;
  includeMetadata: boolean;
}

/**
 * Export a single conversation to various formats
 */
export const exportConversation = async (
  conversation: ChatHistoryItem,
  options: ExportOptions
): Promise<void> => {
  const timestamp = new Date(conversation.timestamp).toLocaleString();
  const filename = `conversation-${conversation.timestamp || Date.now()}`;

  switch (options.format) {
    case 'markdown':
      exportToMarkdown(conversation, options, filename);
      break;
    case 'pdf':
      await exportToPDF(conversation, options, filename);
      break;
    case 'json':
      exportToJSON(conversation, options, filename);
      break;
    case 'txt':
      exportToTXT(conversation, options, filename);
      break;
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }
};

/**
 * Export multiple conversations to various formats
 */
export const exportMultipleConversations = async (
  conversations: ChatHistoryItem[],
  options: ExportOptions
): Promise<void> => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `conversations-${timestamp}`;

  switch (options.format) {
    case 'markdown':
      exportMultipleToMarkdown(conversations, options, filename);
      break;
    case 'pdf':
      await exportMultipleToPDF(conversations, options, filename);
      break;
    case 'json':
      exportMultipleToJSON(conversations, options, filename);
      break;
    case 'txt':
      exportMultipleToTXT(conversations, options, filename);
      break;
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }
};

/**
 * Export to Markdown format
 */
const exportToMarkdown = (
  conversation: ChatHistoryItem,
  options: ExportOptions,
  filename: string
): void => {
  let content = '';
  
  if (options.includeTimestamp) {
    content += `# Conversation\n\n`;
    content += `**Date:** ${new Date(conversation.timestamp).toLocaleString()}\n\n`;
  }

  content += `## Question\n\n${conversation.question}\n\n`;
  content += `## Answer\n\n${conversation.answer || 'No answer available'}\n\n`;

  if (options.includeMetadata) {
    content += `---\n\n`;
    content += `**ID:** ${conversation.id}\n`;
    content += `**Timestamp:** ${conversation.timestamp}\n`;
  }

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, `${filename}.md`);
};

/**
 * Export to PDF format
 */
const exportToPDF = async (
  conversation: ChatHistoryItem,
  options: ExportOptions,
  filename: string
): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);

  let yPosition = margin;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Conversation', margin, yPosition);
  yPosition += 10;

  if (options.includeTimestamp) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(conversation.timestamp).toLocaleString()}`, margin, yPosition);
    yPosition += 15;
  }

  // Question
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const questionLines = doc.splitTextToSize(`Question: ${conversation.question}`, maxWidth);
  doc.text(questionLines, margin, yPosition);
  yPosition += questionLines.length * 6 + 10;

  // Answer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const answerText = conversation.answer || 'No answer available';
  const answerLines = doc.splitTextToSize(answerText, maxWidth);
  
  // Check if we need a new page
  if (yPosition + (answerLines.length * 5) > doc.internal.pageSize.getHeight() - margin) {
    doc.addPage();
    yPosition = margin;
  }
  
  doc.text(answerLines, margin, yPosition);

  if (options.includeMetadata) {
    yPosition += answerLines.length * 5 + 15;
    if (yPosition > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.setFontSize(8);
    doc.text(`ID: ${conversation.id}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Timestamp: ${conversation.timestamp}`, margin, yPosition);
  }

  doc.save(`${filename}.pdf`);
};

/**
 * Export to JSON format
 */
const exportToJSON = (
  conversation: ChatHistoryItem,
  options: ExportOptions,
  filename: string
): void => {
  const exportData = {
    ...conversation,
    exportMetadata: {
      exportedAt: new Date().toISOString(),
      format: 'json',
      version: '1.0'
    }
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
    type: 'application/json;charset=utf-8' 
  });
  saveAs(blob, `${filename}.json`);
};

/**
 * Export to TXT format
 */
const exportToTXT = (
  conversation: ChatHistoryItem,
  options: ExportOptions,
  filename: string
): void => {
  let content = '';
  
  if (options.includeTimestamp) {
    content += `Conversation\n`;
    content += `Date: ${new Date(conversation.timestamp).toLocaleString()}\n`;
    content += `${'='.repeat(50)}\n\n`;
  }

  content += `Question:\n${conversation.question}\n\n`;
  content += `Answer:\n${conversation.answer || 'No answer available'}\n\n`;

  if (options.includeMetadata) {
    content += `${'-'.repeat(50)}\n`;
    content += `ID: ${conversation.id}\n`;
    content += `Timestamp: ${conversation.timestamp}\n`;
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${filename}.txt`);
};

/**
 * Export multiple conversations to Markdown
 */
const exportMultipleToMarkdown = (
  conversations: ChatHistoryItem[],
  options: ExportOptions,
  filename: string
): void => {
  let content = `# Chat History Export\n\n`;
  content += `**Total Conversations:** ${conversations.length}\n`;
  content += `**Export Date:** ${new Date().toLocaleString()}\n\n`;

  conversations.forEach((conversation, index) => {
    content += `---\n\n`;
    content += `## Conversation ${index + 1}\n\n`;
    
    if (options.includeTimestamp) {
      content += `**Date:** ${new Date(conversation.timestamp).toLocaleString()}\n\n`;
    }

    content += `### Question\n\n${conversation.question}\n\n`;
    content += `### Answer\n\n${conversation.answer || 'No answer available'}\n\n`;

    if (options.includeMetadata) {
      content += `**ID:** ${conversation.id}\n`;
      content += `**Timestamp:** ${conversation.timestamp}\n\n`;
    }
  });

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, `${filename}.md`);
};

/**
 * Export multiple conversations to PDF
 */
const exportMultipleToPDF = async (
  conversations: ChatHistoryItem[],
  options: ExportOptions,
  filename: string
): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);

  // Title page
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Chat History Export', margin, margin + 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Conversations: ${conversations.length}`, margin, margin + 40);
  doc.text(`Export Date: ${new Date().toLocaleString()}`, margin, margin + 50);
  
  doc.addPage();

  conversations.forEach((conversation, index) => {
    if (index > 0) {
      doc.addPage();
    }

    let yPosition = margin;

    // Conversation header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Conversation ${index + 1}`, margin, yPosition);
    yPosition += 15;

    if (options.includeTimestamp) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${new Date(conversation.timestamp).toLocaleString()}`, margin, yPosition);
      yPosition += 10;
    }

    // Question
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const questionLines = doc.splitTextToSize(`Question: ${conversation.question}`, maxWidth);
    doc.text(questionLines, margin, yPosition);
    yPosition += questionLines.length * 6 + 10;

    // Answer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const answerText = conversation.answer || 'No answer available';
    const answerLines = doc.splitTextToSize(answerText, maxWidth);
    
    // Check if we need a new page
    if (yPosition + (answerLines.length * 5) > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.text(answerLines, margin, yPosition);

    if (options.includeMetadata) {
      yPosition += answerLines.length * 5 + 15;
      if (yPosition > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.setFontSize(8);
      doc.text(`ID: ${conversation.id}`, margin, yPosition);
      yPosition += 5;
      doc.text(`Timestamp: ${conversation.timestamp}`, margin, yPosition);
    }
  });

  doc.save(`${filename}.pdf`);
};

/**
 * Export multiple conversations to JSON
 */
const exportMultipleToJSON = (
  conversations: ChatHistoryItem[],
  options: ExportOptions,
  filename: string
): void => {
  const exportData = {
    conversations,
    exportMetadata: {
      exportedAt: new Date().toISOString(),
      format: 'json',
      version: '1.0',
      totalConversations: conversations.length
    }
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
    type: 'application/json;charset=utf-8' 
  });
  saveAs(blob, `${filename}.json`);
};

/**
 * Export multiple conversations to TXT
 */
const exportMultipleToTXT = (
  conversations: ChatHistoryItem[],
  options: ExportOptions,
  filename: string
): void => {
  let content = `Chat History Export\n`;
  content += `Total Conversations: ${conversations.length}\n`;
  content += `Export Date: ${new Date().toLocaleString()}\n`;
  content += `${'='.repeat(60)}\n\n`;

  conversations.forEach((conversation, index) => {
    content += `Conversation ${index + 1}\n`;
    content += `${'-'.repeat(30)}\n`;
    
    if (options.includeTimestamp) {
      content += `Date: ${new Date(conversation.timestamp).toLocaleString()}\n`;
    }

    content += `Question:\n${conversation.question}\n\n`;
    content += `Answer:\n${conversation.answer || 'No answer available'}\n\n`;

    if (options.includeMetadata) {
      content += `ID: ${conversation.id}\n`;
      content += `Timestamp: ${conversation.timestamp}\n`;
    }
    
    content += `\n${'='.repeat(60)}\n\n`;
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${filename}.txt`);
};
