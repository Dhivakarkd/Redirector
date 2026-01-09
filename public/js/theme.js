// Night Mode Logic
const modeToggleBtn = document.getElementById('modeToggleBtn');
const htmlElement = document.documentElement;

function toggleNightMode() {
  htmlElement.classList.toggle('dark');
  const isDark = htmlElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateButtonText();
}

function updateButtonText() {
   if (modeToggleBtn) {
       if (htmlElement.classList.contains('dark')) {
        modeToggleBtn.textContent = 'Day Mode';
      } else {
        modeToggleBtn.textContent = 'Night Mode';
      }
   }
}

// Initialize theme
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  htmlElement.classList.add('dark');
} else {
  htmlElement.classList.remove('dark');
}

// Update button text on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateButtonText);
} else {
    updateButtonText();
}
