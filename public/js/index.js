document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.book-section');

    sections.forEach(section => {
      const id = section.dataset.id;
      const grid = document.getElementById(`${id}-grid`);
      const cards = grid.querySelectorAll('.book-card');
      const prevBtn = document.getElementById(`${id}-prev`);
      const nextBtn = document.getElementById(`${id}-next`);

      let pageSize = 5;

      if (window.innerWidth <= 540) pageSize = 1;
      else if (window.innerWidth <= 800) pageSize = 2;
      else if (window.innerWidth <= 1040) pageSize = 3;
      else if (window.innerWidth <= 1200) pageSize = 4;
      else pageSize = 5;

      let currentPage = 0;
      const totalPages = Math.ceil(cards.length / pageSize);

      const updateDisplay = () => {
        cards.forEach((card, index) => {
          card.style.display = (index >= currentPage * pageSize && index < (currentPage + 1) * pageSize) ? 'block' : 'none';
        });
      };

      prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
          currentPage--;
          updateDisplay();
        }
      });

      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
          currentPage++;
          updateDisplay();
        }
      });

      updateDisplay();
    });
});

$(window).resize(function() {
  updateDisplay();
});