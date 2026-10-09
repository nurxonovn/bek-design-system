/**
 * Universal clipboard utility with fallback support
 * Works around Clipboard API permission issues
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first (only in secure contexts)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Silently fall through to fallback method
      // Don't log error as it's expected in some environments
    }
  }
  
  // Fallback method using textarea and execCommand
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    
    // Make textarea invisible but functional
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    textarea.setAttribute('readonly', '');
    
    document.body.appendChild(textarea);
    
    // Select the text
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      // iOS support
      const range = document.createRange();
      range.selectNodeContents(textarea);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      textarea.setSelectionRange(0, 999999);
    } else {
      textarea.select();
    }
    
    // Try to copy
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    return successful;
  } catch (err) {
    // Only log if both methods fail
    console.error('All clipboard methods failed:', err);
    return false;
  }
}

/**
 * Copy text with toast notification
 */
export async function copyWithToast(
  text: string, 
  toast: any, 
  successMessage: string = 'Copied to clipboard!',
  errorMessage: string = 'Failed to copy'
): Promise<void> {
  const success = await copyToClipboard(text);
  
  if (success) {
    toast.success(successMessage);
  } else {
    toast.error(errorMessage);
  }
}