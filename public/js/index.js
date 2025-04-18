document.addEventListener('DOMContentLoaded', menu);
window.addEventListener('resize', updateAllDisplays);

let sectionsData = [];

function calculatePageSize(containerWidth) {
  if (containerWidth > 1300) return 5;
  if (containerWidth > 1050) return 4;
  if (containerWidth > 800) return 3;
  if (containerWidth > 550) return 2;
  
  return 1;
}

function menu() {  
  const sections = document.querySelectorAll('.book-section');

  sections.forEach(section => {
    const id = section.dataset.id;
    const grid = document.getElementById(`${id}-grid`);
    const cards = grid.querySelectorAll(`.book-card`);
    const prevBtn = document.getElementById(`${id}-prev`);
    const nextBtn = document.getElementById(`${id}-next`);

    const sectionData = {
      id,
      grid,
      cards,
      prevBtn,
      nextBtn,
      currentPage: 0,
      pageSize: calculatePageSize(grid.offsetWidth),
    };

    const updateDisplay = () => {
      const { currentPage, pageSize, cards } = sectionData;
      cards.forEach((card, index) => {
        card.style.display = (index >= currentPage * pageSize && index < (currentPage + 1) * pageSize) ? 'block' : 'none';
      });
    };

    prevBtn.addEventListener('click', () => {
      if (sectionData.currentPage > 0) {
        sectionData.currentPage--;
        updateDisplay();
      }
    });

    nextBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(sectionData.cards.length / sectionData.pageSize);
      if (sectionData.currentPage < totalPages - 1) {
        sectionData.currentPage++;
        updateDisplay();
      }
    });

    sectionData.updateDisplay = updateDisplay;
    sectionsData.push(sectionData);

    updateDisplay();
    buttonDisplay();
  });
}

function updateAllDisplays() {
  sectionsData.forEach(section => {
    const newPageSize = calculatePageSize(section.grid.offsetWidth);
    if (newPageSize !== section.pageSize) {
      section.pageSize = newPageSize;
      section.currentPage = 0;
      section.updateDisplay();
    }
  });

  buttonDisplay();
}

function buttonDisplay() {
  const header = document.getElementById('nav-header');
  const buttonList = document.querySelectorAll('.hide-button');
  
  if (header.offsetWidth > 900) {
    buttonList.forEach(button => {
      button.classList.remove('hidden');
    });
  }
  else {
    buttonList.forEach(button => {
      button.classList.add('hidden');
    });
  }
}

let isToggling = false;

function headerDisplay() {
  if (isToggling) return;
  isToggling = true;

  const buttonList = document.querySelectorAll('.hide-button');

  buttonList.forEach(button => {
    button.classList.toggle('hidden');
  });
  
  setTimeout(() => {
    isToggling = false;
  }, 100);
}

document.querySelectorAll('.book-card').forEach(card => {
  card.addEventListener('click', () => {
    const bookId = card.getAttribute('data-id');
    window.location.href = `/book/${bookId}`;
  });
});